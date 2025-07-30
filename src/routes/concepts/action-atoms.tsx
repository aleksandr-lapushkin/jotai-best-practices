import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { CheckCircle, XCircle, ArrowRight, AlertTriangle } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export const Route = createFileRoute('/concepts/action-atoms')({
  component: ActionAtomsComponent,
})

// Example atoms for demos
const userNameAtom = atom('John Doe')
const userEmailAtom = atom('john@example.com')
const isLoadingAtom = atom(false)
const errorAtom = atom<string | null>(null)

const updateUserAtom = atom(
  null,
  async (_, set, userData: { name: string; email: string }) => {
    set(isLoadingAtom, true)
    set(errorAtom, null)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      set(userNameAtom, userData.name)
      set(userEmailAtom, userData.email)
    } catch (error) {
      set(errorAtom, error instanceof Error ? error.message : 'Unknown error')
    } finally {
      set(isLoadingAtom, false)
    }
  }
)

const resetUserAtom = atom(
  null,
  (_, set) => {
    set(userNameAtom, '')
    set(userEmailAtom, '')
    set(errorAtom, null)
    set(isLoadingAtom, false)
  }
)

function ActionAtomDemo() {
  const userName = useAtomValue(userNameAtom)
  const userEmail = useAtomValue(userEmailAtom)
  const isLoading = useAtomValue(isLoadingAtom)
  const error = useAtomValue(errorAtom)
  const updateUser = useSetAtom(updateUserAtom)
  const resetUser = useSetAtom(resetUserAtom)

  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')

  const handleUpdate = () => {
    updateUser({ name: formName || 'Jane Smith', email: formEmail || 'jane@example.com' })
  }

  return (
    <div className="space-y-4 p-4 bg-muted rounded-lg">
      <div className="space-y-2">
        <p><strong>Current Name:</strong> {userName}</p>
        <p><strong>Current Email:</strong> {userEmail}</p>
        {isLoading && <p className="text-primary">Loading...</p>}
        {error && <p className="text-destructive">Error: {error}</p>}
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <input
          placeholder="New name"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          className="p-2 text-sm border rounded"
        />
        <input
          placeholder="New email"
          value={formEmail}
          onChange={(e) => setFormEmail(e.target.value)}
          className="p-2 text-sm border rounded"
        />
      </div>
      
      <div className="flex gap-2">
        <Button onClick={handleUpdate} disabled={isLoading} size="sm">
          Update User
        </Button>
        <Button onClick={resetUser} variant="outline" size="sm">
          Reset
        </Button>
      </div>
    </div>
  )
}

