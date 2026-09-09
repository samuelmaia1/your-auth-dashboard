import { styled } from '@mui/material/styles'
import NextLink from 'next/link'

import { Button } from '@components/ui/button/button'

type FeedbackMessageProps = {
  $tone: 'success' | 'danger' | 'info'
}

export const ProjectSettingsRoot = styled('main')({
  width: '100%',
  maxWidth: 1180,
  margin: '0 auto',
  display: 'grid',
  gap: 28,
})

export const ProjectSettingsHeader = styled('header')(({ theme }) => ({
  display: 'grid',
  gap: 18,

  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'minmax(0, 1fr) auto',
    alignItems: 'flex-start',
  },
}))

export const HeaderContent = styled('div')({
  minWidth: 0,
})

export const HeaderActions = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 8,

  [theme.breakpoints.up('sm')]: {
    justifyContent: 'flex-end',
  },
}))

export const HeaderEyebrow = styled('p')(({ theme }) => ({
  color: (theme.vars || theme).palette.success.main,
  fontSize: 12,
  fontWeight: 700,
  lineHeight: '16px',
  textTransform: 'uppercase',
}))

export const HeaderTitle = styled('h1')(({ theme }) => ({
  marginTop: 8,
  overflowWrap: 'anywhere',
  color: (theme.vars || theme).palette.text.primary,
  fontSize: 24,
  fontWeight: 700,
  lineHeight: 1.18,

  [theme.breakpoints.up('md')]: {
    fontSize: 32,
  },
}))

export const HeaderSubtitle = styled('p')(({ theme }) => ({
  maxWidth: 720,
  marginTop: 10,
  overflowWrap: 'anywhere',
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 15,
  lineHeight: '24px',
}))

export const BackLink = styled(NextLink)(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    minHeight: 36,
    padding: '0 10px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    border: `1px solid ${palette.divider}`,
    borderRadius: 8,
    backgroundColor: palette.background.paper,
    color: palette.text.primary,
    fontSize: 14,
    fontWeight: 600,
    lineHeight: '20px',
    whiteSpace: 'nowrap',
    transition: 'background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease',

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

export const SettingsGrid = styled('div')({
  display: 'grid',
  gap: 18,
})

export const SettingsPanel = styled('section')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    minWidth: 0,
    padding: 20,
    display: 'grid',
    gap: 18,
    border: `1px solid ${palette.divider}`,
    borderRadius: 8,
    backgroundColor: palette.background.paper,
    boxShadow: `0 18px 36px ${theme.alpha(palette.primary.main, 0.06)}`,

    [theme.breakpoints.up('sm')]: {
      padding: 24,
    },
  }
})

export const SettingsPanelHeader = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: 12,

  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'minmax(0, 1fr) auto',
    alignItems: 'start',
  },
}))

export const SettingsTitleGroup = styled('div')({
  minWidth: 0,
})

export const SettingsTitle = styled('h2')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  color: (theme.vars || theme).palette.text.primary,
  fontSize: 20,
  fontWeight: 700,
  lineHeight: '26px',
}))

export const SettingsDescription = styled('p')(({ theme }) => ({
  maxWidth: 760,
  marginTop: 6,
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 14,
  lineHeight: '22px',
}))

export const FormGrid = styled('form')({
  display: 'grid',
  gap: 18,
})

export const TwoColumnGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: 16,

  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },
}))

export const FormActions = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column-reverse',
  gap: 10,

  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
}))

export const ActionButton = styled(Button)({
  minHeight: 40,
  gap: 8,
})

export const FeedbackMessage = styled('p', {
  shouldForwardProp: (prop) => prop !== '$tone',
})<FeedbackMessageProps>(({ $tone, theme }) => {
  const palette = (theme.vars || theme).palette
  const tones = {
    success: {
      backgroundColor: theme.alpha(palette.success.main, 0.08),
      borderColor: theme.alpha(palette.success.main, 0.24),
      color: palette.success.main,
    },
    danger: {
      backgroundColor: theme.alpha(palette.error.main, 0.08),
      borderColor: theme.alpha(palette.error.main, 0.22),
      color: palette.error.main,
    },
    info: {
      backgroundColor: palette.background.default,
      borderColor: palette.divider,
      color: palette.text.secondary,
    },
  }

  return {
    padding: '10px 12px',
    border: '1px solid',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    lineHeight: '20px',
    ...tones[$tone],
  }
})

export const InlineCode = styled('code')(({ theme }) => ({
  padding: '2px 6px',
  borderRadius: 6,
  backgroundColor: (theme.vars || theme).palette.muted.main,
  color: (theme.vars || theme).palette.text.primary,
  fontFamily:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  fontSize: '0.92em',
}))
