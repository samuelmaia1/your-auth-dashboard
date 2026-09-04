'use client'

import { useId } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import type { ProjectCreateFieldName, SelectFieldOption } from '../project-create.shared'
import type { ProjectCreateFormValues } from '@lib/validations/project-create'
import { FieldContainer, FieldHelper, FieldLabel, StyledSelect } from '../style'

type SelectFieldProps = {
  label: string
  name: ProjectCreateFieldName
  options: SelectFieldOption[]
}

export function SelectField({ label, name, options }: SelectFieldProps) {
  const fieldId = useId()
  const { control } = useFormContext<ProjectCreateFormValues>()

  return (
    <FieldContainer>
      <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <>
            <StyledSelect
              id={fieldId}
              name={field.name}
              ref={field.ref}
              value={String(field.value ?? '')}
              aria-invalid={fieldState.error ? 'true' : undefined}
              onBlur={field.onBlur}
              onChange={(event) => field.onChange(event.target.value)}
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </StyledSelect>
            {fieldState.error?.message && (
              <FieldHelper $error>{fieldState.error.message}</FieldHelper>
            )}
          </>
        )}
      />
    </FieldContainer>
  )
}
