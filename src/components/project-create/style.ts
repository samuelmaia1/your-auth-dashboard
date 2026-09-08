import Switch from '@mui/material/Switch'
import { styled } from '@mui/material/styles'
import NextLink from 'next/link'

import { Button } from '@components/ui/button/button'

export type StepStatus = 'active' | 'complete' | 'pending'

type StepItemProps = {
  $status: StepStatus
}

type FieldHelperProps = {
  $error?: boolean
}

type ScopeOptionProps = {
  $checked: boolean
}

const monoFontFamily =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'

export const ProjectCreateRoot = styled('main')({
  width: '100%',
  maxWidth: 1180,
  margin: '0 auto',
  display: 'grid',
  gap: 28,
})

export const ProjectCreateHeader = styled('header')(({ theme }) => ({
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

export const WizardLayout = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: 18,

  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: '280px minmax(0, 1fr)',
    alignItems: 'start',
  },
}))

export const StepsPanel = styled('aside')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    padding: 16,
    border: `1px solid ${palette.divider}`,
    borderRadius: 8,
    backgroundColor: palette.background.paper,
    boxShadow: `0 18px 36px ${theme.alpha(palette.primary.main, 0.06)}`,
  }
})

export const StepList = styled('ol')({
  margin: 0,
  padding: 0,
  display: 'grid',
  gap: 8,
  listStyle: 'none',
})

export const StepItem = styled('li', {
  shouldForwardProp: (prop) => prop !== '$status',
})<StepItemProps>(({ $status, theme }) => {
  const palette = (theme.vars || theme).palette
  const statusStyles = {
    active: {
      borderColor: theme.alpha(palette.success.main, 0.5),
      backgroundColor: theme.alpha(palette.accent.main, 0.12),
      color: palette.text.primary,
    },
    complete: {
      borderColor: theme.alpha(palette.success.main, 0.32),
      backgroundColor: theme.alpha(palette.success.main, 0.08),
      color: palette.text.primary,
    },
    pending: {
      borderColor: palette.divider,
      backgroundColor: palette.background.default,
      color: palette.text.secondary,
    },
  }

  return {
    minHeight: 58,
    padding: 10,
    display: 'grid',
    gridTemplateColumns: '32px minmax(0, 1fr)',
    alignItems: 'center',
    gap: 10,
    border: '1px solid',
    borderRadius: 8,
    transition: 'background-color 150ms ease, border-color 150ms ease, color 150ms ease',
    ...statusStyles[$status],
  }
})

export const StepIcon = styled('span', {
  shouldForwardProp: (prop) => prop !== '$status',
})<StepItemProps>(({ $status, theme }) => {
  const palette = (theme.vars || theme).palette
  const statusStyles = {
    active: {
      backgroundColor: palette.primary.main,
      color: palette.primary.contrastText,
    },
    complete: {
      backgroundColor: palette.success.main,
      color: palette.success.contrastText,
    },
    pending: {
      backgroundColor: palette.muted.main,
      color: palette.text.secondary,
    },
  }

  return {
    width: 32,
    height: 32,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    ...statusStyles[$status],
  }
})

export const StepCopy = styled('div')({
  minWidth: 0,
})

export const StepTitle = styled('p')({
  overflow: 'hidden',
  fontSize: 13,
  fontWeight: 700,
  lineHeight: '18px',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const StepMeta = styled('p')(({ theme }) => ({
  marginTop: 2,
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 12,
  lineHeight: '16px',
}))

export const FormPanel = styled('section')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    minWidth: 0,
    padding: 20,
    border: `1px solid ${palette.divider}`,
    borderRadius: 8,
    backgroundColor: palette.background.paper,
    boxShadow: `0 18px 36px ${theme.alpha(palette.primary.main, 0.06)}`,

    [theme.breakpoints.up('sm')]: {
      padding: 24,
    },
  }
})

export const FormHeading = styled('div')({
  display: 'grid',
  gap: 8,
})

export const FormStepMeta = styled('p')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.secondary,
  fontFamily: monoFontFamily,
  fontSize: 12,
  lineHeight: '16px',
  textTransform: 'uppercase',
  letterSpacing: 0,
}))

export const FormTitle = styled('h2')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
  fontSize: 22,
  fontWeight: 700,
  lineHeight: '28px',

  [theme.breakpoints.up('md')]: {
    fontSize: 26,
    lineHeight: '32px',
  },
}))

export const FormDescription = styled('p')(({ theme }) => ({
  maxWidth: 680,
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 14,
  lineHeight: '22px',
}))

