import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SectionCard } from '@/components/ui/section-card'
import { RefreshCw, Users, Cog, Database } from 'lucide-react'

export const Route = createFileRoute('/utilities/')({
  component: UtilitiesIndexComponent,
})

const utilities = [
  {
    title: "atomWithDefault",
    description: "Create atoms with default values that can be computed or async, with reset capability",
    url: "/utilities/atomWithDefault",
    icon: RefreshCw,
    topics: [
      "Default value computation",
      "Async default values", 
      "Reset functionality",
      "Integration with atomWithReset"
    ]
  },
  {
    title: "atomFamily",
    description: "Generate atoms dynamically based on parameters for managing collections of related state",
    url: "/utilities/atomFamily",
    icon: Users,
    topics: [
      "Dynamic atom generation",
      "Parameter-based keys",
      "Managing entity collections",
      "Memory management"
    ]
  },
  {
    title: "atomWithReducer",
    description: "Create atoms with reducer-like state management for complex state transitions",
    url: "/utilities/atomWithReducer",
    icon: Cog,
    topics: [
      "Reducer pattern in atoms",
      "Action dispatching",
      "Type-safe state transitions",
      "Complex state management"
    ]
  },
  {
    title: "atomWithQuery variants",
    description: "Integration with TanStack Query for data fetching and caching",
    url: "/utilities/atomWithQuery",
    icon: Database,
    topics: [
      "atomWithQuery basics",
      "atomWithSuspenseQuery",
      "atomWithInfiniteQuery",
      "Integration patterns"
    ]
  }
]

function UtilitiesIndexComponent() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Atom Utilities</h1>
        <p className="text-xl text-muted-foreground">
          Powerful utility functions that extend Jotai's core capabilities for advanced use cases
        </p>
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🧰</span>
            Beyond Basic Atoms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">
            While basic atoms cover most use cases, Jotai provides powerful utilities for advanced scenarios. 
            These utilities handle complex patterns like dynamic atom creation, state persistence, and 
            integration with external libraries.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="font-semibold text-primary mb-2">🔄 State Management</div>
              <p className="text-muted-foreground">Advanced patterns for complex state transitions and persistence.</p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="font-semibold text-primary mb-2">🔗 Integrations</div>
              <p className="text-muted-foreground">Seamless integration with external libraries and APIs.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {utilities.map((utility) => (
          <SectionCard key={utility.title} {...utility} />
        ))}
      </div>

      <Card className="bg-gradient-to-r from-secondary/30 to-secondary/10 border-secondary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">💡</span>
            When to Use Utilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground">
            These utilities solve common patterns and advanced use cases that go beyond basic atoms. 
            Use them when you need specialized behavior like dynamic atom creation, reducer patterns, 
            or integration with external data fetching libraries.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}