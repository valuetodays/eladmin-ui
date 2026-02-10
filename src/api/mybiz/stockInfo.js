import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/stockInfo/add',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/stockInfo/delete',
    method: 'post',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/stockInfo/edit',
    method: 'post',
    data
  })
}

export function saveAllDailyStat(id) {
  return request({
    url: 'api/stockInfo/saveAllDailyStat',
    method: 'post',
    data: { id: id }
  })
}

export function saveLatest30Days() {
  return request({
    url: 'api/stockInfo/saveLatest30Days',
    method: 'post',
    data: {}
  })
}

export function computeAllCciById(id) {
  return request({
    url: 'api/stockDailyQuote/computeAllCciById',
    method: 'post',
    data: { id: id }
  })
}

export function computeLatest30DaysCci() {
  return request({
    url: 'api/stockDailyQuote/computeLatest30DaysCci',
    method: 'post',
    data: {}
  })
}

export default { add, edit, del, saveAllDailyStat, saveLatest30Days, computeAllCciById, computeLatest30DaysCci }
