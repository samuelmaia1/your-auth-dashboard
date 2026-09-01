import { createTheme, type PaletteOptions } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Palette {
    accent: Palette['primary']
    muted: Palette['primary']
    input: string
    ring: string
    glow: string
  }

  interface PaletteOptions {
    accent?: PaletteOptions['primary']
    muted?: PaletteOptions['primary']
    input?: string
    ring?: string
    glow?: string
  }
}

const lightPalette: PaletteOptions = {
  mode: 'light',
  background: {
    default: 'oklch(0.985 0.008 90)',
    paper: 'oklch(1 0 0)',
  },
  text: {
    primary: 'oklch(0.19 0.025 255)',
    secondary: 'oklch(0.49 0.035 255)',
  },
  primary: {
    main: 'oklch(0.24 0.055 255)',
    contrastText: 'oklch(0.985 0.008 90)',
  },
  secondary: {
    main: 'oklch(0.94 0.018 90)',
    contrastText: 'oklch(0.24 0.055 255)',
  },
  accent: {
    main: 'oklch(0.69 0.14 158)',
    contrastText: 'oklch(0.2 0.04 158)',
  },
  muted: {
    main: 'oklch(0.95 0.012 90)',
    contrastText: 'oklch(0.49 0.035 255)',
  },
  success: {
    main: 'oklch(0.6 0.15 154)',
    contrastText: 'oklch(0.985 0.008 90)',
  },
  error: {
    main: 'oklch(0.577 0.245 27.325)',
  },
  divider: 'oklch(0.88 0.02 255)',
  input: 'oklch(0.88 0.02 255)',
  ring: 'oklch(0.55 0.08 255)',
  glow: 'oklch(0.69 0.14 158 / 18%)',
}

const darkPalette: PaletteOptions = {
  mode: 'dark',
  background: {
    default: 'oklch(0.145 0 0)',
    paper: 'oklch(0.205 0 0)',
  },
  text: {
    primary: 'oklch(0.985 0 0)',
    secondary: 'oklch(0.708 0 0)',
  },
  primary: {
    main: 'oklch(0.922 0 0)',
    contrastText: 'oklch(0.205 0 0)',
  },
  secondary: {
    main: 'oklch(0.269 0 0)',
    contrastText: 'oklch(0.985 0 0)',
  },
  accent: {
    main: 'oklch(0.269 0 0)',
    contrastText: 'oklch(0.985 0 0)',
  },
  muted: {
    main: 'oklch(0.269 0 0)',
    contrastText: 'oklch(0.708 0 0)',
  },
  success: {
    main: 'oklch(0.76 0.15 154)',
    contrastText: 'oklch(0.145 0 0)',
  },
  error: {
    main: 'oklch(0.704 0.191 22.216)',
  },
  divider: 'oklch(1 0 0 / 10%)',
  input: 'oklch(1 0 0 / 15%)',
  ring: 'oklch(0.556 0 0)',
  glow: 'oklch(0.69 0.14 158 / 18%)',
}

export const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'media',
    nativeColor: true,
  },
  colorSchemes: {
    light: { palette: lightPalette },
    dark: { palette: darkPalette },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily:
      'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    fontSize: 14,
    body1: {
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (currentTheme) => {
        const palette = (currentTheme.vars || currentTheme).palette

        return {
          html: {
            scrollBehavior: 'smooth',
          },
          body: {
            margin: 0,
            backgroundColor: palette.background.default,
            color: palette.text.primary,
            lineHeight: 1.5,
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
          },
          '*, *::before, *::after': {
            boxSizing: 'border-box',
          },
          'h1, h2, h3, p': {
            margin: 0,
          },
          a: {
            color: 'inherit',
            textDecoration: 'none',
          },
          button: {
            font: 'inherit',
          },
          '@media (prefers-reduced-motion: reduce)': {
            html: {
              scrollBehavior: 'auto',
            },
          },
        }
      },
    },
  },
})
