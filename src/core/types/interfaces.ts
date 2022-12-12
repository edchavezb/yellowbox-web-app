export interface SpotifyLoginData {
  auth: SpotifyUserAuth
  userData: SpotifyUserData
}

export interface SpotifyUserData {
  displayName: string
  userId: string
  uri: string
  image: string
  email: string
}

export interface SpotifyUserAuth {
  code: string | null
  refreshToken: string | null
}

export interface YellowboxUser {
  _id: string
  displayName: string
  image: string
  email: string
  services: {
    [key: string]: string
  }
}

export interface UserBox {
  _id: string
  name: string
  public: boolean
  creator: string
  description: string
  artists: Artist[]
  albums: Album[]
  tracks: Track[]
  playlists: Playlist[]
  sectionSorting: {
    artists: Sorting
    albums: Sorting
    tracks: Sorting
    playlists: Sorting
  }
  sectionVisibility: Visibility
  subSections : {type: string, name: string}[]
}

export interface Sorting {
  primarySorting: string
  secondarySorting: string
  view: string
  ascendingOrder: boolean
  displaySubSections: boolean
}

export interface Visibility {
  artists: boolean
  albums: boolean
  tracks: boolean
  playlists: boolean
}

export interface UpdateBoxPayload {
  updatedBox: UserBox
  targetIndex?: number
  targetId?: string
}

export interface Album {
  album_type: string
  artists: Artist[]
  external_urls: {
    spotify: string
  }
  id: string
  images: ItemImage[]
  name: string
  release_date: string
  total_tracks: number
  tracks?: {
    href: string
    items: Track[]
    limit?: number
    next?: string
    offset?: number
    previous?: string
    total: number
  }
  type: string
  uri: string
  subSection?: string
}

export interface Artist {
  external_urls: {
    spotify: string
  }
  genres?: string[]
  id: string
  images?: ItemImage[]
  name: string
  popularity?: number
  type: string
  uri: string
  subSection?: string
}

export interface Track {
  album?: Album
  artists: Artist[]
  duration_ms: number
  explicit: string
  external_urls: {
    spotify: string
  }
  id: string
  name: string
  popularity: number
  preview_url?: string
  track_number: number
  type: string
  uri: string
  subSection?: string 
}

export interface Playlist {
  description: string
  external_urls: {
    spotify: string
  }
  id: string
  images: ItemImage[]
  name: string
  owner : SpotifyUser
  tracks: {
    href: string
    items?: PlaylistItem[]
    limit?: number
    next?: string
    offset?: number
    previous?: string
    total: number
  }
  type: string
  uri: string
  subSection?: string 
}

export interface SpotifyUser {
  display_name?: string
  external_urls: {
    spotify: string
  }
  href: string
  id: string
  type: string
  uri: string
}

export interface PlaylistItem {
  added_at: string
  added_by: SpotifyUser
  is_local: boolean
  primary_color: string
  track: any // TODO: Hey bro you need to do something here
}

export interface ItemImage {
  height?: number | null
  url: string
  width?: number | null
}