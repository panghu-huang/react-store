import * as React from 'react'

export interface StoreProviderProps<T> {
  initialState: T
}

export function create<S, A>(reducer: React.Reducer<S, A>, displayName = 'StoreContext') {
  const Context = React.createContext<[S, React.Dispatch<A>]>([] as any)
  Context.displayName = displayName

  let cachedStore: S
  const StoreProvider: React.FC<StoreProviderProps<S>> = props => {
    const value = React.useReducer(reducer, props.initialState)
    cachedStore = value[0]
    return (
      <Context.Provider value={value}>
        {props.children}
      </Context.Provider>
    )
  }

  const useStore = () => {
    const [store] = React.useContext(Context)
    if (typeof store === 'undefined') {
      throw new Error('You should not use `useStore` outside <StoreProvider/>')
    }
    return store
  }

  const useDispatch = () => {
    const [, dispatch] = React.useContext(Context)
    if (typeof dispatch === 'undefined') {
      throw new Error('You should not use `useDispatch` outside <StoreProvider/>')
    }
    return dispatch
  }

  const getStore = () => cachedStore

  return {
    StoreProvider,
    useStore,
    useDispatch,
    getStore,
  }
}