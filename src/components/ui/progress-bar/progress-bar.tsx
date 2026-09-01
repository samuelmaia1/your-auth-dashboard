import type { LinearProgressProps } from '@mui/material'

import { StyledLinearProgress } from './style'

interface ProgressBarProps extends LinearProgressProps {
  progress: number
}

function ProgressBar({ progress, variant = 'determinate', color = 'inherit' }: ProgressBarProps) {
  return <StyledLinearProgress value={progress} variant={variant} color={color} />
}

export { ProgressBar }
