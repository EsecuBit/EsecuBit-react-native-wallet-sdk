import ActionType from '../actions/ActionType'

const initialState = {
  btcUnit: '',
  ethUnit: '',
  eosUnit: '',
  legalCurrencyUnit: '',
  scanAddress: ''
}

export default function settingsReducer(state = initialState, action) {
  switch (action.type) {
    case ActionType.SET_BTC_UNIT:
      return {
        ...state,
        btcUnit: action.unit
      }
    case ActionType.SET_ETH_UNIT:
      return {
        ...state,
        ethUnit: action.unit
      }
    case ActionType.SET_LEGAL_CURRENCY_UNIT:
      return {
        ...state,
        legalCurrencyUnit: action.unit
      }
    case ActionType.SET_EOS_UNIT:
      return {
        ...state,
        eosUnit: action.unit
      }
    case ActionType.SET_SCAN_ADDRESS:
      return {
        ...state,
        scanAddress: action.scanAddress
      }
    default:
      return state
  }
}
