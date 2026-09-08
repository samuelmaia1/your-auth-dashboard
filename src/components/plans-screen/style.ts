import { styled } from '@mui/material/styles'

import { Button } from '@components/ui/button/button'

type CurrentProps = {
  $current: boolean
}

export const PlansRoot = styled('main')({
  width: '100%',
  maxWidth: 1180,
  margin: '0 auto',
  display: 'grid',
  gap: 28,
})

export const PlansHeader = styled('header')({
  display: 'grid',
  gap: 16,
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
    fontSize: 40,
  },
}))

export const HeaderSubtitle = styled('p')(({ theme }) => ({
  maxWidth: 640,
  marginTop: 10,
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 15,
  lineHeight: '24px',
}))

export const CarouselSection = styled('section')({
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

export const PlanCard = styled('article', {
  shouldForwardProp: (prop) => prop !== '$current',
})<CurrentProps>(({ $current, theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    position: 'relative',
    width: '100%',
    minHeight: 506,
    padding: 18,
    display: 'grid',
    gap: 18,
    alignContent: 'start',
    border: `1px solid ${$current ? theme.alpha(palette.accent.main, 0.72) : palette.divider}`,
    borderRadius: 8,
    backgroundColor: palette.background.paper,
    boxShadow: $current
      ? `0 18px 40px ${theme.alpha(palette.accent.main, 0.16)}`
      : `0 14px 30px ${theme.alpha(palette.primary.main, 0.05)}`,
    transition: 'border-color 220ms ease, box-shadow 220ms ease, transform 280ms ease',

    '&::before': {
      position: 'absolute',
      top: -1,
      right: -1,
      left: -1,
      height: 3,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      backgroundColor: $current ? palette.success.main : 'transparent',
      content: '""',
    },
  }
})

export const EmptyState = styled('div')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    width: '100%',
    minHeight: 148,
    padding: 24,
    display: 'grid',
    alignContent: 'center',
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

export const PlanHeader = styled('div')({
  minWidth: 0,
  display: 'grid',
  gap: 14,
})

export const PlanTitleRow = styled('div')({
  minWidth: 0,
  display: 'flex',
  alignItems: 'center',
  gap: 12,
})

export const PlanIcon = styled('span', {
  shouldForwardProp: (prop) => prop !== '$current',
})<CurrentProps>(({ $current, theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    width: 40,
    height: 40,
    display: 'inline-flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: $current
      ? theme.alpha(palette.accent.main, 0.18)
      : theme.alpha(palette.primary.main, 0.08),
    color: $current ? palette.success.main : palette.text.primary,
  }
})

export const PlanTitleContent = styled('div')({
  minWidth: 0,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 8,
})

export const PlanName = styled('h3')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
  fontSize: 20,
  fontWeight: 700,
  lineHeight: '26px',
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

export const PlanDescription = styled('p')(({ theme }) => ({
  minHeight: 48,
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 14,
  lineHeight: '24px',
}))

export const PlanStatusBadge = styled('span')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    minHeight: 24,
    padding: '0 9px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: `1px solid ${theme.alpha(palette.error.main, 0.18)}`,
    borderRadius: 999,
    backgroundColor: theme.alpha(palette.error.main, 0.08),
    color: palette.error.main,
    fontSize: 12,
    fontWeight: 700,
    lineHeight: '16px',
    whiteSpace: 'nowrap',
  }
})

export const PlanSection = styled('div')({
  minWidth: 0,
  display: 'grid',
  gap: 10,
})

export const PlanSectionTitle = styled('h4')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
  fontSize: 13,
  fontWeight: 700,
  lineHeight: '18px',
}))

export const LimitList = styled('dl')(({ theme }) => ({
  margin: 0,
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 8,

  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, minmax(132px, 1fr))',
  },
}))

export const LimitItem = styled('div')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    minHeight: 76,
    padding: 12,
    display: 'grid',
    alignContent: 'space-between',
    gap: 8,
    border: `1px solid ${palette.divider}`,
    borderRadius: 8,
    backgroundColor: theme.alpha(palette.muted.main, 0.55),
  }
})

export const LimitLabel = styled('dt')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 12,
  fontWeight: 600,
  lineHeight: '16px',
}))

export const LimitValue = styled('dd')(({ theme }) => ({
  margin: 0,
  overflowWrap: 'anywhere',
  color: (theme.vars || theme).palette.text.primary,
  fontSize: 16,
  fontWeight: 700,
  lineHeight: '22px',
}))

export const FeatureList = styled('ul')({
  margin: 0,
  padding: 0,
  display: 'grid',
  gap: 10,
  listStyle: 'none',
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

export const LoadingBlock = styled('span', {
  shouldForwardProp: (prop) => prop !== '$height' && prop !== '$width',
})<{ $height?: number; $width?: number | string }>(({ $height = 14, $width = '100%', theme }) => ({
  width: $width,
  maxWidth: '100%',
  height: $height,
  display: 'inline-flex',
  borderRadius: 999,
  backgroundColor: theme.alpha((theme.vars || theme).palette.primary.main, 0.1),
  animation: 'plans-screen-loading 1.1s ease-in-out infinite',

  '@keyframes plans-screen-loading': {
    '0%, 100%': {
      opacity: 0.48,
    },
    '50%': {
      opacity: 1,
    },
  },
}))
