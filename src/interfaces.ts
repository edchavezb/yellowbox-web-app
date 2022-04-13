interface UserBox {
  id: string
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
  subSections : [
    {type: string, name: string}
  ]
}

interface Sorting {
  primarySorting: string
  secondarySorting: string
  view: string
  ascendingOrder: boolean
  displaySubSections: boolean
}

interface Visibility {
  artists: boolean
  albums: boolean
  tracks: boolean
  playlists: boolean
}

interface Album {
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
  type: string
  uri: string
  subSection?: string
}

interface Artist {
  external_urls: {
    spotify: string
  }
  genres: string[]
  id: string
  images: ItemImage[]
  name: string
  popularity?: number
  type: string
  uri: string
  subSection?: string
}

interface Track {
  album: Album
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

interface Playlist {
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

interface SpotifyUser {
  display_name?: string
  external_urls: {
    spotify: string
  }
  href: string
  id: string
  type: string
  uri: string
}

interface PlaylistItem {
  added_at: string
  added_by: SpotifyUser
  is_local: boolean
  primary_color: string
  track: any // Hey bro you need to do something here
}

interface ItemImage {
  height: number
  url: string
  width: number
}

export type { UserBox, Visibility, Sorting, Artist, Album, Track, Playlist, SpotifyUser, PlaylistItem, ItemImage }