import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { RefreshCw, Clock, Zap } from 'lucide-react'

export const Route = createFileRoute('/utilities/atomWithDefault')({
  component: AtomWithDefaultComponent,
})

function AtomWithDefaultComponent() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">atomWithDefault & atomWithReset</h1>
        <p className="text-xl text-muted-foreground">
          Create atoms with computed default values and reset functionality
        </p>
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-6 w-6 text-primary" />
            Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <code className="bg-muted px-1 rounded">atomWithDefault</code> is a subtype of <code className="bg-muted px-1 rounded">atomWithReset</code>. 
            Both support providing a default value, but <code className="bg-muted px-1 rounded">atomWithDefault</code> allows you to provide 
            a value getter function (that can also be async). Both can be reset to their initial value.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🔄</span>
              Basic Usage
            </CardTitle>
            <CardDescription>
              Simple default values and reset functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock language="typescript">
{`import { RESET } from 'jotai/utils'

const defaultAtom = atomWithDefault(() => 0)
const resettableAtom = atomWithReset(0)

const resetState = atom(null, (get, set) => {
    set(defaultAtom, RESET)
    set(resettableAtom, RESET)
})`}
            </CodeBlock>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Async Default Values
            </CardTitle>
            <CardDescription>
              Computing default values from async operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              You can use async functions to compute default values, including integration with other atoms:
            </p>
            
            <CodeBlock language="typescript">
{`// Using with async
const asyncFetchAtom = atom(async (get) => fetch(URL))
const asyncSuspendingAtom = atom(async (get) => use(fetch(URL)))

// Both of these will return the computed default value until the first write
const defaultFromAsync = atomWithDefault(async () => {
    const result = await get(asyncFetchAtom)
    return result.json()
})

const defaultFromSuspendingAsync = atomWithDefault(async () => {
    const result = await get(asyncSuspendingAtom)
    return result.json()
})`}
            </CodeBlock>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Real-World Example: User Settings
            </CardTitle>
            <CardDescription>
              Loading default settings from localStorage with fallbacks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock language="typescript">
{`interface UserSettings {
    theme: 'light' | 'dark'
    language: string
    fontSize: number
}

const defaultSettings: UserSettings = {
    theme: 'light',
    language: 'en',
    fontSize: 14
}

// Load settings from localStorage with fallback to defaults
const userSettingsAtom = atomWithDefault(async () => {
    try {
        const stored = localStorage.getItem('userSettings')
        if (stored) {
            const parsed = JSON.parse(stored)
            // Merge with defaults to handle missing properties
            return { ...defaultSettings, ...parsed }
        }
    } catch (error) {
        console.warn('Failed to load user settings:', error)
    }
    return defaultSettings
})

// Reset to defaults action
const resetSettingsAtom = atom(null, (get, set) => {
    set(userSettingsAtom, RESET)
    localStorage.removeItem('userSettings')
})

// Usage in component
const Settings = () => {
    const [settings, setSettings] = useAtom(userSettingsAtom)
    const resetSettings = useSetAtom(resetSettingsAtom)
    
    const updateTheme = (theme: 'light' | 'dark') => {
        const newSettings = { ...settings, theme }
        setSettings(newSettings)
        localStorage.setItem('userSettings', JSON.stringify(newSettings))
    }
    
    return (
        <div>
            <button onClick={() => updateTheme('dark')}>Dark Mode</button>
            <button onClick={() => resetSettings()}>Reset to Defaults</button>
        </div>
    )
}`}
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
              <li><strong className="text-foreground">Lazy initialization:</strong> Default values are computed only when needed</li>
              <li><strong className="text-foreground">Async support:</strong> Can fetch default values from APIs or async operations</li>
              <li><strong className="text-foreground">Reset capability:</strong> Easy way to restore original state</li>
              <li><strong className="text-foreground">Dependency integration:</strong> Default computation can depend on other atoms</li>
              <li><strong className="text-foreground">Error handling:</strong> Graceful fallbacks when default computation fails</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-muted/30 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🚧</span>
              Coming Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              More advanced patterns and integration examples will be added here, including:
            </p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-muted-foreground">
              <li>Integration with form libraries</li>
              <li>Server-side rendering patterns</li>
              <li>Complex async dependency chains</li>
              <li>Error boundary integration</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}