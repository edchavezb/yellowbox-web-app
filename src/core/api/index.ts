const apiURL = process.env.REACT_APP_PROJECT_API;

export default {
  get: <R>(endpoint: string, params: { [key: string]: string }) => {
    const url = new URL(`${apiURL}/${endpoint}`);
    url.search = new URLSearchParams(params).toString()
    return fetch(url.toString())
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText)
        }
        return response.json() as Promise<R>
      })
  },
  post: async <D, R>(endpoint: string, postData: D): Promise<R> => {
    const response = await fetch(`${apiURL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData)
    })
    const responseData = await response.json()
    return responseData
  },
  put: async <D, R>(endpoint: string, params: { [key: string]: string }, putData: D): Promise<R> => {
    const url = new URL(`${apiURL}/${endpoint}`);
    url.search = new URLSearchParams(params).toString()
    const response = await fetch(url.toString(), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(putData)
    })
    const responseData = await response.json()
    return responseData
  }
}