'use client'

import type { LucideIcon } from 'lucide-react'
import {
  BookOpen,
  CreditCard,
  Folder,
  House,
  KeyRound,
  LockKeyhole,
  Menu,
  MessageSquare,
  Settings,
  ShieldCheck,
  X,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState, type ReactNode } from 'react'

import {
  AuthenticatedContent,
  AuthenticatedRoot,
  DesktopDrawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerLogo,
  DrawerLogoMark,
  DrawerLogoText,
  DrawerNavigation,
  DrawerSection,
  MobileCloseButton,
  MobileDrawer,
  MobileMenuButton,
  NavItem,
  NavItemIcon,
} from './style'

type AuthenticatedLayoutProps = {
  children: ReactNode
}

type NavigationItem = {
  label: string
  href: string
  icon: LucideIcon
  activePaths?: string[]
}

const mainNavigation: NavigationItem[] = [
  {
    label: 'Início',
    href: '/home',
    icon: House,
  },
  {
    label: 'Projetos',
    href: '/projetos',
    icon: Folder,
  },
  {
    label: 'Plano',
    href: '/home/plano',
    icon: CreditCard,
  },
  {
    label: 'Documentação',
    href: '/home/documentacao',
    icon: BookOpen,
  },
  {
    label: 'Políticas de senha',
    href: '/home/politicas-de-senha',
    icon: KeyRound,
  },
  {
    label: 'Configurações de autenticação',
    href: '/home/configuracoes-de-autenticacao',
    icon: ShieldCheck,
  },
]

const secondaryNavigation: NavigationItem[] = [
  {
    label: 'Feedback',
    href: '/home/feedback',
    icon: MessageSquare,
  },
  {
    label: 'Configurações',
    href: '/home/configuracoes',
    icon: Settings,
  },
]

function isNavigationItemActive(pathname: string, item: NavigationItem) {
  const paths = [item.href, ...(item.activePaths ?? [])]

  return paths.some((path) => {
    if (path === '/home') {
      return pathname === path
    }

    return pathname === path || pathname.startsWith(`${path}/`)
  })
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const pathname = usePathname()
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)

  function closeMobileDrawer() {
    setIsMobileDrawerOpen(false)
  }

  function renderNavigationItems(items: NavigationItem[]) {
    return items.map((item) => {
      const Icon = item.icon
      const isActive = isNavigationItemActive(pathname, item)

      return (
        <NavItem
          key={item.href}
          href={item.href}
          $active={isActive}
          aria-current={isActive ? 'page' : undefined}
          onClick={closeMobileDrawer}
        >
          <NavItemIcon $active={isActive}>
            <Icon size={18} />
          </NavItemIcon>
          <span>{item.label}</span>
        </NavItem>
      )
    })
  }

  const drawerContent = (
    <DrawerBody>
      <DrawerHeader>
        <DrawerLogo
          href="/home"
          aria-label="Your Auth, voltar para home"
          onClick={closeMobileDrawer}
        >
          <DrawerLogoMark>
            <LockKeyhole size={16} strokeWidth={2.5} />
          </DrawerLogoMark>
          <DrawerLogoText>Your Auth</DrawerLogoText>
        </DrawerLogo>

        <MobileCloseButton aria-label="Fechar menu" onClick={closeMobileDrawer}>
          <X size={18} />
        </MobileCloseButton>
      </DrawerHeader>

      <DrawerNavigation aria-label="Navegação autenticada">
        <DrawerSection>{renderNavigationItems(mainNavigation)}</DrawerSection>
      </DrawerNavigation>

      <DrawerFooter aria-label="Navegação complementar">
        <DrawerSection>{renderNavigationItems(secondaryNavigation)}</DrawerSection>
      </DrawerFooter>
    </DrawerBody>
  )

  return (
    <AuthenticatedRoot>
      <MobileMenuButton
        aria-label="Abrir menu"
        aria-expanded={isMobileDrawerOpen}
        onClick={() => setIsMobileDrawerOpen(true)}
      >
        <Menu size={20} />
      </MobileMenuButton>

      <DesktopDrawer variant="permanent" open>
        {drawerContent}
      </DesktopDrawer>

      <MobileDrawer
        variant="temporary"
        open={isMobileDrawerOpen}
        onClose={closeMobileDrawer}
        ModalProps={{ keepMounted: true }}
      >
        {drawerContent}
      </MobileDrawer>

      <AuthenticatedContent>{children}</AuthenticatedContent>
    </AuthenticatedRoot>
  )
}
