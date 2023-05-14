import { fetchDashboardBoxes, fetchUserBoxes } from "core/features/userBoxes/userBoxesSlice";
import { fetchDashboardFolders } from "core/features/userFolders/userFoldersSlice";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { useAppSelector } from "core/hooks/useAppSelector";
import { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { addAlbumToBoxApi, addArtistToBoxApi, addPlaylistToBoxApi, addTrackToBoxApi, updateUserBoxApi } from "core/api/userboxes";
import { Album, Artist, Playlist, Track, SpotifyLoginData, UserBox, YellowboxUser, DashboardBox } from "core/types/interfaces";
import styles from "./Sidebar.module.css";
import { isAlbum, isArtist, isPlaylist, isTrack } from "core/helpers/typeguards";
import DashboardFolder from "./DashboardFolder/DashboardFolder";

interface IProps {
  user: YellowboxUser
  login: SpotifyLoginData
}

type MusicData = Artist | Album | Track | Playlist;

function Sidebar({ user, login }: IProps) {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const userFolders = useAppSelector(state => state.userFoldersData.folders)
  const userCreatedBoxes = useAppSelector(state => state.userBoxesData.userBoxes)
  const userDashboardBoxes = useAppSelector(state => state.userBoxesData.dashboardBoxes)

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchDashboardFolders(user.dashboardFolders!))
      dispatch(fetchDashboardBoxes(user.dashboardBoxes!))
      dispatch(fetchUserBoxes(user._id!))
    }
  }, [user])

  const navigateToBox = (boxId: string) => {
    history.push(`/box/${boxId}`)
  }

  const addToBox = (draggedData: MusicData, targetBoxId: string, userBoxes: DashboardBox[]) => {
    const isOwner = !!userBoxes.find(box => box.boxId === targetBoxId);
    if (isOwner) {
      try {
        if (isArtist(draggedData)) {
          addArtistToBoxApi(targetBoxId, draggedData)
        }
        else if (isAlbum(draggedData)) {
          addAlbumToBoxApi(targetBoxId, draggedData)
        }
        else if (isTrack(draggedData)) {
          addTrackToBoxApi(targetBoxId, draggedData)
        }
        else if (isPlaylist(draggedData)) {
          addPlaylistToBoxApi(targetBoxId, draggedData)
        }
      } catch {
        console.log('Could not add item to box')
      }
    }
  }

  const extractCrucialData = (data: MusicData) => {
    let extractedData: MusicData;
    switch (data.type) {
      case "artist": {
        const { external_urls, genres, id, images, name, popularity, type, uri } = data as Artist
        extractedData = { external_urls, genres, id, images, name, popularity, type, uri, subSectionCount: 0 }
        break;
      }
      case "album": {
        const { album_type, artists, external_urls, id, images, name, release_date, total_tracks, type, uri } = data as Album
        extractedData = { album_type, artists, external_urls, id, images, name, release_date, total_tracks, type, uri, subSectionCount: 0 }
        break;
      }
      case "track": {
        const { album, artists, duration_ms, explicit, external_urls, id, name, popularity, preview_url, track_number, type, uri } = data as Track
        extractedData = { album, artists, duration_ms, explicit, external_urls, id, name, popularity, preview_url, track_number, type, uri, subSectionCount: 0 }
        break;
      }
      case "playlist": {
        const { description, external_urls, id, images, name, owner, tracks, type, uri } = data as Playlist
        const { items, ...tracksData } = tracks
        extractedData = { description, external_urls, id, images, name, owner, tracks: tracksData, type, uri, subSectionCount: 0 }
        break;
      }
      default:
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
    addToBox(crucialData, event.currentTarget.id, userCreatedBoxes)
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
            <div className={styles.folderList}>
              {!!userFolders.length && userFolders.map(folder => {
                return (
                  <DashboardFolder folder={folder} />
                )
              })}
            </div>
            <div className={styles.dashboardBoxesList}>
              {!!userDashboardBoxes.length && userDashboardBoxes.map((box) => {
                return (
                  <div className={styles.boxLink} id={box.boxId} key={box.boxId} onClick={() => navigateToBox(box.boxId)}
                    onDragEnter={(e) => handleDragEnter(e)}
                    onDragLeave={(e) => handleDragLeave(e)}
                    onDragOver={(e) => handleDragOver(e)}
                    onDrop={(e) => handleDrop(e)}>
                    <div className={styles.boxName}> {box.boxName} </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default Sidebar;