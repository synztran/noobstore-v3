export enum EnumResponseStatus {
  OK = 'OK',
  ERROR = 'ERROR',
}

export interface IPagination {
  page: number
  total: number
  totalPage: number
  total_items?: number
  limit?: number
  total_pages?: number
}

export interface IResponse<T> {
  message: string
  status: EnumResponseStatus
  code: number
  data?: T[]
  errorCode?: string
  pagination?: IPagination
}

export interface IRequest {
  url: string
  params?: any
  method?: string
  body?: any
  mock?: boolean
  page?: boolean
  isAuth?: boolean
  ctx?: any
  isBasic?: boolean
  debug?: boolean
  cache?: boolean
  timeout?: number | null
  priority?: number | null
  retry?: number
  contentType?: string
  signal?: AbortSignal
}
