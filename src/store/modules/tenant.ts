import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { getTenantByName } from '@/api/tenant'
import { getTenant as CurrentTenant, setTenant, removeTenant } from '@/utils/cookies'
import store from '@/store'

export interface IMultiTenant {
  tenantId: string | undefined
}

@Module({ dynamic: true, store, name: 'permission' })
class Tenant extends VuexModule implements IMultiTenant {
  public tenantId = CurrentTenant() || ''

  @Mutation
  private SET_TENANT(tenantId: string) {
    this.tenantId = tenantId
  }

  @Action({ rawError: true })
  public async getTenant(name: string) {
    const { data } = await getTenantByName(name)
    if (data.success) {
      this.SET_TENANT(data.tenantId)
      setTenant(data.tenantId)
    } else {
      const error = '给定的租户不可用: ' + name + ' !'
      throw Error(error)
      // return Promise.reject(new Error(error))
    }
    // return new Promise((resolve, reject) => {
    //   getTenant(name).then(res => {
    //     if (res.data.success) {
    //       this.SET_TENANT(res.data.tenantId)
    //       return resolve(res.data.tenantId)
    //     } else {
    //       const error = '给定的租户不可用: ' + name + ' !'
    //       return reject(new Error(error))
    //       // throw Error(error)
    //     }
    //   })
    // })
  }

  @Action
  public removeTenant() {
    this.SET_TENANT('')
    removeTenant()
  }
}

export const TenantModule = getModule(Tenant)
