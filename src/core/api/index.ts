import { firebaseAuth } from "core/services/firebase";

const apiURL = process.env.REACT_APP_PROJECT_API;

const api = {
  get: async <R>(endpoint: string, params: { [key: string]: string }) => {
    const currentUser = firebaseAuth?.currentUser;
    const authToken = await currentUser?.getIdToken();
    const url = new URL(`${apiURL}/${endpoint}`);
    url.search = new URLSearchParams(params).toString()
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      }
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return await (response.json() as Promise<R>);
  },
  getManyById: async <R>(endpoint: string, ids: string[]) => {
    const currentUser = firebaseAuth?.currentUser;
    const authToken = await currentUser?.getIdToken();
    const url = new URL(`${apiURL}/${endpoint}`);
    url.search = new URLSearchParams(ids.map(s => ['id', s])).toString()
    return fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText)
        }
        return response.json() as Promise<R>
      })
  },
  post: async <D, R>(endpoint: string, postData: D): Promise<R> => {
    const currentUser = firebaseAuth?.currentUser;
    const authToken = await currentUser?.getIdToken();
    const response = await fetch(`${apiURL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(postData)
    })
    const responseData = await response.json()
    if (!response.ok) {
      throw new Error(responseData.error || response.statusText);
    }
    return responseData;
  },
  put: async <D, R>(endpoint: string, putData: D): Promise<R> => {
    const currentUser = firebaseAuth?.currentUser;
    const authToken = await currentUser?.getIdToken();
    const url = new URL(`${apiURL}/${endpoint}`);
    const response = await fetch(url.toString(), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(putData)
    })
    const responseData = await response.json()
    if (!response.ok) {
      throw new Error(responseData.error || response.statusText);
    }
    return responseData;
  },
  delete: async <R>(endpoint: string): Promise<R> => {
    const currentUser = firebaseAuth?.currentUser;
    const authToken = await currentUser?.getIdToken();
    const url = new URL(`${apiURL}/${endpoint}`);
    const response = await fetch(url.toString(), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'text/plain',
        'Authorization': `Bearer ${authToken}`
      }
    })
    const responseData = await response.json()
    if (!response.ok) {
      throw new Error(responseData.error || response.statusText);
    }
    return responseData;
  }
}

export default api;