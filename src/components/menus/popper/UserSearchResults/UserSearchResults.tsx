import UserFriendList from "components/common/UserFriendList/UserFriendList";
import { YellowboxUser } from "core/types/interfaces";
import styles from './UserSearchResults.module.css';
import { Skeleton, SkeletonCircle, Stack } from "@chakra-ui/react";

interface UserSearchResultsProps {
  users: YellowboxUser[];
  isLoading: boolean;
}

const UserSearchResults = ({ users, isLoading }: UserSearchResultsProps) => {
  const { menuItemsList, menuItem } = styles;

  return (
    <div className={menuItemsList}>
      {isLoading &&
        <Stack className={menuItem} direction={"row"} alignItems={"center"} spacing={3}>
          <SkeletonCircle size='20px' />
          <Skeleton height='20px' width='200px' borderRadius='4px' />
        </Stack>
      }
      {(users.length === 0 && !isLoading) && <div className={menuItem}><i>No users found</i></div>}
      {(users.length > 0 && !isLoading) &&
        <UserFriendList friendList={users} />
      }
    </div>
  );
};

export default UserSearchResults;