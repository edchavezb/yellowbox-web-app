import styles from "./Home.module.css"
import { withRouter } from "react-router-dom";
import { useAppSelector } from "core/hooks/useAppSelector";
import FolderTile from "components/common/FolderTile/FolderTile";
import BoxTile from "components/common/BoxTile/BoxTile";
import { Text } from '@chakra-ui/react'

function Home() {
  const isLoggedIn = useAppSelector(state => state.userData.isUserLoggedIn);
  const userFolders = useAppSelector(state => state.userFoldersData.folders);
  const sortedFolders = [...userFolders].sort((folderA, folderB) => {
    if (folderA.name > folderB.name) return 1
    if (folderA.name < folderB.name) return -1
    else {
      return 0
    }
  })
  const dashboardBoxes = useAppSelector(state => state.userBoxesData.dashboardBoxes);

  if (isLoggedIn) {
    return (
      <div className={styles.homeContainer}>
        <Text fontSize={"2xl"} fontWeight={"700"} marginTop={'5px'}> Home </Text>
        <Text fontSize={"lg"} fontWeight={"700"} sx={{ marginTop: "30px", marginBottom: "10px" }}> My Collection </Text>
        <div className={styles.folderList}>
          {!!sortedFolders.length &&
            sortedFolders.map(folder => {
              return (
                <FolderTile folder={folder} />
              )
            })
          }
          {
            !!dashboardBoxes.length &&
            dashboardBoxes.map(box => {
              return (
                <BoxTile box={box} displayUser={false} />
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