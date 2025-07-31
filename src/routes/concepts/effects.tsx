import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { Workflow, Eye, Zap, Target, Lightbulb } from 'lucide-react'
import { Code } from '@/components/ui/code'
import { createStore, Provider, useAtom, useAtomValue } from 'jotai'
import { atom } from 'jotai'
import { atomEffect, observe, withAtomEffect } from 'jotai-effect'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/concepts/effects')({
  component: EffectsComponent,
})

const myAtom = atom(false)
const otherAtom = atom(true)
const localStore = createStore()
observe((get, set) => {
  if (get(myAtom)) {
    set(otherAtom, (prev) => !prev)
  }
}, localStore)

function ObserveExample() {
  return <Provider store={localStore}>
    <InnerObserveExample />
  </Provider>

}

function InnerObserveExample() {
  const [myAtomValue, setMyAtom] = useAtom(myAtom)
  const otherAtomValue = useAtomValue(otherAtom)
  const toggleMyAtom = () => setMyAtom((prev) => !prev)
  return (
    
    <div className="space-y-4 space-x-2">
      MyAtom: <Code>{myAtomValue.toString()}</Code>
      OtherAtom: <Code>{otherAtomValue.toString()}</Code>
      <Button onClick={toggleMyAtom} variant="outline" size="sm">
        Toggle MyAtom
      </Button>
      </div>
      
  )
}

const flipperAtomEffect = atomEffect((get, set) => {
  if (get(myAtom)) {
    set(otherAtom, (prev) => !prev)
  }
})

function FlipperAtomExample() {
  const [myAtomValue, setMyAtom] = useAtom(myAtom)
  const otherAtomValue = useAtomValue(otherAtom)
  const toggleMyAtom = () => setMyAtom((prev) => !prev)

  // This must be mounted for the effect to work
  useAtomValue(flipperAtomEffect)

  return (
    <div className="space-y-4 space-x-2">
      MyAtom: <Code>{myAtomValue.toString()}</Code>
      OtherAtom: <Code>{otherAtomValue.toString()}</Code>
      <Button onClick={toggleMyAtom} variant="outline" size="sm">
        Toggle MyAtom
      </Button>
    </div>
  )
}

withAtomEffect(myAtom, (get, set) => {
  if (get(myAtom)) {
    set(otherAtom, (prev) => !prev)
  }
})

function WithAtomEffectExample() {
  const [myAtomValue, setMyAtom] = useAtom(myAtom)
  const otherAtomValue = useAtomValue(otherAtom)
  const toggleMyAtom = () => setMyAtom((prev) => !prev)

  return (
    <div className="space-y-4 space-x-2">
      MyAtom: <Code>{myAtomValue.toString()}</Code>
      OtherAtom: <Code>{otherAtomValue.toString()}</Code>
      <Button onClick={toggleMyAtom} variant="outline" size="sm">
        Toggle MyAtom
      </Button>
    </div>
  )
}

