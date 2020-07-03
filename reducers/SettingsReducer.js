import ActionType from '../actions/ActionType'
import {D} from 'esecubit-wallet-sdk'

const initialState = {
  btcUnit: '',
  ethUnit: '',
  eosUnit: '',
  legalCurrencyUnit: '',
  scanAddress: '',
  // 默认支持btc, eth
  coinTypes: [D.coin.main.btc, D.coin.main.eth],
  walletName: D.wallet.s300
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
    case ActionType.SET_SUPPORTED_COIN_TYPES:
      return {
        ...state,
        coinTypes: action.coinTypes
      }
    case ActionType.SET_WALLET_NAME:
      return {
        ...state,
        walletName: action.walletName
      }
    default:
      return state
  }
}
