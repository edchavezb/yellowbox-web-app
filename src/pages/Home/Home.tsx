import styles from "./Home.module.css"
import { RouteComponentProps, withRouter } from "react-router-dom";
import { useAppSelector } from "core/hooks/useAppSelector";
import { spotifyLoginApi } from "core/api/spotify";
import FolderTile from "components/common/FolderTile/FolderTile";
import BoxTile from "components/common/BoxTile/BoxTile";
import { Text } from '@chakra-ui/react'

function Home({ location }: RouteComponentProps) {
  const isLoggedIn = useAppSelector(state => state.userData.isUserLoggedIn);
  const userData = useAppSelector(state => state.userData.authenticatedUser);
  const userFolders = useAppSelector(state => state.userFoldersData.folders);
  const sortedFolders = [...userFolders].sort((folderA, folderB) => {
    if (folderA.name > folderB.name) return 1
    if (folderA.name < folderB.name) return -1
    else {
      return 0
    }
  })
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
        <Text fontSize={"xl"} fontWeight={"700"}> Welcome {userData.username} </Text>
        <Text fontSize={"lg"} fontWeight={"700"} sx={{marginTop: "20px", marginBottom: "10px"}}> Your folders </Text>
        <div className={styles.folderList}>
          {
            sortedFolders.map(folder => {
              return(
               <FolderTile folder={folder} />
              )
            })
          }
        </div>
        <Text fontSize={"lg"} fontWeight={"700"} sx={{marginTop: "20px", marginBottom: "10px"}}> Your boxes </Text>
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
        <Text fontSize={"xl"} fontWeight={"700"}> Welcome to Yellowbox, please log in or create an account </Text>
      </div>
    );
  }

  return (
    <></>
  )
}

export default withRouter(Home);