import type { FieldPath } from 'react-hook-form'

import type { AccountSignupFormValues } from '@lib/validations/account-signup'

export const ownerStepFields: Array<FieldPath<AccountSignupFormValues>> = [
  'name',
  'lastName',
  'CPF',
]

export const contactStepFields: Array<FieldPath<AccountSignupFormValues>> = [
  'email',
  'phone.ddd',
  'phone.number',
]

export const addressStepFields: Array<FieldPath<AccountSignupFormValues>> = [
  'address.cep',
  'address.street',
  'address.number',
  'address.neighborhood',
  'address.city',
  'address.state',
]

export const securityStepFields: Array<FieldPath<AccountSignupFormValues>> = [
  'password',
  'confirmPassword',
]

export const signupStepFields = [
  ownerStepFields,
  contactStepFields,
  addressStepFields,
  securityStepFields,
]

export const accountSignupFieldNames = signupStepFields.flat()
