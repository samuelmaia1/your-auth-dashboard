'use client'

import type { IconName } from 'lucide-react/dynamic'
import { Controller, useFormContext, type FieldValues, type Path } from 'react-hook-form'
import { Input } from '@components/ui/input/input'
import { Container } from './style'

interface RHFInputProps<TFieldValues extends FieldValues = FieldValues> {
  name: Path<TFieldValues>
  label?: string
  placeholder?: string
  type?: string
  mask?: (value: string) => string
  secure?: boolean
  disabled?: boolean
  endIcon?: IconName
  onEndIconClick?: () => void
  onBlur?: (value: string) => void | Promise<void>
}

export function RHFInput<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  placeholder,
  type,
  mask,
  secure,
  disabled,
  endIcon,
  onEndIconClick,
  onBlur,
}: RHFInputProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>()

  return (
    <Container>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => {
          const fieldValue = String(field.value ?? '')

          return (
            <Input
              {...field}
              label={label}
              placeholder={placeholder}
              type={type}
              secure={secure}
              disabled={disabled}
              endIcon={endIcon}
              onEndIconClick={onEndIconClick}
              onBlur={async (e) => {
                field.onBlur()
                if (onBlur) {
                  await onBlur(String(e.target.value).replace(/\D/g, ''))
                }
              }}
              value={mask ? mask(fieldValue) : fieldValue}
              onChange={(e) => {
                const nextValue = mask ? mask(e.target.value).replace(/\D/g, '') : e.target.value

                field.onChange(nextValue)
              }}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )
        }}
      />
    </Container>
  )
}
