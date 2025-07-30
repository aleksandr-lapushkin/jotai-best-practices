import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/examples/action-atoms')({
  component: ActionAtomsExample,
})

function ActionAtomsExample() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Action Atoms Example</h1>
        <p className="text-xl text-muted-foreground">
          Advanced patterns using action atoms for complex state management
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
            This example will demonstrate advanced action atom patterns, including:
          </p>
          <ul className="mt-4 space-y-2 list-disc list-inside text-muted-foreground">
            <li>Complex business logic encapsulation</li>
            <li>Multi-step async operations</li>
            <li>Error handling and rollback</li>
            <li>Optimistic updates</li>
            <li>Action composition and chaining</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}