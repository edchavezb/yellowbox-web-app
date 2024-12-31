import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { addSubsectionToBoxApi, getBoxByIdApi, removeSubsectionApi, reorderSubsectionsApi, updateAllSectionSettingsApi, updateBoxInfoApi, updateBoxSectionSettingsApi, updateSubsectionNameApi } from "core/api/userboxes"
import { removeBoxAlbumApi, addAlbumToSubsectionApi, removeAlbumFromSubsectionApi, reorderBoxAlbumApi, reorderSubsectionAlbumApi, updateBoxAlbumNoteApi, updateSubsectionAlbumNoteApi } from "core/api/userboxes/albums"
import { removeBoxArtistApi, addArtistToSubsectionApi, removeArtistFromSubsectionApi, reorderBoxArtistApi, reorderSubsectionArtistApi, updateBoxArtistNoteApi, updateSubsectionArtistNoteApi } from "core/api/userboxes/artists"
import { removeBoxPlaylistApi, addPlaylistToSubsectionApi, removePlaylistFromSubsectionApi, reorderBoxPlaylistApi, reorderSubsectionPlaylistApi, updateBoxPlaylistNoteApi, updateSubsectionPlaylistNoteApi } from "core/api/userboxes/playlists"
import { removeBoxTrackApi, addTrackToSubsectionApi, removeTrackFromSubsectionApi, reorderBoxTrackApi, reorderSubsectionTrackApi, updateBoxTrackNoteApi, updateSubsectionTrackNoteApi } from "core/api/userboxes/tracks"
import { AppThunk } from "core/store/store"
import { Album, Artist, Playlist, SectionSettings, Subsection, Track, UserBox } from "core/types/interfaces"
import { BoxSections, ItemData } from "core/types/types"
import { updateBoxName } from "../userBoxes/userBoxesSlice"
import { updateUserFolderBox } from "../userFolders/userFoldersSlice"
import { initErrorToast, initRemoveFromBoxToast } from "../toast/toastSlice"
import { reorderItems } from "core/helpers/reorderItems"
import { ResponseError } from "core/api"

type MusicData = Artist | Album | Track | Playlist;

interface CurrentBoxDetailState {
  box: UserBox & { creatorName?: string }
  boxError: { errorCode: number | null; error: string } | null
  isUserViewing: boolean
  isDataFetching: boolean
}

const initialState: CurrentBoxDetailState = {
  box: {} as UserBox,
  boxError: null,
  isUserViewing: false,
  isDataFetching: false
};

