import { SectionSorting, UserBox } from '../../types/interfaces'
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
    const result = await api.post<Omit<UserBox, '_id'>, UserBox>('boxes', data)
    console.log(result)
    return result
}

export const updateUserBoxApi = async (boxId: string, updatedBox: UserBox) => {
    try {
        return await api.put<UserBox, UserBox>(`boxes/${boxId}`, updatedBox)
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