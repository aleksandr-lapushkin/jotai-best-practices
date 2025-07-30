import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/overview/how-it-works')({
  component: HowItWorksComponent,
})

function HowItWorksComponent() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">How Jotai Works</h1>
        <p className="text-xl text-muted-foreground">
          Understanding the core concepts behind Jotai's atomic state management
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">⚛️</span>
              The Atomic Approach
            </CardTitle>
            <CardDescription>
              Jotai is extremely simple at its core: there are Atoms and there's a Store.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              One way to think about it is that each atom is a separate data storage protocol: 
              it dictates what is stored, how it's stored and how it can be read.
            </p>
            <p>
              The Store is where the data actually resides. When you try to read something from 
              the Store, you need to do so via the respective Atom, since only it knows how to 
              decode the data.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🏪</span>
              Atoms and Stores
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              <strong>Atoms are not technically global</strong> - atoms are always bound to some Store. 
              Jotai provides a default store that you don't need to initialise explicitly, but you can 
              technically have multiple stores in your app with each one having copies of the same Atoms.
            </p>
            <p>
              In this way Atoms are very similar to Symbols - they serve as unique identifiers 
              for pieces of state within a store.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🔄</span>
              Key Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Atomic granularity:</strong> Each piece of state is independent</li>
              <li><strong>Automatic dependency tracking:</strong> Components only re-render when their used atoms change</li>
              <li><strong>Bottom-up approach:</strong> Build complex state from simple atoms</li>
              <li><strong>No providers needed:</strong> Works out of the box with minimal setup</li>
              <li><strong>TypeScript-first:</strong> Excellent type inference and safety</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🧩</span>
              Mental Model
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Think of atoms as <strong>reactive variables</strong> that automatically notify 
              components when they change. Unlike traditional state management where you have 
              one large state tree, Jotai lets you create many small, focused atoms that can 
              be composed together.
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm">
                <strong>Example:</strong> Instead of having a user object with name, email, and preferences, 
                you might have separate atoms for each property. This allows components to subscribe 
                only to the data they actually use.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}