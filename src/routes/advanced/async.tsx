import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { Zap, AlertCircle, Loader } from 'lucide-react'

export const Route = createFileRoute('/advanced/async')({
  component: AsyncComponent,
})

function AsyncComponent() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Managing Async</h1>
        <p className="text-xl text-muted-foreground">
          Advanced patterns for handling asynchronous operations, error states, and loading management
        </p>
      </div>

      <Card className="bg-amber-50 border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-amber-600" />
            Async in Jotai
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Jotai has excellent support for async operations. Atoms can be async, and the framework 
            handles promises naturally. This section will be expanded with comprehensive patterns for 
            managing async state in production applications.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader className="h-5 w-5 text-blue-600" />
              Async Atoms with Loading States
            </CardTitle>
            <CardDescription>
              Managing loading and error states for async operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Here's a pattern for managing async operations with explicit loading and error states:
            </p>
            
            <CodeBlock language="typescript">
{`interface AsyncState<T> {
    data: T | null
    loading: boolean
    error: string | null
}

const createAsyncAtom = <T>(fetcher: () => Promise<T>) => {
    const baseAtom = atom<AsyncState<T>>({
        data: null,
        loading: false,
        error: null
    })
    
    const fetchAtom = atom(null, async (get, set) => {
        set(baseAtom, prev => ({ ...prev, loading: true, error: null }))
        
        try {
            const data = await fetcher()
            set(baseAtom, { data, loading: false, error: null })
        } catch (error) {
            set(baseAtom, prev => ({
                ...prev,
                loading: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            }))
        }
    })
    
    return { baseAtom, fetchAtom }
}

// Usage
const { baseAtom: userAtom, fetchAtom: fetchUserAtom } = createAsyncAtom(
    () => fetch('/api/user').then(res => res.json())
)

const UserProfile = () => {
    const { data: user, loading, error } = useAtomValue(userAtom)
    const fetchUser = useSetAtom(fetchUserAtom)
    
    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>
    if (!user) return <button onClick={() => fetchUser()}>Load User</button>
    
    return <div>Welcome, {user.name}!</div>
}`}
            </CodeBlock>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Error Boundaries with Async Atoms
            </CardTitle>
            <CardDescription>
              Handling errors gracefully in async atom operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock language="typescript">
{`// Async atom that can throw errors
const riskyDataAtom = atom(async () => {
    const response = await fetch('/api/risky-endpoint')
    if (!response.ok) {
        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`)
    }
    return response.json()
})

// Wrapper component with error boundary
class AsyncErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }
    
    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }
    
    render() {
        if (this.state.hasError) {
            return (
                <div className="error-fallback">
                    <h2>Something went wrong</h2>
                    <p>{this.state.error?.message}</p>
                    <button onClick={() => this.setState({ hasError: false, error: null })}>
                        Try Again
                    </button>
                </div>
            )
        }
        
        return this.props.children
    }
}`}
            </CodeBlock>
          </CardContent>
        </Card>

        <Card className="bg-gray-50 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🚧</span>
              Content Coming Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This section will be expanded with comprehensive async patterns, including:
            </p>
            <ul className="mt-4 space-y-2 list-disc list-inside text-muted-foreground">
              <li>Suspense integration patterns</li>
              <li>Race condition prevention</li>
              <li>Retry logic and exponential backoff</li>
              <li>Cancellation and cleanup</li>
              <li>Optimistic updates</li>
              <li>Background data fetching</li>
              <li>Error recovery strategies</li>
              <li>Loading state composition</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}