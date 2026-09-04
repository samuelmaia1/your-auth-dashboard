'use client'

import { Check } from 'lucide-react'
import { Controller, useFormContext } from 'react-hook-form'

import { apiKeyScopeOptions } from '../project-create.shared'
import type { ProjectCreateFormValues } from '@lib/validations/project-create'
import {
  FieldContainer,
  FieldHelper,
  FieldLabel,
  ScopeCheck,
  ScopeCheckbox,
  ScopeCopy,
  ScopeDescription,
  ScopeGrid,
  ScopeOption,
  ScopeTitle,
} from '../style'

export function ScopeField() {
  const { control } = useFormContext<ProjectCreateFormValues>()

  return (
    <FieldContainer>
      <FieldLabel as="p">Escopos</FieldLabel>
      <Controller
        name="apiKey.scopes"
        control={control}
        render={({ field, fieldState }) => {
          const selectedScopes = Array.isArray(field.value) ? field.value : []

          return (
            <>
              <ScopeGrid>
                {apiKeyScopeOptions.map((scope, index) => {
                  const isChecked = selectedScopes.includes(scope.value)
                  const nextScopes = isChecked
                    ? selectedScopes.filter((selectedScope) => selectedScope !== scope.value)
                    : [...selectedScopes, scope.value]

                  return (
                    <ScopeOption key={scope.value} $checked={isChecked}>
                      <ScopeCheckbox
                        ref={index === 0 ? field.ref : undefined}
                        type="checkbox"
                        name={field.name}
                        checked={isChecked}
                        value={scope.value}
                        onBlur={field.onBlur}
                        onChange={() => field.onChange(nextScopes)}
                      />
                      <ScopeCheck $checked={isChecked}>
                        <Check size={16} />
                      </ScopeCheck>
                      <ScopeCopy>
                        <ScopeTitle>{scope.label}</ScopeTitle>
                        <ScopeDescription>{scope.description}</ScopeDescription>
                      </ScopeCopy>
                    </ScopeOption>
                  )
                })}
              </ScopeGrid>
              {fieldState.error?.message && (
                <FieldHelper $error>{fieldState.error.message}</FieldHelper>
              )}
            </>
          )
        }}
      />
    </FieldContainer>
  )
}
