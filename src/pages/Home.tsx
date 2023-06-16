import styles from "./Home.module.css"
import { RouteComponentProps, withRouter } from "react-router-dom";
import { useAppSelector } from "core/hooks/useAppSelector";
import { spotifyLoginApi } from "core/api/spotify";

function Home({ location }: RouteComponentProps) {
  const userData = useAppSelector(state => state.userData.authenticatedUser)

  const handleLogin = async () => {
    const response = await spotifyLoginApi();
    if (response) {
      window.location.replace(response.url)
    }
  }

  if (!userData._id) {
    return (
      <div className={styles.homeContainer}>
        <h1> Please log in with one of your accounts </h1>
        <button className={styles.roundedButton} onClick={handleLogin}>
          <div className={styles.buttonContents}>
            <img className={styles.spotifyIcon} src='/icons/spotify_icon_white.png' alt='spotify' />
            <span>Log in with Spotify</span>
          </div>
        </button>
      </div>
    );
  } else {
    return (
      <div className={styles.homeContainer}>
        <h1> Welcome {userData.displayName.split(" ")[0]} </h1>
        <h4> Use the search box to find your favorite music </h4>
      </div>
    );
  }
}

export default withRouter(Home);