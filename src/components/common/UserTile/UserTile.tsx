import { FollowedUser } from "core/types/interfaces";
import { Link } from "react-router-dom";
import styles from "./UserTile.module.css";
import { useState } from "react";
import DefaultUserImage from "components/common/DefaultUserImage/DefaultUserImage";
import { Box } from "@chakra-ui/react";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { setModalState } from "core/features/modal/modalSlice";

interface UserTileProps {
  user: FollowedUser;
  direction?: "row" | "column";
}

const UserTile = ({ user, direction }: UserTileProps) => {
  const dispatch = useAppDispatch();
  const [userImage, setUserImage] = useState<string | null>(user.imageUrl!);

  const handleImageError = async () => {
    setUserImage(null);
  };

  return (
    <Link to={`/user/${user.username}`} onClick={() => dispatch(setModalState({ visible: false, type: "" }))}>
      <Box className={direction === 'column' ? styles.userTileWrapper : styles.userRowWrapper}>
        <Box className={direction === 'column' ? styles.imageContainerColumn : styles.imageContainerRow}>
          {userImage ? (
            <img
              src={userImage}
              alt="user"
              onError={handleImageError}
            />
          ) : (
            <DefaultUserImage />
          )}
        </Box>
        <Box className={styles.userName} marginTop={direction === 'column' ? '8px' : '0'}>
          {user.username}
        </Box>
      </Box>
    </Link>
  );
};

export default UserTile;