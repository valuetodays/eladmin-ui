import request from '@/utils/request'

export function getDepts(params) {
  return request({
    url: 'api/dept/query',
    method: 'get',
    params,
  })
}

export function getDeptSuperior(ids, exclude) {
  exclude = exclude !== undefined ? exclude : false
  const data = Array.isArray(ids) ? ids : [ids]
  return request({
    url: 'api/dept/superior?exclude=' + exclude,
    method: 'post',
    data,
  })
}

export function add(data) {
  return request({
    url: 'api/dept/add',
    method: 'post',
    data,
  })
}

export function del(ids) {
  return request({
    url: 'api/dept/delete',
    method: 'delete',
    data: ids,
  })
}

export function edit(data) {
  return request({
    url: 'api/dept/edit',
    method: 'put',
    data,
  })
}

export default { add, edit, del, getDepts, getDeptSuperior }
