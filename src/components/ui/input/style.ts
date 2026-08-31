import { TextField } from '@mui/material'
import { styled } from '@mui/material/styles'

export const StyledTextField = styled(TextField)(() => ({
  width: '100%',
  WebkitTapHighlightColor: 'transparent',

  '& .MuiInputLabel-root': {
    color: 'var(--foreground)',
    marginBottom: 8,
    position: 'relative',
    transform: 'none',
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 1.4,

    '&.Mui-focused': {
      color: 'var(--foreground)',
    },

    '&.Mui-error': {
      color: 'var(--destructive)',
    },

    '&.Mui-disabled': {
      color: 'var(--muted-foreground)',
    },
  },

  '& .MuiOutlinedInput-root': {
    minHeight: 48,
    borderRadius: 'var(--radius)',
    backgroundColor: 'var(--card)',
    color: 'var(--foreground)',
    boxShadow: '0 1px 2px rgb(15 23 42 / 0.04)',
    transition:
      'border-color 160ms ease, background-color 160ms ease, box-shadow 160ms ease, color 160ms ease',

    '& fieldset': {
      top: 0,
      borderColor: 'var(--input)',
      transition: 'border-color 160ms ease',
    },

    '& legend': {
      display: 'none',
    },

    '&:hover': {
      backgroundColor: 'var(--background)',
    },

    '&:hover fieldset': {
      borderColor: 'var(--border)',
    },

    '&.Mui-focused': {
      boxShadow:
        '0 0 0 3px color-mix(in oklch, var(--ring) 32%, transparent), 0 1px 2px rgb(15 23 42 / 0.04)',
    },

    '&.Mui-focused fieldset': {
      borderColor: 'var(--ring)',
      borderWidth: 1,
    },

    '&.Mui-error': {
      boxShadow:
        '0 0 0 3px color-mix(in oklch, var(--destructive) 16%, transparent), 0 1px 2px rgb(15 23 42 / 0.04)',
    },

    '&.Mui-error fieldset, &.Mui-error:hover fieldset, &.Mui-error.Mui-focused fieldset': {
      borderColor: 'var(--destructive)',
    },

    '&.Mui-disabled': {
      backgroundColor: 'var(--muted)',
      color: 'var(--muted-foreground)',
      boxShadow: 'none',
      cursor: 'not-allowed',
    },

    '&.Mui-disabled fieldset': {
      borderColor: 'var(--border)',
    },
  },

  '& .MuiInputBase-input': {
    padding: '13px 16px',
    fontSize: 14,
    lineHeight: '20px',
    color: 'var(--foreground)',
    caretColor: 'var(--accent)',
    outline: 'none',

    '&::placeholder': {
      color: 'var(--muted-foreground)',
      opacity: 1,
    },

    '&.Mui-disabled': {
      color: 'var(--muted-foreground)',
      WebkitTextFillColor: 'var(--muted-foreground)',
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
    color: 'var(--muted-foreground)',
    borderRadius: 'calc(var(--radius) * 0.8)',
    WebkitTapHighlightColor: 'transparent',
    transition: 'background-color 160ms ease, color 160ms ease',

    '&:hover': {
      backgroundColor: 'var(--muted)',
      color: 'var(--foreground)',
    },

    '&:focus-visible': {
      outline: 'none',
      boxShadow: '0 0 0 3px color-mix(in oklch, var(--ring) 32%, transparent)',
    },

    '&.Mui-disabled': {
      color: 'color-mix(in oklch, var(--muted-foreground) 45%, transparent)',
    },
  },

  '& .MuiFormHelperText-root': {
    marginLeft: 0,
    marginTop: 8,
    fontSize: 12,
    lineHeight: 1.5,
    color: 'var(--muted-foreground)',
  },

  '& .MuiFormHelperText-root.Mui-error': {
    color: 'var(--destructive)',
  },
}))
