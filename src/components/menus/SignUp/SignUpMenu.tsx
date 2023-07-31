import { ChangeEvent, useState } from 'react';
import styles from "./SignUpMenu.module.css";
import { firebaseAuth } from 'core/services/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import useDebounce from 'core/hooks/useDebounce';
import { createUser, dbUsernameCheck } from 'core/api/users';
import { YellowboxUser } from 'core/types/interfaces';

function SignUpMenu() {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [isUserNameValid, setIsUserNameValid] = useState(true);
  const [userSuccessMessage, setUserSuccessMessage] = useState('');
  const debouncedUsernameCheck = useDebounce(
    async (username: string) => {
      const response = await dbUsernameCheck(username);
      if (response?.usernameExists !== undefined) {
        setIsUserNameValid(!response.usernameExists);
      }
    },
    1000
  )

  const handleSubmitBtnClick = async () => {
    const newFirebaseUser = await createUserWithEmailAndPassword(
      firebaseAuth,
      userEmail,
      userPassword
    );
    await sendEmailVerification(newFirebaseUser.user)
    const newAppUser: Omit<YellowboxUser, "_id"> = {
      firebaseId: newFirebaseUser.user.uid,
      username,
      displayName,
      image: "",
      account: {
        accountTier: "free",
        signUpDate: (new Date()).toISOString(),
        emailVerified: false,
        email: userEmail,
        showTutorial: true
      },
      billing: {},
      services: {}
    }
    const savedUser = await createUser(newAppUser); 
    if (savedUser) {
      setUsername('');
      setUserEmail('');
      setUserPassword('');
      setDisplayName('');
      setIsUserNameValid(true);
      setUserSuccessMessage(`Congrats ${savedUser?.username}, your account has been created. Please log in to access the app.`)
    }
  }

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setUsername(input);
    if (input){
      debouncedUsernameCheck(input);
    }
  }

  return (
    <div id={styles.modalBody}>
      <form id={styles.newBoxForm}>
        <label className={styles.formElement} htmlFor="username"> Username </label>
        <input className={styles.formElement} type="text" name="username" id={styles.boxName}
          value={username}
          onChange={handleUsernameChange}
        />
        {
          !isUserNameValid &&
          <div style={{ color: 'red' }}>
            This username already exists
          </div>
        }
        <label className={styles.formElement} htmlFor="displayName"> Display Name </label>
        <input className={styles.formElement} type="text" name="displayName" id={styles.boxName}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
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
      <div>
        {userSuccessMessage}
      </div>
      <div id={styles.modalFooter}>
        <button disabled={!userEmail || !userPassword || !displayName || !username || !isUserNameValid} onClick={handleSubmitBtnClick}>
          Create account
        </button>
      </div>
    </div>
  )
}

export default SignUpMenu;