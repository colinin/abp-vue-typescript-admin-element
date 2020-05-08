import request from "@/utils/request";
import { IPermission } from './types';

/** 获取所有权限
 * @description 或者可以说是获取应用配置,这里没对返回参数做处理,应该为response.data.auth节点下的内容
 */
export function getPermissions() {
  const _url = '/api/abp/application-configuration'
  return request({
      baseURL: process.env.VUE_APP_BASE_IDENTITY_SERVICE,
      url: _url
  })
}

/** 获取指定权限提供者的权限数据
 * @param providerName 权限提供者 如User(用户)、Role(角色)
 * @param providerKey 权限提供者标识 User:userId Role:roleId
 * @description 老版本的abp vNext用的User、Role、Client等提供者名称
 * 新版本的简写为U、R、C等
 */
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

/** 授权指定权限提供者的权限数据
 * @param providerName 权限提供者 如User(用户)、Role(角色)
 * @param providerKey 权限提供者标识 User:userId Role:roleId
 * @param payload 授权数据
 */
export function setPermissionsByKey(providerName: string, providerKey: string, payload: UpdatePermissionsDto) {
  let _url = '/api/abp/permissions?'
  _url += 'providerName=' + providerName
  _url += '&providerKey=' + providerKey
  return request({
    baseURL: process.env.VUE_APP_BASE_IDENTITY_SERVICE,
    url: _url,
    method: 'PUT',
    data: payload
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