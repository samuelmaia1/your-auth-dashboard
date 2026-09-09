'use client'

import { createContext, useContext, useId, type ReactNode } from 'react'

import { Button, type ButtonProps } from '@components/ui/button/button'
import {
  AlertDialogDescription as StyledAlertDialogDescription,
  AlertDialogFooter as StyledAlertDialogFooter,
  AlertDialogHeader as StyledAlertDialogHeader,
  AlertDialogTitle as StyledAlertDialogTitle,
  StyledAlertDialog,
} from './style'

type AlertDialogContextValue = {
  descriptionId: string
  onOpenChange: (open: boolean) => void
  titleId: string
}

type AlertDialogProps = {
  children: ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
}

type AlertDialogPartProps = {
  children: ReactNode
}

const AlertDialogContext = createContext<AlertDialogContextValue | null>(null)

function useAlertDialogContext() {
  const context = useContext(AlertDialogContext)

  if (!context) {
    throw new Error('AlertDialog components must be rendered inside AlertDialog.')
  }

  return context
}

export function AlertDialog({ children, onOpenChange, open }: AlertDialogProps) {
  const titleId = useId()
  const descriptionId = useId()

  return (
    <AlertDialogContext.Provider value={{ descriptionId, onOpenChange, titleId }}>
      <StyledAlertDialog
        open={open}
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        onClose={() => onOpenChange(false)}
      >
        {children}
      </StyledAlertDialog>
    </AlertDialogContext.Provider>
  )
}

export function AlertDialogHeader({ children }: AlertDialogPartProps) {
  return <StyledAlertDialogHeader>{children}</StyledAlertDialogHeader>
}

export function AlertDialogTitle({ children }: AlertDialogPartProps) {
  const { titleId } = useAlertDialogContext()

  return <StyledAlertDialogTitle id={titleId}>{children}</StyledAlertDialogTitle>
}

export function AlertDialogDescription({ children }: AlertDialogPartProps) {
  const { descriptionId } = useAlertDialogContext()

  return <StyledAlertDialogDescription id={descriptionId}>{children}</StyledAlertDialogDescription>
}

export function AlertDialogFooter({ children }: AlertDialogPartProps) {
  return <StyledAlertDialogFooter>{children}</StyledAlertDialogFooter>
}

export function AlertDialogCancel({ onClick, variant = 'outline', ...props }: ButtonProps) {
  const { onOpenChange } = useAlertDialogContext()

  return (
    <Button
      type="button"
      variant={variant}
      onClick={(event) => {
        onClick?.(event)
        onOpenChange(false)
      }}
      {...props}
    />
  )
}

export function AlertDialogAction({ type = 'button', ...props }: ButtonProps) {
  return <Button type={type} {...props} />
}
