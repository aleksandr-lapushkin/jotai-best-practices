import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { Cog, ArrowRight, CheckCircle } from 'lucide-react'

export const Route = createFileRoute('/utilities/atomWithReducer')({
  component: AtomWithReducerComponent,
})

function AtomWithReducerComponent() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">atomWithReducer</h1>
        <p className="text-xl text-muted-foreground">
          Create atoms with reducer-like state management for complex state transitions
        </p>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cog className="h-6 w-6 text-blue-600" />
            What is atomWithReducer?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <code className="bg-muted px-1 rounded">atomWithReducer</code> is a variation on a narrowly-scoped 
            atom write function. It works until your state depends on its previous version. For non-derived 
            self-referential atoms, <code className="bg-muted px-1 rounded">atomWithReducer</code> is a great option.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📅</span>
              Basic Example: Date Management
            </CardTitle>
            <CardDescription>
              The example from your notes showing date manipulation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock language="typescript">
{`const myComplexState = atomWithReducer(
    // Initial state
    { currentDate: new Date() },
    // Reducer function - types are provided when initialising the reducer
    (value: { currentDate: Date }, action: { type: "add" | "sub", payload: number }) => {
        switch(action.type) {
            case "add": 
                return { currentDate: add(value.currentDate, action.payload, 'days') }
            case "sub": 
                return { currentDate: sub(value.currentDate, action.payload, 'days') }
            default: 
                return value
        }
    }
)

const MyComponent = () => {
    const [myComplexStateValue, setMyComplexState] = useAtom(myComplexState)
    
    return (
        <div>
            <p>Current date: {myComplexStateValue.currentDate.toDateString()}</p>
            <button onClick={() => setMyComplexState({ type: "add", payload: 5 })}>
                Add 5 Days
            </button>
            <button onClick={() => setMyComplexState({ type: "sub", payload: 1 })}>
                Subtract 1 Day
            </button>
        </div>
    )
}`}
            </CodeBlock>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Counter with History
            </CardTitle>
            <CardDescription>
              A more complex example showing state history tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock language="typescript">
{`interface CounterState {
    value: number
    history: number[]
    maxHistory: number
}

type CounterAction = 
    | { type: 'increment' }
    | { type: 'decrement' }
    | { type: 'reset' }
    | { type: 'set', payload: number }
    | { type: 'undo' }

const counterWithHistoryAtom = atomWithReducer(
    // Initial state
    { value: 0, history: [], maxHistory: 10 },
    // Reducer
    (state: CounterState, action: CounterAction): CounterState => {
        const addToHistory = (newValue: number) => {
            const newHistory = [...state.history, state.value]
            if (newHistory.length > state.maxHistory) {
                newHistory.shift() // Remove oldest entry
            }
            return { ...state, value: newValue, history: newHistory }
        }

        switch (action.type) {
            case 'increment':
                return addToHistory(state.value + 1)
            
            case 'decrement':
                return addToHistory(state.value - 1)
            
            case 'set':
                return addToHistory(action.payload)
            
            case 'reset':
                return { ...state, value: 0, history: [...state.history, state.value] }
            
            case 'undo':
                if (state.history.length === 0) return state
                const previousValue = state.history[state.history.length - 1]
                const newHistory = state.history.slice(0, -1)
                return { ...state, value: previousValue, history: newHistory }
            
            default:
                return state
        }
    }
)

// Usage component
const CounterWithHistory = () => {
    const [counter, dispatch] = useAtom(counterWithHistoryAtom)
    
    return (
        <div>
            <h2>Value: {counter.value}</h2>
            <p>History: {counter.history.join(', ')}</p>
            
            <button onClick={() => dispatch({ type: 'increment' })}>+</button>
            <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
            <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
            <button 
                onClick={() => dispatch({ type: 'undo' })}
                disabled={counter.history.length === 0}
            >
                Undo
            </button>
        </div>
    )
}`}
            </CodeBlock>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-purple-600" />
              Form State Management
            </CardTitle>
            <CardDescription>
              Managing complex form state with validation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock language="typescript">
{`interface FormState {
    fields: Record<string, string>
    errors: Record<string, string>
    touched: Record<string, boolean>
    isSubmitting: boolean
}

type FormAction = 
    | { type: 'SET_FIELD', field: string, value: string }
    | { type: 'SET_ERROR', field: string, error: string }
    | { type: 'CLEAR_ERROR', field: string }
    | { type: 'TOUCH_FIELD', field: string }
    | { type: 'SET_SUBMITTING', isSubmitting: boolean }
    | { type: 'RESET' }

const formAtom = atomWithReducer(
    // Initial state
    {
        fields: { email: '', password: '', confirmPassword: '' },
        errors: {},
        touched: {},
        isSubmitting: false
    } as FormState,
    // Reducer
    (state: FormState, action: FormAction): FormState => {
        switch (action.type) {
            case 'SET_FIELD':
                return {
                    ...state,
                    fields: { ...state.fields, [action.field]: action.value },
                    // Clear error when user starts typing
                    errors: { ...state.errors, [action.field]: '' }
                }
            
            case 'SET_ERROR':
                return {
                    ...state,
                    errors: { ...state.errors, [action.field]: action.error }
                }
            
            case 'CLEAR_ERROR':
                const { [action.field]: removedError, ...restErrors } = state.errors
                return { ...state, errors: restErrors }
            
            case 'TOUCH_FIELD':
                return {
                    ...state,
                    touched: { ...state.touched, [action.field]: true }
                }
            
            case 'SET_SUBMITTING':
                return { ...state, isSubmitting: action.isSubmitting }
            
            case 'RESET':
                return {
                    fields: { email: '', password: '', confirmPassword: '' },
                    errors: {},
                    touched: {},
                    isSubmitting: false
                }
            
            default:
                return state
        }
    }
)

// Form validation logic
const validateForm = (fields: Record<string, string>) => {
    const errors: Record<string, string> = {}
    
    if (!fields.email) errors.email = 'Email is required'
    if (!fields.password) errors.password = 'Password is required'
    if (fields.password !== fields.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match'
    }
    
    return errors
}

// Usage in form component
const SignupForm = () => {
    const [form, dispatch] = useAtom(formAtom)
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        // Validate all fields
        const errors = validateForm(form.fields)
        Object.entries(errors).forEach(([field, error]) => {
            dispatch({ type: 'SET_ERROR', field, error })
        })
        
        if (Object.keys(errors).length > 0) return
        
        dispatch({ type: 'SET_SUBMITTING', isSubmitting: true })
        
        try {
            await submitForm(form.fields)
            dispatch({ type: 'RESET' })
        } catch (error) {
            dispatch({ type: 'SET_ERROR', field: 'general', error: 'Submission failed' })
        } finally {
            dispatch({ type: 'SET_SUBMITTING', isSubmitting: false })
        }
    }
    
    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                value={form.fields.email}
                onChange={(e) => dispatch({ 
                    type: 'SET_FIELD', 
                    field: 'email', 
                    value: e.target.value 
                })}
                onBlur={() => dispatch({ type: 'TOUCH_FIELD', field: 'email' })}
            />
            {form.touched.email && form.errors.email && (
                <span className="error">{form.errors.email}</span>
            )}
            
            <button type="submit" disabled={form.isSubmitting}>
                {form.isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
        </form>
    )
}`}
            </CodeBlock>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">💡</span>
              When to Use atomWithReducer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Complex state transitions:</strong> When state changes depend on previous values</li>
              <li><strong>Multiple related operations:</strong> When you have many ways to modify the same state</li>
              <li><strong>Type safety:</strong> Reducer pattern provides excellent TypeScript support</li>
              <li><strong>Predictable updates:</strong> All state changes go through the reducer function</li>
              <li><strong>Debugging:</strong> Easy to log and track all state changes</li>
              <li><strong>Testing:</strong> Reducers are pure functions that are easy to test</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gray-50 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🚧</span>
              Coming Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Additional examples and patterns will be added here, including:
            </p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-muted-foreground">
              <li>Integration with middleware for logging</li>
              <li>Async reducer patterns</li>
              <li>Combining with atomFamily for entity management</li>
              <li>Performance optimization techniques</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}