import { useAppDispatch } from "core/hooks/useAppDispatch";
import styles from "./AccountMenu.module.css";
import { setAuthenticatedUser, setIsUserLoggedIn } from "core/features/user/userSlice";
import { setSpotifyLoginData } from "core/features/spotifyService/spotifyLoginSlice";
import { SpotifyLoginData, YellowboxUser } from "core/types/interfaces";
import { useHistory } from "react-router-dom";

interface BoxMenuProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AccountMenu = ({ setIsOpen }: BoxMenuProps) => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { menuItemsList, menuItem } = styles;

  const handleLogOut = () => {
    dispatch(setAuthenticatedUser({} as YellowboxUser))
    dispatch(setSpotifyLoginData({} as SpotifyLoginData))
    dispatch(setIsUserLoggedIn(false))
    setIsOpen(false);
    history.push('/')
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