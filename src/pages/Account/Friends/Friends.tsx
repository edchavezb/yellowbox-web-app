import { useAppSelector } from 'core/hooks/useAppSelector';
import styles from './Friends.module.css'
import { Box } from '@chakra-ui/react';
import UserFriendList from 'components/common/UserFriendList/UserFriendList';

const Friends = () => {
  const friendList = useAppSelector(state => state.userData.authenticatedUser.followedUsers);

  return (
    <Box className={styles.container}>
      {friendList && friendList.length === 0 && <p>You are not following anyone yet.</p>}
      {
        friendList && friendList.length > 0 &&
        <UserFriendList friendList={friendList || []} />
      }
    </Box>
  );
};

export default Friends;