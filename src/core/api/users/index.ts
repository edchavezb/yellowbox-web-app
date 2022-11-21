import { YellowboxUser } from '../../types/interfaces'
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