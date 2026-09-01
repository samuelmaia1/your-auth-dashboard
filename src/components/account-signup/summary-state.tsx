import { ArrowLeft, ArrowRight, CheckCircle2, LoaderCircle, Mail } from 'lucide-react'

import type { CreateAccountPayload } from '@lib/validations/account-signup'
import { cepMask, cpfMask, phoneMask } from '@/utils/mask'

import {
  DataCell,
  DataDetail,
  DataGrid,
  DataLabel,
  DataValue,
  FormAlert,
  SubmitLoadingIcon,
  SuccessActions,
  SuccessButton,
  SuccessCard,
  SuccessDescription,
  SuccessIcon,
  SuccessMeta,
  SuccessTitle,
} from './style'

type SummaryStateProps = {
  data: CreateAccountPayload
  errorMessage: string | null
  isLoading: boolean
  onBackToStart: () => void
  onCreate: () => void
}

export function SummaryState({
  data,
  errorMessage,
  isLoading,
  onBackToStart,
  onCreate,
}: SummaryStateProps) {
  return (
    <SuccessCard>
      <SuccessIcon>
        <CheckCircle2 size={24} />
      </SuccessIcon>
      <SuccessMeta>Resumo do cadastro</SuccessMeta>
      <SuccessTitle>Revise os dados antes de criar a conta.</SuccessTitle>
      <SuccessDescription>
        Confira as informações abaixo. A conta só será criada quando você confirmar o envio ao
        backend.
      </SuccessDescription>

      {errorMessage && <FormAlert role="alert">{errorMessage}</FormAlert>}

      <DataGrid>
        <DataCell>
          <DataLabel>Titular</DataLabel>
          <DataValue>
            {data.name} {data.lastName}
          </DataValue>
          <DataDetail>{cpfMask(data.CPF)}</DataDetail>
        </DataCell>
        <DataCell>
          <DataLabel>Contato</DataLabel>
          <DataValue>
            <Mail size={14} /> {data.email}
          </DataValue>
          <DataDetail>{phoneMask(data.phone)}</DataDetail>
        </DataCell>
        <DataCell wide>
          <DataLabel>Endereço</DataLabel>
          <DataValue>
            {data.address.street}, {data.address.number}
          </DataValue>
          <DataDetail>
            {data.address.neighborhood}, {data.address.city} - {data.address.state} - CEP{' '}
            {cepMask(data.address.cep)}
          </DataDetail>
        </DataCell>
      </DataGrid>

      <SuccessActions>
        <SuccessButton type="button" size="lg" disabled={isLoading} onClick={onCreate}>
          {isLoading ? (
            <>
              <SubmitLoadingIcon>
                <LoaderCircle size={16} />
              </SubmitLoadingIcon>
              Criando conta
            </>
          ) : (
            <>
              Criar conta <ArrowRight size={16} />
            </>
          )}
        </SuccessButton>
        <SuccessButton
          type="button"
          variant="outline"
          size="lg"
          disabled={isLoading}
          onClick={onBackToStart}
        >
          <ArrowLeft size={16} /> Voltar ao início
        </SuccessButton>
      </SuccessActions>
    </SuccessCard>
  )
}
