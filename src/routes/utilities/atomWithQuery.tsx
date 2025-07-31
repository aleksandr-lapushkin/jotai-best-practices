import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { Database, Zap } from 'lucide-react'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { atomWithMutation, atomWithQuery, atomWithSuspenseQuery } from 'jotai-tanstack-query'
import { Code } from '@/components/ui/code'
import { Button } from '@/components/ui/button'
import { Suspense } from 'react'
import { atomEffect } from 'jotai-effect'

export const Route = createFileRoute('/utilities/atomWithQuery')({
  component: AtomWithQueryComponent,
})

const someAtom = atom(1)

const myQueryAtom = atomWithSuspenseQuery((get) => ({
  queryKey: ['my-query', get(someAtom)],
  queryFn: async () => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${get(someAtom)}`)
    return response.json() as Promise<Todo>
  }
}))

const otherAtom = atom(1)
const nonSuspendingQueryAtom = atomWithQuery((get) => ({
  queryKey: ['my-non-suspending-query', get(otherAtom)],
  queryFn: async () => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${get(otherAtom)}`)
    return response.json() as Promise<Todo>
  }
}))

function SuspendingQueryExample() {
  const data = useAtomValue(myQueryAtom)
  const [someAtomValue, setSomeAtom] = useAtom(someAtom)
  return (
    <div className='space-y-4'>
      <div className="flex gap-2">
      <Button onClick={() => setSomeAtom((prev) => prev + 1)}>
        Increment ID Value
      </Button>
      <Code>
        Current ID: {someAtomValue}
        </Code>
      </div>
      <h2 className="mt-4 text-lg font-semibold">Query Result:</h2>
      <CodeBlock language='json'>{data.isSuccess ? JSON.stringify(data.data) : 'Loading...'}</CodeBlock>
    </div>
  )
}

function NonSuspendingQueryExample() {
  const data = useAtomValue(nonSuspendingQueryAtom)
  const [someAtomValue, setSomeAtom] = useAtom(otherAtom)
  return (
    <div className='space-y-4'>
      <div className="flex gap-2">
      <Button onClick={() => setSomeAtom((prev) => prev + 1)}>
        Increment ID Value
      </Button>
      <Code>
        Current ID: {someAtomValue}
        </Code>
      </div>
      <h2 className="mt-4 text-lg font-semibold">Query Result:</h2>
      <CodeBlock language='json'>{data.isSuccess ? JSON.stringify(data.data) : 'Loading...'}</CodeBlock>
    </div>
  )
}

const todoData = atom(async (get) => {
  const result = await get(myQueryAtom)

  return result.data
})

 
const mutableTodoData = atom<Todo | null>(null)
const todoAtomEffect = atomEffect((get, set) => {
  get(todoData).then((res)=> set(mutableTodoData, res))
})
const currentTodoData = atom((get) => {
  get(todoAtomEffect)
  return get(mutableTodoData)
})

type Todo = {
  id: number
  completed: boolean
}


