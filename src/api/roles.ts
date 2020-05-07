import request from '@/utils/request'

const IdentityServiceUrl = process.env.VUE_APP_BASE_IDENTITY_SERVICE

export function getRoles() {
  return request({
    baseURL: IdentityServiceUrl,
    url: '/api/identity/roles',
    method: 'GET'
  })
}

export function getRoleById(id: string) {
  let _url = '/api/identity/roles/'
  _url += id
  return request({
    baseURL: IdentityServiceUrl,
    url: _url,
    method: 'GET'
  })
}

export function createRole(input: CreateRoleDto) {
  return request({
    baseURL: IdentityServiceUrl,
    url: '/api/identity/roles',
    method: 'POST',
    data: input
  })
}

export function updateRole(id: string, input: UpdateRoleDto) {
  let _url = '/api/identity/roles/'
  _url += id
  return request({
    baseURL: IdentityServiceUrl,
    url: _url,
    method: 'PUT',
    data: input
  })
}

export function deleteRole(id: string) {
  let _url = '/api/identity/roles/'
  _url += id
  return request({
    baseURL: IdentityServiceUrl,
    url: _url,
    method: 'DELETE'
  })
}

export class RoleBaseDto {
  name!: string
  isDefault!: boolean
  isPublic!: boolean
}

export class RoleDto extends RoleBaseDto {
  id!: string
  isStatic!: boolean
  concurrencyStamp?: string
}

export class CreateRoleDto extends RoleBaseDto {

  constructor() {
    super()
    this.isDefault = false
    this.isPublic = true
  }
}

export class UpdateRoleDto extends RoleBaseDto {
  concurrencyStamp?: string

  constructor() {
    super()
    this.isDefault = false
    this.isPublic = true
  }
}

