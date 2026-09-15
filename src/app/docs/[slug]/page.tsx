import { notFound } from 'next/navigation'

import {
  DocumentationPage,
  documentationSteps,
  isDocumentationSlug,
} from '@components/documentation'

type DocsStepPageProps = {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return documentationSteps.map((step) => ({
    slug: step.slug,
  }))
}

export default async function DocsStepPage({ params }: DocsStepPageProps) {
  const { slug } = await params

  if (!isDocumentationSlug(slug)) {
    notFound()
  }

  return <DocumentationPage slug={slug} />
}
