import { styled } from '@mui/material/styles'

import { Button } from '@components/ui/button/button'

type CarouselNavigationButtonProps = {
  $direction: 'previous' | 'next'
}

export const CarouselRoot = styled('div')({
  position: 'relative',
  minWidth: 0,
})

export const CarouselViewport = styled('div')(({ theme }) => ({
  width: '100%',
  minWidth: 0,
  overflow: 'hidden',
  padding: '2px 42px 6px',

  [theme.breakpoints.up('sm')]: {
    paddingRight: 50,
    paddingLeft: 50,
  },
}))

export const CarouselTrack = styled('div')({
  display: 'flex',
  gap: 14,
  willChange: 'transform',
})

export const CarouselSlide = styled('div', {
  shouldForwardProp: (prop) => prop !== '$basis',
})<{ $basis?: string }>(({ $basis }) => ({
  minWidth: 0,
  flex: `0 0 ${$basis ?? '100%'}`,
}))

export const CarouselNavigationButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== '$direction',
})<CarouselNavigationButtonProps>(({ $direction, theme }) => {
  const palette = (theme.vars || theme).palette

  return {
    position: 'absolute',
    top: '50%',
    left: $direction === 'previous' ? 0 : 'auto',
    right: $direction === 'next' ? 0 : 'auto',
    zIndex: 2,
    width: 40,
    height: 40,
    touchAction: 'manipulation',
    borderColor: palette.divider,
    borderRadius: 8,
    backgroundColor: palette.background.paper,
    boxShadow: `0 14px 30px ${theme.alpha(palette.primary.main, 0.12)}`,
    transform: 'translateY(-50%)',

    '&:hover': {
      backgroundColor: palette.muted.main,
    },

    '&:active:not([aria-haspopup="true"])': {
      transform: 'translateY(-50%)',
    },
  }
})
