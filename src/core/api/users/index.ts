import { DashboardBox, UserFolder, YellowboxUser } from '../../types/interfaces'
import api from '../index'

export interface UserCreateDTO {
    firebaseId: string
    username: string,
    firstName: string,
    lastName: string,
    imageUrl: string,
    email: string
}

export const getAuthenticatedUserDataApi = async () => {
    try {
        return await api.get<{appUser: YellowboxUser | undefined}>('users/me', {})
    }
    catch(err) {
        console.log(err)
        throw err; 
    }
}

export const getUserDataBySpotifyIdApi = async (spotifyId: string) => {
    try {
        return await api.get<YellowboxUser>('users', {spotifyId})
    }
    catch(err) {
        console.log(err)
        throw err; 
    }
}

export const dbUsernameCheckApi = async (username: string) => {
    try {
        return await api.get<{usernameExists: boolean}>(`users/check-username/${username}`, {})
    }
    catch(err) {
        console.log(err)
        throw err; 
    }
}

export const dbEmailCheckApi = async (email: string) => {
    try {
        return await api.get<{emailExists: boolean}>(`users/check-email/${email}`, {})
    }
    catch(err) {
        console.log(err)
        throw err; 
    }
}

export const createUserApi = async (userData: UserCreateDTO) => {
    try {
        return await api.post<UserCreateDTO, YellowboxUser>('users', userData)
    }
    catch(err) {
        console.log(err)
        throw err; 
    }
}

export const updateUserApi = async (userId: string, userData: Omit<YellowboxUser, 'userId'>) => {
    try {
        return await api.put<Omit<YellowboxUser, 'userId'>, YellowboxUser>(`users/${userId}/`, userData)
    }
    catch(err) {
        console.log(err)
        throw err; 
    }
}

export const getUserBoxesApi = async (userId: string) => {
    try {
        return await api.get<DashboardBox[]>(`users/${userId}/boxes`, {userId})
    }
    catch(err) {
        console.log(err)
        throw err; 
    }
}

export const getUserFoldersApi = async (userId: string) => {
    try {
        return await api.get<UserFolder[]>(`users/${userId}/folders`, {userId})
    }
    catch(err) {
        console.log(err)
        throw err; 
    }
}

export const updateUserDashboardBoxesApi = async (userId: string, updatedBoxIdList: string[]) => {
    try {
        return await api.put<{updatedBoxIdList: string[]}, string[]>(`users/${userId}/dashboardBoxes`, {updatedBoxIdList})
    }
    catch(err) {
        console.log(err)
        throw err; 
    }
}

export const linkUserToSpotifyAccountApi = async (userId: string, spotifyData: {refreshToken: string, id: string}) => {
    try {
        return await api.post<{spotifyData: {refreshToken: string, id: string}}, YellowboxUser>(`users/${userId}/spotify`, {spotifyData})
    }
    catch(err) {
        console.log(err)
        throw err; 
    }
}

export const unlinkUserSpotifyAccountApi = async (userId: string) => {
    try {
        return await api.post<{}, {}>(`users/${userId}/spotify/unlink`, {})
    }
    catch(err) {
        console.log(err)
        throw err; 
    }
}

export const verifyUserEmailAddressApi = async (userId: string) => {
    try {
        return await api.put<{}, YellowboxUser>(`users/${userId}/verify-email`, {})
    }
    catch(err) {
        console.log(err)
        throw err; 
    }
}