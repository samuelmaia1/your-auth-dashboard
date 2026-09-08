import { styled } from '@mui/material/styles'

import { Button } from '@components/ui/button/button'

type ToneProps = {
  $tone: 'success' | 'danger' | 'neutral' | 'info'
}

type LoadingBlockProps = {
  $height?: number
  $width?: number | string
}

export const SubscriptionRoot = styled('main')({
  width: '100%',
  maxWidth: 1180,
  margin: '0 auto',
  display: 'grid',
  gap: 28,
})

export const SubscriptionHeader = styled('header')(({ theme }) => ({
  display: 'grid',
  gap: 16,

  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'minmax(0, 1fr) auto',
    alignItems: 'flex-start',
  },
}))

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
    fontSize: 40,
  },
}))

export const HeaderSubtitle = styled('p')(({ theme }) => ({
  maxWidth: 680,
  marginTop: 10,
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 15,
  lineHeight: '24px',
}))

export const ViewPlansButton = styled(Button)(({ theme }) => ({
  gap: 8,
  justifySelf: 'start',

  [theme.breakpoints.up('sm')]: {
    justifySelf: 'end',
  },
}))

export const PlanPanel = styled('section')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    minWidth: 0,
    padding: 20,
    border: `1px solid ${theme.alpha(palette.accent.main, 0.42)}`,
    borderRadius: 8,
    backgroundColor: palette.background.paper,
    boxShadow: `0 18px 40px ${theme.alpha(palette.accent.main, 0.1)}`,
  }
})

export const PlanHeader = styled('div')({
  minWidth: 0,
  display: 'grid',
  gap: 12,
})

export const PlanTitleRow = styled('div')({
  minWidth: 0,
  display: 'flex',
  alignItems: 'center',
  gap: 12,
})

export const PlanIcon = styled('span')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    width: 44,
    height: 44,
    display: 'inline-flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: theme.alpha(palette.accent.main, 0.18),
    color: palette.success.main,
  }
})

export const PlanTitleContent = styled('div')({
  minWidth: 0,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 8,
})

export const PlanName = styled('h2')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
  fontSize: 24,
  fontWeight: 700,
  lineHeight: '30px',
}))

export const PlanDescription = styled('p')(({ theme }) => ({
  maxWidth: 720,
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 14,
  lineHeight: '24px',
}))

export const CurrentPlanBadge = styled('span')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    minHeight: 24,
    padding: '0 9px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: `1px solid ${theme.alpha(palette.success.main, 0.24)}`,
    borderRadius: 999,
    backgroundColor: theme.alpha(palette.success.main, 0.12),
    color: palette.success.main,
    fontSize: 12,
    fontWeight: 700,
    lineHeight: '16px',
    whiteSpace: 'nowrap',
  }
})

export const StatusBadge = styled('span', {
  shouldForwardProp: (prop) => prop !== '$tone',
})<ToneProps>(({ $tone, theme }) => {
  const palette = (theme.vars || theme).palette
  const tones = {
    success: {
      borderColor: theme.alpha(palette.success.main, 0.24),
      backgroundColor: theme.alpha(palette.success.main, 0.12),
      color: palette.success.main,
    },
    danger: {
      borderColor: theme.alpha(palette.error.main, 0.22),
      backgroundColor: theme.alpha(palette.error.main, 0.08),
      color: palette.error.main,
    },
    neutral: {
      borderColor: palette.divider,
      backgroundColor: palette.muted.main,
      color: palette.text.secondary,
    },
    info: {
      borderColor: theme.alpha(palette.primary.main, 0.14),
      backgroundColor: theme.alpha(palette.primary.main, 0.08),
      color: palette.text.primary,
    },
  }

  return {
    minHeight: 24,
    padding: '0 9px',
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

export const SubscriptionSection = styled('section')({
  minWidth: 0,
  display: 'grid',
  gap: 12,
})

export const SectionHeader = styled('div')({
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

export const DetailList = styled('section')(({ theme }) => ({
  display: 'grid',
  gap: 12,

  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },

  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  },
}))

export const DetailCard = styled('article')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    minHeight: 132,
    padding: 18,
    display: 'grid',
    alignContent: 'space-between',
    gap: 10,
    border: `1px solid ${palette.divider}`,
    borderRadius: 8,
    backgroundColor: palette.background.paper,
    boxShadow: `0 14px 30px ${theme.alpha(palette.primary.main, 0.05)}`,
  }
})

