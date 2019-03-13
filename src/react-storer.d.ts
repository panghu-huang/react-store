import Storer from './Storer'

export as namespace ReactStorer

export function genStorer<S, C>(initialState: S, actions: C): Storer<S, C>

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
