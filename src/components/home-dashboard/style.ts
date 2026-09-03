import { styled } from '@mui/material/styles'

import { Button } from '@components/ui/button/button'

type LoadingBlockProps = {
  $height?: number
  $width?: number | string
}

type ProjectBadgeProps = {
  $tone: 'success' | 'danger' | 'neutral' | 'info'
}

export const HomeRoot = styled('main')({
  width: '100%',
  maxWidth: 1180,
  margin: '0 auto',
  display: 'grid',
  gap: 28,
})

export const HomeHeader = styled('header')({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 20,
})

export const HeaderContent = styled('div')({
  minWidth: 0,
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
  color: (theme.vars || theme).palette.text.primary,
  fontSize: 24,
  fontWeight: 700,
  lineHeight: 1.18,

  [theme.breakpoints.up('md')]: {
    fontSize: 28,
  },
}))

export const HeaderSubtitle = styled('p')(({ theme }) => ({
  maxWidth: 620,
  marginTop: 10,
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 15,
  lineHeight: '24px',
}))

export const MetricsGrid = styled('section')(({ theme }) => ({
  display: 'grid',
  gap: 12,

  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  },
}))

export const MetricCard = styled('article')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    minHeight: 132,
    padding: 18,
    display: 'grid',
    alignContent: 'space-between',
    gap: 12,
    border: `1px solid ${palette.divider}`,
    borderRadius: 8,
    backgroundColor: palette.background.paper,
    boxShadow: `0 18px 36px ${theme.alpha(palette.primary.main, 0.06)}`,
  }
})

export const MetricIcon = styled('span')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    width: 36,
    height: 36,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: theme.alpha(palette.accent.main, 0.14),
    color: palette.success.main,
  }
})

export const MetricLabel = styled('p')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 13,
  fontWeight: 600,
  lineHeight: '18px',
}))

export const MetricValue = styled('p')(({ theme }) => ({
  minHeight: 40,
  display: 'flex',
  alignItems: 'center',
  color: (theme.vars || theme).palette.text.primary,
  fontSize: 34,
  fontWeight: 700,
  lineHeight: '40px',
}))

export const ProjectsHeader = styled('div')({
  marginBottom: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
})

export const SectionTitle = styled('h2')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
  fontSize: 18,
  fontWeight: 700,
  lineHeight: '24px',
}))

export const ProjectList = styled('div')({
  display: 'grid',
  gap: 10,
})

export const ProjectCard = styled('article')(({ theme }) => {
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
      gridTemplateColumns: 'minmax(0, 1.15fr) minmax(260px, 0.9fr) minmax(176px, auto)',
      alignItems: 'center',
    },
  }
})

export const ProjectMain = styled('div')({
  minWidth: 0,
})

export const ProjectTitle = styled('h3')(({ theme }) => ({
  overflow: 'hidden',
  color: (theme.vars || theme).palette.text.primary,
  fontSize: 15,
  fontWeight: 700,
  lineHeight: '22px',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}))

export const ProjectDescription = styled('p')(({ theme }) => ({
  marginTop: 4,
  overflow: 'hidden',
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 13,
  lineHeight: '20px',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}))

export const ProjectBadges = styled('div')({
  minWidth: 0,
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
})

export const ProjectBadge = styled('span', {
  shouldForwardProp: (prop) => prop !== '$tone',
})<ProjectBadgeProps>(({ $tone, theme }) => {
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
    padding: '0 10px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    lineHeight: '16px',
    whiteSpace: 'nowrap',
    ...tones[$tone],
  }
})

export const ProjectStats = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 8,

  [theme.breakpoints.up('lg')]: {
    minWidth: 176,
  },
}))

export const ProjectStat = styled('div')(({ theme }) => {
  return {
    minHeight: 58,
    padding: '4px 0',
    display: 'grid',
    alignContent: 'center',
    gap: 2,

    [theme.breakpoints.up('lg')]: {
      justifyItems: 'end',
      textAlign: 'right',
    },
  }
})

export const ProjectStatValue = styled('p')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
  fontSize: 18,
  fontWeight: 700,
  lineHeight: '24px',
}))

export const ProjectStatLabel = styled('p')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 12,
  fontWeight: 600,
  lineHeight: '16px',
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
  animation: 'home-dashboard-loading 1.1s ease-in-out infinite',

  '@keyframes home-dashboard-loading': {
    '0%, 100%': {
      opacity: 0.48,
    },
    '50%': {
      opacity: 1,
    },
  },
}))
