import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { getBoxByIdApi, removeBoxAlbumApi, removeBoxArtistApi, removeBoxPlaylistApi, removeBoxTrackApi, updateBoxSortingApi } from "core/api/userboxes"
import { AppThunk } from "core/store/store"
import { Album, Artist, Playlist, SectionSorting, Track, UserBox } from "core/types/interfaces"

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
    updateBoxPlaylists
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

export default currentBoxDetailSlice.reducer;