import { BoxSections } from "./types"

export interface SpotifyLoginData {
  auth: SpotifyUserAuth
  displayName?: string
  userId?: string
}

export interface SpotifyUserAuth {
  code?: string | null
  refreshToken: string | null
  accessToken?: string | null
}

export interface YellowboxUser {
  _id: string
  firebaseId: string
  username: string
  firstName?: string
  lastName?: string
  image: string
  billing: UserBilling
  account: UserAccountData
  services: {
    [key: string]: {
      refreshToken: string
      id: string
    }
  }
  dashboardFolders?: string[]
  dashboardBoxes?: string[]
}

export interface UserBilling {
  stripeData?: {
    customerId: string
    subscription: {
      subscriptionId: string
      status: string
      priceId: string
      productId: string
    }
  }
}

export interface UserAccountData {
  accountTier: string
  signUpDate: string
  emailVerified: boolean
  email: string
  showTutorial: boolean
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
  sectionSorting: SectionSorting
  sectionVisibility: Visibility
  subSections: Subsection[]
  notes: { _id: string, itemId: string, noteText: string, subSectionId?: string }[]
}

export interface UserFolder {
  _id: string
  name: string,
  public: boolean,
  creator: string
  description: string,
  boxes: DashboardBox[]
}

export interface DashboardBox {
  boxId: string,
  boxName: string
}

export interface SectionSorting {
  artists: Sorting
  albums: Sorting
  tracks: Sorting
  playlists: Sorting
}

export interface Sorting {
  primarySorting: string
  secondarySorting: string
  view: string
  ascendingOrder: boolean
  displayGrouping: boolean
  displaySubSections: boolean
}

export interface Visibility {
  artists: boolean
  albums: boolean
  tracks: boolean
  playlists: boolean
}

export interface Subsection {
  _id?: string,
  type: BoxSections,
  name: string,
  items: Artist[] | Album[] | Track[] | Playlist[]
  index?: number
}

export interface UpdateBoxPayload {
  updatedBox: UserBox
  targetIndex?: number
  targetId?: string
}

export interface Album {
  _id?: string
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
  subSectionCount?: number
  dbIndex?: number
}

export interface Artist {
  _id?: string
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
  subSectionCount?: number
  dbIndex?: number
}

export interface Track {
  _id?: string
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
  subSectionCount?: number
  dbIndex?: number
}

export interface Playlist {
  _id?: string
  description: string
  external_urls: {
    spotify: string
  }
  id: string
  images: ItemImage[]
  name: string
  owner: SpotifyUser
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
  subSectionCount?: number
  dbIndex?: number
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
  track: Track // TODO: Hey bro you need to do something here
}

export interface ItemImage {
  height?: number | null
  url: string
  width?: number | null
}