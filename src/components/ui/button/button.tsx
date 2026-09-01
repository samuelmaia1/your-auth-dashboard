import type { ButtonProps as MuiButtonProps } from '@mui/material'

import { StyledButton, type ButtonSize, type ButtonVariant } from './style'

export type ButtonProps = Omit<MuiButtonProps, 'size' | 'variant'> & {
  size?: ButtonSize
  variant?: ButtonVariant
}

function Button({ size = 'default', variant = 'default', ...props }: ButtonProps) {
  return <StyledButton buttonSize={size} disableElevation visualVariant={variant} {...props} />
}

export { Button }
