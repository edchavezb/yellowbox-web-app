import { DashboardBox, UserFolder, YellowboxUser } from '../../types/interfaces'
import api from '../index'

export const getUserDataBySpotifyId = async (spotifyId: string) => {
    try {
        return await api.get<YellowboxUser>('users', {spotifyId})
    }
    catch(err) {
        console.log(err)
    }
}

export const createUser = async (userData: Omit<YellowboxUser, '_id'>) => {
    try {
        return await api.post<Omit<YellowboxUser, '_id'>, YellowboxUser>('users', userData)
    }
    catch(err) {
        console.log(err)
    }
}

export const getUserBoxesApi = async (userId: string) => {
    try {
        return await api.get<DashboardBox[]>(`users/${userId}/boxes`, {userId})
    }
    catch(err) {
        console.log(err)
    }
}

export const getUserFoldersApi = async (userId: string) => {
    try {
        return await api.get<UserFolder[]>(`users/${userId}/folders`, {userId})
    }
    catch(err) {
        console.log(err)
    }
}

export const updateUserDashboardBoxesApi = async (userId: string, updatedBoxIdList: string[]) => {
    try {
        return await api.put<{updatedBoxIdList: string[]}, string[]>(`users/${userId}/dashboardBoxes`, {updatedBoxIdList})
    }
    catch(err) {
        console.log(err)
    }
}