import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { addAlbumToSubsectionApi, addArtistToSubsectionApi, addNoteToBoxApi, addPlaylistToSubsectionApi, addSubsectionToBoxApi, addTrackToSubsectionApi, getBoxByIdApi, removeAlbumFromSubsectionApi, removeArtistFromSubsectionApi, removeBoxAlbumApi, removeBoxArtistApi, removeBoxPlaylistApi, removeBoxTrackApi, removePlaylistFromSubsectionApi, removeSubsectionApi, removeTrackFromSubsectionApi, updateBoxAlbumsApi, updateBoxArtistsApi, updateBoxPlaylistsApi, updateBoxSortingApi, updateBoxTracksApi, updateItemNoteApi, updateSubsectionNameApi, updateSubsectionsApi, updateUserBoxApi } from "core/api/userboxes"
import { AppThunk } from "core/store/store"
import { Album, Artist, Playlist, SectionSorting, Subsection, Track, UserBox } from "core/types/interfaces"
import { BoxSections, ItemData } from "core/types/types"
import { updateBoxName } from "../userBoxes/userBoxesSlice"
import { updateFolderBoxesApi, updateFolderBoxNameApi } from "core/api/userfolders"
import { updateUserFolder } from "../userFolders/userFoldersSlice"

interface CurrentBoxDetailState {
    box: UserBox & {creatorName?: string}
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
        setCurrentBoxDetail(state, action: PayloadAction<UserBox & {creatorName?: string}>) {
            state.box = action.payload
        },
        updateCurrentBoxDetail(state, action: PayloadAction<UserBox>) {
            const {name, description} = action.payload;
            state.box.name = name
            state.box.description = description
            state.box.public = action.payload.public
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
        updateBoxSubsections(state, action: PayloadAction<Subsection[]>) {
            state.box.subSections = action.payload;
        }
    }
})

export const { 
    setIsUserViewing,
    setCurrentBoxDetail, 
    updateCurrentBoxDetail,
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
        if (currentBoxDetail) {
            const {boxData, creatorName} = currentBoxDetail;
            dispatch(setCurrentBoxDetail({...boxData, creatorName}))
            dispatch(setIsUserViewing(true))
        }
    } catch (err) {
        dispatch(setCurrentBoxDetail({} as UserBox))
    }
}

