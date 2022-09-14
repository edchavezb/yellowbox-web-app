import { Link } from "react-router-dom";
import { Album, Artist, Playlist, Track, User, UserBox } from "../../interfaces";

import styles from "./SideBar.module.css";

enum UserBoxesActionTypes {
  UPDATE_BOX = 'UPDATE_BOX',
  ADD_BOX = 'ADD_BOX',
  DELETE_BOX = 'DELETE_BOX',
}

interface UpdateBoxPayload {
  updatedBox?: UserBox
  newBox?: UserBox
  targetIndex?: number
  targetId?: string
}

interface IProps {
	user: User
  boxes: UserBox[]
  dispatch: React.Dispatch<{
    type: UserBoxesActionTypes;
    payload: UpdateBoxPayload;
  }>
}

type MusicData = Artist | Album | Track | Playlist;

function SideBar({user, boxes, dispatch}: IProps) {

  const addToBox = (draggedData: MusicData, targetBoxId: string) => {
    console.log(JSON.stringify(draggedData))
    const targetIndex = boxes.findIndex(box => box.id === targetBoxId)
    const targetBox = {...boxes.find(box => box.id === targetBoxId) as UserBox}
    let updatedBox!: UserBox;
    switch (draggedData.type) {
      case "album" :
        const updatedAlbums = [...targetBox.albums as Album[], draggedData as Album]
        updatedBox = {...targetBox, albums: updatedAlbums}
      break;
      case "artist" :
        const updatedArtists = [...targetBox.artists as Artist[], draggedData as Artist]
        updatedBox = {...targetBox, artists: updatedArtists}
      break;
      case "track" :
        const updatedTracks = [...targetBox.tracks as Track[], draggedData as Track]
        updatedBox = {...targetBox, tracks: updatedTracks}
      break;
      case "playlist" :
        const updatedPlaylists = [...targetBox.playlists as Playlist[], draggedData as Playlist]
        updatedBox = {...targetBox, playlists: updatedPlaylists}
      break;
      default :
        updatedBox = targetBox
    }
    console.log("Dispatch call")
    dispatch({type: UserBoxesActionTypes["UPDATE_BOX"], payload: {updatedBox: updatedBox, targetIndex: targetIndex}})
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

  const handleDragEnter = (event: React.DragEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.stopPropagation();
    (event.target as Element).className = styles.linkDragOver
  }

  const handleDragLeave = (event: React.DragEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.stopPropagation();
    (event.target as Element).className = styles.boxLink
  }

  const handleDragOver = (event: React.DragEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }

  const handleDrop = (event: React.DragEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.stopPropagation();
    (event.target as Element).className = styles.boxLink
    const data = JSON.parse(event.dataTransfer.getData("data"))
    const crucialData = extractCrucialData(data)
    console.log(data)
    console.log(event.currentTarget.id)
    addToBox(crucialData, event.currentTarget.id)
  }

  return (
    <div id={styles.mainPanel}>
      <div id={styles.user}>
        <img id={styles.userImage} src={user.userData.image ? user.userData.image : "/user.png"} alt="user" />
        <span id={styles.userName}> {user.userData.displayName} </span>
      </div>
      <div id={styles.boxList}>
        <h4 id={styles.boxesTitle}> Your Boxes </h4>
        {boxes.map((box) => {
          return (
            <Link className={styles.boxLink} id={box.id} key={box.id} to={`/box/${box.id}`} 
              onDragEnter={(e) => handleDragEnter(e)} 
              onDragLeave={(e) => handleDragLeave(e)}
              onDragOver={(e) => handleDragOver(e)}
              onDrop={(e) => handleDrop(e)}>
                <span> {box.name} </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default SideBar;