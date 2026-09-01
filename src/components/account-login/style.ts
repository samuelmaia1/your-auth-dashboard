import { styled } from '@mui/material/styles'
import NextLink from 'next/link'

import {
  AsideCopy,
  AsideDescription,
  AsideEyebrow,
  AsideTitle,
  BackLink,
  FormCard,
  FormContent,
  FormDescription,
  FormHeading,
  FormSection,
  FormStack,
  FormStepMeta,
  FormTitle,
  FullWidthPrimaryButton,
  MobileHeader,
  PageRoot,
  SignupAside,
} from '@components/account-signup/style'

export {
  AsideCopy,
  AsideDescription,
  AsideEyebrow,
  AsideTitle,
  BackLink,
  FormCard,
  FormContent,
  FormDescription,
  FormSection,
  FormStack,
  FormStepMeta,
  FormTitle,
  MobileHeader,
  PageRoot,
}

export const LoginAside = styled(SignupAside)({})

export const LoginResourceList = styled('div')({
  marginTop: 28,
  display: 'grid',
  gap: 12,
})

export const LoginResourceItem = styled('div')(({ theme }) => ({
  padding: 12,
  display: 'flex',
  alignItems: 'flex-start',
  gap: 12,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.alpha((theme.vars || theme).palette.primary.contrastText, 0.08),
}))

export const LoginResourceIcon = styled('span')(({ theme }) => ({
  width: 36,
  height: 36,
  display: 'flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 8,
  backgroundColor: theme.alpha((theme.vars || theme).palette.primary.contrastText, 0.1),
  color: (theme.vars || theme).palette.accent.main,
}))

export const LoginResourceTitle = styled('p')({
  fontSize: 14,
  fontWeight: 600,
  lineHeight: '20px',
})

export const LoginResourceText = styled('p')(({ theme }) => ({
  marginTop: 4,
  color: theme.alpha((theme.vars || theme).palette.primary.contrastText, 0.64),
  fontSize: 12,
  lineHeight: '18px',
}))

export const SignupPanel = styled('div')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    padding: 20,
    display: 'grid',
    gap: 16,
    border: `1px solid ${theme.alpha(palette.primary.contrastText, 0.1)}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.alpha(palette.primary.contrastText, 0.06),
  }
})

export const SignupPanelTitle = styled('p')({
  fontSize: 16,
  fontWeight: 600,
  lineHeight: '22px',
})

export const SignupPanelDescription = styled('p')(({ theme }) => ({
  marginTop: 6,
  color: theme.alpha((theme.vars || theme).palette.primary.contrastText, 0.64),
  fontSize: 13,
  lineHeight: '20px',
}))

export const AsideSignupLink = styled(NextLink)(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    minHeight: 44,
    padding: '0 14px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    border: `1px solid ${theme.alpha(palette.accent.main, 0.6)}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: palette.accent.main,
    color: palette.accent.contrastText,
    fontSize: 14,
    fontWeight: 600,
    lineHeight: '20px',
    transition: 'background-color 150ms ease, border-color 150ms ease, transform 150ms ease',

    '& svg': {
      width: 16,
      height: 16,
      flexShrink: 0,
    },

    '&:hover': {
      backgroundColor: theme.alpha(palette.accent.main, 0.86),
    },

    '&:focus-visible': {
      outline: 'none',
      borderColor: palette.primary.contrastText,
      boxShadow: `0 0 0 3px ${theme.alpha(palette.primary.contrastText, 0.2)}`,
    },

    '&:active': {
      transform: 'translateY(1px)',
    },
  }
})

export const LoginFormHeading = styled(FormHeading)({
  marginTop: 0,
})

export const LoginForm = styled('form')({
  marginTop: 28,
})

export const LoginPrimaryButton = styled(FullWidthPrimaryButton)({
  marginTop: 4,
})

export const LoginSignupFooter = styled('footer')(({ theme }) => ({
  marginTop: 24,
  paddingTop: 20,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 10,
  borderTop: `1px solid ${(theme.vars || theme).palette.divider}`,

  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}))

export const LoginSignupFooterText = styled('p')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 14,
  lineHeight: '20px',
}))

export const LoginSignupFooterLink = styled(NextLink)(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    minHeight: 36,
    padding: '0 10px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    border: `1px solid ${palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: palette.background.default,
    color: palette.text.primary,
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '20px',
    transition: 'background-color 150ms ease, border-color 150ms ease, color 150ms ease',

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
