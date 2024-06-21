import styles from './Authentication.module.css'
import { Box, FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { firebaseAuth } from 'core/services/firebase';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import * as yup from "yup";
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import SubmitButton from 'components/styled/SubmitButton/SubmitButton';

const Authentication = () => {
  const [creationSuccessMessage, setCreationSuccessMessage] = useState('');
  const [creationError, setCreationError] = useState('');

  const schema = yup.object({
    oldPassword: yup.string()
    .required('Current password is required'),
    newPassword: yup.string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must be at most 16 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
    confirmPassword: yup.string()
    .oneOf([yup.ref('newPassword')], "Passwords don't match")
    .required('Please confirm your password')
  }).required();

  type FormData = yup.InferType<typeof schema>;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  });

  const handleUpdatePassword = async (data: FormData) => {
    const { oldPassword, newPassword } = data;
    try {
      const credential = EmailAuthProvider.credential(
        firebaseAuth.currentUser!.email!,
        oldPassword
      )
      await reauthenticateWithCredential(
        firebaseAuth.currentUser!, 
        credential
      )
      await updatePassword(
        firebaseAuth?.currentUser!,
        newPassword
      );
      reset();
      setCreationError('');
      setCreationSuccessMessage(`Your password has been updated!`);
    }
    catch (err) {
      setCreationError('We could not update your password. Please check your inputs.')
    }
  }

  return (
    <Box className={styles.container}>
      <form id={styles.newBoxForm} onSubmit={handleSubmit(handleUpdatePassword)}>
        <FormControl isInvalid={!!errors.oldPassword}>
          <FormLabel>{"Current Password"}</FormLabel>
          <Input type={"password"} borderColor={"brandgray.500"} focusBorderColor={"brandblue.600"} {...register("oldPassword")} />
          <FormErrorMessage>
            {errors.oldPassword?.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.newPassword} sx={{ marginTop: "15px" }}>
          <FormLabel>{"New Password"}</FormLabel>
          <Input type={"password"} borderColor={"brandgray.500"} focusBorderColor={"brandblue.600"} {...register("newPassword")} />
          <FormErrorMessage>
            {errors.newPassword?.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.confirmPassword} sx={{ marginTop: "15px" }}>
          <FormLabel>{"Confirm Password"}</FormLabel>
          <Input type={"password"} borderColor={"brandgray.500"} focusBorderColor={"brandblue.600"} {...register("confirmPassword")} />
          <FormErrorMessage>
            {errors.confirmPassword?.message}
          </FormErrorMessage>
        </FormControl>
        <Box color={"brandyellow.600"} fontSize={'sm'} marginTop={'10px'}>
          {creationError || creationSuccessMessage}
        </Box>
        <Box marginTop={"15px"} display={'flex'} justifyContent={'flex-end'}>
          <SubmitButton text={"Update password"} />
        </Box>
      </form>
    </Box>
  );
};

export default Authentication;