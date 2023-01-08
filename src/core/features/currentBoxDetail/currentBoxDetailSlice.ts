import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { getBoxByIdApi, updateBoxSortingApi } from "core/api/userboxes"
import { AppThunk } from "core/store/store"
import { Album, Artist, Playlist, SectionSorting, Track, UserBox } from "core/types/interfaces"

interface CurrentBoxDetailState {
    box: UserBox
}

const initialState: CurrentBoxDetailState = {
    box: {} as UserBox
};

const currentBoxDetailSlice = createSlice({
    name: 'currentBoxDetail',
    initialState,
    reducers: {
        setCurrentBoxDetail(state, action: PayloadAction<UserBox>) {
            state.box = action.payload
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
        console.log(currentBoxDetail)
        dispatch(setCurrentBoxDetail(currentBoxDetail!))
    } catch (err) {
        dispatch(setCurrentBoxDetail({} as UserBox))
    }
}

export const updateBoxSortingThunk = (boxId: string, updatedSorting: SectionSorting): AppThunk => async (dispatch) => {
    try {
        const newSorting = await updateBoxSortingApi(boxId, updatedSorting);
        console.log(newSorting)
        dispatch(updateBoxSorting(newSorting!))
    } catch (err) {
        // TODO: Handle api error
    }
}

// export const removeBoxItemThunk = (boxId: string, itemType: string, itemId: string): AppThunk => async (dispatch) => {
//     try {
//         const updatedSection = await getBoxByIdApi(boxId);
//         console.log(currentBoxDetail)
//         dispatch(setCurrentBoxDetail(currentBoxDetail!))
//     } catch (err) {
//         dispatch(setCurrentBoxDetail({} as UserBox))
//     }
// }

export default currentBoxDetailSlice.reducer;