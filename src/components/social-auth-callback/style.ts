import { styled } from '@mui/material/styles'
import NextLink from 'next/link'

export const CallbackRoot = styled('main')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    minHeight: '100dvh',
    padding: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.background.default,
    color: palette.text.primary,
  }
})

export const CallbackCard = styled('section')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    width: '100%',
    maxWidth: 420,
    padding: 24,
    display: 'grid',
    justifyItems: 'start',
    gap: 16,
    border: `1px solid ${palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: palette.background.paper,
    boxShadow: `0 25px 50px -12px ${theme.alpha(palette.primary.main, 0.1)}`,
  }
})

export const CallbackIcon = styled('span', {
  shouldForwardProp: (prop) => prop !== '$tone',
})<{ $tone: 'loading' | 'error' }>(({ $tone, theme }) => {
  const palette = (theme.vars || theme).palette
  const color = $tone === 'loading' ? palette.success.main : palette.error.main

  return {
    width: 44,
    height: 44,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.alpha(color, 0.12),
    color,

    '& svg': {
      width: 20,
      height: 20,
    },
  }
})

export const CallbackLoadingIcon = styled(CallbackIcon)({
  '@keyframes social-auth-callback-spin': {
    to: {
      transform: 'rotate(360deg)',
    },
  },

  '& svg': {
    animation: 'social-auth-callback-spin 850ms linear infinite',
  },
})

export const CallbackTitle = styled('h1')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
  fontSize: 24,
  fontWeight: 700,
  lineHeight: '30px',
}))

export const CallbackDescription = styled('p')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 14,
  lineHeight: '22px',
}))

export const CallbackErrorMessage = styled('p')(({ theme }) => ({
  padding: '10px 12px',
  border: `1px solid ${theme.alpha((theme.vars || theme).palette.error.main, 0.22)}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.alpha((theme.vars || theme).palette.error.main, 0.08),
  color: (theme.vars || theme).palette.error.main,
  fontSize: 13,
  fontWeight: 500,
  lineHeight: '20px',
}))

export const CallbackLoginLink = styled(NextLink)(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    minHeight: 44,
    marginTop: 4,
    padding: '0 14px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    border: `1px solid ${palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: palette.background.default,
    color: palette.text.primary,
    fontSize: 14,
    fontWeight: 600,
    lineHeight: '20px',
    transition: 'background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease',

    '& svg': {
      width: 16,
      height: 16,
      flexShrink: 0,
    },

    '&:hover': {
      backgroundColor: palette.muted.main,
    },

    '&:focus-visible': {
      outline: 'none',
      borderColor: palette.ring,
      boxShadow: `0 0 0 3px ${theme.alpha(palette.ring, 0.32)}`,
    },
  }
})

export const CallbackLoginLinkContent = styled('span')({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
})
