import RNProvider from '../RNProvider'
import {errorMap} from 'esecubit-wallet-i18n/errorMap'

class ErrorUtil {
  static getErrorMsg(errCode) {
    if (errorMap[errCode] === undefined) {
      console.warn('getErrorMsg,undefined', errCode)
      return RNProvider.I18n.t(errorMap[10001])
    }
    return RNProvider.I18n.t(errorMap[errCode])
  }
}

export default ErrorUtil
