import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { Database, Zap, Infinity, RefreshCw } from 'lucide-react'

export const Route = createFileRoute('/utilities/atomWithQuery')({
  component: AtomWithQueryComponent,
})

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
              The example from your notes showing suspense integration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock language="typescript">
{`const myQueryAtom = atomWithSuspenseQuery((get) => ({
    queryKey: ['my-query', get(someAtom)],
    queryFn: () => {
        return fetch(URL + get(params))
    }
}))

const derivedQueryValue = atom(async (get) => {
    const value = await get(myQueryAtom)
    return value.data ?? {}
})`}
            </CodeBlock>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Infinity className="h-5 w-5 text-primary" />
              atomWithInfiniteQuery
            </CardTitle>
            <CardDescription>
              Handling paginated data with infinite scrolling
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock language="typescript">
{`const searchTermAtom = atom('')
const pageSizeAtom = atom(20)

const infinitePostsQuery = atomWithInfiniteQuery((get) => ({
    queryKey: ['posts', get(searchTermAtom)],
    queryFn: async ({ pageParam = 0 }) => {
        const searchTerm = get(searchTermAtom)
        const pageSize = get(pageSizeAtom)
        
        const response = await fetch(
            \`/api/posts?page=\${pageParam}&limit=\${pageSize}&search=\${searchTerm}\`
        )
        return response.json()
    },
    getNextPageParam: (lastPage, pages) => {
        return lastPage.hasMore ? pages.length : undefined
    },
    initialPageParam: 0,
}))

// Flattened posts derived atom
const allPostsAtom = atom((get) => {
    const queryResult = get(infinitePostsQuery)
    return queryResult.data?.pages.flatMap(page => page.posts) ?? []
})

// Usage component
const InfinitePostList = () => {
    const searchTerm = useAtomValue(searchTermAtom)
    const allPosts = useAtomValue(allPostsAtom)
    const queryResult = useAtomValue(infinitePostsQuery)
    
    const {
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error
    } = queryResult
    
    if (isLoading) return <div>Loading posts...</div>
    if (error) return <div>Error loading posts</div>
    
    return (
        <div>
            {allPosts.map(post => (
                <div key={post.id}>{post.title}</div>
            ))}
            
            {hasNextPage && (
                <button 
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                >
                    {isFetchingNextPage ? 'Loading more...' : 'Load More'}
                </button>
            )}
        </div>
    )
}`}
            </CodeBlock>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              Mutations with atomWithMutation
            </CardTitle>
            <CardDescription>
              Handling data mutations with optimistic updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock language="typescript">
{`const todosQueryAtom = atomWithQuery(() => ({
    queryKey: ['todos'],
    queryFn: () => fetch('/api/todos').then(res => res.json())
}))

const addTodoMutation = atomWithMutation((get) => ({
    mutationFn: async (newTodo: { title: string }) => {
        const response = await fetch('/api/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTodo)
        })
        return response.json()
    },
    onMutate: async (newTodo) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({ queryKey: ['todos'] })
        
        // Snapshot previous value
        const previousTodos = queryClient.getQueryData(['todos'])
        
        // Optimistically update
        queryClient.setQueryData(['todos'], (old: any) => [
            ...old,
            { id: Date.now(), ...newTodo, completed: false }
        ])
        
        return { previousTodos }
    },
    onError: (err, newTodo, context) => {
        // Rollback on error
        queryClient.setQueryData(['todos'], context?.previousTodos)
    },
    onSettled: () => {
        // Always refetch after error or success
        queryClient.invalidateQueries({ queryKey: ['todos'] })
    }
}))

const TodoApp = () => {
    const { data: todos = [], isLoading } = useAtomValue(todosQueryAtom)
    const { mutate: addTodo, isPending } = useAtomValue(addTodoMutation)
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const title = formData.get('title') as string
        
        if (title.trim()) {
            addTodo({ title: title.trim() })
            e.currentTarget.reset()
        }
    }
    
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input name="title" placeholder="Add todo..." />
                <button type="submit" disabled={isPending}>
                    {isPending ? 'Adding...' : 'Add'}
                </button>
            </form>
            
            {isLoading ? (
                <div>Loading todos...</div>
            ) : (
                <ul>
                    {todos.map((todo: any) => (
                        <li key={todo.id}>{todo.title}</li>
                    ))}
                </ul>
            )}
        </div>
    )
}`}
            </CodeBlock>
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

        <Card className="bg-muted/30 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🚧</span>
              Coming Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Additional patterns and advanced examples will be added here, including:
            </p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-muted-foreground">
              <li>Custom query client configuration</li>
              <li>SSR and hydration patterns</li>
              <li>Advanced caching strategies</li>
              <li>Error boundary integration</li>
              <li>Real-time data synchronization</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}