const currentBoxDetailSlice = createSlice({
  name: 'currentBoxDetail',
  initialState,
  reducers: {
    setCurrentBoxDetail(state, action: PayloadAction<UserBox & { creatorName?: string }>) {
      state.box = action.payload
    },
    setCurrentBoxError(state, action: PayloadAction<{ errorCode: number | null; error: string }>) {
      state.boxError = action.payload
    },
    updateCurrentBoxDetail(state, action: PayloadAction<UserBox>) {
      const { name, description } = action.payload;
      state.box.name = name
      state.box.description = description
      state.box.isPublic = action.payload.isPublic
    },
    setIsUserViewing(state, action: PayloadAction<boolean>) {
      state.isUserViewing = action.payload
    },
    setIsBoxDataFetching(state, action: PayloadAction<boolean>) {
      state.isDataFetching = action.payload
    },
    updateBoxSectionSettings(state, action: PayloadAction<SectionSettings>) {
      const { type } = action.payload;

      state.box.sectionSettings = state.box.sectionSettings.map((setting) =>
        setting.type === type ? { ...setting, ...action.payload } : setting
      );
    },
    updateAllSectionSettings(state, action: PayloadAction<SectionSettings[]>) {
      state.box.sectionSettings = action.payload;
    },
    updateBoxArtists(state, action: PayloadAction<{ updatedArtists: Artist[] }>) {
      const { updatedArtists } = action.payload;
      state.box.artists = updatedArtists;
    },
    updateBoxAlbums(state, action: PayloadAction<{ updatedAlbums: Album[] }>) {
      const { updatedAlbums } = action.payload;
      state.box.albums = updatedAlbums;
    },
    updateBoxTracks(state, action: PayloadAction<{ updatedTracks: Track[] }>) {
      const { updatedTracks } = action.payload;
      state.box.tracks = updatedTracks;
    },
    updateBoxPlaylists(state, action: PayloadAction<{ updatedPlaylists: Playlist[] }>) {
      const { updatedPlaylists } = action.payload;
      state.box.playlists = updatedPlaylists;
    },
    updateBoxSubsections(state, action: PayloadAction<Subsection[]>) {
      state.box.subsections = action.payload;
    },
    updateBoxSubsectionById(state, action: PayloadAction<{ subId: string, updatedSub: Subsection }>) {
      const { subId, updatedSub } = action.payload;
      const targetIndex = state.box.subsections.findIndex(sub => sub.subsectionId === subId);
      state.box.subsections[targetIndex] = updatedSub;
    },
    updateBoxSubsectionItems(state, action: PayloadAction<{ subId: string, updatedItems: MusicData[] }>) {
      const { subId, updatedItems } = action.payload;
      const targetIndex = state.box.subsections.findIndex(sub => sub.subsectionId === subId);
      state.box.subsections[targetIndex].items = updatedItems;
    },
    updateBoxItemNote(state, action: PayloadAction<{ boxItemId: string; type: string; updatedNote: string }>) {
      const { boxItemId, type, updatedNote } = action.payload;
      let targetIndex: number | null = null;

      switch (type) {
        case "album":
          targetIndex = state.box.albums.findIndex(item => item.boxItemId === boxItemId);
          if (targetIndex !== -1) {
            state.box.albums[targetIndex].note = updatedNote;
          }
          break;
        case "artist":
          targetIndex = state.box.artists.findIndex(item => item.boxItemId === boxItemId);
          if (targetIndex !== -1) {
            state.box.artists[targetIndex].note = updatedNote;
          }
          break;
        case "track":
          targetIndex = state.box.tracks.findIndex(item => item.boxItemId === boxItemId);
          if (targetIndex !== -1) {
            state.box.tracks[targetIndex].note = updatedNote;
          }
          break;
        case "playlist":
          targetIndex = state.box.playlists.findIndex(item => item.boxItemId === boxItemId);
          if (targetIndex !== -1) {
            state.box.playlists[targetIndex].note = updatedNote;
          }
          break;
        default:
          console.error(`Unknown type: ${type}`);
          break;
      }
    },
    updateSubsectionItemNote(
      state,
      action: PayloadAction<{
        subsectionId: string;
        boxItemId: string;
        updatedNote: string;
      }>
    ) {
      const { subsectionId, boxItemId, updatedNote } = action.payload;    
      const subsectionIndex = state.box.subsections.findIndex(
        (subsection) => subsection.subsectionId === subsectionId
      );
    
      if (subsectionIndex !== -1) {
        const itemIndex = state.box.subsections[subsectionIndex].items.findIndex(
          (item) => item.boxItemId === boxItemId
        );
    
        if (itemIndex !== -1) {
          state.box.subsections[subsectionIndex].items[itemIndex].note = updatedNote;
        }
      }
    }    
  }
})

export const {
  setIsUserViewing,
  setIsBoxDataFetching,
  setCurrentBoxError,
  setCurrentBoxDetail,
  updateCurrentBoxDetail,
  updateBoxSectionSettings,
  updateAllSectionSettings,
  updateBoxArtists,
  updateBoxAlbums,
  updateBoxTracks,
  updateBoxPlaylists,
  updateBoxSubsections,
  updateBoxSubsectionById,
  updateBoxSubsectionItems,
  updateBoxItemNote,
  updateSubsectionItemNote
} = currentBoxDetailSlice.actions;

