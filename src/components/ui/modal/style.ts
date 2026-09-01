import { Dialog } from '@mui/material'
import { styled } from '@mui/material/styles'

import { Button } from '@components/ui/button/button'

export const StyledDialog = styled(Dialog)(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    '& .MuiBackdrop-root': {
      backgroundColor: theme.alpha(palette.primary.main, 0.36),
      backdropFilter: 'blur(4px)',
    },

    '& .MuiDialog-paper': {
      width: 'min(100%, 440px)',
      margin: 20,
      padding: 24,
      border: `1px solid ${palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      backgroundColor: palette.background.paper,
      color: palette.text.primary,
      boxShadow: `0 25px 70px -24px ${theme.alpha(palette.primary.main, 0.38)}`,
    },
  }
})

export const ModalHeader = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr) auto',
  alignItems: 'start',
  gap: 12,
})

export const ModalIcon = styled('div')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    width: 44,
    height: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.alpha(palette.accent.main, 0.16),
    color: palette.success.main,
  }
})

export const ModalTitleGroup = styled('div')({
  minWidth: 0,
})

export const ModalTitle = styled('h2')({
  fontSize: 20,
  fontWeight: 600,
  lineHeight: 1.25,
})

export const ModalSubtitle = styled('p')(({ theme }) => ({
  marginTop: 6,
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 14,
  lineHeight: 20 / 14,
}))

export const ModalCloseButton = styled(Button)({
  marginTop: -4,
  marginRight: -4,
})

export const ModalBody = styled('div', {
  shouldForwardProp: (prop) => prop !== 'hasHeader',
})<{ hasHeader: boolean }>(({ hasHeader }) => ({
  marginTop: hasHeader ? 20 : 0,
}))
