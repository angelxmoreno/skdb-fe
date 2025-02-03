import { createFileRoute } from '@tanstack/react-router'
import { Crumbs } from '@components/layout/pageContainer/BreadcrumbBuilder'
import PageView from '@components/layout/pageContainer/PageView'

export const Route = createFileRoute('/_authenticated/serial-killers/create')({
  component: RouteComponent,
})

function RouteComponent() {
  const title = 'Serial Killers'
  const subtitle = 'create'
  const crumbs: Crumbs = [
    { name: 'Home', uri: '/' },
    { name: 'Serial Killers', uri: '/serial-killers' },
    'Create',
  ]
  const errorText = undefined
  const pageViewProps = { title, subtitle, crumbs, errorText }

  return (
    <PageView {...pageViewProps}>
      <h4>Create form</h4>
    </PageView>
  )
}
