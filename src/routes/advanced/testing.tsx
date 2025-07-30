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

      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-6 w-6 text-primary" />
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
              <CheckCircle className="h-5 w-5 text-primary" />
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
              <Target className="h-5 w-5 text-primary" />
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              Testing Action Atoms
            </CardTitle>
            <CardDescription>
              Action atoms are easy to test because they're pure functions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Since action atoms are just functions, they're straightforward to test. You can create 
              a store, call the action, and verify the resulting state:
            </p>
            
            <CodeBlock language="typescript">
{`import { createStore } from 'jotai'
import { updateUserAtom, userAtom, isLoadingAtom } from './atoms'

test('updateUserAtom updates user and manages loading state', async () => {
  const store = createStore()
  
  // Initial state
  expect(store.get(userAtom)).toEqual({ name: '', email: '' })
  expect(store.get(isLoadingAtom)).toBe(false)
  
  // Start the action
  const updatePromise = store.set(updateUserAtom, { 
    name: 'John', 
    email: 'john@example.com' 
  })
  
  // Check loading state
  expect(store.get(isLoadingAtom)).toBe(true)
  
  // Wait for completion
  await updatePromise
  
  // Check final state
  expect(store.get(userAtom)).toEqual({ 
    name: 'John', 
    email: 'john@example.com' 
  })
  expect(store.get(isLoadingAtom)).toBe(false)
})`}
            </CodeBlock>

            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <p className="text-sm">
                <strong>Key benefit:</strong> Action atoms encapsulate all the logic you need to test in one place, 
                making your tests more focused and less brittle than testing scattered component logic.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🔧</span>
              Test Utilities Pattern
            </CardTitle>
            <CardDescription>
              Elegant testing utilities that respect domain boundaries while enabling comprehensive tests
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Considering what you've read in previous chapters about avoiding exporting writable atoms, you might be 
              wondering: <strong>how would you actually achieve the hydration in some of the previous examples?</strong> 
              If we're only exporting read-only atoms and action atoms, how do we set up initial state for testing?
            </p>
            
            <p>
              This is where a test utilities pattern becomes essential. We need a way to hydrate atoms for testing 
              without compromising our domain boundaries or accidentally leaking writable atoms to production code.
            </p>

            <p>
              One approach that works exceptionally well is to define a utility function that builds testing helpers. 
              This allows you to maintain clean atom exports (no writable atoms leaked) while still enabling effective 
              testing through controlled hydration.
            </p>

            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 mb-4">
              <p className="text-sm">
                <strong>The challenge:</strong> You need writable atoms for hydration, but you don't want to export them. 
                This utility solves the dilemma by providing controlled access only during testing, throwing an error 
                if accidentally used in production.
              </p>
            </div>
            
            <CodeBlock language="typescript">
{`/* eslint-disable @typescript-eslint/no-explicit-any */
import { WritableAtom } from 'jotai'

/**
 * Utility type. Converts an atom dictionary into a dictionary of the atom value types
 */
type AtomBackedValues<T> = Partial<{
  [K in keyof T]: T[K] extends WritableAtom<infer V, any, any> ? V : never
}>

function typedEntries<T extends object>(obj: T): Array<[keyof T, T[keyof T]]> {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>
}

/**
 * Builds a hydration family for some dictionary of atoms
 */
const buildHydrationFunction =
  <T extends Record<string, WritableAtom<any, any, any>>>(atomMappings: T) =>
  (
    values: AtomBackedValues<T>
  ): Map<T[keyof T], AtomBackedValues<T>[keyof AtomBackedValues<T>]> => {
    const v: Array<
      [T[keyof T], AtomBackedValues<T>[keyof AtomBackedValues<T>]]
    > = []

    typedEntries(values).forEach(([key, value]) => {
      if (value !== undefined) {
        v.push([atomMappings[key], value])
      }
    })

    return new Map(v)
  }

/**
 * A type that describes the available atom testing utilities
 */
type TestUtils<T extends Record<string, WritableAtom<any, any, any>>> = {
  hydrate: (
    values: AtomBackedValues<T>
  ) => Map<T[keyof T], AtomBackedValues<T>[keyof AtomBackedValues<T>]>
}

function isTestEnvironment() {
  return process.env.NODE_ENV === 'test'
}

/**
 * Utility function to build a common set of testing helpers for atoms
 */
export const buildTestUtils = <
  T extends Record<string, WritableAtom<any, any, any>>
>(
  atomMappings: T
): TestUtils<T> => {
  if (!isTestEnvironment()) {
    return {
      hydrate: () => {
        console.error('Hydration function used in non-test environment')
        throw new Error('Hydration function used in non-test environment')
      }
    }
  }
  const hydrate = buildHydrationFunction(atomMappings)

  return {
    hydrate
  }
}`}
            </CodeBlock>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📝</span>
              Using Test Utilities in Practice
            </CardTitle>
            <CardDescription>
              How to implement and use the test utilities pattern in your atom domains
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Here's how you would use this pattern in your atom domain files and tests. Notice how this allows us 
              to follow the export patterns from the <strong>Exporting & Boundaries</strong> chapter while still 
              enabling comprehensive testing:
            </p>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-primary mb-2">1. Define atoms and test utilities in your domain</h4>
                <CodeBlock language="typescript">
{`// user-domain/atoms.ts
import { atom } from 'jotai'
import { buildTestUtils } from '../testing/buildTestUtils'

// Private atoms - not exported
const _currentUserAtom = atom<User | null>(null)
const _userPreferencesAtom = atom<UserPreferences>({})
const _isLoadingAtom = atom(false)

// Public read-only exports
export const currentUserAtom = atom((get) => get(_currentUserAtom))
export const userPreferencesAtom = atom((get) => get(_userPreferencesAtom))
export const isLoadingAtom = atom((get) => get(_isLoadingAtom))

// Action atoms
export const updateUserAtom = atom(
  null,
  (get, set, userData: Partial<User>) => {
    set(_isLoadingAtom, true)
    // ... update logic
    set(_currentUserAtom, { ...get(_currentUserAtom), ...userData })
    set(_isLoadingAtom, false)
  }
)

// Test utilities - only available in test environment
export const userTestUtils = buildTestUtils({
  currentUser: _currentUserAtom,
  userPreferences: _userPreferencesAtom,
  isLoading: _isLoadingAtom
})`}
                </CodeBlock>
              </div>

              <div>
                <h4 className="font-semibold text-primary mb-2">2. Use in your tests</h4>
                <CodeBlock language="typescript">
{`// user-domain/atoms.test.ts
import { render } from '@testing-library/react'
import { Provider } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { userTestUtils, currentUserAtom, updateUserAtom } from './atoms'

function HydrateTestAtoms({
  children,
  initialAtomValues = new Map()
}: {
  children: ReactNode
  initialAtomValues?: Map<WritableAtom<any, any, any>, unknown>
}) {
  useHydrateAtoms(initialAtomValues)

  return <>{children}</>
}

const TestWrapper = ({ 
  children, 
  initialAtomValues = new Map()
}: { 
  children: React.ReactNode
  initialAtomValues?: Map<WritableAtom<any, any, any>, unknown>
}) => {
  return (
    <Provider>
      <HydrateTestAtoms initialAtomValues={initialAtomValues}>
        {children}
      </HydrateTestAtoms>
    </Provider>
  )
}

describe('User atoms', () => {
  it('should start with hydrated user data', () => {
    const testUser = { id: 1, name: 'Test User', email: 'test@example.com' }
    
    const TestComponent = () => {
      const user = useAtomValue(currentUserAtom)
      return <div data-testid="user-name">{user?.name}</div>
    }
    
    render(
      <TestWrapper initialAtomValues={userTestUtils.hydrate({ currentUser: testUser })}>
        <TestComponent />
      </TestWrapper>
    )
    
    expect(screen.getByTestId('user-name')).toHaveTextContent('Test User')
  })
  
  it('should update user through action atom', async () => {
    const initialHydration = userTestUtils.hydrate({ 
      currentUser: { id: 1, name: 'Old Name' } 
    })
    
    render(
      <TestWrapper initialAtomValues={initialHydration}>
        <UserComponent />
      </TestWrapper>
    )
    
    // Test the action atom behavior
    const store = createStore()
    // Hydrate the store with the same initial values
    initialHydration.forEach((value, atom) => store.set(atom, value))
    
    await store.set(updateUserAtom, { name: 'New Name' })
    
    expect(store.get(currentUserAtom)).toEqual({
      id: 1,
      name: 'New Name'
    })
  })
})`}
                </CodeBlock>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Best practice:</strong> Call <code>buildTestUtils()</code> in the same file where your 
                atoms are defined, passing only the writable atoms you need to hydrate for testing. This 
                maintains co-location while respecting your export boundaries.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">✨</span>
              Benefits of This Pattern
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc list-inside text-muted-foreground">
              <li><strong className="text-foreground">Maintains domain boundaries:</strong> No writable atoms are exported to production code</li>
              <li><strong className="text-foreground">Type-safe testing:</strong> Full TypeScript support for hydration values</li>
              <li><strong className="text-foreground">Production-safe:</strong> Throws error if accidentally used outside tests</li>
              <li><strong className="text-foreground">Flexible hydration:</strong> Only set the values you need for each test</li>
              <li><strong className="text-foreground">Co-located utilities:</strong> Test helpers live with the atoms they test</li>
              <li><strong className="text-foreground">Clean test setup:</strong> Eliminates boilerplate in individual tests</li>
              <li><strong className="text-foreground">Consistent patterns:</strong> Same approach works across all atom domains</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-muted/30 border-border">
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