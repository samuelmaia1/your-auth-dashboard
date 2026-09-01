import { onlyDigits } from '@/utils/normalizer'

type ViaCepResponse = {
  logradouro?: string
  bairro?: string
  localidade?: string
  uf?: string
  erro?: boolean
}

export type ViaCepAddress = {
  street: string
  neighborhood: string
  city: string
  state: string
}

export class ViaCepLookupError extends Error {
  constructor(message = 'Não foi possível buscar o CEP.') {
    super(message)
    this.name = 'ViaCepLookupError'
  }
}

export class ViaCepNotFoundError extends ViaCepLookupError {
  constructor() {
    super('CEP não encontrado.')
    this.name = 'ViaCepNotFoundError'
  }
}

export function isViaCepLookupError(error: unknown): error is ViaCepLookupError {
  return error instanceof ViaCepLookupError
}

export async function getAddressByCep(cep: string, signal?: AbortSignal): Promise<ViaCepAddress> {
  const normalizedCep = onlyDigits(cep)

  if (normalizedCep.length !== 8) {
    throw new ViaCepLookupError('Informe um CEP com 8 dígitos.')
  }

  const response = await fetch(`https://viacep.com.br/ws/${normalizedCep}/json/`, {
    headers: {
      Accept: 'application/json',
    },
    signal,
  })

  if (!response.ok) {
    throw new ViaCepLookupError()
  }

  const data = (await response.json()) as ViaCepResponse

  if (data.erro) {
    throw new ViaCepNotFoundError()
  }

  return {
    street: data.logradouro?.trim() ?? '',
    neighborhood: data.bairro?.trim() ?? '',
    city: data.localidade?.trim() ?? '',
    state: data.uf?.trim() ?? '',
  }
}