export const FormAlert = styled('p')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    marginTop: 18,
    padding: '10px 12px',
    border: `1px solid ${theme.alpha(palette.error.main, 0.22)}`,
    borderRadius: 8,
    backgroundColor: theme.alpha(palette.error.main, 0.08),
    color: palette.error.main,
    fontSize: 13,
    fontWeight: 600,
    lineHeight: '20px',
  }
})

export const FormStack = styled('div')({
  marginTop: 22,
  display: 'grid',
  gap: 18,
})

export const StepPanel = styled('div')({
  minWidth: 0,
})

export const TwoColumnGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: 16,

  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },
}))

export const FieldGroup = styled('fieldset')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    minWidth: 0,
    margin: 0,
    padding: 14,
    display: 'grid',
    gap: 14,
    border: `1px solid ${palette.divider}`,
    borderRadius: 8,
    backgroundColor: palette.background.default,
  }
})

export const FieldGroupTitle = styled('legend')(({ theme }) => ({
  padding: '0 6px',
  color: (theme.vars || theme).palette.text.primary,
  fontSize: 13,
  fontWeight: 700,
  lineHeight: '20px',
}))

export const FieldContainer = styled('div')({
  minWidth: 0,
  display: 'grid',
  gap: 8,
})

export const FieldLabel = styled('label')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
  fontSize: 14,
  fontWeight: 500,
  lineHeight: '20px',
}))

