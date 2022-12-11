import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { getUserBoxesApi } from "core/api/userboxes"
import { AppThunk } from "core/store/store"
import { Album, Artist, Playlist, Track, UserBox } from "core/types/interfaces"

interface UserBoxesState {
    boxes: UserBox[]
}

const initialState: UserBoxesState = {
    boxes: []
};

const userBoxesSlice = createSlice({
    name: 'userBoxes',
    initialState,
    reducers: {
        setUserBoxes(state, action: PayloadAction<UserBox[]>) {
            state.boxes = action.payload
        },
        updateUserBox(state, action: PayloadAction<{targetId: string, updatedBox: UserBox}>) {
            state.boxes.map((item) => item._id === action.payload.targetId ? action.payload.updatedBox : item)
        },
        createUserBox(state, action: PayloadAction<UserBox>) {
            state.boxes.push(action.payload);
        },
        deleteUserBox(state, action: PayloadAction<{targetId: string}>) {
            state.boxes.filter((item) => item._id !== action.payload.targetId)
        },
        updateBoxArtists(state, action: PayloadAction<{targetBoxId: string, updatedArtists: Artist[]}>) {
            const {targetBoxId, updatedArtists} = action.payload
            const targetBox = state.boxes.find(box => box._id === targetBoxId);
            if(targetBox) {
               targetBox.artists = updatedArtists;
            }
        },
        updateBoxAlbums(state, action: PayloadAction<{targetBoxId: string, updatedAlbums: Album[]}>) {
            const {targetBoxId, updatedAlbums} = action.payload
            const targetBox = state.boxes.find(box => box._id === targetBoxId);
            if(targetBox) {
               targetBox.albums = updatedAlbums;
            }
        },
        updateBoxTracks(state, action: PayloadAction<{targetBoxId: string, updatedTracks: Track[]}>) {
            const {targetBoxId, updatedTracks} = action.payload
            const targetBox = state.boxes.find(box => box._id === targetBoxId);
            if(targetBox) {
               targetBox.tracks = updatedTracks;
            }
        },
        updateBoxPlaylists(state, action: PayloadAction<{targetBoxId: string, updatedPlaylists: Playlist[]}>) {
            const {targetBoxId, updatedPlaylists} = action.payload
            const targetBox = state.boxes.find(box => box._id === targetBoxId);
            if(targetBox) {
               targetBox.playlists = updatedPlaylists;
            }
        },
    }
})

export const { 
    setUserBoxes, 
    updateUserBox, 
    createUserBox, 
    deleteUserBox,
    updateBoxArtists,
    updateBoxAlbums,
    updateBoxTracks,
    updateBoxPlaylists
} = userBoxesSlice.actions;

//Thunks for this slice
export const fetchUserBoxes = (userId: string): AppThunk => async (dispatch) => {
    try {
        const userBoxes = await getUserBoxesApi(userId);
        console.log(userBoxes)
        dispatch(setUserBoxes(userBoxes!))
    } catch (err) {
        dispatch(setUserBoxes([]))
    }
}

export default userBoxesSlice.reducer;