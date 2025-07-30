import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { TestTube, CheckCircle, Target } from 'lucide-react'

export const Route = createFileRoute('/advanced/testing')({
  component: TestingComponent,
})

function TestingComponent() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Testing</h1>
        <p className="text-xl text-muted-foreground">
          Comprehensive testing strategies for Jotai applications including unit and integration tests
        </p>
      </div>

      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-6 w-6 text-green-600" />
            Testing Philosophy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Testing Jotai applications follows similar principles to testing any React application, 
            but with some specific considerations for atomic state management. This section will cover 
            testing strategies from unit tests for individual atoms to integration tests for complete workflows.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              Testing Atoms in Isolation
            </CardTitle>
            <CardDescription>
              Unit testing individual atoms and their behavior
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Here's how to test atoms in isolation using Jotai's testing utilities:
            </p>
            
            <CodeBlock language="typescript">
{`import { createStore } from 'jotai'
import { describe, it, expect } from 'vitest'

// Atoms to test
const countAtom = atom(0)
const doubledAtom = atom((get) => get(countAtom) * 2)
const incrementAtom = atom(null, (get, set) => {
    set(countAtom, (prev) => prev + 1)
})

describe('Counter atoms', () => {
    it('should have initial value of 0', () => {
        const store = createStore()
        expect(store.get(countAtom)).toBe(0)
    })
    
    it('should double the count value', () => {
        const store = createStore()
        store.set(countAtom, 5)
        expect(store.get(doubledAtom)).toBe(10)
    })
    
    it('should increment count when action is called', () => {
        const store = createStore()
        expect(store.get(countAtom)).toBe(0)
        
        store.set(incrementAtom)
        expect(store.get(countAtom)).toBe(1)
        
        store.set(incrementAtom)
        expect(store.get(countAtom)).toBe(2)
    })
})`}
            </CodeBlock>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              Testing Components with Atoms
            </CardTitle>
            <CardDescription>
              Integration testing of React components using Jotai atoms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Testing components that use atoms with React Testing Library:
            </p>
            
            <CodeBlock language="typescript">
{`import { render, screen, fireEvent } from '@testing-library/react'
import { Provider, createStore } from 'jotai'
import { describe, it, expect } from 'vitest'

// Component to test
const Counter = () => {
    const count = useAtomValue(countAtom)
    const increment = useSetAtom(incrementAtom)
    
    return (
        <div>
            <span data-testid="count">{count}</span>
            <button onClick={() => increment()}>Increment</button>
        </div>
    )
}

const renderWithJotai = (component: React.ReactElement, initialStore?: Store) => {
    const store = initialStore || createStore()
    return {
        ...render(
            <Provider store={store}>
                {component}
            </Provider>
        ),
        store
    }
}

describe('Counter component', () => {
    it('should display initial count', () => {
        renderWithJotai(<Counter />)
        expect(screen.getByTestId('count')).toHaveTextContent('0')
    })
    
    it('should increment when button is clicked', () => {
        renderWithJotai(<Counter />)
        
        const button = screen.getByText('Increment')
        fireEvent.click(button)
        
        expect(screen.getByTestId('count')).toHaveTextContent('1')
    })
    
    it('should start with custom initial value', () => {
        const store = createStore()
        store.set(countAtom, 10)
        
        renderWithJotai(<Counter />, store)
        expect(screen.getByTestId('count')).toHaveTextContent('10')
    })
})`}
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
              This section will be expanded with comprehensive testing patterns, including:
            </p>
            <ul className="mt-4 space-y-2 list-disc list-inside text-muted-foreground">
              <li>Testing async atoms and suspense</li>
              <li>Mocking external dependencies</li>
              <li>Testing atom families and dynamic atoms</li>
              <li>Integration testing with multiple atoms</li>
              <li>Testing effects and side effects</li>
              <li>Performance testing and optimization</li>
              <li>End-to-end testing strategies</li>
              <li>Testing with React 18 features</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}