export const StyledSelect = styled('select')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    width: '100%',
    minHeight: 48,
    padding: '0 40px 0 14px',
    border: `1px solid ${palette.input}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: palette.background.paper,
    color: palette.text.primary,
    boxShadow: '0 1px 2px rgb(15 23 42 / 0.04)',
    font: 'inherit',
    fontSize: 14,
    lineHeight: '20px',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    transition:
      'border-color 160ms ease, background-color 160ms ease, box-shadow 160ms ease, color 160ms ease',

    '&:hover': {
      backgroundColor: palette.background.default,
      borderColor: palette.divider,
    },

    '&:focus-visible': {
      borderColor: palette.ring,
      boxShadow: `0 0 0 3px ${theme.alpha(palette.ring, 0.32)}, 0 1px 2px rgb(15 23 42 / 0.04)`,
    },

    '&[aria-invalid="true"]': {
      borderColor: palette.error.main,
      boxShadow: `0 0 0 3px ${theme.alpha(palette.error.main, 0.16)}, 0 1px 2px rgb(15 23 42 / 0.04)`,
    },
  }
})

export const FieldHelper = styled('p', {
  shouldForwardProp: (prop) => prop !== '$error',
})<FieldHelperProps>(({ $error = false, theme }) => ({
  color: $error
    ? (theme.vars || theme).palette.error.main
    : (theme.vars || theme).palette.text.secondary,
  fontSize: 12,
  lineHeight: '18px',
}))

export const SwitchGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: 10,

  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },
}))

export const SwitchRow = styled('label')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    minHeight: 76,
    padding: 12,
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) auto',
    alignItems: 'center',
    gap: 14,
    border: `1px solid ${palette.divider}`,
    borderRadius: 8,
    backgroundColor: palette.background.paper,
    cursor: 'pointer',
    transition: 'border-color 150ms ease, background-color 150ms ease, box-shadow 150ms ease',

    '&:hover': {
      borderColor: theme.alpha(palette.success.main, 0.36),
      backgroundColor: palette.background.default,
    },

    '&:has(input:focus-visible)': {
      borderColor: palette.ring,
      boxShadow: `0 0 0 3px ${theme.alpha(palette.ring, 0.28)}`,
    },
  }
})

export const SwitchText = styled('span')({
  minWidth: 0,
})

export const SwitchLabel = styled('span')(({ theme }) => ({
  display: 'block',
  color: (theme.vars || theme).palette.text.primary,
  fontSize: 13,
  fontWeight: 700,
  lineHeight: '18px',
}))

export const SwitchDescription = styled('span')(({ theme }) => ({
  display: 'block',
  marginTop: 4,
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 12,
  lineHeight: '16px',
}))

export const StyledSwitch = styled(Switch)(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    width: 46,
    height: 28,
    padding: 0,
    overflow: 'visible',

    '& .MuiSwitch-switchBase': {
      padding: 2,
      transition: 'transform 150ms ease',

      '&.Mui-checked': {
        transform: 'translateX(18px)',
        color: palette.success.contrastText,

        '& + .MuiSwitch-track': {
          borderColor: theme.alpha(palette.success.main, 0.45),
          backgroundColor: palette.success.main,
          opacity: 1,
        },
      },

      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.45,
      },
    },

    '& .MuiSwitch-thumb': {
      width: 24,
      height: 24,
      boxShadow: `0 2px 6px ${theme.alpha(palette.primary.main, 0.18)}`,
    },

    '& .MuiSwitch-track': {
      border: `1px solid ${palette.divider}`,
      borderRadius: 999,
      backgroundColor: palette.input,
      opacity: 1,
      transition: 'background-color 150ms ease, border-color 150ms ease',
    },
  }
})

export const ScopeGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: 10,

  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },
}))

export const ScopeOption = styled('label', {
  shouldForwardProp: (prop) => prop !== '$checked',
})<ScopeOptionProps>(({ $checked, theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    minHeight: 82,
    padding: 12,
    display: 'grid',
    gridTemplateColumns: '28px minmax(0, 1fr)',
    alignItems: 'center',
    gap: 10,
    border: '1px solid',
    borderColor: $checked ? theme.alpha(palette.success.main, 0.5) : palette.divider,
    borderRadius: 8,
    backgroundColor: $checked ? theme.alpha(palette.success.main, 0.08) : palette.background.paper,
    cursor: 'pointer',
    transition: 'background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease',

    '&:hover': {
      borderColor: theme.alpha(palette.success.main, 0.42),
      backgroundColor: $checked
        ? theme.alpha(palette.success.main, 0.1)
        : palette.background.default,
    },

    '&:has(input:focus-visible)': {
      borderColor: palette.ring,
      boxShadow: `0 0 0 3px ${theme.alpha(palette.ring, 0.28)}`,
    },
  }
})

export const ScopeCheckbox = styled('input')({
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
})

export const ScopeCheck = styled('span', {
  shouldForwardProp: (prop) => prop !== '$checked',
})<ScopeOptionProps>(({ $checked, theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    width: 28,
    height: 28,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid',
    borderColor: $checked ? palette.success.main : palette.divider,
    borderRadius: 8,
    backgroundColor: $checked ? palette.success.main : palette.background.default,
    color: $checked ? palette.success.contrastText : 'transparent',
  }
})

export const ScopeCopy = styled('span')({
  minWidth: 0,
})

export const ScopeTitle = styled('span')(({ theme }) => ({
  display: 'block',
  color: (theme.vars || theme).palette.text.primary,
  fontSize: 13,
  fontWeight: 700,
  lineHeight: '18px',
}))

export const ScopeDescription = styled('span')(({ theme }) => ({
  display: 'block',
  marginTop: 4,
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 12,
  lineHeight: '16px',
}))

export const ActionGrid = styled('div')(({ theme }) => ({
  marginTop: 6,
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
})

export const SubmitLoadingIcon = styled('span')({
  display: 'inline-flex',

  '@keyframes project-create-spin': {
    to: {
      transform: 'rotate(360deg)',
    },
  },

  '& svg': {
    animation: 'project-create-spin 850ms linear infinite',
  },
})

export const SuccessPanel = styled('section')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    maxWidth: 820,
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

export const SuccessIcon = styled('span')(({ theme }) => ({
  width: 46,
  height: 46,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 8,
  backgroundColor: theme.alpha((theme.vars || theme).palette.success.main, 0.14),
  color: (theme.vars || theme).palette.success.main,
}))

export const SuccessTitle = styled('h2')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
  fontSize: 24,
  fontWeight: 700,
  lineHeight: '30px',
}))

export const SuccessDescription = styled('p')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 14,
  lineHeight: '22px',
}))

export const ApiKeyBox = styled('div')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    minWidth: 0,
    padding: 14,
    display: 'grid',
    gap: 10,
    border: `1px solid ${palette.divider}`,
    borderRadius: 8,
    backgroundColor: palette.background.default,
  }
})

export const ApiKeyLabel = styled('p')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.secondary,
  fontFamily: monoFontFamily,
  fontSize: 12,
  fontWeight: 700,
  lineHeight: '16px',
  textTransform: 'uppercase',
  letterSpacing: 0,
}))

export const ApiKeyCode = styled('code')(({ theme }) => ({
  minWidth: 0,
  padding: 12,
  display: 'block',
  overflowWrap: 'anywhere',
  borderRadius: 8,
  backgroundColor: (theme.vars || theme).palette.primary.main,
  color: (theme.vars || theme).palette.primary.contrastText,
  fontFamily: monoFontFamily,
  fontSize: 13,
  lineHeight: '20px',
}))

export const SuccessActions = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 10,

  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
  },
}))

export const SuccessButton = styled(FormButton)({
  flex: 1,
})
