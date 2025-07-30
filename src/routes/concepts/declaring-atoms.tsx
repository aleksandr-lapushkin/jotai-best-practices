import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { CheckCircle, XCircle } from 'lucide-react'

export const Route = createFileRoute('/concepts/declaring-atoms')({
  component: DeclaringAtomsComponent,
})

function DeclaringAtomsComponent() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Declaring and Structuring Atoms</h1>
        <p className="text-xl text-muted-foreground">
          Best practices for organizing atomic state to keep your application maintainable and performant
        </p>
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🏗️</span>
            Core Principle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Since all state in Jotai is defined in Atoms, it's imperative that you have a clear structure 
            for your Atoms. Otherwise your state will get smeared throughout your app, making it extremely 
            difficult to work with.
          </p>
          <p className="mt-2">
            An approach that works relatively well is to define all Atoms that belong to a given domain together.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">1️⃣</span>
              Prefer Small Pieces of State
            </CardTitle>
            <CardDescription>
              Use small, focused atoms unless data is always mutated together
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              This makes it easier to derive other atoms and makes it easier to reason about state.
            </p>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="font-semibold text-green-700 dark:text-green-300">Do ✅</span>
                </div>
                <CodeBlock language="typescript">
{`const currentDateAtom = atom(new Date())
const selectedDate = atom(null)
const isLoadingState = atom({isLoading: false, isLoadingMore: false})

// Checking for usages of currentDate will yield only results where it's explicitly used
const derived = atom((get) => get(currentDate))`}
                </CodeBlock>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <span className="font-semibold text-red-700 dark:text-red-300">Don't ❌</span>
                </div>
                <CodeBlock language="typescript">
{`const state = atom({currentDate: new Date(), selectedDate: null})

// Checking for usages of state will pick this one up. But selectedDate isn't even used here!
const derived = atom((get) => get(state).currentDate)`}
                </CodeBlock>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">2️⃣</span>
              Derive State Where Possible
            </CardTitle>
            <CardDescription>
              Minimize manual state updates by deriving values from existing state
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              The less state we need to update manually, the fewer error vectors we have. Moreover, 
              deriving values prevents race conditions or multiple updates. Any call to Jotai's 
              <code className="bg-muted px-1 rounded mx-1">set</code> is immediate. Multiple sequential 
              calls technically <strong>could</strong> cause multiple re-renders with inconsistent state in-between.
            </p>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="font-semibold text-green-700 dark:text-green-300">Do ✅</span>
                </div>
                <CodeBlock language="typescript">
{`const queryAtom = atom('hello world')
const hasQueryAtom = atom((get) => !!get(queryAtom))`}
                </CodeBlock>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <span className="font-semibold text-red-700 dark:text-red-300">Don't ❌</span>
                </div>
                <CodeBlock language="typescript">
{`const queryAtom = atom('hello world')
const hasQueryAtom = atom(true)

// In component:
const query = useAtomValue(queryAtom)
const [hasQuery, setHasQuery] = useAtom(hasQueryAtom)
useEffect(() => {
    setHasQuery(!!query)
}, [query])`}
                </CodeBlock>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">3️⃣</span>
              Group State Mutations with Action Atoms
            </CardTitle>
            <CardDescription>
              Centralize related state changes to prevent inconsistent intermediate states
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              This ensures that we always mutate all atoms once from a centralized location with the 
              latest values. This helps prevent (but not fully stop) React from rendering the component 
              between calls to mutators.
            </p>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="font-semibold text-green-700 dark:text-green-300">Do ✅</span>
                </div>
                <CodeBlock language="typescript">
{`const myState = atom('test')
const myOtherState = atom(5)

const mutateState = atom(null, (get, set, payload: {myStateValue: string, add: number}) => {
    set(myState, payload.myStateValue)
    set(myOtherState, (curr) => curr + payload.add)
})

// In component:
const mutateAction = useSetAtom(mutateState)
mutateAction({myStateValue: 'ayy', add: 2})`}
                </CodeBlock>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <span className="font-semibold text-red-700 dark:text-red-300">Don't ❌</span>
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
              <span className="text-2xl">4️⃣</span>
              Use Direct Atom Access Over Facade Hooks
            </CardTitle>
            <CardDescription>
              Read atoms and actions directly for better performance and easier testing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              This allows consumers to mount only the atoms they require, leading to a smaller 
              performance overhead and easier testing.
            </p>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="font-semibold text-green-700 dark:text-green-300">Do ✅</span>
                </div>
                <CodeBlock language="typescript">
{`const myAtom = atom("hello")
const mutateMyAtom = atom(null, (get, set, payload: string) => set(myAtom, \`hello \${payload}\`))

// In component:
const myAtomValue = useAtomValue(myAtom)
const mutateMyAtomCallback = useSetAtom(mutateMyAtom)`}
                </CodeBlock>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <span className="font-semibold text-red-700 dark:text-red-300">Don't ❌</span>
                </div>
                <CodeBlock language="typescript">
{`// Somewhere outside the component
const useMyState = () => {
    const myAtomValue = useAtomValue(myAtom)
    const mutateMyAtomCallback = useSetAtom(mutateMyAtom)
    
    return {
        myAtomValue,
        mutateMyAtomCallback
    }
}

// In component
const { myAtomValue, mutateMyAtomCallback } = useMyState()`}
                </CodeBlock>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}