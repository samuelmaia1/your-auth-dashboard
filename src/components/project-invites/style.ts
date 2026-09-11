import { styled } from '@mui/material/styles'

import { Button } from '@components/ui/button/button'

export const InviteTriggerButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== '$context',
})<{ $context: 'default' | 'settings' }>(({ $context }) => ({
  minHeight: $context === 'settings' ? 40 : undefined,
  gap: 8,
}))

export const InviteSearchContent = styled('div')({
  display: 'grid',
  gap: 16,
})

export const SearchStatus = styled('p', {
  shouldForwardProp: (prop) => prop !== '$tone',
})<{ $tone?: 'default' | 'danger' | 'success' }>(({ $tone = 'default', theme }) => {
  const palette = (theme.vars || theme).palette
  const colorByTone = {
    default: palette.text.secondary,
    danger: palette.error.main,
    success: palette.success.main,
  }

  return {
    color: colorByTone[$tone],
    fontSize: 13,
    fontWeight: $tone === 'default' ? 500 : 650,
    lineHeight: '20px',
  }
})

export const AccountResultButton = styled('button')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    width: '100%',
    padding: 14,
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) auto',
    alignItems: 'center',
    gap: 12,
    border: `1px solid ${palette.divider}`,
    borderRadius: 8,
    backgroundColor: palette.background.paper,
    color: palette.text.primary,
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease',

    '&:hover': {
      borderColor: theme.alpha(palette.success.main, 0.44),
      backgroundColor: theme.alpha(palette.accent.main, 0.08),
    },

    '&:focus-visible': {
      outline: 'none',
      borderColor: palette.ring,
      boxShadow: `0 0 0 3px ${theme.alpha(palette.ring, 0.32)}`,
    },

    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.54,
    },
  }
})

export const AccountResultMain = styled('span')({
  minWidth: 0,
  display: 'grid',
  gap: 2,
})

export const AccountResultName = styled('strong')({
  overflow: 'hidden',
  fontSize: 14,
  lineHeight: '20px',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const AccountResultEmail = styled('span')(({ theme }) => ({
  overflow: 'hidden',
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 13,
  lineHeight: '18px',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}))

export const ConfirmationCard = styled('div')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    padding: 16,
    display: 'grid',
    gap: 8,
    border: `1px solid ${palette.divider}`,
    borderRadius: 8,
    backgroundColor: palette.background.default,
  }
})

export const ConfirmationTitle = styled('h3')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
  fontSize: 15,
  fontWeight: 700,
  lineHeight: '22px',
}))

export const ConfirmationText = styled('p')(({ theme }) => ({
  overflowWrap: 'anywhere',
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 14,
  lineHeight: '22px',
}))

export const RoleField = styled('label')({
  display: 'grid',
  gap: 7,
})

export const RoleLabel = styled('span')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
  fontSize: 13,
  fontWeight: 700,
  lineHeight: '18px',
}))

export const RoleSelect = styled('select')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    width: '100%',
    minHeight: 44,
    padding: '0 12px',
    border: `1px solid ${palette.input}`,
    borderRadius: 8,
    backgroundColor: palette.background.paper,
    color: palette.text.primary,
    colorScheme: theme.palette.mode,
    cursor: 'pointer',
    fontSize: 14,
    lineHeight: '20px',
    outline: 'none',
    transition: 'background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease',

    '&:hover': {
      borderColor: palette.divider,
      backgroundColor: palette.background.default,
    },

    '&:focus': {
      borderColor: palette.ring,
      boxShadow: `0 0 0 3px ${theme.alpha(palette.ring, 0.32)}`,
    },

    '&:disabled': {
      backgroundColor: palette.muted.main,
      color: palette.text.secondary,
      cursor: 'not-allowed',
      opacity: 0.7,
    },
  }
})

export const ModalActions = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column-reverse',
  gap: 10,

  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
}))

export const LoadingSpinner = styled('span')({
  display: 'inline-flex',
  animation: 'invite-loading-spin 850ms linear infinite',

  '@keyframes invite-loading-spin': {
    to: {
      transform: 'rotate(360deg)',
    },
  },
})

export const InboxTrigger = styled(Button)({
  position: 'relative',
  overflow: 'visible',
})

export const NotificationBadge = styled('span')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    position: 'absolute',
    top: -8,
    right: -8,
    minWidth: 20,
    height: 20,
    padding: '0 5px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: `2px solid ${palette.background.default}`,
    borderRadius: 999,
    backgroundColor: palette.error.main,
    color: palette.error.contrastText,
    fontSize: 10,
    fontWeight: 800,
    lineHeight: 1,
  }
})

export const InboxContent = styled('div')({
  display: 'grid',
  gap: 14,
})

export const InboxList = styled('div')({
  maxHeight: 'min(56vh, 520px)',
  display: 'grid',
  gap: 10,
  overflowY: 'auto',
  scrollbarWidth: 'thin',
})

export const InviteCard = styled('article')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    padding: 14,
    display: 'grid',
    gap: 12,
    border: `1px solid ${palette.divider}`,
    borderRadius: 8,
    backgroundColor: palette.background.paper,
  }
})

export const InviteProjectName = styled('h3')(({ theme }) => ({
  overflowWrap: 'anywhere',
  color: (theme.vars || theme).palette.text.primary,
  fontSize: 15,
  fontWeight: 700,
  lineHeight: '21px',
}))

export const InviteDescription = styled('p')(({ theme }) => ({
  marginTop: 3,
  overflowWrap: 'anywhere',
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 13,
  lineHeight: '19px',
}))

export const InviteMeta = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 8,
})

export const InviteRoleBadge = styled('span')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    minHeight: 24,
    padding: '0 8px',
    display: 'inline-flex',
    alignItems: 'center',
    border: `1px solid ${theme.alpha(palette.success.main, 0.24)}`,
    borderRadius: 999,
    backgroundColor: theme.alpha(palette.accent.main, 0.1),
    color: palette.success.main,
    fontSize: 11,
    fontWeight: 750,
    lineHeight: '16px',
  }
})

export const InviteDate = styled('span')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 12,
  fontWeight: 600,
  lineHeight: '18px',
}))

export const InviteActions = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 8,
})

export const InviteActionButton = styled(Button)({
  width: '100%',
  gap: 6,
})

export const EmptyInbox = styled('div')(({ theme }) => ({
  padding: '28px 18px',
  display: 'grid',
  justifyItems: 'center',
  gap: 8,
  border: `1px dashed ${(theme.vars || theme).palette.divider}`,
  borderRadius: 8,
  color: (theme.vars || theme).palette.text.secondary,
  textAlign: 'center',
}))

export const EmptyInboxTitle = styled('h3')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
  fontSize: 15,
  fontWeight: 700,
  lineHeight: '22px',
}))

export const EmptyInboxText = styled('p')({
  fontSize: 13,
  lineHeight: '20px',
})
