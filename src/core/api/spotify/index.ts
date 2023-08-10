import api from '../index'

export const spotifyLoginApi = async () => {
    try {
        return await api.get<{url: string}>('spotify/login', {})
    }
    catch(err) {
        console.log(err)
    }
}

export const getSpotifyUserTokenApi = async (code: string, state: string) => {
    try {
        return await api.get<{access_token: string, refresh_token: string}>('spotify/userToken', {code, state})
    }
    catch(err) {
        console.log(err)
    }
}

export const getSpotifyGenericTokenApi = async () => {
    try {
        return await api.get<{access_token: string}>('spotify/genericToken', {})
    }
    catch(err) {
        console.log(err)
    }
}

export const refreshSpotifyTokenApi = async (refresh_token: string) => {
    try {
        return await api.get<{access_token: string}>('spotify/refresh', {refresh_token})
    }
    catch(err) {
        console.log(err)
    }
}