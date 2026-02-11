import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/stock/add',
    method: 'post',
    data,
  })
}

export function del(ids) {
  return request({
    url: 'api/stock/delete',
    method: 'post',
    data: ids,
  })
}

export function edit(data) {
  return request({
    url: 'api/stock/edit',
    method: 'post',
    data,
  })
}

export default { add, edit, del }
