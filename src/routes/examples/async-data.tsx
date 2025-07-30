import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent,  CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/examples/async-data')({
  component: AsyncDataExample,
})

function AsyncDataExample() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Async Data Fetching</h1>
        <p className="text-xl text-muted-foreground">
          Patterns for handling asynchronous data operations with Jotai
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
            This example will cover async data patterns, including:
          </p>
          <ul className="mt-4 space-y-2 list-disc list-inside text-muted-foreground">
            <li>Suspense integration</li>
            <li>Error boundaries</li>
            <li>Loading states</li>
            <li>Data caching strategies</li>
            <li>Background refetching</li>
            <li>Real-time data updates</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}