function EffectsComponent() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Effects & Side Effects</h1>
        <p className="text-xl text-muted-foreground">
          React to state changes with effect atoms for side-effects, analytics, and external system integration
        </p>
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="h-6 w-6 text-primary" />
            What are Effects?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Effects in Jotai allow you to react to state changes automatically. Think of them as <strong>action atoms that trigger on state changes</strong> rather than being called explicitly. 
            While action atoms are imperative ("do this now"), effects are reactive ("do this whenever X changes").
          </p>
          <p className="mt-2">
            Effects are the final piece of the Jotai puzzle - use them sparingly for side-effects like 
            analytics, external system sync, and cleanup operations.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Global Effects with <Code>observe</Code>
            </CardTitle>
            <CardDescription>
              Define global effects bound to a specific store
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Use <code className="bg-muted px-1 rounded">observe</code> to define effects that run 
              globally whenever specified atoms change.
            </p>
            
            <CodeBlock language="typescript">
{`const flipper = observe((get, set) => {
    if (get(myAtom)) {
        //Toggle only when myAtom is true
        set(otherAtom, (prev) => !prev)
    }
}, store)`}
            </CodeBlock>
            <ObserveExample />
            
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <p className="text-sm">
                <strong>Key insight:</strong> Unlike action atoms that you call explicitly, global effects 
                run automatically whenever their dependent atoms change. This is powerful but can make 
                state flow harder to debug.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Effect Atoms with <Code>atomEffect</Code>
            </CardTitle>
            <CardDescription>
              Create effect atoms that must be mounted to work
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Effect atoms provide more control over when effects run, but they must be explicitly mounted 
              in a component to be active.
            </p>
            
            <CodeBlock language="typescript">
{`const flipperAtom = atomEffect((get, set) => {
    if (get(myAtom)) {
        set(otherAtom, (prev) => !prev)
    }
})

// These must be mounted somewhere to work!
const RootComponent = () => {
    useAtomValue(flipperAtom)
    
    return <div>...</div>
}`}
            </CodeBlock>
            <FlipperAtomExample />
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Important:</strong> Effect atoms must be explicitly mounted in a component to work. 
                This gives you control over when effects are active, similar to how you control which 
                atoms are exported across domain boundaries.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Targeted Effects with <Code>withAtomEffect</Code>
            </CardTitle>
            <CardDescription>
              Define effects that run when specific atoms change
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Use <code className="bg-muted px-1 rounded">withAtomEffect</code> to create effects 
              that are automatically mounted when the <strong>original atom</strong> is used.
            </p>
            
            <CodeBlock language="typescript">
{`const flipperAtom = withAtomEffect(myAtom, (get, set) => {
    if (get(myAtom)) {
        set(otherAtom, (prev) => !prev)
    }
})

// Effect is mounted while original atom is mounted
useAtomValue(myAtom)`}
            </CodeBlock>
            <WithAtomEffectExample />

            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <p className="text-sm">
                <strong>Best of both worlds:</strong> This approach gives you the automatic mounting of 
                global effects with the controlled activation of effect atoms - the effect is only 
                active when someone actually uses the atom.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Auto-Mounting Effects Trick
            </CardTitle>
            <CardDescription>
              Automatically mount effects when atoms are accessed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              One neat trick that can be used to automatically mount effects when an atom is accessed:
            </p>
            
            <CodeBlock language="typescript">
{`const _myPrivateAtom = atom("hello")

const myEffectAtom = atomEffect((get, set) => {
    console.log("_myPrivateAtom changed")
})

// Whenever myPublicAtom is used, the effect will also be mounted.
const myPublicAtom = atom(get => {
    get(myEffectAtom)  // Mount the effect
    
    return get(_myPrivateAtom)
})`}
            </CodeBlock>
            
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <p className="text-sm">
                <strong>Encapsulation pattern:</strong> Just like how we control atom exports to maintain 
                domain boundaries, this pattern hides the effect implementation from consumers while 
                ensuring it works seamlessly.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🔄</span>
              Real-World Example: Redux Sync
            </CardTitle>
            <CardDescription>
              Using effects to sync Jotai state with other state management systems
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Here's a practical example of using effects to sync Jotai and Redux state during a migration:
            </p>
            
            <CodeBlock language="typescript">
{`const emailAddressFilters = atom<EmailAddressFilter[]>([])

const reduxSyncAtomBuilder = (store: ReduxStore) => withAtomEffect(emailAddressFilters, (get, set) => {
    const state = store.getState().centralInbox.emailAddressFilters
    const atomState = get(emailAddressFilters)
    
    if (!isEqual(state, atomState)) {
        store.dispatch.centralInbox.syncJotaiEmailAddressFilters(atomState)
    }
})

function useReduxSync() {
    useAtomValue(emailAddressFilters)
    const store = useStore()
    const syncAtom = useMemo(() => reduxSyncAtomBuilder(store), [store])
    useAtomValue(syncAtom)
}

// In root of app
const App = () => {
    useReduxSync()
    
    return <div>...</div>
}`}
            </CodeBlock>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-secondary/30 to-secondary/10 border-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              Best Practices for Effects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc list-inside text-muted-foreground">
              <li><strong className="text-foreground">Use sparingly:</strong> Effects are powerful but can make state flow harder to follow</li>
              <li><strong className="text-foreground">Keep effects focused:</strong> Each effect should have a single, clear responsibility</li>
              <li><strong className="text-foreground">Hide complexity:</strong> Consumers of your state should not need to know about the effects</li>
              <li><strong className="text-foreground">Avoid effect chains:</strong> Be careful not to create cascading effects that are hard to debug</li>
              <li><strong className="text-foreground">Consider performance:</strong> Effects run on every state change of their dependencies</li>
              <li><strong className="text-foreground">Handle cleanup:</strong> Use cleanup functions for subscriptions and timers</li>
              <li><strong className="text-foreground">Pick the right flavour:</strong> Carefully consider the use case for your effects - which type of effect would work best?</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-accent/30 to-accent/10 border-accent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              When to Use Effects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc list-inside text-muted-foreground">
              <li><strong className="text-foreground">Analytics and tracking:</strong> Log user interactions and state changes</li>
              <li><strong className="text-foreground">Data synchronization:</strong> Keep different state systems in sync</li>
              <li><strong className="text-foreground">Side-effects:</strong> Update localStorage, send notifications, etc.</li>
              <li><strong className="text-foreground">Cleanup operations:</strong> Cancel requests, clear timers when state changes</li>
              <li><strong className="text-foreground">External integrations:</strong> Update third-party libraries when state changes</li>
              <li><strong className="text-foreground">Development tools:</strong> Debugging and development-time logging</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}