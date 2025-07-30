import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/concepts/declaring-atoms')({
  component: DeclaringAtomsComponent,
})

function DeclaringAtomsComponent() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Structuring Atoms</h1>
        <p className="text-xl text-muted-foreground">
          Essential patterns for organizing atomic state in scalable applications
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
            Since all state in Jotai is defined in atoms, it's imperative that you have a clear structure 
            for your atoms. Otherwise your state will get smeared throughout your app, making it extremely 
            difficult to work with.
          </p>
          <p className="mt-2">
            <strong>Domain-driven organization</strong> works best: define all atoms that belong to a given domain together.
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
              This makes it easier to derive other atoms and makes it easier to reason about state when 
              refactoring your code or implementing new features.
            </p>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="font-semibold text-green-700 dark:text-green-300">Do</span>
                </div>
                <CodeBlock language="typescript">
{`const currentDateAtom = atom(new Date())
const selectedDate = atom(null)
const isLoadingState = atom({isLoading: false, isLoadingMore: false})

// Checking for usages of currentDate will yield only results where it's explicitly used
const derived = atom((get) => get(currentDateAtom))`}
                </CodeBlock>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <span className="font-semibold text-red-700 dark:text-red-300">Don't</span>
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
              deriving values ensures consistency - derived atoms automatically update when their dependencies change, 
              eliminating the need to manually keep related state in sync.
            </p>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="font-semibold text-green-700 dark:text-green-300">Do</span>
                </div>
                <CodeBlock language="typescript">
{`const queryAtom = atom('hello world')
const hasQueryAtom = atom((get) => !!get(queryAtom))`}
                </CodeBlock>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <span className="font-semibold text-red-700 dark:text-red-300">Don't</span>
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
              Domain-Based Organization
            </CardTitle>
            <CardDescription>
              Group related atoms together by business domain, not technical function
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Organizing atoms by domain makes it easier to understand, maintain, and refactor your state management. 
              Each domain becomes a cohesive unit with clear boundaries.
            </p>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="font-semibold text-green-700 dark:text-green-300">Good Organization</span>
                </div>
                <CodeBlock language="typescript">
{`// user-domain/atoms.ts
export const currentUserAtom = atom(null)
export const userPreferencesAtom = atom({})
export const userPermissionsAtom = atom((get) => {
  const user = get(currentUserAtom)
  return user ? calculatePermissions(user.role) : []
})

// calendar-domain/atoms.ts  
export const selectedDateAtom = atom(new Date())
export const calendarEventsAtom = atom([])
export const filteredEventsAtom = atom((get) => {
  const date = get(selectedDateAtom)
  const events = get(calendarEventsAtom)
  return events.filter(event => isSameDay(event.date, date))
})`}
                </CodeBlock>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <span className="font-semibold text-red-700 dark:text-red-300">Poor Organization</span>
                </div>
                <CodeBlock language="typescript">
{`// ❌ Everything mixed together
const appStateAtom = atom({
  user: null,
  selectedDate: new Date(),
  calendarEvents: [],
  isLoading: false,
  preferences: {}
})

// Hard to understand what this atom actually needs
const someComputedAtom = atom((get) => {
  const state = get(appStateAtom)
  return processUserData(state.user, state.preferences)
})`}
                </CodeBlock>
              </div>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <p className="text-sm">
                <strong>Key insight:</strong> Think of each domain as a mini state management system with its 
                own atoms, derived state, and internal logic. This makes your app easier to reason about and refactor.
              </p>
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
              Now that you understand how to structure and organize atoms effectively, you're ready to 
              learn about composition - how to build complex state from simple atomic building blocks.
            </p>
            <Link 
              to="/concepts/composition" 
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <span>Up next: Atom Composition</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}