import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import GridView from 'components/box-views/GridView/GridView';
import ListView from 'components/box-views/ListView/ListView';
import TrackVisualizer from './TrackDetail/TrackVisualizer/TrackVisualizer'
import styles from "./ItemDetail.module.css"
import { ApiAlbum, ApiArtist, ApiPlaylist, ApiTrack } from 'core/types/interfaces';
import * as checkType from 'core/helpers/typeguards';
import { getSpotifyGenericTokenApi } from 'core/api/spotify';
import ArtistHeader from './ArtistHeader/ArtistHeader';
import AlbumHeader from './AlbumHeader/AlbumHeader';
import TrackHeader from './TrackHeader/TrackHeader';
import PlaylistHeader from './PlaylistHeader/PlaylistHeader';
import TrackList from 'components/box-views/TrackList/TrackList';
import { Text } from '@chakra-ui/react'
import { extractApiData } from 'core/helpers/itemDataHandlers';
import { useAppSelector } from 'core/hooks/useAppSelector';
import { checkAlbumPlayedByUserApi, checkArtistPlayedByUserApi, checkPlaylistPlayedByUserApi, checkTrackPlayedByUserApi, markAlbumAsPlayedApi, markArtistAsPlayedApi, markPlaylistAsPlayedApi, markTrackAsPlayedApi, removeAlbumPlayApi, removeArtistPlayApi, removePlaylistPlayApi, removeTrackPlayApi } from 'core/api/items';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { initErrorToast, initMarkedAsPlayedToast } from 'core/features/toast/toastSlice';

type ApiMusicData = ApiArtist | ApiAlbum | ApiTrack | ApiPlaylist;

