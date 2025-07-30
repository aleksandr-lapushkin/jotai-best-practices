import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SectionCard } from '@/components/ui/section-card'
import { Calculator, Zap, Database, FileText, HardDrive } from 'lucide-react'

export const Route = createFileRoute('/examples/')({
  component: ExamplesIndexComponent,
})

const examples = [
  {
    title: "Basic Counter",
    description: "A simple counter example demonstrating fundamental Jotai concepts",
    url: "/examples/basic-counter",
    icon: Calculator,
    topics: [
      "Basic atoms and derived state",
      "Action atoms for mutations", 
      "Interactive code examples",
      "Testing atom behavior"
    ]
  },
  {
    title: "Action Atoms",
    description: "Advanced patterns using action atoms for complex state management",
    url: "/examples/action-atoms",
    icon: Zap,
    topics: [
      "Complex business logic",
      "Multi-step async operations",
      "Error handling patterns",
      "Action composition"
    ]
  },
  {
    title: "Async Data Fetching",
    description: "Patterns for handling asynchronous data operations with Jotai",
    url: "/examples/async-data",
    icon: Database,
    topics: [
      "Suspense integration",
      "Error boundaries",
      "Loading states",
      "Background refetching"
    ]
  },
  {
    title: "Form Management",
    description: "Advanced form handling patterns using Jotai for state management",
    url: "/examples/form-management",
    icon: FileText,
    topics: [
      "Field-level validation",
      "Form state tracking",
      "Multi-step forms",
      "Dynamic form fields"
    ]
  },
  {
    title: "State Persistence",
    description: "Patterns for persisting and hydrating state across sessions",
    url: "/examples/persistence",
    icon: HardDrive,
    topics: [
      "localStorage integration",
      "Server-side hydration",
      "Selective persistence",
      "Migration strategies"
    ]
  }
]

function ExamplesIndexComponent() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Examples</h1>
        <p className="text-xl text-muted-foreground">
          Practical examples demonstrating Jotai patterns and best practices in real-world scenarios
        </p>
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">💡</span>
            Learn by Example
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">
            These examples showcase real-world applications of Jotai concepts. Each example builds on 
            the previous ones, demonstrating increasingly sophisticated patterns and techniques.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="font-semibold text-primary mb-2">🎯 Practical</div>
              <p className="text-muted-foreground">Real-world scenarios you'll encounter in production applications.</p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="font-semibold text-primary mb-2">⚡ Interactive</div>
              <p className="text-muted-foreground">Live code examples you can modify and experiment with.</p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="font-semibold text-primary mb-2">📚 Educational</div>
              <p className="text-muted-foreground">Comprehensive explanations of patterns and best practices.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {examples.map((example) => (
          <SectionCard key={example.title} {...example} />
        ))}
      </div>

      <Card className="bg-gradient-to-r from-accent/30 to-accent/10 border-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            Getting Started
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground">
            Start with the Basic Counter example to understand fundamental concepts, then progress 
            through the more advanced examples. Each example includes interactive code snippets 
            and detailed explanations of the patterns used.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}