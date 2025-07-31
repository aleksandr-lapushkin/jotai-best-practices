import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { RefreshCw, Clock } from 'lucide-react'

export const Route = createFileRoute('/utilities/atomWithDefault')({
  component: AtomWithDefaultComponent,
})

function AtomWithDefaultComponent() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">atomWithDefault & atomWithReset</h1>
        <p className="text-xl text-muted-foreground">
          Create atoms with computed default values and reset functionality
        </p>
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-6 w-6 text-primary" />
            Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <code className="bg-muted px-1 rounded">atomWithDefault</code> is a subtype of <code className="bg-muted px-1 rounded">atomWithReset</code>. 
            Both support providing a default value, but <code className="bg-muted px-1 rounded">atomWithDefault</code> allows you to provide 
            a value getter function (that can also be async). Both can be reset to their initial value.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🔄</span>
              Basic Usage
            </CardTitle>
            <CardDescription>
              Simple default values and reset functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock language="typescript">
{`import { RESET } from 'jotai/utils'

const defaultAtom = atomWithDefault(() => 0)
const resettableAtom = atomWithReset(0)

const resetState = atom(null, (get, set) => {
    set(defaultAtom, RESET)
    set(resettableAtom, RESET)
})`}
            </CodeBlock>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Async Default Values
            </CardTitle>
            <CardDescription>
              Computing default values from async operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              You can use async functions to compute default values, including integration with other atoms:
            </p>
            
            <CodeBlock language="typescript">
{`// Using with async
const asyncFetchAtom = atom(async (get) => fetch(URL))
const asyncSuspendingAtom = atom(async (get) => use(fetch(URL)))

// Both of these will return the computed default value until the first write
const defaultFromAsync = atomWithDefault(async () => {
    const result = await get(asyncFetchAtom)
    return result.json()
})

const defaultFromSuspendingAsync = atomWithDefault(async () => {
    const result = await get(asyncSuspendingAtom)
    return result.json()
})`}
            </CodeBlock>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-secondary/30 to-secondary/10 border-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">💡</span>
              Key Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc list-inside text-muted-foreground">
              <li><strong className="text-foreground">Lazy initialization:</strong> Default values are computed only when needed</li>
              <li><strong className="text-foreground">Async support:</strong> Can fetch default values from APIs or async operations</li>
              <li><strong className="text-foreground">Reset capability:</strong> Easy way to restore original state</li>
              <li><strong className="text-foreground">Dependency integration:</strong> Default computation can depend on other atoms</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}