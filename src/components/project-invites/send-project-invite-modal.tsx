'use client'

import { ArrowRight, LoaderCircle, Mail, Send, UserPlus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { findAccountByEmail, isAccountLookupServiceError } from '@/services/account.service'
import { isInviteServiceError, sendProjectInvite } from '@/services/invite.service'
import type { AccountBasicResponse } from '@/types/account-types'
import type { ProjectInviteRole } from '@/types/invite-types'
import { Button } from '@components/ui/button/button'
import { Input } from '@components/ui/input/input'
import { Modal } from '@components/ui/modal'

import {
  AccountResultButton,
  AccountResultEmail,
  AccountResultMain,
  AccountResultName,
  ConfirmationCard,
  ConfirmationText,
  ConfirmationTitle,
  InviteSearchContent,
  InviteTriggerButton,
  LoadingSpinner,
  ModalActions,
  RoleField,
  RoleLabel,
  RoleSelect,
  SearchStatus,
} from './style'

type SendProjectInviteModalProps = {
  projectId: string
  triggerContext?: 'default' | 'settings'
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const searchDelayMs = 450
const inviteRoleOptions: Array<{ label: string; value: ProjectInviteRole }> = [
  { label: 'Visualizador', value: 'VIEWER' },
  { label: 'Desenvolvedor', value: 'DEVELOPER' },
  { label: 'Administrador', value: 'ADMIN' },
]

function getInviteRoleLabel(role: ProjectInviteRole) {
  return inviteRoleOptions.find((option) => option.value === role)?.label ?? role
}

function getAccountName(account: AccountBasicResponse) {
  return [account.name, account.lastName].filter(Boolean).join(' ').trim() || 'Conta sem nome'
}

export function SendProjectInviteModal({
  projectId,
  triggerContext = 'default',
}: SendProjectInviteModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [accountResult, setAccountResult] = useState<AccountBasicResponse | null>(null)
  const [selectedAccount, setSelectedAccount] = useState<AccountBasicResponse | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [selectedRole, setSelectedRole] = useState<ProjectInviteRole>('VIEWER')
  const [searchMessage, setSearchMessage] = useState<string | null>(null)
  const [sendErrorMessage, setSendErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const debouncedEmail = useDebouncedValue(email, searchDelayMs)
  const searchRequestIdRef = useRef(0)
  const currentInputEmail = email.trim().toLowerCase()
  const normalizedEmail = debouncedEmail.trim().toLowerCase()

  useEffect(() => {
    let shouldSearch = true
    const requestId = searchRequestIdRef.current + 1
    searchRequestIdRef.current = requestId

    queueMicrotask(() => {
      if (!shouldSearch) {
        return
      }

      if (
        !isOpen ||
        selectedAccount ||
        normalizedEmail !== currentInputEmail ||
        !emailPattern.test(normalizedEmail)
      ) {
        setAccountResult(null)
        setIsSearching(false)
        setSearchMessage(null)
        return
      }

      setIsSearching(true)
      setAccountResult(null)
      setSearchMessage(null)

      void findAccountByEmail(normalizedEmail)
        .then((account) => {
          if (searchRequestIdRef.current !== requestId) {
            return
          }

          setAccountResult(account)
          setSearchMessage(account.id ? null : 'A conta encontrada não possui identificador.')
        })
        .catch((error: unknown) => {
          if (searchRequestIdRef.current !== requestId) {
            return
          }

          if (isAccountLookupServiceError(error) && error.response.status === 404) {
            setSearchMessage('Nenhuma conta foi encontrada com esse e-mail.')
            return
          }

          setSearchMessage(
            isAccountLookupServiceError(error)
              ? (error.response.message ?? 'Não foi possível pesquisar a conta.')
              : 'Não foi possível pesquisar a conta.',
          )
        })
        .finally(() => {
          if (searchRequestIdRef.current === requestId) {
            setIsSearching(false)
          }
        })
    })

    return () => {
      shouldSearch = false
    }
  }, [currentInputEmail, isOpen, normalizedEmail, selectedAccount])

  function resetModal() {
    searchRequestIdRef.current += 1
    setEmail('')
    setAccountResult(null)
    setSelectedAccount(null)
    setIsSearching(false)
    setIsSending(false)
    setSelectedRole('VIEWER')
    setSearchMessage(null)
    setSendErrorMessage(null)
    setSuccessMessage(null)
  }

  function handleClose() {
    if (isSending) {
      return
    }

    setIsOpen(false)
    resetModal()
  }

  async function handleSendInvite() {
    const recipientAccountId = selectedAccount?.id?.trim()
    const recipientEmail = selectedAccount?.email?.trim() || email.trim()

    if (!recipientAccountId) {
      setSendErrorMessage('A conta selecionada não possui um identificador válido.')
      return
    }

    setIsSending(true)
    setSendErrorMessage(null)

    try {
      await sendProjectInvite({
        projectId,
        data: {
          recipientAccountId,
          role: selectedRole,
        },
      })

      setSuccessMessage(`Convite enviado para ${recipientEmail}.`)
      setSelectedAccount(null)
      setAccountResult(null)
      setEmail('')
      setSelectedRole('VIEWER')
    } catch (error: unknown) {
      setSendErrorMessage(
        isInviteServiceError(error)
          ? (error.response.message ?? 'Não foi possível enviar o convite.')
          : 'Não foi possível enviar o convite.',
      )
    } finally {
      setIsSending(false)
    }
  }

  const currentEmail = selectedAccount?.email?.trim() || email.trim()

  return (
    <>
      <InviteTriggerButton
        $context={triggerContext}
        type="button"
        size="sm"
        variant={triggerContext === 'settings' ? 'default' : 'outline'}
        onClick={() => {
          resetModal()
          setIsOpen(true)
        }}
      >
        <UserPlus size={16} />
        Enviar convite
      </InviteTriggerButton>

      <Modal
        open={isOpen}
        onClose={handleClose}
        icon={<Mail size={20} />}
        title="Convidar para o projeto"
        subtitle="Pesquise uma conta pelo e-mail e defina seu papel no projeto."
      >
        <InviteSearchContent>
          {selectedAccount ? (
            <>
              <ConfirmationCard>
                <ConfirmationTitle>Confirmar envio do convite?</ConfirmationTitle>
                <ConfirmationText>
                  Deseja convidar <strong>{currentEmail}</strong> para participar deste projeto como
                  {` ${getInviteRoleLabel(selectedRole).toLowerCase()}`}?
                </ConfirmationText>
              </ConfirmationCard>

              <RoleField>
                <RoleLabel>Papel no projeto</RoleLabel>
                <RoleSelect
                  value={selectedRole}
                  disabled={isSending}
                  onChange={(event) => setSelectedRole(event.target.value as ProjectInviteRole)}
                >
                  {inviteRoleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </RoleSelect>
              </RoleField>

              {sendErrorMessage && (
                <SearchStatus $tone="danger" role="alert">
                  {sendErrorMessage}
                </SearchStatus>
              )}

              <ModalActions>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSending}
                  onClick={() => {
                    setSelectedAccount(null)
                    setSendErrorMessage(null)
                  }}
                >
                  Voltar
                </Button>
                <Button
                  type="button"
                  variant="success"
                  disabled={isSending}
                  onClick={() => {
                    void handleSendInvite()
                  }}
                >
                  {isSending ? (
                    <LoadingSpinner>
                      <LoaderCircle size={16} />
                    </LoadingSpinner>
                  ) : (
                    <Send size={16} />
                  )}
                  Confirmar convite
                </Button>
              </ModalActions>
            </>
          ) : (
            <>
              <Input
                name="invite-email"
                type="email"
                label="E-mail da conta"
                placeholder="conta@empresa.com"
                value={email}
                disabled={isSending}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setSuccessMessage(null)
                  setSendErrorMessage(null)
                }}
              />

              {successMessage && <SearchStatus $tone="success">{successMessage}</SearchStatus>}

              {isSearching ? (
                <SearchStatus>
                  <LoadingSpinner>
                    <LoaderCircle size={14} />
                  </LoadingSpinner>{' '}
                  Pesquisando conta...
                </SearchStatus>
              ) : accountResult ? (
                <AccountResultButton
                  type="button"
                  disabled={!accountResult.id}
                  onClick={() => {
                    setSelectedAccount(accountResult)
                    setSendErrorMessage(null)
                  }}
                >
                  <AccountResultMain>
                    <AccountResultName>{getAccountName(accountResult)}</AccountResultName>
                    <AccountResultEmail>
                      {accountResult.email ?? normalizedEmail}
                    </AccountResultEmail>
                  </AccountResultMain>
                  <ArrowRight size={17} />
                </AccountResultButton>
              ) : searchMessage ? (
                <SearchStatus $tone="danger" role="status">
                  {searchMessage}
                </SearchStatus>
              ) : (
                <SearchStatus>
                  Digite um e-mail completo para pesquisar uma conta existente.
                </SearchStatus>
              )}
            </>
          )}
        </InviteSearchContent>
      </Modal>
    </>
  )
}
