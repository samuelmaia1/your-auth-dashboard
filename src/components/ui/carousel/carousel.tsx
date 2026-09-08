'use client'

import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react'

import type { ButtonProps } from '@components/ui/button/button'

import {
  CarouselNavigationButton,
  CarouselRoot,
  CarouselSlide,
  CarouselTrack,
  CarouselViewport,
} from './style'

type CarouselApi = UseEmblaCarouselType[1]
type CarouselOptions = Parameters<typeof useEmblaCarousel>[0]
type CarouselPlugins = Parameters<typeof useEmblaCarousel>[1]

type CarouselContextValue = {
  carouselRef: UseEmblaCarouselType[0]
  api: CarouselApi
  canScrollNext: boolean
  canScrollPrevious: boolean
  scrollNext: () => void
  scrollPrevious: () => void
}

type CarouselProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  options?: CarouselOptions
  plugins?: CarouselPlugins
  setApi?: (api: CarouselApi) => void
}

type CarouselItemProps = ComponentPropsWithoutRef<typeof CarouselSlide> & {
  basis?: string
}

type CarouselNavigationProps = Omit<ButtonProps, 'children' | 'size' | 'variant'> & {
  children?: ReactNode
}

const CarouselContext = createContext<CarouselContextValue | null>(null)

function useCarousel() {
  const context = useContext(CarouselContext)

  if (!context) {
    throw new Error('useCarousel deve ser usado dentro de Carousel')
  }

  return context
}

const Carousel = forwardRef<HTMLDivElement, CarouselProps>(function Carousel(
  { children, options, plugins, setApi, ...props },
  ref,
) {
  const [carouselRef, api] = useEmblaCarousel(options, plugins)
  const [canScrollPrevious, setCanScrollPrevious] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const updateScrollState = useCallback(() => {
    if (!api) {
      return
    }

    const scrollProgress = api.scrollProgress()
    const normalizedScrollProgress = Number.isFinite(scrollProgress)
      ? Math.min(Math.max(scrollProgress, 0), 1)
      : 0
    const hasMultipleScrollPositions = api.scrollSnapList().length > 1

    setCanScrollPrevious(hasMultipleScrollPositions && normalizedScrollProgress > 0.001)
    setCanScrollNext(hasMultipleScrollPositions && normalizedScrollProgress < 0.999)
  }, [api])

  const scrollPrevious = useCallback(() => {
    api?.scrollPrev()
    window.setTimeout(updateScrollState, 0)
  }, [api, updateScrollState])

  const scrollNext = useCallback(() => {
    api?.scrollNext()
    window.setTimeout(updateScrollState, 0)
  }, [api, updateScrollState])

  useEffect(() => {
    if (!api) {
      return undefined
    }

    setApi?.(api)

    const updateStateTimer = window.setTimeout(updateScrollState, 0)

    api.on('init', updateScrollState)
    api.on('reInit', updateScrollState)
    api.on('scroll', updateScrollState)
    api.on('select', updateScrollState)
    api.on('settle', updateScrollState)

    return () => {
      window.clearTimeout(updateStateTimer)
      api.off('init', updateScrollState)
      api.off('reInit', updateScrollState)
      api.off('scroll', updateScrollState)
      api.off('select', updateScrollState)
      api.off('settle', updateScrollState)
    }
  }, [api, setApi, updateScrollState])

  const contextValue = useMemo<CarouselContextValue>(
    () => ({
      carouselRef,
      api,
      canScrollNext,
      canScrollPrevious,
      scrollNext,
      scrollPrevious,
    }),
    [api, canScrollNext, canScrollPrevious, carouselRef, scrollNext, scrollPrevious],
  )

  return (
    <CarouselContext.Provider value={contextValue}>
      <CarouselRoot ref={ref} role="region" aria-roledescription="carousel" {...props}>
        {children}
      </CarouselRoot>
    </CarouselContext.Provider>
  )
})

const CarouselContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CarouselContent({ children, ...props }, ref) {
    const { carouselRef } = useCarousel()

    return (
      <CarouselViewport ref={carouselRef}>
        <CarouselTrack ref={ref} {...props}>
          {children}
        </CarouselTrack>
      </CarouselViewport>
    )
  },
)

const CarouselItem = forwardRef<HTMLDivElement, CarouselItemProps>(function CarouselItem(
  { basis, ...props },
  ref,
) {
  return (
    <CarouselSlide ref={ref} $basis={basis} role="group" aria-roledescription="slide" {...props} />
  )
})

const CarouselPrevious = forwardRef<HTMLButtonElement, CarouselNavigationProps>(
  function CarouselPrevious({ children, onClick, ...props }, ref) {
    const { canScrollPrevious, scrollPrevious } = useCarousel()

    return (
      <CarouselNavigationButton
        ref={ref}
        $direction="previous"
        type="button"
        size="icon"
        variant="outline"
        aria-label="Anterior"
        disabled={!canScrollPrevious}
        onClick={(event) => {
          onClick?.(event)
          scrollPrevious()
        }}
        {...props}
      >
        {children ?? <ChevronLeft size={18} />}
      </CarouselNavigationButton>
    )
  },
)

const CarouselNext = forwardRef<HTMLButtonElement, CarouselNavigationProps>(function CarouselNext(
  { children, onClick, ...props },
  ref,
) {
  const { canScrollNext, scrollNext } = useCarousel()

  return (
    <CarouselNavigationButton
      ref={ref}
      $direction="next"
      type="button"
      size="icon"
      variant="outline"
      aria-label="Próximo"
      disabled={!canScrollNext}
      onClick={(event) => {
        onClick?.(event)
        scrollNext()
      }}
      {...props}
    >
      {children ?? <ChevronRight size={18} />}
    </CarouselNavigationButton>
  )
})

export { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, useCarousel }
export type { CarouselApi }
