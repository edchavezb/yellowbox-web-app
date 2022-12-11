import { UserBox } from '../../types/interfaces'
import api from '../index'

export const getUserBoxesApi = async (userId: string) => {
    try {
        return await api.get<UserBox[]>('boxes/userboxes', {userId})
    }
    catch(err) {
        console.log(err)
    }
}

export const getBoxByIdApi = async (boxId: string) => {
    try {
        return await api.get<UserBox>('boxes/', {boxId})
    }
    catch(err) {
        console.log(err)
    }
}

export const updateUserBoxApi = async (boxId: string, updatedBox: UserBox) => {
    try {
        return await api.put<UserBox, UserBox>('boxes/', {boxId}, updatedBox)
    }
    catch(err) {
        console.log(err)
    }
}

export const createUserBoxApi = async (data: Omit<UserBox, '_id'>) => {
    const result = await api.post<Omit<UserBox, '_id'>, UserBox>('boxes', data)
    console.log(result)
    return result
}