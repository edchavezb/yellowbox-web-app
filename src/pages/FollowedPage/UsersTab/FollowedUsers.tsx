import styles from "./FollowedUsers.module.css"
import { useAppSelector } from "core/hooks/useAppSelector";
import { Text } from '@chakra-ui/react'
import UserTile from "components/common/UserTile/UserTile";
import { FollowedUser, Follower } from "core/types/interfaces";

function FollowedUsers({followedUsers, followers}: {followedUsers: FollowedUser[], followers: Follower[]}) {
  const isLoggedIn = useAppSelector(state => state.userData.isUserLoggedIn);
 
  if (isLoggedIn) {
    return (
      <div className={styles.homeContainer}>
        {
          !!followedUsers.length &&
          <>
            <Text fontSize={"lg"} fontWeight={"700"} sx={{ marginTop: "5px", marginBottom: "10px" }}> Your followed users </Text>
            <div className={styles.userList}>
              {
                followedUsers.map(item => {
                  return (
                    <UserTile user={item.followedUser} key={item.followedUser.userId} />
                  )
                })
              }
            </div>
          </>
        }
        {
          !!followers.length &&
          <>
            <Text fontSize={"lg"} fontWeight={"700"} sx={{ marginTop: "5px", marginBottom: "10px" }}> Your followers </Text>
            <div className={styles.userList}>
              {
                followers.map(item => {
                  return (
                    <UserTile user={item.follower} key={item.follower.userId} />
                  )
                })
              }
            </div>
          </>
        }
        {
          !followedUsers.length && !followers.length &&
          <Text fontSize={"md"} fontWeight={"400"} textAlign={"center"} sx={{ marginTop: "5px", marginBottom: "10px" }}> You don't follow any users or have any followers yet! </Text>
        }
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

export default FollowedUsers;