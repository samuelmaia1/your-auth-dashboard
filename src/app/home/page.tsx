import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home | Your Auth',
  description: 'Área privada inicial da conta Your Auth.',
}

export default function HomePage() {
  return (
    <main>
      <p>Você está na tela /home.</p>
    </main>
  )
}
