import request from '@/utils/request'

export function login(username, password, code, uuid) {
  return request({
    url: 'api/auth/public/login',
    method: 'post',
    data: {
      username,
      password,
      code,
      uuid
    }
  })
}

export function getInfo() {
  return request({
    url: 'api/auth/info',
    method: 'get'
  })
}

export function getCodeImg() {
  return request({
    url: 'api/auth/public/code',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: 'api/auth/logout',
    method: 'delete'
  })
}
