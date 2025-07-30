import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { atom, useAtom } from 'jotai'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/overview/how-it-works')({
  component: HowItWorksComponent,
})

const countAtom = atom(0)
const doubledAtom = atom((get) => get(countAtom) * 2)
function CounterExample() {
  const [count, setCount] = useAtom(countAtom)
  const [doubled] = useAtom(doubledAtom)
  return (
    <div>
      <p>Count: {count}</p>
      <p>Doubled: {doubled}</p>
      <Button onClick={() => setCount((c) => c + 1)}>Increment</Button>
    </div>
  )
}

function HowItWorksComponent() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">How Jotai Works</h1>
        <p className="text-xl text-muted-foreground">
          A quick refresher on Jotai's core concepts with interactive examples
        </p>
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🧠</span>
            Mental Model
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">
            If you're coming from Redux or Zustand, Jotai flips the paradigm. Instead of a single global store, 
            you have many small, independent atoms that compose together. Think <strong>bottom-up</strong> instead of top-down.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="font-semibold text-primary mb-2">Traditional State Management</div>
              <p className="text-muted-foreground">One big store → slice out what you need</p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="font-semibold text-primary mb-2">Jotai Approach</div>
              <p className="text-muted-foreground">Many small atoms → compose into bigger state</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">⚛️</span>
              Atoms: The Building Blocks
            </CardTitle>
            <CardDescription>
              An atom is the smallest unit of state - think of it as a single variable with superpowers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Creating atoms is simple. Here are the two main types you'll use:</p>
            <CodeBlock language="tsx">
              {`import { atom } from 'jotai';

// Primitive atom: holds a value
const countAtom = atom(0);

// Derived atom: computes from other atoms
const doubledAtom = atom((get) => get(countAtom) * 2)
const isEvenAtom = atom((get) => get(countAtom) % 2 === 0)`}
            </CodeBlock>
            <p>The beauty is in the composition - derived atoms automatically update when their dependencies change, and components only re-render when atoms they actually use change.</p>
            <CodeBlock language="tsx">
              {`import { useAtom, useAtomValue } from 'jotai';

function Counter() {
  const [count, setCount] = useAtom(countAtom);     // read + write
  const doubled = useAtomValue(doubledAtom);        // read only
  const isEven = useAtomValue(isEvenAtom);          // read only
  
  return (
    <div>
      <p>Count: {count} (doubled: {doubled})</p>
      <p>Is even: {isEven ? 'Yes' : 'No'}</p>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
}`}
            </CodeBlock>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Try it yourself:</p>
              <CounterExample />
            </div>
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <p className="text-sm">
                <strong>Key insight:</strong> Atoms are like "keys" that tell the store how to read/write specific pieces of state. 
                The store holds the actual values, but atoms define the "protocol" for accessing them.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              Why This Matters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-primary">Granular Updates</h4>
                <p className="text-sm text-muted-foreground">
                  Only components using changed atoms re-render. No more unnecessary renders from unrelated state changes.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-primary">Easy Composition</h4>
                <p className="text-sm text-muted-foreground">
                  Build complex state from simple atoms. Add new derived state without changing existing atoms.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-primary">No Boilerplate</h4>
                <p className="text-sm text-muted-foreground">
                  No actions, reducers, or selectors. Just atoms and the values they represent.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-primary">Type Safety</h4>
                <p className="text-sm text-muted-foreground">
                  Full TypeScript inference. Atoms know their types and derived atoms inherit them correctly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🚀</span>
              Ready to Dive Deeper?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Now that you understand the basics, let's explore how to structure atoms effectively in real applications. 
              The next section covers best practices for organizing atomic state.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <Link 
                to="/concepts/declaring-atoms"
                className="bg-card p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
              >
                <div className="font-semibold text-primary mb-2 flex items-center gap-2">
                  Next: Atom Structure
                  <ArrowRight className="h-3 w-3" />
                </div>
                <p className="text-muted-foreground">Learn how to organize atoms by domain and avoid state sprawl</p>
              </Link>
              <Link 
                to="/concepts/composition"
                className="bg-card p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
              >
                <div className="font-semibold text-primary mb-2 flex items-center gap-2">
                  Then: Composition
                  <ArrowRight className="h-3 w-3" />
                </div>
                <p className="text-muted-foreground">Master derived atoms and building complex state from simple pieces</p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}