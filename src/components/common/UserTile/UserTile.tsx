import { FollowedUser } from "core/types/interfaces";
import { Link } from "react-router-dom";
import styles from "./UserTile.module.css";
import { useState } from "react";
import DefaultUserImage from "components/common/DefaultUserImage/DefaultUserImage";

const UserTile = ({ user }: { user: FollowedUser["followedUser"] }) => {
  const [userImage, setUserImage] = useState<string | null>(user.imageUrl!);

  const handleImageError = async () => {
    setUserImage(null);
  };

  return (
    <div className={styles.userTileWrapper}>
      <Link to={`/user/${user.username}`}>
        <div className={styles.imageContainer}>
          {userImage ? (
            <img
              className={styles.userImage}
              id={styles.userImage}
              src={userImage}
              alt="user"
              onError={handleImageError}
            />
          ) : (
            <DefaultUserImage />
          )}
        </div>
      </Link>
      <div className={styles.userName}>
        <Link to={`/user/${user.username}`}>{user.username}</Link>
      </div>
    </div>
  );
};

export default UserTile;