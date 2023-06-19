import { UserFolder } from "core/types/interfaces"
import { Link, useHistory } from "react-router-dom"
import styles from "./FolderTile.module.css";

const FolderTile = ({ folder }: { folder: UserFolder }) => {
  const history = useHistory();

  const navigateToBox = () => {
    history.push(`/folder/${folder._id}`)
  }

  return (
    <div className={styles.folderBoxWrapper} >
      <div className={styles.folderSquare} onClick={navigateToBox}>
        <img className={styles.folderIcon} src="/icons/folder.svg" alt="folder" />
      </div>
      <div className={styles.folderName}>
        <Link to={`/folder/${folder._id}`}>
          {folder.name}
        </Link>
      </div>
    </div>
  )
}

export default FolderTile;