export const updateCurrentBoxDetailThunk = (boxId: string, updatedBox: UserBox): AppThunk => async (dispatch, getState) => {
    try {
        const containingFolder = getState().userFoldersData.folders.find(folder => folder.boxes.some(box => box.boxId === boxId));
        const boxDetail = await updateUserBoxApi(boxId, updatedBox);
        dispatch(updateCurrentBoxDetail(boxDetail!))
        if (containingFolder){
            const apiResponse = await updateFolderBoxNameApi(containingFolder._id, boxId, updatedBox.name);
            if (apiResponse?.updatedFolder) {
                dispatch(updateUserFolder({targetId: containingFolder._id, updatedFolder: apiResponse.updatedFolder}))
            }
        }
        else (
            dispatch(updateBoxName({targetId: boxId, newName: updatedBox.name}))
        )
    } catch (err) {
        console.log(err)
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

export const addNoteToBoxThunk = (boxId: string, spotifyId: string, noteText: string, subSectionId?: string): AppThunk => async (dispatch) => {
    try {
        const noteObj = {itemId: spotifyId, noteText, subSectionId}
        const updatedNotes = await addNoteToBoxApi(boxId, noteObj);
        dispatch(updateBoxNotes(updatedNotes!))
    } catch (err) {
        console.log(err)
    }
}

export const updateItemNoteThunk = (boxId: string, noteId: string, noteText: string): AppThunk => async (dispatch) => {
    try {
        const noteObj = {noteText}
        const updatedNotes = await updateItemNoteApi(boxId, noteId, noteObj);
        dispatch(updateBoxNotes(updatedNotes!))
    } catch (err) {
        console.log(err)
    }
}

export const addSubsectionToBoxThunk = (boxId: string, type: string, index: number, name: string): AppThunk => async (dispatch) => {
    try {
        const subsectionObj = {type, index, name, items: []}
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
            break;
            case 'albums':
                dispatch(updateBoxAlbums({updatedAlbums: updatedSection! as Album[]}))
            break;
            case 'tracks':
                dispatch(updateBoxTracks({updatedTracks: updatedSection! as Track[]}))
            break;
            case 'playlists':
                dispatch(updateBoxPlaylists({updatedPlaylists: updatedSection! as Playlist[]}))
            break;
            default:
            break;
        }
    } catch (err) {
        console.log(err)
    }
}

export const reorderSubsectionsThunk = (boxId: string, subSections: Subsection[], draggedId: string, targetId: string, type: string): AppThunk => async (dispatch) => {
    const partition = (arr: Subsection[], type: string) => {
        const passed = arr.filter(sub => sub.type === type);
        const failed = arr.filter(sub => sub.type !== type);
        return [passed, failed];
    };
    try {
        const subsectionsCopy = JSON.parse(JSON.stringify(subSections));
        const [subsToReorder, rest] = partition(subsectionsCopy, type);
        const draggedSub = subsToReorder.find(sub => sub._id === draggedId)
        const draggedIndex = subsToReorder.findIndex(sub => sub._id === draggedId);
        const targetIndex = subsToReorder.findIndex(sub => sub._id === targetId);
        subsToReorder.splice(draggedIndex, 1);
        subsToReorder.splice(targetIndex, 0, draggedSub!)
        const reorderedSubs = subsToReorder.map(
            (sub, newIndex) => ({
                ...sub,
                index: newIndex
            })
        )
        dispatch(updateBoxSubsections([...reorderedSubs, ...rest]))
        await updateSubsectionsApi(boxId, [...reorderedSubs, ...rest])
    } catch (err) {
        console.log(err)
    }
}

export const addItemToSubsectionThunk = (boxId: string, type: BoxSections, subsectionId: string, itemData: ItemData): AppThunk => async (dispatch) => {
    try {
        const {_id, ...itemFields} = itemData
        let response: UserBox | null = null;
        switch(type){
            case 'artists':
                response = await addArtistToSubsectionApi(boxId, itemData._id!, subsectionId, itemFields as Artist) as UserBox
                dispatch(updateBoxArtists({updatedArtists: response.artists!}))
            break;
            case 'albums':
                response = await addAlbumToSubsectionApi(boxId, itemData._id!, subsectionId, itemFields as Album) as UserBox
                dispatch(updateBoxAlbums({updatedAlbums: response.albums!}))
            break;
            case 'tracks':
                response = await addTrackToSubsectionApi(boxId, itemData._id!, subsectionId, itemFields as Track) as UserBox
                dispatch(updateBoxTracks({updatedTracks: response.tracks!}))
            break;
            case 'playlists':
                response = await addPlaylistToSubsectionApi(boxId, itemData._id!, subsectionId, itemFields as Playlist) as UserBox
                dispatch(updateBoxPlaylists({updatedPlaylists: response.playlists!}))
            break;
            default:
            break;
        }
        if(response){
            dispatch(updateBoxSubsections(response.subSections))
        }
    } catch (err) {
        console.log(err)
    }
}

export const removeItemFromSubsectionThunk = (boxId: string, type: BoxSections, subsectionId: string, itemId: string, spotifyId: string): AppThunk => async (dispatch) => {
    try {
        let response: UserBox | null = null;
        switch(type){
            case 'artists':
                response = await removeArtistFromSubsectionApi(boxId, itemId, spotifyId, subsectionId) as UserBox
                dispatch(updateBoxArtists({updatedArtists: response.artists!}))
            break;
            case 'albums':
                response = await removeAlbumFromSubsectionApi(boxId, itemId, spotifyId, subsectionId) as UserBox
                dispatch(updateBoxAlbums({updatedAlbums: response.albums!}))
            break;
            case 'tracks':
                response = await removeTrackFromSubsectionApi(boxId, itemId, spotifyId, subsectionId) as UserBox
                dispatch(updateBoxTracks({updatedTracks: response.tracks!}))
            break;
            case 'playlists':
                response = await removePlaylistFromSubsectionApi(boxId, itemId, spotifyId, subsectionId) as UserBox
                dispatch(updateBoxPlaylists({updatedPlaylists: response.playlists!}))
            break;
            default:
            break;
        }
        if(response){
            dispatch(updateBoxSubsections(response.subSections))
        }
    } catch (err) {
        console.log(err)
    }
}

export const reorderBoxItemsThunk = (boxId: string, draggedId: string, targetId: string, itemType: string ): AppThunk => async (dispatch, getState) => {
    const reorderItems = <T extends {_id?: string}[]>(items: T) => {
        const draggedItem = items.find(item => item._id === draggedId)
        const draggedIndex = items.findIndex(item => item._id === draggedId);
        const targetIndex = items.findIndex(item => item._id === targetId);
        items.splice(draggedIndex, 1);
        items.splice(targetIndex, 0, draggedItem!)
        return items;
    }
    try {
        switch(itemType){
            case 'artist':
                const artistsCopy = JSON.parse(JSON.stringify(getState().currentBoxDetailData.box.artists));
                const updatedArtists = reorderItems<Artist[]>(artistsCopy)
                dispatch(updateBoxArtists({updatedArtists}))
                await updateBoxArtistsApi(boxId, updatedArtists)
            break;
            case 'album':
                const albumsCopy = JSON.parse(JSON.stringify(getState().currentBoxDetailData.box.albums));
                const updatedAlbums = reorderItems<Album[]>(albumsCopy)
                dispatch(updateBoxAlbums({updatedAlbums}))
                await updateBoxAlbumsApi(boxId, updatedAlbums)
            break;
            case 'track':
                const tracksCopy = JSON.parse(JSON.stringify(getState().currentBoxDetailData.box.tracks));
                const updatedTracks = reorderItems<Track[]>(tracksCopy)
                dispatch(updateBoxTracks({updatedTracks}))
                await updateBoxTracksApi(boxId, updatedTracks)
            break;
            case 'playlist':
                const playlistsCopy = JSON.parse(JSON.stringify(getState().currentBoxDetailData.box.playlists));
                const updatedPlaylists = reorderItems<Playlist[]>(playlistsCopy)
                dispatch(updateBoxPlaylists({updatedPlaylists}))
                await updateBoxPlaylistsApi(boxId, updatedPlaylists)
            break;
            default:
            break;
        }
    } catch (err) {
        console.log(err)
    }
}

export const reorderSubsectionItemsThunk = (boxId: string, draggedId: string, targetId: string, subId: string): AppThunk => async (dispatch, getState) => {
    try {
        const subsections = getState().currentBoxDetailData.box.subSections;
        const targetSub = subsections.find(sub => sub._id === subId);
        const otherSubs = subsections.filter(sub => sub._id !== subId);
        const itemsCopy: {_id: string}[] = JSON.parse(JSON.stringify(targetSub?.items));
        const draggedItem = itemsCopy.find(item => item._id === draggedId)
        const draggedIndex = itemsCopy.findIndex(item => item._id === draggedId);
        const targetIndex = itemsCopy.findIndex(item => item._id === targetId);
        itemsCopy.splice(draggedIndex, 1);
        itemsCopy.splice(targetIndex, 0, draggedItem!)
        const updatedSub = {...targetSub, items: itemsCopy};
        const subsectionsPayload = [...otherSubs, updatedSub] as Subsection[]
        dispatch(updateBoxSubsections(subsectionsPayload))
        await updateSubsectionsApi(boxId, subsectionsPayload)
    } catch (err) {
        console.log(err)
    }
}

export default currentBoxDetailSlice.reducer;