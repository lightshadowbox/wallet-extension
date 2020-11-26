import { AxiosResponse } from 'axios'
import Auth, { TokenResponse } from 'models/auth'
import { preApi, setAccessToken } from './http'

/**
 * generate uniqueId based on navigator, screen
 * @see https://stackoverflow.com/questions/27247806/generate-unique-id-for-each-device
 */
function uidByDevice() {
  const navigator_info = window.navigator
  const screen_info = window.screen
  let uid = navigator_info.mimeTypes.length.toString()
  uid += navigator_info.userAgent.replace(/\D+/g, '')
  uid += navigator_info.plugins.length
  uid += screen_info.height || ''
  uid += screen_info.width || ''
  uid += screen_info.pixelDepth || ''
  return uid
}

/**
 * login and set token bearer for all api instance
 */
export async function login() {
  try {
    console.debug('Getting access token based on device')
    let accessToken = ''
    accessToken = uidByDevice() + new Date().getTime()
    const tokenResponse: AxiosResponse<TokenResponse> = await preApi
      .post<any>('/auth/new-token', { DeviceID: accessToken, DeviceToken: accessToken })
    const { token } = Auth.parseTokenData(tokenResponse)
    setAccessToken(token)
    return token
  } catch (e) {
    throw new Error('Unable to request an access token')
  }
}