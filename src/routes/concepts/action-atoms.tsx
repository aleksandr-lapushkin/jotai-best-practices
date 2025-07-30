import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { Zap, Code as CodeIcon, GitBranch, Clock } from 'lucide-react'
import { Code } from '@/components/ui/code'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export const Route = createFileRoute('/concepts/action-atoms')({
  component: ActionAtomsComponent,
})

const myAtom = atom("hello")
const capitalise = atom(null, (_, set) => {
  set(myAtom, (curr) => curr[0].toUpperCase() + curr.slice(1))
})
const replace = atom(null, (_, set, payload: string) => {
  set(myAtom, payload)
})
const replaceAndCapitalise = atom(null, (_, set, payload: string) => {
  set(replace, payload)
  set(capitalise)
})
const doAsyncAction = atom(null, async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos/1')
  return response.json()
})
function CapitaliseExample() {
  const doCapitalise = useSetAtom(capitalise)
  const atomValue = useAtomValue(myAtom)

  return (
    <div className="text-center space-y-2">
      <p>{atomValue}</p>

    <Button onClick={() => doCapitalise()} variant="outline" size="sm">
      Capitalise
      </Button>
    </div>
  )
}

function ReplaceExample() {
  const doReplace = useSetAtom(replace)
  const atomValue = useAtomValue(myAtom)

  return (
    <div className="text-center space-y-2">
      <p>{atomValue}</p>

      <Button onClick={() => doReplace("test")} variant="outline" size="sm">
        Replace
      </Button>
    </div>
  )
}

function ComposeExample() {
  
  const atomValue = useAtomValue(myAtom)
  const doReplace = useSetAtom(replaceAndCapitalise)
  return (
    <div className="text-center space-y-2">
      <p>{atomValue}</p>

      <Button onClick={() => doReplace("let's do both!")} variant="outline" size="sm">
        Do Both
      </Button>
    </div>
  )
}

function AsyncActionExample() {
  const performAsyncAction = useSetAtom(doAsyncAction)
  const [lastResult, setLastResult] = useState('')

  const handleClick = async () => {
    try {
      const result = await performAsyncAction()
      setLastResult(JSON.stringify(result, null, 2))
      
    } catch (error) {
      console.error('Action failed:', error)
    }
  }

  return (
    <div className="text-center space-y-2">
      <CodeBlock language='json'>
        {lastResult}
      </CodeBlock>
      <Button onClick={handleClick} variant="outline" size="sm">
        Perform Async Action
      </Button>
    </div>
  )
}

function ActionAtomsComponent() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Action Atoms & Atom Mutations</h1>
        <p className="text-xl text-muted-foreground">
          Co-locate business logic with state using action atoms for mutations and side-effects
        </p>
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            What are Action Atoms?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Action atoms are a neat feature of Jotai that allows you to co-locate business logic with state, 
            leading to a tighter integration between the two. Action Atoms are essentially reducers + effects 
            in Rematch, etc. They allow you to write both mutations and side-effects.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CodeIcon className="h-5 w-5 text-primary" />
              Action Without Payload
            </CardTitle>
            <CardDescription>
              Simple actions that don't require parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              For actions that don't need any input parameters, set the read function on the atom to 
              <Code>null</Code>.
            </p>
            
            <CodeBlock language="typescript">
{`const myAtom = atom("hello")

// Action without payload. Read function is null!
const capitalise = atom(null, (get, set) => {
    set(myAtom, (curr) => curr[0].toUpperCase() + curr.slice(1))
})

// Can be used like this:
const doCapitalise = useSetAtom(capitalise)
// Does not require an arg!
doCapitalise()`}
            </CodeBlock>
          <CapitaliseExample />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-primary" />
              Action With Payload
            </CardTitle>
            <CardDescription>
              Actions that accept parameters for more flexible mutations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Payload can be anything! The action atom will be strongly typed based on your payload type.
            </p>
            
            <CodeBlock language="typescript">
{`const myAtom = atom("hello")

// Payload can be anything!
const replace = atom(null, (get, set, payload: string) => {
    set(myAtom, payload)
})

const doReplace = useSetAtom(replace)
// Needs an argument!
doReplace("test")`}
            </CodeBlock>
          <ReplaceExample />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-primary" />
              Composing Action Atoms
            </CardTitle>
            <CardDescription>
              Action atoms can call other action atoms for complex workflows
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Action atoms can be accessed like any other atom, allowing you to compose complex 
              operations from simpler ones.
            </p>
            
            <CodeBlock language="typescript">
{`const myAtom = atom("hello")

const capitalise = atom(null, (get, set) => {
    set(myAtom, (curr) => curr[0].toUpperCase() + curr.slice(1))
})

const replace = atom(null, (get, set, payload: string) => {
    set(myAtom, payload)
})

// Action atoms can be accessed like any other atom
const replaceAndCapitalise = atom(null, (get, set, payload: string) => {
    set(replace, payload)
    set(capitalise)
})`}
            </CodeBlock>
          <ComposeExample />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Async Action Atoms
            </CardTitle>
            <CardDescription>
              Action atoms can be async and return promises for side-effects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Action atoms can be async and return a Promise, making them perfect for API calls, 
              data fetching, and other asynchronous operations.
            </p>
            
            <CodeBlock language="typescript">
{`// Can also be async and return a Promise
const asyncAction = atom(null, async (get, set) => {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos/1")
    return response.json()
})

// Usage in component:
const performAsyncAction = useSetAtom(asyncAction)

const handleClick = async () => {
    try {
        const result = await performAsyncAction()
        return result.json()
    } catch (error) {
        console.error('Action failed:', error)
    }
}`}
            </CodeBlock>
          <AsyncActionExample />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-secondary/30 to-secondary/10 border-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">💡</span>
              Key Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc list-inside text-muted-foreground">
              <li><strong className="text-foreground">Co-location:</strong> Business logic lives next to the state it modifies</li>
              <li><strong className="text-foreground">Independence from React:</strong> State is modified outside of React's lifecycle</li>
              <li><strong className="text-foreground">Atomic updates:</strong> Multiple state changes happen in a single operation</li>
              <li><strong className="text-foreground">Type safety:</strong> Full TypeScript support for payloads and return types</li>
              <li><strong className="text-foreground">Composability:</strong> Action atoms can call other action atoms</li>
              <li><strong className="text-foreground">Async support:</strong> Built-in support for promises and async operations</li>
              <li><strong className="text-foreground">Testability:</strong> Easy to test in isolation with mock stores</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}