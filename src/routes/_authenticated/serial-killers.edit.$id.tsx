import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/serial-killers/edit/$id')(
  {
    component: RouteComponent,
  },
)

function RouteComponent() {
  return <div>Hello "/_authenticated/serial-killers/edit/$id"!</div>
}
