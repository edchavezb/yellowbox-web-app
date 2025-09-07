import { UserFolder } from "core/types/interfaces"
import { Link, useHistory } from "react-router-dom"
import styles from "./FolderTile.module.css";
import { Box, Stack } from "@chakra-ui/react";

const FolderTile = ({ folder }: { folder: UserFolder }) => {
  const history = useHistory();

  const navigateToBox = () => {
    history.push(`/folder/${folder.folderId}`)
  }

  return (
    <Box className={styles.folderBoxWrapper}>
      <Box className={styles.folderSquare} onClick={navigateToBox}>
        <img className={styles.folderIcon} src="/icons/folder.svg" alt="folder" />
      </Box>
      <Box className={styles.folderName}>
        <Box className={styles.folderNameText}>
          <Link to={`/folder/${folder.folderId}`}>
            {folder.name}
          </Link>
        </Box>
      </Box>
    </Box>
  )
}

export default FolderTile;