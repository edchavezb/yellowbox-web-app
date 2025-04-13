import styles from "./UserPage.module.css";
import { useParams, withRouter } from "react-router-dom";
import { useAppSelector } from "core/hooks/useAppSelector";
import FolderTile from "components/common/FolderTile/FolderTile";
import BoxTile from "components/common/BoxTile/BoxTile";
import { Button, Stack, Text } from '@chakra-ui/react'
import { followUserApi, getUserPageDataApi, unfollowUserApi } from "core/api/users";
import { useEffect, useState } from "react";
import { YellowboxUser } from "core/types/interfaces";

function UserPage() {
  const { username } = useParams<{ username: string }>();
  const isLoggedIn = useAppSelector(state => state.userData.isUserLoggedIn);
  const userData = useAppSelector(state => state.userData.authenticatedUser);
  const [error, setError] = useState<string | null>(null);
  const [userPageData, setUserPageData] = useState<{ pageUser: YellowboxUser | null, isFollowed?: boolean } | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const { pageUser, isFollowed } = userPageData || { pageUser: null, isFollowed: false };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserPageDataApi(username);
        setUserPageData(response);
        setUserImage(response.pageUser?.imageUrl || "/user.png");
      }
      catch (err) {
        console.log(err);
        setError("Sorry. The user was not found.");
      }
    }
    fetchUserData();
  }, [username]);

  const handleToggleFollow = async () => {
    if (isFollowed) {
      const response = await unfollowUserApi(pageUser?.userId!);
      setUserPageData(response);
    } else {
      const response = await followUserApi(pageUser?.userId!);
      setUserPageData(response);
    }
  }

  const handleImageError = async () => {
    setUserImage("/user.png");
  }

  if (!error && userPageData) {
    return (
      <div className={styles.homeContainer}>
        <div className={styles.userWrapper}>
          <img className={styles.userImage} id={styles.userImage} src={userImage || "/user.png"} alt="user" onError={handleImageError} />
          <Stack spacing={0} width={"100%"}>
            <Stack direction={"row"} width={"100%"} spacing={"20px"} alignItems={"center"}>
              <Text className={styles.userName} fontSize={'2xl'} fontWeight={'700'}> {pageUser?.username} </Text>
              {
                (isLoggedIn && userData?.userId !== pageUser?.userId) &&
                <Button variant={"outline"} size={"xs"} onClick={handleToggleFollow}> {isFollowed ? "UNFOLLOW" : "FOLLOW"} </Button>
              }
            </Stack>
            <Text className={styles.userName} color={"brandgray.400"} fontSize={'md'} fontWeight={'400'}> {pageUser?.firstName && `${pageUser?.firstName} ${pageUser?.lastName} •`} {`${pageUser?.boxes?.length} boxes`} </Text>
          </Stack>
        </div>
        {
          !!pageUser?.folders?.length &&
          <>
            <Text fontSize={"lg"} fontWeight={"700"} sx={{ marginTop: "20px", marginBottom: "10px" }}> {`${pageUser.firstName || pageUser.username}'s`} public folders </Text>
            <div className={styles.folderList}>
              {
                pageUser?.folders?.filter(fol => fol.isPublic).map(folder => {
                  return (
                    <FolderTile folder={folder} />
                  )
                })
              }
            </div>
          </>
        }
        {
          !!pageUser?.boxes?.length &&
          <>
            <Text fontSize={"lg"} fontWeight={"700"} sx={{ marginTop: "20px", marginBottom: "10px" }}> {`${pageUser.firstName || pageUser.username}'s`} public boxes </Text>
            <div className={styles.boxList}>
              {
                pageUser?.boxes?.filter(box => box.isPublic).map(box => {
                  return (
                    <BoxTile box={box} displayUser={false} />
                  )
                })
              }
            </div>
          </>
        }
      </div>
    );
  }
  else if (error) {
    return (
      <div className={styles.homeContainer}>
        <Text fontSize={"xl"} fontWeight={"700"}> {error} </Text>
      </div>
    );
  }

  return (
    <></>
  )
}

export default withRouter(UserPage);