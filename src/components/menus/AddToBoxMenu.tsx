import { setModalState } from 'core/features/modal/modalSlice';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { useAppSelector } from 'core/hooks/useAppSelector';
import { useState } from 'react';
import { addAlbumToBoxApi, addArtistToBoxApi, addPlaylistToBoxApi, addTrackToBoxApi, updateUserBoxApi } from 'core/api/userboxes';
import { Album, Artist, Playlist, Track, UserBox } from "core/types/interfaces";
import styles from "./AddToBoxMenu.module.css";
import { isAlbum, isArtist, isPlaylist, isTrack } from 'core/helpers/typeguards';

type MusicData = Artist | Album | Track | Playlist;

interface IProps {
	page: string
  itemData: MusicData
  boxId: string 
}

function AddToBoxMenu({page, itemData, boxId}: IProps) {
  const dispatch = useAppDispatch();
  const userBoxes = useAppSelector(state => state.userBoxesData.userBoxes)
  const itemCopy = JSON.parse(JSON.stringify(itemData))
  const [addBox, setAddBox] = useState(userBoxes[0].boxId)

  const handleAddItem = () => {
    const targetId = addBox
    const updatedItem = {...extractCrucialData(itemCopy)}
    const isOwner = !!userBoxes.find(box => box.boxId === targetId);
    if (isOwner) {
      try {
        if (isArtist(updatedItem)) {
          addArtistToBoxApi(targetId, updatedItem)
        }
        else if (isAlbum(updatedItem)) {
          addAlbumToBoxApi(targetId, updatedItem)
        }
        else if (isTrack(updatedItem)) {
          addTrackToBoxApi(targetId, updatedItem)
        }
        else if (isPlaylist(updatedItem)) {
          addPlaylistToBoxApi(targetId, updatedItem)
        }
      } catch {
        console.log('Could not add item to box')
      }
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
        const {items, ...tracksData} = tracks
        extractedData = {description, external_urls, id, images, name, owner, tracks: tracksData, type, uri, subSectionCount: 0}
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
        <select name="box-select" defaultValue={userBoxes[0].boxId} onChange={(e) => setAddBox(e.target.value)}>
            {userBoxes.map(box => {
              return (<option key={box.boxId} value={box.boxId}> {box.boxName} </option>)
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