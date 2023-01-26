import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { getUserBoxesApi } from "core/api/users"
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
            const targetIndex = state.boxes.findIndex(box => box._id === action.payload.targetId);
            state.boxes[targetIndex] = action.payload.updatedBox;
        },
        createUserBox(state, action: PayloadAction<UserBox>) {
            state.boxes.push(action.payload);
        },
        deleteUserBox(state, action: PayloadAction<{targetId: string}>) {
            state.boxes.splice(state.boxes.findIndex(box => box._id === action.payload.targetId), 1);
        },
        updateBoxArtists(state, action: PayloadAction<{targetId: string, updatedArtists: Artist[]}>) {
            const {targetId, updatedArtists} = action.payload;
            const targetIndex = state.boxes.findIndex(box => box._id === targetId);
            state.boxes[targetIndex].artists = updatedArtists;
        },
        updateBoxAlbums(state, action: PayloadAction<{targetId: string, updatedAlbums: Album[]}>) {
            const {targetId, updatedAlbums} = action.payload;
            const targetIndex = state.boxes.findIndex(box => box._id === targetId);
            state.boxes[targetIndex].albums = updatedAlbums;
        },
        updateBoxTracks(state, action: PayloadAction<{targetId: string, updatedTracks: Track[]}>) {
            const {targetId, updatedTracks} = action.payload;
            const targetIndex = state.boxes.findIndex(box => box._id === targetId);
            state.boxes[targetIndex].tracks = updatedTracks;
        },
        updateBoxPlaylists(state, action: PayloadAction<{targetId: string, updatedPlaylists: Playlist[]}>) {
            const {targetId, updatedPlaylists} = action.payload;
            const targetIndex = state.boxes.findIndex(box => box._id === targetId);
            state.boxes[targetIndex].playlists = updatedPlaylists;
        }
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
        dispatch(setUserBoxes(userBoxes!))
    } catch (err) {
        dispatch(setUserBoxes([]))
    }
}

export default userBoxesSlice.reducer;