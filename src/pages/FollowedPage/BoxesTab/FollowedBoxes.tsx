import styles from "./FollowedBoxes.module.css"
import { useAppSelector } from "core/hooks/useAppSelector";
import BoxTile from "components/common/BoxTile/BoxTile";
import { Text } from '@chakra-ui/react'
import { FollowedBox } from "core/types/interfaces";

function FollowedBoxes({ followedBoxes }: { followedBoxes: FollowedBox[] }) {
  const isLoggedIn = useAppSelector(state => state.userData.isUserLoggedIn);

  if (isLoggedIn) {
    return (
      <div className={styles.homeContainer}>
        {
          !!followedBoxes.length &&
          <>
            <Text fontSize={"lg"} fontWeight={"700"} sx={{ marginTop: "5px", marginBottom: "10px" }}> Your followed boxes </Text>
            <div className={styles.boxList}>
              {
                followedBoxes.map(item => {
                  return (
                    <BoxTile box={item.box} key={item.box.boxId} displayUser />
                  )
                })
              }
            </div>
          </>
        }
        {
          !followedBoxes.length &&
          <Text fontSize={"md"} fontWeight={"400"} textAlign={"center"} sx={{ marginTop: "5px", marginBottom: "10px" }}> You don't follow any boxes yet! </Text>
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

export default FollowedBoxes;