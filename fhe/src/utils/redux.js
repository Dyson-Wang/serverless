import { createStore } from 'redux'

function counterReducer(state = {
  main: {
    nscount: '暂无数据',
    fscount: '暂无数据',
    httpget: '暂无数据',
    httppost: '暂无数据',
    sqlservice: '暂无数据',
    totalsc: '暂无数据',
    totalfail: '暂无数据'
  }
}, action) {
  switch (action.type) {
    case 'setNewNamespaceStatus':
      return { ...state, namespaceState: action.value, }
    case 'setNewFunctionStatus':
      return { ...state, functionState: action.value, }
    case 'setBrowserTokenAndId':
      return { ...state, browsertoken: action.value.browsertoken, browserid: action.value.browserid }
    case 'setMainInfo':
      if (action.value == undefined) return {
        ...state, main: {
          nscount: '暂无数据',
          fscount: '暂无数据',
          httpget: '暂无数据',
          httppost: '暂无数据',
          sqlservice: '暂无数据',
          totalsc: '暂无数据',
          totalfail: '暂无数据'
        }
      }
      return { ...state, main: action.value }
    default:
      return state
  }
}

let store = createStore(counterReducer)


export default store;