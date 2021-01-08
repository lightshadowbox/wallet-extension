import { AxiosResponse } from 'axios'

export interface Token {
  Token: string
  Expired: string
}
export interface TokenResponse {
  Result: Token | null
  Error: null | any
}

class Auth {
  static parseTokenData(response: AxiosResponse<TokenResponse>) {
    const { data, status } = response
    switch (status) {
      case 200:
        return {
          token: data.Result.Token,
          expired: data.Result.Expired,
        }
    }
    return {
      token: null,
      expired: null,
    }
  }
}

export default Auth
