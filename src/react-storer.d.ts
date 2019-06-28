import Storer from './Storer'

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: any
  }
}

export as namespace ReactStorer

export function createStorer<S, C>(initialState: S, actions?: C): Storer<S, C>

export type SetStoreAction<S> = (
  state: Partial<S> | S | ((prevState: S) => (S | Partial<S> | null)), 
  callback?: () => void
) => void

export interface Actions<S> {
  setStore: SetStoreAction<S>
}

export interface Store<S> {
  store: Actions<S>
}
