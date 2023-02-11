import * as checkType from "core/helpers/typeguards";
import { Album, Artist, Playlist, Track } from "core/types/interfaces";

type ItemType = Artist | Album | Track | Playlist;

export const getItemProperty = (item: ItemType, propertyName: string, upperCase: boolean): string | number | Date => {
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
      default:
        propertyValue = ""
    }
    return typeof propertyValue === "string" && upperCase ? propertyValue.toUpperCase() : propertyValue
  }