const mutationAtom = atomWithMutation(() => ({
  mutationFn: (data: { id: number, completed: true }) => {
    return fetch(`https://jsonplaceholder.typicode.com/todos/${data.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        id: data.id,
        completed: data.completed,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    .then((response) => response.json())
  }
}))

const updateTodo = atom(null, async (get, set, data: { id: number, completed: true }) => {
  set(mutableTodoData, (curr) => (curr ? { ...curr, completed: data.completed } : null))
  get(mutationAtom).mutate(data)
  
})

function AtomWithMutationExample() {
  
  const todo = useAtomValue(currentTodoData)
  const updateTodoValue = useSetAtom(updateTodo)

  return (
    <div className='space-y-4'>
      <h2 className="text-lg font-semibold">Todo Item:</h2>
      <CodeBlock language='json'>{todo ? JSON.stringify(todo) : 'No todo selected'}</CodeBlock>
      <Button onClick={() => updateTodoValue({ id: todo?.id || 1, completed: true })}>
        Mark as Completed
      </Button>
    </div>
  )
}

function AtomWithQueryComponent() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">atomWithQuery Variants</h1>
        <p className="text-xl text-muted-foreground">
          Integration with TanStack Query for powerful data fetching and caching
        </p>
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6 text-primary" />
            TanStack Query Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Getting into 3rd-party integrations, <code className="bg-muted px-1 rounded">atomWithQuery</code> and its 
            siblings (suspending, infinite, etc) are wrappers around TanStack Query that provide seamless 
            integration with Jotai's atomic state management.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Basic atomWithSuspenseQuery
            </CardTitle>
            <CardDescription>
              Using atomWithSuspenseQuery to fetch data using TanStack Query
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock language="typescript">
              {`const someAtom = atom(1)
const myQueryAtom = atomWithSuspenseQuery((get) => ({
    queryKey: ['my-query', get(someAtom)],
    queryFn: () => {
        return fetch(\`https://jsonplaceholder.typicode.com/todos/\${get(someAtom)}\`)
    }
}))

const SuspendingQueryExample = () => {
    const data = useAtomValue(myQueryAtom)
    const [someAtomValue, setSomeAtom] = useAtom(someAtom)
    return (
        <>
            <Button onClick={() => setSomeAtom((prev) => prev + 1)}>
                Increment ID Value
            </Button>
            <Code className="mt-4">
                Current ID: {someAtomValue}
            </Code>
            <h2 className="mt-4 text-lg font-semibold">Query Result:</h2>
            <CodeBlock language='json'>{data.isSuccess ? JSON.stringify(data.data) : 'Loading...'}</CodeBlock>
        </>
    )
}`}
            </CodeBlock>
            <Suspense fallback={<div>A suspense fallback!</div>}>
              <SuspendingQueryExample />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Standard atomWithQuery
            </CardTitle>
            <CardDescription>
              Non-suspending query integration with loading states
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock language="typescript">
{`const userAtom = atom('')

const userProfileQuery = atomWithQuery((get) => ({
    queryKey: ['user-profile', get(userAtom)],
    queryFn: async ({ queryKey }) => {
        const [, userId] = queryKey
        if (!userId) return null
        
        const response = await fetch(\`/api/users/\${userId}\`)
        if (!response.ok) throw new Error('Failed to fetch user')
        return response.json()
    },
    enabled: !!get(userAtom), // Only run query when user ID exists
}))

// Usage in component
const UserProfile = () => {
    const [userId, setUserId] = useAtom(userAtom)
    const { data, isLoading, error, refetch } = useAtomValue(userProfileQuery)
    
    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>
    if (!data) return <div>No user selected</div>
    
    return (
        <div>
            <h2>{data.name}</h2>
            <p>{data.email}</p>
            <button onClick={() => refetch()}>Refresh</button>
        </div>
    )
}`}
            </CodeBlock>
            <NonSuspendingQueryExample />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Mutations with optimistic updates
            </CardTitle>
            <CardDescription>
              Using atomWithMutation for optimistic updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock language="typescript">
{`const todoData = atom(async (get) => {
  const result = await get(myQueryAtom)

  return result.data
})

 
const mutableTodoData = atom<Todo | null>(null)
const todoAtomEffect = atomEffect((get, set) => {
  get(todoData).then((res)=> set(mutableTodoData, res))
})
const currentTodoData = atom((get) => {
  get(todoAtomEffect)
  return get(mutableTodoData)
})

type Todo = {
  id: number
  completed: boolean
}


const mutationAtom = atomWithMutation(() => ({
  mutationFn: (data: { id: number, completed: true }) => {
    return fetch(\`https://jsonplaceholder.typicode.com/todos/\${data.id}\`, {
      method: 'PATCH',
      body: JSON.stringify({
        id: data.id,
        completed: data.completed,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    .then((response) => response.json())
  }
}))

const updateTodo = atom(null, async (get, set, data: { id: number, completed: true }) => {
  set(mutableTodoData, (curr) => (curr ? { ...curr, completed: data.completed } : null))
  get(mutationAtom).mutate(data)
  
})

function AtomWithMutationExample() {
  const todo = useAtomValue(currentTodoData)
  const updateTodoValue = useSetAtom(updateTodo)

  return (
    <div className='space-y-4'>
      <h2 className="text-lg font-semibold">Todo Item:</h2>
      <CodeBlock language='json'>{todo ? JSON.stringify(todo) : 'No todo selected'}</CodeBlock>
      <Button onClick={() => updateTodoValue({ id: todo?.id || 1, completed: true })}>
        Mark as Completed
      </Button>
    </div>
  )
}`}
              </CodeBlock>
            <AtomWithMutationExample />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-secondary/30 to-secondary/10 border-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">✨</span>
              Key Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc list-inside text-muted-foreground">
              <li><strong className="text-foreground">Automatic caching:</strong> Leverage TanStack Query's powerful caching system</li>
              <li><strong className="text-foreground">Background refetching:</strong> Keep data fresh with automatic updates</li>
              <li><strong className="text-foreground">Optimistic updates:</strong> Provide instant feedback with rollback on errors</li>
              <li><strong className="text-foreground">Suspense integration:</strong> Use React Suspense for loading states</li>
              <li><strong className="text-foreground">Reactive dependencies:</strong> Queries automatically refetch when atoms change</li>
              <li><strong className="text-foreground">Error handling:</strong> Built-in error states and retry logic</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}