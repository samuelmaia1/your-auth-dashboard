'use client'

import { LoaderCircle } from 'lucide-react'

import { LoadingIcon, LoadingRoot } from './style'

export function SessionLoading() {
  return (
    <LoadingRoot aria-busy="true" aria-live="polite" role="status">
      <LoadingIcon>
        <LoaderCircle size={32} />
      </LoadingIcon>
    </LoadingRoot>
  )
}
