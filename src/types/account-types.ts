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

export interface AccountResponse {
  id?: string
  name?: string
  lastName?: string
  email?: string
  createdAt?: string
  updatedAt?: string
  address?: AddressDTO
  phone?: PhoneDTO
  CPF?: string
}