function ActionAtomsComponent() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Action Atoms</h1>
        <p className="text-xl text-muted-foreground">
          Encapsulate business logic alongside state management with write-only atoms
        </p>
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            What Are Action Atoms?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Action atoms are write-only atoms that encapsulate business logic and coordinate state changes 
            across multiple atoms. They're perfect for operations that need to update several pieces of 
            state in a coordinated way, like API calls, form submissions, or complex state transitions.
          </p>
          <p className="mt-2">
            Think of them as "methods" for your state - they define what operations are possible and 
            ensure they happen correctly and consistently.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">1️⃣</span>
              Basic Action Atom Pattern
            </CardTitle>
            <CardDescription>
              The fundamental structure of write-only atoms for business logic
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Action atoms use the two-parameter form of <code>atom()</code> where the first parameter 
              is <code>null</code> (no read function) and the second is the write function:
            </p>
            
            <CodeBlock language="typescript">
{`// Basic action atom structure
const actionAtom = atom(
  null,  // No read function - this is write-only
  (get, set, ...args) => {
    // Business logic goes here
    // Update other atoms as needed
  }
)

// Example: Simple state update action
const updateUserNameAtom = atom(
  null,
  (get, set, newName: string) => {
    set(userNameAtom, newName)
    set(lastUpdatedAtom, new Date())
  }
)`}
            </CodeBlock>

            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <p className="text-sm">
                <strong>Key insight:</strong> The write function receives <code>get</code> for reading current state, 
                <code>set</code> for updating atoms, and any arguments passed when the action is called.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">2️⃣</span>
              Coordinating Multiple State Updates
            </CardTitle>
            <CardDescription>
              Use action atoms to ensure related state changes happen together
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              <strong>Group state mutations together into Action Atoms.</strong> This ensures that we always mutate 
              all atoms once from a centralized location with the latest values. This helps prevent (but not fully stop) 
              React from rendering the component between calls to mutators.
            </p>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="font-semibold text-green-700 dark:text-green-300">Do: Centralized Mutations</span>
                </div>
                <CodeBlock language="typescript">
{`const myState = atom('test')
const myOtherState = atom(5)

const mutateState = atom(null, (get, set, payload: {myStateValue: string, add: number}) => {
    set(myState, payload.myStateValue)
    set(myOtherState, (curr) => curr + payload.add)
})

// Usage
const mutateAction = useSetAtom(mutateState)
mutateAction({myStateValue: 'ayy', add: 2})`}
                </CodeBlock>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <span className="font-semibold text-red-700 dark:text-red-300">Don't: Scattered Component Logic</span>
                </div>
                <CodeBlock language="typescript">
{`const [myStateValue, setMyState] = useAtom(myState)
const [myOtherStateValue, setMyOtherState] = useAtom(myOtherState)

const mutateState = useCallback((payload: {myStateValue: string, add: number}) => {
    setMyState(payload.myStateValue)
    setMyOtherState((curr) => curr + payload.add)
}, [])

mutateState({myStateValue: 'ayy', add: 2})`}
                </CodeBlock>
              </div>
            </div>

            <p>
              One of the main benefits of this approach is coordinating updates across multiple atoms 
              to prevent inconsistent intermediate states:
            </p>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="font-semibold text-green-700 dark:text-green-300">Good: Coordinated Updates</span>
                </div>
                <CodeBlock language="typescript">
{`const userAtom = atom({ name: '', email: '' })
const isLoadingAtom = atom(false)
const errorAtom = atom(null)

const updateUserAtom = atom(
  null,
  async (get, set, userData: { name: string; email: string }) => {
    set(isLoadingAtom, true)
    set(errorAtom, null)
    
    try {
      const response = await updateUserAPI(userData)
      set(userAtom, response.user)
    } catch (error) {
      set(errorAtom, error.message)
    } finally {
      set(isLoadingAtom, false)
    }
  }
)`}
                </CodeBlock>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <span className="font-semibold text-red-700 dark:text-red-300">Poor: Scattered Updates</span>
                </div>
                <CodeBlock language="typescript">
{`// In a component - logic scattered, error-prone
const [user, setUser] = useAtom(userAtom)
const [isLoading, setLoading] = useAtom(isLoadingAtom)
const [error, setError] = useAtom(errorAtom)

const updateUser = async (userData) => {
  setLoading(true)
  setError(null)
  
  try {
    const response = await updateUserAPI(userData)
    setUser(response.user)
  } catch (error) {
    setError(error.message)
  } finally {
    setLoading(false)  // Easy to forget!
  }
}`}
                </CodeBlock>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Try the coordinated approach:</p>
              <ActionAtomDemo />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">3️⃣</span>
              Action Atom Composition
            </CardTitle>
            <CardDescription>
              Build complex operations by combining simpler action atoms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Action atoms can call other action atoms, allowing you to build complex operations 
              from simpler, reusable pieces:
            </p>
            
            <CodeBlock language="typescript">
{`// Basic actions
const setUserNameAtom = atom(null, (get, set, name: string) => {
  set(userNameAtom, name)
})

const setUserEmailAtom = atom(null, (get, set, email: string) => {
  set(userEmailAtom, email)
})

const logUserUpdateAtom = atom(null, (get, set) => {
  const user = get(userAtom)
  console.log('User updated:', user)
  set(lastUpdatedAtom, new Date())
})

// Composed action that uses other actions
const updateUserProfileAtom = atom(
  null,
  (get, set, { name, email }: { name: string; email: string }) => {
    set(setUserNameAtom, name)
    set(setUserEmailAtom, email)
    set(logUserUpdateAtom)
  }
)

// Even more complex composition
const resetAndUpdateUserAtom = atom(
  null,
  (get, set, userData: { name: string; email: string }) => {
    set(resetUserAtom)  // Clear everything first
    set(updateUserProfileAtom, userData)  // Then update
  }
)`}
            </CodeBlock>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Best practice:</strong> Keep individual action atoms focused on a single responsibility, 
                  then compose them for complex operations. This makes testing and debugging much easier.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🚀</span>
              Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Now you understand how to encapsulate business logic with action atoms. Next, you'll learn 
              about exporting atoms - how to create clean APIs that control access to your state.
            </p>
            <Link 
              to="/concepts/exporting-atoms" 
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <span>Up next: Exporting & Boundaries</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}