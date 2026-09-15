import { styled } from '@mui/material/styles'
import NextLink from 'next/link'

type CalloutProps = {
  $tone?: 'info' | 'warning'
}

type StepNavLinkProps = {
  $disabled?: boolean
}

type StatusCodeProps = {
  $tone: 'success' | 'error'
}

const monoFontFamily =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'

export const DocumentationRoot = styled('main')({
  width: '100%',
  maxWidth: 1120,
  margin: '0 auto',
  display: 'grid',
  gap: 34,
})

export const DocumentationHeader = styled('header')({
  display: 'grid',
  gap: 10,
})

export const DocumentationEyebrow = styled('p')(({ theme }) => ({
  color: (theme.vars || theme).palette.success.main,
  fontSize: 12,
  fontWeight: 800,
  lineHeight: '16px',
  textTransform: 'uppercase',
}))

export const DocumentationTitle = styled('h1')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
  fontSize: 30,
  fontWeight: 800,
  lineHeight: 1.14,

  [theme.breakpoints.up('md')]: {
    fontSize: 40,
  },
}))

export const DocumentationDescription = styled('p')(({ theme }) => ({
  maxWidth: 760,
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 16,
  lineHeight: '26px',
}))

export const DocumentationMeta = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 8,
  color: (theme.vars || theme).palette.text.secondary,
  fontFamily: monoFontFamily,
  fontSize: 12,
  lineHeight: '18px',
}))

export const MetaPill = styled('span')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    minHeight: 26,
    padding: '3px 8px',
    display: 'inline-flex',
    alignItems: 'center',
    border: `1px solid ${palette.divider}`,
    borderRadius: 8,
    backgroundColor: palette.background.paper,
    color: palette.text.secondary,
  }
})

export const DocumentationContent = styled('div')({
  display: 'grid',
  gap: 30,
})

export const DocSection = styled('section')(({ theme }) => ({
  minWidth: 0,
  paddingBottom: 30,
  display: 'grid',
  gap: 16,
  borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,

  '&:last-of-type': {
    borderBottom: 0,
    paddingBottom: 0,
  },
}))

export const SectionHeading = styled('div')({
  display: 'grid',
  gap: 8,
})

export const SectionTitle = styled('h2')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
  fontSize: 22,
  fontWeight: 760,
  lineHeight: '28px',
}))

export const SectionSubtitle = styled('p')(({ theme }) => ({
  maxWidth: 760,
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 15,
  lineHeight: '24px',
}))

export const Subsection = styled('div')({
  display: 'grid',
  gap: 10,
})

export const SubsectionTitle = styled('h3')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
  fontSize: 16,
  fontWeight: 740,
  lineHeight: '22px',
}))

export const Paragraph = styled('p')(({ theme }) => ({
  maxWidth: 820,
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 15,
  lineHeight: '25px',
}))

export const InlineLink = styled(NextLink)(({ theme }) => ({
  color: (theme.vars || theme).palette.success.main,
  fontWeight: 700,
  textDecoration: 'underline',
  textUnderlineOffset: 4,
}))

export const OrderedList = styled('ol')(({ theme }) => ({
  margin: 0,
  paddingLeft: 22,
  display: 'grid',
  gap: 10,
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 15,
  lineHeight: '24px',

  '& li::marker': {
    color: (theme.vars || theme).palette.success.main,
    fontWeight: 800,
  },
}))

export const UnorderedList = styled('ul')(({ theme }) => ({
  margin: 0,
  paddingLeft: 20,
  display: 'grid',
  gap: 8,
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 15,
  lineHeight: '24px',

  '& li::marker': {
    color: (theme.vars || theme).palette.success.main,
  },
}))

export const FieldGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: 10,

  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },
}))

export const FieldItem = styled('article')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    minWidth: 0,
    padding: 14,
    display: 'grid',
    gap: 6,
    border: `1px solid ${palette.divider}`,
    borderRadius: 8,
    backgroundColor: palette.background.paper,
  }
})

export const FieldName = styled('h3')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
  fontFamily: monoFontFamily,
  fontSize: 13,
  fontWeight: 760,
  lineHeight: '20px',
  overflowWrap: 'anywhere',
}))

export const FieldDescription = styled('p')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 14,
  lineHeight: '22px',
}))

export const Callout = styled('aside', {
  shouldForwardProp: (prop) => prop !== '$tone',
})<CalloutProps>(({ $tone = 'info', theme }) => {
  const palette = (theme.vars || theme).palette
  const isWarning = $tone === 'warning'
  const toneColor = isWarning ? palette.error.main : palette.success.main

  return {
    padding: 16,
    display: 'grid',
    gap: 8,
    border: `1px solid ${theme.alpha(toneColor, isWarning ? 0.28 : 0.34)}`,
    borderRadius: 8,
    backgroundColor: theme.alpha(toneColor, isWarning ? 0.08 : 0.1),
    color: palette.text.primary,
  }
})

