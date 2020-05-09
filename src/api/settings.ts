import { ListResultDto } from './types'
import { ApiServiceBase } from './serviceBase'

export class SettingApiService extends ApiServiceBase {

  constructor() {
    super()
    this.BaseUrl = process.env.VUE_APP_BASE_IDENTITY_SERVICE
  }

  /** 
   * 获取配置
   * @param providerName 配置提供者名称
   * @param providerKey 配置提供者标识
   * @returns 返回类型为 ListResultDto<SettingDto> 的配置列表
   */
  public getSettings(providerName: string, providerKey: string) {
    let _url = '/api/abp/setting'
    _url += '?providerName=' + providerName
    _url += '?providerKey=' + providerKey
    return this.Get<ListResultDto<SettingDto>>(_url)
  }

  /**
   * 保存配置
   * @param providerName  配置提供者名称
   * @param providerKey   配置提供者标识
   * @param payload       配置变更信息
   * @returns Promise对象
   */
  public setSettings(providerName: string, providerKey: string, payload: SettingsUpdateDto) {
    let _url = '/api/abp/setting'
    _url += '?providerName=' + providerName
    _url += '?providerKey=' + providerKey
    return this.OriginPut(_url, payload)
  }
}

export class SettingBase {
    /** 名称 */
    name!: string
      /** 当前设置值 */
  value!: string
}

/** 设置对象 */
export class SettingDto extends SettingBase{
  /** 显示名称 */
  displayName!: string
  /** 说明 */
  description!: string
  /** 默认设置 */
  defaultValue!: string
}

/** 配置变更对象 */
export class SettingUpdateDto extends SettingBase {}

/** 配置变更集合对象 */
export class SettingsUpdateDto {
  /** 配置集合 */
  settings: SettingUpdateDto[]
  
  constructor() {
    this.settings = new Array<SettingUpdateDto>()
  }
} 