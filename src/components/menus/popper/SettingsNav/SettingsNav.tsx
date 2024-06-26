import styles from "./SettingsNav.module.css";
import { useRouteMatch, Link } from "react-router-dom";

interface ServicesMenuProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SettingsNav = ({ setIsOpen }: ServicesMenuProps) => {
  const { url } = useRouteMatch();
  const { menuItemsList, menuItem } = styles;

  return (
    <div className={menuItemsList}>
      <Link to={`${url}`} className={`${menuItem} ${window.location.pathname === `${url}` ? styles.active : ''}`}>Profile</Link>
      <Link to={`${url}/authentication`} className={`${menuItem} ${window.location.pathname === `${url}/authentication` ? styles.active : ''}`}>Authentication</Link>
      <Link to={`${url}/linked-services`} className={`${menuItem} ${window.location.pathname === `${url}/linked-services` ? styles.active : ''}`}>Linked Services</Link>
      <Link to={`${url}/notifications`} className={`${menuItem} ${window.location.pathname === `${url}/notifications` ? styles.active : ''}`}>Notifications</Link>
      <Link to={`${url}/subscription`} className={`${menuItem} ${window.location.pathname === `${url}/subscription` ? styles.active : ''}`}>Subscription</Link>
    </div>
  );
};

export default SettingsNav;