import { Artist, Album, Track, Playlist } from "../types/interfaces";

function isAlbum (element: Artist | Album | Track | Playlist): element is Album {
  return  (element as Album).type === "album";
}

function isArtist(element: Artist | Album | Track | Playlist): element is Artist {
  return  (element as Artist).type === "artist";
}

function isTrack (element: Artist | Album | Track | Playlist): element is Track {
  return  (element as Track).type === "track";
}

function isPlaylist (element: Artist | Album | Track | Playlist): element is Playlist {
  return  (element as Playlist).type === "playlist";
}

export {isArtist, isAlbum, isTrack, isPlaylist};