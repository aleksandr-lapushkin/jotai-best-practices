import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { Cog } from 'lucide-react'

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

      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cog className="h-6 w-6 text-primary" />
            What is atomWithReducer?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <code className="bg-muted px-1 rounded">atomWithReducer</code> is a variation on a narrowly-scoped 
            atom write function covered earlier in <Link className='underline' to="/concepts/exporting-atoms">Exporting & Boundaries</Link>. Reducers work well for non-derived 
            potentially self-referential atoms.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📅</span>
              Basic Example: Appended List
            </CardTitle>
            <CardDescription>
              Using atomWithReducer to manage a list with append functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock language="typescript">
{`const myComplexState = atomWithReducer(
    // Initial state
    { items: [] },
    // Reducer function - types are provided when initialising the reducer
    (value: { items: string[] }, action: { type: "add" | "remove" | "replace", payload: string[] }) => {
        switch(action.type) {
            case "add": 
                return { items: [...value.items, ...action.payload] }
            case "remove":
                return { items: value.items.filter(item => !action.payload.includes(item)) }
            case "replace":
                return { items: action.payload }
            default: 
                return value
        }
    }
)

const MyComponent = () => {
    const items = useApiData()
    const [myComplexStateValue, setMyComplexState] = useAtom(myComplexState)
    
    return (
        <div>
            <button onClick={() => setMyComplexState({ type: "add", payload: items })}>
              Append all items
            </button>
            <button onClick={() => setMyComplexState({ type: "replace", payload: items })}>
              Replace all items
            </button>
        </div>
    )
}`}
            </CodeBlock>
            <p>This would've been a bit more complicated if trying to build it using regular atoms. Notice that we have to define two separate Action Atoms, whereas the Reducer is part of the data definition itself.</p>
            <CodeBlock language="typescript">
              {`const itemsAtom = atom<string[]>([])
const appendItemsActionAtom = atom(null, (get, set, items: string[]) => {
    set(itemsAtom, (current) => [...current, ...items])
})
const replaceItemsActionAtom = atom(null, (get, set, items: string[]) => {
    set(itemsAtom, items)
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
              <li><strong className="text-foreground">Support complex state transitions:</strong> When state changes depend on previous values</li>
              <li><strong className="text-foreground">Tight coupling:</strong> Data mutations are part of the data definition itself</li>
              <li><strong className="text-foreground">Multiple related operations:</strong> When you have many ways to modify the same state</li>
              <li><strong className="text-foreground">Type safety:</strong> Reducer pattern provides excellent TypeScript support</li>
              <li><strong className="text-foreground">Predictable updates:</strong> All state changes go through the reducer function</li>
              <li><strong className="text-foreground">Debugging:</strong> Easy to log and track all state changes</li>
              <li><strong className="text-foreground">Testing:</strong> Reducers are pure functions that are easy to test</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}