import type { AxiosResponse } from 'axios'

export interface AuthApiResponse extends Partial<AxiosResponse> {
  message?: string
  errors?: {
    email?: {
      type?: string
      value?: string
      msg?: string
      path?: string
      location?: string
    }
  }
}
