import { setup } from 'axios-cache-adapter'
import axios, { AxiosError, AxiosInstance } from 'axios'
import { API_BASE_URL2, API_BASE_URL, API_BASE_AUTH } from 'constants/api'
import { login } from './auth'

const HEADERS = { 'Content-Type': 'application/json' }
const TIMEOUT = 20000
let currentAccessToken = ''
let isRetry = false

export const api2 = setup({
  baseURL: API_BASE_URL2,
  headers: HEADERS,
  timeout: TIMEOUT,
  cache: {
    maxAge: 30 * 1000,
    readOnError: (error: AxiosError) => {
      return error.response.status >= 400 && error.response.status < 600
    },
    clearOnStale: true,
  },
})

export const api1 = setup({
  baseURL: API_BASE_URL,
  headers: HEADERS,
  timeout: TIMEOUT,
  cache: {
    maxAge: 30 * 1000,
    readOnError: (error: AxiosError) => {
      return error.response.status >= 400 && error.response.status < 600
    },
    clearOnStale: true,
  },
})

// Normally is called to setup token
export const preApi = setup({
  baseURL: API_BASE_AUTH,
  headers: HEADERS,
  timeout: TIMEOUT,
  cache: {
    maxAge: 30 * 1000,
    readOnError: (error: AxiosError) => {
      return error.response.status >= 400 && error.response.status < 600
    },
    clearOnStale: true,
  },
})

export const setAccessToken = (token) => {
  try {
    currentAccessToken = token
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } catch {
    throw new Error('Can not set token request')
  }
}

async function setupHttp() {
  // Set Token
  await login().then((token) => {
    isRetry = false
    setAccessToken(token)
  })
}

function registerAccessToken(instance: AxiosInstance) {
  // Add a request interceptor
  instance.interceptors.request.use(
    (config) => {
      return {
        ...config,
        headers: {
          ...config.headers,
          Authorization: 'Bearer ' + currentAccessToken,
        },
      }
    },
    (error) => {
      return Promise.reject(error)
    },
  )

  // Handle request on flight
  instance.interceptors.response.use(
    (res) => Promise.resolve(res),
    async (errorData) => {
      const errResponse = errorData?.response
      const originalRequest = errorData?.config

      // Unauthorized
      if (errResponse?.status === 401) {
        if (!isRetry) {
          isRetry = true
          if (typeof login === 'function') {
            await login().then((token) => {
              isRetry = false
              setAccessToken(token)
            })
            return instance(originalRequest)
          } else {
            console.debug('Token was expired, but can not re-new it!')
          }
        }
      }

      return Promise.reject(errorData)
    },
  )
}

// Start setup
setupHttp()
;[api1, api2].forEach((instance) => registerAccessToken(instance))
