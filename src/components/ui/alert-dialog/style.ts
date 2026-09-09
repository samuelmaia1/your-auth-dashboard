import { Dialog } from '@mui/material'
import { styled } from '@mui/material/styles'

export const StyledAlertDialog = styled(Dialog)(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    '& .MuiBackdrop-root': {
      backgroundColor: theme.alpha(palette.primary.main, 0.34),
      backdropFilter: 'blur(4px)',
    },

    '& .MuiDialog-paper': {
      width: 'min(100%, 512px)',
      margin: 20,
      padding: 24,
      display: 'grid',
      gap: 18,
      border: `1px solid ${palette.divider}`,
      borderRadius: 8,
      backgroundColor: palette.background.paper,
      color: palette.text.primary,
      boxShadow: `0 24px 70px -24px ${theme.alpha(palette.primary.main, 0.38)}`,
    },
  }
})

export const AlertDialogHeader = styled('div')({
  display: 'grid',
  gap: 8,
})

export const AlertDialogTitle = styled('h2')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
  fontSize: 18,
  fontWeight: 700,
  lineHeight: '24px',
}))

export const AlertDialogDescription = styled('p')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 14,
  lineHeight: '22px',
}))

export const AlertDialogFooter = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column-reverse',
  gap: 10,

  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
}))
