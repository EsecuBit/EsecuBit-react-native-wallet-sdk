// ----- Attention ------
// 此global文件 需要在App程序入口文件，最先被import
// ----------------------
global.Buffer = global.Buffer || require('buffer').Buffer
global.process.version = '1.0'
global.navigator = global.navigator || {}
global.window = global.window || {}
global.chrome = global.chrome || undefined
import {Text, TextInput, Platform} from 'react-native'

// 全局统一，禁止字体缩放，防止UI布局变形
TextInput.defaultProps = Object.assign({}, TextInput.defaultProps, {allowFontScaling: false});
Text.defaultProps = Object.assign({}, Text.defaultProps, {allowFontScaling: false});

// iOS 10的JavaScriptCore才开始支持TypeArray, https://developer.apple.com/library/archive/releasenotes/General/iOS10APIDiffs/Objective-C/JavaScriptCore.html
// 在程序加载前，需要将对应的方法重写。
if (Platform.OS === 'ios' && parseInt(Platform.Version, 10) < 10) {
  global.Uint8Array.prototype.fill = function (value) {
    for (let i = 0; i < this.length; i++) {
      this[i] = value;
    }
  }

  global.Uint32Array.from = function (obj, func, thisObj) {
    // copy from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/from#Polyfill
    func = func || function (elem) {
      return elem;
    };
    if (typeof func !== 'function') {
      throw new TypeError('specified argument is not a function');
    }
    obj = Object(obj);
    if (!obj['length']) {
      return new this(0);
    }

    var copy_data = [];
    for(var i = 0; i < obj.length; i++) {
      copy_data.push(obj[i]);
    }
    copy_data = copy_data.map(func, thisObj);

    var typed_array = new this(copy_data.length);
    for(var i = 0; i < typed_array.length; i++) {
      typed_array[i] = copy_data[i];
    }
    return typed_array;
  }

  global.Uint32Array.prototype.reverse = function () {
    return Array.prototype.reverse.call(this);
  }
}

