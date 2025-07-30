import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SectionCard } from '@/components/ui/section-card'
import { ArrowRight, Lightbulb, Settings } from 'lucide-react'

export const Route = createFileRoute('/overview/')({
  component: OverviewIndexComponent,
})

const topics = [
  {
    title: "How it works",
    description: "Understanding the core concepts behind Jotai's atomic state management",
    url: "/overview/how-it-works",
    icon: Lightbulb,
    topics: [
      "The atomic approach",
      "Atoms and stores relationship",
      "Key benefits of atomic state",
      "Mental model for thinking in atoms"
    ]
  },
  {
    title: "Jotai Setup",
    description: "Best practices for setting up Jotai in your React application",
    url: "/overview/setup",
    icon: Settings,
    topics: [
      "Custom JotaiProvider pattern",
      "Store management",
      "Atom hydration strategies",
      "Integration with other libraries"
    ]
  }
]

function OverviewIndexComponent() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Overview</h1>
        <p className="text-xl text-muted-foreground">
          Get started with Jotai's fundamental concepts and setup patterns
        </p>
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            What is Jotai?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">
            Jotai is a primitive and flexible state management library for React. It's built on the 
            atomic approach where you compose small pieces of state called "atoms" to build complex 
            state management solutions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="font-semibold text-primary mb-2">⚛️ Bottom-up</div>
              <p className="text-muted-foreground">Build complex state from simple, focused atoms rather than top-down state trees.</p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="font-semibold text-primary mb-2">🔄 Reactive</div>
              <p className="text-muted-foreground">Components automatically re-render when atoms they depend on change.</p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="font-semibold text-primary mb-2">🎛️ Flexible</div>
              <p className="text-muted-foreground">No providers needed by default, but supports custom stores when needed.</p>
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