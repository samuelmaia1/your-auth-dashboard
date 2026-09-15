'use client'

import type { LucideIcon } from 'lucide-react'
import {
  BookOpen,
  ChevronDown,
  CreditCard,
  Folder,
  House,
  Layers,
  LockKeyhole,
  Menu,
  MessageSquare,
  Settings,
  X,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState, type ReactNode } from 'react'

import {
  documentationSteps,
  isDocumentationPath,
  isDocumentationStepActive,
} from '@components/documentation/documentation.shared'
import { SessionLoading } from '@components/session-loading'
import { useAuth } from '@/hooks/use-auth'
import {
  AuthenticatedAccountAvatar,
  AuthenticatedAccountAvatarImage,
  AuthenticatedContent,
  AuthenticatedRoot,
  ContentTopBar,
  DesktopDrawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerLogo,
  DrawerLogoMark,
  DrawerLogoText,
  DrawerNavigation,
  DrawerSection,
  DocsOnlyList,
  DocsOnlyTitle,
  MobileCloseButton,
  MobileDrawer,
  MobileMenuButton,
  NavChevron,
  NavGroup,
  NavGroupButton,
  NavItem,
  NavItemIcon,
  NavItemLabel,
  NavSubItem,
  NavSubmenu,
} from './style'

type AuthenticatedLayoutProps = {
  children: ReactNode
  variant?: 'authenticated' | 'documentation'
}

type NavigationLinkItem = {
  label: string
  href: string
  icon: LucideIcon
  activePaths?: string[]
}

type NavigationDocumentationItem = {
  type: 'documentation'
  label: string
  icon: LucideIcon
}

type NavigationItem = NavigationLinkItem | NavigationDocumentationItem

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
    label: 'Assinatura',
    href: '/assinatura',
    icon: CreditCard,
  },
  {
    label: 'Planos',
    href: '/planos',
    icon: Layers,
  },
  {
    type: 'documentation',
    label: 'Documentação',
    icon: BookOpen,
  },
]

const secondaryNavigation: NavigationLinkItem[] = [
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

function isNavigationItemActive(pathname: string, item: NavigationLinkItem) {
  const paths = [item.href, ...(item.activePaths ?? [])]

  return paths.some((path) => {
    if (path === '/home') {
      return pathname === path
    }

    return pathname === path || pathname.startsWith(`${path}/`)
  })
}

function isNavigationDocumentationItem(item: NavigationItem): item is NavigationDocumentationItem {
  return 'type' in item && item.type === 'documentation'
}

function getAccountDisplayName(account?: ReturnType<typeof useAuth>['account']) {
  const fullName = [account?.name, account?.lastName]
    .map((namePart) => namePart?.trim())
    .filter(Boolean)
    .join(' ')

  return fullName || account?.email?.trim() || 'sua conta'
}

function getAccountInitials(displayName: string) {
  const nameParts = displayName
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean)

  if (nameParts.length === 0 || displayName === 'sua conta') {
    return 'YA'
  }

  const firstInitial = nameParts[0]?.[0] ?? ''
  const secondInitial = nameParts.length > 1 ? (nameParts[nameParts.length - 1]?.[0] ?? '') : ''

  return `${firstInitial}${secondInitial}`.toUpperCase()
}

