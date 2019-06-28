import Storer from './Storer'

export const createStorer = <S, C>(store: S, otherActions?: C): Storer<S, C> => {
  return new Storer(store, otherActions || {} as any)
}
