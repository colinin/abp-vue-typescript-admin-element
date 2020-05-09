import request from '@/utils/request'
import { AxiosRequestConfig, AxiosPromise } from 'axios'

export class ApiServiceBase {

  protected BaseUrl: string | undefined

  protected constructor() {
    this.BaseUrl = ''
  }

  protected OriginGet(url: string): AxiosPromise<any> {
    return this.HttpRequestWithOriginResponse({
      baseURL: this.BaseUrl,
      url: url,
      method: 'GET'
    })
  }

  protected Get<T>(url: string): Promise<T> {
    return this.HttpRequest<T>({
      baseURL: this.BaseUrl,
      url: url,
      method: 'GET'
    })
  }

  protected OriginPost(url: string, payload: any): AxiosPromise<any> {
    return this.HttpRequestWithOriginResponse({
      baseURL: this.BaseUrl,
      url: url,
      method: 'POST',
      data: payload
    })
  }

  protected Post<T>(url: string, payload: any): Promise<T> {
    return this.HttpRequest<T>({
      baseURL: this.BaseUrl,
      url: url,
      method: 'POST',
      data: payload
    })
  }

  protected OriginPatch(url: string, payload: any): AxiosPromise<any> {
    return this.HttpRequestWithOriginResponse({
      baseURL: this.BaseUrl,
      url: url,
      method: 'PATCH',
      data: payload
    })
  }

  protected Patch<T>(url: string, payload: any): Promise<T> {
    return this.HttpRequest<T>({
      baseURL: this.BaseUrl,
      url: url,
      method: 'PATCH',
      data: payload
    })
  }

  protected OriginPut(url: string, payload: any): AxiosPromise<any> {
    return this.HttpRequestWithOriginResponse({
      baseURL: this.BaseUrl,
      url: url,
      method: 'PUT',
      data: payload
    })
  }

  protected Put<T>(url: string, payload: any): Promise<T> {
    return this.HttpRequest<T>({
      baseURL: this.BaseUrl,
      url: url,
      method: 'PUT',
      data: payload
    })
  }

  protected Delete(url: string) {
    return request({
      baseURL: this.BaseUrl,
      url: url,
      method: 'DELETE'
    })
  }

  protected HttpRequestWithOriginResponse(options: AxiosRequestConfig): AxiosPromise<any> {
    return request(options)
  }

  protected HttpRequest<T>(options: AxiosRequestConfig): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      request(options).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}