import { styled } from '@mui/material/styles'

const monoFontFamily =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'

export const Main = styled('main')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    minHeight: '100vh',
    overflow: 'hidden',
    backgroundColor: palette.background.default,
    color: palette.text.primary,
  }
})

export const Navigation = styled('nav')(({ theme }) => ({
  width: '100%',
  maxWidth: 1152,
  margin: '0 auto',
  padding: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  [theme.breakpoints.up('lg')]: {
    paddingLeft: 32,
    paddingRight: 32,
  },
}))

export const LogoAnchor = styled('a')({
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
  letterSpacing: '-0.04em',
})

export const DesktopNavigation = styled('div')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    display: 'none',
    alignItems: 'center',
    gap: 32,
    color: palette.text.secondary,
    fontSize: 14,
    lineHeight: '20px',

    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  }
})

export const NavigationLink = styled('a')(({ theme }) => ({
  transition: 'color 150ms ease',

  '&:hover': {
    color: (theme.vars || theme).palette.text.primary,
  },
}))

export const DesktopActions = styled('div')(({ theme }) => ({
  display: 'none',
  alignItems: 'center',
  gap: 12,

  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}))

export const ContactLink = styled('a')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    padding: '8px 16px',
    borderRadius: theme.shape.borderRadius,
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

export const PrimaryLink = styled('a')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    padding: '8px 16px',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: palette.primary.main,
    color: palette.primary.contrastText,
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '20px',
    transition: 'transform 150ms ease',

    '&:hover': {
      transform: 'translateY(-2px)',
    },
  }
})

export const MobileMenuButton = styled('button')(({ theme }) => ({
  padding: 8,
  display: 'inline-flex',
  border: 0,
  borderRadius: 8,
  background: 'transparent',
  color: 'inherit',
  cursor: 'pointer',

  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}))

export const MobileMenu = styled('div')(({ theme }) => ({
  margin: '0 24px',
  padding: '20px 0',
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  borderTop: `1px solid ${(theme.vars || theme).palette.divider}`,
  fontSize: 14,
  lineHeight: '20px',

  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}))

export const MobileSignupLink = styled('a')(({ theme }) => ({
  color: (theme.vars || theme).palette.primary.main,
  fontWeight: 500,
  display: 'flex',
  alignItems: 'center',
  gap: 4,
}))

export const HeroSection = styled('section')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: 1152,
  margin: '0 auto',
  padding: '80px 24px 96px',
  display: 'grid',
  gap: 64,

  [theme.breakpoints.up('lg')]: {
    padding: '112px 32px 128px',
    gridTemplateColumns: '1.05fr 0.95fr',
    alignItems: 'center',
  },
}))

export const HeroCopy = styled('div')({
  position: 'relative',
  zIndex: 10,
})

export const Eyebrow = styled('div')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    marginBottom: 28,
    padding: '6px 12px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    border: `1px solid ${palette.divider}`,
    borderRadius: 9999,
    backgroundColor: palette.background.paper,
    color: palette.text.secondary,
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    fontFamily: monoFontFamily,
    fontSize: 11,
    lineHeight: 1.5,
  }
})

export const StatusDot = styled('span')(({ theme }) => ({
  width: 6,
  height: 6,
  borderRadius: '50%',
  backgroundColor: (theme.vars || theme).palette.accent.main,
}))

export const HeroTitle = styled('h1')(({ theme }) => ({
  maxWidth: 768,
  color: (theme.vars || theme).palette.text.primary,
  fontSize: 48,
  fontWeight: 600,
  lineHeight: 1,
  letterSpacing: '-0.065em',
  textWrap: 'balance',

  [theme.breakpoints.up('sm')]: {
    fontSize: 60,
  },

  [theme.breakpoints.up('lg')]: {
    fontSize: 72,
  },
}))

export const HeroTitleAccent = styled('span')(({ theme }) => ({
  color: (theme.vars || theme).palette.primary.main,
}))

export const HeroDescription = styled('p')(({ theme }) => ({
  maxWidth: 576,
  marginTop: 28,
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 18,
  lineHeight: '32px',
  textWrap: 'pretty',
}))

export const HeroActions = styled('div')(({ theme }) => ({
  marginTop: 36,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,

  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
  },
}))

