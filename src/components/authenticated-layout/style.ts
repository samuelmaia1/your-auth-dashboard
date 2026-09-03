import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import NextLink from 'next/link'

const drawerWidth = 280
const monoFontFamily =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'

export const AuthenticatedRoot = styled('div')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    minHeight: '100vh',
    display: 'flex',
    backgroundColor: palette.background.default,
    color: palette.text.primary,
  }
})

export const DesktopDrawer = styled(Drawer)(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    width: drawerWidth,
    flexShrink: 0,
    display: 'none',

    [theme.breakpoints.up('md')]: {
      display: 'block',
    },

    '& .MuiDrawer-paper': {
      width: drawerWidth,
      borderRight: `1px solid ${palette.divider}`,
      backgroundColor: palette.background.paper,
      color: palette.text.primary,
    },
  }
})

export const MobileDrawer = styled(Drawer)(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },

    '& .MuiDrawer-paper': {
      width: 'min(82vw, 280px)',
      borderRight: `1px solid ${palette.divider}`,
      backgroundColor: palette.background.paper,
      color: palette.text.primary,
    },
  }
})

export const DrawerBody = styled('div')({
  height: '100%',
  padding: '20px 14px 16px',
  display: 'flex',
  flexDirection: 'column',
})

export const DrawerHeader = styled('header')({
  minHeight: 48,
  padding: '0 4px 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
})

export const DrawerLogo = styled(NextLink)({
  minWidth: 0,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 10,
})

export const DrawerLogoMark = styled('span')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    width: 32,
    height: 32,
    display: 'flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: palette.primary.main,
    color: palette.primary.contrastText,
  }
})

export const DrawerLogoText = styled('span')({
  overflow: 'hidden',
  color: 'inherit',
  fontFamily: monoFontFamily,
  fontSize: 15,
  fontWeight: 600,
  lineHeight: '20px',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const DrawerNavigation = styled('nav')({
  paddingTop: 10,
})

export const DrawerFooter = styled('nav')(({ theme }) => ({
  marginTop: 'auto',
  paddingTop: 16,
  borderTop: `1px solid ${(theme.vars || theme).palette.divider}`,
}))

export const DrawerSection = styled('div')({
  display: 'grid',
  gap: 4,
})

export const NavItem = styled(NextLink, {
  shouldForwardProp: (prop) => prop !== '$active',
})<{ $active: boolean }>(({ $active, theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    minHeight: 42,
    padding: '0 10px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    borderRadius: 8,
    backgroundColor: $active ? theme.alpha(palette.accent.main, 0.14) : 'transparent',
    color: $active ? palette.text.primary : palette.text.secondary,
    boxShadow: $active ? `inset 0 0 0 1px ${theme.alpha(palette.accent.main, 0.28)}` : 'none',
    fontSize: 14,
    fontWeight: $active ? 600 : 500,
    lineHeight: '20px',
    transition: 'background-color 150ms ease, box-shadow 150ms ease, color 150ms ease',

    '&:hover': {
      backgroundColor: $active ? theme.alpha(palette.accent.main, 0.18) : palette.muted.main,
      color: palette.text.primary,
    },

    '&:focus-visible': {
      outline: 'none',
      boxShadow: `0 0 0 3px ${theme.alpha(palette.ring, 0.32)}`,
    },
  }
})

export const NavItemIcon = styled('span', {
  shouldForwardProp: (prop) => prop !== '$active',
})<{ $active: boolean }>(({ $active, theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    width: 28,
    height: 28,
    display: 'inline-flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: $active ? theme.alpha(palette.accent.main, 0.2) : 'transparent',
    color: $active ? palette.success.main : 'inherit',
    transition: 'background-color 150ms ease, color 150ms ease',
  }
})

export const MobileMenuButton = styled(IconButton)(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    position: 'fixed',
    top: 16,
    left: 16,
    zIndex: theme.zIndex.appBar,
    width: 40,
    height: 40,
    border: `1px solid ${palette.divider}`,
    borderRadius: 8,
    backgroundColor: palette.background.paper,
    color: palette.text.primary,
    boxShadow: `0 18px 40px ${theme.alpha(palette.primary.main, 0.12)}`,

    '&:hover': {
      backgroundColor: palette.muted.main,
    },

    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  }
})

export const MobileCloseButton = styled(IconButton)(({ theme }) => ({
  width: 36,
  height: 36,
  borderRadius: 8,
  color: (theme.vars || theme).palette.text.secondary,

  '&:hover': {
    backgroundColor: (theme.vars || theme).palette.muted.main,
    color: (theme.vars || theme).palette.text.primary,
  },

  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}))

export const AuthenticatedContent = styled('div')(({ theme }) => ({
  width: '100%',
  minWidth: 0,
  minHeight: '100vh',
  padding: '88px 20px 32px',

  [theme.breakpoints.up('sm')]: {
    paddingLeft: 28,
    paddingRight: 28,
  },

  [theme.breakpoints.up('md')]: {
    flex: 1,
    padding: '40px 48px',
  },
}))
