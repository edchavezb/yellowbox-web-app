import { useState, useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import GridView from 'components/box-views/GridView/GridView';
import ListView from 'components/box-views/ListView/ListView';
import TrackVisualizer from './TrackDetail/TrackVisualizer/TrackVisualizer'
import styles from "./ItemDetail.module.css"
import { Album, Artist, Playlist, Track } from 'core/types/interfaces';
import * as checkType from 'core/helpers/typeguards';
import { useAppSelector } from 'core/hooks/useAppSelector';
import { getSpotifyGenericToken } from 'core/api/spotify';

type MusicData = Artist | Album | Track | Playlist;

function ItemDetail() {
  const history = useHistory();
  const params = useParams<{ id: string, type: string }>()
  const isLoggedIn = useAppSelector(state => state.userData.isUserLoggedIn);
  const [itemData, setItemData] = useState<MusicData>({} as MusicData)
  const [itemContents, setItemContents] = useState({ items: [] })
  const [itemAlbum, setItemAlbum] = useState<Album>({ name: "", release_date: "", album_id: "", album_type: "", artists: [], external_urls: { spotify: "" }, id: "", images: [], total_tracks: 0, type: "album", uri: "" } as Album)
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
        const tokenResponse = await getSpotifyGenericToken()!;
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

  
  const getArtistLinks = (artists: Artist[]) => {
    const artistLinks = artists.slice(0, 3).map((artist, idx, arr) => {
      return <Link to={`/detail/artist/${artist.id}`} key={idx}><span className={styles.artistName}> {`${artist.name}${arr[idx + 1] ? ", " : ""}`} </span> </Link>;
    })

    return artistLinks;
  }

  const removeDuplicatesByProperty = <T extends Artist | Album | Track | Playlist>(arrayObj: T[], propertyName: string) => {
    const newArr = arrayObj.filter((element, index) => {
      return index === arrayObj.map(e => e[propertyName as keyof T]).indexOf(element[propertyName as keyof T]);
    })
    return newArr;
  }

  const getAlbumRunningTime = (tracks: Track[]) => {
    const milliSecs = tracks.map(track => track.duration_ms).reduce((prev, curr) => { return prev + curr });
    const minutes = Math.floor(milliSecs / 60000);
    const seconds = Math.floor((milliSecs % 60000) / 1000);
    return `${minutes} min, ${seconds} sec`
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
          <ListView sectionType={'tracks'} data={attachAlbumDataToTracks(itemData as Album)} />
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

  if (!isLoading) {
    return (
      <div className={styles.itemDetailContainer}>
        <div className={styles.itemDataViewer}>
          <img
            className={styles.itemImage}
            src={
              (
                itemData.type === "track"
                  ? (itemData as Track).album!.images[0]?.url
                  : (itemData as Album | Artist | Playlist).images![0]?.url
              )
              || "https://via.placeholder.com/150"
            }
            alt={itemData.name}
          >
          </img>
          <div className={styles.metadataContainer}>

            <div className={styles.itemTitle}> {itemData.name} </div>

            {checkType.isArtist(itemData) ?
              <div className={styles.itemDetails}>
                {itemData.genres &&
                  itemData.genres.slice(0, 3).map((genre, idx, arr) => {
                    return (
                      <span key={genre}>
                        {genre.split(" ").map((word, i, a) => {
                          return `${word.charAt(0).toUpperCase()}${word.slice(1)}${a[i + 1] ? " " : ""}`
                        })}{arr[idx + 1] ? ", " : ""}
                      </span>
                    )
                  })}
              </div>
              : ""
            }

            {checkType.isAlbum(itemData) ?
              <div className={styles.itemDetails}>
                {`${itemData.album_type.charAt(0).toUpperCase()}${itemData.album_type.slice(1)}`}
                {` by `}{getArtistLinks(itemData.artists)} |
                {` ${itemData.release_date.split("-")[0]}`} |
                {` ${itemData.total_tracks} tracks`} |
                {` ${getAlbumRunningTime(itemData.tracks!.items)}`}
              </div>
              : ""
            }

            {checkType.isTrack(itemData) ?
              <div className={styles.itemDetails}>
                {`${itemData.type.charAt(0).toUpperCase()}${itemData.type.slice(1)}`}
                {` by `}{getArtistLinks(itemData.artists)} |
                {` ${itemData.album!.release_date.split("-")[0]}`} |
                {` ${Math.floor(itemData.duration_ms / 60000)}`.padStart(2, "0") + ":" + `${Math.floor(itemData.duration_ms % 60000 / 1000)}`.padStart(2, "0")}
              </div>
              : ""
            }

            {checkType.isPlaylist(itemData) ?
              <div className={styles.itemDetails}>
                {`${itemData.type.charAt(0).toUpperCase()}${itemData.type.slice(1)}`}
                {` by `}<a href={itemData.owner.uri}><span> {itemData.owner.display_name} </span></a> |
                {` ${itemData.tracks.total} tracks`} |
                {` ${itemData.description}`}
              </div>
              : ""
            }

          </div>
        </div>
        <hr />
        {
          checkType.isArtist(itemData) &&
          <h3 className={styles.popularReleases}>Popular releases</h3>
        }
        {getListComponent()}
      </div>
    );
  } 

  return (
    <></>
  )
}

export default ItemDetail;