import { Stack } from "@chakra-ui/react";
import UserFriendList from "components/common/UserFriendList/UserFriendList";
import { followUserApi, unfollowUserApi } from "core/api/users";
import { updateUserFollowedList } from "core/features/user/userSlice";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { useAppSelector } from "core/hooks/useAppSelector";

function UserFriendsMenu() {
  const dispatch = useAppDispatch();
  const pageUser = useAppSelector(state => state.currentUserDetailData.user);
  const viewingFriendsList = useAppSelector(state => state.modalData.modalState.viewingFriendsList);
  const { followers, followedUsers } = pageUser!;

  return (
    <Stack spacing={4} padding={4} maxHeight="400px" overflowY="auto">
      {viewingFriendsList === "followers" &&
        <>
          {followers && followers.length > 0 ?
            <UserFriendList friendList={followers} />
            : <div>No followers yet.</div>
          }
        </>
      }
      {viewingFriendsList === "followedUsers" &&
        <>
          {followedUsers && followedUsers.length > 0 ? 
            <UserFriendList friendList={followedUsers} />
            : <div>Not following anyone yet.</div>
          }
        </>
      }
    </Stack>
  );
};

export default UserFriendsMenu;