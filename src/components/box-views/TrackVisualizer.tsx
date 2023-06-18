import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Album, Track } from '../../core/types/interfaces';
import styles from "./TrackVisualizer.module.css";

interface IProps {
	data: Track
  album: Album
  boxId?: string
  page?: string
}

function TrackVisualizer({data, album, page, boxId}: IProps) {
  const [trackLyrics, setTrackLyrics] = useState({lyrics: ""})

  useEffect(() => {
    getLyrics(`https://api.lyrics.ovh/v1/${data.artists[0].name.replace(" ", "_")}/${data.name.replace(" ", "_")}`)
  }, [data]);

  const getLyrics = (query: string) => {
    //const query = `https://api.lyrics.ovh/v1/${artist.replace(" ", "_")}/${song.replace(" ", "_")}`;
  }

  return (
    <div className={styles.itemContainer}>
      <div className={styles.visualizerContainer}>
        <div className={styles.trackLyrics}>
          <div className={styles.lyricsTitle}> SONG LYRICS </div>
          <pre className={styles.lyrics}>
            {trackLyrics.lyrics ? `${trackLyrics.lyrics}` : "Oops, we could not find the lyrics for this song."}
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
                {album.tracks?.items.slice(0, album.tracks.items.length / 2 + album.tracks.items.length % 2).map(track => {
                  return (
                    <Link key={track.id} to={`/detail/track/${track.id}`}>
                      <div className={styles.relatedRow}>  
                        {`${track.track_number}. `}{` ${track.name}`} 
                      </div>
                    </Link>
                  )
                })}
              </div>
              <div className={styles.tracklistCol}>
                {album.tracks?.items.slice(album.tracks.items.length / 2 + album.tracks.items.length % 2, album.tracks.items.length).map(track => {
                  return (
                    <Link key={track.id} to={`/detail/track/${track.id}`}>
                      <div className={styles.relatedRow}>  
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
    </div>
  )
}

export default TrackVisualizer;