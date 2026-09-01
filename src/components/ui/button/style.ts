import { Button as MuiButton } from '@mui/material'
import { styled } from '@mui/material/styles'
import type { CSSProperties } from 'react'

export type ButtonVariant = 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link'

export type ButtonSize = 'default' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg'

type StyledButtonProps = {
  buttonSize: ButtonSize
  visualVariant: ButtonVariant
}

const sizeStyles: Record<ButtonSize, CSSProperties> = {
  default: { height: 32, gap: 6, padding: '0 10px' },
  xs: { height: 24, gap: 4, padding: '0 8px', fontSize: 12 },
  sm: { height: 28, gap: 4, padding: '0 10px', fontSize: '0.8rem' },
  lg: { height: 36, gap: 6, padding: '0 10px' },
  icon: { width: 32, height: 32, padding: 0 },
  'icon-xs': { width: 24, height: 24, padding: 0 },
  'icon-sm': { width: 28, height: 28, padding: 0 },
  'icon-lg': { width: 36, height: 36, padding: 0 },
}

export const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) => prop !== 'buttonSize' && prop !== 'visualVariant',
})<StyledButtonProps>(({ buttonSize, theme, visualVariant }) => {
  const palette = (theme.vars || theme).palette
  const visualStyles: Record<ButtonVariant, CSSProperties> = {
    default: {
      backgroundColor: palette.primary.main,
      color: palette.primary.contrastText,
    },
    outline: {
      backgroundColor: palette.background.default,
      borderColor: palette.divider,
      color: palette.text.primary,
    },
    secondary: {
      backgroundColor: palette.secondary.main,
      color: palette.secondary.contrastText,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: palette.text.primary,
    },
    destructive: {
      backgroundColor: theme.alpha(palette.error.main, 0.1),
      color: palette.error.main,
    },
    link: {
      backgroundColor: 'transparent',
      color: palette.primary.main,
      textDecorationColor: 'currentColor',
      textUnderlineOffset: 4,
    },
  }
  const hoverStyles: Record<ButtonVariant, CSSProperties> = {
    default: { backgroundColor: theme.alpha(palette.primary.main, 0.8) },
    outline: { backgroundColor: palette.muted.main, color: palette.text.primary },
    secondary: { backgroundColor: theme.alpha(palette.secondary.main, 0.8) },
    ghost: { backgroundColor: palette.muted.main, color: palette.text.primary },
    destructive: { backgroundColor: theme.alpha(palette.error.main, 0.2) },
    link: { backgroundColor: 'transparent', textDecoration: 'underline' },
  }

  return {
    ...sizeStyles[buttonSize],
    ...visualStyles[visualVariant],
    minWidth: 0,
    flexShrink: 0,
    border: '1px solid transparent',
    borderRadius: theme.shape.borderRadius,
    backgroundClip: 'padding-box',
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '20px',
    whiteSpace: 'nowrap',
    transition:
      'background-color 150ms ease, border-color 150ms ease, color 150ms ease, box-shadow 150ms ease, transform 150ms ease',
    outline: 'none',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',

    '& svg': {
      width: 16,
      height: 16,
      flexShrink: 0,
      pointerEvents: 'none',
    },

    '&:hover': hoverStyles[visualVariant],

    '&:focus-visible': {
      borderColor: palette.ring,
      boxShadow: `0 0 0 3px ${theme.alpha(palette.ring, 0.5)}`,
    },

    '&:active:not([aria-haspopup="true"])': {
      transform: 'translateY(1px)',
    },

    '&.Mui-disabled': {
      backgroundColor: visualStyles[visualVariant].backgroundColor,
      color: visualStyles[visualVariant].color,
      opacity: 0.5,
      pointerEvents: 'none',
    },
  }
})
