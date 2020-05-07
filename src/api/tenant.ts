import request from '@/utils/request'

export function getTenant(name: string) {
  let _url = '/api/abp/multi-tenancy/find-tenant/'
  _url += name
  return request({
    baseURL: process.env.VUE_APP_BASE_IDENTITY_SERVICE,
    url: _url,
    method: 'GET'
  })
}