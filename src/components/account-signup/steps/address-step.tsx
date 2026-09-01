'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { RHFInput } from '@components/ui/rhf-input/rhf-input'
import { getAddressByCep, isViaCepLookupError, type ViaCepAddress } from '@lib/api/via-cep'
import type { AccountSignupFormValues } from '@lib/validations/account-signup'
import { cepMask } from '@/utils/mask'
import { onlyDigits } from '@/utils/normalizer'

import {
  ActionGrid,
  CityGrid,
  FormButton,
  FormStack,
  PrimaryFormButton,
  StreetGrid,
} from '../style'
import { addressStepFields } from './fields'
import type { StepProps } from './types'
import { validateStep } from './validate-step'

export function AddressStep({ onNext, onBack }: StepProps) {
  const { clearErrors, setError, setValue, trigger } = useFormContext<AccountSignupFormValues>()
  const [isAddressLookupLoading, setIsAddressLookupLoading] = useState(false)
  const addressLookupControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => {
      addressLookupControllerRef.current?.abort()
    }
  }, [])

  function clearAddressFields() {
    setValue('address.street', '', { shouldDirty: true })
    setValue('address.neighborhood', '', { shouldDirty: true })
    setValue('address.city', '', { shouldDirty: true })
    setValue('address.state', '', { shouldDirty: true })
  }

  function fillAddressFields(address: ViaCepAddress) {
    setValue('address.street', address.street, { shouldDirty: true, shouldValidate: true })
    setValue('address.neighborhood', address.neighborhood, {
      shouldDirty: true,
      shouldValidate: true,
    })
    setValue('address.city', address.city, { shouldDirty: true, shouldValidate: true })
    setValue('address.state', address.state, { shouldDirty: true, shouldValidate: true })
    clearErrors([
      'address.cep',
      'address.street',
      'address.neighborhood',
      'address.city',
      'address.state',
    ])
  }

  function handleCepChange(nextCep: string) {
    const cepDigits = onlyDigits(nextCep)

    clearErrors('address.cep')
    addressLookupControllerRef.current?.abort()
    addressLookupControllerRef.current = null

    if (cepDigits.length !== 8) {
      setIsAddressLookupLoading(false)
      return
    }

    const controller = new AbortController()

    addressLookupControllerRef.current = controller
    setIsAddressLookupLoading(true)
    clearAddressFields()

    void getAddressByCep(cepDigits, controller.signal)
      .then((address) => {
        if (addressLookupControllerRef.current !== controller) {
          return
        }

        fillAddressFields(address)
      })
      .catch((error: unknown) => {
        if (addressLookupControllerRef.current !== controller || controller.signal.aborted) {
          return
        }

        setError('address.cep', {
          type: 'manual',
          message: isViaCepLookupError(error)
            ? error.message
            : 'Não foi possível buscar o endereço pelo CEP.',
        })
      })
      .finally(() => {
        if (addressLookupControllerRef.current === controller) {
          addressLookupControllerRef.current = null
          setIsAddressLookupLoading(false)
        }
      })
  }

  return (
    <FormStack>
      <RHFInput
        name="address.cep"
        label="CEP"
        placeholder="00000-000"
        mask={cepMask}
        onValueChange={handleCepChange}
        type="text"
      />

      <StreetGrid>
        <RHFInput
          name="address.street"
          label="Logradouro"
          placeholder="Rua das Flores"
          disabled={isAddressLookupLoading}
          type="text"
        />
        <RHFInput
          name="address.number"
          label="Número"
          placeholder="120"
          disabled={isAddressLookupLoading}
          type="text"
        />
      </StreetGrid>

      <RHFInput
        name="address.neighborhood"
        label="Bairro"
        placeholder="Centro"
        disabled={isAddressLookupLoading}
        type="text"
      />

      <CityGrid>
        <RHFInput
          name="address.city"
          label="Cidade"
          placeholder="São Paulo"
          disabled={isAddressLookupLoading}
          type="text"
        />
        <RHFInput
          name="address.state"
          label="Estado"
          placeholder="SP"
          disabled={isAddressLookupLoading}
          type="text"
        />
      </CityGrid>

      <ActionGrid>
        <FormButton type="button" variant="outline" size="lg" onClick={onBack}>
          <ArrowLeft size={16} /> Voltar
        </FormButton>
        <PrimaryFormButton
          type="button"
          size="lg"
          disabled={isAddressLookupLoading}
          onClick={() => validateStep(trigger, addressStepFields, onNext)}
        >
          Continuar <ArrowRight size={16} />
        </PrimaryFormButton>
      </ActionGrid>
    </FormStack>
  )
}
