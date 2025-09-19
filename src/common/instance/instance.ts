import axios from 'axios'

const token = '85459685-528d-415c-a12f-0cc8ddead5ff'
const apiKey = 'e655fc0d-99c3-4c81-8dea-0837243fe8bf'

export const instance = axios.create({
  baseURL: 'https://social-network.samuraijs.com/api/1.1',
  headers: {
    Authorization: `Bearer ${token}`,
    'API-KEY': apiKey,
  },
})
