import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/nationCode/add',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/nationCode/delete',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/nationCode/edit',
    method: 'put',
    data
  })
}

export default { add, edit, del }
