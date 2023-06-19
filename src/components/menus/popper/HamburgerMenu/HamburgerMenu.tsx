import { ModalType, setModalState } from "core/features/modal/modalSlice";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import styles from "./HamburgerMenu.module.css";
import { setSpotifyLoginData } from "core/features/spotifyService/spotifyLoginSlice";
import { setAuthenticatedUser, setIsUserLoggedIn } from "core/features/user/userSlice";
import { YellowboxUser, SpotifyLoginData } from "core/types/interfaces";
import { useHistory } from "react-router-dom";

interface BoxMenuProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const HamburgerMenu = ({ setIsOpen }: BoxMenuProps) => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { menuItemsList, menuItem } = styles;

  const handleOpenModal = (modalType: ModalType) => {
    dispatch(setModalState({
      visible: true, type: modalType, page: "", itemData: undefined
    }))
    setIsOpen(false);
  }

  const handleLogOut = () => {
    dispatch(setAuthenticatedUser({} as YellowboxUser))
    dispatch(setSpotifyLoginData({} as SpotifyLoginData))
    dispatch(setIsUserLoggedIn(false))
    setIsOpen(false);
    history.push('/')
  }

  const navigateToSearch = () => {
    setIsOpen(false);
    history.push('/search')
  }

  return (
    <div className={menuItemsList}>
      <div
        className={menuItem}
        onClick={handleLogOut}>
        Log out
      </div>
      <div
        className={menuItem}
        onClick={navigateToSearch}>
        Search
      </div>
      <div
        className={menuItem}
        onClick={() => handleOpenModal("New Folder")}>
        New folder
      </div>
      <div
        className={menuItem}
        onClick={() => handleOpenModal("New Box")}>
        New box
      </div>
    </div>
  );
};

export default HamburgerMenu;