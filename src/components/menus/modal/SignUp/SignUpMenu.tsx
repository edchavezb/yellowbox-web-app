import { useState } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import styles from "./SignUpMenu.module.css";
import { firebaseAuth } from 'core/services/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { createUserApi, dbUsernameCheckApi } from 'core/api/users';
import { YellowboxUser } from 'core/types/interfaces';
import useDebouncePromise from 'core/hooks/useDebouncePromise';
import { cacheYupTest } from 'core/helpers/cacheYupTest';

function SignUpMenu() {
  const [creationSuccessMessage, setCreationSuccessMessage] = useState('');
  const [creationError, setCreationError] = useState('');

  const schema = yup.object({
    username: yup.string()
      .required('Username is a required field')
      .test(
        'username-check',
        'Username already exists',
        cacheYupTest(async (value) => {
          const valid = await debouncedUsernameCheck(value as string);
          return valid as boolean;
        })),
    email: yup.string()
      .required('Email is a required field')
      .email('Please enter a valid email format'),
    password: yup.string()
      .required('Password is a required field')
      .min(8, 'Password must be at least 8 characters')
      .max(16, 'Password must be at most 16 characters')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
  }).required();

  type FormData = yup.InferType<typeof schema>;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  });

  const debouncedUsernameCheck = useDebouncePromise(
    async (username: string) => {
      const response = await dbUsernameCheckApi(username.toLowerCase().trim());
      if (response?.usernameExists !== undefined) {
        const isValid = !response?.usernameExists;
        return isValid;
      }
    },
    1000
  );

  const handleSubmitForm = async (data: FormData) => {
    const { username, email, password } = data;
    try {
      const newFirebaseUser = await createUserWithEmailAndPassword(
        firebaseAuth,
        email.trim(),
        password.trim()
      );
      await sendEmailVerification(newFirebaseUser.user)
      const newAppUser: Omit<YellowboxUser, "_id"> = {
        firebaseId: newFirebaseUser.user.uid,
        username: username.toLowerCase().trim(),
        image: "",
        account: {
          accountTier: "free",
          signUpDate: (new Date()).toISOString(),
          emailVerified: false,
          email,
          showTutorial: true
        },
        billing: {},
        services: {}
      }
      const savedUser = await createUserApi(newAppUser);
      if (savedUser) {
        reset();
        setCreationError('');
        setCreationSuccessMessage(`Congrats ${savedUser?.username}, your account has been created. Please log in to access the app.`);
      }
    }
    catch (err) {
      setCreationError((err as Error).message)
    }
  }

  return (
    <div id={styles.modalBody}>
      <form id={styles.newBoxForm} onSubmit={handleSubmit(handleSubmitForm)}>
        <div className={styles.formGroup}>
          <label className={styles.formElement} htmlFor="username"> Username </label>
          <input className={styles.formElement} type="text" id={styles.boxName}
            {...register("username")}
          />
          <div className={styles.errorMsg}>{errors.username?.message}</div>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formElement} htmlFor="email"> Email address </label>
          <input className={styles.formElement} type="text" id={styles.boxName}
            {...register("email")}
          />
          <div className={styles.errorMsg}>{errors.email?.message}</div>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formElement} htmlFor="password"> Password </label>
          <input className={styles.formElement} type="password" id={styles.boxName}
            {...register("password")}
          />
          <div className={styles.errorMsg}>{errors.password?.message}</div>
        </div>
        <div>
          {creationError || creationSuccessMessage}
        </div>
        <div id={styles.modalFooter}>
          <button type={'submit'}>
            Create account
          </button>
        </div>
      </form>
    </div>
  )
}

export default SignUpMenu;