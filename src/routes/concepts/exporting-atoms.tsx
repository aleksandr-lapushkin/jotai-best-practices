import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { Shield, Lock, Share, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

export const Route = createFileRoute('/concepts/exporting-atoms')({
  component: ExportingAtomsComponent,
})

function ExportingAtomsComponent() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Exporting Atoms</h1>
        <p className="text-xl text-muted-foreground">
          Maintain control over your state by exposing narrow, specific APIs to consumers
        </p>
      </div>

      <Card className="bg-red-50 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            The Problem with Direct Atom Exports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Even if you structure your Atoms well, you can still end up in an unfortunate situation 
            if anyone can mutate your data in any way they want. Direct atom exports can lead to 
            uncontrolled mutations that bypass your business logic.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Problematic Pattern
            </CardTitle>
            <CardDescription>
              What happens when you export atoms directly without boundaries
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              This example shows how direct atom exports can lead to uncontrolled state mutations:
            </p>
            
            <CodeBlock language="typescript">
{`// atoms.ts
export const pageAtom = atom(0)

export const dataAtom = atom((get) => {
    return fetch(URL + \`?page=\${get(pageAtom)}\`)
})

// MyComponent.tsx
// No bounding on the page changes can lead to page going over the max or below minimum
const MyComponent = () => {
    const myData = useAtomValue(dataAtom)
    const updatePage = useSetAtom(pageAtom)

    return (
        <DataTable data={myData}>
            <Pagination 
                onNext={() => updatePage(p => p + 1)}
                onPrevious={() => updatePage(p => p - 1)}
            />
        </DataTable>
    )
}`}
            </CodeBlock>
            
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <p className="text-sm text-red-800">
                <strong>Issues:</strong> Page can go negative, exceed maximum pages, or be set to invalid values. 
                No validation or business logic enforcement.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Solution 1: Controlled Write API
            </CardTitle>
            <CardDescription>
              Expose atoms with narrow, controlled mutation APIs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              The correct approach is to always allow a <strong>very narrow, very specific</strong> set 
              of operations on the data to the outside world.
            </p>
            
            <CodeBlock language="typescript">
{`// atoms.ts
const _pageAtom = atom(0)

// Expose an atom that returns the value of the underlying atom 
// and exposes a very narrow API on the underlying data
export const pageAtom = atom(
    (get) => get(_pageAtom), 
    (get, set, payload: {type: "add" | "sub", amount: number} = {type: "add", amount: 1}) => {
        set(_pageAtom, (current) => {
            const newValue = payload.type === "add" ? current + payload.amount : current - payload.amount
            const clamped = Math.max(0, newValue)
            return clamped
        })
    }
)

export const dataAtom = atom((get) => {
    return fetch(URL + \`?page=\${get(_pageAtom)}\`)
})

// MyComponent.tsx
// Now the consumer can't modify the data to be incorrect!
const MyComponent = () => {
    const myData = useAtomValue(dataAtom)
    const updatePage = useSetAtom(pageAtom)

    return (
        <DataTable data={myData}>
            <Pagination 
                onNext={() => updatePage({type: "add"})}
                onPrevious={() => updatePage({type: "sub"})}
            />
        </DataTable>
    )
}`}
            </CodeBlock>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share className="h-5 w-5 text-blue-600" />
              Solution 2: Action Atom Approach
            </CardTitle>
            <CardDescription>
              Use dedicated action atoms for controlled mutations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              You could also just expose a single action atom with validation built-in:
            </p>
            
            <CodeBlock language="typescript">
{`// atoms.ts
const _pageAtom = atom(0)

// You could also just expose a single action atom
export const updatePageActionAtom = atom(null, (get, set, payload: {amount: number}) => {
    set(_pageAtom, (curr) => Math.max(0, curr + payload.amount))
})

export const pageAtom = atom((get) => get(_pageAtom)) // Read-only export

export const dataAtom = atom((get) => {
    return fetch(URL + \`?page=\${get(_pageAtom)}\`)
})

// MyComponent.tsx
const MyComponent = () => {
    const myData = useAtomValue(dataAtom)
    const currentPage = useAtomValue(pageAtom)
    const updatePage = useSetAtom(updatePageActionAtom)

    return (
        <DataTable data={myData}>
            <Pagination 
                currentPage={currentPage}
                onNext={() => updatePage({amount: 1})}
                onPrevious={() => updatePage({amount: -1})}
            />
        </DataTable>
    )
}`}
            </CodeBlock>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-purple-600" />
              Cross-Domain Read-Only Access
            </CardTitle>
            <CardDescription>
              Safe pattern for reading atoms across domain boundaries
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              If you need to read data from atoms within atoms across domain bounds, export a readonly version. 
              This ensures that control over the data is still localized to the domain where the atom is defined.
            </p>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-700">Do ✅</span>
                </div>
                <CodeBlock language="typescript">
{`const currentDateAtom = atom(new Date())
const readonlyCurrentDateAtom = atom((get) => get(currentDateAtom))

export const Atoms = {
    currentDate: readonlyCurrentDateAtom
}`}
                </CodeBlock>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="font-semibold text-red-700">Don't ❌</span>
                </div>
                <CodeBlock language="typescript">
{`export const currentDateAtom = atom(new Date())`}
                </CodeBlock>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-indigo-600" />
              Complex Example: User Preferences
            </CardTitle>
            <CardDescription>
              A real-world example of controlled atom exports
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock language="typescript">
{`// userPreferences.ts
interface UserPreferences {
    theme: 'light' | 'dark' | 'system'
    language: string
    notifications: boolean
    autoSave: boolean
}

const _preferencesAtom = atom<UserPreferences>({
    theme: 'system',
    language: 'en',
    notifications: true,
    autoSave: true
})

// Read-only access to preferences
export const preferencesAtom = atom((get) => get(_preferencesAtom))

// Controlled mutations through action atoms
export const updateThemeAtom = atom(null, (get, set, theme: UserPreferences['theme']) => {
    const current = get(_preferencesAtom)
    set(_preferencesAtom, { ...current, theme })
    
    // Apply theme immediately
    document.documentElement.setAttribute('data-theme', theme)
})

export const updateLanguageAtom = atom(null, async (get, set, language: string) => {
    // Validate language is supported
    const supportedLanguages = ['en', 'es', 'fr', 'de']
    if (!supportedLanguages.includes(language)) {
        throw new Error(\`Unsupported language: \${language}\`)
    }
    
    const current = get(_preferencesAtom)
    set(_preferencesAtom, { ...current, language })
    
    // Load language resources
    await loadLanguageResources(language)
})

export const toggleNotificationsAtom = atom(null, (get, set) => {
    const current = get(_preferencesAtom)
    const newValue = !current.notifications
    
    set(_preferencesAtom, { ...current, notifications: newValue })
    
    // Update browser notification permissions
    if (newValue && Notification.permission === 'default') {
        Notification.requestPermission()
    }
})

// Bulk update with validation
export const updatePreferencesAtom = atom(null, (get, set, updates: Partial<UserPreferences>) => {
    const current = get(_preferencesAtom)
    const newPreferences = { ...current, ...updates }
    
    // Validate the complete preferences object
    validatePreferences(newPreferences)
    
    set(_preferencesAtom, newPreferences)
})`}
            </CodeBlock>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">✨</span>
              Best Practices Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Never export writable atoms directly</strong> across domain boundaries</li>
              <li><strong>Use read-only atom wrappers</strong> for cross-domain data access</li>
              <li><strong>Expose specific action atoms</strong> with built-in validation</li>
              <li><strong>Create controlled write APIs</strong> that enforce business rules</li>
              <li><strong>Minimize atom mutations</strong> across domain boundaries</li>
              <li><strong>Co-locate validation logic</strong> with the atoms that need it</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}