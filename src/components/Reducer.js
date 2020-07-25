const Reducer = (state, action) => {
  try {
    switch (action.type) {
      case 'SET_ANEXO':
        return {
          ...state,
          anexos: action.payload
        }
      case 'ADD_ANEXO':
        return {
          ...state,
          anexos: state.anexos.concat(action.payload)
        }
      case 'REMOVE_ANEXO':
        return {
          ...state,
          anexos: state.anexos.filter(anexo => anexo.id !== action.payload.id)
        }
      case 'SET_ERROR':
        return {
          ...state,
          error: action.payload
        }
      default:
        return state
    }
  }
  catch (e) {
    console.log('*** Error:', e)
  }
}

export default Reducer