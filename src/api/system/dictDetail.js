import request from '@/utils/request'

export function get(dictName) {
  const data = {
    dictName,
    page: 0,
    size: 999,
  }
  return request({
    url: 'api/dictDetail/query',
    method: 'get',
    data,
  })
}

export function getDictMap(dictName) {
  const params = {
    dictName,
    page: 0,
    size: 9999,
  }
  return request({
    url: 'api/dictDetail/map',
    method: 'get',
    params,
  })
}

export function add(data) {
  return request({
    url: 'api/dictDetail/add',
    method: 'post',
    data,
  })
}

export function del(id) {
  return request({
    url: 'api/dictDetail/delete/' + id,
    method: 'delete',
  })
}

export function edit(data) {
  return request({
    url: 'api/dictDetail/edit',
    method: 'put',
    data,
  })
}

export default { add, edit, del }
