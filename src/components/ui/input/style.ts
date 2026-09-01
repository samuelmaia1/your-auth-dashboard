import { TextField } from '@mui/material'
import { styled } from '@mui/material/styles'

export const StyledTextField = styled(TextField)(({ theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    width: '100%',
    WebkitTapHighlightColor: 'transparent',

    '& .MuiInputLabel-root': {
      color: palette.text.primary,
      marginBottom: 8,
      position: 'relative',
      transform: 'none',
      fontSize: 14,
      fontWeight: 500,
      lineHeight: 1.4,

      '&.Mui-focused': {
        color: palette.text.primary,
      },

      '&.Mui-error': {
        color: palette.error.main,
      },

      '&.Mui-disabled': {
        color: palette.text.secondary,
      },
    },

    '& .MuiOutlinedInput-root': {
      minHeight: 48,
      borderRadius: theme.shape.borderRadius,
      backgroundColor: palette.background.paper,
      color: palette.text.primary,
      boxShadow: '0 1px 2px rgb(15 23 42 / 0.04)',
      transition:
        'border-color 160ms ease, background-color 160ms ease, box-shadow 160ms ease, color 160ms ease',

      '& fieldset': {
        top: 0,
        borderColor: palette.input,
        transition: 'border-color 160ms ease',
      },

      '& legend': {
        display: 'none',
      },

      '&:hover': {
        backgroundColor: palette.background.default,
      },

      '&:hover fieldset': {
        borderColor: palette.divider,
      },

      '&.Mui-focused': {
        boxShadow: `0 0 0 3px ${theme.alpha(palette.ring, 0.32)}, 0 1px 2px rgb(15 23 42 / 0.04)`,
      },

      '&.Mui-focused fieldset': {
        borderColor: palette.ring,
        borderWidth: 1,
      },

      '&.Mui-error': {
        boxShadow: `0 0 0 3px ${theme.alpha(palette.error.main, 0.16)}, 0 1px 2px rgb(15 23 42 / 0.04)`,
      },

      '&.Mui-error fieldset, &.Mui-error:hover fieldset, &.Mui-error.Mui-focused fieldset': {
        borderColor: palette.error.main,
      },

      '&.Mui-disabled': {
        backgroundColor: palette.muted.main,
        color: palette.text.secondary,
        boxShadow: 'none',
        cursor: 'not-allowed',
      },

      '&.Mui-disabled fieldset': {
        borderColor: palette.divider,
      },
    },

    '& .MuiInputBase-input': {
      padding: '13px 16px',
      fontSize: 14,
      lineHeight: '20px',
      color: palette.text.primary,
      caretColor: palette.accent.main,
      outline: 'none',

      '&::placeholder': {
        color: palette.text.secondary,
        opacity: 1,
      },

      '&.Mui-disabled': {
        color: palette.text.secondary,
        WebkitTextFillColor: palette.text.secondary,
        cursor: 'not-allowed',
      },
    },

    '& .MuiInputBase-adornedEnd .MuiInputBase-input': {
      paddingRight: 8,
    },

    '& .MuiInputAdornment-root': {
      marginRight: 6,
    },

    '& .MuiIconButton-root': {
      color: palette.text.secondary,
      borderRadius: `calc(${theme.shape.borderRadius}px * 0.8)`,
      WebkitTapHighlightColor: 'transparent',
      transition: 'background-color 160ms ease, color 160ms ease',

      '&:hover': {
        backgroundColor: palette.muted.main,
        color: palette.text.primary,
      },

      '&:focus-visible': {
        outline: 'none',
        boxShadow: `0 0 0 3px ${theme.alpha(palette.ring, 0.32)}`,
      },

      '&.Mui-disabled': {
        color: theme.alpha(palette.text.secondary, 0.45),
      },
    },

    '& .MuiFormHelperText-root': {
      marginLeft: 0,
      marginTop: 8,
      fontSize: 12,
      lineHeight: 1.5,
      color: palette.text.secondary,
    },

    '& .MuiFormHelperText-root.Mui-error': {
      color: palette.error.main,
    },
  }
})
