import styles from "./FollowedPage.module.css";
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import FollowedUsers from "./UsersTab/FollowedUsers";
import FollowedBoxes from "./BoxesTab/FollowedBoxes";
import { useAppSelector } from "core/hooks/useAppSelector";
import { useEffect, useState } from "react";
import { FollowedBox, FollowedUser, Follower } from "core/types/interfaces";
import { getFollowedPageDataApi } from "core/api/users";

interface FollowedData {
  followedUsers: FollowedUser[],
  followedBoxes: FollowedBox[],
  followers: Follower[]
}

function FollowedPage() {
  const { path, url } = useRouteMatch();
  const isLoggedIn = useAppSelector(state => state.userData.isUserLoggedIn);
  const [followedData, setFollowedData] = useState<FollowedData>({
    followedUsers: [],
    followedBoxes: [],
    followers: []
  });

  useEffect(() => {
    const fetchFollowedData = async () => {
      const data = await getFollowedPageDataApi();
      setFollowedData(data);
    };
    fetchFollowedData();
  }
  , []);

  if(isLoggedIn === false) {
    return (
      <div className={styles.homeContainer}>
        <p>Welcome to Yellowbox, please log in or create an account</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.tabSwitcher}>
        <Link to={`${url}/users`} className={`${styles.tab} ${window.location.pathname === `${url}/users` ? styles.active : ''}`}>Users</Link>
        <Link to={`${url}/boxes`} className={`${styles.tab} ${window.location.pathname === `${url}/boxes` ? styles.active : ''}`}>Boxes</Link>
      </div>
      <Switch>
      <Route
        exact
        path={`${path}/users`}
        render={(props) => <FollowedUsers {...props} followedUsers={followedData.followedUsers} followers={followedData.followers} />}
      />
      <Route
        exact
        path={`${path}/boxes`}
        render={(props) => <FollowedBoxes {...props} followedBoxes={followedData.followedBoxes} />}
      />
      </Switch>
    </div>
  );
}

export default FollowedPage;