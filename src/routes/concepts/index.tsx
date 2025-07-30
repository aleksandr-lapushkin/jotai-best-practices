import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SectionCard } from '@/components/ui/section-card'
import { Atom, Zap, Share, Workflow } from 'lucide-react'

export const Route = createFileRoute('/concepts/')({
  component: ConceptsIndexComponent,
})

const concepts = [
  {
    title: "Action atoms",
    description: "Co-locate business logic with state management",
    url: "/concepts/action-atoms",
    icon: Zap,
    topics: [
      "Action atoms",
      "Action atom composition",
      "Async actions",
    ]
  },
  {
    title: "Structuring atoms",
    description: "Best practices for declaring and organizing atomic state in your application",
    url: "/concepts/declaring-atoms",
    icon: Atom,
    topics: [
      "Atom definition",
      "Derived atoms", 
      "Group related mutations",
      "Control cross-domain access"
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

      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">⚛️</span>
            Best Practices for keeping your Jotai state organized
          </CardTitle>
          <CardDescription>
            Tips for staying productive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">
            Learn how to structure, organize and reuse your Jotai atoms effectively to build scalable and maintainable applications.
          </p>
          
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