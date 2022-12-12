import { useState, useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import axios from 'axios'
import querystring from 'querystring'
import credentials from '../keys'

import GridView from '../components/box-views/GridView';
import ListView from '../components/box-views/ListView';
import TrackVisualizer from '../components/box-views/TrackVisualizer';

import styles from "./ItemDetail.module.css"
import { Album, Artist, Playlist, Track, UserBox } from '../core/types/interfaces';
import * as checkType from '../core/helpers/typeguards';

// TODO: Handle promises better

type MusicData = Artist | Album | Track | Playlist;

type BoxSections = Pick<UserBox, "albums" | "artists" | "tracks" | "playlists">

function ItemDetail() {

  const history = useHistory();
  const params = useParams<{id: string, type: string}>()
  const [itemData, setItemData] = useState<MusicData>({} as MusicData)
  const [itemListType, setItemListType] = useState("")
  const [itemContents, setItemContents] = useState({ items: [] })
  const [itemAlbum, setItemAlbum] = useState<Album>({name: "", release_date: "", album_id:"", album_type:"", artists: [], external_urls: {spotify: ""}, id:"", images: [], total_tracks:0, type:"album", uri:""} as Album)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    handleDetailData(params.type, params.id)
  }, [params.type, params.id, history.location.pathname]);

  useEffect(() => {
    if (itemData.id !== undefined){
      setIsLoading(false)
    }
  }, [itemData]);

  useEffect(() => console.log(itemContents), [itemContents]);

  const handleDetailData = async (typeParam: string, idParam: string) => {

    let itemQuery: string;
    let contentsQuery: string;
    switch (typeParam) {
      case 'album':
        itemQuery = `https://api.spotify.com/v1/albums/${idParam}`
        contentsQuery = `https://api.spotify.com/v1/albums/${idParam}/tracks`
        setItemListType("tracklist")
        break;
      case 'artist':
        itemQuery = `https://api.spotify.com/v1/artists/${idParam}`
        contentsQuery = `https://api.spotify.com/v1/artists/${idParam}/albums?market=us`
        setItemListType("albumlist")
        break;
      case 'track':
        itemQuery = `https://api.spotify.com/v1/tracks/${idParam}`
        contentsQuery = `https://api.spotify.com/v1/tracks/${idParam}`
        break;
      case 'playlist':
        itemQuery = `https://api.spotify.com/v1/playlists/${idParam}`
        contentsQuery = `https://api.spotify.com/v1/playlists/${idParam}/tracks`
        setItemListType("tracklist")
        break;
      default:
        break;
    }

    axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: querystring.stringify({ grant_type: 'client_credentials' }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          `Basic ${Buffer.from(credentials.id + ':' + credentials.secret).toString('base64')}`
      }
    })
      .then(response => {
        getItemData(typeParam, itemQuery, response.data.access_token)
        getContents(contentsQuery, response.data.access_token)
      })
      .catch(error => {
        console.log(error);
      });
  }

  const getItemData = (type: string, query: string, auth: string) => {
    axios({
      method: 'get',
      url: query,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${auth}`
      }
    })
      .then(response => {
        console.log(response.data)
        setItemData(response.data)
        if (type === "track") {
          getItemAlbum(`https://api.spotify.com/v1/albums/${response.data.album.id}`, auth)
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  const getContents = (query: string, auth: string) => {
    axios({
      method: 'get',
      url: query,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${auth}`
      }
    })
      .then(response => {
        console.log(response.data)
        setItemContents(response.data)
      })
      .catch(error => {
        console.log(error);
      });
  }

  const getItemAlbum = (query: string, auth: string) => {
    axios({
      method: 'get',
      url: query,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${auth}`
      }
    })
      .then(response => {
        console.log(response.data)
        setItemAlbum(response.data)
      })
      .catch(error => {
        console.log(error);
      });
  }

  const getArtistLinks = (artists: Artist[]) => {
    const artistLinks = artists.slice(0, 3).map((artist, idx, arr) => {
      return <Link to={`/detail/artist/${artist.id}`} key={idx}><span className={styles.artistName}> {`${artist.name}${arr[idx+1] ? ", " : ""}`} </span> </Link>;
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
    const milliSecs = tracks.map(track => track.duration_ms).reduce((prev, curr) => {return prev + curr});
    const minutes = Math.floor(milliSecs / 60000);
    const seconds = Math.floor((milliSecs % 60000) / 1000);
    return `${minutes} min, ${seconds} sec`
  }

  const attachAlbumDataToTracks = (parentItem: Album) => {
    console.log(parentItem);
    return parentItem.tracks!.items.map(e => ({'album': {
      "album_type" : parentItem.album_type, 
      "artists" : parentItem.artists, 
      "external_urls" : parentItem.external_urls, 
      "id" : parentItem.id,
      'images': parentItem.images,
      "name" : parentItem.name, 
      "release_date" : parentItem.release_date, 
      "type" : parentItem.type, 
      "uri" : parentItem.uri
    }, ...e}))
  }

  const getListComponent = () => {
    let listComponent;
    switch (params.type){
      case "album" :
        listComponent = 
        <ListView listType={itemListType} data={attachAlbumDataToTracks(itemData as Album)} page="detail" customSorting={false} boxId={undefined} />
      break;
      case "playlist" :
        listComponent = 
        <ListView listType={itemListType} data={itemContents.items.map((e) => e['track'])} page="detail" customSorting={false} boxId={undefined} />
      break;
      case "artist" :
        listComponent = 
        <GridView 
          data={removeDuplicatesByProperty(itemContents.items, "name").filter((album: Album) => album.album_type !== 'compilation')} 
          page="detail" 
          customSorting={false} 
          boxId={undefined} 
        />
      break;
      case "track" :
        listComponent = 
        <TrackVisualizer data={itemData as Track} album={itemAlbum} page="detail" boxId={undefined}/>
      break;
      default:
        listComponent = <div></div>
      break;
    }
    return listComponent;
  }

  if (!isLoading) {
    return (
      <div className="main-div">
        <div className={styles.itemDataViewer}>
          <img className={styles.itemImage} src={itemData.type === "track" ? (itemData as Track).album!.images[0].url : ((itemData as Album | Artist | Playlist).images![0].url || "https://via.placeholder.com/150")} alt={itemData.name}></img>
          <div className={styles.metadataContainer}>

            <div className={styles.itemTitle}> {itemData.name} </div>

            {checkType.isArtist(itemData) ?
              <div className={styles.itemDetails}>
                {itemData.genres && 
                  itemData.genres.slice(0,3).map((genre, idx, arr) => {
                  return (
                    <span key={genre}>
                        {genre.split(" ").map((word, i ,a) => {
                          return `${word.charAt(0).toUpperCase()}${word.slice(1)}${a[i+1] ? " " : ""}`
                        })}{arr[idx+1] ? ", " : ""}
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
                {` ${Math.floor(itemData.duration_ms/60000)}`.padStart(2,"0")+":"+`${Math.floor(itemData.duration_ms%60000/1000)}`.padStart(2,"0")}
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
  } else {
    return (<div></div>)
  }
}

export default ItemDetail;