import request from "@/utils/request";
import { IPermission } from './types';

export function getPermissions() {
  const _url = '/api/abp/application-configuration'
  return request({
      baseURL: process.env.VUE_APP_BASE_IDENTITY_SERVICE,
      url: _url
  })
}

export function getPermissionsByKey(providerName: string, providerKey: string) {
  let _url = '/api/abp/permissions?'
  _url += 'providerName=' + providerName
  _url += '&providerKey=' + providerKey
  return request({
    baseURL: process.env.VUE_APP_BASE_IDENTITY_SERVICE,
    url: _url,
    method: 'GET'
  })
}

export function setPermissionsByKey(providerName: string, providerKey: string, input: UpdatePermissionsDto) {
  let _url = '/api/abp/permissions?'
  _url += 'providerName=' + providerName
  _url += '&providerKey=' + providerKey
  return request({
    baseURL: process.env.VUE_APP_BASE_IDENTITY_SERVICE,
    url: _url,
    method: 'PUT',
    data: input
  })
}

export class UpdatePermissionsDto {
  permissions!: UpdatePermissionDto[]

  constructor() {
      this.permissions = new Array<UpdatePermissionDto>()
  }
}

export class UpdatePermissionDto implements IPermission {
    name!: string
    isGranted!: boolean
}

export class PermissionProvider {
  providerName!: string
  providerKey!: string
}

export class Permission {
  allowedProviders!: string[]
  grantedProviders!: PermissionProvider[]
  displayName!: string
  isGranted!: boolean
  name!: string
  parentName?: string

  constructor() {
    this.allowedProviders = new Array<string>()
    this.grantedProviders = new Array<PermissionProvider>()
  }
}

export class PermissionGroup {
  displayName!: string
  name!: string
  permissions!: Permission[]

  constructor() {
    this.permissions = new Array<Permission>()
  }
}

export class PermissionDto {
  entityDisplayName!: string
  groups!: PermissionGroup[]

  constructor() {
    this.groups = new Array<PermissionGroup>()
  }
}