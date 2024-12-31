import { useState, useEffect, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import GridView from 'components/box-views/GridView/GridView';
import ListView from 'components/box-views/ListView/ListView';
import TrackVisualizer from './TrackDetail/TrackVisualizer/TrackVisualizer'
import styles from "./ItemDetail.module.css"
import { Album, ApiAlbum, ApiArtist, ApiPlaylist, ApiTrack, Artist, Playlist, Track } from 'core/types/interfaces';
import * as checkType from 'core/helpers/typeguards';
import { useAppSelector } from 'core/hooks/useAppSelector';
import { getSpotifyGenericTokenApi } from 'core/api/spotify';
import PopperMenu from 'components/menus/popper/PopperMenu';
import BoxItemMenu from 'components/menus/popper/BoxItemMenu/BoxItemMenu';
import ArtistHeader from './ArtistHeader/ArtistHeader';
import AlbumHeader from './AlbumHeader/AlbumHeader';
import TrackHeader from './TrackHeader/TrackHeader';
import PlaylistHeader from './PlaylistHeader/PlaylistHeader';
import TrackList from 'components/box-views/TrackList/TrackList';
import { Text } from '@chakra-ui/react'
import { extractApiData } from 'core/helpers/itemDataHandlers';

type ApiMusicData = ApiArtist | ApiAlbum | ApiTrack | ApiPlaylist;

function ItemDetail() {
  const history = useHistory();
  const params = useParams<{ id: string, type: string }>()
  const menuToggleRef = useRef(null);
  const isLoggedIn = useAppSelector(state => state.userData.isUserLoggedIn);
  const [itemData, setItemData] = useState<ApiMusicData>({} as ApiMusicData)
  const [itemContents, setItemContents] = useState({ items: [] })
  const [itemAlbum, setItemAlbum] = useState<ApiAlbum>({ name: "", release_date: "", album_id: "", album_type: "", artists: [], external_urls: { spotify: "" }, id: "", images: [], total_tracks: 0, type: "album", uri: "" } as ApiAlbum)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isItemMenuOpen, setIsItemMenuOpen] = useState(false);

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
        }
      }
      catch (err) {
        console.log(err)
      }
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
          <ArtistHeader itemData={itemData} />
        }
        {checkType.isApiAlbum(itemData) &&
          <AlbumHeader itemData={itemData} />
        }
        {checkType.isApiTrack(itemData) &&
          <TrackHeader itemData={itemData} />
        }
        {checkType.isApiPlaylist(itemData) &&
          <PlaylistHeader itemData={itemData} />
        }
        <div className={styles.separator} />
        {
          checkType.isApiArtist(itemData) &&
          <Text fontSize={"lg"} fontWeight={"700"} sx={{ marginTop: '15px', marginBottom: "10px"}}>
            Popular releases
          </Text>
        }
        {getListComponent()}
      </div>
      <PopperMenu referenceRef={menuToggleRef} placement={'bottom-start'} isOpen={isItemMenuOpen} setIsOpen={setIsItemMenuOpen}>
        <BoxItemMenu itemData={extractApiData(itemData)} itemType={itemData.type} isOpen={isItemMenuOpen} setIsOpen={setIsItemMenuOpen} />
      </PopperMenu>
    </>
  );
}

export default ItemDetail;