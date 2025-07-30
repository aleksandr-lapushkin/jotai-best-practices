import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SectionCard } from '@/components/ui/section-card'
import { Atom, Zap, Share, Workflow } from 'lucide-react'

export const Route = createFileRoute('/concepts/')({
  component: ConceptsIndexComponent,
})

const concepts = [
  {
    title: "Structuring Atoms",
    description: "Essential patterns for organizing atomic state in your application",
    url: "/concepts/declaring-atoms",
    icon: Atom,
    topics: [
      "Domain-based organization",
      "Atomic granularity principles", 
      "Derived state patterns",
      "Avoiding state sprawl"
    ]
  },
  {
    title: "Atom Composition",
    description: "Build complex state by combining simple atoms with derived state",
    url: "/concepts/composition",
    icon: Workflow,
    topics: [
      "Derived atom patterns",
      "Cross-atom dependencies",
      "Performance considerations",
      "Composition strategies"
    ]
  },
  {
    title: "Action Atoms",
    description: "Co-locate business logic with state management using action atoms",
    url: "/concepts/action-atoms",
    icon: Zap,
    topics: [
      "Write-only atoms",
      "Business logic encapsulation",
      "Async action patterns",
      "Error handling"
    ]
  },
  {
    title: "Exporting & Boundaries",
    description: "Maintain control by exposing narrow, specific APIs to consumers",
    url: "/concepts/exporting-atoms",
    icon: Share,
    topics: [
      "Read-only exports",
      "Controlled mutation APIs",
      "Domain boundaries",
      "API design principles"
    ]
  }
]

function ConceptsIndexComponent() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Core Concepts</h1>
        <p className="text-xl text-muted-foreground">
          Master the fundamental patterns for building maintainable Jotai applications
        </p>
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🎨</span>
            Building Maintainable State Architecture
          </CardTitle>
          <CardDescription>
            Progressive patterns from simple atoms to complex applications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">
            These concepts build on each other, starting with fundamental atom organization and progressing to 
            advanced patterns for API design and cross-domain boundaries.
          </p>
          <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-sm text-primary font-medium">
              💡 Tip: Work through these concepts in order - each builds on patterns from the previous sections.
            </p>
          </div>
          
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {concepts.map((concept) => (
          <SectionCard key={concept.title} {...concept} />
        ))}
      </div>
    </div>
  )
}