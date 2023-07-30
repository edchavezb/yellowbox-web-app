import { useAppSelector } from "core/hooks/useAppSelector";
import styles from "./ServicesMenu.module.css";
import { spotifyLoginApi } from "core/api/spotify";

interface ServicesMenuProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ServicesMenu = ({ setIsOpen }: ServicesMenuProps) => {
  const { menuItemsList, menuItem } = styles;
  const user = useAppSelector(state => state.userData.authenticatedUser)

  const handleSpotifyLogin = async () => {
    setIsOpen(false);
    const response = await spotifyLoginApi();
    if (response) {
      window.location.replace(response.url)
    }
  }

  const handleLastFmLogin = async () => {
    // Implement
  }

  return (
    <div className={menuItemsList}>
      {
        !user.services?.spotify &&
        <div
          className={menuItem}
          onClick={handleSpotifyLogin}>
          Spotify
        </div>
      }
      {
        !user.services?.lastFm &&
        <div
          className={menuItem}
          onClick={handleLastFmLogin}>
          Last.fm
        </div>
      }
    </div>
  );
};

export default ServicesMenu;