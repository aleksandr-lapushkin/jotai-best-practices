import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { Code } from '@/components/ui/code'

export const Route = createFileRoute('/overview/setup')({
  component: SetupComponent,
})

function SetupComponent() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Jotai Setup</h1>
        <p className="text-xl text-muted-foreground">
          Best practices for setting up Jotai in your React application
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">⚙️</span>
              Custom JotaiProvider Pattern
            </CardTitle>
            <CardDescription>
              A recommended approach for managing Jotai stores and atom hydration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              An approach that works well is to define a custom <Code>JotaiProvider</Code> component, 
              which allows you to inject a custom Jotai store and manage hydrating any atoms you might need, 
              like TanStack's Query Client atom.
            </p>
            <p>
              <strong>"Hydrating"</strong> in this sense is just a fancy word for "setting an atom's value".
            </p>


        
            <CodeBlock language="tsx">
{`const JotaiProvider = ({store, children}: {store: Store, children}) => {
    return (
        <Provider store={store}>
            <HydrateAtoms>
                {children}
            </HydrateAtoms>
        </Provider>
    )
}

const HydrateAtoms = ({children}) => {
    useHydrateAtoms([
        [queryClientAtom, queryClient],
        // Add any other atoms you want to hydrate here
    ])
    return (
        <>
            {children}
        </>
    )
}

`}
            </CodeBlock>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🔧</span>
              Key Benefits of This Approach
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Store Management:</strong> Easy to inject custom stores for testing or SSR</li>
              <li><strong>Atom Hydration:</strong> Centralized place to initialize atoms with specific values</li>
              <li><strong>Integration Ready:</strong> Perfect for integrating with other libraries like TanStack Query</li>
              <li><strong>Encapsulation:</strong> Keeps Jotai setup logic contained and reusable</li>
              <li><strong>Flexibility:</strong> Can easily extend to support more complex setups like running global effects</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}