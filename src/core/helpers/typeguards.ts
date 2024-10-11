import { Artist, Album, Track, Playlist, ErrorWithMessage, ApiAlbum, ApiArtist, ApiPlaylist, ApiTrack } from "../types/interfaces";

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

function isApiArtist(element: ApiArtist | ApiAlbum | ApiTrack | ApiPlaylist): element is ApiArtist {
  return (element as ApiArtist).type === "artist";
}

function isApiTrack(element: ApiArtist | ApiAlbum | ApiTrack | ApiPlaylist): element is ApiTrack {
  return (element as ApiTrack).type === "track";
}

function isApiPlaylist(element: ApiArtist | ApiAlbum | ApiTrack | ApiPlaylist): element is ApiPlaylist {
  return (element as ApiPlaylist).type === "playlist";
}

function isApiAlbum(element: ApiArtist | ApiAlbum | ApiTrack | ApiPlaylist): element is ApiAlbum {
  return (element as ApiAlbum).type === "album";
}

const isErrorWithMessage = (error: any): error is ErrorWithMessage => {
  return typeof error?.message === 'string';
};

export {isArtist, isAlbum, isTrack, isPlaylist, isApiArtist, isApiAlbum, isApiPlaylist, isApiTrack, isErrorWithMessage};