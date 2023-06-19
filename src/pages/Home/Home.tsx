import styles from "./Home.module.css"
import { RouteComponentProps, withRouter } from "react-router-dom";
import { useAppSelector } from "core/hooks/useAppSelector";
import { spotifyLoginApi } from "core/api/spotify";
import FolderTile from "components/common/FolderTile/FolderTile";
import BoxTile from "components/common/BoxTile/BoxTile";

function Home({ location }: RouteComponentProps) {
  const isLoggedIn = useAppSelector(state => state.userData.isUserLoggedIn);
  const userData = useAppSelector(state => state.userData.authenticatedUser);
  const userFolders = useAppSelector(state => state.userFoldersData.folders);
  const dashboardBoxes = useAppSelector(state => state.userBoxesData.dashboardBoxes);

  const handleLogin = async () => {
    const response = await spotifyLoginApi();
    if (response) {
      window.location.replace(response.url)
    }
  }

  if (isLoggedIn) {
    return (
      <div className={styles.homeContainer}>
        <h1> Welcome {userData.displayName.split(" ")[0]} </h1>
        <h1> Your folders </h1>
        <div className={styles.folderList}>
          {
            userFolders.map(folder => {
              return(
               <FolderTile folder={folder} />
              )
            })
          }
        </div>
        <h1> Your boxes </h1>
        <div className={styles.boxList}>
          {
            dashboardBoxes.map(box => {
              return(
               <BoxTile box={box} />
              )
            })
          }
        </div>
      </div>
    );
  }
  else if (isLoggedIn === false) {
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
  }

  return (
    <></>
  )
}

export default withRouter(Home);