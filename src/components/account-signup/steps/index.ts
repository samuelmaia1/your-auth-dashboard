import { MapPin, Phone, ShieldCheck, UserRound } from 'lucide-react'

import { AddressStep } from './address-step'
import { ContactStep } from './contact-step'
import { OwnerStep } from './owner-step'
import { SecurityStep } from './security-step'

export { AddressStep } from './address-step'
export { ContactStep } from './contact-step'
export { OwnerStep } from './owner-step'
export { SecurityStep } from './security-step'
export { accountSignupFieldNames, signupStepFields } from './fields'

export const accountSignupSteps = [
  {
    title: 'Titular',
    description: 'Nome e documento da conta proprietária.',
    icon: UserRound,
  },
  {
    title: 'Contato',
    description: 'E-mail e telefone do responsável.',
    icon: Phone,
  },
  {
    title: 'Endereço',
    description: 'Endereço vinculado à conta.',
    icon: MapPin,
  },
  {
    title: 'Acesso',
    description: 'Senha de acesso da conta.',
    icon: ShieldCheck,
  },
]

export const formSteps = [OwnerStep, ContactStep, AddressStep, SecurityStep]
