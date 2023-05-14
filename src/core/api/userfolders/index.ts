import { UserFolder } from 'core/types/interfaces'
import api from '../index'

export const getFolderByIdApi = async (folderId: string) => {
    try {
        return await api.get<UserFolder>('folders/', {folderId})
    }
    catch(err) {
        console.log(err)
    }
}

export const getFoldersByIdsApi = async (folderIds: string[]) => {
    try {
        return await api.getManyById<UserFolder[]>('folders/multiple', folderIds)
    }
    catch(err) {
        console.log(err)
    }
}

export const createUserFolderApi = async (data: Omit<UserFolder, '_id'>) => {
    try {
        return await api.post<Omit<UserFolder, '_id'>, {newFolder: UserFolder, updatedDashboardFolders: string[]}>('folders', data)
    }
    catch(err) {
        console.log(err)
    }
}

export const deleteUserFolderApi = async (folderId: string) => {
    try {
        return await api.delete<string>(`folders/${folderId}`)
    }
    catch(err) {
        console.log(err)
    }
}

export const addBoxToFolderApi = async (folderId: string, boxId: string, boxName: string) => {
    try {
        return await api.post<{boxId: string, boxName: string}, {updatedFolder: UserFolder, updatedDashboardBoxes: string[]}>(`folders/${folderId}/boxes`, {boxId, boxName})
    }
    catch(err) {
        console.log(err)
    }
}

export const removeBoxFromFolderApi = async (folderId: string, boxId: string) => {
    try {
        return await api.delete<{updatedFolder: UserFolder, updatedDashboardBoxes: string[]}>(`folders/${folderId}/boxes/${boxId}`)
    }
    catch(err) {
        console.log(err)
    }
}