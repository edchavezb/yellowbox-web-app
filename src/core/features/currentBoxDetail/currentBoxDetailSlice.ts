import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { addNoteToBoxApi, addSubsectionToBoxApi, getBoxByIdApi, removeBoxAlbumApi, removeBoxArtistApi, removeBoxPlaylistApi, removeBoxTrackApi, removeSubsectionApi, updateBoxSortingApi, updateItemNoteApi, updateSubsectionNameApi } from "core/api/userboxes"
import { AppThunk } from "core/store/store"
import { Album, Artist, Playlist, SectionSorting, Track, UserBox } from "core/types/interfaces"
import { BoxSections } from "core/types/types"

interface CurrentBoxDetailState {
    box: UserBox
    isUserViewing: boolean
}

const initialState: CurrentBoxDetailState = {
    box: {} as UserBox,
    isUserViewing: false
};

const currentBoxDetailSlice = createSlice({
    name: 'currentBoxDetail',
    initialState,
    reducers: {
        setCurrentBoxDetail(state, action: PayloadAction<UserBox>) {
            state.box = action.payload
        },
        setIsUserViewing(state, action: PayloadAction<boolean>){
            state.isUserViewing = action.payload
        },
        updateBoxSorting(state, action: PayloadAction<SectionSorting>) {
            state.box.sectionSorting = action.payload;
        },
        updateBoxArtists(state, action: PayloadAction<{updatedArtists: Artist[]}>) {
            const {updatedArtists} = action.payload;
            state.box.artists = updatedArtists;
        },
        updateBoxAlbums(state, action: PayloadAction<{updatedAlbums: Album[]}>) {
            const {updatedAlbums} = action.payload;
            state.box.albums = updatedAlbums;
        },
        updateBoxTracks(state, action: PayloadAction<{updatedTracks: Track[]}>) {
            const {updatedTracks} = action.payload;
            state.box.tracks = updatedTracks;
        },
        updateBoxPlaylists(state, action: PayloadAction<{updatedPlaylists: Playlist[]}>) {
            const {updatedPlaylists} = action.payload;
            state.box.playlists = updatedPlaylists;
        },
        updateBoxNotes(state, action: PayloadAction<UserBox['notes']>) {
            state.box.notes = action.payload;
        },
        updateBoxSubsections(state, action: PayloadAction<UserBox['subSections']>) {
            state.box.subSections = action.payload;
        }
    }
})

export const { 
    setIsUserViewing,
    setCurrentBoxDetail, 
    updateBoxSorting, 
    updateBoxArtists,
    updateBoxAlbums,
    updateBoxTracks,
    updateBoxPlaylists,
    updateBoxNotes,
    updateBoxSubsections
} = currentBoxDetailSlice.actions;

//Thunks for this slice
export const fetchBoxDetailThunk = (boxId: string): AppThunk => async (dispatch) => {
    try {
        const currentBoxDetail = await getBoxByIdApi(boxId);
        dispatch(setCurrentBoxDetail(currentBoxDetail!))
        dispatch(setIsUserViewing(true))
    } catch (err) {
        dispatch(setCurrentBoxDetail({} as UserBox))
    }
}

export const updateBoxSortingThunk = (boxId: string, updatedSorting: SectionSorting): AppThunk => async (dispatch) => {
    try {
        const newSorting = await updateBoxSortingApi(boxId, updatedSorting);
        dispatch(updateBoxSorting(newSorting!))
    } catch (err) {
        // TODO: Handle api error
    }
}

export const removeBoxArtistThunk = (boxId: string, itemId: string): AppThunk => async (dispatch) => {
    try {
        const updatedArtists = await removeBoxArtistApi(boxId, itemId);
        dispatch(updateBoxArtists({updatedArtists: updatedArtists!}))
    } catch (err) {
        console.log(err)
    }
}

export const removeBoxAlbumThunk = (boxId: string, itemId: string): AppThunk => async (dispatch) => {
    try {
        const updatedAlbums = await removeBoxAlbumApi(boxId, itemId);
        dispatch(updateBoxAlbums({updatedAlbums: updatedAlbums!}))
    } catch (err) {
        console.log(err)
    }
}

export const removeBoxTrackThunk = (boxId: string, itemId: string): AppThunk => async (dispatch) => {
    try {
        const updatedTracks = await removeBoxTrackApi(boxId, itemId);
        dispatch(updateBoxTracks({updatedTracks: updatedTracks!}))
    } catch (err) {
        console.log(err)
    }
}

export const removeBoxPlaylistThunk = (boxId: string, itemId: string): AppThunk => async (dispatch) => {
    try {
        const updatedPlaylists = await removeBoxPlaylistApi(boxId, itemId);
        dispatch(updateBoxPlaylists({updatedPlaylists: updatedPlaylists!}))
    } catch (err) {
        console.log(err)
    }
}

export const addNoteToBoxThunk = (boxId: string, itemId: string, noteText: string): AppThunk => async (dispatch) => {
    try {
        const noteObj = {itemId, noteText}
        const updatedNotes = await addNoteToBoxApi(boxId, noteObj);
        dispatch(updateBoxNotes(updatedNotes!))
    } catch (err) {
        console.log(err)
    }
}

export const updateItemNoteThunk = (boxId: string, itemId: string, noteText: string): AppThunk => async (dispatch) => {
    try {
        const noteObj = {noteText}
        const updatedNotes = await updateItemNoteApi(boxId, itemId, noteObj);
        dispatch(updateBoxNotes(updatedNotes!))
    } catch (err) {
        console.log(err)
    }
}

export const addSubsectionToBoxThunk = (boxId: string, type: string, index: number, name: string): AppThunk => async (dispatch) => {
    try {
        const subsectionObj = {type, index, name}
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
        const updatedBox = await removeSubsectionApi(boxId, subsectionId, type);
        const updatedSubsections = updatedBox?.subSections;
        dispatch(updateBoxSubsections(updatedSubsections!))
        const updatedSection = updatedBox![type as keyof Pick<UserBox, 'albums' | 'artists' | 'tracks' | 'playlists'>];
        switch(type){
            case 'artists':
                dispatch(updateBoxArtists({updatedArtists: updatedSection! as Artist[]}))
            return;
            case 'albums':
                dispatch(updateBoxAlbums({updatedAlbums: updatedSection! as Album[]}))
            return;
            case 'tracks':
                dispatch(updateBoxTracks({updatedTracks: updatedSection! as Track[]}))
            return;
            case 'playlists':
                dispatch(updateBoxPlaylists({updatedPlaylists: updatedSection! as Playlist[]}))
            return;
            default:
            return;
        }
    } catch (err) {
        console.log(err)
    }
}

export default currentBoxDetailSlice.reducer;