import { onlyDigits } from './normalizer'

type PhoneValue = {
  ddd: string
  number: string
}

export function cpfMask(value: string) {
  return onlyDigits(value)
    .slice(0, 11)
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2')
}

export function cepMask(value: string) {
  const digits = onlyDigits(value).slice(0, 8)

  if (digits.length <= 5) {
    return digits
  }

  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

export function dddMask(value: string) {
  return onlyDigits(value).slice(0, 2)
}

export function phoneNumberMask(value: string) {
  const digits = onlyDigits(value).slice(0, 9)

  if (digits.length <= 4) {
    return digits
  }

  if (digits.length <= 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`
  }

  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

export function phoneMask(phone: PhoneValue) {
  return `(${phone.ddd}) ${phoneNumberMask(phone.number)}`
}