export const HeroPrimaryLink = styled('a')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    padding: '12px 20px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: palette.primary.main,
    color: palette.primary.contrastText,
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '20px',
    transition: 'transform 150ms ease',

    '& svg': {
      transition: 'transform 150ms ease',
    },

    '&:hover': {
      transform: 'translateY(-2px)',

      '& svg': {
        transform: 'translateX(4px)',
      },
    },
  }
})

export const HeroSecondaryLink = styled('a')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    padding: '12px 20px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    border: `1px solid ${palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: palette.background.paper,
    color: palette.text.primary,
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '20px',
    transition: 'background-color 150ms ease',

    '&:hover': {
      backgroundColor: palette.muted.main,
    },
  }
})

export const HeroFootnotes = styled('div')(({ theme }) => ({
  marginTop: 36,
  display: 'flex',
  alignItems: 'center',
  gap: 24,
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 12,
  lineHeight: '16px',
}))

export const HeroFootnote = styled('span')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  '& svg': { color: (theme.vars || theme).palette.accent.main },
}))

export const HeroVisual = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: 448,
  margin: '0 auto',

  [theme.breakpoints.up('lg')]: {
    maxWidth: 'none',
  },
}))

export const HeroGlow = styled('div')(({ theme }) => ({
  position: 'absolute',
  inset: -40,
  background: `radial-gradient(circle at center, ${(theme.vars || theme).palette.glow}, transparent 65%)`,
}))

export const CodeCard = styled('div')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    position: 'relative',
    overflow: 'hidden',
    border: `1px solid ${palette.divider}`,
    borderRadius: 18,
    backgroundColor: palette.background.paper,
    boxShadow: `0 25px 50px -12px ${theme.alpha(palette.primary.main, 0.1)}`,
  }
})

export const CodeHeader = styled('div')(({ theme }) => ({
  padding: '16px 20px',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
}))

export const WindowDot = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: (theme.vars || theme).palette.divider,
}))

export const CodeTitle = styled('span')(({ theme }) => ({
  marginLeft: 12,
  color: (theme.vars || theme).palette.text.secondary,
  fontFamily: monoFontFamily,
  fontSize: 10,
}))

export const CodeContent = styled('div')({
  padding: 24,
  fontFamily: monoFontFamily,
  fontSize: 12,
  lineHeight: 7 / 3,
})

export const CodeMuted = styled('div')(({ theme }) => ({
  color: (theme.vars || theme).palette.text.secondary,
}))

export const CodeLine = styled('div', {
  shouldForwardProp: (prop) => prop !== 'indent' && prop !== 'spaced',
})<{ indent?: number; spaced?: boolean }>(({ indent = 0, spaced = false }) => ({
  marginTop: spaced ? 16 : 0,
  paddingLeft: indent,
}))

export const AccentCode = styled('span')(({ theme }) => ({
  color: (theme.vars || theme).palette.accent.main,
}))

export const PrimaryCode = styled('span')(({ theme }) => ({
  color: (theme.vars || theme).palette.primary.main,
}))

export const BenefitsSection = styled('section')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    borderTop: `1px solid ${palette.divider}`,
    borderBottom: `1px solid ${palette.divider}`,
    backgroundColor: palette.background.paper,
  }
})

export const BenefitsGrid = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 1152,
  margin: '0 auto',
  display: 'grid',
  gap: 1,
  backgroundColor: (theme.vars || theme).palette.divider,

  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  },
}))

export const BenefitsHeading = styled('div')(({ theme }) => ({
  padding: 32,
  backgroundColor: (theme.vars || theme).palette.background.paper,

  [theme.breakpoints.up('md')]: {
    gridColumn: 'span 3 / span 3',
  },

  [theme.breakpoints.up('lg')]: {
    padding: 40,
  },
}))

export const SectionEyebrow = styled('p')(({ theme }) => ({
  color: (theme.vars || theme).palette.accent.main,
  fontFamily: monoFontFamily,
  fontSize: 12,
  lineHeight: '16px',
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
}))

export const SectionTitle = styled('h2')(({ theme }) => ({
  maxWidth: 576,
  marginTop: 12,
  fontSize: 30,
  fontWeight: 600,
  lineHeight: 1.2,
  letterSpacing: '-0.04em',

  [theme.breakpoints.up('sm')]: {
    fontSize: 36,
    lineHeight: '40px',
  },
}))

