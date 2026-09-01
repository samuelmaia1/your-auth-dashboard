import type { IconName } from 'lucide-react/dynamic'
import { DynamicIcon } from 'lucide-react/dynamic'

interface IconProps {
  name: IconName
  size?: number | string
  color?: string
  onClick?: () => void
}

function Icon({ name, size = 24, color = 'currentColor', onClick }: IconProps) {
  return <DynamicIcon name={name} size={size} color={color} onClick={onClick} />
}

export { Icon }
