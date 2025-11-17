import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/indexInfo/add',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/indexInfo/delete',
    method: 'post',
    data: {ids: ids}
  })
}

export function edit(data) {
  return request({
    url: 'api/indexInfo/edit',
    method: 'post',
    data
  })
}
export function saveAllDailyStat(id) {
  return request({
    url: 'api/indexInfo/saveAllDailyStat',
    method: 'post',
    data: {id: id}
  })
}
export function saveLatest30Days() {
  return request({
    url: 'api/indexInfo/saveLatest30Days',
    method: 'post',
    data: { }
  })
}

export default { add, edit, del, saveAllDailyStat, saveLatest30Days}
