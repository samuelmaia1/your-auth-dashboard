import { LockKeyhole } from 'lucide-react'

import { LogoLink as StyledLogoLink, LogoMark, LogoText } from './style'

export function LogoLink() {
  return (
    <StyledLogoLink href="/" aria-label="Your Auth, início">
      <LogoMark>
        <LockKeyhole size={16} strokeWidth={2.5} />
      </LogoMark>
      <LogoText>Your Auth</LogoText>
    </StyledLogoLink>
  )
}
