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