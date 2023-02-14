import { Album, Artist, Playlist, SectionSorting, Subsection, Track, UserBox } from '../../types/interfaces'
import api from '../index'

export const getBoxByIdApi = async (boxId: string) => {
    try {
        return await api.get<UserBox>('boxes/', {boxId})
    }
    catch(err) {
        console.log(err)
    }
}

export const createUserBoxApi = async (data: Omit<UserBox, '_id'>) => {
    try {
        return await api.post<Omit<UserBox, '_id'>, UserBox>('boxes', data)
    }
    catch(err) {
        console.log(err)
    }
}

export const updateUserBoxApi = async (boxId: string, updatedBox: UserBox) => {
    try {
        return await api.put<UserBox, UserBox>(`boxes/${boxId}`, updatedBox)
    }
    catch(err) {
        console.log(err)
    }
}

export const addArtistToSubsectionApi = async (boxId: string, itemId: string, subsectionId: string, itemData: Artist) => {
    try {
        return await api.put<{subsectionId: string, itemData: Artist}, UserBox>(`boxes/${boxId}/artists/${itemId}/subsection`, {
            subsectionId,
            itemData
        })
    }
    catch(err) {
        console.log(err)
    }
}

export const removeArtistFromSubsectionApi = async (boxId: string, itemId: string, subsectionId: string) => {
    try {
        return await api.put<{subsectionId: string}, UserBox>(`boxes/${boxId}/artists/${itemId}/subsection/remove`, {
            subsectionId
        })
    }
    catch(err) {
        console.log(err)
    }
}

export const removeBoxArtistApi = async (boxId: string, itemId: string) => {
    try {
        return await api.delete<Artist[]>(`boxes/${boxId}/artists/${itemId}`)
    }
    catch(err) {
        console.log(err)
    }
}

export const addAlbumToSubsectionApi = async (boxId: string, itemId: string, subsectionId: string, itemData: Album) => {
    try {
        return await api.put<{subsectionId: string, itemData: Album}, UserBox>(`boxes/${boxId}/albums/${itemId}/subsection`, {
            subsectionId,
            itemData
        })
    }
    catch(err) {
        console.log(err)
    }
}

export const removeAlbumFromSubsectionApi = async (boxId: string, itemId: string, subsectionId: string) => {
    try {
        return await api.put<{subsectionId: string}, UserBox>(`boxes/${boxId}/albums/${itemId}/subsection/remove`, {
            subsectionId
        })
    }
    catch(err) {
        console.log(err)
    }
}

export const removeBoxAlbumApi = async (boxId: string, itemId: string) => {
    try {
        return await api.delete<Album[]>(`boxes/${boxId}/albums/${itemId}`)
    }
    catch(err) {
        console.log(err)
    }
}

export const addTrackToSubsectionApi = async (boxId: string, itemId: string, subsectionId: string, itemData: Track) => {
    try {
        return await api.put<{subsectionId: string, itemData: Track}, UserBox>(`boxes/${boxId}/tracks/${itemId}/subsection`, {
            subsectionId,
            itemData
        })
    }
    catch(err) {
        console.log(err)
    }
}

export const removeTrackFromSubsectionApi = async (boxId: string, itemId: string, subsectionId: string) => {
    try {
        return await api.put<{subsectionId: string}, UserBox>(`boxes/${boxId}/tracks/${itemId}/subsection/remove`, {
            subsectionId
        })
    }
    catch(err) {
        console.log(err)
    }
}

export const removeBoxTrackApi = async (boxId: string, itemId: string) => {
    try {
        return await api.delete<Track[]>(`boxes/${boxId}/tracks/${itemId}`)
    }
    catch(err) {
        console.log(err)
    }
}

export const addPlaylistToSubsectionApi = async (boxId: string, itemId: string, subsectionId: string, itemData: Playlist) => {
    try {
        return await api.put<{subsectionId: string, itemData: Playlist}, UserBox>(`boxes/${boxId}/playlists/${itemId}/subsection`, {
            subsectionId,
            itemData
        })
    }
    catch(err) {
        console.log(err)
    }
}

export const removePlaylistFromSubsectionApi = async (boxId: string, itemId: string, subsectionId: string) => {
    try {
        return await api.put<{subsectionId: string}, UserBox>(`boxes/${boxId}/playlist/${itemId}/subsection/remove`, {
            subsectionId
        })
    }
    catch(err) {
        console.log(err)
    }
}

export const removeBoxPlaylistApi = async (boxId: string, itemId: string) => {
    try {
        return await api.delete<Playlist[]>(`boxes/${boxId}/playlists/${itemId}`)
    }
    catch(err) {
        console.log(err)
    }
}

export const updateBoxSortingApi = async (boxId: string, updatedSorting: SectionSorting) => {
    try {
        return await api.put<SectionSorting, SectionSorting>(`boxes/${boxId}/sectionSorting`, updatedSorting)
    }
    catch(err) {
        console.log(err)
    }
}

export const addNoteToBoxApi = async (boxId: string, noteObj: {itemId: string, noteText: string}) => {
    try {
        return await api.post<{itemId: string, noteText: string}, UserBox['notes']>(`boxes/${boxId}/notes`, noteObj)
    }
    catch(err) {
        console.log(err)
    }
}

export const updateItemNoteApi = async (boxId: string, itemId: string, noteObj: {noteText: string}) => {
    try {
        return await api.put<{noteText: string}, UserBox['notes']>(`boxes/${boxId}/notes/${itemId}`, noteObj)
    }
    catch(err) {
        console.log(err)
    }
}

export const addSubsectionToBoxApi = async (boxId: string, subsectionObj: {type: string, name: string, index: number}) => {
    try {
        return await api.post<{type: string, name: string, index: number}, UserBox['subSections']>(`boxes/${boxId}/subsections`, subsectionObj)
    }
    catch(err) {
        console.log(err)
    }
}

export const updateSubsectionNameApi = async (boxId: string, subsectionId: string, name: string) => {
    try {
        return await api.put<{name: string}, UserBox['subSections']>(`boxes/${boxId}/subsections/${subsectionId}`, {name})
    }
    catch(err) {
        console.log(err)
    }
}

export const removeSubsectionApi = async (boxId: string, subsectionId: string, type: string) => {
    try {
        return await api.delete<UserBox>(`boxes/${boxId}/subsections/${subsectionId}?section=${type}`)
    }
    catch(err) {
        console.log(err)
    }
}