import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { userLogin, userLogout, getUserInfo, UserLoginData } from '@/api/users'
import { getToken, setToken, removeToken, getRefreshToken, setRefreshToken } from '@/utils/cookies'
import { resetRouter } from '@/router'
import { TagsViewModule } from './tags-view'
import { TenantModule } from '@/store/modules/tenant'
import { PermissionModule } from '@/store/modules/permission'
import store from '@/store'

export interface IUserState {
  token: string
  name: string
  avatar: string
  introduction: string
  roles: string[]
  email: string
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public token = getToken() || ''
  public refreshToken = getRefreshToken() || ''
  public name = ''
  public avatar = ''
  public introduction = ''
  public roles: string[] = []
  public email = ''

  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token
  }

  @Mutation
  private SET_NAME(name: string) {
    this.name = name
  }

  @Mutation
  private SET_REFRESH_TOKEN(token: string) {
    this.refreshToken = token
  }

  @Mutation
  private SET_ROLES(roles: string[]) {
    this.roles = roles
  }

  @Mutation
  private SET_EMAIL(email: string) {
    this.email = email
  }

  @Action({ rawError: true })
  public async Login(userInfo: { tenantName: string | undefined, username: string, password: string}) {
    const userLoginData = new UserLoginData()
    userLoginData.userName = userInfo.username
    userLoginData.password = userInfo.password
    if (userInfo.tenantName) {
      // TenantModule.getTenant(userInfo.tenantName).then(() => {
      //   console.log('login ====>')
      // }).catch(err => {
      //   console.log('error ====>' + err)
      // })
      await TenantModule.getTenant(userInfo.tenantName)
    }
    const { data } = await userLogin(userLoginData)
    const token = data.token_type + ' ' + data.access_token
    setToken(token)
    this.SET_TOKEN(token)
    setRefreshToken(data.refresh_token)
    this.SET_REFRESH_TOKEN(data.refresh_token)
  }

  @Action
  public ResetToken() {
    removeToken()
    this.SET_TOKEN('')
    this.SET_ROLES([])
    TenantModule.removeTenant()
  }

  @Action
  public async GetUserInfo() {
    if (this.token === '') {
      throw Error('GetUserInfo: token is undefined!')
    }
    const { data } = await getUserInfo()
    this.SET_NAME(data.name)
    this.SET_EMAIL(data.email)
  }

  // @Action
  // public async ChangeRoles(role: string) {
  //   // Dynamically modify permissions
  //   const token = role + '-token'
  //   this.SET_TOKEN(token)
  //   setToken(token)
  //   await this.GetUserInfo()
  //   resetRouter()
  //   // Generate dynamic accessible routes based on roles
  //   // PermissionModule.GenerateRoutes(this.roles)
  //   // Add generated routes
  //   router.addRoutes(PermissionModule.dynamicRoutes)
  //   // Reset visited views and cached views
  //   TagsViewModule.delAllViews()
  // }

  @Action
  public async LogOut() {
    if (this.token === '') {
      throw Error('LogOut: token is undefined!')
    }
    await userLogout(getRefreshToken())
    removeToken()
    resetRouter()
    // Reset visited views and cached views
    TagsViewModule.delAllViews()
    PermissionModule.ResetPermissions()
    this.SET_TOKEN('')
    this.SET_ROLES([])
  }
}

export const UserModule = getModule(User)
