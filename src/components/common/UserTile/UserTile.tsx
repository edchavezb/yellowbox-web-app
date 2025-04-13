import { FollowedUser } from "core/types/interfaces"
import { Link } from "react-router-dom"
import styles from "./UserTile.module.css";
import { useState } from "react";

const UserTile = ({ user }: { user: FollowedUser["followedUser"] }) => {
  const [userImage, setUserImage] = useState(user.imageUrl);

  const handleImageError = async () => {
    setUserImage("/user.png");
  }

  return (
    <div className={styles.userTileWrapper} >
      <Link to={`/user/${user.username}`}>
        <div className={styles.imageContainer}>
          <img className={styles.userImage} id={styles.userImage} src={userImage || "/user.png"} alt="user" onError={handleImageError} />
        </div>
      </Link>
      <div className={styles.userName}>
        <Link to={`/user/${user.username}`}>
          {user.username}
        </Link>
      </div>
    </div>
  )
}

export default UserTile;