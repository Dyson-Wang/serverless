import { createStore } from 'redux'

function counterReducer(state = {  }, action) {
  switch (action.type) {
    case 'setNewNamespaceStatus':
      return { namespaceState: action.value, ...state }
    case 'setNewFunctionStatus':
      return { functionState: action.value, ...state }
    default:
      return state
  }
}

let store = createStore(counterReducer)

store.subscribe(() => console.log(store.getState()))

export default store;