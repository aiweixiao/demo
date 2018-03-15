(function (global) {
    if (global.scm) {
      return
    }
    var scm = {}
  
    scm.ns = function () {
      var obj = this
      var name
      var fn
      if (arguments.length == 0) {
        return
      } else if (arguments.length == 1) {
        fn = arguments[0]
      } else {
        name = arguments[0]
        fn = arguments[1]
        var names = name.split('.'),
            i = -1
  
        while (names[++i]) {
          if (obj[names[i]] === undefined) {
            obj[names[i]] = {}
          }
          obj = obj[names[i]]
        }
      }!!fn && fn.call(obj, scm)
    }
  
    var doc = document,
        head = document.getElementsByTagName('head')[0]
    // utils
    function isType(type) {
      return function (obj) {
        return Object.prototype.toString.call(obj) === '[object ' + type + ']'
      }
    }
    var isObject = isType('Object')
    var isString = isType('String')
    var isArray = Array.isArray || isType('Array')
    var isFunction = isType('Function')
  
    function isNumeric(str) {
      return isType('Number')(str) || /^([+-]?)\d*\.*\d+$/.test(str)
    }
  
    function guid() {
      return 'ecmd' + (Math.random() * (1 << 30)).toString(16).replace('.', '')
    }
  
    function createExecIframe(src) {
      var iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.dataset.ajax = 'false'
      if (src && isString(src)) {
        iframe.src = src
      }
      document.body.appendChild(iframe)
      return iframe
    }
  
    function unparam(str) {
      var sep = '&',
          eq = '='
  
      var params = {},
          parts = str.split(sep),
          i, pair
  
      for (i = 0; i < parts.length; i++) {
        pair = parts[i].split(eq)
        if (pair && (pair.length == 2)) {
          params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1])
        }
      }
  
      return params
    }
  
    function param(obj) {
      if (typeof obj === 'string') {
        return obj
      }
  
      var sep = '&',
          eq = '='
      var pairs = []
  
      for (var i in obj) {
        var val = obj[i]
        // function瀵硅薄灏变笉瑕佷紶浜嗭紝浼犱簡涔熻浆涓嶅洖鏉�
        if (val !== null && typeof val !== 'undefined' &&
            typeof val !== 'function') {
          pairs.push(encodeURIComponent(i) + eq + encodeURIComponent(val))
        }
      }
  
      pairs.sort()
      return pairs.join(sep)
    }
  
    function trim(str) {
      if (str) {
        if (isString(str)) {
          return str.replace(/^\s*|\s*$/g, '')
        }
        if (isObject(str)) {
          for (var key in str) {
            if (str.hasOwnProperty(key) && isString(str[key])) {
              str[key] = trim(str[key])
            }
          }
          return str
        }
      }
      return str
    }
  
    function getScript(url, cb) {
      var node = doc.createElement('script')
  
      node.src = url
      node.async = true
      node.id = guid()
      node.charset = 'utf-8'
  
      cb && isFunction(cb) && (function (node, cb) {
        var oldCb = cb
        cb = function () {
          oldCb && oldCb()
          node.parentNode.removeChild(node)
        }
        if (doc.addEventListener) {
          // 涓嶈兘鐩存帴浣跨敤onload锛岃繖绉嶆儏鍐典笅node鍏冪礌瀛樺湪锛屼絾鏃犳硶鍦╠om涓幏鍙栧埌锛屼笖鑴氭湰涔熸病鐪熸鎵ц
          node.addEventListener('load', cb, false)
        } else {
          node.onreadystatechange = function () {
            var state = node.readyState
            if (/loaded|complete/i.test(state)) {
              cb()
            }
          }
        }
      })(node, cb)
  
      head.appendChild(node)
  
      return node
    }
  
    scm.ns('util', function () {
      this.isObject = isObject
      this.isString = isString
      this.isArray = isArray
      this.isNumeric = isNumeric
      this.isFunction = isFunction
      this.guid = guid
      this.createExecIframe = createExecIframe
      this.unparam = unparam
      this.param = param
      this.trim = trim
      this.getScript = getScript
    })
  
    /**
     * @namespace ua
     * @desc 鐢ㄦ埛浠ｇ悊妯″潡
     */
    scm.ns('ua', function () {
      var util = scm.util
      // 鏌愪簺濂囪懇鐨凙ndroid鎵嬫満鎷縰serAgent浼氫负绌�,鎴栬€呮湁鏉冮檺闂
      var userAgent = ''
      var unKown = false
      try {
        userAgent = navigator.userAgent.toLowerCase()
        if (!userAgent || util.trim(userAgent) == '') {
          unKown = true
        }
      } catch (e) {
        unKown = true
      }
  
      // only one key in @kyes can be true
      function pick(o, keys) {
        for (var i = 0; i < keys.length; i++) {
          if (o[keys[i]]) {
            return keys[i]
          }
        }
        return 'Unknown'
      }
  
      // OS
      var OS = {
        ios: /iPhone|iPod|iPad|IOS/i.test(userAgent),
        iphone: /iPhone/i.test(userAgent),
        ipod: /iPod/i.test(userAgent),
        ipad: /iPad/i.test(userAgent),
        iphoneVersion: (userAgent.match(/.+(?:iphone\ os)[\/: ]([\d_]+)/) || [0, 0])[1].toString().split('_').join('.'),
        ipadVersion: (userAgent.match(/.+(?:cpu\ os)[\/: ]([\d_]+)/) || [0, 0])[1].toString().split('_').join('.'),
  
        android: /Android/i.test(userAgent),
        androidPhone: /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i.test(userAgent),
        androidPad: (/Android/i.test(userAgent) && !/(?=.*\bAndroid\b)(?=.*\bMobile\b)/i.test(userAgent)),
        androidVersion: (userAgent.match(/.+(?:android)[\/: ]([\d.]+)/) || [0, 0])[1],
  
        blackberry: /BlackBerry/i.test(userAgent), //! can match small part of Opera Mini
        blackberryVersion: (userAgent.match(/BlackBerry(\s)?(\d+)/i) || [0, 0, 0])[2],
  
        palm: /PalmSource|Blazer/i.test(userAgent),
        palmVersion: (/Blazer/i.test(userAgent) ? '>3.1' : 0),
  
        symbian: /SymbianOS|GoBrowser/i.test(userAgent),
        symbianVersion: (userAgent.match(/SymbianOS\/([\d\.]+)/i) || [0, 0])[1],
  
        winPhone: /Windows\ Phone/i.test(userAgent),
        winPhoneVersion: (userAgent.match(/.+(?:windows\ phone\ os)[\/: ]([\d_]+)/i) || [0, 0])[1],
  
        winPC: /windows\ nt/i.test(userAgent),
        winPCVersion: (userAgent.match(/windows\ nt\ ([\d\.]+)/i) || [0, 0])[1]
      }
  
      var ver = 0,
          osname = 'Unknown'
      if (OS.iphone) {
        osname = 'iphone'
        ver = OS.iphoneVersion
      } else if (OS.ipod) {
        osname = 'ipod'
        ver = OS.iphoneVersion
      } else if (OS.ipad) {
        osname = 'ipad'
        ver = OS.ipadVersion
      } else if (OS.android) {
        osname = OS.androidPhone ? 'androidPhone' : 'androidPad'
        ver = OS.androidVersion
      } else if (OS.blackberry) {
        osname = 'blackberry'
        ver = OS.blackberryVersion
      } else if (OS.palm) {
        osname = 'palm'
        ver = OS.palmVersion
      } else if (OS.symbian) {
        osname = 'symbian'
        ver = OS.symbianVersion
      } else if (OS.winPhone) {
        osname = 'winPhone'
        ver = OS.winPhoneVersion
      } else if (OS.winPC) {
        osname = 'winPC'
        ver = OS.winPCVersion
      }
      OS.version = ver
      OS.name = osname
  
      // browser
      var browser = {
        chrome: /chrome/.test(userAgent),
        safari: (/webkit/.test(userAgent) && !/chrome/.test(userAgent)),
        opera: /opera/.test(userAgent),
        firefox: /firefox/.test(userAgent),
        msie: (/msie/.test(userAgent) && !/opera/.test(userAgent)),
        qqbrowser: /qqbrowser/.test(userAgent),
        ucbrowser: (/UCBrowser/i.test(userAgent) && !/UCWEB/i.test(userAgent)), // 闈炴瀬閫熸ā寮�
        ucweb: /UCWEB/i.test(userAgent), // 鏋侀€熸ā寮廢C
        wechart: /wechart|MicroMessenger/i.test(userAgent), // 寰俊鑷甫娴忚鍣�
        // spec browser
        bolt: /bolt/.test(userAgent),
        doris: /doris/.test(userAgent),
        fennec: /fennec/.test(userAgent),
        gobrowser: /gobrowser/.test(userAgent),
        iris: /iris/.test(userAgent),
        minimo: /minimo/.test(userAgent),
  
        // browser core
        mozilla: (/mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent)),
        webkit: /webkit/.test(userAgent),
  
        gecko: /[^like]{4} gecko/.test(userAgent),
        presto: /presto/.test(userAgent),
  
        xoom: /xoom/.test(userAgent)
      }
      browser.name = pick(browser, ['chrome', 'safari', 'opera', 'firefox', 'msie', 'qqbrowser', 'ucbrowser', 'ucweb', 'wechart'])
      browser.core = pick(browser, ['mozilla', 'webkit', 'gecko', 'presto', 'xoom'])
      browser.version = (userAgent.match(/.+(?:rv|it|ra|ie|me|ve)[\/: ]([\d.]+)/) || [])[1]
  
      /**
       * @name OS
       * @memberOf ua
       * @desc 鎿嶄綔浼犵粺淇℃伅
       * @example
       * //璋冪敤
       * TOP.scm.ua.OS
       */
      this.OS = OS
      /**
       * @name browser
       * @memberOf ua
       * @desc 娴忚鍣ㄤ俊鎭�
       * @example
       * //璋冪敤
       * TOP.scm.ua.browser
       */
      this.browser = browser
  
      // 涓嬮潰鐨勫睘鎬ф槸瀵瑰鐨勶紝鐢ㄦ潵鍋氶€昏緫鍒ゆ柇鐢ㄧ殑
      /**
       * @name iphone
       * @memberOf ua
       * @desc 璁惧鏄惁涓篿phone
       * @example
       * //璋冪敤
       * TOP.scm.ua.iphone
       */
      this.iphone = (userAgent.match(/iphone os/i) == 'iphone os') || OS.iphone || OS.ipod
      /**
       * @name ipad
       * @memberOf ua
       * @desc 璁惧鏄惁涓篿pad
       * @example
       * //璋冪敤
       * TOP.scm.ua.ipad
       */
      this.ipad = (userAgent.match(/ipad/i) == 'ipad') || OS.ipad
      /**
       * @name android
       * @memberOf ua
       * @desc 璁惧鏄惁涓篴ndroid
       * @example
       * //璋冪敤
       * TOP.scm.ua.android
       */
      this.android = unKown || (userAgent.match(/android/i) == 'android') || OS.android || OS.androidPhone || OS.androidPad
      /**
       * @name ios
       * @memberOf ua
       * @desc 璁惧绯荤粺鏄惁涓篿os
       * @example
       * //璋冪敤
       * TOP.scm.ua.ios
       */
      this.ios = this.iphone || this.ipad
    })
  
    var listeners = {}
  
    function event() {
      var caller = this
      this['on'] = function (id, ev, fn, once) {
        if (!isFunction(fn)) {
          return
        }
        if (once) {
          var oldFn = fn
          fn = function (args) {
            oldFn.call(this, args)
            caller.off(id, ev, fn)
          }
        }
  
        if (!listeners[id]) {
          listeners[id] = {}
        }
        if (!listeners[id][ev]) {
          listeners[id][ev] = []
        }
  
        // 涓嶄娇鐢╬ush鐨勫師鍥狅細瑙乫ire鏂规硶
        listeners[id][ev].unshift(fn)
      }
      this['off'] = function (id, ev, fn) {
        if (!listeners[id]) {
          return
        }
        if (!listeners[id][ev]) {
          return
        }
        if (arguments.length == 2) {
          delete listeners[id][ev]
        } else {
          var fns = listeners[id][ev]
          for (var i = 0, len = fns.length; i < len; i++) {
            if (fns[i] == fn) {
              fns.splice(i, 1)
              return
            }
          }
        }
      }
      this['fire'] = function (id, ev, data) {
        if (listeners[id] && listeners[id][ev]) {
          var fns = listeners[id][ev]
          /*
           * 涓€娆℃€х殑鐩戝惉鍑芥暟浼氫娇fns鐨勯暱搴﹀湪fire鐨勮繃绋嬩腑鍙戠敓鍙樺寲
           * 濡傛灉椤哄簭澶勭悊锛岄渶瑕佸垽鏂璮ns鐨勯暱搴﹀彉鍖栦互璋冩暣i鐨勫€�
           */
          for (var i = fns.length - 1; i >= 0; i--) {
            fns[i](data)
          }
        }
      }
      // 鍐呴儴浣跨敤锛屽垪鍑烘墍鏈夌殑鐩戝惉鑰�
      this['_list'] = function (id, ev) {
        if (listeners[id] && listeners[id][ev]) {
          return listeners[id][ev]
        } else {
          return null
        }
      }
    }
  
    // event
    (function (global) {
      event.apply(global)
    })(scm)
  
    var invokeEvent = {}
    var setTimeoutFn = window.setTimeout
    var clearTimeoutFn = window.clearTimeout
    var defaultTimeout = 20000
    var androidEnv = function () {
      try {
        return !!(JDY && JDY.dispatchEvent)
      } catch (e) {
        return false
      }
    }
    // IOS invoke
    function invokeIos() {
      var on = this.on
      var fire = this.fire
      var _list = this._list
  
      this['invoke'] = function (method, params, cb, timeout) {
        if (document.body) {
          if (!timeout) {
            timeout = defaultTimeout
          }
  
          var uuid = guid()
          var timer
  
          var src = 'EC_BRIDGE_CALL://' + method + '/' + uuid + '?' + param(trim(params))
          var execIframe = createExecIframe(src)
          on(invokeEvent, uuid, function (data) {
            if (timer) {
              clearTimeoutFn(timer)
            }
            execIframe && execIframe.parentNode.removeChild(execIframe)
            execIframe = null
            cb && cb(data)
          }, true)
  
          if (timeout > 0) {
            timer = setTimeoutFn(function () {
              timer = null
              fire(invokeEvent, uuid, 'timeout')
            }, timeout)
          }
        } else {
          var self = this
          setTimeout(function () {
            self.invoke(method, params, cb, timeout)
          }, 500)
        }
      }
      this['callback'] = function (uuid, method, data, stream) {
        var cb = null
        if (stream) {
          var listener = _list(invokeEvent, uuid)
          if (listener && listener.length > 0) {
            cb = listener[0]
          }
        }
        fire(invokeEvent, uuid, data)
        if (stream && cb) { // 濡傛灉鏄痵tream绫诲瀷锛屼細鏀跺埌澶氭
          on(invokeEvent, uuid, cb, true)
        }
      }
    }
  
    // API bridge andorid
  
    function invokeAndroid() {
      var on = this.on
      var fire = this.fire
      var _list = this._list
      var env = androidEnv()
      this['invoke'] = function (method, params, cb, timeout) {
        var uuid = guid()
        var timer
        var src = 'EC_BRIDGE_CALL://' + method + '/' + uuid + '?' + param(trim(params))
        var execIframe = createExecIframe(src)
        on(invokeEvent, uuid, function (data) {
          if (timer) {
            clearTimeoutFn(timer)
          }
          execIframe && execIframe.parentNode.removeChild(execIframe)
          execIframe = null
          cb && cb(data)
        }, true)
  
        if (!timeout) {
          timeout = defaultTimeout
        }
        if (timeout > 0) {
          timer = setTimeoutFn(function () {
            timer = null
            fire(invokeEvent, uuid, 'timeout')
          }, timeout)
        }
      }
  
      this['callback'] = function (uuid, method, data, stream) {
        var cb = null
        if (stream) {
          var listener = _list(invokeEvent, uuid)
          if (listener && listener.length > 0) {
            cb = listener[0]
          }
        }
        fire(invokeEvent, uuid, data)
        if (stream && cb) { // 濡傛灉鏄痵tream绫诲瀷锛屼細鏀跺埌澶氭
          on(invokeEvent, uuid, cb, true)
        }
      }
    };
  
    // unsupported
    function invokeUnsupport() {
      this['invoke'] = function (method, params, cb, timeout) {
        console && console.log && console.log('unsupported env')
      }
      this['callback'] = function (uuid, data) {
  
      }
    }
  
    // UA and scm Properties
    (function (scm) {
      scm._initInvoke = function () {
        if (this.ua.iphone || this.ua.ipad) {
          invokeIos.apply(this)
        } else if (androidEnv() || this.ua.android) {
          invokeAndroid.apply(this)
        } else {
          invokeUnsupport.apply(this)
        }
      }
      scm._initInvoke()
    })(scm)
  
    // (function (scm) {
    //   if (document.readyState === 'complete') {
    //     scm.invoke('jSBroadcast', {
    //       event: 'DOMContentLoaded'
    //     })
    //     scm.invoke('jSBroadcast', {
    //       event: 'load'
    //     })
    //   } else {
    //     // document.addEventListener('DOMContentLoaded', function () {
    //     //   scm.invoke('jSBroadcast', {
    //     //     event: 'DOMContentLoaded'
    //     //   })
    //     // }, false)
  
    //     // window.addEventListener('load', function () {
    //     //   scm.invoke('jSBroadcast', {
    //     //     event: 'load'
    //     //   })
    //     // }, false)
    //   }
    //   // window.addEventListener('hashchange', function () {
    //   //   scm.invoke('jSBroadcast', {
    //   //     event: 'hashchange'
    //   //   })
    //   // }, false)
    // })(scm)
  
    scm.ConditionLatch = function () {
      var conditons = []
      for (var index in arguments) {
        if (isString(arguments[index])) {
          conditons.push(arguments[index])
        }
      }
      var callback
      var target = this
      this.await = function (cb) {
        callback = cb
      }
      this.countdown = function (condition) {
        if (isString(condition)) {
          for (var i = 0, len = conditons.length; i < len; i++) {
            if (conditons[i] == condition) {
              conditons.splice(i, 1)
            }
          }
          if (conditons.length <= 0 && callback) {
            isFunction(callback) && callback.call(target, target)
            callback = null
          }
        }
      }
    }
    scm.CountDownLatch = function (numberCountDown) {
      var count = (isNumeric(numberCountDown) && numberCountDown >= 0) ? numberCountDown : 0
      var callback
      var target = this
      this.await = function (cb) {
        callback = cb
      }
      this.countdown = function () {
        count = count - 1
        if (count <= 0 && callback) {
          isFunction(callback) && callback.call(target, target)
          callback = null
        }
      }
    }
  
    // for ios bugfix
    // 濡傛灉鐣岄潰閲屽瓨鍦ㄧ┖鐨剆elect锛屽綋鐢ㄦ埛鐐瑰嚮鍚庯紝婊戝姩閫夋嫨鍣ㄤ細crash锛屾墍浠ュ鏋渟elect涓�0锛屼笉鑳借閫夋嫨鍣ㄥ脊鍑烘潵
    if (scm.ua.ios) {
      document.addEventListener('click', function (event) {
        var target = event.target
        if (target && target.tagName.toUpperCase() == 'SELECT' && event.target.options.length == 0) {
          target.blur()
          alert('鏃犻€夐」鍙緵閫夋嫨')
        }
      }, false)
    }
  
    global.scm = scm
  })((window.TOP = window.TOP || {}));
  
  (function () {
    var scm = TOP.scm
    var ua = scm.ua
    var util = scm.util
  
    scm.ns('navigation', function () {
      /**
       * @name setRight
       * @memberOf navigation
       * @function
       * @desc 璁剧疆鍙充晶瀵艰埅鑿滃崟
       * @param {function} callback 鍥炶皟鍑芥暟
       * @example
       * TOP.scm.navigation.setRight({}锛� function(data){
       *
       * });
       */
      this.setRight = function (menus, cb) {
        TOP.scm.invoke('rightNavMenu', {
          menus: menus
        }, cb, -1)
      }
      /**
       * @name title
       * @memberOf navigation
       * @function
       * @desc 璁剧疆瀵艰埅鏍囬
       * @param {function} callback 鍥炶皟鍑芥暟
       * @example
       * TOP.scm.navigation.title('鐧藉摝鎻�'锛� function(data){
       *
       * });
       */
      this.title = function (title, cb) {
        TOP.scm.invoke('setNavTitle', {
          title: title
        }, cb, -1)
      }
      /**
       * @name hide
       * @memberOf navigation
       * @function
       * @desc 鍏抽棴闅愯棌瀵艰埅鏍忓浘鏍�
       * @param {function} callback 鍥炶皟鍑芥暟
       * @example
       * TOP.scm.navigation.hide(function(data){
       *
       * });
       */
      this.hide = function (menus, cb) {
        TOP.scm.invoke('rightNavHide', {}, cb, -1)
      }
    })
  
    scm.ns('notification', function () {
      this.loading = function (title, cb) {
        TOP.scm.invoke('loading', {
          title: title
        }, cb, -1)
      }
      this.closeLoading = function (cb) {
        TOP.scm.invoke('closeLoading', {}, cb, -1)
      }
      this.showTip = function (tip, cb) {
        TOP.scm.invoke('showTip', {
          tip: tip
        }, cb, -1)
      }
    })
  
    scm.ns('selector', function () {
      /**
       * @name user
       * @memberOf selector
       * @function
       * @desc 浜哄憳閫夋嫨鍣�
       * @param {function} callback 鍥炶皟鍑芥暟
       * @example
       * TOP.scm.selector.user('title', '1,2,3'锛� function(data){
       *
       * });
       */
      this.user = function (title, choosedIds, cb) {
        TOP.scm.invoke('chooseUsers', {
          title: title,
          choosedIds: choosedIds
        }, cb, -1)
      }
      /**
       * @name project
       * @memberOf project
       * @function
       * @desc 椤圭洰閫夋嫨鍣�
       * @param {function} callback 鍥炶皟鍑芥暟
       * @example
       * TOP.scm.selector.project('title', '1,2,3'锛� function(data){
       *
       * });
       */
      this.project = function (title, choosedIds, cb) {
        TOP.scm.invoke('chooseProject', {
          title: title,
          choosedIds: choosedIds
        }, cb, -1)
      }
  
      /**
       * @name customer
       * @memberOf customer
       * @function
       * @desc 瀹㈡埛閫夋嫨鍣�
       * @param {function} callback 鍥炶皟鍑芥暟
       * @example
       * TOP.scm.selector.customer('title', '1,2,3'锛� function(data){
       *
       * });
       */
      this.customer = function (title, choosedIds, cb) {
        TOP.scm.invoke('chooseCustomer', {
          title: title,
          choosedIds: choosedIds
        }, cb, -1)
      }

      this.scanCode = function (cb){
        TOP.scm.invoke("scanCode",{}, cb, -1)
      }

      this.changeIp = function(cb){
        TOP.scm.invoke("changeIp",{},cb,-1)
      }
  
      /**
       * @name approval
       * @memberOf approval
       * @function
       * @desc 瀹℃壒鍗曢€夋嫨鍣�
       * @param {function} callback 鍥炶皟鍑芥暟
       * @example
       * TOP.scm.selector.approval('title', '1'锛� function(data){
       *
       * });
       */
      this.approval = function (title, type, cb) {
        TOP.scm.invoke('chooseApproval', {
          title: title,
          type: type
        }, cb, -1)
      }
    })
  
    scm.ns('form', function () {
      /**
       * @name date
       * @memberOf form
       * @function
       * @desc 鏃ユ湡閫夋嫨
       * @param {function} callback 鍥炶皟鍑芥暟
       * @example
       * TOP.scm.form.date('2017-01-01', 'title'锛� function(data){
       *    // decome
       *    console.log(data.date)
       * });
       */
      this.date = function (value, title, cb) {
        TOP.scm.invoke('sheetDatePicker', {
          'options': JSON.stringify({
            value: value,
            title: title,
            type: 1
          })
        }, cb, -1);
      }
      /**
       * @name datetime
       * @memberOf form
       * @function
       * @desc 鏃ユ湡鏃堕棿閫夋嫨
       * @param {function} callback 鍥炶皟鍑芥暟
       * @example
       * TOP.scm.form.datetime('2017-01-01 10:10', 'title'锛� function(data){
       *    // decome
       *    console.log(data.date)
       * });
       */
      this.datetime = function (value, title, cb) {
        TOP.scm.invoke('sheetDatePicker', {
          'options': JSON.stringify({
            value: value,
            title: title,
            type: 2
          })
        }, cb, -1);
      }
    })
  
    /**
     * 鏂囦欢涓婁紶
     */
    scm.ns('upload', function () {
      /**
       * @name workUpload
       * @memberOf upload
       * @function
       * @desc 宸ヤ綔搴旂敤涓婁紶鍊熷彛
       * @param {function} callback 鍥炶皟鍑芥暟
       * @example
       * TOP.scm.upload.workUpload(function(data){
       *     if(data.success) {
       *         alert("閿欒鐮侊細"+info.code);
       *     } else {
       *         //鎴愬姛鎯呭喌涓嬪搴旂殑鎿嶄綔
       *     }
       * });
       */
      this.workUpload = function (cb) {
        TOP.scm.invoke('workUpload', {}, cb, -1)
      }
      this.uploadImage = function (cb) {
        TOP.scm.invoke('uploadImage', {}, cb, -1)
      }
      this.photoBrowser = function (url, cb) {
        TOP.scm.invoke('photoBrowser', {
          options: JSON.stringify({images:[url], index: 0})
        }, cb, -1)
      }
      this.multipPhotoBrowser = function (images,index, cb) {
        TOP.scm.invoke('photoBrowser', {
          options: JSON.stringify({images:images, index: index})
        }, cb, -1)
      }
       this.fileQuickLook = function (optionsObject,cb) {
        TOP.scm.invoke('fileQuickLook', {
          options: JSON.stringify(optionsObject)
        }, cb, -1)
      }
      this.fileShare=function(name,path,type,cb){
        TOP.scm.invoke('fileLinkShare', {
          'options': JSON.stringify({
            fileName: name,
            filePath: path,
            fileType: type
          })
        }, cb, -1);
      }
    });
  })()