# Jotai Best Practices
## Overview
- How it works
- Jotai Setup
- Declaring and structuring atoms
- Action atoms & atom mutations
- Exporting atoms
- Effects
- atomWithDefault, atomWithReset
- atomFamily
- atomWithReducer
- atomWithQuery variants
- Managing Async
- Testing

# How it works
Jotai is extremely simple at its core: there are Atoms and there's a Store. One way to think about it is that each atom is a separate data storage protocol: it dictates what is stored, how it's stored and how it can be read. The Store is where the data actually resides. When you try to read something from the Store, you need to do so via the respective Atom, since only it knows how to decode the data.

Atoms are not technically global - atoms are always bound to some Store. Jotai provides a default store that you don't need to initialise explicitly, but you can technically have multiple stores in your app with each one having copies of the same Atoms. In this way Atoms are very similar to Symbols.

# Jotai Setup
An approach that I've found works well is to define a custom `JotaiProvider` component, which would allow you to inject a custom Jotai store and also manage hydrating any atoms you might need, like TanStack's Query Client atom. "Hydrating" in this sense is just a fancy word for "setting an atom's value".
```typescript jsx
const JotaiProvider = ({store, children}: {store: Store, children}) => {
    return (
        <Provider store={store}>
            <HydrateAtoms>
                {children}
            </HydrateAtoms>
        </Provider>
    )
}
```

# Declaring and structuring Atoms
Since all state in Jotai is defined in Atoms, it's imperative that you have a clear structure for your Atoms. Otherwise your state will get smeared throughout your app, making it extremely difficult to work with.

