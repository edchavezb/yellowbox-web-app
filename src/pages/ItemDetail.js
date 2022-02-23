import { useState, useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import axios from 'axios'
import querystring from 'querystring'
import credentials from '../keys'

import GridView from '../components/box-views/GridView';
import ListView from '../components/box-views/ListView';

import styles from "./ItemDetail.module.css"

function ItemDetail({toggleModal}) {

  const history = useHistory();
  const params = useParams()
  const [itemData, setItemData] = useState({ type: "", images: ["https://via.placeholder.com/150"], name: "", artists: [{ name: "" }], album_type: "", tracks: {items: []} })
  const [itemListType, setItemListType] = useState("")
  const [itemContents, setItemContents] = useState({ items: [] })

  useEffect(() => {
    handleDetailData(params.type, params.id)
  }, [params.type, params.id, history.location.pathname]);

  useEffect(() => console.log(itemContents), [itemContents]);

  const handleDetailData = (typeParam, idParam) => {

    let itemQuery;
    let contentsQuery;
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
        getItemData(itemQuery, response.data.access_token)
        getContents(contentsQuery, response.data.access_token)
      })
      .catch(error => {
        console.log(error);
      });
  }

  const getItemData = (query, auth) => {
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
      })
      .catch(error => {
        console.log(error);
      });
  }

  const getContents = (query, auth) => {
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

  const getListComponent = () => {
    let listComponent;
    switch (params.type){
      case "album" :
        listComponent = 
        <ListView listType={itemListType} data={attachAlbumDataToTracks(itemData)} page="detail" customSorting={false} toggleModal={toggleModal} boxId={undefined} />
      break;
      case "playlist" :
        listComponent = 
        <ListView listType={itemListType} data={itemContents.items.map((e) => e['track'])} page="detail" customSorting={false} toggleModal={toggleModal} boxId={undefined} />
      break;
      case "artist" :
        listComponent = 
        <GridView data={itemContents.items} page="detail" customSorting={false} toggleModal={toggleModal} boxId={undefined} />
      break;
      default:
        listComponent = <div></div>
      break;
    }
    return listComponent;
  }

  const getArtistLinks = (artists) => {
    const artistLinks = artists.slice(0, 3).map((artist, idx, arr) => {
      return <Link to={`/detail/artist/${artist.id}`}><span className={styles.artistName}> {`${artist.name}${arr[idx+1] ? ", " : ""}`} </span> </Link>;
    })

    return artistLinks;
  }

  const getAlbumRunningTime = (tracks) => {
    const milliSecs = tracks.map(track => track.duration_ms).reduce((prev, curr) => {return prev + curr});
    const minutes = parseInt(milliSecs / 60000);
    const seconds = parseInt((milliSecs % 60000) / 1000);
    return `${minutes} min, ${seconds} sec`
  }

  const attachAlbumDataToTracks = (parentItem) => {
    console.log(parentItem);
    return parentItem.tracks.items.map(e => ({'album': {
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

  return (
    <div className="main-div">
      <div className={styles.itemDataViewer}>
        <img className={styles.itemImage} src={itemData.type === "track" ? itemData.album.images[0].url : itemData.images[0].url} alt={itemData.name}></img>
        <div className={styles.metadataContainer}>

          <div className={styles.itemTitle}> {itemData.name} </div>

          {itemData.type === "artist" ?
            <div className={styles.itemDetails}>
              {itemData.genres.slice(0,3).map((genre, idx, arr) => {
                return (
                  <span key={genre}>
                      {genre.split(" ").map((word, i ,a) => {
                        return `${word.charAt(0).toUpperCase()}${word.slice(1)}${a[i+1] ? " " : ""}`
                      })}{arr[idx+1] ? ", " : ""}
                  </span> 
                )
              })}
              {itemData.genres.length ? " | " : ""}Popular releases
            </div>
            : ""
          }

          {itemData.type === "album" ?
            <div className={styles.itemDetails}>
              {`${itemData.album_type.charAt(0).toUpperCase()}${itemData.album_type.slice(1)}`}  
              {` by `}{getArtistLinks(itemData.artists)} |
              {` ${itemData.release_date.split("-")[0]}`} |
              {` ${itemData.total_tracks} tracks`} |
              {` ${getAlbumRunningTime(itemData.tracks.items)}`}
            </div>
            : ""
          }

          {itemData.type === "track" ?
            <div className={styles.itemDetails}>
              {`${itemData.type.charAt(0).toUpperCase()}${itemData.type.slice(1)}`}
              {` by `}{getArtistLinks(itemData.artists)} |
              {` ${itemData.album.release_date.split("-")[0]}`} |
              {` ${parseInt(itemData.duration_ms/60000)}`.padStart(2,0)+":"+`${Math.floor(itemData.duration_ms%60000/1000)}`.padStart(2,0)} |
              <Link to={`/detail/album/${itemData.album.id}`}><span> Album </span> </Link>
            </div>
            : ""
          }

          {itemData.type === "playlist" ?
            <div className={styles.itemDetails}>
              {`${itemData.type.charAt(0).toUpperCase()}${itemData.type.slice(1)}`}
              {` by `}<a href={itemData.owner.uri}><span> {itemData.owner.display_name} </span></a>
            </div>
            : ""
          }

        </div>
      </div>
      <hr />
      {getListComponent()}
    </div>
  );
}

export default ItemDetail;