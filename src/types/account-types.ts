export interface AddressDTO {
  cep: string
  street: string
  neighborhood: string
  city: string
  state: string
  number: string
}

export interface PhoneDTO {
  ddd: string
  number: string
}

export interface CreateAccountRequest {
  name: string
  lastName: string
  email: string
  password: string
  CPF: string
  address: AddressDTO
  phone: PhoneDTO
}

export interface LoginAccountRequest {
  password: string
  email?: string
  cpf?: string
}

export interface AccountResponse {
  id?: string
  name?: string | null
  lastName?: string | null
  email?: string
  createdAt?: string
  updatedAt?: string
  address?: AddressDTO | null
  phone?: PhoneDTO | null
  CPF?: string | null
  avatarUrl?: string | null
  profileComplete?: boolean
}

export interface AccountBasicResponse {
  id?: string
  name?: string | null
  lastName?: string | null
  email?: string
  avatarUrl?: string | null
}

export type ProjectStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'

export type ProjectEnvironment = 'DEVELOPMENT' | 'PRODUCTION'

export type AccountProjectRole = 'OWNER' | 'ADMIN' | 'DEVELOPER' | 'VIEWER'

export interface AccountProjectSummaryResponse {
  id?: string
  name?: string
  description?: string
  ownerAccountId?: string
  status?: ProjectStatus
  environment?: ProjectEnvironment
  tokenAudience?: string
  createdAt?: string
  updatedAt?: string
  role?: AccountProjectRole
  totalUsers?: number
  totalActiveSessions?: number
}

export interface AccountSummaryResponse {
  totalProjects?: number
  totalUsers?: number
  totalActiveSessions?: number
  projects?: AccountProjectSummaryResponse[]
}
