import { setModalState } from 'core/features/modal/modalSlice';
import { updateUserBox } from 'core/features/userBoxes/userBoxesSlice';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { useAppSelector } from 'core/hooks/useAppSelector';
import { useState } from 'react';
import { updateUserBoxApi } from 'core/api/userboxes';
import { Album, Artist, Playlist, Track, UserBox } from "core/types/interfaces";
import styles from "./AddToBoxMenu.module.css";

type MusicData = Artist | Album | Track | Playlist;

interface IProps {
	page: string
  itemData: MusicData
  boxId: string 
}

function AddToBoxMenu({page, itemData, boxId}: IProps) {
  const dispatch = useAppDispatch();
  const userBoxes = useAppSelector(state => state.userBoxesData.boxes)
  const itemCopy = JSON.parse(JSON.stringify(itemData))
  const [addBox, setAddBox] = useState(userBoxes[0]._id)

  const handleAddItem = () => {
    const targetId = addBox
    const targetBox = {...userBoxes.find(box => box._id === targetId) as UserBox}
    const updatedItem = {...extractCrucialData(itemCopy)}
    let updatedBox!: UserBox;
    switch (itemCopy.type) {
      case "album" :
        const updatedAlbums = [...targetBox.albums.filter(a => a.id !== updatedItem.id), updatedItem as Album]
        updatedBox = {...targetBox, albums: updatedAlbums}
      break;
      case "artist" :
        const updatedArtists = [...targetBox.artists.filter(a => a.id !== updatedItem.id), updatedItem as Artist]
        updatedBox = {...targetBox, artists: updatedArtists}
      break;
      case "track" :
        const updatedTracks = [...targetBox.tracks.filter(a => a.id !== updatedItem.id), updatedItem as Track]
        updatedBox = {...targetBox, tracks: updatedTracks}
      break;
      case "playlist" :
        const updatedPlaylists = [...targetBox.playlists.filter(a => a.id !== updatedItem.id), updatedItem as Playlist]
        updatedBox = {...targetBox, playlists: updatedPlaylists}
      break;
      default :
    }
    try {
      updateUserBoxApi(targetId, updatedBox)
      dispatch(updateUserBox({updatedBox, targetId: addBox}))
    } catch {
      console.log('Could not add item to box')
    }
    dispatch(setModalState({visible: false, type:"", boxId:"", page: "", itemData: undefined}))
  }

  const extractCrucialData = (data: MusicData) => {
    let extractedData: MusicData;
    switch(data.type){
      case "artist" : {
        const {external_urls, genres, id, images, name, popularity, type, uri} = data as Artist
        extractedData = {external_urls, genres, id, images, name, popularity, type, uri, subSectionCount: 0}
      break;
      }
      case "album" : {
        const {album_type, artists, external_urls, id, images, name, release_date, total_tracks, type, uri} = data as Album
        extractedData = {album_type, artists, external_urls, id, images, name, release_date, total_tracks, type, uri, subSectionCount: 0}
      break;
      }
      case "track" : {
        const {album, artists, duration_ms, explicit, external_urls, id, name, popularity, preview_url, track_number, type, uri} = data as Track
        extractedData = {album, artists, duration_ms, explicit, external_urls, id, name, popularity, preview_url, track_number, type, uri, subSectionCount: 0}
      break;
      }
      case "playlist" : {
        const {description, external_urls, id, images, name, owner, tracks, type, uri} = data as Playlist
        extractedData = {description, external_urls, id, images, name, owner, tracks, type, uri, subSectionCount: 0}
      break;
      }
      default :
        extractedData = data
    }
    return extractedData
  }

  return (
    <div id={styles.modalBody}>
      <div id={styles.confirmation}>
        <label htmlFor="add-type"> Add this item to </label>
        <select name="box-select" defaultValue={userBoxes[0]._id} onChange={(e) => setAddBox(e.target.value)}>
            {userBoxes.map(box => {
              return (<option key={box._id} value={box._id}> {box.name} </option>)
            })}
          </select>
      </div>
      <div id={styles.modalFooter}>
        <button onClick={() => handleAddItem()}> Add item </button>
      </div>
    </div>
  )
}

export default AddToBoxMenu;