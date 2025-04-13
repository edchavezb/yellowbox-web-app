import { DashboardBox, FollowedBox, FollowedUser, Follower, UserFolder, UserSpotifyAccount, YellowboxUser } from '../../types/interfaces'
import api from '../index'

export interface UserCreateDTO {
    firebaseId: string
    username: string,
    firstName: string,
    lastName: string,
    imageUrl: string,
    email: string
}

export interface UserBasicInfoDTO {
    username: string,
    firstName?: string,
    lastName?: string,
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

export const updateUserBasicInfoApi = async (userId: string, userData: UserBasicInfoDTO) => {
    try {
        return await api.put<UserBasicInfoDTO, YellowboxUser>(`users/${userId}/profile-information`, userData)
    }
    catch(err) {
        console.log(err)
        throw err; 
    }
}

export const getUserPageDataApi = async (username: string) => {
    try {
        return await api.get<{pageUser: YellowboxUser | null, isFollowed?: boolean}>(`users/user-page/${username}`, {})
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

export const reorderDashboardBoxApi = async (userId: string, boxId: string, destinationId: string) => {
    try {
        return await api.put<{destinationId: string}, {message: string}>(`users/${userId}/boxes/${boxId}/reorder`, {destinationId})
    }
    catch(err) {
        console.log(err)
        throw err; 
    }
}

export const linkUserToSpotifyAccountApi = async (userId: string, spotifyData: {refreshToken: string, spotifyId: string}) => {
    try {
        return await api.post<{spotifyData: {refreshToken: string, spotifyId: string}}, UserSpotifyAccount>(`users/${userId}/link-account/spotify`, {spotifyData})
    }
    catch(err) {
        console.log(err)
        throw err; 
    }
}

export const unlinkUserSpotifyAccountApi = async (userId: string) => {
    try {
        return await api.delete<{}>(`users/${userId}/unlink-account/spotify`)
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

export const toggleUserTutorialApi = async (userId: string) => {
    try {
        return await api.put<{}, YellowboxUser>(`users/${userId}/toggle-tutorial`, {})
    }
    catch(err) {
        console.log(err)
        throw err; 
    }
}

export const followUserApi = async (targetUserId: string) => {
    try {
        return await api.post<{}, {pageUser: YellowboxUser | null, isFollowed?: boolean}>(`users/${targetUserId}/follow`, {});
    } catch (err) {
        console.log(err);
        throw err;
    }
};

export const unfollowUserApi = async (targetUserId: string) => {
    try {
        return await api.delete<{pageUser: YellowboxUser | null, isFollowed?: boolean}>(`users/${targetUserId}/unfollow`);
    } catch (err) {
        console.log(err);
        throw err;
    }
};

export const getFollowedPageDataApi = async () => {
    try {
        return await api.get<{followedUsers: FollowedUser[], followers: Follower[], followedBoxes: FollowedBox[]}>('users/me/followed-page', {})
    }
    catch(err) {
        console.log(err)
        throw err; 
    }
}