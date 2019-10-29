export default class StringUtil {
  /**
   *
   * @param num
   * @returns {string}
   */
  static formatLegalCurrency(num: number) {
    num = num.toString().replace(/\$|\,/g, '')
    if (isNaN(num)) {
      num = '0'
    }
    num = Math.floor(num * 100 + 0.50000000001)
    let cents = num % 100
    num = Math.floor(num / 100).toString()
    if (cents < 10) {
      cents = '0' + cents
    }
    for (let i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
      num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3))
    }
    return num + '.' + cents
  }

  /**
   * Slice value (Maximum 8 decimal places)
   * @param num
   * @returns {string}
   */
  static formatCryptoCurrency(num) {
    num = num.toString()
    let index = num.indexOf('.')
    let originDecimalDigit = 0
    let decimalValue = 0
    let decimalDigit = 0
    let integerDigit = 10
    if (index !== -1) {
      originDecimalDigit = num.length - index - 1
      decimalValue = "0" + num.slice(index, num.length)
      integerDigit = index < 10 ? index : 10
      decimalDigit = parseFloat(decimalValue) === 0 ? 0 : 10 - integerDigit

    }
    if (decimalDigit === 0) {
      return num.slice(0, integerDigit -1)
    }else {
      let tailStr = originDecimalDigit >= decimalDigit ? "..." : ""
      return num.slice(0, integerDigit + decimalDigit)+ tailStr
    }
  }

  /**
   * Remove Ox string
   * @param data
   * @returns {string}
   */
  static removeOxHexString(data) {
    if (data.startsWith('0x')) {
      data = data.slice(2, data.length)
    }
    return data
  }

  /**
   *  Remove  '-' String
   * @param data
   * @returns {string}
   */
  static removeNegativeSymbol(data) {
    if (data.startsWith('-')) {
      data = data.slice(1, data.length)
    }
    return data
  }

  /**
   * Format timestamp to date(yyyy-MM-dd:HH:mm:ss)
   * @param {string} time
   */
  static formatTimeStamp(time, shortFormat=false) {
    let date = new Date(time)
    let yyyy = date.getFullYear().toString().slice(2)
    let month = date.getMonth() + 1
    let MM = parseInt(month / 10) ? month : '0' + month
    let dd = parseInt(date.getDate() / 10)
      ? date.getDate()
      : '0' + date.getDate()
    let HH = parseInt(date.getHours() / 10)
      ? date.getHours()
      : '0' + date.getHours()
    let mm = parseInt(date.getMinutes() / 10)
      ? date.getMinutes()
      : '0' + date.getMinutes()
    let ss = parseInt(date.getSeconds() / 10)
      ? date.getSeconds()
      : '0' + date.getSeconds()
    let arr = []
    if (!shortFormat) {
      arr.push(yyyy)
      arr.push('-')
      arr.push(MM)
      arr.push('-')
      arr.push(dd)
      arr.push(' ')
      arr.push(HH)
      arr.push(':')
      arr.push(mm)
      arr.push(':')
      arr.push(ss)
    }else {
      arr.push(dd)
      arr.push("/")
      arr.push(MM)
      arr.push("/")
      arr.push(yyyy)
    }
    return arr.join('')
  }

  static isInvalidValue(value) {
    if (isNaN(value) || value.startsWith('-') || value.startsWith('0x') || value.indexOf(" ") !== -1 ) {
      return true
    }
    return false
  }

  static isPositiveInteger(value) {
    if (/^\d+$/.test(value)) {
      return true
    }
    return false
  }

  static isHexString(text) {
    if (text && !/^(0[xX])?[0-9a-fA-F]+$/.test(text)) {
      return false
    }
    return true
  }

  static jsonToFormData(body) {
    let EQUAL = '='
    let AMP = '&'
    return Object.keys(body)
      .map(
        key =>
          Array.isArray(body[key])
            ? body[key]
              .map(value => key + EQUAL + encodeURIComponent(value))
              .join(AMP)
            : key + EQUAL + encodeURIComponent(body[key])
      )
      .join(AMP)
  }

  static toFixNum(v, e) {
    var t=1;
    for(;e>0;t*=10,e--);
    for(;e<0;t/=10,e++);
    return (Math.round(v*t)/t).toString();
  }
}
