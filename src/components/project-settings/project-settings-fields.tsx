'use client'

import { Check } from 'lucide-react'
import { useId } from 'react'
import {
  Controller,
  useFormContext,
  type FieldPath,
  type FieldValues,
  type PathValue,
} from 'react-hook-form'

import {
  apiKeyScopeOptions,
  sessionModeOptions,
} from '@components/project-create/project-create.shared'
import type { ProjectApiKeyScope } from '@/types/project-types'
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
  StyledSelect,
  StyledSwitch,
  SwitchDescription,
  SwitchLabel,
  SwitchRow,
  SwitchText,
} from '@components/project-create/style'

type SelectOption = {
  label: string
  value: string
}

type SettingsSelectFieldProps<TFieldValues extends FieldValues> = {
  label: string
  name: FieldPath<TFieldValues>
  options?: SelectOption[]
}

type SettingsSwitchFieldProps<TFieldValues extends FieldValues> = {
  description: string
  label: string
  name: FieldPath<TFieldValues>
}

type SettingsScopeFieldProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>
}

export function SettingsSelectField<TFieldValues extends FieldValues>({
  label,
  name,
  options = sessionModeOptions,
}: SettingsSelectFieldProps<TFieldValues>) {
  const fieldId = useId()
  const { control } = useFormContext<TFieldValues>()

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

export function SettingsSwitchField<TFieldValues extends FieldValues>({
  description,
  label,
  name,
}: SettingsSwitchFieldProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>()

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

export function SettingsScopeField<TFieldValues extends FieldValues>({
  name,
}: SettingsScopeFieldProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>()

  return (
    <FieldContainer>
      <FieldLabel as="p">Escopos</FieldLabel>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => {
          const selectedScopes = Array.isArray(field.value)
            ? (field.value as ProjectApiKeyScope[])
            : []

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
                        onChange={() =>
                          field.onChange(nextScopes as PathValue<TFieldValues, typeof name>)
                        }
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
