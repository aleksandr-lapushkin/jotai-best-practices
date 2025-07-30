import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SectionCard } from '@/components/ui/section-card'
import { Atom, Zap, Share, Workflow } from 'lucide-react'

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

      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">⚛️</span>
            Atomic Composability
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">
            The core philosophy of Jotai is <strong>atomic composability</strong>. Start with small, 
            focused atoms and compose them into more complex state. This approach leads to better 
            performance, easier testing, and more maintainable code.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="font-semibold text-primary mb-2">🔬 Small & Focused</div>
              <p className="text-muted-foreground">Each atom represents a single piece of state with a clear purpose.</p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="font-semibold text-primary mb-2">🧩 Composable</div>
              <p className="text-muted-foreground">Combine atoms to create complex state relationships and derived values.</p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="font-semibold text-primary mb-2">⚡ Performant</div>
              <p className="text-muted-foreground">Components only re-render when atoms they actually use change.</p>
            </div>
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