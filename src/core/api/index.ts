export let apiURL: string;

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  apiURL = 'http://localhost:3333'
} else {
  apiURL = 'https://expressjs-mongoose-production-156f.up.railway.app'
}

export default {
  get: <R>(endpoint: string, params: { [key: string]: string }) => {
    const url = new URL(`${apiURL}/api/${endpoint}`);
    url.search = new URLSearchParams(params).toString()
    return fetch(url.toString())
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText)
        }
        return response.json() as Promise<R>
      })
  },
  post: <D, R>(endpoint: string, data: D): Promise<R> => {
    return fetch(`http://${apiURL}/api/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
      .then((response) => response.json() as Promise<R>
      )
  }

}