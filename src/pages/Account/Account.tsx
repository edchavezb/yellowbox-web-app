import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import styles from './Account.module.css'
import ProfileInfo from './ProfileInfo/ProfileInfo';
import LinkedServices from './LinkedServices/LinkedServices';
import { Box } from '@chakra-ui/react';
import Authentication from './Authentication/Authentication';
import Notifications from './Notifications/Notifications';
import Subscription from './Subscription/Subscription';

const Account = () => {
  const { path, url } = useRouteMatch();

  return (
    <div className={styles.container}>
      <Box className={styles.accountPanel} border={"1px solid"} borderColor={"brandgray.600"} >
        <Box className={styles.tabSwitcher} borderRight={"1px solid"} borderColor={"brandgray.600"}>
          <Link to={`${url}`} className={`${styles.tab} ${window.location.pathname === `${url}` ? styles.active : ''}`}>Profile</Link>
          <Link to={`${url}/authentication`} className={`${styles.tab} ${window.location.pathname === `${url}/authentication` ? styles.active : ''}`}>Authentication</Link>
          <Link to={`${url}/linked-services`} className={`${styles.tab} ${window.location.pathname === `${url}/linked-services` ? styles.active : ''}`}>Linked Services</Link>
          <Link to={`${url}/notifications`} className={`${styles.tab} ${window.location.pathname === `${url}/notifications` ? styles.active : ''}`}>Notifications</Link>
          <Link to={`${url}/subscription`} className={`${styles.tab} ${window.location.pathname === `${url}/subscription` ? styles.active : ''}`}>Subscription</Link>
        </Box>
        <div className={styles.content}>
          <Switch>
            <Route exact path={`${path}`} component={ProfileInfo} />
            <Route exact path={`${path}/authentication`} component={Authentication} />
            <Route exact path={`${path}/linked-services`} component={LinkedServices} />
            <Route exact path={`${path}/notifications`} component={Notifications} />
            <Route exact path={`${path}/subscription`} component={Subscription} />
          </Switch>
        </div>
      </Box>
    </div>
  );
};

export default Account;
