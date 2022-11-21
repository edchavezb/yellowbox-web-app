import { UserBox } from '../../types/interfaces'
import api from '../index'

export const getUserBoxes = async (userId: string) => {
    try {
        return await api.get<UserBox[]>('boxes', {userId})
    }
    catch(err) {
        console.log(err)
    }
}

export const createUserBox = async (data: Omit<UserBox, '_id'>) => {
    const result = await api.post<Omit<UserBox, '_id'>, UserBox>('boxes', data)
    console.log(result)
    return result
}