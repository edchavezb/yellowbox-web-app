import styles from "./UserPage.module.css";
import { useParams, withRouter } from "react-router-dom";
import { useAppSelector } from "core/hooks/useAppSelector";
import FolderTile from "components/common/FolderTile/FolderTile";
import BoxTile from "components/common/BoxTile/BoxTile";
import ContextSearchResult from "components/common/ContextSearchResult/ContextSearchResult";
import { Box, Button, Stack, Text } from '@chakra-ui/react';
import { followUserApi, getUserPageDataApi, unfollowUserApi } from "core/api/users";
import { useEffect, useState } from "react";
import DefaultUserImage from "components/common/DefaultUserImage/DefaultUserImage";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { setCurrentUserDetail } from "core/features/currentUserDetail/currentUserDetailSlice";
import { setModalState } from "core/features/modal/modalSlice";
import { updateUserFollowedList } from "core/features/user/userSlice";

function UserPage() {
  const dispatch = useAppDispatch();
  const { username } = useParams<{ username: string }>();
  const isLoggedIn = useAppSelector(state => state.userData.isUserLoggedIn);
  const viewingUserData = useAppSelector(state => state.userData.authenticatedUser);
  const followedUsers = viewingUserData?.followedUsers || [];
  const pageUser = useAppSelector(state => state.currentUserDetailData.user);
  const isFollowed = followedUsers?.some(followedUser => followedUser.userId === pageUser?.userId);
  const [error, setError] = useState<string | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserPageDataApi(username);
        dispatch(setCurrentUserDetail(response));
        setUserImage(response.pageUser?.imageUrl || null);
      }
      catch (err) {
        console.log(err);
        setError("Sorry. The user was not found.");
      }
    }
    fetchUserData();
  }, [username, followedUsers]);

  const handleToggleFollow = async () => {
    try {
      if (isFollowed) {
        const response = await unfollowUserApi(pageUser?.userId!);
        dispatch(updateUserFollowedList(response));
      } else {
        const response = await followUserApi(pageUser?.userId!);
        dispatch(updateUserFollowedList(response));
      }
    } catch (err) {
      console.error("Failed to toggle follow status:", err);
    }
  };

  const handleViewFollowers = () => {
    const modalTitle = `${pageUser!.username}'s followers`;
    dispatch(setModalState({ visible: true, type: "User Friends List", page: "User Page", viewingFriendsList: "followers", customTitle: modalTitle }));
  }

  const handleViewFollowedUsers = () => {
    const modalTitle = `${pageUser!.username}'s followed users`;
    dispatch(setModalState({ visible: true, type: "User Friends List", page: "User Page", viewingFriendsList: "followedUsers", customTitle: modalTitle }));
  }

  const handleImageError = async () => {
    setUserImage(null);
  }

  if (!error && pageUser) {
    return (
      <div className={styles.homeContainer}>
        <div className={styles.userWrapper}>
          {userImage ? (
            <img
              className={styles.userImage}
              id={styles.userImage}
              src={userImage}
              alt="user"
              onError={handleImageError}
            />
          ) : (
            <DefaultUserImage width={120} />
          )}
          <Stack spacing={0} width={"100%"}>
            <Stack direction={"row"} width={"100%"} spacing={"20px"} alignItems={"center"}>
              <Text className={styles.userName} fontSize={'2xl'} fontWeight={'700'}> {pageUser?.username} </Text>
              {
                (isLoggedIn && viewingUserData?.userId !== pageUser?.userId) &&
                <Button variant={"outline"} size={"xs"} onClick={handleToggleFollow}> {isFollowed ? "UNFOLLOW" : "FOLLOW"} </Button>
              }
            </Stack>
            <Text className={styles.userName} color={"brandgray.400"} fontSize={'md'} fontWeight={'400'}>
              {pageUser?.firstName && `${pageUser?.firstName} ${pageUser?.lastName}`}
              {pageUser?.bio && (
                pageUser?.firstName ? (
                  <>
                    <Box as="span" display="inline" mx={2}>&bull;</Box>
                    <Text as="span" fontStyle="italic" display="inline">{pageUser.bio}</Text>
                  </>
                ) : (
                  <Text as="span" fontStyle="italic" display="inline">{pageUser.bio}</Text>
                )
              )}
            </Text>
            <Box display={"flex"} gap={"15px"} alignItems={"center"}>
              <Button variant={"plain"} size={"sm"} padding={'0px'} cursor={'default'}> {` ${pageUser?.boxes?.length} boxes`} </Button>
              <Button variant={"plain"} size={"sm"} onClick={handleViewFollowers} padding={'0px'} _hover={{ textDecoration: 'underline' }}>
                {` ${pageUser?.followers?.length} followers`}
              </Button>
              <Button variant={"plain"} size={"sm"} onClick={handleViewFollowedUsers} padding={'0px'} _hover={{ textDecoration: 'underline' }} >
                {` ${pageUser?.followedUsers?.length} following`}
              </Button>
            </Box>
          </Stack>
        </div>
        {
          <Box display="flex" gap={4} alignItems="flex-start">
            <Box flex={1} minWidth={0}>
              <Text fontSize={"lg"} fontWeight={"700"} sx={{ marginTop: "30px", marginBottom: "10px" }}> {`${pageUser.firstName || pageUser.username}'s`} public collection </Text>
              <div className={styles.folderList}>
                {
                  !!pageUser?.folders?.length &&
                  pageUser?.folders?.filter(fol => fol.isPublic).map(folder => {
                    return (
                      <FolderTile folder={folder} />
                    )
                  })
                }
                {
                  !!pageUser?.boxes?.length &&
                  pageUser?.boxes?.filter(box => box.isPublic && !box.folderId).map(box => {
                    return (
                      <BoxTile box={box} displayUser={false} />
                    )
                  })
                }
              </div>
            </Box>
            <Box width="300px"  style={{ marginTop: '30px' }}>
              <Text fontSize="lg" fontWeight={700} mb={2}>Top Albums</Text>
              <Box display="flex" flexDirection="column" gap={2} backgroundColor={'brandgray.600'} borderRadius="10px" style={{ padding: '16px 10px', minHeight: '100px' }}>
                {(!pageUser?.topAlbums || pageUser.topAlbums.length === 0) ? (
                  <Text textAlign="center" color="gray.300" padding={6} fontSize={'sm'}>
                    {`${pageUser?.firstName || pageUser?.username} has not added any albums to their top 5 yet`}
                  </Text>
                ) : (
                  pageUser.topAlbums.slice().sort((a, b) => (a.position || 0) - (b.position || 0)).map(top => (
                    <ContextSearchResult
                      key={top.topAlbumId || top.albumId}
                      imageUrl={top.album.images?.[0]?.url || '/icons/music.svg'}
                      name={top.album.name}
                      owner={top.album.artists?.[0]?.name || ''}
                      itemId={top.album.spotifyId}
                      ownerId={top.album.artists?.[0]?.spotifyId || ''}
                      itemType={"album"}
                    />
                  ))
                )}
              </Box>
            </Box>
          </Box>
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