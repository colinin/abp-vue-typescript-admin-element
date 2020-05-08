import request from '@/utils/request'
import { PagedResultDto, PagedAndSortedResultRequestDto } from './types'

export function getTenantByName(name: string) {
  let _url = '/api/abp/multi-tenancy/find-tenant/'
  _url += name
  return request({
    baseURL: process.env.VUE_APP_BASE_IDENTITY_SERVICE,
    url: _url,
    method: 'GET'
  })
}

export async function getTenants(payload: TenantGetRequestDto): Promise<PagedResultDto<TenantDto>> {
  let _url = '/api/multi-tenancy/tenants'
  _url += '?filter=' + payload.filter
  _url += '&sorting=' + payload.sorting
  _url += '&skipCount=' + payload.skipCount
  _url += '&maxResultCount=' + payload.maxResultCount
  return new Promise<PagedResultDto<TenantDto>>((resolve, reject) => {
    request({
      baseURL: process.env.VUE_APP_BASE_IDENTITY_SERVICE,
      url: _url,
      method: 'GET'
    }).then(res => {
      resolve(res.data)
    }).catch(error => {
      reject(error)
    })
  })
}


/** 租户查询过滤对象 */
export class TenantGetRequestDto extends PagedAndSortedResultRequestDto {
  /** 查询过滤字段 */
  filter: string | undefined

  constructor() {
    super()
    this.skipCount = 1
    this.maxResultCount = 25
  }
}

/** 租户对象 */
export class TenantDto {
  /** 租户标识 */
  id!: string
  /** 租户名称 */
  name!: string
}