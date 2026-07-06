export interface IApiKey {
  id: number
  name: string
  keySuffix: string
  isActive: boolean
  description: string | null
  createdAt: string
  lastUsedAt: string | null
}

export interface ICreateApiKeyBody {
  name: string
  description?: string
}

export interface ICreateApiKeyResponse {
  id: number
  key: string
}
