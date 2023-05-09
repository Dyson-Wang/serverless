import { createStore } from 'redux'

function counterReducer(state = {}, action) {
  switch (action.type) {
    case 'setNewNamespaceStatus':
      return { ...state, namespaceState: action.value, }
    case 'setNewFunctionStatus':
      return { ...state, functionState: action.value, }
    case 'setBrowserTokenAndId':
      return { browsertoken: action.value.browsertoken, browserid: action.value.browserid, ...state }
    default:
      return state
  }
}

let store = createStore(counterReducer)

store.subscribe(() => console.log(store.getState()))

export default store;