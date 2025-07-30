import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, RefreshCw, Users, Cog, Database } from 'lucide-react'

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

      <div className="grid gap-6 md:grid-cols-2">
        {utilities.map((utility) => {
          const IconComponent = utility.icon
          return (
            <Card key={utility.title} className="group hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  {utility.title}
                </CardTitle>
                <CardDescription>
                  {utility.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {utility.topics.map((topic, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {topic}
                    </li>
                  ))}
                </ul>
                <Link 
                  to={utility.url}
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium text-sm"
                >
                  Learn more
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🧰</span>
            When to Use Utilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">
            These utilities solve common patterns and advanced use cases that go beyond basic atoms. 
            Use them when you need specialized behavior like dynamic atom creation, reducer patterns, 
            or integration with external data fetching libraries.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}