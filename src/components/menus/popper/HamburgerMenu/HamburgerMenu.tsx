import { ModalType, setModalState } from "core/features/modal/modalSlice";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import styles from "./HamburgerMenu.module.css";
import { useHistory } from "react-router-dom";
import { useAppSelector } from "core/hooks/useAppSelector";

interface BoxMenuProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const HamburgerMenu = ({ setIsOpen }: BoxMenuProps) => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { menuItemsList, menuItem } = styles;
  const authenticatedUser = useAppSelector(state => state.userData.authenticatedUser);

  const handleOpenModal = (modalType: ModalType) => {
    dispatch(setModalState({
      visible: true, type: modalType, page: "", itemData: undefined
    }))
    setIsOpen(false);
  }

  const navigateToSearch = () => {
    setIsOpen(false);
    history.push('/search')
  }

  const navigateToAccount = () => {
    setIsOpen(false);
    history.push('/account')
  }

  const navigateToServices = () => {
    setIsOpen(false);
    history.push('/account/linked-services')
  }

  const navigateToProfile = () => {
    setIsOpen(false);
    history.push(`/user/${authenticatedUser.username}`)
  }

  return (
    <div className={menuItemsList}>
      <div
        className={menuItem}
        onClick={navigateToProfile}>
        My Profile
      </div>
      <div
        className={menuItem}
        onClick={navigateToServices}>
        Linked Services
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
      <div
        className={menuItem}
        onClick={navigateToAccount}>
        Settings
      </div>
    </div>
  );
};

export default HamburgerMenu;