import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { Workflow, Eye, Zap, Target, Lightbulb } from 'lucide-react'

export const Route = createFileRoute('/concepts/effects')({
  component: EffectsComponent,
})

function EffectsComponent() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Effects</h1>
        <p className="text-xl text-muted-foreground">
          React to state changes using effect atoms for side-effects and state synchronization
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
            Effects in Jotai allow you to react to state changes via effect atoms. One way to think 
            about them is they're similar to Action Atoms that are executed on state changes. Effects 
            typically are only needed in very specific, limited scenarios, but they can be quite powerful.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Global Effects with `observe`
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
        set(otherAtom, false) 
    }
}, store)`}
            </CodeBlock>
            
            <div className="bg-primary/10 border-l-4 border-primary p-4">
              <p className="text-sm text-primary-foreground">
                <strong>Note:</strong> Global effects are tied to a specific store and run automatically 
                when any of the atoms they depend on change.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Effect Atoms with `atomEffect`
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
        set(otherAtom, false)
    }
})

// These must be mounted somewhere to work!
const RootComponent = () => {
    useAtomValue(flipperAtom)
    
    return <div>...</div>
}`}
            </CodeBlock>
            
            <div className="bg-primary/10 border-l-4 border-primary p-4">
              <p className="text-sm text-primary-foreground">
                <strong>Important:</strong> Effect atoms only run when they are mounted via 
                <code className="bg-muted px-1 rounded mx-1">useAtomValue</code> or similar hooks.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Targeted Effects with `withAtomEffect`
            </CardTitle>
            <CardDescription>
              Define effects that run when specific atoms change
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Use <code className="bg-muted px-1 rounded">withAtomEffect</code> to create effects 
              that are automatically mounted when the original atom is used.
            </p>
            
            <CodeBlock language="typescript">
{`const flipperAtom = withAtomEffect(myAtom, (get, set) => {
    if (get(myAtom)) {
        set(otherAtom, false)
    }
})

// Effect is mounted while original atom is mounted
useAtomValue(myAtom)`}
            </CodeBlock>
            
            <div className="bg-primary/10 border-l-4 border-primary p-4">
              <p className="text-sm text-primary-foreground">
                <strong>Benefit:</strong> The effect is automatically active whenever the target atom 
                is in use, providing seamless integration.
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
            
            <div className="bg-primary/10 border-l-4 border-primary p-4">
              <p className="text-sm text-primary-foreground">
                <strong>Pattern:</strong> This pattern ensures effects are active whenever the main atom 
                is in use, without requiring consumers to know about the effect.
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📊</span>
              Advanced Example: Analytics Tracking
            </CardTitle>
            <CardDescription>
              Using effects for side-effects like analytics and logging
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock language="typescript">
{`const userActionsAtom = atom<UserAction[]>([])
const currentPageAtom = atom<string>('/')
const userPreferencesAtom = atom<UserPreferences | null>(null)

// Track user actions for analytics
const analyticsEffectAtom = atomEffect((get, set) => {
    const actions = get(userActionsAtom)
    const currentPage = get(currentPageAtom)
    const preferences = get(userPreferencesAtom)
    
    // Only track if user has consented
    if (preferences?.analyticsConsent) {
        const latestAction = actions[actions.length - 1]
        if (latestAction) {
            analytics.track('user_action', {
                action: latestAction.type,
                page: currentPage,
                timestamp: latestAction.timestamp,
                userId: preferences.userId
            })
        }
    }
})

// Auto-sync with localStorage
const localStorageEffectAtom = atomEffect((get, set) => {
    const preferences = get(userPreferencesAtom)
    
    if (preferences) {
        localStorage.setItem('userPreferences', JSON.stringify(preferences))
    }
})

// Combined effect atom that mounts all effects
const appEffectsAtom = atom((get) => {
    get(analyticsEffectAtom)
    get(localStorageEffectAtom)
    return null
})

// Mount all effects in your app root
const App = () => {
    useAtomValue(appEffectsAtom)
    
    return <Router>...</Router>
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
              <li><strong className="text-foreground">Avoid effect chains:</strong> Be careful not to create cascading effects that are hard to debug</li>
              <li><strong className="text-foreground">Consider performance:</strong> Effects run on every state change of their dependencies</li>
              <li><strong className="text-foreground">Handle cleanup:</strong> Use cleanup functions for subscriptions and timers</li>
              <li><strong className="text-foreground">Test effects:</strong> Mock stores make effect testing straightforward</li>
              <li><strong className="text-foreground">Document side-effects:</strong> Make it clear when atoms have effects attached</li>
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