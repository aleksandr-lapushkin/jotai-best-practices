import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { Users, Trash2 } from 'lucide-react'

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

      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
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
            <p>Contrasted with a dictionary-based approach:</p>
            <CodeBlock language="typescript">
              {`const messageCheckStatusDict = atom<Record<string, boolean>>({})

const MyComponentDict = ({messageId}: {messageId: string}) => {
    const [status, setStatus] = useAtom(messageCheckStatusDict)
    const isChecked = status[messageId] || false
    const setChecked = (checked: boolean) => {
        setStatus((prev) => ({...prev, [messageId]: checked}))
    }
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
              <Trash2 className="h-5 w-5 text-destructive" />
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
            
            <div className="bg-destructive/10 border-l-4 border-destructive p-4">
              <p className="text-sm text-destructive-foreground">
                <strong>Memory Leak Warning:</strong> Without proper cleanup, atomFamily can cause 
                memory leaks in applications with dynamic keys. Always remove atoms that are no longer needed.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-secondary/30 to-secondary/10 border-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">✨</span>
              Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc list-inside text-muted-foreground">
              <li><strong className="text-foreground">Use stable keys:</strong> Ensure your parameter objects have consistent serialization</li>
              <li><strong className="text-foreground">Clean up unused atoms:</strong> Remove atoms when their data is no longer needed</li>
              <li><strong className="text-foreground">Consider memory usage:</strong> Monitor atom family size in large applications</li>
              <li><strong className="text-foreground">Type your parameters:</strong> Use TypeScript interfaces for complex parameter objects</li>
              <li><strong className="text-foreground">Combine with other patterns:</strong> atomFamily works well with action atoms and effects</li>
              <li><strong className="text-foreground">Debug with getParams():</strong> Use the getParams method to inspect current keys</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}