//Thunks for this slice
export const fetchBoxDetailThunk = (boxId: string): AppThunk => async (dispatch) => {
  try {
    const currentBoxDetail = await getBoxByIdApi(boxId);
    if (currentBoxDetail) {
      const { boxData, creatorName } = currentBoxDetail;
      dispatch(setCurrentBoxDetail({ ...boxData, creatorName }))
      dispatch(setCurrentBoxError({ errorCode: null, error: '' }))
      dispatch(setIsUserViewing(true))
    }
  } catch (err) {
    dispatch(setCurrentBoxDetail({} as UserBox))
    dispatch(setCurrentBoxError({ errorCode: (err as ResponseError).status || null, error: (err as ResponseError).message }));
  }
}

export const updateCurrentBoxDetailThunk = (boxId: string, name: string, description: string, isPublic: boolean): AppThunk => async (dispatch, getState) => {
  try {
    console.log('updateCurrentBoxDetailThunk');
    const containingFolderId = getState().currentBoxDetailData.box.folder?.folderId;
    const updatedBox = await updateBoxInfoApi(boxId, name, description, isPublic);
    if (updatedBox) {
      dispatch(updateCurrentBoxDetail(updatedBox!))
      if (containingFolderId) {
        const updatedDashboardBox = {
          name: updatedBox.name,
          boxId: updatedBox.boxId,
          position: updatedBox.position,
          folderPosition: updatedBox.folderPosition,
          folderId: updatedBox.folder.folderId
        }
        dispatch(updateUserFolderBox({ folderId: containingFolderId, boxId, updatedBox: updatedDashboardBox }))
      }
      else (
        dispatch(updateBoxName({ targetId: boxId, newName: updatedBox.name }))
      )
    }
  } catch (err) {
    console.log(err)
  }
}

export const updateBoxSectionSettingsThunk = (boxId: string, updatedSettings: SectionSettings): AppThunk => async (dispatch) => {
  try {
    const type = updatedSettings.type;
    const { updatedBox } = await updateBoxSectionSettingsApi(boxId, updatedSettings);
    dispatch(setIsBoxDataFetching(false));
    dispatch(updateBoxSectionSettings(updatedBox.sectionSettings.find(setting => setting.type === type)!))
    switch (type) {
      case 'artists':
        dispatch(updateBoxArtists({ updatedArtists: updatedBox.artists }))
        break;
      case 'albums':
        dispatch(updateBoxAlbums({ updatedAlbums: updatedBox.albums }))
        break;
      case 'tracks':
        dispatch(updateBoxTracks({ updatedTracks: updatedBox.tracks }))
        break;
      case 'playlists':
        dispatch(updateBoxPlaylists({ updatedPlaylists: updatedBox.playlists }))
        break;
      default:
        break;
    }
  } catch (err) {
    console.log(err)
  }
}

export const updateAllSectionSettingsThunk = (boxId: string, updatedSettings: SectionSettings[]): AppThunk => async (dispatch) => {
  try {
    const { updatedBox } = await updateAllSectionSettingsApi(boxId, updatedSettings);
    dispatch(updateAllSectionSettings(updatedBox.sectionSettings));
    dispatch(updateBoxArtists({ updatedArtists: updatedBox.artists }));
    dispatch(updateBoxAlbums({ updatedAlbums: updatedBox.albums }));
    dispatch(updateBoxTracks({ updatedTracks: updatedBox.tracks }));
    dispatch(updateBoxPlaylists({ updatedPlaylists: updatedBox.playlists }));
  } catch (err) {
    console.log(err)
  }
}

export const removeBoxArtistThunk = (boxId: string, boxName: string, boxItemId: string): AppThunk => async (dispatch) => {
  try {
    const response = await removeBoxArtistApi(boxId, boxItemId);
    dispatch(updateBoxArtists({ updatedArtists: response.artists! }));
    dispatch(updateBoxSubsections(response.subsections!))
    dispatch(initRemoveFromBoxToast({ itemType: 'artist', boxName }));
  } catch (err) {
    console.log(err)
    dispatch(initErrorToast({ error: "Failed to remove artist from box" }));
  }
}

