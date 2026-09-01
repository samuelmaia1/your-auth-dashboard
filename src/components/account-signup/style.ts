import { styled } from '@mui/material/styles'
import NextLink from 'next/link'

import { Button } from '@components/ui/button/button'

const monoFontFamily =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'

export type StepStatus = 'active' | 'complete' | 'pending'

export const PageRoot = styled('main')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    minHeight: '100vh',
    display: 'grid',
    backgroundColor: palette.background.default,
    color: palette.text.primary,

    [theme.breakpoints.up('lg')]: {
      gridTemplateColumns: 'minmax(24rem, 0.9fr) minmax(0, 1.1fr)',
    },
  }
})

export const LogoLink = styled(NextLink)({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
})

export const LogoMark = styled('span')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: palette.primary.main,
    color: palette.primary.contrastText,
  }
})

export const LogoText = styled('span')({
  fontFamily: monoFontFamily,
  fontSize: 15,
  fontWeight: 600,
})

export const StepIndicatorGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: 8,

  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },
}))

export const StepIndicatorItem = styled('div', {
  shouldForwardProp: (prop) => prop !== 'status',
})<{ status: StepStatus }>(({ status, theme }) => {
  const palette = (theme.vars || theme).palette
  const statusStyles = {
    active: {
      borderColor: palette.primary.main,
      backgroundColor: palette.secondary.main,
      color: palette.text.primary,
    },
    complete: {
      borderColor: theme.alpha(palette.accent.main, 0.5),
      backgroundColor: theme.alpha(palette.accent.main, 0.1),
      color: palette.text.primary,
    },
    pending: {
      borderColor: palette.divider,
      backgroundColor: palette.background.default,
      color: palette.text.secondary,
    },
  }

  return {
    minHeight: 56,
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    border: '1px solid',
    borderRadius: theme.shape.borderRadius,
    fontSize: 14,
    lineHeight: '20px',
    transition: 'background-color 150ms ease, border-color 150ms ease, color 150ms ease',
    ...statusStyles[status],
  }
})

export const StepIndicatorIcon = styled('span', {
  shouldForwardProp: (prop) => prop !== 'status',
})<{ status: StepStatus }>(({ status, theme }) => {
  const palette = (theme.vars || theme).palette
  const statusStyles = {
    active: {
      backgroundColor: palette.primary.main,
      color: palette.primary.contrastText,
    },
    complete: {
      backgroundColor: palette.accent.main,
      color: palette.accent.contrastText,
    },
    pending: {
      backgroundColor: palette.muted.main,
      color: palette.text.secondary,
    },
  }

  return {
    width: 32,
    height: 32,
    display: 'flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    ...statusStyles[status],
  }
})

export const StepIndicatorTitle = styled('span')({
  fontWeight: 500,
})

export const FormStack = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
})

export const TwoColumnGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: 16,

  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },
}))

export const PhoneGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: 16,

  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: '0.35fr 1fr',
  },
}))

export const StreetGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: 16,

  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: '1fr 0.35fr',
  },
}))

export const CityGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: 16,

  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: '1fr 0.45fr',
  },
}))

export const ActionGrid = styled('div')(({ theme }) => ({
  marginTop: 8,
  display: 'grid',
  gap: 12,

  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: '0.45fr 1fr',
  },
}))

export const FormButton = styled(Button)({
  height: 44,
  gap: 8,
})

export const PrimaryFormButton = styled(FormButton)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.alpha((theme.vars || theme).palette.primary.main, 0.9),
  },
}))

export const FullWidthPrimaryButton = styled(PrimaryFormButton)({
  width: '100%',
  marginTop: 8,
})

export const SubmitLoadingIcon = styled('span')({
  display: 'inline-flex',

  '@keyframes account-signup-spin': {
    to: {
      transform: 'rotate(360deg)',
    },
  },

  '& svg': {
    animation: 'account-signup-spin 850ms linear infinite',
  },
})

export const PasswordRules = styled('div')(({ theme }) => ({
  padding: 12,
  display: 'grid',
  gap: 8,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: (theme.vars || theme).palette.background.default,

  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },
}))

export const PasswordRule = styled('span', {
  shouldForwardProp: (prop) => prop !== 'passed',
})<{ passed: boolean }>(({ passed, theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  color: passed
    ? (theme.vars || theme).palette.success.main
    : (theme.vars || theme).palette.text.secondary,
  fontSize: 12,
  fontWeight: passed ? 500 : 400,
  lineHeight: '16px',
  transition: 'color 150ms ease',
}))

