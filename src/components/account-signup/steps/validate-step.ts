import type { FieldPath, UseFormTrigger } from 'react-hook-form'

import type { AccountSignupFormValues } from '@lib/validations/account-signup'

export async function validateStep(
  trigger: UseFormTrigger<AccountSignupFormValues>,
  fields: Array<FieldPath<AccountSignupFormValues>>,
  onNext: () => void,
) {
  const isValid = await trigger(fields, { shouldFocus: true })

  if (isValid) {
    onNext()
  }
}
