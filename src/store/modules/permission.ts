import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { RouteConfig } from 'vue-router'
import { asyncRoutes, constantRoutes } from '@/router'
import { getPermissions } from '@/api/permission'
import store from '@/store'

const hasPermission = (roles: string[], route: RouteConfig) => {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

export const filterAsyncRoutes = (routes: RouteConfig[], roles: string[]) => {
  const res: RouteConfig[] = []
  routes.forEach(route => {
    const r = { ...route }
    if (hasPermission(roles, r)) {
      if (r.children) {
        r.children = filterAsyncRoutes(r.children, roles)
      }
      res.push(r)
    }
  })
  return res
}

export interface IPermissionState {
  routes: RouteConfig[]
  dynamicRoutes: RouteConfig[]
}

@Module({ dynamic: true, store, name: 'permission' })
class Permission extends VuexModule implements IPermissionState {
  public routes: RouteConfig[] = []
  public dynamicRoutes: RouteConfig[] = []
  public authorizedPermissions: string[] = []

  @Mutation
  private SET_ROUTES(routes: RouteConfig[]) {
    this.routes = constantRoutes.concat(routes)
    this.dynamicRoutes = routes
  }

  @Mutation
  private SET_AUTHPERMISSIONS(permissions: Array<string>) {
    this.authorizedPermissions = permissions
  }

  @Action
  public async GetPermissions() {
    const { data } = await getPermissions()
    const authPermissions = []
    for (const policy in data.auth.grantedPolicies) {
      authPermissions.push(policy)
    }
    this.SET_AUTHPERMISSIONS(authPermissions)
  }

  @Action
  public async GenerateRoutes() {
    let accessedRoutes
    await this.GetPermissions()
    if (this.authorizedPermissions.includes('admin')) {
      accessedRoutes = asyncRoutes
    } else {
      accessedRoutes = filterAsyncRoutes(asyncRoutes, this.authorizedPermissions)
    }
    this.SET_ROUTES(accessedRoutes)
  }

  @Action ResetPermissions() {
    this.SET_AUTHPERMISSIONS([])
  }
}

export const PermissionModule = getModule(Permission)
