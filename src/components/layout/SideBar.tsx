import { fetchUserBoxes, updateUserBox } from "core/features/userBoxes/userBoxesSlice";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { useAppSelector } from "core/hooks/useAppSelector";
import { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { updateUserBoxApi } from "core/api/userboxes";
import { Album, Artist, Playlist, Track, SpotifyLoginData, UserBox, YellowboxUser } from "../../core/types/interfaces";

import styles from "./SideBar.module.css";
import { fetchBoxDetailThunk } from "core/features/currentBoxDetail/currentBoxDetailSlice";

interface IProps {
	user: YellowboxUser
  login: SpotifyLoginData
}

type MusicData = Artist | Album | Track | Playlist;

function SideBar({user, login}: IProps) {
  const dispatch = useAppDispatch();
  let history = useHistory();
  const userBoxes = useAppSelector(state => state.userBoxesData.boxes)

  useEffect(() => {
    if (user._id){
      dispatch(fetchUserBoxes(user._id))
    }
  }, [user])

  useEffect(() => {
    console.log(userBoxes)
  }, [userBoxes])

  const navigateToBox = (boxId: string) => {
    dispatch(fetchBoxDetailThunk(boxId))
    history.push(`/box/${boxId}`)
  }

  const addToBox = (draggedData: MusicData, targetBoxId: string, userBoxes: UserBox[]) => {
    console.log(JSON.stringify(draggedData))
    const targetBox = {...userBoxes.find(box => box._id === targetBoxId) as UserBox}
    let updatedBox!: UserBox;
    switch (draggedData.type) {
      case "album" :
        console.log(targetBox.albums)
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
    console.log(updatedBox)
    console.log("Dispatch call")
    try {
      updateUserBoxApi(targetBoxId, updatedBox)
      dispatch(updateUserBox({targetId: targetBoxId, updatedBox}))
    } catch {
      console.log('Could not add item to box')
    }
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

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    (event.target as Element).className = styles.linkDragOver
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    (event.target as Element).className = styles.boxLink
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    (event.target as Element).className = styles.boxLink
    const data = JSON.parse(event.dataTransfer.getData("data"))
    const crucialData = extractCrucialData(data)
    console.log(data)
    console.log(event.currentTarget.id)
    addToBox(crucialData, event.currentTarget.id, userBoxes)
  }

  return (
    <div id={styles.mainPanel}>
      {
        login.auth.code &&
        <>
          <div id={styles.user}>
            <img id={styles.userImage} src={login.userData.image ? login.userData.image : "/user.png"} alt="user" />
            <span id={styles.userName}> {login.userData.displayName} </span>
          </div>
          <div id={styles.servicesList}>
            <h4 className={styles.sectionTitle}> Your Services </h4>
            <Link className={styles.serviceLink} to={`/myaccounts/spotify`}>
              <div className={styles.serviceButton}><img className={styles.spotifyIcon} src='/icons/spotify_icon.png' alt='spotify'></img><span> Spotify </span></div>
            </Link>
          </div>
          <div id={styles.boxList}>
            <h4 className={styles.sectionTitle}> Your Boxes </h4>
            {!!userBoxes.length && userBoxes.map((box) => {
              return (
                <div className={styles.boxLink} id={box._id} key={box._id} onClick={() => navigateToBox(box._id)}
                  onDragEnter={(e) => handleDragEnter(e)} 
                  onDragLeave={(e) => handleDragLeave(e)}
                  onDragOver={(e) => handleDragOver(e)}
                  onDrop={(e) => handleDrop(e)}>
                    <span> {box.name} </span>
                </div>
              )
            })}
          </div>
        </>
      }
    </div>
  )
}

export default SideBar;