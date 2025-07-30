import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Atom, Zap, Share, Workflow } from 'lucide-react'

export const Route = createFileRoute('/concepts/')({
  component: ConceptsIndexComponent,
})

const concepts = [
  {
    title: "Structuring atoms",
    description: "Best practices for declaring and organizing atomic state in your application",
    url: "/concepts/declaring-atoms",
    icon: Atom,
    topics: [
      "Prefer small pieces of state",
      "Derive state where possible", 
      "Group related mutations",
      "Control cross-domain access"
    ]
  },
  {
    title: "Action atoms",
    description: "Co-locate business logic with state using action atoms for mutations and side-effects",
    url: "/concepts/action-atoms",
    icon: Zap,
    topics: [
      "Action atoms without payload",
      "Actions with custom payloads",
      "Composing action atoms",
      "Async actions and promises"
    ]
  },
  {
    title: "Exporting atoms",
    description: "Maintain control over your state by exposing narrow, specific APIs to consumers",
    url: "/concepts/exporting-atoms",
    icon: Share,
    topics: [
      "Read-only atom exports",
      "Controlled mutation APIs",
      "Cross-domain boundaries",
      "Action atom exports"
    ]
  },
  {
    title: "Effects",
    description: "React to state changes using effect atoms for side-effects and state synchronization",
    url: "/concepts/effects",
    icon: Workflow,
    topics: [
      "Global effects with observe",
      "Effect atoms with atomEffect",
      "Targeted effects with withAtomEffect",
      "Effect mounting strategies"
    ]
  }
]

function ConceptsIndexComponent() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Core Concepts</h1>
        <p className="text-xl text-muted-foreground">
          Master the fundamental principles of effective Jotai state management
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {concepts.map((concept) => {
          const IconComponent = concept.icon
          return (
            <Card key={concept.title} className="group hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  {concept.title}
                </CardTitle>
                <CardDescription>
                  {concept.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {concept.topics.map((topic, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {topic}
                    </li>
                  ))}
                </ul>
                <Link 
                  to={concept.url}
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

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">💡</span>
            Key Principle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">
            The core philosophy of Jotai is <strong>atomic composability</strong>. Start with small, 
            focused atoms and compose them into more complex state. This approach leads to better 
            performance, easier testing, and more maintainable code.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}