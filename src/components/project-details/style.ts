import { styled } from '@mui/material/styles'
import NextLink from 'next/link'

import { Button } from '@components/ui/button/button'

type BadgeToneProps = {
  $tone: 'success' | 'danger' | 'neutral' | 'info'
}

type LoadingBlockProps = {
  $height?: number
  $width?: number | string
}

type TabButtonProps = {
  $active: boolean
}

export const ProjectDetailsRoot = styled('main')({
  width: '100%',
  maxWidth: 1180,
  margin: '0 auto',
  display: 'grid',
  gap: 28,
})

export const ProjectDetailsHeader = styled('header')(({ theme }) => ({
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

export const HeaderButton = styled(Button)({
  gap: 8,
})

export const ProjectOverview = styled('article')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    padding: 18,
    display: 'grid',
    gap: 18,
    border: `1px solid ${palette.divider}`,
    borderRadius: 8,
    backgroundColor: palette.background.paper,
    boxShadow: `0 18px 36px ${theme.alpha(palette.primary.main, 0.06)}`,
  }
})

export const OverviewTop = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: 14,

  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'minmax(0, 1fr) auto',
    alignItems: 'flex-start',
  },
}))

export const ProjectDescription = styled('p')(({ theme }) => ({
  overflowWrap: 'anywhere',
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 14,
  lineHeight: '22px',
}))

export const BadgeGroup = styled('div')({
  minWidth: 0,
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
})

export const Badge = styled('span', {
  shouldForwardProp: (prop) => prop !== '$tone',
})<BadgeToneProps>(({ $tone, theme }) => {
  const palette = (theme.vars || theme).palette
  const tones = {
    success: {
      backgroundColor: theme.alpha(palette.success.main, 0.12),
      color: palette.success.main,
      borderColor: theme.alpha(palette.success.main, 0.26),
    },
    danger: {
      backgroundColor: theme.alpha(palette.error.main, 0.1),
      color: palette.error.main,
      borderColor: theme.alpha(palette.error.main, 0.22),
    },
    neutral: {
      backgroundColor: palette.muted.main,
      color: palette.text.secondary,
      borderColor: palette.divider,
    },
    info: {
      backgroundColor: theme.alpha(palette.primary.main, 0.08),
      color: palette.text.primary,
      borderColor: theme.alpha(palette.primary.main, 0.14),
    },
  }

  return {
    minHeight: 28,
    maxWidth: '100%',
    padding: '0 10px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    lineHeight: '16px',
    overflowWrap: 'anywhere',
    ...tones[$tone],
  }
})

export const DetailsGrid = styled('dl')(({ theme }) => ({
  margin: 0,
  display: 'grid',
  gap: 10,

  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },

  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  },
}))

export const DetailItem = styled('div')(({ theme }) => ({
  minHeight: 72,
  padding: 14,
  display: 'grid',
  alignContent: 'center',
  gap: 4,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  borderRadius: 8,
  backgroundColor: (theme.vars || theme).palette.background.default,
}))

export const DetailLabel = styled('dt')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 12,
  fontWeight: 700,
  lineHeight: '16px',
}))

export const DetailValue = styled('dd')(({ theme }) => ({
  minWidth: 0,
  margin: 0,
  overflowWrap: 'anywhere',
  color: (theme.vars || theme).palette.text.primary,
  fontSize: 13,
  fontWeight: 700,
  lineHeight: '20px',
}))

export const TabsSection = styled('section')({
  display: 'grid',
  gap: 18,
})

export const TabList = styled('div')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    display: 'flex',
    gap: 4,
    overflowX: 'auto',
    borderBottom: `1px solid ${palette.divider}`,
    scrollbarWidth: 'thin',
  }
})

export const TabButton = styled('button', {
  shouldForwardProp: (prop) => prop !== '$active',
})<TabButtonProps>(({ $active, theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    minHeight: 44,
    padding: '0 12px',
    display: 'inline-flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    border: 0,
    borderBottom: '2px solid',
    borderBottomColor: $active ? palette.success.main : 'transparent',
    backgroundColor: $active ? theme.alpha(palette.accent.main, 0.1) : 'transparent',
    color: $active ? palette.text.primary : palette.text.secondary,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: $active ? 700 : 600,
    lineHeight: '20px',
    whiteSpace: 'nowrap',
    transition: 'background-color 150ms ease, border-color 150ms ease, color 150ms ease',

    '&:hover': {
      backgroundColor: $active ? theme.alpha(palette.accent.main, 0.14) : palette.muted.main,
      color: palette.text.primary,
    },

    '&:focus-visible': {
      outline: 'none',
      boxShadow: `inset 0 0 0 2px ${theme.alpha(palette.ring, 0.45)}`,
    },
  }
})

export const TabPanel = styled('div')({
  minWidth: 0,
  display: 'grid',
  gap: 16,
})

export const TabHeader = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: 10,

  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'minmax(0, 1fr) auto',
    alignItems: 'center',
  },
}))

export const SectionTitle = styled('h2')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
  fontSize: 18,
  fontWeight: 700,
  lineHeight: '24px',
}))

