# React Storer

> src/store

```jsx
import { createBrowserHistory } from 'history'
import { genStorer } from 'react-storer'
import { IStore, IAction } from 'src/types'

const otherActions: IAction = {
  history: createBrowserHistory(),
}

export const defaultStore: IStore = {
  userInfo: null,
  price: 0,
  messages: [],
}

export const storer = genStorer<IStore, IAction>(defaultStore, otherActions)

export const StoreContext = storer.genContext()

export const actions = storer.genActions()
```

> src/App.tsx

```jsx
import * as React from 'react'
import { Router } from 'react-router-dom'
import { createHashHistory } from 'history'
import { 
  StoreContext, 
  defaultStore, 
  actions, 
  storer 
} from 'src/store'
import { IStore } from 'src/types'
import MainStackRouter from 'src/routes'
import './global.scss'

export interface IAppState {
  store: IStore
}

class App extends React.Component<any, IAppState> {

  constructor(props: any) {
    super(props)
    this.state = {
      store: defaultStore,
    }
    // bind setStore
    storer.bindSetStore(
      this.setState.bind(this)
    )
    // add or replace action
    storer.addAction('history', createHashHistory())
  }

  public componentDidMount() {
    // dispatch action
    actions.store.setStore({ price: 110 })
  }

  public render() {
    const { store } = this.state
    return (
      <Router history={actions.history}>
        <StoreContext.Provider value={store}>
          <MainStackRouter />
        </StoreContext.Provider>
      </Router>
    )
  }

}

export default App
```