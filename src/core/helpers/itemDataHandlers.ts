import { Artist, Album, Track, Playlist, ItemImage } from "core/types/interfaces";
import * as checkType from "core/helpers/typeguards";
type MusicData = Artist | Album | Track | Playlist;

export const getItemProperty = (item: MusicData, propertyName: string, upperCase: boolean): string | number | Date => {
    let propertyValue!: string | number | Date
    switch (propertyName) {
      case "release_year":
        propertyValue = checkType.isTrack(item) ? parseInt(item.album!["release_date"].split("-")[0])
          : checkType.isAlbum(item) ? parseInt(item["release_date"].split("-")[0]) : ""
        break;
      case "release_date":
        propertyValue = checkType.isTrack(item) ? new Date(item.album!.release_date)
          : checkType.isAlbum(item) ? new Date(item.release_date) : ""
        break;
      case "artist":
        propertyValue = checkType.isTrack(item) || checkType.isAlbum(item) ? item.artists[0].name : ""
        break;
      case "name":
        propertyValue = item.name
        break;
      case "album":
        propertyValue = checkType.isTrack(item) ? item.album!.name : ""
        break;
      case "duration":
        propertyValue = checkType.isTrack(item) ? item.duration_ms : ""
        break;
      case "track_number":
        propertyValue = checkType.isTrack(item) ? item.track_number : ""
        break;
      case "popularity":
        propertyValue = !checkType.isAlbum(item) && !checkType.isPlaylist(item)? item.popularity! : "";
        break;
      default:
        propertyValue = ""
    }
    return typeof propertyValue === "string" && upperCase ? propertyValue.toUpperCase() : propertyValue
  }

export const extractCrucialData = (item: MusicData) => {
  let extractedData: MusicData;
  switch (item.type) {
    case "artist": {
      const { external_urls, genres, id, images, name, popularity, type, uri } = item as Artist
      extractedData = { external_urls, genres, id, images, name, popularity, type, uri, subSectionCount: 0 }
      break;
    }
    case "album": {
      const { album_type, artists, external_urls, id, images, name, release_date, total_tracks, type, uri } = item as Album
      extractedData = { album_type, artists, external_urls, id, images, name, release_date, total_tracks, type, uri, subSectionCount: 0 }
      break;
    }
    case "track": {
      const { album, artists, duration_ms, explicit, external_urls, id, name, popularity, preview_url, track_number, type, uri } = item as Track
      extractedData = { album, artists, duration_ms, explicit, external_urls, id, name, popularity, preview_url, track_number, type, uri, subSectionCount: 0 }
      break;
    }
    case "playlist": {
      const { description, external_urls, id, images, name, owner, tracks, type, uri } = item as Playlist
      const { items, ...tracksData } = tracks
      extractedData = { description, external_urls, id, images, name, owner, tracks: tracksData, type, uri, subSectionCount: 0 }
      break;
    }
    default:
      extractedData = item
  }
  return extractedData
}

export const getElementImage = (item: MusicData) => {
  let itemImages: ItemImage[] | undefined;

  if (checkType.isAlbum(item)) {
    const { images } = item;
    if (images){
      itemImages = images;
    }
  }
  else if (checkType.isArtist(item)) {
    const { images } = item as Artist;
    if (images){
      itemImages = images;
    }
  }
  else if (checkType.isTrack(item)) {
    const { album } = item;
    if (album){
      itemImages = album.images;
    }
  }
  else if (checkType.isPlaylist(item)) {
    const { images } = item;
    if (images){
      itemImages = images;
    }
  }

  return itemImages && itemImages.length ? itemImages[0].url : "https://via.placeholder.com/150"
}