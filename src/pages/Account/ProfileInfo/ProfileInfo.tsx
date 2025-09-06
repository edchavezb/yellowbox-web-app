import { useAppSelector } from 'core/hooks/useAppSelector';
import styles from './ProfileInfo.module.css';
import { Box, FormControl, FormErrorMessage, FormLabel, Input, Text } from '@chakra-ui/react';
import AppButton from 'components/styled/AppButton/AppButton';
import { EmailAuthProvider, reauthenticateWithCredential, signOut, updateEmail } from "firebase/auth";
import { firebaseAuth } from "core/services/firebase";
import { useHistory } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import { dbEmailCheckApi, dbUsernameCheckApi, updateUserBasicInfoApi } from 'core/api/users';
import useDebouncePromise from 'core/hooks/useDebouncePromise';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import SubmitButton from 'components/styled/SubmitButton/SubmitButton';
import { cacheYupTest } from 'core/helpers/cacheYupTest';
import { useForm } from 'react-hook-form';
import PopperMenu from 'components/menus/popper/PopperMenu';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { updateUserBasicInfo } from 'core/features/user/userSlice';
import DefaultUserImage from 'components/common/DefaultUserImage/DefaultUserImage';
import { setModalState } from 'core/features/modal/modalSlice';

const ProfileInfo = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const user = useAppSelector(state => state.userData.authenticatedUser);
  const [userImage, setUserImage] = useState<string | null>(user.imageUrl!);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [validData, setValidData] = useState<{ username: string, email: string, firstName?: string, lastName?: string } | null>(null);
  const [isEditingEnabled, setIsEditingEnabled] = useState(false);
  const [isPasswordPromptOpen, setIsPasswordPromptOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [creationSuccessMessage, setCreationSuccessMessage] = useState('');
  const [creationError, setCreationError] = useState('');
  const submitButtonRef = useRef(null);

  useEffect(() => {
    if (user.imageUrl) {
      setUserImage(user.imageUrl);
    }
  }, [user.imageUrl]);

  const schema = yup.object({
    username: yup.string()
      .required('Username cannot be blank')
      .test(
        'username-check',
        'Username already exists',
        cacheYupTest(async (value) => {
          const valid = await debouncedUsernameCheck(user.username, value as string);
          return valid as boolean;
        })),
    email: yup.string()
      .required('Email cannot be blank')
      .email('Please enter a valid email format')
      .test(
        'email-check',
        'Email already in use',
        cacheYupTest(async (value) => {
          const valid = await debouncedEmailCheck(user.email, value as string);
          return valid as boolean;
        })),
    firstName: yup.string(),
    lastName: yup.string()
  }).required();

  type FormData = yup.InferType<typeof schema>;

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    mode: 'onSubmit',
    resolver: yupResolver(schema)
  });

  const debouncedUsernameCheck = useDebouncePromise(
    async (oldUsername: string, newUsername: string) => {
      if (oldUsername === newUsername) {
        return true;
      }
      const response = await dbUsernameCheckApi(newUsername.toLowerCase().trim());
      if (response?.usernameExists !== undefined) {
        const isValid = !response?.usernameExists;
        return isValid;
      }
    },
    500
  );

  const debouncedEmailCheck = useDebouncePromise(
    async (oldEmail: string, newEmail: string) => {
      if (oldEmail === newEmail) {
        return true;
      }
      const response = await dbEmailCheckApi(newEmail.toLowerCase().trim());
      if (response?.emailExists !== undefined) {
        const isValid = !response?.emailExists;
        return isValid;
      }
    },
    500
  );

  const handleImageError = async () => {
    setUserImage(null);
  };

  const handleLogOut = async () => {
    try {
      await signOut(firebaseAuth);
      history.push('/');
    } catch (err) {
      console.log(err);
    }
  };

  const handleValidateData = (data: FormData) => {
    setValidData(data);
    setIsPasswordPromptOpen(true);
  };

  const handleSubmitChanges = async () => {
    const { email, username, firstName, lastName } = validData!;
    try {
      const credential = EmailAuthProvider.credential(
        firebaseAuth.currentUser!.email!,
        password
      );
      await reauthenticateWithCredential(
        firebaseAuth.currentUser!,
        credential
      );
      if (email !== firebaseAuth.currentUser!.email!) {
        await updateEmail(
          firebaseAuth?.currentUser!,
          email
        );
      }
      const userWithChanges = {
        email,
        username,
        firstName,
        lastName
      };
      const updatedUser = await updateUserBasicInfoApi(user.userId, userWithChanges);
      if (updatedUser) {
        dispatch(updateUserBasicInfo({ username, firstName: firstName || "", lastName: lastName || "", email }));
        setValidData(null);
        setCreationError('');
        setCreationSuccessMessage('Your account information has been updated.');
        setPassword('');
        setIsPasswordPromptOpen(false);
      }
    } catch (err) {
      setCreationError('Failed to update account information, please check your inputs.');
      setPassword('');
      setIsPasswordPromptOpen(false);
    }
  };

  const handleOpenEditImageModal = () => {
    dispatch(setModalState({ visible: true, type: "Update User Image", boxId: "", itemData: undefined, page: "" }));
  };

  return (
    <div className={styles.container}>
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} width={'100%'}>
        <div className={styles.userWrapper}>
          <div className={styles.imageContainer}
            onMouseEnter={() => setIsImageHovered(true)}
            onMouseLeave={() => setIsImageHovered(false)}
          >
            {
              userImage &&
              <img
                className={styles.userImage}
                id={styles.userImage}
                src={userImage}
                alt="user"
                onError={handleImageError}
              />
            }
            {!userImage &&
              <DefaultUserImage width={75} />
            }
            {isImageHovered && (
              <div className={styles.imageOverlay} onClick={handleOpenEditImageModal}>
                <img src="/icons/edit.svg" alt="Edit" className={styles.editIcon} />
              </div>
            )}
          </div>
          <Text className={styles.userName} fontSize={'md'} fontWeight={'700'}>
            Signed in as {user.username}
          </Text>
        </div>
        <AppButton text={'Log Out'} onClick={handleLogOut} />
      </Box>
      <form id={styles.newBoxForm} onSubmit={handleSubmit(handleValidateData)}>
        <FormControl isInvalid={!!errors.username} sx={{ marginTop: "25px" }}>
          <FormLabel>{"Username"}</FormLabel>
          <Input defaultValue={user.username} borderColor={"brandgray.500"} focusBorderColor={"brandblue.600"} disabled={!isEditingEnabled} {...register("username")} />
          <FormErrorMessage>
            {errors.username?.message}
          </FormErrorMessage>
        </FormControl>
        <Box marginTop={"15px"} display={'flex'} gap={'10px'}>
          <FormControl isInvalid={!!errors.email}>
            <FormLabel>{"First Name"}</FormLabel>
            <Input defaultValue={user.firstName} borderColor={"brandgray.500"} focusBorderColor={"brandblue.600"} disabled={!isEditingEnabled} {...register("firstName")} />
          </FormControl>
          <FormControl isInvalid={!!errors.email}>
            <FormLabel>{"Last Name"}</FormLabel>
            <Input defaultValue={user.lastName} borderColor={"brandgray.500"} focusBorderColor={"brandblue.600"} disabled={!isEditingEnabled} {...register("lastName")} />
          </FormControl>
        </Box>
        <FormControl isInvalid={!!errors.email} sx={{ marginTop: "15px" }}>
          <FormLabel>{"Email Address"}</FormLabel>
          <Input defaultValue={user.email} borderColor={"brandgray.500"} focusBorderColor={"brandblue.600"} disabled={!isEditingEnabled} {...register("email")} />
          <FormErrorMessage>
            {errors.email?.message}
          </FormErrorMessage>
        </FormControl>
        <Box color={"brandyellow.600"} fontSize={'sm'} marginTop={'10px'}>
          {creationError || creationSuccessMessage}
        </Box>
        <Box marginTop={"15px"} display={'flex'} justifyContent={'flex-end'} gap={'10px'}>
          <Box onClick={() => history.push(`/user/${user.username}`)}>
            <SubmitButton text={"View profile page"} />
          </Box>
          {!isEditingEnabled &&
            <Box onClick={() => setIsEditingEnabled(true)}>
              <SubmitButton text={"Update information"} />
            </Box>
          }
          {isEditingEnabled &&
            <Box ref={submitButtonRef}>
              <SubmitButton text={"Save changes"} />
            </Box>
          }
        </Box>
        <PopperMenu referenceRef={submitButtonRef} placement={'bottom-start'} isOpen={isPasswordPromptOpen} setIsOpen={setIsPasswordPromptOpen}>
          <Box backgroundColor={"brandgray.900"} padding={'15px'} borderRadius={'10px'}>
            <FormLabel>{"Enter your password to confirm"}</FormLabel>
            <Input type={'password'} borderColor={"brandgray.500"} focusBorderColor={"brandblue.600"} value={password} onChange={e => setPassword(e.target.value)} marginBottom={'10px'} />
            <AppButton text={'Confirm'} onClick={handleSubmitChanges} />
          </Box>
        </PopperMenu>
      </form>
    </div>
  );
};

export default ProfileInfo;