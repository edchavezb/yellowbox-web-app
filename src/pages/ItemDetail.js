import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios'
import querystring from 'querystring'
import credentials from '../keys'

import GridView from '../components/box-views/GridView';
import ListView from '../components/box-views/ListView';

import styles from "./ItemDetail.module.css"

function ItemDetail(props) {

  const history = useHistory();
  const params = useParams()
  const [itemData, setItemData] = useState({ type: "", images: ["https://via.placeholder.com/150"], name: "", artists: [{ name: "" }], album_type: "", tracks: {items: []} })
  const [itemChildrenType, setItemChildrenType] = useState("")
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
        setItemChildrenType("track")
        break;
      case 'artist':
        itemQuery = `https://api.spotify.com/v1/artists/${idParam}`
        contentsQuery = `https://api.spotify.com/v1/artists/${idParam}/albums?market=us`
        setItemChildrenType("album")
        break;
      case 'track':
        itemQuery = `https://api.spotify.com/v1/tracks/${idParam}`
        contentsQuery = `https://api.spotify.com/v1/tracks/${idParam}`
        break;
      case 'playlist':
        itemQuery = `https://api.spotify.com/v1/playlists/${idParam}`
        contentsQuery = `https://api.spotify.com/v1/playlists/${idParam}/tracks`
        setItemChildrenType("track")
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
          {itemData.type !== "artist" ?
            <div className={styles.itemDetails}>
              {itemData.type === "album" ? `${itemData.album_type.charAt(0).toUpperCase()}${itemData.album_type.slice(1)}`
                : `${itemData.type.charAt(0).toUpperCase()}${itemData.type.slice(1)}`}
              <nbsp /> by {itemData.type === "playlist" ? itemData.owner.display_name : itemData.artists[0].name} </div>
            : "Popular releases"
          }
        </div>
      </div>
      <hr />
      {params.type !== 'track' ? 
        <ListView listType={itemChildrenType} data={params.type === 'playlist' ? itemContents.items.map((e) => e['track']) : 
          params.type === 'album' ? attachAlbumDataToTracks(itemData) : itemContents.items} page="detail" customSorting={false} toggleModal={props.toggleModal} boxId={undefined} />
        : ""}
    </div>
  );
}

export default ItemDetail;