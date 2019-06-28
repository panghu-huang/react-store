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
  public updateReduxStore?: (updatedData: S | Partial<S>) => void

  constructor(store: S, otherActions: C) {
    this.store = store
    this.otherActions = otherActions
    this.initDevTools(store)
  }

  public createContext() {
    return createContext(this.store)
  }

  public createActions() {
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
    const actions = this.createActions()
    actions.store.setStore = (
      state: Partial<S> | S | ((prevState: S) => (S | Partial<S> | null)), 
      callback?: () => void) => {
        // @ts-ignore
        originalSetState(({ store }) => {
          const updated = 'function' === typeof state
            // @ts-ignore
            ? state(store)
            : state
          const updatedStore = {
            ...store,
            ...updated,
          }
          this.updateReduxStore && this.updateReduxStore(updatedStore)
          return {
            store: updatedStore,
          }
        }, callback)
    }
  }

  private initDevTools(store: S) {
    const { NODE_ENV } = process.env
    const reduxDevTools = NODE_ENV === 'development'
      && window
      && window.__REDUX_DEVTOOLS_EXTENSION__
    if (reduxDevTools) {
      const features = {
        jump: true,
      }
      const actions = this.createActions()
      const devTools = reduxDevTools.connect({ name: 'Storer', features })
      devTools.init(store)
      devTools.subscribe((data: { type: string, state: S | Partial<S>, payload: any }) => {
        switch(data.type) {
          case 'DISPATCH':
            const { type } = data.payload
            if (type === 'JUMP_TO_STATE' || type === 'JUMP_TO_ACTION') {
              actions.store.setStore(data.state)
            }
          default:
            break
        }
      })
      this.updateReduxStore = (data: S | Partial<S>) => {
        devTools.send({ type: 'setStore' }, data)
      }
    }
  }
}

export default Storer