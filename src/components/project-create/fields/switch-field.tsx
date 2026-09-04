'use client'

import { Controller, useFormContext } from 'react-hook-form'

import type { ProjectCreateFieldName } from '../project-create.shared'
import type { ProjectCreateFormValues } from '@lib/validations/project-create'
import { StyledSwitch, SwitchDescription, SwitchLabel, SwitchRow, SwitchText } from '../style'

type SwitchFieldProps = {
  description: string
  label: string
  name: ProjectCreateFieldName
}

export function SwitchField({ description, label, name }: SwitchFieldProps) {
  const { control } = useFormContext<ProjectCreateFormValues>()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <SwitchRow>
          <SwitchText>
            <SwitchLabel>{label}</SwitchLabel>
            <SwitchDescription>{description}</SwitchDescription>
          </SwitchText>
          <StyledSwitch
            checked={Boolean(field.value)}
            name={field.name}
            onBlur={field.onBlur}
            onChange={(_, checked) => field.onChange(checked)}
            slotProps={{
              input: {
                ref: field.ref,
              },
            }}
          />
        </SwitchRow>
      )}
    />
  )
}
