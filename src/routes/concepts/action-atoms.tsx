import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { Zap, Code, GitBranch, Clock } from 'lucide-react'

export const Route = createFileRoute('/concepts/action-atoms')({
  component: ActionAtomsComponent,
})

function ActionAtomsComponent() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Action Atoms & Atom Mutations</h1>
        <p className="text-xl text-muted-foreground">
          Co-locate business logic with state using action atoms for mutations and side-effects
        </p>
      </div>

      <Card className="bg-purple-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-purple-600" />
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
              <Code className="h-5 w-5 text-blue-600" />
              Action Without Payload
            </CardTitle>
            <CardDescription>
              Simple actions that don't require parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              For actions that don't need any input parameters, set the read function to 
              <code className="bg-muted px-1 rounded mx-1">null</code>.
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-green-600" />
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-orange-600" />
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-600" />
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
    const response = await fetch("http://google.com")
    return response.json()
})

// Usage in component:
const performAsyncAction = useSetAtom(asyncAction)

const handleClick = async () => {
    try {
        const result = await performAsyncAction()
        console.log('Action completed:', result)
    } catch (error) {
        console.error('Action failed:', error)
    }
}`}
            </CodeBlock>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🔧</span>
              Complex Example: User Management
            </CardTitle>
            <CardDescription>
              A real-world example showing multiple action atoms working together
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock language="typescript">
{`const userAtom = atom<User | null>(null)
const loadingAtom = atom(false)
const errorAtom = atom<string | null>(null)

// Action to fetch user data
const fetchUserAction = atom(null, async (get, set, userId: string) => {
    set(loadingAtom, true)
    set(errorAtom, null)
    
    try {
        const response = await fetch(\`/api/users/\${userId}\`)
        if (!response.ok) throw new Error('Failed to fetch user')
        
        const user = await response.json()
        set(userAtom, user)
    } catch (error) {
        set(errorAtom, error.message)
    } finally {
        set(loadingAtom, false)
    }
})

// Action to update user profile
const updateUserAction = atom(null, async (get, set, updates: Partial<User>) => {
    const currentUser = get(userAtom)
    if (!currentUser) return
    
    set(loadingAtom, true)
    
    try {
        const response = await fetch(\`/api/users/\${currentUser.id}\`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        })
        
        if (!response.ok) throw new Error('Failed to update user')
        
        const updatedUser = await response.json()
        set(userAtom, updatedUser)
    } catch (error) {
        set(errorAtom, error.message)
    } finally {
        set(loadingAtom, false)
    }
})

// Clear all user data
const clearUserAction = atom(null, (get, set) => {
    set(userAtom, null)
    set(errorAtom, null)
    set(loadingAtom, false)
})`}
            </CodeBlock>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">💡</span>
              Key Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Co-location:</strong> Business logic lives next to the state it modifies</li>
              <li><strong>Atomic updates:</strong> Multiple state changes happen in a single operation</li>
              <li><strong>Type safety:</strong> Full TypeScript support for payloads and return types</li>
              <li><strong>Composability:</strong> Action atoms can call other action atoms</li>
              <li><strong>Async support:</strong> Built-in support for promises and async operations</li>
              <li><strong>Testability:</strong> Easy to test in isolation with mock stores</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}