function ItemDetail() {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.userData.authenticatedUser);
  const params = useParams<{ id: string, type: string }>()
  const [itemData, setItemData] = useState<ApiMusicData>({} as ApiMusicData)
  const [itemContents, setItemContents] = useState({ items: [] })
  const [itemAlbum, setItemAlbum] = useState<ApiAlbum>({ name: "", release_date: "", album_id: "", album_type: "", artists: [], external_urls: { spotify: "" }, id: "", images: [], total_tracks: 0, type: "album", uri: "" } as ApiAlbum)
  const [isPlayedByUser, setIsPlayedByUser] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const handleDetailData = async (typeParam: string, idParam: string) => {
      let itemQuery: string;
      let contentsQuery: string;
      switch (typeParam) {
        case 'album':
          itemQuery = `https://api.spotify.com/v1/albums/${idParam}`
          contentsQuery = `https://api.spotify.com/v1/albums/${idParam}/tracks`
          break;
        case 'artist':
          itemQuery = `https://api.spotify.com/v1/artists/${idParam}`
          contentsQuery = `https://api.spotify.com/v1/artists/${idParam}/albums?market=us`
          break;
        case 'track':
          itemQuery = `https://api.spotify.com/v1/tracks/${idParam}`
          contentsQuery = `https://api.spotify.com/v1/tracks/${idParam}`
          break;
        case 'playlist':
          itemQuery = `https://api.spotify.com/v1/playlists/${idParam}`
          contentsQuery = `https://api.spotify.com/v1/playlists/${idParam}/tracks`
          break;
        default:
          itemQuery = ``
          contentsQuery = ``
          break;
      }
      try {
        const tokenResponse = await getSpotifyGenericTokenApi()!;
        const { access_token: accessToken } = tokenResponse!;
        if (accessToken) {
          getItemData(typeParam, itemQuery, accessToken)
          getContents(contentsQuery, accessToken)
          getCheckPlayedByUser(typeParam, idParam)
        }
      }
      catch (err) {
        console.log(err)
      }
    }

    const getCheckPlayedByUser = async (type: string, spotifyId: string) => {
      let isItemPlayedByUser = false;
      if (currentUser) {
        if (type === 'artist') {
          isItemPlayedByUser = (await checkArtistPlayedByUserApi(spotifyId, currentUser.userId)).played;
        }
        else if (type === 'album') {
          isItemPlayedByUser = (await checkAlbumPlayedByUserApi(spotifyId, currentUser.userId)).played;
        }
        else if (type === 'track') {
          isItemPlayedByUser = (await checkTrackPlayedByUserApi(spotifyId, currentUser.userId)).played;
        }
        else if (type === 'playlist') {
          isItemPlayedByUser = (await checkPlaylistPlayedByUserApi(spotifyId, currentUser.userId)).played;
        }
      }
      setIsPlayedByUser(isItemPlayedByUser);
    }

    const getItemData = async (type: string, query: string, token: string) => {
      const response = await fetch(query, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json();
      data.id = data.id;
      setItemData(data)
      if (type === "track") {
        getItemAlbum(`https://api.spotify.com/v1/albums/${data.album.id}`, token)
      }
    }

    const getContents = async (query: string, token: string) => {
      const response = await fetch(query, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json();
      setItemContents(data)
    }

    const getItemAlbum = async (query: string, token: string) => {
      const response = await fetch(query, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json();
      setItemAlbum(data);
    }

    handleDetailData(params.type, params.id)
  }, [params.type, params.id, history.location.pathname]);

  useEffect(() => {
    if (itemData.id !== undefined) {
      setIsLoading(false)
    }
  }, [itemData]);

  const handleTogglePlayedByUser = async (newPlayedStatus: boolean) => {
    try {
      if (checkType.isApiArtist(itemData)) {
        if (isPlayedByUser) {
          await removeArtistPlayApi(itemData.id, currentUser?.userId!);
        }
        else {
          await markArtistAsPlayedApi(extractApiData(itemData), currentUser?.userId!);
        }
      }
      else if (checkType.isApiAlbum(itemData)) {
        if (isPlayedByUser) {
          await removeAlbumPlayApi(itemData.id, currentUser?.userId!);
        }
        else {
          await markAlbumAsPlayedApi(extractApiData(itemData), currentUser?.userId!);
        }
      }
      else if (checkType.isApiTrack(itemData)) {
        if (isPlayedByUser) {
          await removeTrackPlayApi(itemData.id, currentUser?.userId!);
        }
        else {
          await markTrackAsPlayedApi(extractApiData(itemData), currentUser?.userId!);
        }
      }
      else if (checkType.isApiPlaylist(itemData)) {
        if (isPlayedByUser) {
          await removePlaylistPlayApi(itemData.id, currentUser?.userId!);
        }
        else {
          await markPlaylistAsPlayedApi(extractApiData(itemData), currentUser?.userId!);
        }
      }
      dispatch(initMarkedAsPlayedToast({ itemType: itemData.type, newPlayedStatus }));
    }
    catch (err) {
      console.log(err)
      dispatch(initErrorToast({ error: `Failed to update played status` }))
    }
    setIsPlayedByUser(newPlayedStatus);
  };

  const removeDuplicatesByProperty = <T extends ApiArtist | ApiAlbum | ApiTrack | ApiPlaylist>(arrayObj: T[], propertyName: string) => {
    const newArr = arrayObj.filter((element, index) => {
      return index === arrayObj.map(e => e[propertyName as keyof T]).indexOf(element[propertyName as keyof T]);
    })
    return newArr;
  }

  const attachAlbumDataToTracks = (parentItem: ApiAlbum): ApiTrack[] => {
    return parentItem.tracks!.items.map(track => ({
      album: {
        album_type: parentItem.album_type,
        artists: parentItem.artists,
        id: parentItem.id,
        images: parentItem.images,
        name: parentItem.name,
        release_date: parentItem.release_date,
        type: parentItem.type,
        total_tracks: parentItem.total_tracks
      }, ...track
    }))
  }

  const getListComponent = () => {
    let listComponent;
    switch (params.type) {
      case "album":
        listComponent =
          <TrackList sectionType={'tracks'} data={attachAlbumDataToTracks(itemData as ApiAlbum)} />
        break;
      case "playlist":
        listComponent =
          <ListView sectionType={'tracks'} data={(itemData as ApiPlaylist).tracks.items.map(item => extractApiData(item.track))} />
        break;
      case "artist":
        listComponent =
          <GridView
            data={removeDuplicatesByProperty<ApiAlbum>(itemContents.items, "name").filter((album: ApiAlbum) => album.album_type !== 'compilation').map(item => extractApiData(item))}
          />
        break;
      case "track":
        listComponent =
          <TrackVisualizer data={itemData as ApiTrack} album={itemAlbum} page="detail" boxId={undefined} />
        break;
      default:
        listComponent = <div></div>
        break;
    }
    return listComponent;
  }

  if (isLoading) {
    return (
      <></>
    )
  }

  return (
    <>
      <div className={styles.itemDetailContainer}>
        {checkType.isApiArtist(itemData) &&
          <ArtistHeader
            itemData={itemData}
            isPlayedByUser={isPlayedByUser}
            handleTogglePlayed={() => handleTogglePlayedByUser(!isPlayedByUser)}
            isUserLoggedIn={!!currentUser}
          />
        }
        {checkType.isApiAlbum(itemData) &&
          <AlbumHeader
            itemData={itemData}
            isPlayedByUser={isPlayedByUser}
            handleTogglePlayed={() => handleTogglePlayedByUser(!isPlayedByUser)}
            isUserLoggedIn={!!currentUser}
          />
        }
        {checkType.isApiTrack(itemData) &&
          <TrackHeader
            itemData={itemData}
            isPlayedByUser={isPlayedByUser}
            handleTogglePlayed={() => handleTogglePlayedByUser(!isPlayedByUser)}
            isUserLoggedIn={!!currentUser}
          />
        }
        {checkType.isApiPlaylist(itemData) &&
          <PlaylistHeader
            itemData={itemData}
            isPlayedByUser={isPlayedByUser}
            handleTogglePlayed={() => handleTogglePlayedByUser(!isPlayedByUser)}
            isUserLoggedIn={!!currentUser}
          />
        }
        <div className={styles.separator} />
        {
          checkType.isApiArtist(itemData) &&
          <Text fontSize={"lg"} fontWeight={"700"} sx={{ marginTop: '15px', marginBottom: "10px" }}>
            Popular releases
          </Text>
        }
        {getListComponent()}
      </div>
    </>
  );
}

export default ItemDetail;