export const removeBoxAlbumThunk = (boxId: string, boxName: string, boxItemId: string): AppThunk => async (dispatch) => {
  try {
    const response = await removeBoxAlbumApi(boxId, boxItemId);
    dispatch(updateBoxAlbums({ updatedAlbums: response.albums! }));
    dispatch(updateBoxSubsections(response.subsections!))
    dispatch(initRemoveFromBoxToast({ itemType: 'album', boxName }));
  } catch (err) {
    console.log(err)
    dispatch(initErrorToast({ error: "Failed to remove album from box" }));
  }
}

export const removeBoxTrackThunk = (boxId: string, boxName: string, boxItemId: string): AppThunk => async (dispatch) => {
  try {
    const response = await removeBoxTrackApi(boxId, boxItemId);
    dispatch(updateBoxTracks({ updatedTracks: response.tracks! }));
    dispatch(updateBoxSubsections(response.subsections!))
    dispatch(initRemoveFromBoxToast({ itemType: 'track', boxName }));
  } catch (err) {
    console.log(err)
    dispatch(initErrorToast({ error: "Failed to remove track from box" }));
  }
}

export const removeBoxPlaylistThunk = (boxId: string, boxName: string, boxItemId: string): AppThunk => async (dispatch) => {
  try {
    const response = await removeBoxPlaylistApi(boxId, boxItemId);
    dispatch(updateBoxPlaylists({ updatedPlaylists: response.playlists! }));
    dispatch(updateBoxSubsections(response.subsections!))
    dispatch(initRemoveFromBoxToast({ itemType: 'playlist', boxName }));
  } catch (err) {
    console.log(err)
    dispatch(initErrorToast({ error: "Failed to remove playlist from box" }));
  }
}

export const updateBoxItemNoteThunk = (boxId: string, note: string, boxItemId: string, type: string): AppThunk => async (dispatch) => {
  try {
    let response: { updatedNote: string } | null = null;
    switch (type) {
      case 'artist':
        response = await updateBoxArtistNoteApi(boxId, boxItemId, note);
        break;
      case 'album':
        response = await updateBoxAlbumNoteApi(boxId, boxItemId, note);
        break;
      case 'track':
        response = await updateBoxTrackNoteApi(boxId, boxItemId, note);
        break;
      case 'playlist':
        response = await updateBoxPlaylistNoteApi(boxId, boxItemId, note);
        break;
      default:
        break;
    }
    dispatch(updateBoxItemNote({ boxItemId, type, updatedNote: response?.updatedNote! }))
  } catch (err) {
    console.log(err)
  }
}

export const updateSubsectionItemNoteThunk = (boxId: string, subsectionId: string, note: string, boxItemId: string, type: string): AppThunk => async (dispatch) => {
  try {
    let response: { updatedNote: string } | null = null;
    switch (type) {
      case 'artist':
        response = await updateSubsectionArtistNoteApi(boxId, subsectionId, boxItemId, note);
        break;
      case 'album':
        response = await updateSubsectionAlbumNoteApi(boxId, subsectionId, boxItemId, note);
        break;
      case 'track':
        response = await updateSubsectionTrackNoteApi(boxId, subsectionId, boxItemId, note);
        break;
      case 'playlist':
        response = await updateSubsectionPlaylistNoteApi(boxId, subsectionId, boxItemId, note);
        break;
      default:
        break;
    }
    dispatch(updateSubsectionItemNote({ subsectionId, boxItemId, updatedNote: response?.updatedNote! }))
  } catch (err) {
    console.log(err)
  }
}

export const addSubsectionToBoxThunk = (boxId: string, itemType: string, position: number, name: string): AppThunk => async (dispatch) => {
  try {
    const subsectionObj = { itemType, position, name, items: [] }
    const updatedSubsections = await addSubsectionToBoxApi(boxId, subsectionObj);
    dispatch(updateBoxSubsections(updatedSubsections!))
  } catch (err) {
    console.log(err)
  }
}

export const updateSubsectionNameThunk = (boxId: string, subsectionId: string, name: string): AppThunk => async (dispatch) => {
  try {
    const updatedSubsections = await updateSubsectionNameApi(boxId, subsectionId, name);
    dispatch(updateBoxSubsections(updatedSubsections!))
  } catch (err) {
    console.log(err)
  }
}

