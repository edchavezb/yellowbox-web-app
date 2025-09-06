import { Button, Stack } from "@chakra-ui/react";
import { FollowedUser, Follower } from "core/types/interfaces";
import UserTile from "../UserTile/UserTile";
import { useAppSelector } from "core/hooks/useAppSelector";
import { followUserApi, unfollowUserApi } from "core/api/users";
import { updateUserFollowedList } from "core/features/user/userSlice";
import { useAppDispatch } from "core/hooks/useAppDispatch";

interface UserFriendListProps {
  friendList: Follower[] | FollowedUser[];
}

const UserFriendList = ({ friendList }: UserFriendListProps) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.userData.authenticatedUser);
  const followedUserIds = new Set(currentUser?.followedUsers!.map(f => f.userId));
  const myUserId = currentUser?.userId;

  const handleFollowUser = async (userId: string) => {
    const response = await followUserApi(userId);
    dispatch(updateUserFollowedList(response));
  }

  const handleUnfollowUser = async (userId: string) => {
    const response = await unfollowUserApi(userId);
    dispatch(updateUserFollowedList(response));
  }

  return (
    <Stack spacing={3}>
      {
        friendList.map(user => (
          <Stack direction={"row"} justifyContent={"space-between"} key={user.userId} width={"100%"}>
            <UserTile user={user} direction="row" isNameDisplayed />
            {followedUserIds.has(user.userId) &&
              <Button variant={"solid"} size={"sm"} onClick={() => handleUnfollowUser(user.userId)}>Following</Button>
            }
            {(!followedUserIds.has(user.userId) && user.userId !== myUserId) &&
              <Button variant={"outline"} size={"sm"} onClick={() => handleFollowUser(user.userId)}>Follow</Button>
            }
          </Stack>
        ))
      }
    </Stack>
  );
}

export default UserFriendList;