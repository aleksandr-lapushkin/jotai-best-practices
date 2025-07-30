import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, BookOpen, Code, Lightbulb, Target } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-4">
          <Badge variant="secondary" className="text-sm">
            Interactive Learning Resource
          </Badge>
        </div>
        <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Jotai Best Practices
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          A comprehensive guide to building production-ready applications with Jotai, 
          based on real-world experience and battle-tested patterns from actual implementations.
        </p>
          </div>
          
          {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-1 ">
        {/* Getting Started */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🚀</span>
              Getting Started
            </CardTitle>
            <CardDescription>
              New to Jotai or want to understand the fundamentals?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Begin with the Overview section to understand how Jotai works and why it's 
              different from other state management solutions.
            </p>
            <Button asChild className="w-full">
              <Link to="/overview">
                Start Learning <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-lg">Production Ready</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Patterns and practices proven in real production applications
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-lg">Interactive Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Live, editable code examples you can experiment with in real-time
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
              <Lightbulb className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-lg">Best Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Learn the do's and don'ts from developers who've shipped Jotai to production
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-lg">Practical Focus</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Solutions to common challenges you'll face when building real applications
            </p>
          </CardContent>
        </Card>
      </div>

      
    </div>
  )
}