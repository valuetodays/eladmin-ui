import Cookies from 'js-cookie'
import Config from '@/settings'

const TokenKey = Config.TokenKey

export function getToken() {
  //return Cookies.get(TokenKey)
  return localStorage.getItem('portal_token')
}

export function setToken(token) {
  // if (rememberMe) {
  // return Cookies.set(TokenKey, token, { expires: Config.tokenCookieExpires })
  // } else return Cookies.set(TokenKey, token)

  localStorage.removeItem('portal_token')
  localStorage.setItem('portal_token', token)
}

export function removeToken() {
  // return Cookies.remove(TokenKey)
  localStorage.removeItem('portal_token')
}
