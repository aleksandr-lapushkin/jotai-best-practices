import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'

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
              An approach that works well is to define a custom <code className="bg-muted px-1 rounded">JotaiProvider</code> component, 
              which allows you to inject a custom Jotai store and manage hydrating any atoms you might need, 
              like TanStack's Query Client atom.
            </p>
            <p>
              <strong>"Hydrating"</strong> in this sense is just a fancy word for "setting an atom's value".
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">💻</span>
              Implementation Example
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CodeBlock language="tsx">
{`const JotaiProvider = ({store, children}: {store: Store, children}) => {
    return (
        <Provider store={store}>
            <HydrateAtoms>
                {children}
            </HydrateAtoms>
        </Provider>
    )
}`}
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
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🚀</span>
              When to Use This Pattern
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              This custom provider pattern is especially useful when you need to:
            </p>
            <ul className="space-y-2 list-disc list-inside ml-4">
              <li>Initialize atoms with specific values on app startup</li>
              <li>Integrate Jotai with other state management libraries during migration</li>
              <li>Provide different store configurations for testing vs production</li>
              <li>Handle server-side rendering with pre-populated state</li>
              <li>Set up atoms that depend on external services or configurations</li>
            </ul>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-4">
              <p className="text-sm text-blue-800">
                <strong>Pro Tip:</strong> For simple applications, you can often use Jotai without any custom setup. 
                The default provider works great for most use cases.
              </p>
            </div>
          </CardContent>
        </Card>

        
      </div>
    </div>
  )
}