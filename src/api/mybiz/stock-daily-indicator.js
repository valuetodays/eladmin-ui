import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/stockDailyIndicator/add',
    method: 'post',
    data,
  })
}

export function del(ids) {
  return request({
    url: 'api/stockDailyIndicator/delete',
    method: 'post',
    data: ids,
  })
}

export function getAllCciLt_100ByStatDate(data) {
  return request({
    url: 'api/stockDailyIndicator/getAllCciLt_100ByStatDate',
    method: 'post',
    data,
  })
}

export default { add, getAllCciLt_100ByStatDate, del }
