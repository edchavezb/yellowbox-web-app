import styles from "./AccountMenu.module.css";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "core/services/firebase";
import { useHistory } from "react-router-dom";

interface BoxMenuProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AccountMenu = ({ setIsOpen }: BoxMenuProps) => {
  const history = useHistory();
  const { menuItemsList, menuItem } = styles;

  const handleLogOut = async () => {
    try {
      setIsOpen(false);
      await signOut(firebaseAuth);
      history.push('/');
    }
    catch (err) {
      console.log(err)
    }
  }

  return (
    <div className={menuItemsList}>
      <div
        className={menuItem}
        onClick={handleLogOut}>
        Log out
      </div>
    </div>
  );
};

export default AccountMenu;