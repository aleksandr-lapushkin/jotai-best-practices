import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/examples/persistence')({
  component: PersistenceExample,
})

function PersistenceExample() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">State Persistence</h1>
        <p className="text-xl text-muted-foreground">
          Patterns for persisting and hydrating state across sessions
        </p>
      </div>

      <Card className="bg-gray-50 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🚧</span>
            Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This example will cover state persistence patterns, including:
          </p>
          <ul className="mt-4 space-y-2 list-disc list-inside text-muted-foreground">
            <li>localStorage integration</li>
            <li>sessionStorage patterns</li>
            <li>IndexedDB for complex data</li>
            <li>Server-side state hydration</li>
            <li>Selective persistence</li>
            <li>Migration strategies</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}