import { BoxSections, ItemData } from "./types"

export interface ErrorWithMessage {
  message: string;
}

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

export interface SpotifyAccountInfo {
  displayName?: string
  userId?: string
  email?: string
  images?: {}[]
  uri?: string
}

export interface YellowboxUser {
  userId: string
  firebaseId: string
  username: string
  email: string
  firstName?: string
  lastName?: string
  bio?: string
  imageUrl?: string
  billing: UserBilling
  accountData: UserAccountData
  spotifyAccount?: UserSpotifyAccount | null
  appleMusicAccount?: UserSpotifyAccount | null
  lastFmAccount?: UserSpotifyAccount | null
  boxes?: DashboardBox[]
  folders?: UserFolder[]
  followedUsers?: FollowedUser[]
  followedBoxes?: FollowedBox[]
  followers?: Follower[]
}

export interface FollowedUser {
  createdAt?: string
  userId: string
  username: string
  imageUrl?: string
  firstName?: string
  lastName?: string
}

export interface Follower {
  createdAt?: string
  userId: string
  username: string
  imageUrl?: string
  firstName?: string
  lastName?: string
}

export interface FollowedBox {
    boxId: string
    name: string
    imageUrl?: string
    position: number
    creator: {
      userId: string
      username: string
    }
}

export interface UserSpotifyAccount {
  userId: string
  refreshToken: string
  spotifyId: string
}

export interface UserBilling {
  stripeCustomerId: string
  stripeSubscriptionId: string
  stripeSubscriptionStatus: string
  stripePriceId: string
  stripeProductId: string
}

export interface UserAccountData {
  accountTier: string
  signUpDate: string
  emailVerified: boolean
  showTutorial: boolean
}

export interface QueueItem {
  queueItemId: string;
  playedByUser: boolean;
  position: number;
  itemData: ItemData;
}

export interface UserBox {
  boxId: string
  name: string
  isPublic: boolean
  creator: {
    userId: string,
    username: string
  }
  position: number,
  folderPosition: number,
  folder: {
    name: string,
    folderId: string
  }
  description: string
  artists: Artist[]
  albums: Album[]
  tracks: Track[]
  playlists: Playlist[]
  sectionSettings: SectionSettings[]
  subsections: Subsection[]
}

export interface UserFolder {
  folderId: string
  name: string,
  isPublic: boolean,
  creator: string
  description: string,
  boxes: DashboardBox[]
}

export interface BoxCreateDTO {
  creatorId: string
  position: number
  name: string
  description: string
  isPublic: boolean
}

export interface FolderCreateDTO {
  creator: string
  name: string
  description: string
  isPublic: boolean
}

export interface DashboardBox {
  boxId: string,
  name: string
  position: number | null
  folderPosition?: number | null
  folderId?: string | null
  isPublic?: boolean
  creator?: {
    userId: string
    username: string
  }
}

export interface SectionSettings {
  primarySorting: string
  secondarySorting: string
  view: string
  sortingOrder: 'ASCENDING' | 'DESCENDING'
  displayGrouping: boolean
  displaySubsections: boolean
  isVisible: boolean
  type: string
}

export interface Visibility {
  artists: boolean
  albums: boolean
  tracks: boolean
  playlists: boolean
}

export interface Subsection {
  subsectionId: string,
  itemType: BoxSections,
  name: string,
  items: Artist[] | Album[] | Track[] | Playlist[]
  position: number
}

export interface UpdateBoxPayload {
  updatedBox: UserBox
  targetIndex?: number
  targetId?: string
}

export interface Album {
  boxItemId?: string
  spotifyId: string
  albumType: string
  artists: { name: string, spotifyId: string }[]
  images: ItemImage[]
  name: string
  releaseDate: string
  totalTracks: number
  type: string
  position?: number
  subsections?: string[],
  note?: string
  subsectionId?: string
  userPlays?: any[]
}

export interface Artist {
  boxItemId?: string
  spotifyId: string
  genres?: string[]
  images?: ItemImage[]
  name: string
  popularity?: number
  type: string
  position?: number
  subsections?: string[]
  note?: string
  subsectionId?: string
  userPlays?: any[]
}

export interface Track {
  boxItemId?: string
  spotifyId: string
  albumName?: string
  albumReleaseDate: string
  albumId: string
  albumImages: ItemImage[]
  artists: { name: string, spotifyId: string }[]
  duration: number
  explicit: string
  name: string
  popularity: number
  trackNumber: number
  type: string
  position?: number
  subsections?: string[]
  note?: string
  subsectionId?: string
  userPlays?: any[]
}

export interface Playlist {
  boxItemId?: string
  spotifyId: string
  description: string
  images: ItemImage[]
  name: string
  ownerId: string
  ownerDisplayName: string
  totalTracks: number
  type: string
  position?: number
  subsections?: string[]
  note?: string
  subsectionId?: string
  userPlays?: any[]
}

export interface ApiArtist {
  id: string
  genres?: string[]
  images?: ItemImage[]
  name: string
  popularity?: number
  type: string
  uri: string
}

export interface ApiAlbum {
  album_type: string
  total_tracks: number
  id: string
  images: ItemImage[]
  name: string,
  release_date: string
  type: string
  artists: ApiArtist[]
  tracks?: {
    href: string
    items: ApiTrack[]
    limit?: number
    next?: string
    offset?: number
    previous?: string
    total: number
  }
}

export interface ApiTrack {
  album?: ApiAlbum
  artists: ApiArtist[]
  duration_ms: number
  explicit: string
  id: string
  name: string
  popularity: number
  track_number: number
  type: string
  uri: string
}

export interface ApiPlaylist {
  description: string
  id: string
  images: ItemImage[]
  name: string
  type: string
  owner: SpotifyUser
  tracks: {
    href: string
    items: PlaylistItem[]
    limit?: number
    next?: string
    offset?: number
    previous?: string
    total: number
  }
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
  track: ApiTrack // TODO: Hey bro you need to do something here
}

export interface ItemImage {
  height?: number | null
  url: string
  width?: number | null
}