import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import SpotifyUser from './UserSummary/SpotifyUser';
import UserAlbums from './UserAlbums/UserAlbums';
import UserTracks from './UserTracks/UserTracks';
import styles from './SpotifyDashboard.module.css'

const SpotifyDashboard = () => {
  const { path, url } = useRouteMatch();

  return (
    <div className={styles.container}>
      <div className={styles.tabSwitcher}>
        <Link to={`${url}`} className={`${styles.tab} ${window.location.pathname === `${url}` ? styles.active : ''}`}>Summary</Link>
        <Link to={`${url}/albums`} className={`${styles.tab} ${window.location.pathname === `${url}/albums` ? styles.active : ''}`}>Albums</Link>
        <Link to={`${url}/tracks`} className={`${styles.tab} ${window.location.pathname === `${url}/tracks` ? styles.active : ''}`}>Tracks</Link>
      </div>
      <Switch>
        <Route exact path={`${path}`} component={SpotifyUser} />
        <Route exact path={`${path}/albums`} component={UserAlbums} />
        <Route exact path={`${path}/tracks`} component={UserTracks} />
      </Switch>
    </div>
  );
};

export default SpotifyDashboard;
