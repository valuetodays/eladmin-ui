import request from '@/utils/request'

export function del(keys) {
  return request({
    url: 'auth/online/delete',
    method: 'delete',
    data: keys
  })
}