export const BenefitArticle = styled('article')(({ theme }) => ({
  padding: 32,
  backgroundColor: (theme.vars || theme).palette.background.paper,

  '& > svg': {
    color: (theme.vars || theme).palette.primary.main,
  },

  [theme.breakpoints.up('lg')]: {
    padding: 40,
  },
}))

export const BenefitTitle = styled('h3')({
  marginTop: 24,
  fontSize: 18,
  fontWeight: 600,
  lineHeight: '28px',
})

export const BenefitText = styled('p')(({ theme }) => ({
  marginTop: 12,
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 14,
  lineHeight: 24 / 14,
}))

export const SecuritySection = styled('section')(({ theme }) => ({
  width: '100%',
  maxWidth: 1152,
  margin: '0 auto',
  padding: '96px 24px',
  display: 'grid',
  gap: 56,

  [theme.breakpoints.up('lg')]: {
    padding: '128px 32px',
    gridTemplateColumns: '0.8fr 1.2fr',
  },
}))

export const SecurityTitle = styled(SectionTitle)({
  marginTop: 16,
})

export const SecurityText = styled('p')(({ theme }) => ({
  maxWidth: 448,
  marginTop: 20,
  color: (theme.vars || theme).palette.text.secondary,
  lineHeight: 7 / 4,
}))

export const CapabilityList = styled('div')(({ theme }) => ({
  borderTop: `1px solid ${(theme.vars || theme).palette.divider}`,
  borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
}))

export const CapabilityItem = styled('div')(({ theme }) => ({
  padding: '24px 0',
  display: 'grid',
  gap: 16,

  '& + &': {
    borderTop: `1px solid ${(theme.vars || theme).palette.divider}`,
  },

  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: '48px 1fr',
    gap: 24,
  },
}))

export const CapabilityNumber = styled('span')(({ theme }) => ({
  color: (theme.vars || theme).palette.accent.main,
  fontFamily: monoFontFamily,
  fontSize: 12,
  lineHeight: '16px',
}))

export const CapabilityTitle = styled('h3')({
  fontSize: 16,
  fontWeight: 600,
  lineHeight: '24px',
})

export const CapabilityText = styled('p')(({ theme }) => ({
  marginTop: 8,
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 14,
  lineHeight: 24 / 14,
}))

export const CallToAction = styled('section')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    margin: '0 24px 64px',
    padding: '56px 24px',
    overflow: 'hidden',
    borderRadius: 18,
    backgroundColor: palette.primary.main,
    color: palette.primary.contrastText,

    [theme.breakpoints.up('sm')]: {
      paddingLeft: 48,
      paddingRight: 48,
    },

    [theme.breakpoints.up('lg')]: {
      maxWidth: 1152,
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingTop: 64,
      paddingBottom: 64,
    },
  }
})

export const CallToActionInner = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 32,

  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}))

export const CallToActionEyebrow = styled('p')(({ theme }) => ({
  color: theme.alpha((theme.vars || theme).palette.primary.contrastText, 0.6),
  fontFamily: monoFontFamily,
  fontSize: 12,
  lineHeight: '16px',
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
}))

export const CallToActionTitle = styled('h2')({
  maxWidth: 512,
  marginTop: 12,
  fontSize: 30,
  fontWeight: 600,
  lineHeight: 1.2,
  letterSpacing: '-0.04em',
  textWrap: 'balance',
})

export const CallToActionLink = styled('a')(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    padding: '12px 20px',
    display: 'inline-flex',
    flexShrink: 0,
    alignItems: 'center',
    gap: 8,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: palette.background.paper,
    color: palette.text.primary,
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '20px',
    transition: 'transform 150ms ease',

    '&:hover': {
      transform: 'translateY(-2px)',
    },
  }
})

export const Footer = styled('footer')(({ theme }) => ({
  width: '100%',
  maxWidth: 1152,
  margin: '0 auto',
  padding: '32px 24px',
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  borderTop: `1px solid ${(theme.vars || theme).palette.divider}`,
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: 12,
  lineHeight: '16px',

  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  [theme.breakpoints.up('lg')]: {
    paddingLeft: 32,
    paddingRight: 32,
  },
}))

export const FooterStatus = styled('span')({
  fontFamily: monoFontFamily,
})

export const FooterStatusValue = styled('span')(({ theme }) => ({
  color: (theme.vars || theme).palette.accent.main,
}))
