import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { Users, Hash, Trash2 } from 'lucide-react'

export const Route = createFileRoute('/utilities/atomFamily')({
  component: AtomFamilyComponent,
})

function AtomFamilyComponent() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">atomFamily</h1>
        <p className="text-xl text-muted-foreground">
          Generate atoms dynamically based on parameters for managing collections of related state
        </p>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            What is atomFamily?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Imagine you have some list entities and need to manage state per entity. That's where 
            <code className="bg-muted px-1 rounded mx-1">atomFamily</code> becomes pretty useful. 
            It will compute a new atom for each unique key you provide.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📝</span>
              Basic Usage
            </CardTitle>
            <CardDescription>
              Creating atoms for each item in a collection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock language="typescript">
{`const messageIds = ['message1', 'message2']

// Will compute a new atom for each unique key
const messageCheckStatus = atomFamily((messageId: string) => atom(false))

const MyComponent = ({messageId}: {messageId: string}) => {
    const isChecked = useAtomValue(messageCheckStatus(messageId))
    const setChecked = useSetAtom(messageCheckStatus(messageId))
    
    return (
        <div>
            <input 
                type="checkbox" 
                checked={isChecked} 
                onChange={(e) => setChecked(e.target.checked)}
            />
            Message {messageId}
        </div>
    )
}`}
            </CodeBlock>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-green-600" />
              Complex Parameters
            </CardTitle>
            <CardDescription>
              Using objects and complex types as atom family keys
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              atomFamily can use complex objects as keys, not just strings or numbers:
            </p>
            
            <CodeBlock language="typescript">
{`interface TodoFilter {
    userId: string
    status: 'pending' | 'completed' | 'all'
    priority?: 'high' | 'medium' | 'low'
}

// Using complex objects as keys
const filteredTodosAtom = atomFamily((filter: TodoFilter) => 
    atom(async (get) => {
        const todos = get(allTodosAtom)
        
        return todos.filter(todo => {
            if (filter.userId && todo.userId !== filter.userId) return false
            if (filter.status !== 'all' && todo.status !== filter.status) return false
            if (filter.priority && todo.priority !== filter.priority) return false
            return true
        })
    })
)

// Usage
const TodoList = ({ userId }: { userId: string }) => {
    const pendingTodos = useAtomValue(filteredTodosAtom({ 
        userId, 
        status: 'pending' 
    }))
    
    const highPriorityTodos = useAtomValue(filteredTodosAtom({ 
        userId, 
        status: 'all', 
        priority: 'high' 
    }))
    
    return <div>...</div>
}`}
            </CodeBlock>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-600" />
              Memory Management
            </CardTitle>
            <CardDescription>
              Important considerations for cleaning up unused atoms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              atomFamily creates atoms that persist in memory. For long-running applications, 
              you should clean up unused atoms:
            </p>
            
            <CodeBlock language="typescript">
{`const itemAtomsFamily = atomFamily((id: string) => atom({ id, data: null }))

// Clean up specific atom
itemAtomsFamily.remove('item-123')

// Get all current keys (useful for debugging)
const allKeys = itemAtomsFamily.getParams()
console.log('Current atom keys:', allKeys)

// Example cleanup effect
const cleanupUnusedAtoms = atom(null, (get, set, activeIds: string[]) => {
    const allKeys = itemAtomsFamily.getParams()
    const unusedKeys = allKeys.filter(key => !activeIds.includes(key))
    
    unusedKeys.forEach(key => {
        itemAtomsFamily.remove(key)
    })
    
    console.log(\`Cleaned up \${unusedKeys.length} unused atoms\`)
})`}
            </CodeBlock>
            
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <p className="text-sm text-red-800">
                <strong>Memory Leak Warning:</strong> Without proper cleanup, atomFamily can cause 
                memory leaks in applications with dynamic keys. Always remove atoms that are no longer needed.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🏪</span>
              Real-World Example: Shopping Cart Items
            </CardTitle>
            <CardDescription>
              Managing individual item states in a shopping cart
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock language="typescript">
{`interface CartItem {
    id: string
    quantity: number
    selected: boolean
    notes?: string
}

// Atom family for individual cart items
const cartItemAtom = atomFamily((itemId: string) => 
    atom<CartItem>({
        id: itemId,
        quantity: 1,
        selected: true
    })
)

// Derived atom for all cart items
const allCartItemsAtom = atom((get) => {
    const itemIds = get(cartItemIdsAtom) // Assume this exists
    return itemIds.map(id => get(cartItemAtom(id)))
})

// Actions for cart items
const updateItemQuantityAtom = atomFamily((itemId: string) =>
    atom(null, (get, set, quantity: number) => {
        const currentItem = get(cartItemAtom(itemId))
        set(cartItemAtom(itemId), { ...currentItem, quantity })
    })
)

const toggleItemSelectionAtom = atomFamily((itemId: string) =>
    atom(null, (get, set) => {
        const currentItem = get(cartItemAtom(itemId))
        set(cartItemAtom(itemId), { ...currentItem, selected: !currentItem.selected })
    })
)

// Component usage
const CartItemComponent = ({ itemId }: { itemId: string }) => {
    const item = useAtomValue(cartItemAtom(itemId))
    const updateQuantity = useSetAtom(updateItemQuantityAtom(itemId))
    const toggleSelection = useSetAtom(toggleItemSelectionAtom(itemId))
    
    return (
        <div className="cart-item">
            <input 
                type="checkbox" 
                checked={item.selected}
                onChange={() => toggleSelection()}
            />
            <input 
                type="number" 
                value={item.quantity}
                onChange={(e) => updateQuantity(parseInt(e.target.value))}
            />
        </div>
    )
}

// Cleanup when item is removed from cart
const removeCartItemAtom = atom(null, (get, set, itemId: string) => {
    // Remove from item IDs list
    const currentIds = get(cartItemIdsAtom)
    set(cartItemIdsAtom, currentIds.filter(id => id !== itemId))
    
    // Clean up the atom family entries
    cartItemAtom.remove(itemId)
    updateItemQuantityAtom.remove(itemId)
    toggleItemSelectionAtom.remove(itemId)
})`}
            </CodeBlock>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">✨</span>
              Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Use stable keys:</strong> Ensure your parameter objects have consistent serialization</li>
              <li><strong>Clean up unused atoms:</strong> Remove atoms when their data is no longer needed</li>
              <li><strong>Consider memory usage:</strong> Monitor atom family size in large applications</li>
              <li><strong>Type your parameters:</strong> Use TypeScript interfaces for complex parameter objects</li>
              <li><strong>Combine with other patterns:</strong> atomFamily works well with action atoms and effects</li>
              <li><strong>Debug with getParams():</strong> Use the getParams method to inspect current keys</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}