export const DetailIcon = styled('span', {
  shouldForwardProp: (prop) => prop !== '$tone',
})<ToneProps>(({ $tone, theme }) => {
  const palette = (theme.vars || theme).palette
  const tones = {
    success: {
      backgroundColor: theme.alpha(palette.accent.main, 0.14),
      color: palette.success.main,
    },
    danger: {
      backgroundColor: theme.alpha(palette.error.main, 0.1),
      color: palette.error.main,
    },
    neutral: {
      backgroundColor: palette.muted.main,
      color: palette.text.secondary,
    },
    info: {
      backgroundColor: theme.alpha(palette.primary.main, 0.08),
      color: palette.text.primary,
    },
  }

  return {
    width: 36,
    height: 36,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    ...tones[$tone],
  }
})

export const DetailLabel = styled('p')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 13,
  fontWeight: 600,
  lineHeight: '18px',
}))

export const DetailValue = styled('p')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
  fontSize: 17,
  fontWeight: 700,
  lineHeight: '24px',
}))

export const LimitList = styled('dl')(({ theme }) => ({
  margin: 0,
  display: 'grid',
  gap: 10,

  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  },
}))

export const LimitItem = styled('div')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    minHeight: 92,
    padding: 16,
    display: 'grid',
    alignContent: 'space-between',
    gap: 10,
    border: `1px solid ${palette.divider}`,
    borderRadius: 8,
    backgroundColor: palette.background.paper,
  }
})

export const LimitLabel = styled('dt')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 13,
  fontWeight: 600,
  lineHeight: '18px',
}))

export const LimitValue = styled('dd')(({ theme }) => ({
  margin: 0,
  color: (theme.vars || theme).palette.text.primary,
  fontSize: 22,
  fontWeight: 700,
  lineHeight: '28px',
}))

export const FeatureList = styled('ul')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    margin: 0,
    padding: 18,
    display: 'grid',
    gap: 10,
    border: `1px solid ${palette.divider}`,
    borderRadius: 8,
    backgroundColor: palette.background.paper,
    listStyle: 'none',
  }
})

export const FeatureItem = styled('li')(({ theme }) => ({
  minWidth: 0,
  display: 'grid',
  gridTemplateColumns: '16px minmax(0, 1fr)',
  alignItems: 'start',
  gap: 10,
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 14,
  lineHeight: '22px',

  '& svg': {
    marginTop: 3,
    color: (theme.vars || theme).palette.success.main,
  },
}))

export const FeatureEmptyItem = styled(FeatureItem)(({ theme }) => ({
  color: (theme.vars || theme).palette.text.secondary,

  '& svg': {
    color: (theme.vars || theme).palette.text.secondary,
  },
}))

export const EmptyDescription = styled('p')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 14,
  lineHeight: '22px',
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

export const LoadingBlock = styled('span', {
  shouldForwardProp: (prop) => prop !== '$height' && prop !== '$width',
})<LoadingBlockProps>(({ $height = 14, $width = '100%', theme }) => ({
  width: $width,
  maxWidth: '100%',
  height: $height,
  display: 'inline-flex',
  borderRadius: 999,
  backgroundColor: theme.alpha((theme.vars || theme).palette.primary.main, 0.1),
  animation: 'subscription-screen-loading 1.1s ease-in-out infinite',

  '@keyframes subscription-screen-loading': {
    '0%, 100%': {
      opacity: 0.48,
    },
    '50%': {
      opacity: 1,
    },
  },
}))
