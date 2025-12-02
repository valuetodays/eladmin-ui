import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/httpsDomain/add',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/httpsDomain/delete',
    method: 'post',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/httpsDomain/edit',
    method: 'post',
    data
  })
}

export default { add, edit, del }
