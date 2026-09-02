import { keyframes, styled } from '@mui/material/styles'

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

export const LoadingRoot = styled('div')(({ theme }) => ({
  minHeight: '100dvh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'transparent',
  color: (theme.vars || theme).palette.text.primary,
}))

export const LoadingIcon = styled('span')({
  width: 56,
  height: 56,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',

  '& svg': {
    animation: `${spin} 900ms linear infinite`,
  },
})