export const SectionSubtitle = styled('p')(({ theme }) => ({
  marginTop: 4,
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 13,
  fontWeight: 600,
  lineHeight: '20px',
}))

export const DataList = styled('div')({
  display: 'grid',
  gap: 10,
})

export const RecordCard = styled('article')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    minWidth: 0,
    padding: 16,
    display: 'grid',
    gap: 16,
    border: `1px solid ${palette.divider}`,
    borderRadius: 8,
    backgroundColor: palette.background.paper,

    [theme.breakpoints.up('lg')]: {
      gridTemplateColumns: 'minmax(0, 0.9fr) minmax(0, 1.35fr)',
      alignItems: 'center',
    },
  }
})

export const RecordMain = styled('div')({
  minWidth: 0,
})

export const RecordTitle = styled('h3')(({ theme }) => ({
  overflowWrap: 'anywhere',
  color: (theme.vars || theme).palette.text.primary,
  fontSize: 15,
  fontWeight: 700,
  lineHeight: '22px',
}))

export const RecordDescription = styled('p')(({ theme }) => ({
  marginTop: 4,
  overflowWrap: 'anywhere',
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 13,
  lineHeight: '20px',
}))

export const RecordDetails = styled('dl')(({ theme }) => ({
  margin: 0,
  display: 'grid',
  gap: 8,

  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },

  [theme.breakpoints.up('xl')]: {
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  },
}))

export const RecordDetail = styled('div')({
  minWidth: 0,
  display: 'grid',
  gap: 2,
})

export const RecordLabel = styled('dt')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 12,
  fontWeight: 700,
  lineHeight: '16px',
}))

export const RecordValue = styled('dd')(({ theme }) => ({
  minWidth: 0,
  margin: 0,
  overflowWrap: 'anywhere',
  color: (theme.vars || theme).palette.text.primary,
  fontSize: 13,
  fontWeight: 650,
  lineHeight: '20px',
}))

export const InlineBadgeGroup = styled('div')({
  minWidth: 0,
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6,
})

export const ConfigGrid = styled('dl')(({ theme }) => ({
  margin: 0,
  display: 'grid',
  gap: 10,

  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },

  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  },
}))

export const ConfigItem = styled('div')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    minHeight: 86,
    padding: 16,
    display: 'grid',
    alignContent: 'center',
    gap: 6,
    border: `1px solid ${palette.divider}`,
    borderRadius: 8,
    backgroundColor: palette.background.paper,
  }
})

export const ConfigLabel = styled('dt')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 12,
  fontWeight: 700,
  lineHeight: '16px',
}))

export const ConfigValue = styled('dd')(({ theme }) => ({
  minWidth: 0,
  margin: 0,
  overflowWrap: 'anywhere',
  color: (theme.vars || theme).palette.text.primary,
  fontSize: 18,
  fontWeight: 700,
  lineHeight: '24px',
}))

export const PaginationBar = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: 12,

  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'minmax(0, 1fr) auto',
    alignItems: 'center',
  },
}))

export const PaginationSummary = styled('p')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 13,
  fontWeight: 600,
  lineHeight: '20px',
}))

export const PaginationActions = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 8,
})

export const PaginationButton = styled(Button)({
  gap: 6,
})

export const PageIndicator = styled('span')(({ theme }) => ({
  minHeight: 28,
  padding: '0 10px',
  display: 'inline-flex',
  alignItems: 'center',
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  borderRadius: 8,
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 12,
  fontWeight: 700,
  lineHeight: '16px',
  whiteSpace: 'nowrap',
}))

export const ErrorMessage = styled('div')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    padding: 16,
    border: `1px solid ${theme.alpha(palette.error.main, 0.22)}`,
    borderRadius: 8,
    backgroundColor: theme.alpha(palette.error.main, 0.08),
    color: palette.error.main,
    fontSize: 14,
    fontWeight: 600,
    lineHeight: '22px',
  }
})

export const ErrorActions = styled('div')({
  marginTop: 14,
})

export const RetryButton = styled(Button)({
  gap: 8,
})

export const EmptyState = styled('div')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    padding: 24,
    border: `1px solid ${palette.divider}`,
    borderRadius: 8,
    backgroundColor: palette.background.paper,
  }
})

export const EmptyDescription = styled('p')(({ theme }) => ({
  marginTop: 6,
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 14,
  lineHeight: '22px',
}))

export const LoadingBlock = styled('span', {
  shouldForwardProp: (prop) => prop !== '$height' && prop !== '$width',
})<LoadingBlockProps>(({ $height = 14, $width = '100%', theme }) => ({
  width: $width,
  maxWidth: '100%',
  height: $height,
  display: 'inline-flex',
  borderRadius: 999,
  backgroundColor: theme.alpha((theme.vars || theme).palette.primary.main, 0.1),
  animation: 'project-details-loading 1.1s ease-in-out infinite',

  '@keyframes project-details-loading': {
    '0%, 100%': {
      opacity: 0.48,
    },
    '50%': {
      opacity: 1,
    },
  },
}))
