import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Zap, TestTube } from 'lucide-react'

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

      <div className="grid gap-6 md:grid-cols-2">
        {topics.map((topic) => {
          const IconComponent = topic.icon
          return (
            <Card key={topic.title} className="group hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  {topic.title}
                </CardTitle>
                <CardDescription>
                  {topic.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {topic.topics.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link 
                  to={topic.url}
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

      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            Production Ready
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">
            These advanced topics cover the patterns and practices you'll need for building 
            robust, production-ready applications with Jotai. Master these concepts to handle 
            complex state management scenarios with confidence.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}