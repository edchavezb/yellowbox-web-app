import { Artist, Album, Track, Playlist } from "core/types/interfaces";

type MusicData = Artist | Album | Track | Playlist;

export const reorderItems = <T extends MusicData[]>(items: T, sourceIndex: number, destinationIndex: number) => {
  const [targetItem] = items.splice(sourceIndex, 1);
  items.splice(destinationIndex, 0, targetItem);

  return items;
}