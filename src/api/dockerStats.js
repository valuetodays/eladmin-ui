import request from '@/utils/request'

export function chart(data) {
  return request({
    url: 'api/metricDockerStats/chart',
    method: 'post',
    data,
  })
}
export function add(data) {
  return request({
    url: 'api/metricDockerStats/add',
    method: 'post',
    data,
  })
}

export function del(ids) {
  return request({
    url: 'api/metricDockerStats/delete',
    method: 'post',
    data: ids,
  })
}

export function edit(data) {
  return request({
    url: 'api/metricDockerStats/edit',
    method: 'post',
    data,
  })
}

export default { chart, add, edit, del }
