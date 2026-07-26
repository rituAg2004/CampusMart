import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
})

API.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
  } catch (error) {
    console.log('No user in localStorage')
  }
  return config
})

export default API