export function AuthenticatedLayout({
  children,
  variant = 'authenticated',
}: AuthenticatedLayoutProps) {
  const pathname = usePathname()
  const { account, status } = useAuth()
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)
  const [isDocumentationMenuOpen, setIsDocumentationMenuOpen] = useState(false)
  const isAuthenticated = status === 'authenticated'
  const shouldRequireAuthentication = variant === 'authenticated'
  const shouldRenderFullNavigation = shouldRequireAuthentication || isAuthenticated
  const accountDisplayName = getAccountDisplayName(account)
  const accountInitials = getAccountInitials(accountDisplayName)
  const isCurrentDocumentationPath = isDocumentationPath(pathname)
  const drawerLogoHref = shouldRenderFullNavigation ? '/home' : '/'
  const drawerLogoLabel = shouldRenderFullNavigation
    ? 'Your Auth, voltar para home'
    : 'Your Auth, voltar para tela inicial'

  if (shouldRequireAuthentication && !isAuthenticated) {
    return <SessionLoading />
  }

  function closeMobileDrawer() {
    setIsMobileDrawerOpen(false)
  }

  function renderDocumentationStepLinks({ onClick }: { onClick?: () => void } = {}) {
    return documentationSteps.map((step) => {
      const isActive = isDocumentationStepActive(pathname, step)

      return (
        <NavSubItem
          key={step.href}
          href={step.href}
          $active={isActive}
          aria-current={isActive ? 'page' : undefined}
          onClick={onClick}
        >
          {step.shortTitle}
        </NavSubItem>
      )
    })
  }

  function renderDocumentationGroup(item: NavigationDocumentationItem) {
    const Icon = item.icon

    return (
      <NavGroup key="documentation">
        <NavGroupButton
          type="button"
          $active={isCurrentDocumentationPath}
          aria-expanded={isDocumentationMenuOpen}
          aria-controls="documentation-sidebar-steps"
          onClick={() => setIsDocumentationMenuOpen((isOpen) => !isOpen)}
        >
          <NavItemIcon $active={isCurrentDocumentationPath}>
            <Icon size={18} />
          </NavItemIcon>
          <NavItemLabel>{item.label}</NavItemLabel>
          <NavChevron $open={isDocumentationMenuOpen}>
            <ChevronDown size={16} />
          </NavChevron>
        </NavGroupButton>

        <NavSubmenu id="documentation-sidebar-steps" $open={isDocumentationMenuOpen}>
          {renderDocumentationStepLinks({ onClick: closeMobileDrawer })}
        </NavSubmenu>
      </NavGroup>
    )
  }

  function renderDocumentationOnlyNavigation() {
    return (
      <DrawerSection>
        <DocsOnlyTitle>Documentação</DocsOnlyTitle>
        <DocsOnlyList>{renderDocumentationStepLinks({ onClick: closeMobileDrawer })}</DocsOnlyList>
      </DrawerSection>
    )
  }

  function renderNavigationItems(items: NavigationItem[]) {
    return items.map((item) => {
      if (isNavigationDocumentationItem(item)) {
        return renderDocumentationGroup(item)
      }

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
          <NavItemLabel>{item.label}</NavItemLabel>
        </NavItem>
      )
    })
  }

  const drawerContent = (
    <DrawerBody>
      <DrawerHeader>
        <DrawerLogo href={drawerLogoHref} aria-label={drawerLogoLabel} onClick={closeMobileDrawer}>
          <DrawerLogoMark>
            <LockKeyhole size={16} strokeWidth={2.5} />
          </DrawerLogoMark>
          <DrawerLogoText>Your Auth</DrawerLogoText>
        </DrawerLogo>

        <MobileCloseButton aria-label="Fechar menu" onClick={closeMobileDrawer}>
          <X size={18} />
        </MobileCloseButton>
      </DrawerHeader>

      <DrawerNavigation
        aria-label={
          shouldRenderFullNavigation ? 'Navegação autenticada' : 'Navegação da documentação'
        }
      >
        {shouldRenderFullNavigation ? (
          <DrawerSection>{renderNavigationItems(mainNavigation)}</DrawerSection>
        ) : (
          renderDocumentationOnlyNavigation()
        )}
      </DrawerNavigation>

      {shouldRenderFullNavigation && (
        <DrawerFooter aria-label="Navegação complementar">
          <DrawerSection>{renderNavigationItems(secondaryNavigation)}</DrawerSection>
        </DrawerFooter>
      )}
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

      <AuthenticatedContent>
        {variant === 'documentation' && isAuthenticated && (
          <ContentTopBar>
            <AuthenticatedAccountAvatar
              aria-label={`Identificação visual de ${accountDisplayName}`}
            >
              {account?.avatarUrl ? (
                <AuthenticatedAccountAvatarImage
                  src={account.avatarUrl}
                  alt={`Avatar de ${accountDisplayName}`}
                  width={40}
                  height={40}
                />
              ) : (
                <span aria-hidden="true">{accountInitials}</span>
              )}
            </AuthenticatedAccountAvatar>
          </ContentTopBar>
        )}
        {children}
      </AuthenticatedContent>
    </AuthenticatedRoot>
  )
}
