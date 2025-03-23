import { BoxCreateDTO, DashboardBox, SectionSettings, Subsection, UserBox, UserFolder, YellowboxUser } from '../../types/interfaces'
import api from '../index'

export const getBoxByIdApi = async (boxId: string) => {
  try {
    return await api.get<{ boxData: UserBox, creatorName: string }>(`boxes/${boxId}`, {})
  }
  catch (err) {
    console.log(err)
    throw err; 
  }
}

export const getDashboardBoxesApi = async (userId: string) => {
  try {
    return await api.get<DashboardBox[]>(`users/${userId}/boxes/unparented`, {})
  }
  catch (err) {
    console.log(err)
    throw err; 
  }
}

export const createUserBoxApi = async (data: BoxCreateDTO) => {
  try {
    return await api.post<BoxCreateDTO, DashboardBox>('boxes', data)
  }
  catch (err) {
    console.log(err)
    throw err; 
  }
}

export const deleteUserBoxApi = async (boxId: string, containingFolder: boolean, folderId?: string) => {
  try {
    return await api.put<{ boxId: string, containingFolder: boolean, folderId: string | undefined }, YellowboxUser | UserFolder>(`boxes/${boxId}/delete`,
      { boxId, containingFolder, folderId }
    )
  }
  catch (err) {
    console.log(err)
    throw err; 
  }
}

export const updateUserBoxApi = async (boxId: string, updatedBox: UserBox) => {
  try {
    return await api.put<UserBox, UserBox>(`boxes/${boxId}`, updatedBox)
  }
  catch (err) {
    console.log(err)
    throw err; 
  }
}

export const updateBoxSectionSettingsApi = async (boxId: string, updatedSettings: SectionSettings) => {
  const { type } = updatedSettings;
  try {
    return await api.put<SectionSettings, { updatedBox: UserBox }>(`boxes/${boxId}/section-settings/${type}`, updatedSettings)
  }
  catch (err) {
    console.log(err)
    throw err; 
  }
}

export const updateAllSectionSettingsApi = async (boxId: string, updatedSettings: SectionSettings[]) => {
  const artistSettings = updatedSettings.find(section => section.type === 'artists')!;
  const albumSettings = updatedSettings.find(section => section.type === 'albums')!;
  const trackSettings = updatedSettings.find(section => section.type === 'tracks')!;
  const playlistSettings = updatedSettings.find(section => section.type === 'playlists')!;
  const updatedSettingsObj = { artistSettings, albumSettings, trackSettings, playlistSettings };
  try {
    return await api.put<{[key: string]: SectionSettings}, { updatedBox: UserBox }>(`boxes/${boxId}/section-settings`, updatedSettingsObj);
  }
  catch (err) {
    console.log(err)
    throw err; 
  }
}

export const cloneBoxApi = async (boxId: string, name: string, description: string, isPublic: boolean, creator: string) => {
  try {
    return await api.post<{name: string, description: string, isPublic: boolean, creator: string}, DashboardBox>(`boxes/${boxId}/clone`, {name, description, isPublic, creator})
  }
  catch (err) {
    console.log(err)
    throw err; 
  }
}

export const updateBoxInfoApi = async (boxId: string, name: string, description: string, isPublic: boolean) => {
  try {
    return await api.put<{name: string, description: string, isPublic: boolean}, UserBox>(`boxes/${boxId}/box-details`, {name, description, isPublic})
  }
  catch (err) {
    console.log(err)
    throw err; 
  }
}

export const addSubsectionToBoxApi = async (boxId: string, subsectionObj: { itemType: string, name: string, position: number }) => {
  try {
    return await api.post<{ itemType: string, name: string, position: number }, Subsection[]>(`boxes/${boxId}/subsections`, subsectionObj)
  }
  catch (err) {
    console.log(err)
    throw err; 
  }
}

export const reorderSubsectionsApi = async (boxId: string, subsectionId: string, destinationId: string) => {
  try {
    return await api.put<{destinationId: string}, {message: string}>(`boxes/${boxId}/subsections/${subsectionId}/reorder`, { destinationId })
  }
  catch (err) {
    console.log(err)
    throw err; 
  }
}

export const updateSubsectionNameApi = async (boxId: string, subsectionId: string, name: string) => {
  try {
    return await api.put<{ name: string }, UserBox['subsections']>(`boxes/${boxId}/subsections/${subsectionId}/name`, { name })
  }
  catch (err) {
    console.log(err)
    throw err; 
  }
}

export const removeSubsectionApi = async (boxId: string, subsectionId: string) => {
  try {
    return await api.delete<UserBox>(`boxes/${boxId}/subsections/${subsectionId}`)
  }
  catch (err) {
    console.log(err)
    throw err; 
  }
}