import { z } from 'zod'

import type { CreateAccountRequest } from '@/types/account-types'

export const createAccountPayloadSchema = z.object({
  name: z.string().trim().min(1, 'Informe seu nome.').max(255, 'Use no máximo 255 caracteres.'),
  lastName: z
    .string()
    .trim()
    .min(1, 'Informe seu sobrenome.')
    .max(255, 'Use no máximo 255 caracteres.'),
  email: z
    .string()
    .trim()
    .min(1, 'Informe seu e-mail.')
    .email('Informe um e-mail válido.')
    .max(320, 'Use no máximo 320 caracteres.'),
  password: z
    .string()
    .min(8, 'Use pelo menos 8 caracteres.')
    .max(255, 'Use no máximo 255 caracteres.')
    .regex(/[a-z]/, 'Inclua pelo menos uma letra minúscula.')
    .regex(/[A-Z]/, 'Inclua pelo menos uma letra maiúscula.')
    .regex(/[0-9]/, 'Inclua pelo menos um número.'),
  CPF: z.string().regex(/^\d{11}$/, 'Informe um CPF com 11 dígitos.'),
  address: z.object({
    cep: z.string().regex(/^\d{8}$/, 'Informe um CEP com 8 dígitos.'),
    street: z
      .string()
      .trim()
      .min(1, 'Informe o logradouro.')
      .max(255, 'Use no máximo 255 caracteres.'),
    neighborhood: z
      .string()
      .trim()
      .min(1, 'Informe o bairro.')
      .max(120, 'Use no máximo 120 caracteres.'),
    city: z.string().trim().min(1, 'Informe a cidade.').max(120, 'Use no máximo 120 caracteres.'),
    state: z
      .string()
      .trim()
      .min(2, 'Use pelo menos 2 caracteres.')
      .max(120, 'Use no máximo 120 caracteres.'),
    number: z.string().trim().min(1, 'Informe o número.').max(30, 'Use no máximo 30 caracteres.'),
  }),
  phone: z.object({
    ddd: z.string().regex(/^\d{2}$/, 'Informe um DDD com 2 dígitos.'),
    number: z.string().regex(/^\d{8,9}$/, 'Informe um telefone com 8 ou 9 dígitos.'),
  }),
})

export const accountSignupSchema = createAccountPayloadSchema
  .extend({
    confirmPassword: z.string().min(1, 'Confirme sua senha.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas precisam ser iguais.',
    path: ['confirmPassword'],
  })

export type CreateAccountPayload = CreateAccountRequest
export type AccountSignupFormValues = z.infer<typeof accountSignupSchema>

export const accountSignupDefaultValues: AccountSignupFormValues = {
  name: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  CPF: '',
  address: {
    cep: '',
    street: '',
    neighborhood: '',
    city: '',
    state: '',
    number: '',
  },
  phone: {
    ddd: '',
    number: '',
  },
}

export function toCreateAccountPayload(data: AccountSignupFormValues): CreateAccountPayload {
  return createAccountPayloadSchema.parse(data)
}