export const SignupAside = styled('aside')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    minHeight: '100vh',
    display: 'none',
    borderRight: `1px solid ${palette.divider}`,
    backgroundColor: palette.primary.main,
    color: palette.primary.contrastText,

    [theme.breakpoints.up('lg')]: {
      padding: '36px 40px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },

    [theme.breakpoints.up('xl')]: {
      paddingLeft: 56,
      paddingRight: 56,
    },
  }
})

export const AsideCopy = styled('div')({
  maxWidth: 576,
})

export const AsideEyebrow = styled('div')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    marginBottom: 24,
    padding: '6px 12px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    border: `1px solid ${theme.alpha(palette.primary.contrastText, 0.15)}`,
    borderRadius: 9999,
    backgroundColor: theme.alpha(palette.primary.contrastText, 0.1),
    color: theme.alpha(palette.primary.contrastText, 0.7),
    fontFamily: monoFontFamily,
    fontSize: 11,
    lineHeight: 1.5,

    '& svg': {
      color: palette.accent.main,
    },
  }
})

export const AsideTitle = styled('h1')(({ theme }) => ({
  fontSize: 48,
  fontWeight: 600,
  lineHeight: 1,
  letterSpacing: '-0.055em',
  textWrap: 'balance',

  [theme.breakpoints.up('xl')]: {
    fontSize: 60,
  },
}))

export const AsideDescription = styled('p')(({ theme }) => ({
  maxWidth: 448,
  marginTop: 24,
  color: theme.alpha((theme.vars || theme).palette.primary.contrastText, 0.7),
  fontSize: 16,
  lineHeight: 7 / 4,
  textWrap: 'pretty',
}))

export const SetupPanel = styled('div')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    padding: 20,
    border: `1px solid ${theme.alpha(palette.primary.contrastText, 0.1)}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.alpha(palette.primary.contrastText, 0.06),
  }
})

export const SetupPanelHeader = styled('div')(({ theme }) => ({
  paddingBottom: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  borderBottom: `1px solid ${theme.alpha((theme.vars || theme).palette.primary.contrastText, 0.1)}`,
}))

export const SetupPanelTitle = styled('p')({
  marginTop: 4,
  fontSize: 14,
  fontWeight: 500,
  lineHeight: '20px',
})

export const WelcomeBadge = styled('span')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    padding: '4px 10px',
    borderRadius: 8,
    backgroundColor: palette.accent.main,
    color: palette.accent.contrastText,
    fontFamily: monoFontFamily,
    fontSize: 11,
    fontWeight: 600,
    lineHeight: 1.5,
  }
})

export const SetupList = styled('div')({
  marginTop: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
})

export const SetupItem = styled('div', {
  shouldForwardProp: (prop) => prop !== 'status',
})<{ status: StepStatus }>(({ status, theme }) => {
  const palette = (theme.vars || theme).palette
  const backgroundColor =
    status === 'complete'
      ? theme.alpha(palette.success.main, 0.15)
      : status === 'active'
        ? theme.alpha(palette.primary.contrastText, 0.14)
        : theme.alpha(palette.background.default, 0.1)

  return {
    padding: 12,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    borderRadius: theme.shape.borderRadius,
    backgroundColor,
    boxShadow:
      status === 'complete' ? `0 0 0 1px ${theme.alpha(palette.success.main, 0.35)}` : 'none',
    transition: 'background-color 150ms ease, box-shadow 150ms ease',
  }
})

export const SetupIcon = styled('span', {
  shouldForwardProp: (prop) => prop !== 'complete',
})<{ complete: boolean }>(({ complete, theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: complete
      ? palette.success.main
      : theme.alpha(palette.primary.contrastText, 0.1),
    color: complete ? palette.success.contrastText : 'inherit',
    transition: 'background-color 150ms ease, color 150ms ease',
  }
})

export const SetupItemTitle = styled('p')({
  fontSize: 14,
  fontWeight: 500,
  lineHeight: '20px',
})

export const SetupItemStatus = styled('p', {
  shouldForwardProp: (prop) => prop !== 'status',
})<{ status: StepStatus }>(({ status, theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    marginTop: 4,
    color:
      status === 'complete'
        ? palette.success.main
        : theme.alpha(palette.primary.contrastText, status === 'active' ? 0.75 : 0.55),
    fontSize: 12,
    fontWeight: status === 'complete' ? 500 : 400,
    lineHeight: '16px',
    transition: 'color 150ms ease',
  }
})

export const SuccessCard = styled('div')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    padding: 24,
    border: `1px solid ${palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: palette.background.paper,
    boxShadow: `0 25px 50px -12px ${theme.alpha(palette.primary.main, 0.1)}`,

    [theme.breakpoints.up('sm')]: {
      padding: 32,
    },
  }
})

