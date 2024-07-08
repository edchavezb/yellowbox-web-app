import { Album, Artist, Playlist, Track } from "./interfaces";

export type BoxSections = 'artists' | 'albums' | 'tracks' | 'playlists';
export type BoxItemType = 'artist' | 'album' | 'track' | 'playlist';
export type ItemData = Artist | Album | Track | Playlist;