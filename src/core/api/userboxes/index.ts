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

export const getDashboardBoxesApi = async (boxIds: string[]) => {
  try {
    return await api.getManyById<DashboardBox[]>('boxes/multiple', boxIds)
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
    return await api.put<SectionSettings, SectionSettings>(`boxes/${boxId}/section-settings/${type}`, updatedSettings)
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
  try {
    const artistsResult = await api.put<SectionSettings, SectionSettings>(`boxes/${boxId}/section-settings/artists`, artistSettings);
    const albumsResult = await api.put<SectionSettings, SectionSettings>(`boxes/${boxId}/section-settings/albums`, albumSettings);
    const tracksResult = await api.put<SectionSettings, SectionSettings>(`boxes/${boxId}/section-settings/tracks`, trackSettings);
    const playlistsResult = await api.put<SectionSettings, SectionSettings>(`boxes/${boxId}/section-settings/playlists`, playlistSettings);
    return [artistsResult, albumsResult, tracksResult, playlistsResult];
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
    return await api.put<{name: string, description: string, isPublic: boolean}, UserBox>(`boxes/${boxId}/boxInfo`, {name, description, isPublic})
  }
  catch (err) {
    console.log(err)
    throw err; 
  }
}

export const addNoteToBoxApi = async (boxId: string, noteObj: { itemId: string, subSectionId?: string, noteText: string }) => {
  try {
    return await api.post<{ itemId: string, subSectionId?: string, noteText: string }, UserBox['notes']>(`boxes/${boxId}/notes`, noteObj)
  }
  catch (err) {
    console.log(err)
    throw err; 
  }
}

export const updateItemNoteApi = async (boxId: string, noteId: string, noteObj: { noteText: string }) => {
  try {
    return await api.put<{ noteText: string }, UserBox['notes']>(`boxes/${boxId}/notes/${noteId}`, noteObj)
  }
  catch (err) {
    console.log(err)
    throw err; 
  }
}

export const addSubsectionToBoxApi = async (boxId: string, subsectionObj: { type: string, name: string, index: number }) => {
  try {
    return await api.post<{ type: string, name: string, index: number }, Subsection[]>(`boxes/${boxId}/subsections`, subsectionObj)
  }
  catch (err) {
    console.log(err)
    throw err; 
  }
}

export const updateSubsectionsApi = async (boxId: string, updatedSubsections: Subsection[]) => {
  try {
    return await api.put<Subsection[], Subsection[]>(`boxes/${boxId}/subsections`, updatedSubsections)
  }
  catch (err) {
    console.log(err)
    throw err; 
  }
}

export const updateSubsectionNameApi = async (boxId: string, subsectionId: string, name: string) => {
  try {
    return await api.put<{ name: string }, UserBox['subsections']>(`boxes/${boxId}/subsections/${subsectionId}`, { name })
  }
  catch (err) {
    console.log(err)
    throw err; 
  }
}

export const removeSubsectionApi = async (boxId: string, subsectionId: string, type: string) => {
  try {
    return await api.delete<UserBox>(`boxes/${boxId}/subsections/${subsectionId}?section=${type}`)
  }
  catch (err) {
    console.log(err)
    throw err; 
  }
}

export const reorderSubsectionItemsApi = async (boxId: string, subSectionId: string, sourceIndex: number, destinationIndex: number) => {
  try {
    return await api.put<{ sourceIndex: number, destinationIndex: number }, { updatedSubsections: Subsection[] }>(
      `boxes/${boxId}/subsections/${subSectionId}/reorder`,
      { sourceIndex, destinationIndex }
    );
  } catch (err) {
    console.log(err);
    throw err; 
  }
}