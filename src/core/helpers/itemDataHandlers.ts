import { Artist, Album, Track, Playlist, ItemImage, ApiAlbum, ApiArtist, ApiTrack, ApiPlaylist } from "core/types/interfaces";
import * as checkType from "core/helpers/typeguards";
type MusicData = Artist | Album | Track | Playlist;
type ApiMusicData = ApiArtist | ApiAlbum | ApiTrack | ApiPlaylist;

export const getItemProperty = (item: MusicData, propertyName: string, upperCase: boolean): string | number | Date => {
  let propertyValue!: string | number | Date
  switch (propertyName) {
    case "releaseYear":
      propertyValue = checkType.isTrack(item) ? parseInt(item.albumReleaseDate.split("-")[0])
        : checkType.isAlbum(item) ? parseInt(item["releaseDate"].split("-")[0]) : ""
      break;
    case "releaseMonth":
      propertyValue = checkType.isTrack(item) ? item.albumReleaseDate.replace(/-\d{2}$/, '-01')
      : checkType.isAlbum(item) ? item.releaseDate.replace(/-\d{2}$/, '-01') : "";
      break;
    case "releaseDate":
      propertyValue = checkType.isTrack(item) ? item.albumReleaseDate
        : checkType.isAlbum(item) ? item.releaseDate : ""
      break;
    case "artist":
      propertyValue = checkType.isTrack(item) || checkType.isAlbum(item) ? item.artists[0].name : ""
      break;
    case "name":
      propertyValue = item.name
      break;
    case "album":
      propertyValue = checkType.isTrack(item) ? item.albumName! : ""
      break;
    case "duration":
      propertyValue = checkType.isTrack(item) ? item.duration : ""
      break;
    case "trackNumber":
      propertyValue = checkType.isTrack(item) ? item.trackNumber : ""
      break;
    case "playedStatus":
      propertyValue = item.userPlays?.length || 0;
      break;
    default:
      propertyValue = ""
  }
  return typeof propertyValue === "string" && upperCase ? propertyValue.toUpperCase() : propertyValue
}

export const extractApiData = (item: ApiMusicData) => {
  let extractedData: MusicData;
  switch (item.type) {
    case "artist": {
      const { genres, id, images, name, popularity, type, uri } = item as ApiArtist
      extractedData = { genres, spotifyId: id, images, name, popularity, type, uri, subSectionCount: 0 } as Artist
      break;
    }
    case "album": {
      const { album_type, artists, id, images, name, release_date, total_tracks, type } = item as ApiAlbum
      extractedData = {
        albumType: album_type,
        artists: artists.map(artist => ({ name: artist.name, spotifyId: artist.id })),
        spotifyId: id,
        images,
        name,
        releaseDate: release_date,
        totalTracks: total_tracks,
        type,
        subSectionCount: 0
      } as Album
      break;
    }
    case "track": {
      const { album, artists, duration_ms, explicit, id, name, popularity, track_number, type, uri } = item as ApiTrack
      extractedData = {
        albumId: album?.id,
        albumName: album?.name,
        albumReleaseDate: album?.release_date,
        albumImages: album?.images,
        artists: artists.map(artist => ({ name: artist.name, spotifyId: artist.id })),
        duration: duration_ms,
        explicit,
        spotifyId: id,
        name,
        popularity,
        trackNumber: track_number,
        type,
        uri,
        subSectionCount: 0
      } as Track
      break;
    }
    case "playlist":
    default: {
      const { description, id, images, name, owner, tracks, type } = item as ApiPlaylist
      const { items, ...tracksData } = tracks
      extractedData = {
        description,
        spotifyId: id,
        images,
        name,
        ownerId: owner.id,
        ownerDisplayName: owner.display_name,
        totalTracks: tracksData.total,
        type,
        subSectionCount: 0
      } as Playlist
      break;
    }
  }
  return extractedData
}

export const getElementImage = (item: MusicData, size: string = "big") => {
  let itemImages: ItemImage[] | undefined;
  let sizeIndex = 0;

  const getSizeIndex = (size: string) => {
    switch (size) {
      case "big":
        return 0;
      case "medium":
        return 1;
      case "small":
        return 2;
      default:
        return 0;
    }
  }

  if (checkType.isAlbum(item)) {
    const { images } = item;
    if (images) {
      itemImages = images;
      sizeIndex = getSizeIndex(size);
    }
  }
  else if (checkType.isArtist(item)) {
    const { images } = item as Artist;
    if (images) {
      itemImages = images;
      sizeIndex = getSizeIndex(size);
    }
  }
  else if (checkType.isTrack(item)) {
    const { albumId, albumImages } = item;
    if (albumId) {
      itemImages = albumImages;
      sizeIndex = getSizeIndex(size);
    }
  }
  else if (checkType.isPlaylist(item)) {
    const { images } = item;
    if (images) {
      itemImages = images;
      sizeIndex = 0
    }
  }

  return itemImages && itemImages.length ? itemImages[sizeIndex]?.url : "https://via.placeholder.com/150"
}

export const getUri = (type: string, id: string) => {
  return `spotify:${type}:${id}`
}