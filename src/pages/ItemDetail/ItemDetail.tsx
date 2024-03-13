import { useState, useEffect, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import GridView from 'components/box-views/GridView/GridView';
import ListView from 'components/box-views/ListView/ListView';
import TrackVisualizer from './TrackDetail/TrackVisualizer/TrackVisualizer'
import styles from "./ItemDetail.module.css"
import { Album, Artist, Playlist, Track } from 'core/types/interfaces';
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

type MusicData = Artist | Album | Track | Playlist;

function ItemDetail() {
  const history = useHistory();
  const params = useParams<{ id: string, type: string }>()
  const menuToggleRef = useRef(null);
  const isLoggedIn = useAppSelector(state => state.userData.isUserLoggedIn);
  const [itemData, setItemData] = useState<MusicData>({} as MusicData)
  const [itemContents, setItemContents] = useState({ items: [] })
  const [itemAlbum, setItemAlbum] = useState<Album>({ name: "", release_date: "", album_id: "", album_type: "", artists: [], external_urls: { spotify: "" }, id: "", images: [], total_tracks: 0, type: "album", uri: "" } as Album)
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

  const removeDuplicatesByProperty = <T extends Artist | Album | Track | Playlist>(arrayObj: T[], propertyName: string) => {
    const newArr = arrayObj.filter((element, index) => {
      return index === arrayObj.map(e => e[propertyName as keyof T]).indexOf(element[propertyName as keyof T]);
    })
    return newArr;
  }

  const attachAlbumDataToTracks = (parentItem: Album) => {
    return parentItem.tracks!.items.map(e => ({
      'album': {
        "album_type": parentItem.album_type,
        "artists": parentItem.artists,
        "external_urls": parentItem.external_urls,
        "id": parentItem.id,
        'images': parentItem.images,
        "name": parentItem.name,
        "release_date": parentItem.release_date,
        "type": parentItem.type,
        "uri": parentItem.uri
      }, ...e
    }))
  }

  const getListComponent = () => {
    let listComponent;
    switch (params.type) {
      case "album":
        listComponent =
          <TrackList sectionType={'tracks'} data={(itemData as Album).tracks!.items} />
        break;
      case "playlist":
        listComponent =
          <ListView sectionType={'tracks'} data={itemContents.items.map((e) => e['track'])} />
        break;
      case "artist":
        listComponent =
          <GridView
            data={removeDuplicatesByProperty(itemContents.items, "name").filter((album: Album) => album.album_type !== 'compilation')}
          />
        break;
      case "track":
        listComponent =
          <TrackVisualizer data={itemData as Track} album={itemAlbum} page="detail" boxId={undefined} />
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
        {checkType.isArtist(itemData) &&
          <ArtistHeader itemData={itemData} />
        }
        {checkType.isAlbum(itemData) &&
          <AlbumHeader itemData={itemData} />
        }
        {checkType.isTrack(itemData) &&
          <TrackHeader itemData={itemData} />
        }
        {checkType.isPlaylist(itemData) &&
          <PlaylistHeader itemData={itemData} />
        }
        <div className={styles.separator} />
        {
          checkType.isArtist(itemData) &&
          <h3 className={styles.popularReleases}>Popular releases</h3>
        }
        {getListComponent()}
      </div>
      <PopperMenu referenceRef={menuToggleRef} placement={'bottom-start'} isOpen={isItemMenuOpen} setIsOpen={setIsItemMenuOpen}>
        <BoxItemMenu itemData={itemData} itemType={itemData.type} setIsOpen={setIsItemMenuOpen} />
      </PopperMenu>
    </>
  );
}

export default ItemDetail;