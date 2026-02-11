import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/indexInfo/add',
    method: 'post',
    data,
  })
}

export function del(ids) {
  return request({
    url: 'api/indexInfo/delete',
    method: 'post',
    data: { ids: ids },
  })
}

export function edit(data) {
  return request({
    url: 'api/indexInfo/edit',
    method: 'post',
    data,
  })
}

export function updateMissingFields(id) {
  return request({
    url: 'api/indexInfo/updateMissingFields',
    method: 'post',
    data: { id: id },
  })
}

export function saveAllDailyStat(id) {
  return request({
    url: 'api/indexInfo/saveAllDailyStat',
    method: 'post',
    data: { id: id },
  })
}

export function saveLatest30Days() {
  return request({
    url: 'api/indexInfo/saveLatest30Days',
    method: 'post',
    data: {},
  })
}

export function computeAllCciById(id) {
  return request({
    url: 'api/stockDailyQuote/computeAllCciById',
    method: 'post',
    data: { id: id },
  })
}

export function computeLatest30DaysCci() {
  return request({
    url: 'api/stockDailyQuote/computeLatest30DaysCci',
    method: 'post',
    data: {},
  })
}

export default {
  add,
  edit,
  del,
  updateMissingFields,
  saveAllDailyStat,
  saveLatest30Days,
  computeAllCciById,
  computeLatest30DaysCci,
}