export const CalloutTitle = styled('p')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
  fontSize: 14,
  fontWeight: 760,
  lineHeight: '20px',
}))

export const CalloutText = styled('p')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 14,
  lineHeight: '22px',
}))

export const EndpointSummary = styled('div')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    minWidth: 0,
    padding: 14,
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
    border: `1px solid ${palette.divider}`,
    borderRadius: 8,
    backgroundColor: palette.background.paper,
  }
})

export const MethodBadge = styled('span')(({ theme }) => ({
  minHeight: 26,
  padding: '3px 8px',
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: 8,
  backgroundColor: (theme.vars || theme).palette.primary.main,
  color: (theme.vars || theme).palette.primary.contrastText,
  fontFamily: monoFontFamily,
  fontSize: 12,
  fontWeight: 800,
  lineHeight: '18px',
}))

export const EndpointPath = styled('code')(({ theme }) => ({
  minWidth: 0,
  color: (theme.vars || theme).palette.text.primary,
  fontFamily: monoFontFamily,
  fontSize: 14,
  fontWeight: 700,
  lineHeight: '20px',
  overflowWrap: 'anywhere',
}))

export const CodePanel = styled('figure')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    minWidth: 0,
    margin: 0,
    overflow: 'hidden',
    border: `1px solid ${palette.divider}`,
    borderRadius: 8,
    backgroundColor: 'oklch(0.22 0.035 255)',
    color: 'oklch(0.97 0.01 90)',
  }
})

export const CodeHeader = styled('figcaption')({
  minHeight: 34,
  padding: '8px 12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  borderBottom: '1px solid oklch(1 0 0 / 12%)',
  color: 'oklch(0.82 0.025 90)',
  fontFamily: monoFontFamily,
  fontSize: 12,
  lineHeight: '18px',
})

export const Pre = styled('pre')({
  margin: 0,
  padding: 16,
  overflowX: 'auto',
  fontFamily: monoFontFamily,
  fontSize: 13,
  lineHeight: '21px',
  tabSize: 2,

  '& code': {
    font: 'inherit',
  },
})

export const StatusTable = styled('div')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    overflow: 'hidden',
    border: `1px solid ${palette.divider}`,
    borderRadius: 8,
    backgroundColor: palette.background.paper,
  }
})

export const StatusRow = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: 8,
  padding: 12,
  borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,

  '&:last-of-type': {
    borderBottom: 0,
  },

  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: '96px minmax(0, 1fr)',
    alignItems: 'start',
  },
}))

export const StatusCode = styled('code', {
  shouldForwardProp: (prop) => prop !== '$tone',
})<StatusCodeProps>(({ $tone, theme }) => {
  const palette = (theme.vars || theme).palette
  const toneColor = $tone === 'error' ? palette.error.main : palette.success.main

  return {
    width: 62,
    minHeight: 28,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: theme.alpha(toneColor, 0.12),
    color: $tone === 'error' ? palette.error.main : palette.text.primary,
    boxShadow: $tone === 'error' ? `inset 0 0 0 1px ${theme.alpha(toneColor, 0.28)}` : 'none',
    fontFamily: monoFontFamily,
    fontSize: 13,
    fontWeight: 800,
    lineHeight: '18px',
  }
})

export const StatusDescription = styled('p')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 14,
  lineHeight: '22px',
}))

export const StepNavigation = styled('nav')(({ theme }) => ({
  display: 'grid',
  gap: 12,

  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },
}))

export const StepNavLink = styled(NextLink, {
  shouldForwardProp: (prop) => prop !== '$disabled',
})<StepNavLinkProps>(({ $disabled, theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    minHeight: 74,
    padding: 14,
    display: 'grid',
    gap: 4,
    border: `1px solid ${palette.divider}`,
    borderRadius: 8,
    backgroundColor: palette.background.paper,
    color: palette.text.primary,
    opacity: $disabled ? 0.45 : 1,
    pointerEvents: $disabled ? 'none' : 'auto',
    transition: 'background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease',

    '&:hover': {
      borderColor: theme.alpha(palette.accent.main, 0.42),
      backgroundColor: palette.muted.main,
    },

    '&:focus-visible': {
      outline: 'none',
      borderColor: palette.ring,
      boxShadow: `0 0 0 3px ${theme.alpha(palette.ring, 0.32)}`,
    },
  }
})

export const StepNavKicker = styled('span')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 12,
  fontWeight: 760,
  lineHeight: '16px',
  textTransform: 'uppercase',
}))

export const StepNavTitle = styled('span')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
  fontSize: 15,
  fontWeight: 760,
  lineHeight: '22px',
}))
