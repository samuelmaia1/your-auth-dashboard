'use client'

import { Bell, Check, Inbox, LoaderCircle, RefreshCcw, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

import {
  acceptReceivedInvite,
  getAllPendingReceivedInvites,
  isInviteServiceError,
} from '@/services/invite.service'
import type { ProjectInviteResponse, ProjectInviteRole } from '@/types/invite-types'
import { Button } from '@components/ui/button/button'
import { Modal } from '@components/ui/modal'

import {
  EmptyInbox,
  EmptyInboxText,
  EmptyInboxTitle,
  InboxContent,
  InboxList,
  InboxTrigger,
  InviteActionButton,
  InviteActions,
  InviteCard,
  InviteDate,
  InviteDescription,
  InviteMeta,
  InviteProjectName,
  InviteRoleBadge,
  LoadingSpinner,
  NotificationBadge,
  SearchStatus,
} from './style'

const inviteRoleLabels: Record<ProjectInviteRole, string> = {
  ADMIN: 'Administrador',
  DEVELOPER: 'Desenvolvedor',
  VIEWER: 'Visualizador',
}

const inviteDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
})

function formatInviteDate(value?: string) {
  if (!value) {
    return 'Data não informada'
  }

  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? 'Data inválida' : inviteDateFormatter.format(date)
}

function getInviteErrorMessage(error: unknown, fallbackMessage: string) {
  return isInviteServiceError(error) ? (error.response.message ?? fallbackMessage) : fallbackMessage
}

export function ReceivedInvitesInbox() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [invites, setInvites] = useState<ProjectInviteResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [acceptingInviteId, setAcceptingInviteId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const requestIdRef = useRef(0)

  const loadInvites = useCallback(async () => {
    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const pendingInvites = await getAllPendingReceivedInvites()

      if (requestIdRef.current === requestId) {
        setInvites(pendingInvites)
      }
    } catch (error: unknown) {
      if (requestIdRef.current === requestId) {
        setErrorMessage(
          getInviteErrorMessage(error, 'Não foi possível carregar os convites recebidos.'),
        )
      }
    } finally {
      if (requestIdRef.current === requestId) {
        setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    let shouldLoad = true

    queueMicrotask(() => {
      if (shouldLoad) {
        void loadInvites()
      }
    })

    return () => {
      shouldLoad = false
      requestIdRef.current += 1
    }
  }, [loadInvites])

  async function handleAcceptInvite(invite: ProjectInviteResponse) {
    const inviteId = invite.id?.trim()

    if (!inviteId) {
      setErrorMessage('O convite recebido não possui um identificador válido.')
      return
    }

    setAcceptingInviteId(inviteId)
    setErrorMessage(null)

    try {
      const acceptedInvite = await acceptReceivedInvite(inviteId)
      const projectId = acceptedInvite.projectId?.trim() || invite.projectId?.trim()

      setInvites((currentInvites) =>
        currentInvites.filter((currentInvite) => currentInvite.id !== inviteId),
      )

      if (!projectId) {
        setErrorMessage('Convite aceito, mas a API não retornou o identificador do projeto.')
        return
      }

      setIsOpen(false)
      router.push(`/projetos/${encodeURIComponent(projectId)}`)
    } catch (error: unknown) {
      setErrorMessage(getInviteErrorMessage(error, 'Não foi possível aceitar o convite.'))
    } finally {
      setAcceptingInviteId(null)
    }
  }

  const notificationCount = invites.length > 99 ? '99+' : String(invites.length)

  return (
    <>
      <InboxTrigger
        type="button"
        size="icon"
        variant="outline"
        aria-label={`Abrir convites pendentes (${invites.length})`}
        onClick={() => {
          setIsOpen(true)
          void loadInvites()
        }}
      >
        <Bell size={18} />
        <NotificationBadge aria-hidden="true">{notificationCount}</NotificationBadge>
      </InboxTrigger>

      <Modal
        open={isOpen}
        onClose={() => {
          if (!acceptingInviteId) {
            setIsOpen(false)
          }
        }}
        icon={<Inbox size={20} />}
        title="Convites pendentes"
        subtitle="Aceite um convite para acessar o projeto ou recuse quando a API disponibilizar essa ação."
      >
        <InboxContent>
          {errorMessage && (
            <SearchStatus $tone="danger" role="alert">
              {errorMessage}
            </SearchStatus>
          )}

          {isLoading && invites.length === 0 ? (
            <EmptyInbox aria-busy="true">
              <LoadingSpinner>
                <LoaderCircle size={22} />
              </LoadingSpinner>
              <EmptyInboxTitle>Carregando convites</EmptyInboxTitle>
            </EmptyInbox>
          ) : invites.length > 0 ? (
            <InboxList aria-busy={isLoading}>
              {invites.map((invite, index) => {
                const inviteId = invite.id?.trim()
                const isAccepting = acceptingInviteId === inviteId
                const isAnyInviteAccepting = Boolean(acceptingInviteId)

                return (
                  <InviteCard key={inviteId ?? `${invite.projectId ?? 'invite'}-${index}`}>
                    <div>
                      <InviteProjectName>
                        {invite.projectName?.trim() || 'Projeto sem nome'}
                      </InviteProjectName>
                      <InviteDescription>
                        {invite.projectDescription?.trim() || 'Sem descrição.'}
                      </InviteDescription>
                    </div>

                    <InviteMeta>
                      <InviteRoleBadge>
                        {invite.role ? inviteRoleLabels[invite.role] : 'Papel não informado'}
                      </InviteRoleBadge>
                      <InviteDate>Enviado em {formatInviteDate(invite.sentAt)}</InviteDate>
                    </InviteMeta>

                    <InviteActions>
                      <InviteActionButton
                        type="button"
                        variant="success"
                        disabled={!inviteId || isAnyInviteAccepting}
                        onClick={() => {
                          void handleAcceptInvite(invite)
                        }}
                      >
                        {isAccepting ? (
                          <LoadingSpinner>
                            <LoaderCircle size={15} />
                          </LoadingSpinner>
                        ) : (
                          <Check size={15} />
                        )}
                        Aceitar
                      </InviteActionButton>

                      <span title="O contrato OpenAPI ainda não define um endpoint para recusar convites.">
                        <InviteActionButton type="button" variant="destructive" disabled>
                          <X size={15} />
                          Recusar
                        </InviteActionButton>
                      </span>
                    </InviteActions>
                  </InviteCard>
                )
              })}
            </InboxList>
          ) : (
            <EmptyInbox>
              <Inbox size={22} />
              <EmptyInboxTitle>Nenhum convite pendente</EmptyInboxTitle>
              <EmptyInboxText>Novos convites aparecerão nesta caixa de entrada.</EmptyInboxText>
            </EmptyInbox>
          )}

          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={isLoading || Boolean(acceptingInviteId)}
            onClick={() => {
              void loadInvites()
            }}
          >
            <RefreshCcw size={15} />
            Atualizar convites
          </Button>
        </InboxContent>
      </Modal>
    </>
  )
}
