# React Store

### 安装

```bash
$ yarn add @wokeyi/store
// or
$ npm install @wokeyi/store
```

### 示例

> src/store

```javascript
import { create } from '@wokeyi/store'

interface IState {
  name: string
  age: number
}

type ActionType = {
  type: 'SET_NAME'
  name: string
} | {
  type: 'SET_AGE',
  age: number
}

const reducer = (prevState: IState, action: ActionType): IState => {
  switch (action.type) {
    case 'SET_NAME':
      return {
        ...prevState,
        name: action.name,
      }
    case 'SET_AGE':
      return {
        ...prevState,
        age: action.age,
      }
    default:
      return prevState
  }
}

const { useStore, useDispatch, StoreProvider } = create<IState, ActionType>(reducer, {
  age: 0,
  name: 'default name',
})

export {
  useStore,
  useDispatch,
  StoreProvider,
}
```

> src/App.tsx

```javascript
import * as React from 'react'
import { StoreProvider } from 'src/store'
import Child from './Child'

const App = () => {
  return (
    <StoreProvider initialState={{ age: 1, name: 'default name' }}>
      <Child/>
    </StoreProvider>
  )
}

export default App
```

> src/Child.tsx

``` javascript
import * as React from 'react'
import { useStore, useDispatch } from 'src/store'

const Child: React.FC = () => {
  const store = useStore()
  const dispatch = useDispatch()

  const setAge = React.useCallback(() => {
    dispatch({
      type: 'SET_AGE',
      age: store.age + 1,
    })
  }, [store.age])
  return (
    <button onClick={setAge}>
      set age
    </button>
  )
};

export default Child
```