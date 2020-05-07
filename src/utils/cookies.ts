import Cookies from 'js-cookie'

// App
const sidebarStatusKey = 'sidebar_status'
export const getSidebarStatus = () => Cookies.get(sidebarStatusKey)
export const setSidebarStatus = (sidebarStatus: string) => Cookies.set(sidebarStatusKey, sidebarStatus)

const languageKey = 'language'
export const getLanguage = () => Cookies.get(languageKey)
export const setLanguage = (language: string) => Cookies.set(languageKey, language)

const sizeKey = 'size'
export const getSize = () => Cookies.get(sizeKey)
export const setSize = (size: string) => Cookies.set(sizeKey, size)

// User
const tokenKey = 'vue_typescript_admin_access_token'
const refreshTokenKey = 'vue_typescript_admin_refresh_token'
export const getToken = () => Cookies.get(tokenKey)
export const setToken = (token: string) => Cookies.set(tokenKey, token)
export const getRefreshToken = () => Cookies.get(refreshTokenKey)
export const setRefreshToken = (token: string) => Cookies.set(refreshTokenKey, token)
export const removeToken = () => {
    Cookies.remove(tokenKey)
    return Cookies.remove(refreshTokenKey)
}

// Tenant
const tenantKey = 'vue_typescript_admin_tenant'
export const getTenant = () => Cookies.get(tenantKey)
export const setTenant = (tenantId: string) => Cookies.set(tenantKey, tenantId)
export const removeTenant = () => Cookies.remove(tenantKey)