import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { Lock, Share, CheckCircle, XCircle, ArrowRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/concepts/exporting-atoms')({
  component: ExportingAtomsComponent,
})

function ExportingAtomsComponent() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Exporting & Boundaries</h1>
        <p className="text-xl text-muted-foreground">
          Design clean APIs that control access to your state and maintain domain boundaries
        </p>
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🌯</span>
            Creating Domain Boundaries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Just like good API design, your atom exports should be intentional and controlled. 
            By carefully choosing what you expose, you create clear boundaries between domains 
            and prevent unauthorized access to internal state.
          </p>
          <p className="mt-2">
            Think of it as designing the "public interface" of your state domain - what operations 
            should other parts of your application be allowed to perform?
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              Problematic Pattern
            </CardTitle>
            <CardDescription>
              What happens when you export atoms directly without boundaries
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              This example shows how direct atom exports can lead to uncontrolled state mutations:
            </p>
            
            <CodeBlock language="typescript">
{`// atoms.ts
export const pageAtom = atom(0)

export const dataAtom = atom((get) => {
    return fetch(URL + \`?page=\${get(pageAtom)}\`)
})

// MyComponent.tsx
// No bounding on the page changes can lead to page going over the max or below minimum
const MyComponent = () => {
    const myData = useAtomValue(dataAtom)
    const updatePage = useSetAtom(pageAtom)

    return (
        <DataTable data={myData}>
            <Pagination 
                onNext={() => updatePage(p => p + 1)}
                onPrevious={() => updatePage(p => p - 1)}
            />
        </DataTable>
    )
}`}
            </CodeBlock>
            
            <div className="bg-destructive/10 border-l-4 border-destructive p-4">
              <p className="text-sm text-destructive-foreground">
                <strong>Issues:</strong> Page can go negative, exceed maximum pages, or be set to invalid values. 
                No validation or business logic enforcement.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Solution 1: Controlled Write API
            </CardTitle>
            <CardDescription>
              Expose atoms with narrow, controlled mutation APIs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              The correct approach is to always allow a <strong>very narrow, very specific</strong> set 
              of operations on the data to the outside world.
            </p>
            
            <CodeBlock language="typescript">
{`// atoms.ts
const _pageAtom = atom(0)

// Expose an atom that returns the value of the underlying atom 
// and exposes a very narrow API on the underlying data
export const pageAtom = atom(
    (get) => get(_pageAtom), 
    (get, set, payload: {type: "add" | "sub", amount: number} = {type: "add", amount: 1}) => {
        set(_pageAtom, (current) => {
            const newValue = payload.type === "add" ? current + payload.amount : current - payload.amount
            const clamped = Math.max(0, newValue)
            return clamped
        })
    }
)

export const dataAtom = atom((get) => {
    return fetch(URL + \`?page=\${get(_pageAtom)}\`)
})

// MyComponent.tsx
// Now the consumer can't modify the data to be incorrect!
const MyComponent = () => {
    const myData = useAtomValue(dataAtom)
    const updatePage = useSetAtom(pageAtom)

    return (
        <DataTable data={myData}>
            <Pagination 
                onNext={() => updatePage({type: "add"})}
                onPrevious={() => updatePage({type: "sub"})}
            />
        </DataTable>
    )
}`}
            </CodeBlock>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share className="h-5 w-5 text-primary" />
              Solution 2: Action Atom Approach
            </CardTitle>
            <CardDescription>
              Use dedicated action atoms for controlled mutations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              You could also just expose a single action atom with validation built-in:
            </p>
            
            <CodeBlock language="typescript">
{`// atoms.ts
const _pageAtom = atom(0)

// You could also just expose a single action atom
export const updatePageActionAtom = atom(null, (get, set, payload: {amount: number}) => {
    set(_pageAtom, (curr) => Math.max(0, curr + payload.amount))
})

export const pageAtom = atom((get) => get(_pageAtom)) // Read-only export

export const dataAtom = atom((get) => {
    return fetch(URL + \`?page=\${get(_pageAtom)}\`)
})

// MyComponent.tsx
const MyComponent = () => {
    const myData = useAtomValue(dataAtom)
    const currentPage = useAtomValue(pageAtom)
    const updatePage = useSetAtom(updatePageActionAtom)

    return (
        <DataTable data={myData}>
            <Pagination 
                currentPage={currentPage}
                onNext={() => updatePage({amount: 1})}
                onPrevious={() => updatePage({amount: -1})}
            />
        </DataTable>
    )
}`}
            </CodeBlock>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Cross-Domain Read-Only Access
            </CardTitle>
            <CardDescription>
              Safe pattern for reading atoms across domain boundaries
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              If you need to read data from atoms within atoms across domain bounds, export a readonly version. 
              This ensures that control over the data is still localized to the domain where the atom is defined.
            </p>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="font-semibold text-green-700 dark:text-green-300">Do</span>
                </div>
                <CodeBlock language="typescript">
{`const currentDateAtom = atom(new Date())
const readonlyCurrentDateAtom = atom((get) => get(currentDateAtom))

export const Atoms = {
    currentDate: readonlyCurrentDateAtom
}`}
                </CodeBlock>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <span className="font-semibold text-red-700 dark:text-red-300">Don't</span>
                </div>
                <CodeBlock language="typescript">
{`export const currentDateAtom = atom(new Date())`}
                </CodeBlock>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">⚖️</span>
              Cross-Domain Mutation Guidelines
            </CardTitle>
            <CardDescription>
              When and how to allow state mutations across domain boundaries
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              <strong>Prefer to write code that minimizes atom mutations across domain boundaries.</strong> 
              Export Action Atoms if there's no other way, but always with careful consideration.
            </p>
            
            <div className="space-y-3">
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-800 dark:text-green-200">
                  <strong>✅ Preferred:</strong> Keep mutations within the same domain where the atoms are defined
                </p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>⚠️ Acceptable:</strong> Export specific action atoms for cross-domain operations with clear contracts
                </p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-800 dark:text-red-200">
                  <strong>❌ Avoid:</strong> Direct writable atom exports that allow unrestricted mutations
                </p>
              </div>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <p className="text-sm">
                <strong>Design principle:</strong> Each domain should be the authoritative source for its own state. 
                Cross-domain mutations should be rare, explicit, and well-defined.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📚</span>
              Direct Usage vs Facade Hooks
            </CardTitle>
            <CardDescription>
              Prefer to read atoms and actions directly rather than via facade hooks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              This allows consumers to mount only the atoms they require, leading to smaller performance 
              overhead and easier testing. Avoid wrapping atoms in custom hooks unless you have a compelling reason.
            </p>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="font-semibold text-green-700 dark:text-green-300">Do: Direct Usage</span>
                </div>
                <CodeBlock language="typescript">
{`const myAtom = atom("hello")
const mutateMyAtom = atom(null, (get, set, payload: string) => 
  set(myAtom, \`hello \${payload}\`)
)

// In component
const myAtomValue = useAtomValue(myAtom)
const mutateMyAtomCallback = useSetAtom(mutateMyAtom)`}
                </CodeBlock>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <span className="font-semibold text-red-700 dark:text-red-300">Don't: Facade Hooks</span>
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

            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <p className="text-sm">
                <strong>Why this matters:</strong> Direct usage allows React to optimize subscriptions more effectively 
                and makes it clearer which atoms each component actually depends on.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-secondary/30 to-secondary/10 border-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">✨</span>
              Best Practices Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc list-inside text-muted-foreground">
              <li><strong className="text-foreground">Never export writable atoms directly</strong> across domain boundaries</li>
              <li><strong className="text-foreground">Use read-only atom wrappers</strong> for cross-domain data access</li>
              <li><strong className="text-foreground">Expose specific action atoms</strong> with built-in validation</li>
              <li><strong className="text-foreground">Create controlled write APIs</strong> that enforce business rules</li>
              <li><strong className="text-foreground">Minimize atom mutations</strong> across domain boundaries</li>
              <li><strong className="text-foreground">Co-locate validation logic</strong> with the atoms that need it</li>
              <li><strong className="text-foreground">Export action atoms sparingly</strong> for unavoidable cross-domain mutations</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🎉</span>
              Congratulations!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              You've now mastered the core state management patterns! You understand how to structure atoms, 
              compose them effectively, encapsulate business logic with action atoms, and create clean domain boundaries.
            </p>
            <p>
              There's one more concept that completes the picture: <strong>Effects</strong> - reactive patterns 
              for side-effects and external system integration.
            </p>
            <Link 
              to="/concepts/effects" 
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <span>Next: Effects & Side Effects</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}