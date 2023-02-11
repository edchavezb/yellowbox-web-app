import { Artist, Album, Track, Playlist } from "core/types/interfaces";
import { getItemProperty } from "./getItemProperty";

export const twoFactorSort = <T extends Artist | Album | Track | Playlist>(array: T[], sortFactorOne: string, sortFactorTwo: string, ascending: boolean) => {
    if (sortFactorOne === "custom") return array
    const sortOrderFactor = ascending ? 1 : -1;
    array.sort((a, b) => {
      const [factorOneInA, factorOneInB] = [getItemProperty(a, sortFactorOne, true), getItemProperty(b, sortFactorOne, true)]
      const [factorTwoInA, factorTwoInB] = [getItemProperty(a, sortFactorTwo, true), getItemProperty(b, sortFactorTwo, true)]

      if (factorOneInA < factorOneInB) return -1 * sortOrderFactor;
      else if (factorOneInA > factorOneInB) return 1 * sortOrderFactor;
      else if (sortFactorTwo) {
        if (factorTwoInA < factorTwoInB) return -1 * sortOrderFactor;
        else if (factorTwoInA > factorTwoInB) return 1 * sortOrderFactor;
      }
      return 0
    })
    return array
}