export const removeSubsectionThunk = (boxId: string, subsectionId: string, type: BoxSections): AppThunk => async (dispatch) => {
  try {
    const updatedBox = await removeSubsectionApi(boxId, subsectionId);
    const updatedSubsections = updatedBox?.subsections;
    dispatch(updateBoxSubsections(updatedSubsections!))
    const updatedSection = updatedBox![type as keyof Pick<UserBox, 'albums' | 'artists' | 'tracks' | 'playlists'>];
    switch (type) {
      case 'artists':
        dispatch(updateBoxArtists({ updatedArtists: updatedSection! as Artist[] }))
        break;
      case 'albums':
        dispatch(updateBoxAlbums({ updatedAlbums: updatedSection! as Album[] }))
        break;
      case 'tracks':
        dispatch(updateBoxTracks({ updatedTracks: updatedSection! as Track[] }))
        break;
      case 'playlists':
        dispatch(updateBoxPlaylists({ updatedPlaylists: updatedSection! as Playlist[] }))
        break;
      default:
        break;
    }
  } catch (err) {
    console.log(err)
  }
}

export const reorderSubsectionsThunk = (boxId: string, subsections: Subsection[], sourceIndex: number, destinationIndex: number, type: string): AppThunk => async (dispatch) => {
  try {
    const subsectionsCopy = JSON.parse(JSON.stringify(subsections)) as Subsection[];
    const subsToReorder = subsectionsCopy.filter(sub => sub.itemType === type);
    const rest = subsectionsCopy.filter(sub => sub.itemType !== type);
    const reorderedSubs = reorderItems(subsToReorder, sourceIndex, destinationIndex);
    dispatch(updateBoxSubsections([...reorderedSubs, ...rest]))
    await reorderSubsectionsApi(boxId, subsectionsCopy[sourceIndex].subsectionId!, subsectionsCopy[destinationIndex].subsectionId!)
  } catch (err) {
    console.log(err)
  }
}

export const addItemToSubsectionThunk = (boxId: string, type: BoxSections, subsectionId: string, itemData: ItemData): AppThunk => async (dispatch) => {
  try {
    let response: UserBox | null = null;
    switch (type) {
      case 'artists':
        response = await addArtistToSubsectionApi(boxId,  subsectionId, itemData.boxItemId!,) as UserBox
        dispatch(updateBoxArtists({ updatedArtists: response.artists! }))
        break;
      case 'albums':
        response = await addAlbumToSubsectionApi(boxId,  subsectionId, itemData.boxItemId!) as UserBox
        dispatch(updateBoxAlbums({ updatedAlbums: response.albums! }))
        break;
      case 'tracks':
        response = await addTrackToSubsectionApi(boxId,  subsectionId, itemData.boxItemId!) as UserBox
        dispatch(updateBoxTracks({ updatedTracks: response.tracks! }))
        break;
      case 'playlists':
        response = await addPlaylistToSubsectionApi(boxId, subsectionId, itemData.boxItemId!) as UserBox
        dispatch(updateBoxPlaylists({ updatedPlaylists: response.playlists! }))
        break;
      default:
        break;
    }
    if (response) {
      dispatch(updateBoxSubsections(response.subsections))
    }
  } catch (err) {
    console.log(err)
  }
}

export const removeItemFromSubsectionThunk = (boxId: string, subsectionId: string, boxItemId: string, type: BoxSections): AppThunk => async (dispatch) => {
  try {
    let response: UserBox | null = null;
    switch (type) {
      case 'artists':
        response = await removeArtistFromSubsectionApi(boxId, boxItemId, subsectionId) as UserBox
        dispatch(updateBoxArtists({ updatedArtists: response.artists! }))
        break;
      case 'albums':
        response = await removeAlbumFromSubsectionApi(boxId, boxItemId, subsectionId) as UserBox
        dispatch(updateBoxAlbums({ updatedAlbums: response.albums! }))
        break;
      case 'tracks':
        response = await removeTrackFromSubsectionApi(boxId, boxItemId, subsectionId) as UserBox
        dispatch(updateBoxTracks({ updatedTracks: response.tracks! }))
        break;
      case 'playlists':
        response = await removePlaylistFromSubsectionApi(boxId, boxItemId, subsectionId) as UserBox
        dispatch(updateBoxPlaylists({ updatedPlaylists: response.playlists! }))
        break;
      default:
        break;
    }
    if (response) {
      dispatch(updateBoxSubsections(response.subsections))
    }
  } catch (err) {
    console.log(err)
  }
}

