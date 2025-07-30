import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SectionCard } from '@/components/ui/section-card'
import { Zap, TestTube } from 'lucide-react'

export const Route = createFileRoute('/advanced/')({
  component: AdvancedIndexComponent,
})

const topics = [
  {
    title: "Managing Async",
    description: "Advanced patterns for handling asynchronous operations, error states, and loading management",
    url: "/advanced/async",
    icon: Zap,
    topics: [
      "Async atom patterns",
      "Error handling strategies", 
      "Loading state management",
      "Suspense integration"
    ]
  },
  {
    title: "Testing",
    description: "Comprehensive testing strategies for Jotai applications including unit and integration tests",
    url: "/advanced/testing",
    icon: TestTube,
    topics: [
      "Testing atoms in isolation",
      "Mock store setup",
      "Integration testing",
      "Testing async operations"
    ]
  }
]

function AdvancedIndexComponent() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Advanced Topics</h1>
        <p className="text-xl text-muted-foreground">
          Deep dive into advanced patterns and techniques for production Jotai applications
        </p>
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            Production Ready Patterns
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">
            These advanced topics cover the patterns and practices you'll need for building 
            robust, production-ready applications with Jotai. Master these concepts to handle 
            complex state management scenarios with confidence.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="font-semibold text-primary mb-2">⚡ Performance</div>
              <p className="text-muted-foreground">Advanced patterns for optimal performance in large applications.</p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="font-semibold text-primary mb-2">🧪 Quality</div>
              <p className="text-muted-foreground">Testing strategies and patterns for reliable state management.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {topics.map((topic) => (
          <SectionCard key={topic.title} {...topic} />
        ))}
      </div>
    </div>
  )
}