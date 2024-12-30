import { DashboardBox, UserFolder } from 'core/types/interfaces'
import api from '../index'

export const getFolderByIdApi = async (folderId: string) => {
    try {
        return await api.get<{folderData: UserFolder, creatorName: string}>(`folders/${folderId}`, {})
    }
    catch(err) {
        console.log(err)
        throw err; 
    }
}

export const getFoldersByIdsApi = async (folderIds: string[]) => {
    try {
        return await api.getManyById<UserFolder[]>('folders/multiple', folderIds)
    }
    catch(err) {
        console.log(err)
        throw err; 
    }
}

export const createUserFolderApi = async (data: Omit<UserFolder, 'folderId' | 'boxes'>) => {
    try {
        return await api.post<Omit<UserFolder, 'folderId' | 'boxes'>, {newFolder: UserFolder, updatedDashboardFolders: string[]}>('folders', data)
    }
    catch(err) {
        console.log(err)
        throw err; 
    }
}

export const updateUserFolderDetailsApi = async (folderId: string, name: string, description: string, isPublic: boolean) => {
    try {
        return await api.put<{name: string, description: string, isPublic: boolean}, {updatedFolder: UserFolder}>(`folders/${folderId}/folder-details`, {name, description, isPublic})
    }
    catch(err) {
        console.log(err)
        throw err; 
    }
}

export const deleteUserFolderApi = async (folderId: string) => {
    try {
        return await api.delete<{updatedDashboardFolders: string[], updatedDashboardBoxes: string[]}>(`folders/${folderId}`)
    }
    catch(err) {
        console.log(err)
        throw err; 
    }
}

export const updateFolderBoxesApi = async (folderId: string, updatedItems: DashboardBox[]) => {
    try {
        return await api.put<{updatedItems: DashboardBox[]}, {updatedFolder: UserFolder}>(`folders/${folderId}/boxes`, {
            updatedItems
        })
    }
    catch(err) {
        console.log(err)
        throw err; 
    }
}

export const addBoxToFolderApi = async (folderId: string, boxId: string, folderPosition: number) => {
    try {
        return await api.post<{boxId: string, folderPosition: number}, {updatedFolder: UserFolder, updatedDashboardBoxes: string[]}>(`folders/${folderId}/boxes`, {boxId, folderPosition})
    }
    catch(err) {
        console.log(err)
        throw err; 
    }
}

export const removeBoxFromFolderApi = async (folderId: string, boxId: string) => {
    try {
        return await api.delete<{updatedFolder: UserFolder, updatedDashboardBoxes: string[]}>(`folders/${folderId}/boxes/${boxId}`)
    }
    catch(err) {
        console.log(err)
        throw err; 
    }
}

export const moveBoxBetweenFoldersApi = async (sourceId: string, targetId: string, boxId: string, boxName: string) => {
    try {
        return await api.put<{targetId: string, boxName: string}, {updatedSourceFolder: UserFolder, updatedTargetFolder: UserFolder}>(`folders/${sourceId}/boxes/${boxId}/move`, {boxName, targetId})
    }
    catch(err) {
        console.log(err)
        throw err; 
    }
}