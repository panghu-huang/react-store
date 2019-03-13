import { createContext } from 'react'

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

class Storer<S, C> {

  public actions: C & Store<S>
  public otherActions: C
  public store: S

  constructor(store: S, otherActions: C) {
    this.store = store
    this.otherActions = otherActions
  }

  public genContext() {
    return createContext(this.store)
  }

  public genActions() {
    if (!this.actions) {
      this.actions = {
        store: {
          setStore: () => {/* default */},
        },
        ...this.otherActions,
      }
    }
    return this.actions
  }

  public addAction<P extends keyof (C & Store<S>)>(actionName: P, action: (C & Store<S>)[P]) {
    this.actions[actionName] = action
  }

  public removeAction(actionName: keyof (C & Store<S>)) {
    return delete this.actions[actionName]
  }

  public bindSetStore(originalSetState: SetStoreAction<S>) {
    this.actions.store.setStore = (
      state: Partial<S> | S | ((prevState: S) => (S | Partial<S> | null)), 
      callback?: () => void) => {
        // @ts-ignore
        originalSetState(({ store }) => {
          const updated = 'function' === typeof state
            // @ts-ignore
            ? state(store)
            : state
          return {
            store: {
              ...store,
              ...updated,
            },
          }
        }, callback)
    }
  }

}

export default Storer