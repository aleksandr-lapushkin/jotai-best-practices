import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { Workflow, Eye, Zap, Target, Lightbulb, ArrowRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/concepts/effects')({
  component: EffectsComponent,
})

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
            Effects in Jotai allow you to react to state changes automatically. Think of them as 
            <strong>action atoms that trigger on state changes</strong> rather than being called explicitly. 
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🔗</span>
              Connecting the Concepts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Effects complete the Jotai best practices picture by adding reactive capabilities to your 
              well-structured atomic state:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-primary">Structure + Effects</h4>
                <p className="text-sm text-muted-foreground">
                  Use domain-based organization to keep effects focused and maintainable, just like your atoms.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-primary">Composition + Effects</h4>
                <p className="text-sm text-muted-foreground">
                  Effects can depend on derived atoms, automatically reacting to complex state changes.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-primary">Actions + Effects</h4>
                <p className="text-sm text-muted-foreground">
                  Action atoms handle explicit operations; effects handle automatic reactions to state changes.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-primary">Boundaries + Effects</h4>
                <p className="text-sm text-muted-foreground">
                  Apply the same export control principles - hide effect complexity behind clean atom interfaces.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🎓</span>
              You've Mastered Jotai Best Practices!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Congratulations! You now understand the complete toolkit for building maintainable Jotai applications:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-muted rounded-lg">
                <div className="font-medium text-primary mb-1">Foundation</div>
                <div className="text-sm text-muted-foreground">Structure atoms by domain, choose proper granularity</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="font-medium text-primary mb-1">Composition</div>
                <div className="text-sm text-muted-foreground">Build complex state from simple, focused atoms</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="font-medium text-primary mb-1">Business Logic</div>
                <div className="text-sm text-muted-foreground">Encapsulate operations with action atoms</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="font-medium text-primary mb-1">API Design</div>
                <div className="text-sm text-muted-foreground">Control access with clean export boundaries</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="font-medium text-primary mb-1">Reactivity</div>
                <div className="text-sm text-muted-foreground">Handle side-effects with targeted effects</div>
              </div>
            </div>
            <p>
              Ready to see these concepts in action? Explore the Examples section for real-world implementations, 
              or dive into Advanced Topics for patterns like async data management and testing strategies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link 
                to="/examples" 
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <span>Explore: Interactive Examples</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link 
                to="/advanced" 
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <span>Or dive into: Advanced Topics</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}