An approach that I've found to work relatively well is to define all Atoms that belong to a given domain together. This is pretty easy to grasp. Here are some other rules that aren't maybe so straightforward:
1. **Prefer small pieces of state where possible unless that data is always mutated together**. This make it easier to derive other atoms and make it easier to reason about state.
```typescript jsx
//Do ✅
const currentDateAtom = atom(new Date())
const selectedDate = atom(null)
const isLoadingState = atom({isLoading: false, isLoadingMore: false})
//Checking for usages of currentDate will yield only results where it's explicitly used
const derived = atom((get) => get(currentDate))

//Don't ❌
const state = atom({currentDate: new Date(), selectedDate: null})
//Checking for usages of state will pick this one up. But `selectedDate` isn't even used here!
const derived = atom((get) => get(state).currentDate)
```
2. **Derive as much state as possible from existing state where it makes sense**. The less state we need to update manually, the fewer error vectors we have. Moreover, deriving values prevents race conditions or multiple updates. Any call to Jotai's `set` is immediate. Meaning that multiple sequential calls technically **could** cause multiple re-renders with inconsistent state in-between.
```typescript jsx
//Do ✅
const queryAtom = atom('hello world')
const hasQueryAtom = atom((get) => !!get(query))

//Don't ❌
const queryAtom = atom('hello world')
const hasQueryAtom = atom(true)
//...
const query = useAtomValue(queryAtom)
const [hasQuery, setHasQuery] = useAtom(hasQueryAtom)
useEffect(() => {
    setHasQuery(!!query)
}, [query])
```
3. **Group state mutations together into [Action Atoms](https://jotai.org/docs/guides/composing-atoms#action-atoms)**. This ensures that we always mutate all atoms once from a centralized location with the latest values. This helps prevent (but not fully stop) React from rendering the component between calls to mutators.
```typescript jsx
const myState = atom('test')
const myOtherState = atom(5)

//Do ✅
const mutateState = atom(null, (get, set, payload: {myStateValue: string, add: number}) => {
    set(myState, payload.myStateValue)
    set(myOtherState, (curr) => curr + payload.add)
})
//...
const mutateAction = useSetAtom(mutateState)
mutateAction({myStateValue: 'ayy', add: 2})

//Don't ❌
const [myStateValue, setMyState] = useAtom(myState)
const [myOtherStateValue, setMyOtherState] = useAtom(myOtherState)
const mutateState = useCallback((payload: {myStateValue: string, add: number}) => {
    setMyState(payload.myStateValue)
    setMyOtherState((curr) => curr + payload.add)
})
mutateState({myStateValue: 'ayy', add: 2})
```
4. **If you need to read data from atoms within atoms across domain bounds, export a readonly version**. This ensures that control over the data is still localized to the domain where the atom is defined.
```typescript jsx
//Do ✅
const currentDateAtom = atom(new Date())
const readonlyCurrentDateAtom = atom((get) => get(currentDateAtom))
export const Atoms = {
    currentDate: readonlyCurrentDateAtom
}
//Don't ❌
export const currentDateAtom = atom(new Date())
```
5. **Prefer to write code that minimizes atom mutations across domain boundaries. Export Action Atoms if there's no other way**.
6. **Prefer to read atoms and actions directly rather than via facade hooks**. This allows consumers to mount only the atoms they require, leading to a smaller performance overhead and easier testing.
```typescript jsx
const myAtom = atom("hello")
const mutateMyAtom = atom(null, (get, set, payload: string) => set(myAtom, `hello ${who}`))
//...In component

//Do ✅
const myAtomValue = useAtomValue(myAtom)
const mutateMyAtomCallback = useSetAtom(mutateMyAtom)

//Don't ❌
//Somewhere outside the component
const useMyState() {
    const myAtomValue = useAtomValue(myAtom)
    const mutateMyAtomCallback = useSetAtom(mutateMyAtom)
    
    return {
        myAtomValue,
        mutateMyAtomCallback
    }
}
//In component
const { myAtomValue, mutateMyAtomCallback } = useMyState()
```

# Action Atoms and Atom mutations
Action atoms are a neat little feature of Jotai that allows you to co-locate business logic with state, leading to a tighter integration between the two. Action Atoms are essentially reducers + effects in Rematch, etc. They allow you to write both mutations and side-effects.
```typescript jsx
const myAtom = atom("hello")

//Action without payload. Read function is null!
const capitalise = atom(null, (get, set) => {
    set(myAtom, (curr) => curr[0].toUpperCase() + curr.slice(1))
})
//Can be used like this
const doCapitalise = useSetAtom(capitalise)
//Does not require an arg!
doCapitalise()

//Payload can be anything!
const replace = atom(null, (get, set, payload: string) => {
    set(myAtom, payload)
})
const doReplace = useAtAtom(replace)
//Needs an argument!
replace("test")

//Action atoms can be accessed like any other atom
const replaceAndCapitalise = atom(null, (get, set, payload: string) => {
    set(replace, payload)
    set(capitalise)
})

//Can also be async and return a Promise
const asyncAction = atom(null, (get, set) => {
    return fetch("http://google.com")
})
```

# Exporting Atoms
This is something that was briefly covered earlier, but it felt important enough to call out separately. Even if you structure your Atoms well, you can still end up in an unfortunate situation if anyone can mutate your data in any way they want. Consider this example
```tsx
//atoms.ts
export const pageAtom = atom(0)

export const dataAtom = atom((get) => {
    return fetch(URL + `?page=${get(page)}`)
})

//MyComponent.tsx
//No bounding on the page changes can lead to page going over the max or below minimum
const MyComponent() {
    const myData = useAtomValue(dataAtom)
    const updatePage = useSetAtom(pageAtom)

    return (
        <DataTable data={myData}>
            <Pagination 
                onNext={() => updatePage(p => p + 1)}
                onPrevious={() => updatePage(p => p -1)}
            />
        </DataTable>
    )
}
```

The correct approach is to always allow a **very narrow, very specific** set of operations on the data to the outside world (anything not in the file where the atoms are defined). Consider this example instead:
```tsx
//--- atoms.ts
const _pageAtom = atom(0)

//Expose an atom that returns the value of the underlying atom and exposes a very narrow API on the underlying data
export const pageAtom = atom((get) => get(_pageAtom), 
    (get, set, payload: {type: "add" | "sub", amount: number} = {type: "add", amount: 1}) => {
        set(_pageAtom, (current) => {
            const newValue = payload.type === "add" ? current + payload.amount : current - payload.amount
            const clamped = Math.max(0, newValue)
            return clamped
        })
})

//You could also just expose a single action atom
export const updatePageActionAtom = atom(null, (get, set, payload: {amount: number}) => {
    set(_pageAtom, (curr) => Math.max(0, curr + payload.amount))
})

export const dataAtom = atom((get) => {
    return fetch(URL + `?page=${get(page)}`)
})

//--- MyComponent.tsx
//Now the consumer can't modify the data to be incorrect!
const MyComponent() {
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
}
```

# Effects
Effects in Jotai allow you to react to state changes via effect atoms. One way to think about them is they-re similar to Action Items that are executed on state changes. Effects typically are only needed in very specific, limited scenarios, but they can be quite powerful. There's 3 flavours of Effects:
Using **observe** to define global effects bound to a specific store
```tsx
const flipper = observe((get, set) => {
    if (get(myAtom)) {
        set(otherAtom, false) 
    }
}, store)
```
Using **atomEffect** to define effect atoms:
```tsx
const flipperAtom = atomEffect((get, set) => {
    if (get(myAtom)) {
        set(otherAtom, false)
    }
})

//These must be mounted somewhere to work!
const RootComponent() {
    useAtomValue(flipperAtom)
}
```

Using `withAtomEffect` to define effects on specific atom changes:
```tsx
const flipperAtom = withAtomEffect(myAtom, (get, set) => {
    if (get(myAtom)) {
        set(otherAtom, false)
    }
})

//Effect is mounted while original atom is mounted
useAtomValue(myAtom)
```

One neat trick that can be used:
```tsx

const _myPrivateAtom = atom("hello")
const myEffectAtom = atomEffect((get, set) => {
    console.log("_myPrivateAtom changed")
})
//Whenever myPublicAtom is used, the effect will also be mounted.
const myPublicAtom = atom(get => {
    get(myEffectAtom)

    return get(_myPrivateAtom)
})
```

One use case that we had for Effects was to sync Jotai and Rematch state during the transition:
```tsx
const emailAddressFilters = atom<EmailAddressFilter[]>([])

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

//In root of app
useReduxSync()
```

# atomWithDefault & atomWithReset
`atomWithDefault` is a subtype of `atomWithReset`. Both support providing a default value, but `atomWithDefault` allows you to provide a value getter function (that can also be async). Both can be reset to their initial value.
```tsx
import { RESET } from 'jotai/utils'

const defaultAtom = atomWithDefault(() => 0)
const resettableAtom = atomWithReset(0)

const resetState = atom(null, (get, set) => {
    set(defaultAtom, RESET)
    set(resettableAtom, RESET)
})

//Using with async
const asyncFetchAtom = atom(async (get) => fetch(URL))
const asyncSuspendingAtom = atom(async (get) => use(fetch(URL)))
//Both of these will return the computed default value intil the first write
const defaultFromAsync = atomWithDefault(async () => {
    const result = await get(asyncFetchAtom)
    return result.json()
})
const defaultFromSuspendingAsync = atomWithDefault(async () => {
    const result = await get(asyncSuspendingAtom)
    return result.json()
})
```

# atomFamily
Imagine you have some list entities and need to manage state per entity. That's where `atomFamily` becomes pretty useful.

```tsx
const messageIds = ['message1', 'message2']
//Will compute a new atom for each unique key
const messageCheckStatus = atomFamily((messageId: string) => atom(false))

const MyComponent({messageId}: {messageId: string}) {
    const isChecked = useAtomValue(messageCheckStatus(messageId))
    const setChecked = useSetAtom(messageCheckStatus(messageId))
    //...
}
```

# atomWithReducer
`atomWithReducer` is a variation on a narrowly-scoped atom write function covered in an earlier section. Imagine you have a piece of state that should only be mutated in a very specific fashion. One way to support this is to define a set of Action Atoms and expose them.

This works until your state depends on its previous version. For non-derived self-referential atoms `atomWithReducer` is a great option:
```tsx
const myComplexState = atomWithReducer(
    //Types are provided when initialising the reducer
    (value: {currentDate: Date}, action: {type: "add" | "sub", payload: number }) => {
        switch(action.type) {
            case "add": return { value: add(value.date, action.payload, 'days') }
            case "sub": return { value: sub(value.date, action.payload, 'days') }
            default: return value
        }
})
const MyComponent() {
    const [myComplexStateValue, setMyComplexState] = useAtom(myComplexState)
    //Will enforce strict typing!
    setMyComplexState({ type: "add", payload: 5 })
}
```

# atomWithQuery and its variants
Getting into 3rd-party integrations, `atomWithQuery` and its siblings (suspending, infinite, etc) is a wrapper around TanStack Query:
```tsx
const myQueryAtom = atomWithSuspenseQuery((get) => ({
    queryKey: ['my-query', get(someAtom)],
    queryFn: () => {
        return fetch(URL + get(params))
    }
}))

const derivedQueryValue = atom(async (get) => {
    const value = await get(myQueryAtom)
    return value.data ?? {}
})
```

# Managing Async

# Testing