export const reorderBoxItemsThunk = (boxId: string, boxItemId: string, sourceIndex: number, destinationIndex: number, itemType: string): AppThunk => async (dispatch, getState) => {
  try {
    switch (itemType) {
      case 'artist':
        const artistsCopy = JSON.parse(JSON.stringify(getState().currentBoxDetailData.box.artists));
        const destinationArtistId = artistsCopy[destinationIndex].boxItemId;
        const updatedArtists = reorderItems(artistsCopy, sourceIndex, destinationIndex)
        dispatch(updateBoxArtists({ updatedArtists }))
        await reorderBoxArtistApi(boxId, boxItemId, destinationArtistId)
        break;
      case 'album':
        const albumsCopy = JSON.parse(JSON.stringify(getState().currentBoxDetailData.box.albums));
        const destinationAlbumId = albumsCopy[destinationIndex].boxItemId;
        const updatedAlbums = reorderItems(albumsCopy, sourceIndex, destinationIndex)
        dispatch(updateBoxAlbums({ updatedAlbums }))
        await reorderBoxAlbumApi(boxId, boxItemId, destinationAlbumId)
        break;
      case 'track':
        const tracksCopy = JSON.parse(JSON.stringify(getState().currentBoxDetailData.box.tracks));
        const destinationTrackId = tracksCopy[destinationIndex].boxItemId;
        const updatedTracks = reorderItems(tracksCopy, sourceIndex, destinationIndex)
        dispatch(updateBoxTracks({ updatedTracks }))
        await reorderBoxTrackApi(boxId, boxItemId, destinationTrackId)
        break;
      case 'playlist':
        const playlistsCopy = JSON.parse(JSON.stringify(getState().currentBoxDetailData.box.playlists));
        const destinationPlaylistId = playlistsCopy[destinationIndex].boxItemId;
        const updatedPlaylists = reorderItems(playlistsCopy, sourceIndex, destinationIndex)
        dispatch(updateBoxPlaylists({ updatedPlaylists }))
        await reorderBoxPlaylistApi(boxId, boxItemId, destinationPlaylistId)
        break;
      default:
        break;
    }
  } catch (err) {
    console.log(err)
  }
}

export const reorderSubsectionItemsThunk = (boxId: string, boxItemId: string, subId: string, sourcePosition: number, destinationPosition: number): AppThunk => async (dispatch, getState) => {
  try {
    const subsections = getState().currentBoxDetailData.box.subsections;
    const targetSub = subsections.find(sub => sub.subsectionId === subId);
    if (targetSub) {
      const itemsCopy: ItemData[] = JSON.parse(JSON.stringify(targetSub?.items));
      const destinationItemId = itemsCopy[destinationPosition].boxItemId!;
      const updatedItems = reorderItems(itemsCopy, sourcePosition, destinationPosition);
      dispatch(updateBoxSubsectionItems({ subId, updatedItems }));
      switch (targetSub?.itemType) {
        case 'artists':
          await reorderSubsectionArtistApi(boxId, subId, boxItemId, destinationItemId);
          break;
        case 'albums':
          await reorderSubsectionAlbumApi(boxId, subId, boxItemId, destinationItemId);
          break;
        case 'tracks':
          await reorderSubsectionTrackApi(boxId, subId, boxItemId, destinationItemId);
          break;
        case 'playlists':
          await reorderSubsectionPlaylistApi(boxId, subId, boxItemId, destinationItemId);
          break;
        default:
          break;
      }
    }
  } catch (err) {
    console.log(err)
  }
}

export default currentBoxDetailSlice.reducer;