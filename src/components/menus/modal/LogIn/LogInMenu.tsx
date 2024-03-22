import { useState } from 'react';
import styles from "./LogInMenu.module.css";
import { firebaseAuth } from 'core/services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { setModalState } from 'core/features/modal/modalSlice';
import FormInput from 'components/styled/FormInput/FormInput';
import AppButton from 'components/styled/AppButton/AppButton';

function LogInMenu() {
  const dispatch = useAppDispatch();
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [isLoginError, setIsLoginError] = useState(false);

  const handleSubmitBtnClick = async () => {
    try {
      await signInWithEmailAndPassword(
        firebaseAuth,
        userEmail,
        userPassword
      )
      dispatch(setModalState({ visible: false, type: "", boxId: "", folderId: "", page: "", itemData: undefined }))
    }
    catch {
      setIsLoginError(true);
    }
  }

  const handleOpenSignUpMenu = () => {
    dispatch(setModalState({
      visible: true, type: "Sign Up", page: ""
    }))
  }

  return (
    <div id={styles.modalBody}>
      <form id={styles.newBoxForm}>
        <FormInput
          label={"Email address"}
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
        <FormInput
          label={"Password"}
          type={"password"}
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
        />
      </form>
      <div id={styles.actionButtonRow}>
        <AppButton variant={"brandPrimary"} text={"Log in"} onClick={handleSubmitBtnClick} />
      </div>
      {
        isLoginError &&
        <div style={{ color: "red", marginBottom: "10px" }}>
          The username or password you entered are incorrect.
        </div>
      }
      <div id={styles.modalFooter}>
        <div>
          Don't have an account? <span style={{ color: "dodgerblue", cursor: "pointer" }} onClick={handleOpenSignUpMenu}> Sign up </span>
        </div>
      </div>
    </div>
  )
}

export default LogInMenu;