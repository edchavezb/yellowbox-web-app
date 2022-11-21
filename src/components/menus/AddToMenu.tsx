import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Album, Artist, ModalState, Playlist, Track, UserBox } from "../../core/types/interfaces";

import styles from "./AddToMenu.module.css";

enum UserBoxesActionTypes {
  UPDATE_BOX = 'UPDATE_BOX',
  NEW_BOX = 'NEW_BOX',
  DELETE_BOX = 'DELETE_BOX',
}

interface UpdateBoxPayload {
  updatedBox: UserBox
  targetIndex?: number
  targetId?: string
}

type MusicData = Artist | Album | Track | Playlist;

interface IProps {
	page: string
  itemData: MusicData
  userBoxes: UserBox[]
  boxId: string 
  dispatch: React.Dispatch<{
    type: UserBoxesActionTypes;
    payload: UpdateBoxPayload;
  }>
  toggleModal: Dispatch<SetStateAction<ModalState>>
}

function AddToMenu({page, itemData, userBoxes, boxId, toggleModal, dispatch}: IProps) {

  const currentBox = {...userBoxes.find(box => box.id === boxId) as UserBox}
  const itemCopy = JSON.parse(JSON.stringify(itemData))

  const [addType, setAddType] = useState("box")
  const [addBox, setAddBox] = useState(userBoxes[0].id)
  const [addSub, setAddSub] = useState(page === "box" && currentBox.subSections.length ? currentBox.subSections[0].name : "")

  useEffect(() => {
    console.log(addType)
  }, [addType])

  const handleAddItem = () => {
    const targetId = addType === "box" ? addBox : currentBox.id
    const targetIndex = userBoxes.findIndex(box => box.id === targetId)
    const targetBox = {...userBoxes.find(box => box.id === targetId) as UserBox}
    console.log(targetBox)
    const updatedItem = {...extractCrucialData(itemCopy), subSection: addType === "box" ? "default" : addSub}
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
    console.log("Dispatch call")
    dispatch({type: UserBoxesActionTypes["UPDATE_BOX"], payload: {updatedBox: updatedBox, targetIndex: targetIndex}})
    toggleModal({ visible: false, type: "", boxId:"", page: "", itemData: undefined})
  }

  const extractCrucialData = (data: MusicData) => {
    let extractedData: MusicData;
    switch(data.type){
      case "artist" : {
        const {external_urls, genres, id, images, name, popularity, type, uri} = data as Artist
        extractedData = {external_urls, genres, id, images, name, popularity, type, uri, subSection: "default"}
      break;
      }
      case "album" : {
        const {album_type, artists, external_urls, id, images, name, release_date, total_tracks, type, uri} = data as Album
        extractedData = {album_type, artists, external_urls, id, images, name, release_date, total_tracks, type, uri, subSection: "default"}
      break;
      }
      case "track" : {
        const {album, artists, duration_ms, explicit, external_urls, id, name, popularity, preview_url, track_number, type, uri} = data as Track
        extractedData = {album, artists, duration_ms, explicit, external_urls, id, name, popularity, preview_url, track_number, type, uri, subSection: "default"}
      break;
      }
      case "playlist" : {
        const {description, external_urls, id, images, name, owner, tracks, type, uri} = data as Playlist
        extractedData = {description, external_urls, id, images, name, owner, tracks, type, uri, subSection: "default"}
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
        <select name="add-type" defaultValue={addType} onChange={(e) => setAddType(e.target.value)}>
          <option value="box"> another box in your collection </option>
          <option value="subsection" hidden={page === "search"} > a sub-section of this box </option>
        </select>
      </div>

      {addType === "box" ? 
        <div id={styles.boxSelect}>
          <label htmlFor="box-select"> Select a box </label>
          <select name="box-select" defaultValue={userBoxes[0].id} onChange={(e) => setAddBox(e.target.value)}>
            {userBoxes.map(box => {
              return (<option key={box.id} value={box.id}> {box.name} </option>)
            })}
          </select>
        </div>
        : ""
      }

      {addType === "subsection" ? 
        <div id={styles.subSectionSelect}>
          <label htmlFor="subsection-select"> Select a subsection </label>
          <select name="subsection-select" defaultValue={currentBox.subSections[0].name} onChange={(e) => setAddSub(e.target.value)}>
            {currentBox.subSections.map(sub => {
              return (<option key={sub.name} value={sub.name}> {sub.name} </option>)
            })}
          </select>
        </div>
        : ""
      }

      <div id={styles.modalFooter}>
        <button onClick={() => handleAddItem()}> Add item </button>
      </div>
    </div>
  )
}

export default AddToMenu;