export const SuccessIcon = styled('div')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    width: 48,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.alpha(palette.accent.main, 0.15),
    color: palette.success.main,
  }
})

export const SuccessMeta = styled('p')({
  marginTop: 24,
  fontFamily: monoFontFamily,
  fontSize: 12,
  lineHeight: '16px',
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
})

export const SuccessTitle = styled('h2')({
  marginTop: 12,
  fontSize: 30,
  fontWeight: 600,
  lineHeight: 1.2,
  letterSpacing: '-0.04em',
})

export const SuccessDescription = styled('p')(({ theme }) => ({
  marginTop: 16,
  color: (theme.vars || theme).palette.text.secondary,
  lineHeight: 7 / 4,
}))

export const DataGrid = styled('div')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    marginTop: 24,
    display: 'grid',
    gap: 1,
    overflow: 'hidden',
    border: `1px solid ${palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: palette.divider,

    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
  }
})

export const DataCell = styled('div', {
  shouldForwardProp: (prop) => prop !== 'wide',
})<{ wide?: boolean }>(({ theme, wide = false }) => ({
  padding: 16,
  backgroundColor: (theme.vars || theme).palette.background.default,

  [theme.breakpoints.up('sm')]: wide
    ? {
        gridColumn: 'span 2 / span 2',
      }
    : undefined,
}))

export const DataLabel = styled('p')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.secondary,
  fontFamily: monoFontFamily,
  fontSize: 11,
  lineHeight: 1.5,
  textTransform: 'uppercase',
}))

export const DataValue = styled('p')({
  marginTop: 8,
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 14,
  fontWeight: 500,
  lineHeight: '20px',
})

export const DataDetail = styled('p')(({ theme }) => ({
  marginTop: 4,
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 12,
  lineHeight: '16px',
}))

export const SuccessActions = styled('div')(({ theme }) => ({
  marginTop: 28,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,

  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
  },
}))

export const SuccessButton = styled(FormButton)({
  flex: 1,
})

export const FormSection = styled('section')(({ theme }) => ({
  minHeight: '100vh',
  padding: '32px 20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  [theme.breakpoints.up('sm')]: {
    paddingLeft: 32,
    paddingRight: 32,
  },

  [theme.breakpoints.up('lg')]: {
    paddingLeft: 48,
    paddingRight: 48,
  },
}))

export const FormContent = styled('div')({
  width: '100%',
  maxWidth: 576,
})

export const MobileHeader = styled('div')(({ theme }) => ({
  marginBottom: 32,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,

  [theme.breakpoints.up('lg')]: {
    display: 'none',
  },
}))

export const BackLink = styled(NextLink)(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    padding: '8px 12px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    border: `1px solid ${palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: palette.background.paper,
    color: palette.text.secondary,
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '20px',
    transition: 'color 150ms ease',

    '&:hover': {
      color: palette.text.primary,
    },
  }
})

export const FormCard = styled('div')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    padding: 20,
    border: `1px solid ${palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: palette.background.paper,
    boxShadow: `0 25px 50px -12px ${theme.alpha(palette.primary.main, 0.1)}`,

    [theme.breakpoints.up('sm')]: {
      padding: 28,
    },
  }
})

export const FormHeading = styled('div')({
  marginTop: 32,
})

export const FormStepMeta = styled('p')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.secondary,
  fontFamily: monoFontFamily,
  fontSize: 12,
  lineHeight: '16px',
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
}))

export const FormTitle = styled('h2')({
  marginTop: 12,
  fontSize: 30,
  fontWeight: 600,
  lineHeight: 1.2,
  letterSpacing: '-0.04em',
})

export const FormDescription = styled('p')(({ theme }) => ({
  marginTop: 8,
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 14,
  lineHeight: 24 / 14,
}))

export const FormAlert = styled('p')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    marginTop: 20,
    padding: '10px 12px',
    border: `1px solid ${theme.alpha(palette.error.main, 0.22)}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.alpha(palette.error.main, 0.08),
    color: palette.error.main,
    fontSize: 13,
    fontWeight: 500,
    lineHeight: '20px',
  }
})

export const SuccessModalMessage = styled('p')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 14,
  lineHeight: 24 / 14,
}))

export const SuccessModalActions = styled('div')({
  marginTop: 24,
  display: 'flex',
})

export const SuccessModalButton = styled(FormButton)({
  width: '100%',
})
