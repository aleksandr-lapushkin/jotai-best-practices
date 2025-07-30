import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { Button } from '@/components/ui/button'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Plus, Minus, RotateCcw } from 'lucide-react'

export const Route = createFileRoute('/examples/basic-counter')({
  component: BasicCounterExample,
})

// Example atoms
const countAtom = atom(0)
const doubledAtom = atom((get) => get(countAtom) * 2)
const incrementAtom = atom(null, (get, set) => {
  set(countAtom, (prev) => prev + 1)
})
const decrementAtom = atom(null, (get, set) => {
  set(countAtom, (prev) => prev - 1)
})
const resetAtom = atom(null, (get, set) => {
  set(countAtom, 0)
})

// Interactive demo component
const InteractiveCounter = () => {
  const count = useAtomValue(countAtom)
  const doubled = useAtomValue(doubledAtom)
  const increment = useSetAtom(incrementAtom)
  const decrement = useSetAtom(decrementAtom)
  const reset = useSetAtom(resetAtom)

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="text-center">Interactive Demo</CardTitle>
        <CardDescription className="text-center">
          Try the counter below to see Jotai in action
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-2">
          <div className="text-6xl font-bold text-blue-600">{count}</div>
          <div className="text-lg text-muted-foreground">
            Doubled: <span className="font-semibold text-indigo-600">{doubled}</span>
          </div>
        </div>
        
        <div className="flex gap-2 justify-center">
          <Button onClick={() => decrement()} variant="outline" size="sm">
            <Minus className="h-4 w-4" />
          </Button>
          <Button onClick={() => reset()} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button onClick={() => increment()} variant="outline" size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function BasicCounterExample() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Basic Counter</h1>
        <p className="text-xl text-muted-foreground">
          A simple counter example demonstrating fundamental Jotai concepts
        </p>
      </div>

      <InteractiveCounter />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">⚛️</span>
              Atom Definitions
            </CardTitle>
            <CardDescription>
              Basic atoms for state and derived values
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock language="typescript">
{`// Basic state atom
const countAtom = atom(0)

// Derived atom - automatically updates when countAtom changes
const doubledAtom = atom((get) => get(countAtom) * 2)`}
            </CodeBlock>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              Action Atoms
            </CardTitle>
            <CardDescription>
              Action atoms for controlled state mutations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock language="typescript">
{`// Action atoms for state mutations
const incrementAtom = atom(null, (get, set) => {
  set(countAtom, (prev) => prev + 1)
})

const decrementAtom = atom(null, (get, set) => {
  set(countAtom, (prev) => prev - 1)
})

const resetAtom = atom(null, (get, set) => {
  set(countAtom, 0)
})`}
            </CodeBlock>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🔗</span>
              Component Usage
            </CardTitle>
            <CardDescription>
              How to use atoms in React components
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock language="typescript">
{`const Counter = () => {
  // Read atom values
  const count = useAtomValue(countAtom)
  const doubled = useAtomValue(doubledAtom)
  
  // Get action functions
  const increment = useSetAtom(incrementAtom)
  const decrement = useSetAtom(decrementAtom)
  const reset = useSetAtom(resetAtom)

  return (
    <div>
      <div>Count: {count}</div>
      <div>Doubled: {doubled}</div>
      
      <button onClick={() => increment()}>+</button>
      <button onClick={() => decrement()}>-</button>
      <button onClick={() => reset()}>Reset</button>
    </div>
  )
}`}
            </CodeBlock>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📊</span>
              Alternative: Using useAtom
            </CardTitle>
            <CardDescription>
              Direct atom manipulation with read/write tuple
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              For simple cases, you can also use <code className="bg-muted px-1 rounded">useAtom</code> 
              to get both the value and setter:
            </p>
            
            <CodeBlock language="typescript">
{`const SimpleCounter = () => {
  const [count, setCount] = useAtom(countAtom)
  const doubled = useAtomValue(doubledAtom)

  return (
    <div>
      <div>Count: {count}</div>
      <div>Doubled: {doubled}</div>
      
      <button onClick={() => setCount(prev => prev + 1)}>+</button>
      <button onClick={() => setCount(prev => prev - 1)}>-</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  )
}`}
            </CodeBlock>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <p className="text-sm text-blue-800">
                <strong>Best Practice:</strong> While <code className="bg-muted px-1 rounded">useAtom</code> is 
                convenient for simple cases, using action atoms provides better encapsulation and makes 
                your business logic more testable.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🧪</span>
              Testing the Counter
            </CardTitle>
            <CardDescription>
              How to test this counter implementation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock language="typescript">
{`import { createStore } from 'jotai'
import { describe, it, expect } from 'vitest'

describe('Counter atoms', () => {
  it('should increment count', () => {
    const store = createStore()
    expect(store.get(countAtom)).toBe(0)
    
    store.set(incrementAtom)
    expect(store.get(countAtom)).toBe(1)
  })
  
  it('should calculate doubled value', () => {
    const store = createStore()
    store.set(countAtom, 5)
    expect(store.get(doubledAtom)).toBe(10)
  })
  
  it('should reset to zero', () => {
    const store = createStore()
    store.set(countAtom, 42)
    store.set(resetAtom)
    expect(store.get(countAtom)).toBe(0)
  })
})`}
            </CodeBlock>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">💡</span>
              Key Takeaways
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Atomic state:</strong> Each piece of state is independent and focused</li>
              <li><strong>Derived values:</strong> Automatically computed from other atoms</li>
              <li><strong>Action atoms:</strong> Encapsulate mutation logic for better maintainability</li>
              <li><strong>Reactive updates:</strong> Components automatically re-render when atoms change</li>
              <li><strong>Type safety:</strong> Full TypeScript support out of the box</li>
              <li><strong>Testability:</strong> Easy to test atoms in isolation</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}