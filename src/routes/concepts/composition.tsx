import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { CheckCircle, XCircle, Lightbulb, ArrowRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { atom, useAtom, useAtomValue } from 'jotai'

export const Route = createFileRoute('/concepts/composition')({
  component: CompositionComponent,
})

// Example atoms for the interactive demo
const firstNameAtom = atom('John')
const lastNameAtom = atom('Doe')
const fullNameAtom = atom(
  (get) => `${get(firstNameAtom)} ${get(lastNameAtom)}`
)
const greetingAtom = atom(
  (get) => `Hello, ${get(fullNameAtom)}!`
)

function CompositionDemo() {
  const [firstName, setFirstName] = useAtom(firstNameAtom)
  const [lastName, setLastName] = useAtom(lastNameAtom)
  const fullName = useAtomValue(fullNameAtom)
  const greeting = useAtomValue(greetingAtom)

  return (
    <div className="space-y-4 p-4 bg-muted rounded-lg">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">First Name</label>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-2 text-sm border rounded"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Last Name</label>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-2 text-sm border rounded"
          />
        </div>
      </div>
      <div className="space-y-2">
        <p><strong>Full Name:</strong> {fullName}</p>
        <p><strong>Greeting:</strong> {greeting}</p>
      </div>
    </div>
  )
}

function CompositionComponent() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Atom Composition</h1>
        <p className="text-xl text-muted-foreground">
          Build complex state by combining simple atoms with derived state patterns
        </p>
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🧩</span>
            The Power of Composition
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            One of Jotai's greatest strengths is how naturally atoms compose. You can build complex state 
            from simple building blocks, creating a network of reactive dependencies that automatically 
            stay in sync.
          </p>
          <p className="mt-2">
            Think of it like building with LEGO blocks - each atom is a simple piece, but when combined, 
            they can create sophisticated state management solutions.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">1️⃣</span>
              Basic Derived Atoms
            </CardTitle>
            <CardDescription>
              Create computed values that automatically update when their dependencies change
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              The simplest form of composition is deriving new state from existing atoms:
            </p>
            
            <CodeBlock language="typescript">
{`const firstNameAtom = atom('John')
const lastNameAtom = atom('Doe')

// Derived atom that combines other atoms
const fullNameAtom = atom(
  (get) => get(firstNameAtom) + ' ' + get(lastNameAtom)
)

// Chain derived atoms for more complex logic  
const greetingAtom = atom(
  (get) => 'Hello, ' + get(fullNameAtom) + '!'
)`}
            </CodeBlock>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Try it yourself:</p>
              <CompositionDemo />
            </div>

            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <p className="text-sm">
                <strong>Key insight:</strong> Notice how changing the first or last name automatically updates 
                both the full name AND the greeting. This is Jotai's automatic dependency tracking at work.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">2️⃣</span>
              Cross-Domain Composition
            </CardTitle>
            <CardDescription>
              Combine atoms from different domains to create application-wide derived state
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Atoms can reference each other across domain boundaries, enabling powerful composition patterns:
            </p>
            
            <CodeBlock language="typescript">
{`// User domain
const currentUserAtom = atom({ id: 1, name: 'Alice', role: 'admin' })
const userPermissionsAtom = atom((get) => {
  const user = get(currentUserAtom)
  return getUserPermissions(user.role)
})

// UI domain  
const sidebarCollapsedAtom = atom(false)
const isMobileAtom = atom(false)

// Composed application state
const showAdvancedFeaturesAtom = atom((get) => {
  const permissions = get(userPermissionsAtom)
  const isMobile = get(isMobileAtom)
  
  return permissions.includes('advanced') && !isMobile
})

const layoutConfigAtom = atom((get) => ({
  sidebarVisible: !get(isMobileAtom),
  sidebarCollapsed: get(sidebarCollapsedAtom),
  showAdvancedFeatures: get(showAdvancedFeaturesAtom)
}))`}
            </CodeBlock>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Best practice:</strong> Use composition to create "view models" - atoms that 
                  combine multiple pieces of state into exactly what your components need.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">3️⃣</span>
              Performance Considerations
            </CardTitle>
            <CardDescription>
              Understanding when and how derived atoms recalculate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="font-semibold text-green-700 dark:text-green-300">Efficient</span>
                </div>
                <CodeBlock language="typescript">
{`// Only recalculates when count changes
const expensiveCalculationAtom = atom((get) => {
  const count = get(countAtom)
  return performExpensiveCalculation(count)
})

// Multiple atoms can depend on the same calculation
const displayValueAtom = atom((get) => 
  formatNumber(get(expensiveCalculationAtom))
)
const chartDataAtom = atom((get) => 
  createChartData(get(expensiveCalculationAtom))
)`}
                </CodeBlock>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <span className="font-semibold text-red-700 dark:text-red-300">Inefficient</span>
                </div>
                <CodeBlock language="typescript">
{`// Recalculates expensive operation twice!
const displayValueAtom = atom((get) => {
  const count = get(countAtom)
  return formatNumber(performExpensiveCalculation(count))
})
const chartDataAtom = atom((get) => {
  const count = get(countAtom)
  return createChartData(performExpensiveCalculation(count))
})`}
                </CodeBlock>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm">
                <strong>Key principle:</strong> Extract expensive computations into their own derived atoms. 
                Jotai's caching ensures they only recalculate when their dependencies actually change.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              Composition Strategies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">Layer by Abstraction</h4>
                <p className="text-sm text-muted-foreground">
                  Build atoms in layers - primitive atoms at the bottom, domain-specific derived atoms in the middle, 
                  and UI-focused atoms at the top.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">Single Responsibility</h4>
                <p className="text-sm text-muted-foreground">
                  Each derived atom should have a single, clear purpose. This makes them easier to test, debug, and reuse.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">Minimize Dependencies</h4>
                <p className="text-sm text-muted-foreground">
                  Only depend on the atoms you actually need. This reduces unnecessary recalculations and makes 
                  your dependency graph cleaner.
                </p>  
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">Name Descriptively</h4>
                <p className="text-sm text-muted-foreground">
                  Use clear, descriptive names that indicate what the atom represents, not how it's calculated.
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
              Now that you understand composition, you're ready to learn about action atoms - a powerful pattern 
              for encapsulating business logic alongside your state.
            </p>
            <Link 
              to="/concepts/action-atoms" 
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <span>Up next: Action Atoms</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}