'use client'

import { Check } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

import type { AccountSignupFormValues } from '@lib/validations/account-signup'

import { PasswordRule, PasswordRules } from '../style'

export function PasswordChecklist() {
  const { watch } = useFormContext<AccountSignupFormValues>()
  const password = watch('password')
  const rules = [
    {
      label: '8 caracteres',
      passed: password.length >= 8,
    },
    {
      label: 'Letra minúscula',
      passed: /[a-z]/.test(password),
    },
    {
      label: 'Letra maiúscula',
      passed: /[A-Z]/.test(password),
    },
    {
      label: 'Número',
      passed: /[0-9]/.test(password),
    },
  ]

  return (
    <PasswordRules>
      {rules.map((rule) => (
        <PasswordRule key={rule.label} passed={rule.passed}>
          <Check size={14} />
          {rule.label}
        </PasswordRule>
      ))}
    </PasswordRules>
  )
}
