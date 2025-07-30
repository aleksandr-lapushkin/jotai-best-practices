import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { atom, useAtom } from 'jotai'
import { Button } from '@/components/ui/button'
import { Code } from '@/components/ui/code'

export const Route = createFileRoute('/overview/how-it-works')({
  component: HowItWorksComponent,
})

const countAtom = atom(0)
const doubledAtom = atom((get) => get(countAtom) * 2)
function CounterExample() {
  const [count, setCount] = useAtom(countAtom)
  const [doubled] = useAtom(doubledAtom)
  return (
    <div>
      <p>Count: {count}</p>
      <p>Doubled: {doubled}</p>
      <Button onClick={() => setCount((c) => c + 1)}>Increment</Button>
    </div>
  )
}

function HowItWorksComponent() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">How Jotai Works</h1>
        <p className="text-xl text-muted-foreground">
          Understanding the core concepts behind Jotai's atomic state management
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">⚛️</span>
              So what is an Atom?
            </CardTitle>
            <CardDescription>
              Jotai is extremely simple at its core: there are Atoms and there's a Store.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>An atom is the smallest unit of state in Jotai. It can be most easily declared as follows:</p>
            <CodeBlock language="tsx">
              {`import { atom } from 'jotai';

const countAtom = atom(0);
const doubledAtom = atom((get) => get(countAtom) * 2)`}
            </CodeBlock>
            <p>Note that we can also very easily derive data from any existing Atom, which is then automatically updated! Atoms can then be used in your React components:</p>
            <CodeBlock language="tsx">
              {`import { useAtom } from 'jotai';
import { countAtom } from './atoms';
function Counter() {
  const [count, setCount] = useAtom(countAtom);
  const [doubled] = useAtom(doubledAtom)
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
}`}
            </CodeBlock>
            <CounterExample />
            <p>There's no magic here! What is actually happening behind the scenes is that <Code>useAtom</Code> is actually using the default Store provided by Jotai. If you wanted to read or modify the value of an atom yourself, you're free to do so!</p>
            <CodeBlock language="tsx">
              {`import { createStore } from 'jotai';

const store = createStore();
const countAtom = atom(0);
const doubledAtom = atom((get) => get(countAtom) * 2);

store.set(countAtom, 5); // Set the atom's value to 5
const value = store.get(countAtom); // Read the atom's value
const doubledValue = store.get(doubledAtom); // Read the derived atom's value
              `}
            </CodeBlock>
                
            
            
            <p>
              One way to think about it is that each atom is a separate data storage protocol: 
              it dictates what is stored, how it's stored and how it can be read.
            </p>
            <p>
              The Store is where the data actually resides. When you try to read something from 
              the Store, you need to do so via the respective Atom, since only it knows how to 
              decode the data.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🏪</span>
              Atoms and Stores
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              <strong>Atoms are not technically global</strong> - atoms are always bound to some Store. 
              Jotai provides a default store that you don't need to initialise explicitly, but you can 
              technically have multiple stores in your app with each one having copies of the same Atoms.
            </p>
            <p>
              In this way Atoms are very similar to Symbols - they serve as unique identifiers 
              for pieces of state within a store.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🔄</span>
              Key Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Atomic granularity:</strong> Each piece of state is independent</li>
              <li><strong>Derived data:</strong> Atoms can be composed to create derived state</li>
              <li><strong>Automatic dependency tracking:</strong> Components re-render and atoms are updated when their used atoms change</li>
              <li><strong>Bottom-up approach:</strong> Build complex state from simple atoms</li>
              <li><strong>No providers needed:</strong> Works out of the box with minimal setup</li>
              <li><strong>TypeScript-first:</strong> Excellent type inference and safety</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}