'use client'

import { X } from 'lucide-react'
import { useId, type ReactNode } from 'react'

import {
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalIcon,
  ModalSubtitle,
  ModalTitle,
  ModalTitleGroup,
  StyledDialog,
} from './style'

export interface ModalProps {
  children: ReactNode
  open: boolean
  onClose: () => void
  title?: ReactNode
  icon?: ReactNode
  subtitle?: ReactNode
}

export function Modal({ children, icon, onClose, open, subtitle, title }: ModalProps) {
  const titleId = useId()
  const subtitleId = useId()
  const hasHeader = Boolean(title || subtitle || icon)

  return (
    <StyledDialog
      open={open}
      onClose={() => onClose()}
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={subtitle ? subtitleId : undefined}
    >
      {hasHeader && (
        <ModalHeader>
          {icon ? <ModalIcon>{icon}</ModalIcon> : <span />}
          <ModalTitleGroup>
            {title && <ModalTitle id={titleId}>{title}</ModalTitle>}
            {subtitle && <ModalSubtitle id={subtitleId}>{subtitle}</ModalSubtitle>}
          </ModalTitleGroup>
          <ModalCloseButton
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Fechar modal"
            onClick={onClose}
          >
            <X size={16} />
          </ModalCloseButton>
        </ModalHeader>
      )}

      <ModalBody hasHeader={hasHeader}>{children}</ModalBody>
    </StyledDialog>
  )
}
