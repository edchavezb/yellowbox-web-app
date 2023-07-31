import { useState } from 'react';
import styles from "./LogInMenu.module.css";
import { firebaseAuth } from 'core/services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { setModalState } from 'core/features/modal/modalSlice';

function LogInMenu() {
  const dispatch = useAppDispatch();
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const handleSubmitBtnClick = async () => {
    signInWithEmailAndPassword(
      firebaseAuth,
      userEmail,
      userPassword
    )
    dispatch(setModalState({visible: false, type:"", boxId:"", folderId: "", page: "", itemData: undefined}))
  }

  const handleOpenSignUpMenu = () => {
    dispatch(setModalState({
      visible: true, type: "Sign Up", page: ""
    }))
  }

  return (
    <div id={styles.modalBody}>
      <form id={styles.newBoxForm}>
        <label className={styles.formElement} htmlFor="email"> Email address </label>
        <input className={styles.formElement} type="text" name="email" id={styles.boxName}
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
        <label className={styles.formElement} htmlFor="password"> Password </label>
        <input className={styles.formElement} type="password" name="password" id={styles.boxName}
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
        />
      </form>
      <div id={styles.modalFooter}>
        <button disabled={!userEmail || !userPassword} onClick={handleSubmitBtnClick}>
          Log in
        </button>
      </div>
      <div>
        Don't have an account? <span style={{color: "dodgerblue", cursor: "pointer"}} onClick={handleOpenSignUpMenu}> Sign up </span>
      </div>
    </div>
  )
}

export default LogInMenu;