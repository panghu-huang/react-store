import Storer from './Storer'

export const genStorer = <S, C>(store: S, otherActions: C): Storer<S, C> => {
  return new Storer(store, otherActions)
}
