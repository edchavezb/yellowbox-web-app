import { useState, useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';

import DragActions from "../layout/DragActions"
import styles from "./TrackVisualizer.module.css";

import defaultLyrics from '../../DefaultLyrics';

function TrackVisualizer({data, album, page, toggleModal, boxId}) {

  const [elementDragging, setElementDragging] = useState(false)

  useEffect(() => console.log(album), [album]);
  useEffect(() => console.log(data), [data]);

  return (
    <div className={styles.itemContainer}>
      <div className={styles.visualizerContainer}>
        <div className={styles.trackLyrics}>
          <div className={styles.lyricsTitle}> SONG LYRICS </div>
          <pre className={styles.lyrics}>
            {`${defaultLyrics.lyrics}`}
          </pre>
        </div>
        <div className={styles.related}>
          <div className={styles.relatedTitle}> FROM </div>
          <Link to={`/detail/album/${album.id}`}>
            <div className={styles.albumTitle}> 
              {album.name}{` ${album.release_date && "("}${album.release_date.split("-")[0]}${album.release_date && ")"}`} 
            </div>
          </Link>
          <div className={styles.relatedTracks}>
            <div className={styles.relatedTitle}> ALBUM TRACKLIST </div>
            <div className={styles.tracksContainer}>

              <div className={styles.tracklistCol}>
                {album.tracks.items.slice(0, album.tracks.items.length / 2 + album.tracks.items.length % 2).map(track => {
                  return (
                    <Link to={`/detail/track/${track.id}`}>
                      <div key={track.id} className={styles.relatedRow}>  
                        {`${track.track_number}. `}{` ${track.name}`} 
                      </div>
                    </Link>
                  )
                })}
              </div>

              <div className={styles.tracklistCol}>
                {album.tracks.items.slice(album.tracks.items.length / 2 + album.tracks.items.length % 2, album.tracks.items.length).map(track => {
                  return (
                    <Link to={`/detail/track/${track.id}`}>
                      <div key={track.id} className={styles.relatedRow}>  
                        {`${track.track_number}. `}{` ${track.name}`} 
                      </div>
                    </Link>
                  )
                })}
              </div>
              
            </div>
          </div>
        </div>
      </div>
      <DragActions elementDragging={elementDragging} page={page} toggleModal={toggleModal} boxId={boxId} />
    </div>
  )
}

export default TrackVisualizer;