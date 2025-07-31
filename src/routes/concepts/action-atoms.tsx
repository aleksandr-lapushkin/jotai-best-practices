import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { Code } from '@/components/ui/code'

export const Route = createFileRoute('/concepts/action-atoms')({
  component: ActionAtomsComponent,
})

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
              Action atoms use the two-parameter form of <Code>atom()</Code> where the first parameter 
              is <Code>null</Code> (no read function) and the second is the write function:
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
      </div>
    </div>
  )
}