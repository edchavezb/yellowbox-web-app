import { useAppSelector } from 'core/hooks/useAppSelector';
import styles from './LinkedServices.module.css'
import { Box, Text } from '@chakra-ui/react';
import AppButton from 'components/styled/AppButton/AppButton';
import { useCallback, useEffect, useState } from 'react';
import { SpotifyAccountInfo } from 'core/types/interfaces';
import { refreshSpotifyTokenApi, spotifyLoginApi } from 'core/api/spotify';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { setAccessToken } from 'core/features/spotifyService/spotifyLoginSlice';
import { unlinkUserSpotifyAccountApi } from 'core/api/users';
import { updateUserSpotifyAccount } from 'core/features/user/userSlice';
import { Link } from 'react-router-dom';


const LinkedServices = () => {
  const dispatch = useAppDispatch();
  const spotifyAuthData = useAppSelector(state => state.spotifyLoginData.userData.auth)
  const user = useAppSelector(state => state.userData.authenticatedUser);
  const [spotifyAccountInfo, setSpotifyAccountInfo] = useState<SpotifyAccountInfo>({})

  const fetchSpotifyAccountInfo = useCallback(async (token: string) => {
    const response = await fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const {
      display_name,
      email,
      images,
      uri
    } = await response.json()
    setSpotifyAccountInfo({ displayName: display_name, email, images, uri })
  }, [])

  const handleLinkSpotify = async () => {
    const response = await spotifyLoginApi();
    if (response) {
      window.location.replace(response.url)
    }
  }

  const handleUnlinkSpotify = async () => {
    const updatedServices = await unlinkUserSpotifyAccountApi(user.userId);
    if (updatedServices) {
      dispatch(updateUserSpotifyAccount(null));
    }
  }

  const handleLinkAppleMusic = async () => {

  }

  const handleUninkAppleMusic = async () => {

  }

  const handleLinkLastFm = async () => {

  }

  const handleUninkLastFm = async () => {

  }

  useEffect(() => {
    const getAllLinkedServices = async () => {
      if (spotifyAuthData?.refreshToken) {
        try {
          const refreshResponse = await refreshSpotifyTokenApi(spotifyAuthData.refreshToken)
          const { access_token: accessToken } = refreshResponse!;
          dispatch(setAccessToken({ accessToken }));
          fetchSpotifyAccountInfo(accessToken)
        }
        catch (err) {
          console.log(err)
        }
      }
    }
    getAllLinkedServices();
  }, [spotifyAuthData?.refreshToken, fetchSpotifyAccountInfo, dispatch])

  return (
    <div className={styles.container}>
      <Text className={styles.mobileTitle} fontWeight={700} marginBottom={'20px'}> Linked Services </Text>
      {
        user.spotifyAccount &&
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} width={'100%'}>
          <div className={styles.userWrapper}>
            <Link to={'/linked-services/spotify'}>
              <img className={styles.serviceIconSmall} src='/icons/spotify_icon.png' alt='spotify'></img>
            </Link>            <Box>
              <Text className={styles.smallText} fontSize={'sm'} fontWeight={'300'}> SPOTIFY </Text>
              <Text className={styles.userName} fontSize={'md'} fontWeight={'700'}> Signed in as {spotifyAccountInfo.displayName} </Text>
            </Box>
          </div>
          <AppButton text={'Remove'} onClick={handleUnlinkSpotify} />
        </Box>
      }
      {
        user.appleMusicAccount &&
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} width={'100%'}>
          <div className={styles.userWrapper}>
            <img className={styles.serviceIconSmall} src='/icons/spotify_icon.png' alt='spotify'></img>
            <Box>
              <Text className={styles.smallText} fontSize={'sm'} fontWeight={'300'}> SPOTIFY </Text>
              <Text className={styles.userName} fontSize={'md'} fontWeight={'700'}> Signed in as {spotifyAccountInfo.displayName} </Text>
            </Box>
          </div>
          <AppButton text={'Remove'} onClick={handleUninkAppleMusic} />
        </Box>
      }
      {
        user.lastFmAccount &&
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} width={'100%'}>
          <div className={styles.userWrapper}>
            <img className={styles.serviceIconSmall} src='/icons/spotify_icon.png' alt='spotify'></img>
            <Box>
              <Text className={styles.smallText} fontSize={'sm'} fontWeight={'300'}> SPOTIFY </Text>
              <Text className={styles.userName} fontSize={'md'} fontWeight={'700'}> Signed in as {spotifyAccountInfo.displayName} </Text>
            </Box>
          </div>
          <AppButton text={'Remove'} onClick={handleUninkLastFm} />
        </Box>
      }
      <Text fontSize={'md'} fontWeight={'700'} marginTop={user?.spotifyAccount || user?.appleMusicAccount || user.lastFmAccount? '35px' : '0px'}> Add a new service </Text>
      <Box display={'flex'} alignItems={'center'} gap={'20px'} width={'100%'} marginTop={'15px'} flexWrap={'wrap'}>
        {
          !user?.spotifyAccount &&
          <Box className={styles.serviceCard} border={"1px solid"} borderColor={"brandgray.600"}>
            <img className={styles.serviceIconLarge} src='/icons/spotify_icon.png' alt='spotify'></img>
            <Text fontSize={'md'} fontWeight={'500'}> Spotify </Text>
            <AppButton text={'Link Service'} onClick={handleLinkSpotify} />
          </Box>
        }
        {
          !user?.appleMusicAccount &&
          <Box className={styles.serviceCard} border={"1px solid"} borderColor={"brandgray.600"}>
            <img className={styles.serviceIconLarge} src='/icons/applemusic_icon.svg' alt='lastfm'></img>
            <Text fontSize={'md'} fontWeight={'500'}> Apple Music </Text>
            <AppButton text={'Coming Soon'} onClick={handleLinkAppleMusic} disabled />
          </Box>
        }
        {
          !user.lastFmAccount &&
          <Box className={styles.serviceCard} border={"1px solid"} borderColor={"brandgray.600"}>
            <img className={styles.serviceIconLarge} src='/icons/lastfm_icon.svg' alt='lastfm'></img>
            <Text fontSize={'md'} fontWeight={'500'}> Last.fm </Text>
            <AppButton text={'Coming Soon'} onClick={handleLinkLastFm} disabled />
          </Box>
        }
      </Box>
    </div>
  );
};

export default LinkedServices;