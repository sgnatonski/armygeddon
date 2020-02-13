
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
(function () {
  'use strict';

  /*!
   * Vue.js v2.6.11
   * (c) 2014-2019 Evan You
   * Released under the MIT License.
   */
  /*  */

  var emptyObject = Object.freeze({});

  // These helpers produce better VM code in JS engines due to their
  // explicitness and function inlining.
  function isUndef (v) {
    return v === undefined || v === null
  }

  function isDef (v) {
    return v !== undefined && v !== null
  }

  function isTrue (v) {
    return v === true
  }

  function isFalse (v) {
    return v === false
  }

  /**
   * Check if value is primitive.
   */
  function isPrimitive (value) {
    return (
      typeof value === 'string' ||
      typeof value === 'number' ||
      // $flow-disable-line
      typeof value === 'symbol' ||
      typeof value === 'boolean'
    )
  }

  /**
   * Quick object check - this is primarily used to tell
   * Objects from primitive values when we know the value
   * is a JSON-compliant type.
   */
  function isObject (obj) {
    return obj !== null && typeof obj === 'object'
  }

  /**
   * Get the raw type string of a value, e.g., [object Object].
   */
  var _toString = Object.prototype.toString;

  function toRawType (value) {
    return _toString.call(value).slice(8, -1)
  }

  /**
   * Strict object type check. Only returns true
   * for plain JavaScript objects.
   */
  function isPlainObject (obj) {
    return _toString.call(obj) === '[object Object]'
  }

  function isRegExp (v) {
    return _toString.call(v) === '[object RegExp]'
  }

  /**
   * Check if val is a valid array index.
   */
  function isValidArrayIndex (val) {
    var n = parseFloat(String(val));
    return n >= 0 && Math.floor(n) === n && isFinite(val)
  }

  function isPromise (val) {
    return (
      isDef(val) &&
      typeof val.then === 'function' &&
      typeof val.catch === 'function'
    )
  }

  /**
   * Convert a value to a string that is actually rendered.
   */
  function toString (val) {
    return val == null
      ? ''
      : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
        ? JSON.stringify(val, null, 2)
        : String(val)
  }

  /**
   * Convert an input value to a number for persistence.
   * If the conversion fails, return original string.
   */
  function toNumber (val) {
    var n = parseFloat(val);
    return isNaN(n) ? val : n
  }

  /**
   * Make a map and return a function for checking if a key
   * is in that map.
   */
  function makeMap (
    str,
    expectsLowerCase
  ) {
    var map = Object.create(null);
    var list = str.split(',');
    for (var i = 0; i < list.length; i++) {
      map[list[i]] = true;
    }
    return expectsLowerCase
      ? function (val) { return map[val.toLowerCase()]; }
      : function (val) { return map[val]; }
  }

  /**
   * Check if a tag is a built-in tag.
   */
  var isBuiltInTag = makeMap('slot,component', true);

  /**
   * Check if an attribute is a reserved attribute.
   */
  var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

  /**
   * Remove an item from an array.
   */
  function remove (arr, item) {
    if (arr.length) {
      var index = arr.indexOf(item);
      if (index > -1) {
        return arr.splice(index, 1)
      }
    }
  }

  /**
   * Check whether an object has the property.
   */
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  function hasOwn (obj, key) {
    return hasOwnProperty.call(obj, key)
  }

  /**
   * Create a cached version of a pure function.
   */
  function cached (fn) {
    var cache = Object.create(null);
    return (function cachedFn (str) {
      var hit = cache[str];
      return hit || (cache[str] = fn(str))
    })
  }

  /**
   * Camelize a hyphen-delimited string.
   */
  var camelizeRE = /-(\w)/g;
  var camelize = cached(function (str) {
    return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
  });

  /**
   * Capitalize a string.
   */
  var capitalize = cached(function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  });

  /**
   * Hyphenate a camelCase string.
   */
  var hyphenateRE = /\B([A-Z])/g;
  var hyphenate = cached(function (str) {
    return str.replace(hyphenateRE, '-$1').toLowerCase()
  });

  /**
   * Simple bind polyfill for environments that do not support it,
   * e.g., PhantomJS 1.x. Technically, we don't need this anymore
   * since native bind is now performant enough in most browsers.
   * But removing it would mean breaking code that was able to run in
   * PhantomJS 1.x, so this must be kept for backward compatibility.
   */

  /* istanbul ignore next */
  function polyfillBind (fn, ctx) {
    function boundFn (a) {
      var l = arguments.length;
      return l
        ? l > 1
          ? fn.apply(ctx, arguments)
          : fn.call(ctx, a)
        : fn.call(ctx)
    }

    boundFn._length = fn.length;
    return boundFn
  }

  function nativeBind (fn, ctx) {
    return fn.bind(ctx)
  }

  var bind = Function.prototype.bind
    ? nativeBind
    : polyfillBind;

  /**
   * Convert an Array-like object to a real Array.
   */
  function toArray (list, start) {
    start = start || 0;
    var i = list.length - start;
    var ret = new Array(i);
    while (i--) {
      ret[i] = list[i + start];
    }
    return ret
  }

  /**
   * Mix properties into target object.
   */
  function extend (to, _from) {
    for (var key in _from) {
      to[key] = _from[key];
    }
    return to
  }

  /**
   * Merge an Array of Objects into a single Object.
   */
  function toObject (arr) {
    var res = {};
    for (var i = 0; i < arr.length; i++) {
      if (arr[i]) {
        extend(res, arr[i]);
      }
    }
    return res
  }

  /* eslint-disable no-unused-vars */

  /**
   * Perform no operation.
   * Stubbing args to make Flow happy without leaving useless transpiled code
   * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
   */
  function noop (a, b, c) {}

  /**
   * Always return false.
   */
  var no = function (a, b, c) { return false; };

  /* eslint-enable no-unused-vars */

  /**
   * Return the same value.
   */
  var identity = function (_) { return _; };

  /**
   * Check if two values are loosely equal - that is,
   * if they are plain objects, do they have the same shape?
   */
  function looseEqual (a, b) {
    if (a === b) { return true }
    var isObjectA = isObject(a);
    var isObjectB = isObject(b);
    if (isObjectA && isObjectB) {
      try {
        var isArrayA = Array.isArray(a);
        var isArrayB = Array.isArray(b);
        if (isArrayA && isArrayB) {
          return a.length === b.length && a.every(function (e, i) {
            return looseEqual(e, b[i])
          })
        } else if (a instanceof Date && b instanceof Date) {
          return a.getTime() === b.getTime()
        } else if (!isArrayA && !isArrayB) {
          var keysA = Object.keys(a);
          var keysB = Object.keys(b);
          return keysA.length === keysB.length && keysA.every(function (key) {
            return looseEqual(a[key], b[key])
          })
        } else {
          /* istanbul ignore next */
          return false
        }
      } catch (e) {
        /* istanbul ignore next */
        return false
      }
    } else if (!isObjectA && !isObjectB) {
      return String(a) === String(b)
    } else {
      return false
    }
  }

  /**
   * Return the first index at which a loosely equal value can be
   * found in the array (if value is a plain object, the array must
   * contain an object of the same shape), or -1 if it is not present.
   */
  function looseIndexOf (arr, val) {
    for (var i = 0; i < arr.length; i++) {
      if (looseEqual(arr[i], val)) { return i }
    }
    return -1
  }

  /**
   * Ensure a function is called only once.
   */
  function once (fn) {
    var called = false;
    return function () {
      if (!called) {
        called = true;
        fn.apply(this, arguments);
      }
    }
  }

  var SSR_ATTR = 'data-server-rendered';

  var ASSET_TYPES = [
    'component',
    'directive',
    'filter'
  ];

  var LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
    'activated',
    'deactivated',
    'errorCaptured',
    'serverPrefetch'
  ];

  /*  */



  var config = ({
    /**
     * Option merge strategies (used in core/util/options)
     */
    // $flow-disable-line
    optionMergeStrategies: Object.create(null),

    /**
     * Whether to suppress warnings.
     */
    silent: false,

    /**
     * Show production mode tip message on boot?
     */
    productionTip: "development" !== 'production',

    /**
     * Whether to enable devtools
     */
    devtools: "development" !== 'production',

    /**
     * Whether to record perf
     */
    performance: false,

    /**
     * Error handler for watcher errors
     */
    errorHandler: null,

    /**
     * Warn handler for watcher warns
     */
    warnHandler: null,

    /**
     * Ignore certain custom elements
     */
    ignoredElements: [],

    /**
     * Custom user key aliases for v-on
     */
    // $flow-disable-line
    keyCodes: Object.create(null),

    /**
     * Check if a tag is reserved so that it cannot be registered as a
     * component. This is platform-dependent and may be overwritten.
     */
    isReservedTag: no,

    /**
     * Check if an attribute is reserved so that it cannot be used as a component
     * prop. This is platform-dependent and may be overwritten.
     */
    isReservedAttr: no,

    /**
     * Check if a tag is an unknown element.
     * Platform-dependent.
     */
    isUnknownElement: no,

    /**
     * Get the namespace of an element
     */
    getTagNamespace: noop,

    /**
     * Parse the real tag name for the specific platform.
     */
    parsePlatformTagName: identity,

    /**
     * Check if an attribute must be bound using property, e.g. value
     * Platform-dependent.
     */
    mustUseProp: no,

    /**
     * Perform updates asynchronously. Intended to be used by Vue Test Utils
     * This will significantly reduce performance if set to false.
     */
    async: true,

    /**
     * Exposed for legacy reasons
     */
    _lifecycleHooks: LIFECYCLE_HOOKS
  });

  /*  */

  /**
   * unicode letters used for parsing html tags, component names and property paths.
   * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
   * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
   */
  var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

  /**
   * Check if a string starts with $ or _
   */
  function isReserved (str) {
    var c = (str + '').charCodeAt(0);
    return c === 0x24 || c === 0x5F
  }

  /**
   * Define a property.
   */
  function def (obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
      value: val,
      enumerable: !!enumerable,
      writable: true,
      configurable: true
    });
  }

  /**
   * Parse simple path.
   */
  var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
  function parsePath (path) {
    if (bailRE.test(path)) {
      return
    }
    var segments = path.split('.');
    return function (obj) {
      for (var i = 0; i < segments.length; i++) {
        if (!obj) { return }
        obj = obj[segments[i]];
      }
      return obj
    }
  }

  /*  */

  // can we use __proto__?
  var hasProto = '__proto__' in {};

  // Browser environment sniffing
  var inBrowser = typeof window !== 'undefined';
  var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
  var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
  var UA = inBrowser && window.navigator.userAgent.toLowerCase();
  var isIE = UA && /msie|trident/.test(UA);
  var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
  var isEdge = UA && UA.indexOf('edge/') > 0;
  var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
  var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
  var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
  var isPhantomJS = UA && /phantomjs/.test(UA);
  var isFF = UA && UA.match(/firefox\/(\d+)/);

  // Firefox has a "watch" function on Object.prototype...
  var nativeWatch = ({}).watch;

  var supportsPassive = false;
  if (inBrowser) {
    try {
      var opts = {};
      Object.defineProperty(opts, 'passive', ({
        get: function get () {
          /* istanbul ignore next */
          supportsPassive = true;
        }
      })); // https://github.com/facebook/flow/issues/285
      window.addEventListener('test-passive', null, opts);
    } catch (e) {}
  }

  // this needs to be lazy-evaled because vue may be required before
  // vue-server-renderer can set VUE_ENV
  var _isServer;
  var isServerRendering = function () {
    if (_isServer === undefined) {
      /* istanbul ignore if */
      if (!inBrowser && !inWeex && typeof global !== 'undefined') {
        // detect presence of vue-server-renderer and avoid
        // Webpack shimming the process
        _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
      } else {
        _isServer = false;
      }
    }
    return _isServer
  };

  // detect devtools
  var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

  /* istanbul ignore next */
  function isNative (Ctor) {
    return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
  }

  var hasSymbol =
    typeof Symbol !== 'undefined' && isNative(Symbol) &&
    typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

  var _Set;
  /* istanbul ignore if */ // $flow-disable-line
  if (typeof Set !== 'undefined' && isNative(Set)) {
    // use native Set when available.
    _Set = Set;
  } else {
    // a non-standard Set polyfill that only works with primitive keys.
    _Set = /*@__PURE__*/(function () {
      function Set () {
        this.set = Object.create(null);
      }
      Set.prototype.has = function has (key) {
        return this.set[key] === true
      };
      Set.prototype.add = function add (key) {
        this.set[key] = true;
      };
      Set.prototype.clear = function clear () {
        this.set = Object.create(null);
      };

      return Set;
    }());
  }

  /*  */

  var warn = noop;
  var tip = noop;
  var generateComponentTrace = (noop); // work around flow check
  var formatComponentName = (noop);

  {
    var hasConsole = typeof console !== 'undefined';
    var classifyRE = /(?:^|[-_])(\w)/g;
    var classify = function (str) { return str
      .replace(classifyRE, function (c) { return c.toUpperCase(); })
      .replace(/[-_]/g, ''); };

    warn = function (msg, vm) {
      var trace = vm ? generateComponentTrace(vm) : '';

      if (config.warnHandler) {
        config.warnHandler.call(null, msg, vm, trace);
      } else if (hasConsole && (!config.silent)) {
        console.error(("[Vue warn]: " + msg + trace));
      }
    };

    tip = function (msg, vm) {
      if (hasConsole && (!config.silent)) {
        console.warn("[Vue tip]: " + msg + (
          vm ? generateComponentTrace(vm) : ''
        ));
      }
    };

    formatComponentName = function (vm, includeFile) {
      if (vm.$root === vm) {
        return '<Root>'
      }
      var options = typeof vm === 'function' && vm.cid != null
        ? vm.options
        : vm._isVue
          ? vm.$options || vm.constructor.options
          : vm;
      var name = options.name || options._componentTag;
      var file = options.__file;
      if (!name && file) {
        var match = file.match(/([^/\\]+)\.vue$/);
        name = match && match[1];
      }

      return (
        (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
        (file && includeFile !== false ? (" at " + file) : '')
      )
    };

    var repeat = function (str, n) {
      var res = '';
      while (n) {
        if (n % 2 === 1) { res += str; }
        if (n > 1) { str += str; }
        n >>= 1;
      }
      return res
    };

    generateComponentTrace = function (vm) {
      if (vm._isVue && vm.$parent) {
        var tree = [];
        var currentRecursiveSequence = 0;
        while (vm) {
          if (tree.length > 0) {
            var last = tree[tree.length - 1];
            if (last.constructor === vm.constructor) {
              currentRecursiveSequence++;
              vm = vm.$parent;
              continue
            } else if (currentRecursiveSequence > 0) {
              tree[tree.length - 1] = [last, currentRecursiveSequence];
              currentRecursiveSequence = 0;
            }
          }
          tree.push(vm);
          vm = vm.$parent;
        }
        return '\n\nfound in\n\n' + tree
          .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
              ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
              : formatComponentName(vm))); })
          .join('\n')
      } else {
        return ("\n\n(found in " + (formatComponentName(vm)) + ")")
      }
    };
  }

  /*  */

  var uid = 0;

  /**
   * A dep is an observable that can have multiple
   * directives subscribing to it.
   */
  var Dep = function Dep () {
    this.id = uid++;
    this.subs = [];
  };

  Dep.prototype.addSub = function addSub (sub) {
    this.subs.push(sub);
  };

  Dep.prototype.removeSub = function removeSub (sub) {
    remove(this.subs, sub);
  };

  Dep.prototype.depend = function depend () {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  };

  Dep.prototype.notify = function notify () {
    // stabilize the subscriber list first
    var subs = this.subs.slice();
    if ( !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort(function (a, b) { return a.id - b.id; });
    }
    for (var i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  };

  // The current target watcher being evaluated.
  // This is globally unique because only one watcher
  // can be evaluated at a time.
  Dep.target = null;
  var targetStack = [];

  function pushTarget (target) {
    targetStack.push(target);
    Dep.target = target;
  }

  function popTarget () {
    targetStack.pop();
    Dep.target = targetStack[targetStack.length - 1];
  }

  /*  */

  var VNode = function VNode (
    tag,
    data,
    children,
    text,
    elm,
    context,
    componentOptions,
    asyncFactory
  ) {
    this.tag = tag;
    this.data = data;
    this.children = children;
    this.text = text;
    this.elm = elm;
    this.ns = undefined;
    this.context = context;
    this.fnContext = undefined;
    this.fnOptions = undefined;
    this.fnScopeId = undefined;
    this.key = data && data.key;
    this.componentOptions = componentOptions;
    this.componentInstance = undefined;
    this.parent = undefined;
    this.raw = false;
    this.isStatic = false;
    this.isRootInsert = true;
    this.isComment = false;
    this.isCloned = false;
    this.isOnce = false;
    this.asyncFactory = asyncFactory;
    this.asyncMeta = undefined;
    this.isAsyncPlaceholder = false;
  };

  var prototypeAccessors = { child: { configurable: true } };

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  prototypeAccessors.child.get = function () {
    return this.componentInstance
  };

  Object.defineProperties( VNode.prototype, prototypeAccessors );

  var createEmptyVNode = function (text) {
    if ( text === void 0 ) text = '';

    var node = new VNode();
    node.text = text;
    node.isComment = true;
    return node
  };

  function createTextVNode (val) {
    return new VNode(undefined, undefined, undefined, String(val))
  }

  // optimized shallow clone
  // used for static nodes and slot nodes because they may be reused across
  // multiple renders, cloning them avoids errors when DOM manipulations rely
  // on their elm reference.
  function cloneVNode (vnode) {
    var cloned = new VNode(
      vnode.tag,
      vnode.data,
      // #7975
      // clone children array to avoid mutating original in case of cloning
      // a child.
      vnode.children && vnode.children.slice(),
      vnode.text,
      vnode.elm,
      vnode.context,
      vnode.componentOptions,
      vnode.asyncFactory
    );
    cloned.ns = vnode.ns;
    cloned.isStatic = vnode.isStatic;
    cloned.key = vnode.key;
    cloned.isComment = vnode.isComment;
    cloned.fnContext = vnode.fnContext;
    cloned.fnOptions = vnode.fnOptions;
    cloned.fnScopeId = vnode.fnScopeId;
    cloned.asyncMeta = vnode.asyncMeta;
    cloned.isCloned = true;
    return cloned
  }

  /*
   * not type checking this file because flow doesn't play well with
   * dynamically accessing methods on Array prototype
   */

  var arrayProto = Array.prototype;
  var arrayMethods = Object.create(arrayProto);

  var methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
  ];

  /**
   * Intercept mutating methods and emit events
   */
  methodsToPatch.forEach(function (method) {
    // cache original method
    var original = arrayProto[method];
    def(arrayMethods, method, function mutator () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var result = original.apply(this, args);
      var ob = this.__ob__;
      var inserted;
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break
        case 'splice':
          inserted = args.slice(2);
          break
      }
      if (inserted) { ob.observeArray(inserted); }
      // notify change
      ob.dep.notify();
      return result
    });
  });

  /*  */

  var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

  /**
   * In some cases we may want to disable observation inside a component's
   * update computation.
   */
  var shouldObserve = true;

  function toggleObserving (value) {
    shouldObserve = value;
  }

  /**
   * Observer class that is attached to each observed
   * object. Once attached, the observer converts the target
   * object's property keys into getter/setters that
   * collect dependencies and dispatch updates.
   */
  var Observer = function Observer (value) {
    this.value = value;
    this.dep = new Dep();
    this.vmCount = 0;
    def(value, '__ob__', this);
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods);
      } else {
        copyAugment(value, arrayMethods, arrayKeys);
      }
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  };

  /**
   * Walk through all properties and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  Observer.prototype.walk = function walk (obj) {
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      defineReactive$$1(obj, keys[i]);
    }
  };

  /**
   * Observe a list of Array items.
   */
  Observer.prototype.observeArray = function observeArray (items) {
    for (var i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  };

  // helpers

  /**
   * Augment a target Object or Array by intercepting
   * the prototype chain using __proto__
   */
  function protoAugment (target, src) {
    /* eslint-disable no-proto */
    target.__proto__ = src;
    /* eslint-enable no-proto */
  }

  /**
   * Augment a target Object or Array by defining
   * hidden properties.
   */
  /* istanbul ignore next */
  function copyAugment (target, src, keys) {
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      def(target, key, src[key]);
    }
  }

  /**
   * Attempt to create an observer instance for a value,
   * returns the new observer if successfully observed,
   * or the existing observer if the value already has one.
   */
  function observe (value, asRootData) {
    if (!isObject(value) || value instanceof VNode) {
      return
    }
    var ob;
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
      ob = value.__ob__;
    } else if (
      shouldObserve &&
      !isServerRendering() &&
      (Array.isArray(value) || isPlainObject(value)) &&
      Object.isExtensible(value) &&
      !value._isVue
    ) {
      ob = new Observer(value);
    }
    if (asRootData && ob) {
      ob.vmCount++;
    }
    return ob
  }

  /**
   * Define a reactive property on an Object.
   */
  function defineReactive$$1 (
    obj,
    key,
    val,
    customSetter,
    shallow
  ) {
    var dep = new Dep();

    var property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && property.configurable === false) {
      return
    }

    // cater for pre-defined getter/setters
    var getter = property && property.get;
    var setter = property && property.set;
    if ((!getter || setter) && arguments.length === 2) {
      val = obj[key];
    }

    var childOb = !shallow && observe(val);
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveGetter () {
        var value = getter ? getter.call(obj) : val;
        if (Dep.target) {
          dep.depend();
          if (childOb) {
            childOb.dep.depend();
            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }
        return value
      },
      set: function reactiveSetter (newVal) {
        var value = getter ? getter.call(obj) : val;
        /* eslint-disable no-self-compare */
        if (newVal === value || (newVal !== newVal && value !== value)) {
          return
        }
        /* eslint-enable no-self-compare */
        if ( customSetter) {
          customSetter();
        }
        // #7981: for accessor properties without setter
        if (getter && !setter) { return }
        if (setter) {
          setter.call(obj, newVal);
        } else {
          val = newVal;
        }
        childOb = !shallow && observe(newVal);
        dep.notify();
      }
    });
  }

  /**
   * Set a property on an object. Adds the new property and
   * triggers change notification if the property doesn't
   * already exist.
   */
  function set (target, key, val) {
    if (
      (isUndef(target) || isPrimitive(target))
    ) {
      warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
    }
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      target.length = Math.max(target.length, key);
      target.splice(key, 1, val);
      return val
    }
    if (key in target && !(key in Object.prototype)) {
      target[key] = val;
      return val
    }
    var ob = (target).__ob__;
    if (target._isVue || (ob && ob.vmCount)) {
       warn(
        'Avoid adding reactive properties to a Vue instance or its root $data ' +
        'at runtime - declare it upfront in the data option.'
      );
      return val
    }
    if (!ob) {
      target[key] = val;
      return val
    }
    defineReactive$$1(ob.value, key, val);
    ob.dep.notify();
    return val
  }

  /**
   * Delete a property and trigger change if necessary.
   */
  function del (target, key) {
    if (
      (isUndef(target) || isPrimitive(target))
    ) {
      warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
    }
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      target.splice(key, 1);
      return
    }
    var ob = (target).__ob__;
    if (target._isVue || (ob && ob.vmCount)) {
       warn(
        'Avoid deleting properties on a Vue instance or its root $data ' +
        '- just set it to null.'
      );
      return
    }
    if (!hasOwn(target, key)) {
      return
    }
    delete target[key];
    if (!ob) {
      return
    }
    ob.dep.notify();
  }

  /**
   * Collect dependencies on array elements when the array is touched, since
   * we cannot intercept array element access like property getters.
   */
  function dependArray (value) {
    for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
      e = value[i];
      e && e.__ob__ && e.__ob__.dep.depend();
      if (Array.isArray(e)) {
        dependArray(e);
      }
    }
  }

  /*  */

  /**
   * Option overwriting strategies are functions that handle
   * how to merge a parent option value and a child option
   * value into the final value.
   */
  var strats = config.optionMergeStrategies;

  /**
   * Options with restrictions
   */
  {
    strats.el = strats.propsData = function (parent, child, vm, key) {
      if (!vm) {
        warn(
          "option \"" + key + "\" can only be used during instance " +
          'creation with the `new` keyword.'
        );
      }
      return defaultStrat(parent, child)
    };
  }

  /**
   * Helper that recursively merges two data objects together.
   */
  function mergeData (to, from) {
    if (!from) { return to }
    var key, toVal, fromVal;

    var keys = hasSymbol
      ? Reflect.ownKeys(from)
      : Object.keys(from);

    for (var i = 0; i < keys.length; i++) {
      key = keys[i];
      // in case the object is already observed...
      if (key === '__ob__') { continue }
      toVal = to[key];
      fromVal = from[key];
      if (!hasOwn(to, key)) {
        set(to, key, fromVal);
      } else if (
        toVal !== fromVal &&
        isPlainObject(toVal) &&
        isPlainObject(fromVal)
      ) {
        mergeData(toVal, fromVal);
      }
    }
    return to
  }

  /**
   * Data
   */
  function mergeDataOrFn (
    parentVal,
    childVal,
    vm
  ) {
    if (!vm) {
      // in a Vue.extend merge, both should be functions
      if (!childVal) {
        return parentVal
      }
      if (!parentVal) {
        return childVal
      }
      // when parentVal & childVal are both present,
      // we need to return a function that returns the
      // merged result of both functions... no need to
      // check if parentVal is a function here because
      // it has to be a function to pass previous merges.
      return function mergedDataFn () {
        return mergeData(
          typeof childVal === 'function' ? childVal.call(this, this) : childVal,
          typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
        )
      }
    } else {
      return function mergedInstanceDataFn () {
        // instance merge
        var instanceData = typeof childVal === 'function'
          ? childVal.call(vm, vm)
          : childVal;
        var defaultData = typeof parentVal === 'function'
          ? parentVal.call(vm, vm)
          : parentVal;
        if (instanceData) {
          return mergeData(instanceData, defaultData)
        } else {
          return defaultData
        }
      }
    }
  }

  strats.data = function (
    parentVal,
    childVal,
    vm
  ) {
    if (!vm) {
      if (childVal && typeof childVal !== 'function') {
         warn(
          'The "data" option should be a function ' +
          'that returns a per-instance value in component ' +
          'definitions.',
          vm
        );

        return parentVal
      }
      return mergeDataOrFn(parentVal, childVal)
    }

    return mergeDataOrFn(parentVal, childVal, vm)
  };

  /**
   * Hooks and props are merged as arrays.
   */
  function mergeHook (
    parentVal,
    childVal
  ) {
    var res = childVal
      ? parentVal
        ? parentVal.concat(childVal)
        : Array.isArray(childVal)
          ? childVal
          : [childVal]
      : parentVal;
    return res
      ? dedupeHooks(res)
      : res
  }

  function dedupeHooks (hooks) {
    var res = [];
    for (var i = 0; i < hooks.length; i++) {
      if (res.indexOf(hooks[i]) === -1) {
        res.push(hooks[i]);
      }
    }
    return res
  }

  LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeHook;
  });

  /**
   * Assets
   *
   * When a vm is present (instance creation), we need to do
   * a three-way merge between constructor options, instance
   * options and parent options.
   */
  function mergeAssets (
    parentVal,
    childVal,
    vm,
    key
  ) {
    var res = Object.create(parentVal || null);
    if (childVal) {
       assertObjectType(key, childVal, vm);
      return extend(res, childVal)
    } else {
      return res
    }
  }

  ASSET_TYPES.forEach(function (type) {
    strats[type + 's'] = mergeAssets;
  });

  /**
   * Watchers.
   *
   * Watchers hashes should not overwrite one
   * another, so we merge them as arrays.
   */
  strats.watch = function (
    parentVal,
    childVal,
    vm,
    key
  ) {
    // work around Firefox's Object.prototype.watch...
    if (parentVal === nativeWatch) { parentVal = undefined; }
    if (childVal === nativeWatch) { childVal = undefined; }
    /* istanbul ignore if */
    if (!childVal) { return Object.create(parentVal || null) }
    {
      assertObjectType(key, childVal, vm);
    }
    if (!parentVal) { return childVal }
    var ret = {};
    extend(ret, parentVal);
    for (var key$1 in childVal) {
      var parent = ret[key$1];
      var child = childVal[key$1];
      if (parent && !Array.isArray(parent)) {
        parent = [parent];
      }
      ret[key$1] = parent
        ? parent.concat(child)
        : Array.isArray(child) ? child : [child];
    }
    return ret
  };

  /**
   * Other object hashes.
   */
  strats.props =
  strats.methods =
  strats.inject =
  strats.computed = function (
    parentVal,
    childVal,
    vm,
    key
  ) {
    if (childVal && "development" !== 'production') {
      assertObjectType(key, childVal, vm);
    }
    if (!parentVal) { return childVal }
    var ret = Object.create(null);
    extend(ret, parentVal);
    if (childVal) { extend(ret, childVal); }
    return ret
  };
  strats.provide = mergeDataOrFn;

  /**
   * Default strategy.
   */
  var defaultStrat = function (parentVal, childVal) {
    return childVal === undefined
      ? parentVal
      : childVal
  };

  /**
   * Validate component names
   */
  function checkComponents (options) {
    for (var key in options.components) {
      validateComponentName(key);
    }
  }

  function validateComponentName (name) {
    if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) {
      warn(
        'Invalid component name: "' + name + '". Component names ' +
        'should conform to valid custom element name in html5 specification.'
      );
    }
    if (isBuiltInTag(name) || config.isReservedTag(name)) {
      warn(
        'Do not use built-in or reserved HTML elements as component ' +
        'id: ' + name
      );
    }
  }

  /**
   * Ensure all props option syntax are normalized into the
   * Object-based format.
   */
  function normalizeProps (options, vm) {
    var props = options.props;
    if (!props) { return }
    var res = {};
    var i, val, name;
    if (Array.isArray(props)) {
      i = props.length;
      while (i--) {
        val = props[i];
        if (typeof val === 'string') {
          name = camelize(val);
          res[name] = { type: null };
        } else {
          warn('props must be strings when using array syntax.');
        }
      }
    } else if (isPlainObject(props)) {
      for (var key in props) {
        val = props[key];
        name = camelize(key);
        res[name] = isPlainObject(val)
          ? val
          : { type: val };
      }
    } else {
      warn(
        "Invalid value for option \"props\": expected an Array or an Object, " +
        "but got " + (toRawType(props)) + ".",
        vm
      );
    }
    options.props = res;
  }

  /**
   * Normalize all injections into Object-based format
   */
  function normalizeInject (options, vm) {
    var inject = options.inject;
    if (!inject) { return }
    var normalized = options.inject = {};
    if (Array.isArray(inject)) {
      for (var i = 0; i < inject.length; i++) {
        normalized[inject[i]] = { from: inject[i] };
      }
    } else if (isPlainObject(inject)) {
      for (var key in inject) {
        var val = inject[key];
        normalized[key] = isPlainObject(val)
          ? extend({ from: key }, val)
          : { from: val };
      }
    } else {
      warn(
        "Invalid value for option \"inject\": expected an Array or an Object, " +
        "but got " + (toRawType(inject)) + ".",
        vm
      );
    }
  }

  /**
   * Normalize raw function directives into object format.
   */
  function normalizeDirectives (options) {
    var dirs = options.directives;
    if (dirs) {
      for (var key in dirs) {
        var def$$1 = dirs[key];
        if (typeof def$$1 === 'function') {
          dirs[key] = { bind: def$$1, update: def$$1 };
        }
      }
    }
  }

  function assertObjectType (name, value, vm) {
    if (!isPlainObject(value)) {
      warn(
        "Invalid value for option \"" + name + "\": expected an Object, " +
        "but got " + (toRawType(value)) + ".",
        vm
      );
    }
  }

  /**
   * Merge two option objects into a new one.
   * Core utility used in both instantiation and inheritance.
   */
  function mergeOptions (
    parent,
    child,
    vm
  ) {
    {
      checkComponents(child);
    }

    if (typeof child === 'function') {
      child = child.options;
    }

    normalizeProps(child, vm);
    normalizeInject(child, vm);
    normalizeDirectives(child);

    // Apply extends and mixins on the child options,
    // but only if it is a raw options object that isn't
    // the result of another mergeOptions call.
    // Only merged options has the _base property.
    if (!child._base) {
      if (child.extends) {
        parent = mergeOptions(parent, child.extends, vm);
      }
      if (child.mixins) {
        for (var i = 0, l = child.mixins.length; i < l; i++) {
          parent = mergeOptions(parent, child.mixins[i], vm);
        }
      }
    }

    var options = {};
    var key;
    for (key in parent) {
      mergeField(key);
    }
    for (key in child) {
      if (!hasOwn(parent, key)) {
        mergeField(key);
      }
    }
    function mergeField (key) {
      var strat = strats[key] || defaultStrat;
      options[key] = strat(parent[key], child[key], vm, key);
    }
    return options
  }

  /**
   * Resolve an asset.
   * This function is used because child instances need access
   * to assets defined in its ancestor chain.
   */
  function resolveAsset (
    options,
    type,
    id,
    warnMissing
  ) {
    /* istanbul ignore if */
    if (typeof id !== 'string') {
      return
    }
    var assets = options[type];
    // check local registration variations first
    if (hasOwn(assets, id)) { return assets[id] }
    var camelizedId = camelize(id);
    if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
    var PascalCaseId = capitalize(camelizedId);
    if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
    // fallback to prototype chain
    var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
    if ( warnMissing && !res) {
      warn(
        'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
        options
      );
    }
    return res
  }

  /*  */



  function validateProp (
    key,
    propOptions,
    propsData,
    vm
  ) {
    var prop = propOptions[key];
    var absent = !hasOwn(propsData, key);
    var value = propsData[key];
    // boolean casting
    var booleanIndex = getTypeIndex(Boolean, prop.type);
    if (booleanIndex > -1) {
      if (absent && !hasOwn(prop, 'default')) {
        value = false;
      } else if (value === '' || value === hyphenate(key)) {
        // only cast empty string / same name to boolean if
        // boolean has higher priority
        var stringIndex = getTypeIndex(String, prop.type);
        if (stringIndex < 0 || booleanIndex < stringIndex) {
          value = true;
        }
      }
    }
    // check default value
    if (value === undefined) {
      value = getPropDefaultValue(vm, prop, key);
      // since the default value is a fresh copy,
      // make sure to observe it.
      var prevShouldObserve = shouldObserve;
      toggleObserving(true);
      observe(value);
      toggleObserving(prevShouldObserve);
    }
    {
      assertProp(prop, key, value, vm, absent);
    }
    return value
  }

  /**
   * Get the default value of a prop.
   */
  function getPropDefaultValue (vm, prop, key) {
    // no default, return undefined
    if (!hasOwn(prop, 'default')) {
      return undefined
    }
    var def = prop.default;
    // warn against non-factory defaults for Object & Array
    if ( isObject(def)) {
      warn(
        'Invalid default value for prop "' + key + '": ' +
        'Props with type Object/Array must use a factory function ' +
        'to return the default value.',
        vm
      );
    }
    // the raw prop value was also undefined from previous render,
    // return previous default value to avoid unnecessary watcher trigger
    if (vm && vm.$options.propsData &&
      vm.$options.propsData[key] === undefined &&
      vm._props[key] !== undefined
    ) {
      return vm._props[key]
    }
    // call factory function for non-Function types
    // a value is Function if its prototype is function even across different execution context
    return typeof def === 'function' && getType(prop.type) !== 'Function'
      ? def.call(vm)
      : def
  }

  /**
   * Assert whether a prop is valid.
   */
  function assertProp (
    prop,
    name,
    value,
    vm,
    absent
  ) {
    if (prop.required && absent) {
      warn(
        'Missing required prop: "' + name + '"',
        vm
      );
      return
    }
    if (value == null && !prop.required) {
      return
    }
    var type = prop.type;
    var valid = !type || type === true;
    var expectedTypes = [];
    if (type) {
      if (!Array.isArray(type)) {
        type = [type];
      }
      for (var i = 0; i < type.length && !valid; i++) {
        var assertedType = assertType(value, type[i]);
        expectedTypes.push(assertedType.expectedType || '');
        valid = assertedType.valid;
      }
    }

    if (!valid) {
      warn(
        getInvalidTypeMessage(name, value, expectedTypes),
        vm
      );
      return
    }
    var validator = prop.validator;
    if (validator) {
      if (!validator(value)) {
        warn(
          'Invalid prop: custom validator check failed for prop "' + name + '".',
          vm
        );
      }
    }
  }

  var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

  function assertType (value, type) {
    var valid;
    var expectedType = getType(type);
    if (simpleCheckRE.test(expectedType)) {
      var t = typeof value;
      valid = t === expectedType.toLowerCase();
      // for primitive wrapper objects
      if (!valid && t === 'object') {
        valid = value instanceof type;
      }
    } else if (expectedType === 'Object') {
      valid = isPlainObject(value);
    } else if (expectedType === 'Array') {
      valid = Array.isArray(value);
    } else {
      valid = value instanceof type;
    }
    return {
      valid: valid,
      expectedType: expectedType
    }
  }

  /**
   * Use function string name to check built-in types,
   * because a simple equality check will fail when running
   * across different vms / iframes.
   */
  function getType (fn) {
    var match = fn && fn.toString().match(/^\s*function (\w+)/);
    return match ? match[1] : ''
  }

  function isSameType (a, b) {
    return getType(a) === getType(b)
  }

  function getTypeIndex (type, expectedTypes) {
    if (!Array.isArray(expectedTypes)) {
      return isSameType(expectedTypes, type) ? 0 : -1
    }
    for (var i = 0, len = expectedTypes.length; i < len; i++) {
      if (isSameType(expectedTypes[i], type)) {
        return i
      }
    }
    return -1
  }

  function getInvalidTypeMessage (name, value, expectedTypes) {
    var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
      " Expected " + (expectedTypes.map(capitalize).join(', '));
    var expectedType = expectedTypes[0];
    var receivedType = toRawType(value);
    var expectedValue = styleValue(value, expectedType);
    var receivedValue = styleValue(value, receivedType);
    // check if we need to specify expected value
    if (expectedTypes.length === 1 &&
        isExplicable(expectedType) &&
        !isBoolean(expectedType, receivedType)) {
      message += " with value " + expectedValue;
    }
    message += ", got " + receivedType + " ";
    // check if we need to specify received value
    if (isExplicable(receivedType)) {
      message += "with value " + receivedValue + ".";
    }
    return message
  }

  function styleValue (value, type) {
    if (type === 'String') {
      return ("\"" + value + "\"")
    } else if (type === 'Number') {
      return ("" + (Number(value)))
    } else {
      return ("" + value)
    }
  }

  function isExplicable (value) {
    var explicitTypes = ['string', 'number', 'boolean'];
    return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
  }

  function isBoolean () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
  }

  /*  */

  function handleError (err, vm, info) {
    // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
    // See: https://github.com/vuejs/vuex/issues/1505
    pushTarget();
    try {
      if (vm) {
        var cur = vm;
        while ((cur = cur.$parent)) {
          var hooks = cur.$options.errorCaptured;
          if (hooks) {
            for (var i = 0; i < hooks.length; i++) {
              try {
                var capture = hooks[i].call(cur, err, vm, info) === false;
                if (capture) { return }
              } catch (e) {
                globalHandleError(e, cur, 'errorCaptured hook');
              }
            }
          }
        }
      }
      globalHandleError(err, vm, info);
    } finally {
      popTarget();
    }
  }

  function invokeWithErrorHandling (
    handler,
    context,
    args,
    vm,
    info
  ) {
    var res;
    try {
      res = args ? handler.apply(context, args) : handler.call(context);
      if (res && !res._isVue && isPromise(res) && !res._handled) {
        res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
        // issue #9511
        // avoid catch triggering multiple times when nested calls
        res._handled = true;
      }
    } catch (e) {
      handleError(e, vm, info);
    }
    return res
  }

  function globalHandleError (err, vm, info) {
    if (config.errorHandler) {
      try {
        return config.errorHandler.call(null, err, vm, info)
      } catch (e) {
        // if the user intentionally throws the original error in the handler,
        // do not log it twice
        if (e !== err) {
          logError(e, null, 'config.errorHandler');
        }
      }
    }
    logError(err, vm, info);
  }

  function logError (err, vm, info) {
    {
      warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
    }
    /* istanbul ignore else */
    if ((inBrowser || inWeex) && typeof console !== 'undefined') {
      console.error(err);
    } else {
      throw err
    }
  }

  /*  */

  var isUsingMicroTask = false;

  var callbacks = [];
  var pending = false;

  function flushCallbacks () {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  // Here we have async deferring wrappers using microtasks.
  // In 2.5 we used (macro) tasks (in combination with microtasks).
  // However, it has subtle problems when state is changed right before repaint
  // (e.g. #6813, out-in transitions).
  // Also, using (macro) tasks in event handler would cause some weird behaviors
  // that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
  // So we now use microtasks everywhere, again.
  // A major drawback of this tradeoff is that there are some scenarios
  // where microtasks have too high a priority and fire in between supposedly
  // sequential events (e.g. #4521, #6690, which have workarounds)
  // or even between bubbling of the same event (#6566).
  var timerFunc;

  // The nextTick behavior leverages the microtask queue, which can be accessed
  // via either native Promise.then or MutationObserver.
  // MutationObserver has wider support, however it is seriously bugged in
  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
  // completely stops working after triggering a few times... so, if native
  // Promise is available, we will use it:
  /* istanbul ignore next, $flow-disable-line */
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    var p = Promise.resolve();
    timerFunc = function () {
      p.then(flushCallbacks);
      // In problematic UIWebViews, Promise.then doesn't completely break, but
      // it can get stuck in a weird state where callbacks are pushed into the
      // microtask queue but the queue isn't being flushed, until the browser
      // needs to do some other work, e.g. handle a timer. Therefore we can
      // "force" the microtask queue to be flushed by adding an empty timer.
      if (isIOS) { setTimeout(noop); }
    };
    isUsingMicroTask = true;
  } else if (!isIE && typeof MutationObserver !== 'undefined' && (
    isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === '[object MutationObserverConstructor]'
  )) {
    // Use MutationObserver where native Promise is not available,
    // e.g. PhantomJS, iOS7, Android 4.4
    // (#6466 MutationObserver is unreliable in IE11)
    var counter = 1;
    var observer = new MutationObserver(flushCallbacks);
    var textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function () {
      counter = (counter + 1) % 2;
      textNode.data = String(counter);
    };
    isUsingMicroTask = true;
  } else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
    // Fallback to setImmediate.
    // Technically it leverages the (macro) task queue,
    // but it is still a better choice than setTimeout.
    timerFunc = function () {
      setImmediate(flushCallbacks);
    };
  } else {
    // Fallback to setTimeout.
    timerFunc = function () {
      setTimeout(flushCallbacks, 0);
    };
  }

  function nextTick (cb, ctx) {
    var _resolve;
    callbacks.push(function () {
      if (cb) {
        try {
          cb.call(ctx);
        } catch (e) {
          handleError(e, ctx, 'nextTick');
        }
      } else if (_resolve) {
        _resolve(ctx);
      }
    });
    if (!pending) {
      pending = true;
      timerFunc();
    }
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise(function (resolve) {
        _resolve = resolve;
      })
    }
  }

  /*  */

  /* not type checking this file because flow doesn't play well with Proxy */

  var initProxy;

  {
    var allowedGlobals = makeMap(
      'Infinity,undefined,NaN,isFinite,isNaN,' +
      'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
      'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
      'require' // for Webpack/Browserify
    );

    var warnNonPresent = function (target, key) {
      warn(
        "Property or method \"" + key + "\" is not defined on the instance but " +
        'referenced during render. Make sure that this property is reactive, ' +
        'either in the data option, or for class-based components, by ' +
        'initializing the property. ' +
        'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
        target
      );
    };

    var warnReservedPrefix = function (target, key) {
      warn(
        "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
        'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
        'prevent conflicts with Vue internals. ' +
        'See: https://vuejs.org/v2/api/#data',
        target
      );
    };

    var hasProxy =
      typeof Proxy !== 'undefined' && isNative(Proxy);

    if (hasProxy) {
      var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
      config.keyCodes = new Proxy(config.keyCodes, {
        set: function set (target, key, value) {
          if (isBuiltInModifier(key)) {
            warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
            return false
          } else {
            target[key] = value;
            return true
          }
        }
      });
    }

    var hasHandler = {
      has: function has (target, key) {
        var has = key in target;
        var isAllowed = allowedGlobals(key) ||
          (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
        if (!has && !isAllowed) {
          if (key in target.$data) { warnReservedPrefix(target, key); }
          else { warnNonPresent(target, key); }
        }
        return has || !isAllowed
      }
    };

    var getHandler = {
      get: function get (target, key) {
        if (typeof key === 'string' && !(key in target)) {
          if (key in target.$data) { warnReservedPrefix(target, key); }
          else { warnNonPresent(target, key); }
        }
        return target[key]
      }
    };

    initProxy = function initProxy (vm) {
      if (hasProxy) {
        // determine which proxy handler to use
        var options = vm.$options;
        var handlers = options.render && options.render._withStripped
          ? getHandler
          : hasHandler;
        vm._renderProxy = new Proxy(vm, handlers);
      } else {
        vm._renderProxy = vm;
      }
    };
  }

  /*  */

  var seenObjects = new _Set();

  /**
   * Recursively traverse an object to evoke all converted
   * getters, so that every nested property inside the object
   * is collected as a "deep" dependency.
   */
  function traverse (val) {
    _traverse(val, seenObjects);
    seenObjects.clear();
  }

  function _traverse (val, seen) {
    var i, keys;
    var isA = Array.isArray(val);
    if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
      return
    }
    if (val.__ob__) {
      var depId = val.__ob__.dep.id;
      if (seen.has(depId)) {
        return
      }
      seen.add(depId);
    }
    if (isA) {
      i = val.length;
      while (i--) { _traverse(val[i], seen); }
    } else {
      keys = Object.keys(val);
      i = keys.length;
      while (i--) { _traverse(val[keys[i]], seen); }
    }
  }

  var mark;
  var measure;

  {
    var perf = inBrowser && window.performance;
    /* istanbul ignore if */
    if (
      perf &&
      perf.mark &&
      perf.measure &&
      perf.clearMarks &&
      perf.clearMeasures
    ) {
      mark = function (tag) { return perf.mark(tag); };
      measure = function (name, startTag, endTag) {
        perf.measure(name, startTag, endTag);
        perf.clearMarks(startTag);
        perf.clearMarks(endTag);
        // perf.clearMeasures(name)
      };
    }
  }

  /*  */

  var normalizeEvent = cached(function (name) {
    var passive = name.charAt(0) === '&';
    name = passive ? name.slice(1) : name;
    var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
    name = once$$1 ? name.slice(1) : name;
    var capture = name.charAt(0) === '!';
    name = capture ? name.slice(1) : name;
    return {
      name: name,
      once: once$$1,
      capture: capture,
      passive: passive
    }
  });

  function createFnInvoker (fns, vm) {
    function invoker () {
      var arguments$1 = arguments;

      var fns = invoker.fns;
      if (Array.isArray(fns)) {
        var cloned = fns.slice();
        for (var i = 0; i < cloned.length; i++) {
          invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
        }
      } else {
        // return handler return value for single handlers
        return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
      }
    }
    invoker.fns = fns;
    return invoker
  }

  function updateListeners (
    on,
    oldOn,
    add,
    remove$$1,
    createOnceHandler,
    vm
  ) {
    var name, def$$1, cur, old, event;
    for (name in on) {
      def$$1 = cur = on[name];
      old = oldOn[name];
      event = normalizeEvent(name);
      if (isUndef(cur)) {
         warn(
          "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
          vm
        );
      } else if (isUndef(old)) {
        if (isUndef(cur.fns)) {
          cur = on[name] = createFnInvoker(cur, vm);
        }
        if (isTrue(event.once)) {
          cur = on[name] = createOnceHandler(event.name, cur, event.capture);
        }
        add(event.name, cur, event.capture, event.passive, event.params);
      } else if (cur !== old) {
        old.fns = cur;
        on[name] = old;
      }
    }
    for (name in oldOn) {
      if (isUndef(on[name])) {
        event = normalizeEvent(name);
        remove$$1(event.name, oldOn[name], event.capture);
      }
    }
  }

  /*  */

  function mergeVNodeHook (def, hookKey, hook) {
    if (def instanceof VNode) {
      def = def.data.hook || (def.data.hook = {});
    }
    var invoker;
    var oldHook = def[hookKey];

    function wrappedHook () {
      hook.apply(this, arguments);
      // important: remove merged hook to ensure it's called only once
      // and prevent memory leak
      remove(invoker.fns, wrappedHook);
    }

    if (isUndef(oldHook)) {
      // no existing hook
      invoker = createFnInvoker([wrappedHook]);
    } else {
      /* istanbul ignore if */
      if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
        // already a merged invoker
        invoker = oldHook;
        invoker.fns.push(wrappedHook);
      } else {
        // existing plain hook
        invoker = createFnInvoker([oldHook, wrappedHook]);
      }
    }

    invoker.merged = true;
    def[hookKey] = invoker;
  }

  /*  */

  function extractPropsFromVNodeData (
    data,
    Ctor,
    tag
  ) {
    // we are only extracting raw values here.
    // validation and default values are handled in the child
    // component itself.
    var propOptions = Ctor.options.props;
    if (isUndef(propOptions)) {
      return
    }
    var res = {};
    var attrs = data.attrs;
    var props = data.props;
    if (isDef(attrs) || isDef(props)) {
      for (var key in propOptions) {
        var altKey = hyphenate(key);
        {
          var keyInLowerCase = key.toLowerCase();
          if (
            key !== keyInLowerCase &&
            attrs && hasOwn(attrs, keyInLowerCase)
          ) {
            tip(
              "Prop \"" + keyInLowerCase + "\" is passed to component " +
              (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
              " \"" + key + "\". " +
              "Note that HTML attributes are case-insensitive and camelCased " +
              "props need to use their kebab-case equivalents when using in-DOM " +
              "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
            );
          }
        }
        checkProp(res, props, key, altKey, true) ||
        checkProp(res, attrs, key, altKey, false);
      }
    }
    return res
  }

  function checkProp (
    res,
    hash,
    key,
    altKey,
    preserve
  ) {
    if (isDef(hash)) {
      if (hasOwn(hash, key)) {
        res[key] = hash[key];
        if (!preserve) {
          delete hash[key];
        }
        return true
      } else if (hasOwn(hash, altKey)) {
        res[key] = hash[altKey];
        if (!preserve) {
          delete hash[altKey];
        }
        return true
      }
    }
    return false
  }

  /*  */

  // The template compiler attempts to minimize the need for normalization by
  // statically analyzing the template at compile time.
  //
  // For plain HTML markup, normalization can be completely skipped because the
  // generated render function is guaranteed to return Array<VNode>. There are
  // two cases where extra normalization is needed:

  // 1. When the children contains components - because a functional component
  // may return an Array instead of a single root. In this case, just a simple
  // normalization is needed - if any child is an Array, we flatten the whole
  // thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
  // because functional components already normalize their own children.
  function simpleNormalizeChildren (children) {
    for (var i = 0; i < children.length; i++) {
      if (Array.isArray(children[i])) {
        return Array.prototype.concat.apply([], children)
      }
    }
    return children
  }

  // 2. When the children contains constructs that always generated nested Arrays,
  // e.g. <template>, <slot>, v-for, or when the children is provided by user
  // with hand-written render functions / JSX. In such cases a full normalization
  // is needed to cater to all possible types of children values.
  function normalizeChildren (children) {
    return isPrimitive(children)
      ? [createTextVNode(children)]
      : Array.isArray(children)
        ? normalizeArrayChildren(children)
        : undefined
  }

  function isTextNode (node) {
    return isDef(node) && isDef(node.text) && isFalse(node.isComment)
  }

  function normalizeArrayChildren (children, nestedIndex) {
    var res = [];
    var i, c, lastIndex, last;
    for (i = 0; i < children.length; i++) {
      c = children[i];
      if (isUndef(c) || typeof c === 'boolean') { continue }
      lastIndex = res.length - 1;
      last = res[lastIndex];
      //  nested
      if (Array.isArray(c)) {
        if (c.length > 0) {
          c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
          // merge adjacent text nodes
          if (isTextNode(c[0]) && isTextNode(last)) {
            res[lastIndex] = createTextVNode(last.text + (c[0]).text);
            c.shift();
          }
          res.push.apply(res, c);
        }
      } else if (isPrimitive(c)) {
        if (isTextNode(last)) {
          // merge adjacent text nodes
          // this is necessary for SSR hydration because text nodes are
          // essentially merged when rendered to HTML strings
          res[lastIndex] = createTextVNode(last.text + c);
        } else if (c !== '') {
          // convert primitive to vnode
          res.push(createTextVNode(c));
        }
      } else {
        if (isTextNode(c) && isTextNode(last)) {
          // merge adjacent text nodes
          res[lastIndex] = createTextVNode(last.text + c.text);
        } else {
          // default key for nested array children (likely generated by v-for)
          if (isTrue(children._isVList) &&
            isDef(c.tag) &&
            isUndef(c.key) &&
            isDef(nestedIndex)) {
            c.key = "__vlist" + nestedIndex + "_" + i + "__";
          }
          res.push(c);
        }
      }
    }
    return res
  }

  /*  */

  function initProvide (vm) {
    var provide = vm.$options.provide;
    if (provide) {
      vm._provided = typeof provide === 'function'
        ? provide.call(vm)
        : provide;
    }
  }

  function initInjections (vm) {
    var result = resolveInject(vm.$options.inject, vm);
    if (result) {
      toggleObserving(false);
      Object.keys(result).forEach(function (key) {
        /* istanbul ignore else */
        {
          defineReactive$$1(vm, key, result[key], function () {
            warn(
              "Avoid mutating an injected value directly since the changes will be " +
              "overwritten whenever the provided component re-renders. " +
              "injection being mutated: \"" + key + "\"",
              vm
            );
          });
        }
      });
      toggleObserving(true);
    }
  }

  function resolveInject (inject, vm) {
    if (inject) {
      // inject is :any because flow is not smart enough to figure out cached
      var result = Object.create(null);
      var keys = hasSymbol
        ? Reflect.ownKeys(inject)
        : Object.keys(inject);

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        // #6574 in case the inject object is observed...
        if (key === '__ob__') { continue }
        var provideKey = inject[key].from;
        var source = vm;
        while (source) {
          if (source._provided && hasOwn(source._provided, provideKey)) {
            result[key] = source._provided[provideKey];
            break
          }
          source = source.$parent;
        }
        if (!source) {
          if ('default' in inject[key]) {
            var provideDefault = inject[key].default;
            result[key] = typeof provideDefault === 'function'
              ? provideDefault.call(vm)
              : provideDefault;
          } else {
            warn(("Injection \"" + key + "\" not found"), vm);
          }
        }
      }
      return result
    }
  }

  /*  */



  /**
   * Runtime helper for resolving raw children VNodes into a slot object.
   */
  function resolveSlots (
    children,
    context
  ) {
    if (!children || !children.length) {
      return {}
    }
    var slots = {};
    for (var i = 0, l = children.length; i < l; i++) {
      var child = children[i];
      var data = child.data;
      // remove slot attribute if the node is resolved as a Vue slot node
      if (data && data.attrs && data.attrs.slot) {
        delete data.attrs.slot;
      }
      // named slots should only be respected if the vnode was rendered in the
      // same context.
      if ((child.context === context || child.fnContext === context) &&
        data && data.slot != null
      ) {
        var name = data.slot;
        var slot = (slots[name] || (slots[name] = []));
        if (child.tag === 'template') {
          slot.push.apply(slot, child.children || []);
        } else {
          slot.push(child);
        }
      } else {
        (slots.default || (slots.default = [])).push(child);
      }
    }
    // ignore slots that contains only whitespace
    for (var name$1 in slots) {
      if (slots[name$1].every(isWhitespace)) {
        delete slots[name$1];
      }
    }
    return slots
  }

  function isWhitespace (node) {
    return (node.isComment && !node.asyncFactory) || node.text === ' '
  }

  /*  */

  function normalizeScopedSlots (
    slots,
    normalSlots,
    prevSlots
  ) {
    var res;
    var hasNormalSlots = Object.keys(normalSlots).length > 0;
    var isStable = slots ? !!slots.$stable : !hasNormalSlots;
    var key = slots && slots.$key;
    if (!slots) {
      res = {};
    } else if (slots._normalized) {
      // fast path 1: child component re-render only, parent did not change
      return slots._normalized
    } else if (
      isStable &&
      prevSlots &&
      prevSlots !== emptyObject &&
      key === prevSlots.$key &&
      !hasNormalSlots &&
      !prevSlots.$hasNormal
    ) {
      // fast path 2: stable scoped slots w/ no normal slots to proxy,
      // only need to normalize once
      return prevSlots
    } else {
      res = {};
      for (var key$1 in slots) {
        if (slots[key$1] && key$1[0] !== '$') {
          res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
        }
      }
    }
    // expose normal slots on scopedSlots
    for (var key$2 in normalSlots) {
      if (!(key$2 in res)) {
        res[key$2] = proxyNormalSlot(normalSlots, key$2);
      }
    }
    // avoriaz seems to mock a non-extensible $scopedSlots object
    // and when that is passed down this would cause an error
    if (slots && Object.isExtensible(slots)) {
      (slots)._normalized = res;
    }
    def(res, '$stable', isStable);
    def(res, '$key', key);
    def(res, '$hasNormal', hasNormalSlots);
    return res
  }

  function normalizeScopedSlot(normalSlots, key, fn) {
    var normalized = function () {
      var res = arguments.length ? fn.apply(null, arguments) : fn({});
      res = res && typeof res === 'object' && !Array.isArray(res)
        ? [res] // single vnode
        : normalizeChildren(res);
      return res && (
        res.length === 0 ||
        (res.length === 1 && res[0].isComment) // #9658
      ) ? undefined
        : res
    };
    // this is a slot using the new v-slot syntax without scope. although it is
    // compiled as a scoped slot, render fn users would expect it to be present
    // on this.$slots because the usage is semantically a normal slot.
    if (fn.proxy) {
      Object.defineProperty(normalSlots, key, {
        get: normalized,
        enumerable: true,
        configurable: true
      });
    }
    return normalized
  }

  function proxyNormalSlot(slots, key) {
    return function () { return slots[key]; }
  }

  /*  */

  /**
   * Runtime helper for rendering v-for lists.
   */
  function renderList (
    val,
    render
  ) {
    var ret, i, l, keys, key;
    if (Array.isArray(val) || typeof val === 'string') {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = render(val[i], i);
      }
    } else if (typeof val === 'number') {
      ret = new Array(val);
      for (i = 0; i < val; i++) {
        ret[i] = render(i + 1, i);
      }
    } else if (isObject(val)) {
      if (hasSymbol && val[Symbol.iterator]) {
        ret = [];
        var iterator = val[Symbol.iterator]();
        var result = iterator.next();
        while (!result.done) {
          ret.push(render(result.value, ret.length));
          result = iterator.next();
        }
      } else {
        keys = Object.keys(val);
        ret = new Array(keys.length);
        for (i = 0, l = keys.length; i < l; i++) {
          key = keys[i];
          ret[i] = render(val[key], key, i);
        }
      }
    }
    if (!isDef(ret)) {
      ret = [];
    }
    (ret)._isVList = true;
    return ret
  }

  /*  */

  /**
   * Runtime helper for rendering <slot>
   */
  function renderSlot (
    name,
    fallback,
    props,
    bindObject
  ) {
    var scopedSlotFn = this.$scopedSlots[name];
    var nodes;
    if (scopedSlotFn) { // scoped slot
      props = props || {};
      if (bindObject) {
        if ( !isObject(bindObject)) {
          warn(
            'slot v-bind without argument expects an Object',
            this
          );
        }
        props = extend(extend({}, bindObject), props);
      }
      nodes = scopedSlotFn(props) || fallback;
    } else {
      nodes = this.$slots[name] || fallback;
    }

    var target = props && props.slot;
    if (target) {
      return this.$createElement('template', { slot: target }, nodes)
    } else {
      return nodes
    }
  }

  /*  */

  /**
   * Runtime helper for resolving filters
   */
  function resolveFilter (id) {
    return resolveAsset(this.$options, 'filters', id, true) || identity
  }

  /*  */

  function isKeyNotMatch (expect, actual) {
    if (Array.isArray(expect)) {
      return expect.indexOf(actual) === -1
    } else {
      return expect !== actual
    }
  }

  /**
   * Runtime helper for checking keyCodes from config.
   * exposed as Vue.prototype._k
   * passing in eventKeyName as last argument separately for backwards compat
   */
  function checkKeyCodes (
    eventKeyCode,
    key,
    builtInKeyCode,
    eventKeyName,
    builtInKeyName
  ) {
    var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
    if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
      return isKeyNotMatch(builtInKeyName, eventKeyName)
    } else if (mappedKeyCode) {
      return isKeyNotMatch(mappedKeyCode, eventKeyCode)
    } else if (eventKeyName) {
      return hyphenate(eventKeyName) !== key
    }
  }

  /*  */

  /**
   * Runtime helper for merging v-bind="object" into a VNode's data.
   */
  function bindObjectProps (
    data,
    tag,
    value,
    asProp,
    isSync
  ) {
    if (value) {
      if (!isObject(value)) {
         warn(
          'v-bind without argument expects an Object or Array value',
          this
        );
      } else {
        if (Array.isArray(value)) {
          value = toObject(value);
        }
        var hash;
        var loop = function ( key ) {
          if (
            key === 'class' ||
            key === 'style' ||
            isReservedAttribute(key)
          ) {
            hash = data;
          } else {
            var type = data.attrs && data.attrs.type;
            hash = asProp || config.mustUseProp(tag, type, key)
              ? data.domProps || (data.domProps = {})
              : data.attrs || (data.attrs = {});
          }
          var camelizedKey = camelize(key);
          var hyphenatedKey = hyphenate(key);
          if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
            hash[key] = value[key];

            if (isSync) {
              var on = data.on || (data.on = {});
              on[("update:" + key)] = function ($event) {
                value[key] = $event;
              };
            }
          }
        };

        for (var key in value) loop( key );
      }
    }
    return data
  }

  /*  */

  /**
   * Runtime helper for rendering static trees.
   */
  function renderStatic (
    index,
    isInFor
  ) {
    var cached = this._staticTrees || (this._staticTrees = []);
    var tree = cached[index];
    // if has already-rendered static tree and not inside v-for,
    // we can reuse the same tree.
    if (tree && !isInFor) {
      return tree
    }
    // otherwise, render a fresh tree.
    tree = cached[index] = this.$options.staticRenderFns[index].call(
      this._renderProxy,
      null,
      this // for render fns generated for functional component templates
    );
    markStatic(tree, ("__static__" + index), false);
    return tree
  }

  /**
   * Runtime helper for v-once.
   * Effectively it means marking the node as static with a unique key.
   */
  function markOnce (
    tree,
    index,
    key
  ) {
    markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
    return tree
  }

  function markStatic (
    tree,
    key,
    isOnce
  ) {
    if (Array.isArray(tree)) {
      for (var i = 0; i < tree.length; i++) {
        if (tree[i] && typeof tree[i] !== 'string') {
          markStaticNode(tree[i], (key + "_" + i), isOnce);
        }
      }
    } else {
      markStaticNode(tree, key, isOnce);
    }
  }

  function markStaticNode (node, key, isOnce) {
    node.isStatic = true;
    node.key = key;
    node.isOnce = isOnce;
  }

  /*  */

  function bindObjectListeners (data, value) {
    if (value) {
      if (!isPlainObject(value)) {
         warn(
          'v-on without argument expects an Object value',
          this
        );
      } else {
        var on = data.on = data.on ? extend({}, data.on) : {};
        for (var key in value) {
          var existing = on[key];
          var ours = value[key];
          on[key] = existing ? [].concat(existing, ours) : ours;
        }
      }
    }
    return data
  }

  /*  */

  function resolveScopedSlots (
    fns, // see flow/vnode
    res,
    // the following are added in 2.6
    hasDynamicKeys,
    contentHashKey
  ) {
    res = res || { $stable: !hasDynamicKeys };
    for (var i = 0; i < fns.length; i++) {
      var slot = fns[i];
      if (Array.isArray(slot)) {
        resolveScopedSlots(slot, res, hasDynamicKeys);
      } else if (slot) {
        // marker for reverse proxying v-slot without scope on this.$slots
        if (slot.proxy) {
          slot.fn.proxy = true;
        }
        res[slot.key] = slot.fn;
      }
    }
    if (contentHashKey) {
      (res).$key = contentHashKey;
    }
    return res
  }

  /*  */

  function bindDynamicKeys (baseObj, values) {
    for (var i = 0; i < values.length; i += 2) {
      var key = values[i];
      if (typeof key === 'string' && key) {
        baseObj[values[i]] = values[i + 1];
      } else if ( key !== '' && key !== null) {
        // null is a special value for explicitly removing a binding
        warn(
          ("Invalid value for dynamic directive argument (expected string or null): " + key),
          this
        );
      }
    }
    return baseObj
  }

  // helper to dynamically append modifier runtime markers to event names.
  // ensure only append when value is already string, otherwise it will be cast
  // to string and cause the type check to miss.
  function prependModifier (value, symbol) {
    return typeof value === 'string' ? symbol + value : value
  }

  /*  */

  function installRenderHelpers (target) {
    target._o = markOnce;
    target._n = toNumber;
    target._s = toString;
    target._l = renderList;
    target._t = renderSlot;
    target._q = looseEqual;
    target._i = looseIndexOf;
    target._m = renderStatic;
    target._f = resolveFilter;
    target._k = checkKeyCodes;
    target._b = bindObjectProps;
    target._v = createTextVNode;
    target._e = createEmptyVNode;
    target._u = resolveScopedSlots;
    target._g = bindObjectListeners;
    target._d = bindDynamicKeys;
    target._p = prependModifier;
  }

  /*  */

  function FunctionalRenderContext (
    data,
    props,
    children,
    parent,
    Ctor
  ) {
    var this$1 = this;

    var options = Ctor.options;
    // ensure the createElement function in functional components
    // gets a unique context - this is necessary for correct named slot check
    var contextVm;
    if (hasOwn(parent, '_uid')) {
      contextVm = Object.create(parent);
      // $flow-disable-line
      contextVm._original = parent;
    } else {
      // the context vm passed in is a functional context as well.
      // in this case we want to make sure we are able to get a hold to the
      // real context instance.
      contextVm = parent;
      // $flow-disable-line
      parent = parent._original;
    }
    var isCompiled = isTrue(options._compiled);
    var needNormalization = !isCompiled;

    this.data = data;
    this.props = props;
    this.children = children;
    this.parent = parent;
    this.listeners = data.on || emptyObject;
    this.injections = resolveInject(options.inject, parent);
    this.slots = function () {
      if (!this$1.$slots) {
        normalizeScopedSlots(
          data.scopedSlots,
          this$1.$slots = resolveSlots(children, parent)
        );
      }
      return this$1.$slots
    };

    Object.defineProperty(this, 'scopedSlots', ({
      enumerable: true,
      get: function get () {
        return normalizeScopedSlots(data.scopedSlots, this.slots())
      }
    }));

    // support for compiled functional template
    if (isCompiled) {
      // exposing $options for renderStatic()
      this.$options = options;
      // pre-resolve slots for renderSlot()
      this.$slots = this.slots();
      this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
    }

    if (options._scopeId) {
      this._c = function (a, b, c, d) {
        var vnode = createElement(contextVm, a, b, c, d, needNormalization);
        if (vnode && !Array.isArray(vnode)) {
          vnode.fnScopeId = options._scopeId;
          vnode.fnContext = parent;
        }
        return vnode
      };
    } else {
      this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
    }
  }

  installRenderHelpers(FunctionalRenderContext.prototype);

  function createFunctionalComponent (
    Ctor,
    propsData,
    data,
    contextVm,
    children
  ) {
    var options = Ctor.options;
    var props = {};
    var propOptions = options.props;
    if (isDef(propOptions)) {
      for (var key in propOptions) {
        props[key] = validateProp(key, propOptions, propsData || emptyObject);
      }
    } else {
      if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
      if (isDef(data.props)) { mergeProps(props, data.props); }
    }

    var renderContext = new FunctionalRenderContext(
      data,
      props,
      children,
      contextVm,
      Ctor
    );

    var vnode = options.render.call(null, renderContext._c, renderContext);

    if (vnode instanceof VNode) {
      return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
    } else if (Array.isArray(vnode)) {
      var vnodes = normalizeChildren(vnode) || [];
      var res = new Array(vnodes.length);
      for (var i = 0; i < vnodes.length; i++) {
        res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
      }
      return res
    }
  }

  function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
    // #7817 clone node before setting fnContext, otherwise if the node is reused
    // (e.g. it was from a cached normal slot) the fnContext causes named slots
    // that should not be matched to match.
    var clone = cloneVNode(vnode);
    clone.fnContext = contextVm;
    clone.fnOptions = options;
    {
      (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
    }
    if (data.slot) {
      (clone.data || (clone.data = {})).slot = data.slot;
    }
    return clone
  }

  function mergeProps (to, from) {
    for (var key in from) {
      to[camelize(key)] = from[key];
    }
  }

  /*  */

  /*  */

  /*  */

  /*  */

  // inline hooks to be invoked on component VNodes during patch
  var componentVNodeHooks = {
    init: function init (vnode, hydrating) {
      if (
        vnode.componentInstance &&
        !vnode.componentInstance._isDestroyed &&
        vnode.data.keepAlive
      ) {
        // kept-alive components, treat as a patch
        var mountedNode = vnode; // work around flow
        componentVNodeHooks.prepatch(mountedNode, mountedNode);
      } else {
        var child = vnode.componentInstance = createComponentInstanceForVnode(
          vnode,
          activeInstance
        );
        child.$mount(hydrating ? vnode.elm : undefined, hydrating);
      }
    },

    prepatch: function prepatch (oldVnode, vnode) {
      var options = vnode.componentOptions;
      var child = vnode.componentInstance = oldVnode.componentInstance;
      updateChildComponent(
        child,
        options.propsData, // updated props
        options.listeners, // updated listeners
        vnode, // new parent vnode
        options.children // new children
      );
    },

    insert: function insert (vnode) {
      var context = vnode.context;
      var componentInstance = vnode.componentInstance;
      if (!componentInstance._isMounted) {
        componentInstance._isMounted = true;
        callHook(componentInstance, 'mounted');
      }
      if (vnode.data.keepAlive) {
        if (context._isMounted) {
          // vue-router#1212
          // During updates, a kept-alive component's child components may
          // change, so directly walking the tree here may call activated hooks
          // on incorrect children. Instead we push them into a queue which will
          // be processed after the whole patch process ended.
          queueActivatedComponent(componentInstance);
        } else {
          activateChildComponent(componentInstance, true /* direct */);
        }
      }
    },

    destroy: function destroy (vnode) {
      var componentInstance = vnode.componentInstance;
      if (!componentInstance._isDestroyed) {
        if (!vnode.data.keepAlive) {
          componentInstance.$destroy();
        } else {
          deactivateChildComponent(componentInstance, true /* direct */);
        }
      }
    }
  };

  var hooksToMerge = Object.keys(componentVNodeHooks);

  function createComponent (
    Ctor,
    data,
    context,
    children,
    tag
  ) {
    if (isUndef(Ctor)) {
      return
    }

    var baseCtor = context.$options._base;

    // plain options object: turn it into a constructor
    if (isObject(Ctor)) {
      Ctor = baseCtor.extend(Ctor);
    }

    // if at this stage it's not a constructor or an async component factory,
    // reject.
    if (typeof Ctor !== 'function') {
      {
        warn(("Invalid Component definition: " + (String(Ctor))), context);
      }
      return
    }

    // async component
    var asyncFactory;
    if (isUndef(Ctor.cid)) {
      asyncFactory = Ctor;
      Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
      if (Ctor === undefined) {
        // return a placeholder node for async component, which is rendered
        // as a comment node but preserves all the raw information for the node.
        // the information will be used for async server-rendering and hydration.
        return createAsyncPlaceholder(
          asyncFactory,
          data,
          context,
          children,
          tag
        )
      }
    }

    data = data || {};

    // resolve constructor options in case global mixins are applied after
    // component constructor creation
    resolveConstructorOptions(Ctor);

    // transform component v-model data into props & events
    if (isDef(data.model)) {
      transformModel(Ctor.options, data);
    }

    // extract props
    var propsData = extractPropsFromVNodeData(data, Ctor, tag);

    // functional component
    if (isTrue(Ctor.options.functional)) {
      return createFunctionalComponent(Ctor, propsData, data, context, children)
    }

    // extract listeners, since these needs to be treated as
    // child component listeners instead of DOM listeners
    var listeners = data.on;
    // replace with listeners with .native modifier
    // so it gets processed during parent component patch.
    data.on = data.nativeOn;

    if (isTrue(Ctor.options.abstract)) {
      // abstract components do not keep anything
      // other than props & listeners & slot

      // work around flow
      var slot = data.slot;
      data = {};
      if (slot) {
        data.slot = slot;
      }
    }

    // install component management hooks onto the placeholder node
    installComponentHooks(data);

    // return a placeholder vnode
    var name = Ctor.options.name || tag;
    var vnode = new VNode(
      ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
      data, undefined, undefined, undefined, context,
      { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
      asyncFactory
    );

    return vnode
  }

  function createComponentInstanceForVnode (
    vnode, // we know it's MountedComponentVNode but flow doesn't
    parent // activeInstance in lifecycle state
  ) {
    var options = {
      _isComponent: true,
      _parentVnode: vnode,
      parent: parent
    };
    // check inline-template render functions
    var inlineTemplate = vnode.data.inlineTemplate;
    if (isDef(inlineTemplate)) {
      options.render = inlineTemplate.render;
      options.staticRenderFns = inlineTemplate.staticRenderFns;
    }
    return new vnode.componentOptions.Ctor(options)
  }

  function installComponentHooks (data) {
    var hooks = data.hook || (data.hook = {});
    for (var i = 0; i < hooksToMerge.length; i++) {
      var key = hooksToMerge[i];
      var existing = hooks[key];
      var toMerge = componentVNodeHooks[key];
      if (existing !== toMerge && !(existing && existing._merged)) {
        hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
      }
    }
  }

  function mergeHook$1 (f1, f2) {
    var merged = function (a, b) {
      // flow complains about extra args which is why we use any
      f1(a, b);
      f2(a, b);
    };
    merged._merged = true;
    return merged
  }

  // transform component v-model info (value and callback) into
  // prop and event handler respectively.
  function transformModel (options, data) {
    var prop = (options.model && options.model.prop) || 'value';
    var event = (options.model && options.model.event) || 'input'
    ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
    var on = data.on || (data.on = {});
    var existing = on[event];
    var callback = data.model.callback;
    if (isDef(existing)) {
      if (
        Array.isArray(existing)
          ? existing.indexOf(callback) === -1
          : existing !== callback
      ) {
        on[event] = [callback].concat(existing);
      }
    } else {
      on[event] = callback;
    }
  }

  /*  */

  var SIMPLE_NORMALIZE = 1;
  var ALWAYS_NORMALIZE = 2;

  // wrapper function for providing a more flexible interface
  // without getting yelled at by flow
  function createElement (
    context,
    tag,
    data,
    children,
    normalizationType,
    alwaysNormalize
  ) {
    if (Array.isArray(data) || isPrimitive(data)) {
      normalizationType = children;
      children = data;
      data = undefined;
    }
    if (isTrue(alwaysNormalize)) {
      normalizationType = ALWAYS_NORMALIZE;
    }
    return _createElement(context, tag, data, children, normalizationType)
  }

  function _createElement (
    context,
    tag,
    data,
    children,
    normalizationType
  ) {
    if (isDef(data) && isDef((data).__ob__)) {
       warn(
        "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
        'Always create fresh vnode data objects in each render!',
        context
      );
      return createEmptyVNode()
    }
    // object syntax in v-bind
    if (isDef(data) && isDef(data.is)) {
      tag = data.is;
    }
    if (!tag) {
      // in case of component :is set to falsy value
      return createEmptyVNode()
    }
    // warn against non-primitive key
    if (
      isDef(data) && isDef(data.key) && !isPrimitive(data.key)
    ) {
      {
        warn(
          'Avoid using non-primitive value as key, ' +
          'use string/number value instead.',
          context
        );
      }
    }
    // support single function children as default scoped slot
    if (Array.isArray(children) &&
      typeof children[0] === 'function'
    ) {
      data = data || {};
      data.scopedSlots = { default: children[0] };
      children.length = 0;
    }
    if (normalizationType === ALWAYS_NORMALIZE) {
      children = normalizeChildren(children);
    } else if (normalizationType === SIMPLE_NORMALIZE) {
      children = simpleNormalizeChildren(children);
    }
    var vnode, ns;
    if (typeof tag === 'string') {
      var Ctor;
      ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
      if (config.isReservedTag(tag)) {
        // platform built-in elements
        if ( isDef(data) && isDef(data.nativeOn)) {
          warn(
            ("The .native modifier for v-on is only valid on components but it was used on <" + tag + ">."),
            context
          );
        }
        vnode = new VNode(
          config.parsePlatformTagName(tag), data, children,
          undefined, undefined, context
        );
      } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
        // component
        vnode = createComponent(Ctor, data, context, children, tag);
      } else {
        // unknown or unlisted namespaced elements
        // check at runtime because it may get assigned a namespace when its
        // parent normalizes children
        vnode = new VNode(
          tag, data, children,
          undefined, undefined, context
        );
      }
    } else {
      // direct component options / constructor
      vnode = createComponent(tag, data, context, children);
    }
    if (Array.isArray(vnode)) {
      return vnode
    } else if (isDef(vnode)) {
      if (isDef(ns)) { applyNS(vnode, ns); }
      if (isDef(data)) { registerDeepBindings(data); }
      return vnode
    } else {
      return createEmptyVNode()
    }
  }

  function applyNS (vnode, ns, force) {
    vnode.ns = ns;
    if (vnode.tag === 'foreignObject') {
      // use default namespace inside foreignObject
      ns = undefined;
      force = true;
    }
    if (isDef(vnode.children)) {
      for (var i = 0, l = vnode.children.length; i < l; i++) {
        var child = vnode.children[i];
        if (isDef(child.tag) && (
          isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
          applyNS(child, ns, force);
        }
      }
    }
  }

  // ref #5318
  // necessary to ensure parent re-render when deep bindings like :style and
  // :class are used on slot nodes
  function registerDeepBindings (data) {
    if (isObject(data.style)) {
      traverse(data.style);
    }
    if (isObject(data.class)) {
      traverse(data.class);
    }
  }

  /*  */

  function initRender (vm) {
    vm._vnode = null; // the root of the child tree
    vm._staticTrees = null; // v-once cached trees
    var options = vm.$options;
    var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
    var renderContext = parentVnode && parentVnode.context;
    vm.$slots = resolveSlots(options._renderChildren, renderContext);
    vm.$scopedSlots = emptyObject;
    // bind the createElement fn to this instance
    // so that we get proper render context inside it.
    // args order: tag, data, children, normalizationType, alwaysNormalize
    // internal version is used by render functions compiled from templates
    vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
    // normalization is always applied for the public version, used in
    // user-written render functions.
    vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

    // $attrs & $listeners are exposed for easier HOC creation.
    // they need to be reactive so that HOCs using them are always updated
    var parentData = parentVnode && parentVnode.data;

    /* istanbul ignore else */
    {
      defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
        !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
      }, true);
      defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
        !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
      }, true);
    }
  }

  var currentRenderingInstance = null;

  function renderMixin (Vue) {
    // install runtime convenience helpers
    installRenderHelpers(Vue.prototype);

    Vue.prototype.$nextTick = function (fn) {
      return nextTick(fn, this)
    };

    Vue.prototype._render = function () {
      var vm = this;
      var ref = vm.$options;
      var render = ref.render;
      var _parentVnode = ref._parentVnode;

      if (_parentVnode) {
        vm.$scopedSlots = normalizeScopedSlots(
          _parentVnode.data.scopedSlots,
          vm.$slots,
          vm.$scopedSlots
        );
      }

      // set parent vnode. this allows render functions to have access
      // to the data on the placeholder node.
      vm.$vnode = _parentVnode;
      // render self
      var vnode;
      try {
        // There's no need to maintain a stack because all render fns are called
        // separately from one another. Nested component's render fns are called
        // when parent component is patched.
        currentRenderingInstance = vm;
        vnode = render.call(vm._renderProxy, vm.$createElement);
      } catch (e) {
        handleError(e, vm, "render");
        // return error render result,
        // or previous vnode to prevent render error causing blank component
        /* istanbul ignore else */
        if ( vm.$options.renderError) {
          try {
            vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
          } catch (e) {
            handleError(e, vm, "renderError");
            vnode = vm._vnode;
          }
        } else {
          vnode = vm._vnode;
        }
      } finally {
        currentRenderingInstance = null;
      }
      // if the returned array contains only a single node, allow it
      if (Array.isArray(vnode) && vnode.length === 1) {
        vnode = vnode[0];
      }
      // return empty vnode in case the render function errored out
      if (!(vnode instanceof VNode)) {
        if ( Array.isArray(vnode)) {
          warn(
            'Multiple root nodes returned from render function. Render function ' +
            'should return a single root node.',
            vm
          );
        }
        vnode = createEmptyVNode();
      }
      // set parent
      vnode.parent = _parentVnode;
      return vnode
    };
  }

  /*  */

  function ensureCtor (comp, base) {
    if (
      comp.__esModule ||
      (hasSymbol && comp[Symbol.toStringTag] === 'Module')
    ) {
      comp = comp.default;
    }
    return isObject(comp)
      ? base.extend(comp)
      : comp
  }

  function createAsyncPlaceholder (
    factory,
    data,
    context,
    children,
    tag
  ) {
    var node = createEmptyVNode();
    node.asyncFactory = factory;
    node.asyncMeta = { data: data, context: context, children: children, tag: tag };
    return node
  }

  function resolveAsyncComponent (
    factory,
    baseCtor
  ) {
    if (isTrue(factory.error) && isDef(factory.errorComp)) {
      return factory.errorComp
    }

    if (isDef(factory.resolved)) {
      return factory.resolved
    }

    var owner = currentRenderingInstance;
    if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
      // already pending
      factory.owners.push(owner);
    }

    if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
      return factory.loadingComp
    }

    if (owner && !isDef(factory.owners)) {
      var owners = factory.owners = [owner];
      var sync = true;
      var timerLoading = null;
      var timerTimeout = null

      ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });

      var forceRender = function (renderCompleted) {
        for (var i = 0, l = owners.length; i < l; i++) {
          (owners[i]).$forceUpdate();
        }

        if (renderCompleted) {
          owners.length = 0;
          if (timerLoading !== null) {
            clearTimeout(timerLoading);
            timerLoading = null;
          }
          if (timerTimeout !== null) {
            clearTimeout(timerTimeout);
            timerTimeout = null;
          }
        }
      };

      var resolve = once(function (res) {
        // cache resolved
        factory.resolved = ensureCtor(res, baseCtor);
        // invoke callbacks only if this is not a synchronous resolve
        // (async resolves are shimmed as synchronous during SSR)
        if (!sync) {
          forceRender(true);
        } else {
          owners.length = 0;
        }
      });

      var reject = once(function (reason) {
         warn(
          "Failed to resolve async component: " + (String(factory)) +
          (reason ? ("\nReason: " + reason) : '')
        );
        if (isDef(factory.errorComp)) {
          factory.error = true;
          forceRender(true);
        }
      });

      var res = factory(resolve, reject);

      if (isObject(res)) {
        if (isPromise(res)) {
          // () => Promise
          if (isUndef(factory.resolved)) {
            res.then(resolve, reject);
          }
        } else if (isPromise(res.component)) {
          res.component.then(resolve, reject);

          if (isDef(res.error)) {
            factory.errorComp = ensureCtor(res.error, baseCtor);
          }

          if (isDef(res.loading)) {
            factory.loadingComp = ensureCtor(res.loading, baseCtor);
            if (res.delay === 0) {
              factory.loading = true;
            } else {
              timerLoading = setTimeout(function () {
                timerLoading = null;
                if (isUndef(factory.resolved) && isUndef(factory.error)) {
                  factory.loading = true;
                  forceRender(false);
                }
              }, res.delay || 200);
            }
          }

          if (isDef(res.timeout)) {
            timerTimeout = setTimeout(function () {
              timerTimeout = null;
              if (isUndef(factory.resolved)) {
                reject(
                   ("timeout (" + (res.timeout) + "ms)")
                    
                );
              }
            }, res.timeout);
          }
        }
      }

      sync = false;
      // return in case resolved synchronously
      return factory.loading
        ? factory.loadingComp
        : factory.resolved
    }
  }

  /*  */

  function isAsyncPlaceholder (node) {
    return node.isComment && node.asyncFactory
  }

  /*  */

  function getFirstComponentChild (children) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; i++) {
        var c = children[i];
        if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
          return c
        }
      }
    }
  }

  /*  */

  /*  */

  function initEvents (vm) {
    vm._events = Object.create(null);
    vm._hasHookEvent = false;
    // init parent attached events
    var listeners = vm.$options._parentListeners;
    if (listeners) {
      updateComponentListeners(vm, listeners);
    }
  }

  var target;

  function add (event, fn) {
    target.$on(event, fn);
  }

  function remove$1 (event, fn) {
    target.$off(event, fn);
  }

  function createOnceHandler (event, fn) {
    var _target = target;
    return function onceHandler () {
      var res = fn.apply(null, arguments);
      if (res !== null) {
        _target.$off(event, onceHandler);
      }
    }
  }

  function updateComponentListeners (
    vm,
    listeners,
    oldListeners
  ) {
    target = vm;
    updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
    target = undefined;
  }

  function eventsMixin (Vue) {
    var hookRE = /^hook:/;
    Vue.prototype.$on = function (event, fn) {
      var vm = this;
      if (Array.isArray(event)) {
        for (var i = 0, l = event.length; i < l; i++) {
          vm.$on(event[i], fn);
        }
      } else {
        (vm._events[event] || (vm._events[event] = [])).push(fn);
        // optimize hook:event cost by using a boolean flag marked at registration
        // instead of a hash lookup
        if (hookRE.test(event)) {
          vm._hasHookEvent = true;
        }
      }
      return vm
    };

    Vue.prototype.$once = function (event, fn) {
      var vm = this;
      function on () {
        vm.$off(event, on);
        fn.apply(vm, arguments);
      }
      on.fn = fn;
      vm.$on(event, on);
      return vm
    };

    Vue.prototype.$off = function (event, fn) {
      var vm = this;
      // all
      if (!arguments.length) {
        vm._events = Object.create(null);
        return vm
      }
      // array of events
      if (Array.isArray(event)) {
        for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
          vm.$off(event[i$1], fn);
        }
        return vm
      }
      // specific event
      var cbs = vm._events[event];
      if (!cbs) {
        return vm
      }
      if (!fn) {
        vm._events[event] = null;
        return vm
      }
      // specific handler
      var cb;
      var i = cbs.length;
      while (i--) {
        cb = cbs[i];
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i, 1);
          break
        }
      }
      return vm
    };

    Vue.prototype.$emit = function (event) {
      var vm = this;
      {
        var lowerCaseEvent = event.toLowerCase();
        if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
          tip(
            "Event \"" + lowerCaseEvent + "\" is emitted in component " +
            (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
            "Note that HTML attributes are case-insensitive and you cannot use " +
            "v-on to listen to camelCase events when using in-DOM templates. " +
            "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
          );
        }
      }
      var cbs = vm._events[event];
      if (cbs) {
        cbs = cbs.length > 1 ? toArray(cbs) : cbs;
        var args = toArray(arguments, 1);
        var info = "event handler for \"" + event + "\"";
        for (var i = 0, l = cbs.length; i < l; i++) {
          invokeWithErrorHandling(cbs[i], vm, args, vm, info);
        }
      }
      return vm
    };
  }

  /*  */

  var activeInstance = null;
  var isUpdatingChildComponent = false;

  function setActiveInstance(vm) {
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    return function () {
      activeInstance = prevActiveInstance;
    }
  }

  function initLifecycle (vm) {
    var options = vm.$options;

    // locate first non-abstract parent
    var parent = options.parent;
    if (parent && !options.abstract) {
      while (parent.$options.abstract && parent.$parent) {
        parent = parent.$parent;
      }
      parent.$children.push(vm);
    }

    vm.$parent = parent;
    vm.$root = parent ? parent.$root : vm;

    vm.$children = [];
    vm.$refs = {};

    vm._watcher = null;
    vm._inactive = null;
    vm._directInactive = false;
    vm._isMounted = false;
    vm._isDestroyed = false;
    vm._isBeingDestroyed = false;
  }

  function lifecycleMixin (Vue) {
    Vue.prototype._update = function (vnode, hydrating) {
      var vm = this;
      var prevEl = vm.$el;
      var prevVnode = vm._vnode;
      var restoreActiveInstance = setActiveInstance(vm);
      vm._vnode = vnode;
      // Vue.prototype.__patch__ is injected in entry points
      // based on the rendering backend used.
      if (!prevVnode) {
        // initial render
        vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
      } else {
        // updates
        vm.$el = vm.__patch__(prevVnode, vnode);
      }
      restoreActiveInstance();
      // update __vue__ reference
      if (prevEl) {
        prevEl.__vue__ = null;
      }
      if (vm.$el) {
        vm.$el.__vue__ = vm;
      }
      // if parent is an HOC, update its $el as well
      if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
        vm.$parent.$el = vm.$el;
      }
      // updated hook is called by the scheduler to ensure that children are
      // updated in a parent's updated hook.
    };

    Vue.prototype.$forceUpdate = function () {
      var vm = this;
      if (vm._watcher) {
        vm._watcher.update();
      }
    };

    Vue.prototype.$destroy = function () {
      var vm = this;
      if (vm._isBeingDestroyed) {
        return
      }
      callHook(vm, 'beforeDestroy');
      vm._isBeingDestroyed = true;
      // remove self from parent
      var parent = vm.$parent;
      if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
        remove(parent.$children, vm);
      }
      // teardown watchers
      if (vm._watcher) {
        vm._watcher.teardown();
      }
      var i = vm._watchers.length;
      while (i--) {
        vm._watchers[i].teardown();
      }
      // remove reference from data ob
      // frozen object may not have observer.
      if (vm._data.__ob__) {
        vm._data.__ob__.vmCount--;
      }
      // call the last hook...
      vm._isDestroyed = true;
      // invoke destroy hooks on current rendered tree
      vm.__patch__(vm._vnode, null);
      // fire destroyed hook
      callHook(vm, 'destroyed');
      // turn off all instance listeners.
      vm.$off();
      // remove __vue__ reference
      if (vm.$el) {
        vm.$el.__vue__ = null;
      }
      // release circular reference (#6759)
      if (vm.$vnode) {
        vm.$vnode.parent = null;
      }
    };
  }

  function mountComponent (
    vm,
    el,
    hydrating
  ) {
    vm.$el = el;
    if (!vm.$options.render) {
      vm.$options.render = createEmptyVNode;
      {
        /* istanbul ignore if */
        if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
          vm.$options.el || el) {
          warn(
            'You are using the runtime-only build of Vue where the template ' +
            'compiler is not available. Either pre-compile the templates into ' +
            'render functions, or use the compiler-included build.',
            vm
          );
        } else {
          warn(
            'Failed to mount component: template or render function not defined.',
            vm
          );
        }
      }
    }
    callHook(vm, 'beforeMount');

    var updateComponent;
    /* istanbul ignore if */
    if ( config.performance && mark) {
      updateComponent = function () {
        var name = vm._name;
        var id = vm._uid;
        var startTag = "vue-perf-start:" + id;
        var endTag = "vue-perf-end:" + id;

        mark(startTag);
        var vnode = vm._render();
        mark(endTag);
        measure(("vue " + name + " render"), startTag, endTag);

        mark(startTag);
        vm._update(vnode, hydrating);
        mark(endTag);
        measure(("vue " + name + " patch"), startTag, endTag);
      };
    } else {
      updateComponent = function () {
        vm._update(vm._render(), hydrating);
      };
    }

    // we set this to vm._watcher inside the watcher's constructor
    // since the watcher's initial patch may call $forceUpdate (e.g. inside child
    // component's mounted hook), which relies on vm._watcher being already defined
    new Watcher(vm, updateComponent, noop, {
      before: function before () {
        if (vm._isMounted && !vm._isDestroyed) {
          callHook(vm, 'beforeUpdate');
        }
      }
    }, true /* isRenderWatcher */);
    hydrating = false;

    // manually mounted instance, call mounted on self
    // mounted is called for render-created child components in its inserted hook
    if (vm.$vnode == null) {
      vm._isMounted = true;
      callHook(vm, 'mounted');
    }
    return vm
  }

  function updateChildComponent (
    vm,
    propsData,
    listeners,
    parentVnode,
    renderChildren
  ) {
    {
      isUpdatingChildComponent = true;
    }

    // determine whether component has slot children
    // we need to do this before overwriting $options._renderChildren.

    // check if there are dynamic scopedSlots (hand-written or compiled but with
    // dynamic slot names). Static scoped slots compiled from template has the
    // "$stable" marker.
    var newScopedSlots = parentVnode.data.scopedSlots;
    var oldScopedSlots = vm.$scopedSlots;
    var hasDynamicScopedSlot = !!(
      (newScopedSlots && !newScopedSlots.$stable) ||
      (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
      (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
    );

    // Any static slot children from the parent may have changed during parent's
    // update. Dynamic scoped slots may also have changed. In such cases, a forced
    // update is necessary to ensure correctness.
    var needsForceUpdate = !!(
      renderChildren ||               // has new static slots
      vm.$options._renderChildren ||  // has old static slots
      hasDynamicScopedSlot
    );

    vm.$options._parentVnode = parentVnode;
    vm.$vnode = parentVnode; // update vm's placeholder node without re-render

    if (vm._vnode) { // update child tree's parent
      vm._vnode.parent = parentVnode;
    }
    vm.$options._renderChildren = renderChildren;

    // update $attrs and $listeners hash
    // these are also reactive so they may trigger child update if the child
    // used them during render
    vm.$attrs = parentVnode.data.attrs || emptyObject;
    vm.$listeners = listeners || emptyObject;

    // update props
    if (propsData && vm.$options.props) {
      toggleObserving(false);
      var props = vm._props;
      var propKeys = vm.$options._propKeys || [];
      for (var i = 0; i < propKeys.length; i++) {
        var key = propKeys[i];
        var propOptions = vm.$options.props; // wtf flow?
        props[key] = validateProp(key, propOptions, propsData, vm);
      }
      toggleObserving(true);
      // keep a copy of raw propsData
      vm.$options.propsData = propsData;
    }

    // update listeners
    listeners = listeners || emptyObject;
    var oldListeners = vm.$options._parentListeners;
    vm.$options._parentListeners = listeners;
    updateComponentListeners(vm, listeners, oldListeners);

    // resolve slots + force update if has children
    if (needsForceUpdate) {
      vm.$slots = resolveSlots(renderChildren, parentVnode.context);
      vm.$forceUpdate();
    }

    {
      isUpdatingChildComponent = false;
    }
  }

  function isInInactiveTree (vm) {
    while (vm && (vm = vm.$parent)) {
      if (vm._inactive) { return true }
    }
    return false
  }

  function activateChildComponent (vm, direct) {
    if (direct) {
      vm._directInactive = false;
      if (isInInactiveTree(vm)) {
        return
      }
    } else if (vm._directInactive) {
      return
    }
    if (vm._inactive || vm._inactive === null) {
      vm._inactive = false;
      for (var i = 0; i < vm.$children.length; i++) {
        activateChildComponent(vm.$children[i]);
      }
      callHook(vm, 'activated');
    }
  }

  function deactivateChildComponent (vm, direct) {
    if (direct) {
      vm._directInactive = true;
      if (isInInactiveTree(vm)) {
        return
      }
    }
    if (!vm._inactive) {
      vm._inactive = true;
      for (var i = 0; i < vm.$children.length; i++) {
        deactivateChildComponent(vm.$children[i]);
      }
      callHook(vm, 'deactivated');
    }
  }

  function callHook (vm, hook) {
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var handlers = vm.$options[hook];
    var info = hook + " hook";
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        invokeWithErrorHandling(handlers[i], vm, null, vm, info);
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook);
    }
    popTarget();
  }

  /*  */

  var MAX_UPDATE_COUNT = 100;

  var queue = [];
  var activatedChildren = [];
  var has = {};
  var circular = {};
  var waiting = false;
  var flushing = false;
  var index = 0;

  /**
   * Reset the scheduler's state.
   */
  function resetSchedulerState () {
    index = queue.length = activatedChildren.length = 0;
    has = {};
    {
      circular = {};
    }
    waiting = flushing = false;
  }

  // Async edge case #6566 requires saving the timestamp when event listeners are
  // attached. However, calling performance.now() has a perf overhead especially
  // if the page has thousands of event listeners. Instead, we take a timestamp
  // every time the scheduler flushes and use that for all event listeners
  // attached during that flush.
  var currentFlushTimestamp = 0;

  // Async edge case fix requires storing an event listener's attach timestamp.
  var getNow = Date.now;

  // Determine what event timestamp the browser is using. Annoyingly, the
  // timestamp can either be hi-res (relative to page load) or low-res
  // (relative to UNIX epoch), so in order to compare time we have to use the
  // same timestamp type when saving the flush timestamp.
  // All IE versions use low-res event timestamps, and have problematic clock
  // implementations (#9632)
  if (inBrowser && !isIE) {
    var performance = window.performance;
    if (
      performance &&
      typeof performance.now === 'function' &&
      getNow() > document.createEvent('Event').timeStamp
    ) {
      // if the event timestamp, although evaluated AFTER the Date.now(), is
      // smaller than it, it means the event is using a hi-res timestamp,
      // and we need to use the hi-res version for event listener timestamps as
      // well.
      getNow = function () { return performance.now(); };
    }
  }

  /**
   * Flush both queues and run the watchers.
   */
  function flushSchedulerQueue () {
    currentFlushTimestamp = getNow();
    flushing = true;
    var watcher, id;

    // Sort queue before flush.
    // This ensures that:
    // 1. Components are updated from parent to child. (because parent is always
    //    created before the child)
    // 2. A component's user watchers are run before its render watcher (because
    //    user watchers are created before the render watcher)
    // 3. If a component is destroyed during a parent component's watcher run,
    //    its watchers can be skipped.
    queue.sort(function (a, b) { return a.id - b.id; });

    // do not cache length because more watchers might be pushed
    // as we run existing watchers
    for (index = 0; index < queue.length; index++) {
      watcher = queue[index];
      if (watcher.before) {
        watcher.before();
      }
      id = watcher.id;
      has[id] = null;
      watcher.run();
      // in dev build, check and stop circular updates.
      if ( has[id] != null) {
        circular[id] = (circular[id] || 0) + 1;
        if (circular[id] > MAX_UPDATE_COUNT) {
          warn(
            'You may have an infinite update loop ' + (
              watcher.user
                ? ("in watcher with expression \"" + (watcher.expression) + "\"")
                : "in a component render function."
            ),
            watcher.vm
          );
          break
        }
      }
    }

    // keep copies of post queues before resetting state
    var activatedQueue = activatedChildren.slice();
    var updatedQueue = queue.slice();

    resetSchedulerState();

    // call component updated and activated hooks
    callActivatedHooks(activatedQueue);
    callUpdatedHooks(updatedQueue);

    // devtool hook
    /* istanbul ignore if */
    if (devtools && config.devtools) {
      devtools.emit('flush');
    }
  }

  function callUpdatedHooks (queue) {
    var i = queue.length;
    while (i--) {
      var watcher = queue[i];
      var vm = watcher.vm;
      if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'updated');
      }
    }
  }

  /**
   * Queue a kept-alive component that was activated during patch.
   * The queue will be processed after the entire tree has been patched.
   */
  function queueActivatedComponent (vm) {
    // setting _inactive to false here so that a render function can
    // rely on checking whether it's in an inactive tree (e.g. router-view)
    vm._inactive = false;
    activatedChildren.push(vm);
  }

  function callActivatedHooks (queue) {
    for (var i = 0; i < queue.length; i++) {
      queue[i]._inactive = true;
      activateChildComponent(queue[i], true /* true */);
    }
  }

  /**
   * Push a watcher into the watcher queue.
   * Jobs with duplicate IDs will be skipped unless it's
   * pushed when the queue is being flushed.
   */
  function queueWatcher (watcher) {
    var id = watcher.id;
    if (has[id] == null) {
      has[id] = true;
      if (!flushing) {
        queue.push(watcher);
      } else {
        // if already flushing, splice the watcher based on its id
        // if already past its id, it will be run next immediately.
        var i = queue.length - 1;
        while (i > index && queue[i].id > watcher.id) {
          i--;
        }
        queue.splice(i + 1, 0, watcher);
      }
      // queue the flush
      if (!waiting) {
        waiting = true;

        if ( !config.async) {
          flushSchedulerQueue();
          return
        }
        nextTick(flushSchedulerQueue);
      }
    }
  }

  /*  */



  var uid$2 = 0;

  /**
   * A watcher parses an expression, collects dependencies,
   * and fires callback when the expression value changes.
   * This is used for both the $watch() api and directives.
   */
  var Watcher = function Watcher (
    vm,
    expOrFn,
    cb,
    options,
    isRenderWatcher
  ) {
    this.vm = vm;
    if (isRenderWatcher) {
      vm._watcher = this;
    }
    vm._watchers.push(this);
    // options
    if (options) {
      this.deep = !!options.deep;
      this.user = !!options.user;
      this.lazy = !!options.lazy;
      this.sync = !!options.sync;
      this.before = options.before;
    } else {
      this.deep = this.user = this.lazy = this.sync = false;
    }
    this.cb = cb;
    this.id = ++uid$2; // uid for batching
    this.active = true;
    this.dirty = this.lazy; // for lazy watchers
    this.deps = [];
    this.newDeps = [];
    this.depIds = new _Set();
    this.newDepIds = new _Set();
    this.expression =  expOrFn.toString()
      ;
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn;
    } else {
      this.getter = parsePath(expOrFn);
      if (!this.getter) {
        this.getter = noop;
         warn(
          "Failed watching path: \"" + expOrFn + "\" " +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        );
      }
    }
    this.value = this.lazy
      ? undefined
      : this.get();
  };

  /**
   * Evaluate the getter, and re-collect dependencies.
   */
  Watcher.prototype.get = function get () {
    pushTarget(this);
    var value;
    var vm = this.vm;
    try {
      value = this.getter.call(vm, vm);
    } catch (e) {
      if (this.user) {
        handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value);
      }
      popTarget();
      this.cleanupDeps();
    }
    return value
  };

  /**
   * Add a dependency to this directive.
   */
  Watcher.prototype.addDep = function addDep (dep) {
    var id = dep.id;
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id);
      this.newDeps.push(dep);
      if (!this.depIds.has(id)) {
        dep.addSub(this);
      }
    }
  };

  /**
   * Clean up for dependency collection.
   */
  Watcher.prototype.cleanupDeps = function cleanupDeps () {
    var i = this.deps.length;
    while (i--) {
      var dep = this.deps[i];
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this);
      }
    }
    var tmp = this.depIds;
    this.depIds = this.newDepIds;
    this.newDepIds = tmp;
    this.newDepIds.clear();
    tmp = this.deps;
    this.deps = this.newDeps;
    this.newDeps = tmp;
    this.newDeps.length = 0;
  };

  /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   */
  Watcher.prototype.update = function update () {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true;
    } else if (this.sync) {
      this.run();
    } else {
      queueWatcher(this);
    }
  };

  /**
   * Scheduler job interface.
   * Will be called by the scheduler.
   */
  Watcher.prototype.run = function run () {
    if (this.active) {
      var value = this.get();
      if (
        value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        isObject(value) ||
        this.deep
      ) {
        // set new value
        var oldValue = this.value;
        this.value = value;
        if (this.user) {
          try {
            this.cb.call(this.vm, value, oldValue);
          } catch (e) {
            handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
          }
        } else {
          this.cb.call(this.vm, value, oldValue);
        }
      }
    }
  };

  /**
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   */
  Watcher.prototype.evaluate = function evaluate () {
    this.value = this.get();
    this.dirty = false;
  };

  /**
   * Depend on all deps collected by this watcher.
   */
  Watcher.prototype.depend = function depend () {
    var i = this.deps.length;
    while (i--) {
      this.deps[i].depend();
    }
  };

  /**
   * Remove self from all dependencies' subscriber list.
   */
  Watcher.prototype.teardown = function teardown () {
    if (this.active) {
      // remove self from vm's watcher list
      // this is a somewhat expensive operation so we skip it
      // if the vm is being destroyed.
      if (!this.vm._isBeingDestroyed) {
        remove(this.vm._watchers, this);
      }
      var i = this.deps.length;
      while (i--) {
        this.deps[i].removeSub(this);
      }
      this.active = false;
    }
  };

  /*  */

  var sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
  };

  function proxy (target, sourceKey, key) {
    sharedPropertyDefinition.get = function proxyGetter () {
      return this[sourceKey][key]
    };
    sharedPropertyDefinition.set = function proxySetter (val) {
      this[sourceKey][key] = val;
    };
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }

  function initState (vm) {
    vm._watchers = [];
    var opts = vm.$options;
    if (opts.props) { initProps(vm, opts.props); }
    if (opts.methods) { initMethods(vm, opts.methods); }
    if (opts.data) {
      initData(vm);
    } else {
      observe(vm._data = {}, true /* asRootData */);
    }
    if (opts.computed) { initComputed(vm, opts.computed); }
    if (opts.watch && opts.watch !== nativeWatch) {
      initWatch(vm, opts.watch);
    }
  }

  function initProps (vm, propsOptions) {
    var propsData = vm.$options.propsData || {};
    var props = vm._props = {};
    // cache prop keys so that future props updates can iterate using Array
    // instead of dynamic object key enumeration.
    var keys = vm.$options._propKeys = [];
    var isRoot = !vm.$parent;
    // root instance props should be converted
    if (!isRoot) {
      toggleObserving(false);
    }
    var loop = function ( key ) {
      keys.push(key);
      var value = validateProp(key, propsOptions, propsData, vm);
      /* istanbul ignore else */
      {
        var hyphenatedKey = hyphenate(key);
        if (isReservedAttribute(hyphenatedKey) ||
            config.isReservedAttr(hyphenatedKey)) {
          warn(
            ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
            vm
          );
        }
        defineReactive$$1(props, key, value, function () {
          if (!isRoot && !isUpdatingChildComponent) {
            warn(
              "Avoid mutating a prop directly since the value will be " +
              "overwritten whenever the parent component re-renders. " +
              "Instead, use a data or computed property based on the prop's " +
              "value. Prop being mutated: \"" + key + "\"",
              vm
            );
          }
        });
      }
      // static props are already proxied on the component's prototype
      // during Vue.extend(). We only need to proxy props defined at
      // instantiation here.
      if (!(key in vm)) {
        proxy(vm, "_props", key);
      }
    };

    for (var key in propsOptions) loop( key );
    toggleObserving(true);
  }

  function initData (vm) {
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function'
      ? getData(data, vm)
      : data || {};
    if (!isPlainObject(data)) {
      data = {};
       warn(
        'data functions should return an object:\n' +
        'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
        vm
      );
    }
    // proxy data on instance
    var keys = Object.keys(data);
    var props = vm.$options.props;
    var methods = vm.$options.methods;
    var i = keys.length;
    while (i--) {
      var key = keys[i];
      {
        if (methods && hasOwn(methods, key)) {
          warn(
            ("Method \"" + key + "\" has already been defined as a data property."),
            vm
          );
        }
      }
      if (props && hasOwn(props, key)) {
         warn(
          "The data property \"" + key + "\" is already declared as a prop. " +
          "Use prop default value instead.",
          vm
        );
      } else if (!isReserved(key)) {
        proxy(vm, "_data", key);
      }
    }
    // observe data
    observe(data, true /* asRootData */);
  }

  function getData (data, vm) {
    // #7573 disable dep collection when invoking data getters
    pushTarget();
    try {
      return data.call(vm, vm)
    } catch (e) {
      handleError(e, vm, "data()");
      return {}
    } finally {
      popTarget();
    }
  }

  var computedWatcherOptions = { lazy: true };

  function initComputed (vm, computed) {
    // $flow-disable-line
    var watchers = vm._computedWatchers = Object.create(null);
    // computed properties are just getters during SSR
    var isSSR = isServerRendering();

    for (var key in computed) {
      var userDef = computed[key];
      var getter = typeof userDef === 'function' ? userDef : userDef.get;
      if ( getter == null) {
        warn(
          ("Getter is missing for computed property \"" + key + "\"."),
          vm
        );
      }

      if (!isSSR) {
        // create internal watcher for the computed property.
        watchers[key] = new Watcher(
          vm,
          getter || noop,
          noop,
          computedWatcherOptions
        );
      }

      // component-defined computed properties are already defined on the
      // component prototype. We only need to define computed properties defined
      // at instantiation here.
      if (!(key in vm)) {
        defineComputed(vm, key, userDef);
      } else {
        if (key in vm.$data) {
          warn(("The computed property \"" + key + "\" is already defined in data."), vm);
        } else if (vm.$options.props && key in vm.$options.props) {
          warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
        }
      }
    }
  }

  function defineComputed (
    target,
    key,
    userDef
  ) {
    var shouldCache = !isServerRendering();
    if (typeof userDef === 'function') {
      sharedPropertyDefinition.get = shouldCache
        ? createComputedGetter(key)
        : createGetterInvoker(userDef);
      sharedPropertyDefinition.set = noop;
    } else {
      sharedPropertyDefinition.get = userDef.get
        ? shouldCache && userDef.cache !== false
          ? createComputedGetter(key)
          : createGetterInvoker(userDef.get)
        : noop;
      sharedPropertyDefinition.set = userDef.set || noop;
    }
    if (
        sharedPropertyDefinition.set === noop) {
      sharedPropertyDefinition.set = function () {
        warn(
          ("Computed property \"" + key + "\" was assigned to but it has no setter."),
          this
        );
      };
    }
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }

  function createComputedGetter (key) {
    return function computedGetter () {
      var watcher = this._computedWatchers && this._computedWatchers[key];
      if (watcher) {
        if (watcher.dirty) {
          watcher.evaluate();
        }
        if (Dep.target) {
          watcher.depend();
        }
        return watcher.value
      }
    }
  }

  function createGetterInvoker(fn) {
    return function computedGetter () {
      return fn.call(this, this)
    }
  }

  function initMethods (vm, methods) {
    var props = vm.$options.props;
    for (var key in methods) {
      {
        if (typeof methods[key] !== 'function') {
          warn(
            "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
            "Did you reference the function correctly?",
            vm
          );
        }
        if (props && hasOwn(props, key)) {
          warn(
            ("Method \"" + key + "\" has already been defined as a prop."),
            vm
          );
        }
        if ((key in vm) && isReserved(key)) {
          warn(
            "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
            "Avoid defining component methods that start with _ or $."
          );
        }
      }
      vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
    }
  }

  function initWatch (vm, watch) {
    for (var key in watch) {
      var handler = watch[key];
      if (Array.isArray(handler)) {
        for (var i = 0; i < handler.length; i++) {
          createWatcher(vm, key, handler[i]);
        }
      } else {
        createWatcher(vm, key, handler);
      }
    }
  }

  function createWatcher (
    vm,
    expOrFn,
    handler,
    options
  ) {
    if (isPlainObject(handler)) {
      options = handler;
      handler = handler.handler;
    }
    if (typeof handler === 'string') {
      handler = vm[handler];
    }
    return vm.$watch(expOrFn, handler, options)
  }

  function stateMixin (Vue) {
    // flow somehow has problems with directly declared definition object
    // when using Object.defineProperty, so we have to procedurally build up
    // the object here.
    var dataDef = {};
    dataDef.get = function () { return this._data };
    var propsDef = {};
    propsDef.get = function () { return this._props };
    {
      dataDef.set = function () {
        warn(
          'Avoid replacing instance root $data. ' +
          'Use nested data properties instead.',
          this
        );
      };
      propsDef.set = function () {
        warn("$props is readonly.", this);
      };
    }
    Object.defineProperty(Vue.prototype, '$data', dataDef);
    Object.defineProperty(Vue.prototype, '$props', propsDef);

    Vue.prototype.$set = set;
    Vue.prototype.$delete = del;

    Vue.prototype.$watch = function (
      expOrFn,
      cb,
      options
    ) {
      var vm = this;
      if (isPlainObject(cb)) {
        return createWatcher(vm, expOrFn, cb, options)
      }
      options = options || {};
      options.user = true;
      var watcher = new Watcher(vm, expOrFn, cb, options);
      if (options.immediate) {
        try {
          cb.call(vm, watcher.value);
        } catch (error) {
          handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
        }
      }
      return function unwatchFn () {
        watcher.teardown();
      }
    };
  }

  /*  */

  var uid$3 = 0;

  function initMixin (Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      // a uid
      vm._uid = uid$3++;

      var startTag, endTag;
      /* istanbul ignore if */
      if ( config.performance && mark) {
        startTag = "vue-perf-start:" + (vm._uid);
        endTag = "vue-perf-end:" + (vm._uid);
        mark(startTag);
      }

      // a flag to avoid this being observed
      vm._isVue = true;
      // merge options
      if (options && options._isComponent) {
        // optimize internal component instantiation
        // since dynamic options merging is pretty slow, and none of the
        // internal component options needs special treatment.
        initInternalComponent(vm, options);
      } else {
        vm.$options = mergeOptions(
          resolveConstructorOptions(vm.constructor),
          options || {},
          vm
        );
      }
      /* istanbul ignore else */
      {
        initProxy(vm);
      }
      // expose real self
      vm._self = vm;
      initLifecycle(vm);
      initEvents(vm);
      initRender(vm);
      callHook(vm, 'beforeCreate');
      initInjections(vm); // resolve injections before data/props
      initState(vm);
      initProvide(vm); // resolve provide after data/props
      callHook(vm, 'created');

      /* istanbul ignore if */
      if ( config.performance && mark) {
        vm._name = formatComponentName(vm, false);
        mark(endTag);
        measure(("vue " + (vm._name) + " init"), startTag, endTag);
      }

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };
  }

  function initInternalComponent (vm, options) {
    var opts = vm.$options = Object.create(vm.constructor.options);
    // doing this because it's faster than dynamic enumeration.
    var parentVnode = options._parentVnode;
    opts.parent = options.parent;
    opts._parentVnode = parentVnode;

    var vnodeComponentOptions = parentVnode.componentOptions;
    opts.propsData = vnodeComponentOptions.propsData;
    opts._parentListeners = vnodeComponentOptions.listeners;
    opts._renderChildren = vnodeComponentOptions.children;
    opts._componentTag = vnodeComponentOptions.tag;

    if (options.render) {
      opts.render = options.render;
      opts.staticRenderFns = options.staticRenderFns;
    }
  }

  function resolveConstructorOptions (Ctor) {
    var options = Ctor.options;
    if (Ctor.super) {
      var superOptions = resolveConstructorOptions(Ctor.super);
      var cachedSuperOptions = Ctor.superOptions;
      if (superOptions !== cachedSuperOptions) {
        // super option changed,
        // need to resolve new options.
        Ctor.superOptions = superOptions;
        // check if there are any late-modified/attached options (#4976)
        var modifiedOptions = resolveModifiedOptions(Ctor);
        // update base extend options
        if (modifiedOptions) {
          extend(Ctor.extendOptions, modifiedOptions);
        }
        options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
        if (options.name) {
          options.components[options.name] = Ctor;
        }
      }
    }
    return options
  }

  function resolveModifiedOptions (Ctor) {
    var modified;
    var latest = Ctor.options;
    var sealed = Ctor.sealedOptions;
    for (var key in latest) {
      if (latest[key] !== sealed[key]) {
        if (!modified) { modified = {}; }
        modified[key] = latest[key];
      }
    }
    return modified
  }

  function Vue (options) {
    if (
      !(this instanceof Vue)
    ) {
      warn('Vue is a constructor and should be called with the `new` keyword');
    }
    this._init(options);
  }

  initMixin(Vue);
  stateMixin(Vue);
  eventsMixin(Vue);
  lifecycleMixin(Vue);
  renderMixin(Vue);

  /*  */

  function initUse (Vue) {
    Vue.use = function (plugin) {
      var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
      if (installedPlugins.indexOf(plugin) > -1) {
        return this
      }

      // additional parameters
      var args = toArray(arguments, 1);
      args.unshift(this);
      if (typeof plugin.install === 'function') {
        plugin.install.apply(plugin, args);
      } else if (typeof plugin === 'function') {
        plugin.apply(null, args);
      }
      installedPlugins.push(plugin);
      return this
    };
  }

  /*  */

  function initMixin$1 (Vue) {
    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin);
      return this
    };
  }

  /*  */

  function initExtend (Vue) {
    /**
     * Each instance constructor, including Vue, has a unique
     * cid. This enables us to create wrapped "child
     * constructors" for prototypal inheritance and cache them.
     */
    Vue.cid = 0;
    var cid = 1;

    /**
     * Class inheritance
     */
    Vue.extend = function (extendOptions) {
      extendOptions = extendOptions || {};
      var Super = this;
      var SuperId = Super.cid;
      var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
      if (cachedCtors[SuperId]) {
        return cachedCtors[SuperId]
      }

      var name = extendOptions.name || Super.options.name;
      if ( name) {
        validateComponentName(name);
      }

      var Sub = function VueComponent (options) {
        this._init(options);
      };
      Sub.prototype = Object.create(Super.prototype);
      Sub.prototype.constructor = Sub;
      Sub.cid = cid++;
      Sub.options = mergeOptions(
        Super.options,
        extendOptions
      );
      Sub['super'] = Super;

      // For props and computed properties, we define the proxy getters on
      // the Vue instances at extension time, on the extended prototype. This
      // avoids Object.defineProperty calls for each instance created.
      if (Sub.options.props) {
        initProps$1(Sub);
      }
      if (Sub.options.computed) {
        initComputed$1(Sub);
      }

      // allow further extension/mixin/plugin usage
      Sub.extend = Super.extend;
      Sub.mixin = Super.mixin;
      Sub.use = Super.use;

      // create asset registers, so extended classes
      // can have their private assets too.
      ASSET_TYPES.forEach(function (type) {
        Sub[type] = Super[type];
      });
      // enable recursive self-lookup
      if (name) {
        Sub.options.components[name] = Sub;
      }

      // keep a reference to the super options at extension time.
      // later at instantiation we can check if Super's options have
      // been updated.
      Sub.superOptions = Super.options;
      Sub.extendOptions = extendOptions;
      Sub.sealedOptions = extend({}, Sub.options);

      // cache constructor
      cachedCtors[SuperId] = Sub;
      return Sub
    };
  }

  function initProps$1 (Comp) {
    var props = Comp.options.props;
    for (var key in props) {
      proxy(Comp.prototype, "_props", key);
    }
  }

  function initComputed$1 (Comp) {
    var computed = Comp.options.computed;
    for (var key in computed) {
      defineComputed(Comp.prototype, key, computed[key]);
    }
  }

  /*  */

  function initAssetRegisters (Vue) {
    /**
     * Create asset registration methods.
     */
    ASSET_TYPES.forEach(function (type) {
      Vue[type] = function (
        id,
        definition
      ) {
        if (!definition) {
          return this.options[type + 's'][id]
        } else {
          /* istanbul ignore if */
          if ( type === 'component') {
            validateComponentName(id);
          }
          if (type === 'component' && isPlainObject(definition)) {
            definition.name = definition.name || id;
            definition = this.options._base.extend(definition);
          }
          if (type === 'directive' && typeof definition === 'function') {
            definition = { bind: definition, update: definition };
          }
          this.options[type + 's'][id] = definition;
          return definition
        }
      };
    });
  }

  /*  */



  function getComponentName (opts) {
    return opts && (opts.Ctor.options.name || opts.tag)
  }

  function matches (pattern, name) {
    if (Array.isArray(pattern)) {
      return pattern.indexOf(name) > -1
    } else if (typeof pattern === 'string') {
      return pattern.split(',').indexOf(name) > -1
    } else if (isRegExp(pattern)) {
      return pattern.test(name)
    }
    /* istanbul ignore next */
    return false
  }

  function pruneCache (keepAliveInstance, filter) {
    var cache = keepAliveInstance.cache;
    var keys = keepAliveInstance.keys;
    var _vnode = keepAliveInstance._vnode;
    for (var key in cache) {
      var cachedNode = cache[key];
      if (cachedNode) {
        var name = getComponentName(cachedNode.componentOptions);
        if (name && !filter(name)) {
          pruneCacheEntry(cache, key, keys, _vnode);
        }
      }
    }
  }

  function pruneCacheEntry (
    cache,
    key,
    keys,
    current
  ) {
    var cached$$1 = cache[key];
    if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
      cached$$1.componentInstance.$destroy();
    }
    cache[key] = null;
    remove(keys, key);
  }

  var patternTypes = [String, RegExp, Array];

  var KeepAlive = {
    name: 'keep-alive',
    abstract: true,

    props: {
      include: patternTypes,
      exclude: patternTypes,
      max: [String, Number]
    },

    created: function created () {
      this.cache = Object.create(null);
      this.keys = [];
    },

    destroyed: function destroyed () {
      for (var key in this.cache) {
        pruneCacheEntry(this.cache, key, this.keys);
      }
    },

    mounted: function mounted () {
      var this$1 = this;

      this.$watch('include', function (val) {
        pruneCache(this$1, function (name) { return matches(val, name); });
      });
      this.$watch('exclude', function (val) {
        pruneCache(this$1, function (name) { return !matches(val, name); });
      });
    },

    render: function render () {
      var slot = this.$slots.default;
      var vnode = getFirstComponentChild(slot);
      var componentOptions = vnode && vnode.componentOptions;
      if (componentOptions) {
        // check pattern
        var name = getComponentName(componentOptions);
        var ref = this;
        var include = ref.include;
        var exclude = ref.exclude;
        if (
          // not included
          (include && (!name || !matches(include, name))) ||
          // excluded
          (exclude && name && matches(exclude, name))
        ) {
          return vnode
        }

        var ref$1 = this;
        var cache = ref$1.cache;
        var keys = ref$1.keys;
        var key = vnode.key == null
          // same constructor may get registered as different local components
          // so cid alone is not enough (#3269)
          ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
          : vnode.key;
        if (cache[key]) {
          vnode.componentInstance = cache[key].componentInstance;
          // make current key freshest
          remove(keys, key);
          keys.push(key);
        } else {
          cache[key] = vnode;
          keys.push(key);
          // prune oldest entry
          if (this.max && keys.length > parseInt(this.max)) {
            pruneCacheEntry(cache, keys[0], keys, this._vnode);
          }
        }

        vnode.data.keepAlive = true;
      }
      return vnode || (slot && slot[0])
    }
  };

  var builtInComponents = {
    KeepAlive: KeepAlive
  };

  /*  */

  function initGlobalAPI (Vue) {
    // config
    var configDef = {};
    configDef.get = function () { return config; };
    {
      configDef.set = function () {
        warn(
          'Do not replace the Vue.config object, set individual fields instead.'
        );
      };
    }
    Object.defineProperty(Vue, 'config', configDef);

    // exposed util methods.
    // NOTE: these are not considered part of the public API - avoid relying on
    // them unless you are aware of the risk.
    Vue.util = {
      warn: warn,
      extend: extend,
      mergeOptions: mergeOptions,
      defineReactive: defineReactive$$1
    };

    Vue.set = set;
    Vue.delete = del;
    Vue.nextTick = nextTick;

    // 2.6 explicit observable API
    Vue.observable = function (obj) {
      observe(obj);
      return obj
    };

    Vue.options = Object.create(null);
    ASSET_TYPES.forEach(function (type) {
      Vue.options[type + 's'] = Object.create(null);
    });

    // this is used to identify the "base" constructor to extend all plain-object
    // components with in Weex's multi-instance scenarios.
    Vue.options._base = Vue;

    extend(Vue.options.components, builtInComponents);

    initUse(Vue);
    initMixin$1(Vue);
    initExtend(Vue);
    initAssetRegisters(Vue);
  }

  initGlobalAPI(Vue);

  Object.defineProperty(Vue.prototype, '$isServer', {
    get: isServerRendering
  });

  Object.defineProperty(Vue.prototype, '$ssrContext', {
    get: function get () {
      /* istanbul ignore next */
      return this.$vnode && this.$vnode.ssrContext
    }
  });

  // expose FunctionalRenderContext for ssr runtime helper installation
  Object.defineProperty(Vue, 'FunctionalRenderContext', {
    value: FunctionalRenderContext
  });

  Vue.version = '2.6.11';

  /*  */

  // these are reserved for web because they are directly compiled away
  // during template compilation
  var isReservedAttr = makeMap('style,class');

  // attributes that should be using props for binding
  var acceptValue = makeMap('input,textarea,option,select,progress');
  var mustUseProp = function (tag, type, attr) {
    return (
      (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
      (attr === 'selected' && tag === 'option') ||
      (attr === 'checked' && tag === 'input') ||
      (attr === 'muted' && tag === 'video')
    )
  };

  var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

  var isValidContentEditableValue = makeMap('events,caret,typing,plaintext-only');

  var convertEnumeratedValue = function (key, value) {
    return isFalsyAttrValue(value) || value === 'false'
      ? 'false'
      // allow arbitrary string value for contenteditable
      : key === 'contenteditable' && isValidContentEditableValue(value)
        ? value
        : 'true'
  };

  var isBooleanAttr = makeMap(
    'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
    'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
    'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
    'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
    'required,reversed,scoped,seamless,selected,sortable,translate,' +
    'truespeed,typemustmatch,visible'
  );

  var xlinkNS = 'http://www.w3.org/1999/xlink';

  var isXlink = function (name) {
    return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
  };

  var getXlinkProp = function (name) {
    return isXlink(name) ? name.slice(6, name.length) : ''
  };

  var isFalsyAttrValue = function (val) {
    return val == null || val === false
  };

  /*  */

  function genClassForVnode (vnode) {
    var data = vnode.data;
    var parentNode = vnode;
    var childNode = vnode;
    while (isDef(childNode.componentInstance)) {
      childNode = childNode.componentInstance._vnode;
      if (childNode && childNode.data) {
        data = mergeClassData(childNode.data, data);
      }
    }
    while (isDef(parentNode = parentNode.parent)) {
      if (parentNode && parentNode.data) {
        data = mergeClassData(data, parentNode.data);
      }
    }
    return renderClass(data.staticClass, data.class)
  }

  function mergeClassData (child, parent) {
    return {
      staticClass: concat(child.staticClass, parent.staticClass),
      class: isDef(child.class)
        ? [child.class, parent.class]
        : parent.class
    }
  }

  function renderClass (
    staticClass,
    dynamicClass
  ) {
    if (isDef(staticClass) || isDef(dynamicClass)) {
      return concat(staticClass, stringifyClass(dynamicClass))
    }
    /* istanbul ignore next */
    return ''
  }

  function concat (a, b) {
    return a ? b ? (a + ' ' + b) : a : (b || '')
  }

  function stringifyClass (value) {
    if (Array.isArray(value)) {
      return stringifyArray(value)
    }
    if (isObject(value)) {
      return stringifyObject(value)
    }
    if (typeof value === 'string') {
      return value
    }
    /* istanbul ignore next */
    return ''
  }

  function stringifyArray (value) {
    var res = '';
    var stringified;
    for (var i = 0, l = value.length; i < l; i++) {
      if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
        if (res) { res += ' '; }
        res += stringified;
      }
    }
    return res
  }

  function stringifyObject (value) {
    var res = '';
    for (var key in value) {
      if (value[key]) {
        if (res) { res += ' '; }
        res += key;
      }
    }
    return res
  }

  /*  */

  var namespaceMap = {
    svg: 'http://www.w3.org/2000/svg',
    math: 'http://www.w3.org/1998/Math/MathML'
  };

  var isHTMLTag = makeMap(
    'html,body,base,head,link,meta,style,title,' +
    'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
    'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
    'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
    's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
    'embed,object,param,source,canvas,script,noscript,del,ins,' +
    'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
    'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
    'output,progress,select,textarea,' +
    'details,dialog,menu,menuitem,summary,' +
    'content,element,shadow,template,blockquote,iframe,tfoot'
  );

  // this map is intentionally selective, only covering SVG elements that may
  // contain child elements.
  var isSVG = makeMap(
    'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
    'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
    'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
    true
  );

  var isReservedTag = function (tag) {
    return isHTMLTag(tag) || isSVG(tag)
  };

  function getTagNamespace (tag) {
    if (isSVG(tag)) {
      return 'svg'
    }
    // basic support for MathML
    // note it doesn't support other MathML elements being component roots
    if (tag === 'math') {
      return 'math'
    }
  }

  var unknownElementCache = Object.create(null);
  function isUnknownElement (tag) {
    /* istanbul ignore if */
    if (!inBrowser) {
      return true
    }
    if (isReservedTag(tag)) {
      return false
    }
    tag = tag.toLowerCase();
    /* istanbul ignore if */
    if (unknownElementCache[tag] != null) {
      return unknownElementCache[tag]
    }
    var el = document.createElement(tag);
    if (tag.indexOf('-') > -1) {
      // http://stackoverflow.com/a/28210364/1070244
      return (unknownElementCache[tag] = (
        el.constructor === window.HTMLUnknownElement ||
        el.constructor === window.HTMLElement
      ))
    } else {
      return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
    }
  }

  var isTextInputType = makeMap('text,number,password,search,email,tel,url');

  /*  */

  /**
   * Query an element selector if it's not an element already.
   */
  function query (el) {
    if (typeof el === 'string') {
      var selected = document.querySelector(el);
      if (!selected) {
         warn(
          'Cannot find element: ' + el
        );
        return document.createElement('div')
      }
      return selected
    } else {
      return el
    }
  }

  /*  */

  function createElement$1 (tagName, vnode) {
    var elm = document.createElement(tagName);
    if (tagName !== 'select') {
      return elm
    }
    // false or null will remove the attribute but undefined will not
    if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
      elm.setAttribute('multiple', 'multiple');
    }
    return elm
  }

  function createElementNS (namespace, tagName) {
    return document.createElementNS(namespaceMap[namespace], tagName)
  }

  function createTextNode (text) {
    return document.createTextNode(text)
  }

  function createComment (text) {
    return document.createComment(text)
  }

  function insertBefore (parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
  }

  function removeChild (node, child) {
    node.removeChild(child);
  }

  function appendChild (node, child) {
    node.appendChild(child);
  }

  function parentNode (node) {
    return node.parentNode
  }

  function nextSibling (node) {
    return node.nextSibling
  }

  function tagName (node) {
    return node.tagName
  }

  function setTextContent (node, text) {
    node.textContent = text;
  }

  function setStyleScope (node, scopeId) {
    node.setAttribute(scopeId, '');
  }

  var nodeOps = /*#__PURE__*/Object.freeze({
    createElement: createElement$1,
    createElementNS: createElementNS,
    createTextNode: createTextNode,
    createComment: createComment,
    insertBefore: insertBefore,
    removeChild: removeChild,
    appendChild: appendChild,
    parentNode: parentNode,
    nextSibling: nextSibling,
    tagName: tagName,
    setTextContent: setTextContent,
    setStyleScope: setStyleScope
  });

  /*  */

  var ref = {
    create: function create (_, vnode) {
      registerRef(vnode);
    },
    update: function update (oldVnode, vnode) {
      if (oldVnode.data.ref !== vnode.data.ref) {
        registerRef(oldVnode, true);
        registerRef(vnode);
      }
    },
    destroy: function destroy (vnode) {
      registerRef(vnode, true);
    }
  };

  function registerRef (vnode, isRemoval) {
    var key = vnode.data.ref;
    if (!isDef(key)) { return }

    var vm = vnode.context;
    var ref = vnode.componentInstance || vnode.elm;
    var refs = vm.$refs;
    if (isRemoval) {
      if (Array.isArray(refs[key])) {
        remove(refs[key], ref);
      } else if (refs[key] === ref) {
        refs[key] = undefined;
      }
    } else {
      if (vnode.data.refInFor) {
        if (!Array.isArray(refs[key])) {
          refs[key] = [ref];
        } else if (refs[key].indexOf(ref) < 0) {
          // $flow-disable-line
          refs[key].push(ref);
        }
      } else {
        refs[key] = ref;
      }
    }
  }

  /**
   * Virtual DOM patching algorithm based on Snabbdom by
   * Simon Friis Vindum (@paldepind)
   * Licensed under the MIT License
   * https://github.com/paldepind/snabbdom/blob/master/LICENSE
   *
   * modified by Evan You (@yyx990803)
   *
   * Not type-checking this because this file is perf-critical and the cost
   * of making flow understand it is not worth it.
   */

  var emptyNode = new VNode('', {}, []);

  var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

  function sameVnode (a, b) {
    return (
      a.key === b.key && (
        (
          a.tag === b.tag &&
          a.isComment === b.isComment &&
          isDef(a.data) === isDef(b.data) &&
          sameInputType(a, b)
        ) || (
          isTrue(a.isAsyncPlaceholder) &&
          a.asyncFactory === b.asyncFactory &&
          isUndef(b.asyncFactory.error)
        )
      )
    )
  }

  function sameInputType (a, b) {
    if (a.tag !== 'input') { return true }
    var i;
    var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
    var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
    return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
  }

  function createKeyToOldIdx (children, beginIdx, endIdx) {
    var i, key;
    var map = {};
    for (i = beginIdx; i <= endIdx; ++i) {
      key = children[i].key;
      if (isDef(key)) { map[key] = i; }
    }
    return map
  }

  function createPatchFunction (backend) {
    var i, j;
    var cbs = {};

    var modules = backend.modules;
    var nodeOps = backend.nodeOps;

    for (i = 0; i < hooks.length; ++i) {
      cbs[hooks[i]] = [];
      for (j = 0; j < modules.length; ++j) {
        if (isDef(modules[j][hooks[i]])) {
          cbs[hooks[i]].push(modules[j][hooks[i]]);
        }
      }
    }

    function emptyNodeAt (elm) {
      return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
    }

    function createRmCb (childElm, listeners) {
      function remove$$1 () {
        if (--remove$$1.listeners === 0) {
          removeNode(childElm);
        }
      }
      remove$$1.listeners = listeners;
      return remove$$1
    }

    function removeNode (el) {
      var parent = nodeOps.parentNode(el);
      // element may have already been removed due to v-html / v-text
      if (isDef(parent)) {
        nodeOps.removeChild(parent, el);
      }
    }

    function isUnknownElement$$1 (vnode, inVPre) {
      return (
        !inVPre &&
        !vnode.ns &&
        !(
          config.ignoredElements.length &&
          config.ignoredElements.some(function (ignore) {
            return isRegExp(ignore)
              ? ignore.test(vnode.tag)
              : ignore === vnode.tag
          })
        ) &&
        config.isUnknownElement(vnode.tag)
      )
    }

    var creatingElmInVPre = 0;

    function createElm (
      vnode,
      insertedVnodeQueue,
      parentElm,
      refElm,
      nested,
      ownerArray,
      index
    ) {
      if (isDef(vnode.elm) && isDef(ownerArray)) {
        // This vnode was used in a previous render!
        // now it's used as a new node, overwriting its elm would cause
        // potential patch errors down the road when it's used as an insertion
        // reference node. Instead, we clone the node on-demand before creating
        // associated DOM element for it.
        vnode = ownerArray[index] = cloneVNode(vnode);
      }

      vnode.isRootInsert = !nested; // for transition enter check
      if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
        return
      }

      var data = vnode.data;
      var children = vnode.children;
      var tag = vnode.tag;
      if (isDef(tag)) {
        {
          if (data && data.pre) {
            creatingElmInVPre++;
          }
          if (isUnknownElement$$1(vnode, creatingElmInVPre)) {
            warn(
              'Unknown custom element: <' + tag + '> - did you ' +
              'register the component correctly? For recursive components, ' +
              'make sure to provide the "name" option.',
              vnode.context
            );
          }
        }

        vnode.elm = vnode.ns
          ? nodeOps.createElementNS(vnode.ns, tag)
          : nodeOps.createElement(tag, vnode);
        setScope(vnode);

        /* istanbul ignore if */
        {
          createChildren(vnode, children, insertedVnodeQueue);
          if (isDef(data)) {
            invokeCreateHooks(vnode, insertedVnodeQueue);
          }
          insert(parentElm, vnode.elm, refElm);
        }

        if ( data && data.pre) {
          creatingElmInVPre--;
        }
      } else if (isTrue(vnode.isComment)) {
        vnode.elm = nodeOps.createComment(vnode.text);
        insert(parentElm, vnode.elm, refElm);
      } else {
        vnode.elm = nodeOps.createTextNode(vnode.text);
        insert(parentElm, vnode.elm, refElm);
      }
    }

    function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
      var i = vnode.data;
      if (isDef(i)) {
        var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
        if (isDef(i = i.hook) && isDef(i = i.init)) {
          i(vnode, false /* hydrating */);
        }
        // after calling the init hook, if the vnode is a child component
        // it should've created a child instance and mounted it. the child
        // component also has set the placeholder vnode's elm.
        // in that case we can just return the element and be done.
        if (isDef(vnode.componentInstance)) {
          initComponent(vnode, insertedVnodeQueue);
          insert(parentElm, vnode.elm, refElm);
          if (isTrue(isReactivated)) {
            reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
          }
          return true
        }
      }
    }

    function initComponent (vnode, insertedVnodeQueue) {
      if (isDef(vnode.data.pendingInsert)) {
        insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
        vnode.data.pendingInsert = null;
      }
      vnode.elm = vnode.componentInstance.$el;
      if (isPatchable(vnode)) {
        invokeCreateHooks(vnode, insertedVnodeQueue);
        setScope(vnode);
      } else {
        // empty component root.
        // skip all element-related modules except for ref (#3455)
        registerRef(vnode);
        // make sure to invoke the insert hook
        insertedVnodeQueue.push(vnode);
      }
    }

    function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
      var i;
      // hack for #4339: a reactivated component with inner transition
      // does not trigger because the inner node's created hooks are not called
      // again. It's not ideal to involve module-specific logic in here but
      // there doesn't seem to be a better way to do it.
      var innerNode = vnode;
      while (innerNode.componentInstance) {
        innerNode = innerNode.componentInstance._vnode;
        if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
          for (i = 0; i < cbs.activate.length; ++i) {
            cbs.activate[i](emptyNode, innerNode);
          }
          insertedVnodeQueue.push(innerNode);
          break
        }
      }
      // unlike a newly created component,
      // a reactivated keep-alive component doesn't insert itself
      insert(parentElm, vnode.elm, refElm);
    }

    function insert (parent, elm, ref$$1) {
      if (isDef(parent)) {
        if (isDef(ref$$1)) {
          if (nodeOps.parentNode(ref$$1) === parent) {
            nodeOps.insertBefore(parent, elm, ref$$1);
          }
        } else {
          nodeOps.appendChild(parent, elm);
        }
      }
    }

    function createChildren (vnode, children, insertedVnodeQueue) {
      if (Array.isArray(children)) {
        {
          checkDuplicateKeys(children);
        }
        for (var i = 0; i < children.length; ++i) {
          createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i);
        }
      } else if (isPrimitive(vnode.text)) {
        nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
      }
    }

    function isPatchable (vnode) {
      while (vnode.componentInstance) {
        vnode = vnode.componentInstance._vnode;
      }
      return isDef(vnode.tag)
    }

    function invokeCreateHooks (vnode, insertedVnodeQueue) {
      for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
        cbs.create[i$1](emptyNode, vnode);
      }
      i = vnode.data.hook; // Reuse variable
      if (isDef(i)) {
        if (isDef(i.create)) { i.create(emptyNode, vnode); }
        if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
      }
    }

    // set scope id attribute for scoped CSS.
    // this is implemented as a special case to avoid the overhead
    // of going through the normal attribute patching process.
    function setScope (vnode) {
      var i;
      if (isDef(i = vnode.fnScopeId)) {
        nodeOps.setStyleScope(vnode.elm, i);
      } else {
        var ancestor = vnode;
        while (ancestor) {
          if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
            nodeOps.setStyleScope(vnode.elm, i);
          }
          ancestor = ancestor.parent;
        }
      }
      // for slot content they should also get the scopeId from the host instance.
      if (isDef(i = activeInstance) &&
        i !== vnode.context &&
        i !== vnode.fnContext &&
        isDef(i = i.$options._scopeId)
      ) {
        nodeOps.setStyleScope(vnode.elm, i);
      }
    }

    function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
      for (; startIdx <= endIdx; ++startIdx) {
        createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx);
      }
    }

    function invokeDestroyHook (vnode) {
      var i, j;
      var data = vnode.data;
      if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
        for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
      }
      if (isDef(i = vnode.children)) {
        for (j = 0; j < vnode.children.length; ++j) {
          invokeDestroyHook(vnode.children[j]);
        }
      }
    }

    function removeVnodes (vnodes, startIdx, endIdx) {
      for (; startIdx <= endIdx; ++startIdx) {
        var ch = vnodes[startIdx];
        if (isDef(ch)) {
          if (isDef(ch.tag)) {
            removeAndInvokeRemoveHook(ch);
            invokeDestroyHook(ch);
          } else { // Text node
            removeNode(ch.elm);
          }
        }
      }
    }

    function removeAndInvokeRemoveHook (vnode, rm) {
      if (isDef(rm) || isDef(vnode.data)) {
        var i;
        var listeners = cbs.remove.length + 1;
        if (isDef(rm)) {
          // we have a recursively passed down rm callback
          // increase the listeners count
          rm.listeners += listeners;
        } else {
          // directly removing
          rm = createRmCb(vnode.elm, listeners);
        }
        // recursively invoke hooks on child component root node
        if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
          removeAndInvokeRemoveHook(i, rm);
        }
        for (i = 0; i < cbs.remove.length; ++i) {
          cbs.remove[i](vnode, rm);
        }
        if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
          i(vnode, rm);
        } else {
          rm();
        }
      } else {
        removeNode(vnode.elm);
      }
    }

    function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
      var oldStartIdx = 0;
      var newStartIdx = 0;
      var oldEndIdx = oldCh.length - 1;
      var oldStartVnode = oldCh[0];
      var oldEndVnode = oldCh[oldEndIdx];
      var newEndIdx = newCh.length - 1;
      var newStartVnode = newCh[0];
      var newEndVnode = newCh[newEndIdx];
      var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

      // removeOnly is a special flag used only by <transition-group>
      // to ensure removed elements stay in correct relative positions
      // during leaving transitions
      var canMove = !removeOnly;

      {
        checkDuplicateKeys(newCh);
      }

      while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (isUndef(oldStartVnode)) {
          oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
        } else if (isUndef(oldEndVnode)) {
          oldEndVnode = oldCh[--oldEndIdx];
        } else if (sameVnode(oldStartVnode, newStartVnode)) {
          patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
          oldStartVnode = oldCh[++oldStartIdx];
          newStartVnode = newCh[++newStartIdx];
        } else if (sameVnode(oldEndVnode, newEndVnode)) {
          patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
          oldEndVnode = oldCh[--oldEndIdx];
          newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
          patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
          canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
          oldStartVnode = oldCh[++oldStartIdx];
          newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
          patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
          canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
          oldEndVnode = oldCh[--oldEndIdx];
          newStartVnode = newCh[++newStartIdx];
        } else {
          if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
          idxInOld = isDef(newStartVnode.key)
            ? oldKeyToIdx[newStartVnode.key]
            : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
          if (isUndef(idxInOld)) { // New element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
          } else {
            vnodeToMove = oldCh[idxInOld];
            if (sameVnode(vnodeToMove, newStartVnode)) {
              patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
              oldCh[idxInOld] = undefined;
              canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
            } else {
              // same key but different element. treat as new element
              createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
            }
          }
          newStartVnode = newCh[++newStartIdx];
        }
      }
      if (oldStartIdx > oldEndIdx) {
        refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
        addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
      } else if (newStartIdx > newEndIdx) {
        removeVnodes(oldCh, oldStartIdx, oldEndIdx);
      }
    }

    function checkDuplicateKeys (children) {
      var seenKeys = {};
      for (var i = 0; i < children.length; i++) {
        var vnode = children[i];
        var key = vnode.key;
        if (isDef(key)) {
          if (seenKeys[key]) {
            warn(
              ("Duplicate keys detected: '" + key + "'. This may cause an update error."),
              vnode.context
            );
          } else {
            seenKeys[key] = true;
          }
        }
      }
    }

    function findIdxInOld (node, oldCh, start, end) {
      for (var i = start; i < end; i++) {
        var c = oldCh[i];
        if (isDef(c) && sameVnode(node, c)) { return i }
      }
    }

    function patchVnode (
      oldVnode,
      vnode,
      insertedVnodeQueue,
      ownerArray,
      index,
      removeOnly
    ) {
      if (oldVnode === vnode) {
        return
      }

      if (isDef(vnode.elm) && isDef(ownerArray)) {
        // clone reused vnode
        vnode = ownerArray[index] = cloneVNode(vnode);
      }

      var elm = vnode.elm = oldVnode.elm;

      if (isTrue(oldVnode.isAsyncPlaceholder)) {
        if (isDef(vnode.asyncFactory.resolved)) {
          hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
        } else {
          vnode.isAsyncPlaceholder = true;
        }
        return
      }

      // reuse element for static trees.
      // note we only do this if the vnode is cloned -
      // if the new node is not cloned it means the render functions have been
      // reset by the hot-reload-api and we need to do a proper re-render.
      if (isTrue(vnode.isStatic) &&
        isTrue(oldVnode.isStatic) &&
        vnode.key === oldVnode.key &&
        (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
      ) {
        vnode.componentInstance = oldVnode.componentInstance;
        return
      }

      var i;
      var data = vnode.data;
      if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
        i(oldVnode, vnode);
      }

      var oldCh = oldVnode.children;
      var ch = vnode.children;
      if (isDef(data) && isPatchable(vnode)) {
        for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
        if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
      }
      if (isUndef(vnode.text)) {
        if (isDef(oldCh) && isDef(ch)) {
          if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
        } else if (isDef(ch)) {
          {
            checkDuplicateKeys(ch);
          }
          if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
          addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
        } else if (isDef(oldCh)) {
          removeVnodes(oldCh, 0, oldCh.length - 1);
        } else if (isDef(oldVnode.text)) {
          nodeOps.setTextContent(elm, '');
        }
      } else if (oldVnode.text !== vnode.text) {
        nodeOps.setTextContent(elm, vnode.text);
      }
      if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
      }
    }

    function invokeInsertHook (vnode, queue, initial) {
      // delay insert hooks for component root nodes, invoke them after the
      // element is really inserted
      if (isTrue(initial) && isDef(vnode.parent)) {
        vnode.parent.data.pendingInsert = queue;
      } else {
        for (var i = 0; i < queue.length; ++i) {
          queue[i].data.hook.insert(queue[i]);
        }
      }
    }

    var hydrationBailed = false;
    // list of modules that can skip create hook during hydration because they
    // are already rendered on the client or has no need for initialization
    // Note: style is excluded because it relies on initial clone for future
    // deep updates (#7063).
    var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');

    // Note: this is a browser-only function so we can assume elms are DOM nodes.
    function hydrate (elm, vnode, insertedVnodeQueue, inVPre) {
      var i;
      var tag = vnode.tag;
      var data = vnode.data;
      var children = vnode.children;
      inVPre = inVPre || (data && data.pre);
      vnode.elm = elm;

      if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
        vnode.isAsyncPlaceholder = true;
        return true
      }
      // assert node match
      {
        if (!assertNodeMatch(elm, vnode, inVPre)) {
          return false
        }
      }
      if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
        if (isDef(i = vnode.componentInstance)) {
          // child component. it should have hydrated its own tree.
          initComponent(vnode, insertedVnodeQueue);
          return true
        }
      }
      if (isDef(tag)) {
        if (isDef(children)) {
          // empty element, allow client to pick up and populate children
          if (!elm.hasChildNodes()) {
            createChildren(vnode, children, insertedVnodeQueue);
          } else {
            // v-html and domProps: innerHTML
            if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
              if (i !== elm.innerHTML) {
                /* istanbul ignore if */
                if (
                  typeof console !== 'undefined' &&
                  !hydrationBailed
                ) {
                  hydrationBailed = true;
                  console.warn('Parent: ', elm);
                  console.warn('server innerHTML: ', i);
                  console.warn('client innerHTML: ', elm.innerHTML);
                }
                return false
              }
            } else {
              // iterate and compare children lists
              var childrenMatch = true;
              var childNode = elm.firstChild;
              for (var i$1 = 0; i$1 < children.length; i$1++) {
                if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
                  childrenMatch = false;
                  break
                }
                childNode = childNode.nextSibling;
              }
              // if childNode is not null, it means the actual childNodes list is
              // longer than the virtual children list.
              if (!childrenMatch || childNode) {
                /* istanbul ignore if */
                if (
                  typeof console !== 'undefined' &&
                  !hydrationBailed
                ) {
                  hydrationBailed = true;
                  console.warn('Parent: ', elm);
                  console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
                }
                return false
              }
            }
          }
        }
        if (isDef(data)) {
          var fullInvoke = false;
          for (var key in data) {
            if (!isRenderedModule(key)) {
              fullInvoke = true;
              invokeCreateHooks(vnode, insertedVnodeQueue);
              break
            }
          }
          if (!fullInvoke && data['class']) {
            // ensure collecting deps for deep class bindings for future updates
            traverse(data['class']);
          }
        }
      } else if (elm.data !== vnode.text) {
        elm.data = vnode.text;
      }
      return true
    }

    function assertNodeMatch (node, vnode, inVPre) {
      if (isDef(vnode.tag)) {
        return vnode.tag.indexOf('vue-component') === 0 || (
          !isUnknownElement$$1(vnode, inVPre) &&
          vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
        )
      } else {
        return node.nodeType === (vnode.isComment ? 8 : 3)
      }
    }

    return function patch (oldVnode, vnode, hydrating, removeOnly) {
      if (isUndef(vnode)) {
        if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
        return
      }

      var isInitialPatch = false;
      var insertedVnodeQueue = [];

      if (isUndef(oldVnode)) {
        // empty mount (likely as component), create new root element
        isInitialPatch = true;
        createElm(vnode, insertedVnodeQueue);
      } else {
        var isRealElement = isDef(oldVnode.nodeType);
        if (!isRealElement && sameVnode(oldVnode, vnode)) {
          // patch existing root node
          patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly);
        } else {
          if (isRealElement) {
            // mounting to a real element
            // check if this is server-rendered content and if we can perform
            // a successful hydration.
            if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
              oldVnode.removeAttribute(SSR_ATTR);
              hydrating = true;
            }
            if (isTrue(hydrating)) {
              if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
                invokeInsertHook(vnode, insertedVnodeQueue, true);
                return oldVnode
              } else {
                warn(
                  'The client-side rendered virtual DOM tree is not matching ' +
                  'server-rendered content. This is likely caused by incorrect ' +
                  'HTML markup, for example nesting block-level elements inside ' +
                  '<p>, or missing <tbody>. Bailing hydration and performing ' +
                  'full client-side render.'
                );
              }
            }
            // either not server-rendered, or hydration failed.
            // create an empty node and replace it
            oldVnode = emptyNodeAt(oldVnode);
          }

          // replacing existing element
          var oldElm = oldVnode.elm;
          var parentElm = nodeOps.parentNode(oldElm);

          // create new node
          createElm(
            vnode,
            insertedVnodeQueue,
            // extremely rare edge case: do not insert if old element is in a
            // leaving transition. Only happens when combining transition +
            // keep-alive + HOCs. (#4590)
            oldElm._leaveCb ? null : parentElm,
            nodeOps.nextSibling(oldElm)
          );

          // update parent placeholder node element, recursively
          if (isDef(vnode.parent)) {
            var ancestor = vnode.parent;
            var patchable = isPatchable(vnode);
            while (ancestor) {
              for (var i = 0; i < cbs.destroy.length; ++i) {
                cbs.destroy[i](ancestor);
              }
              ancestor.elm = vnode.elm;
              if (patchable) {
                for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                  cbs.create[i$1](emptyNode, ancestor);
                }
                // #6513
                // invoke insert hooks that may have been merged by create hooks.
                // e.g. for directives that uses the "inserted" hook.
                var insert = ancestor.data.hook.insert;
                if (insert.merged) {
                  // start at index 1 to avoid re-invoking component mounted hook
                  for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                    insert.fns[i$2]();
                  }
                }
              } else {
                registerRef(ancestor);
              }
              ancestor = ancestor.parent;
            }
          }

          // destroy old node
          if (isDef(parentElm)) {
            removeVnodes([oldVnode], 0, 0);
          } else if (isDef(oldVnode.tag)) {
            invokeDestroyHook(oldVnode);
          }
        }
      }

      invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
      return vnode.elm
    }
  }

  /*  */

  var directives = {
    create: updateDirectives,
    update: updateDirectives,
    destroy: function unbindDirectives (vnode) {
      updateDirectives(vnode, emptyNode);
    }
  };

  function updateDirectives (oldVnode, vnode) {
    if (oldVnode.data.directives || vnode.data.directives) {
      _update(oldVnode, vnode);
    }
  }

  function _update (oldVnode, vnode) {
    var isCreate = oldVnode === emptyNode;
    var isDestroy = vnode === emptyNode;
    var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
    var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

    var dirsWithInsert = [];
    var dirsWithPostpatch = [];

    var key, oldDir, dir;
    for (key in newDirs) {
      oldDir = oldDirs[key];
      dir = newDirs[key];
      if (!oldDir) {
        // new directive, bind
        callHook$1(dir, 'bind', vnode, oldVnode);
        if (dir.def && dir.def.inserted) {
          dirsWithInsert.push(dir);
        }
      } else {
        // existing directive, update
        dir.oldValue = oldDir.value;
        dir.oldArg = oldDir.arg;
        callHook$1(dir, 'update', vnode, oldVnode);
        if (dir.def && dir.def.componentUpdated) {
          dirsWithPostpatch.push(dir);
        }
      }
    }

    if (dirsWithInsert.length) {
      var callInsert = function () {
        for (var i = 0; i < dirsWithInsert.length; i++) {
          callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
        }
      };
      if (isCreate) {
        mergeVNodeHook(vnode, 'insert', callInsert);
      } else {
        callInsert();
      }
    }

    if (dirsWithPostpatch.length) {
      mergeVNodeHook(vnode, 'postpatch', function () {
        for (var i = 0; i < dirsWithPostpatch.length; i++) {
          callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
        }
      });
    }

    if (!isCreate) {
      for (key in oldDirs) {
        if (!newDirs[key]) {
          // no longer present, unbind
          callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
        }
      }
    }
  }

  var emptyModifiers = Object.create(null);

  function normalizeDirectives$1 (
    dirs,
    vm
  ) {
    var res = Object.create(null);
    if (!dirs) {
      // $flow-disable-line
      return res
    }
    var i, dir;
    for (i = 0; i < dirs.length; i++) {
      dir = dirs[i];
      if (!dir.modifiers) {
        // $flow-disable-line
        dir.modifiers = emptyModifiers;
      }
      res[getRawDirName(dir)] = dir;
      dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
    }
    // $flow-disable-line
    return res
  }

  function getRawDirName (dir) {
    return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
  }

  function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
    var fn = dir.def && dir.def[hook];
    if (fn) {
      try {
        fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
      } catch (e) {
        handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
      }
    }
  }

  var baseModules = [
    ref,
    directives
  ];

  /*  */

  function updateAttrs (oldVnode, vnode) {
    var opts = vnode.componentOptions;
    if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
      return
    }
    if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
      return
    }
    var key, cur, old;
    var elm = vnode.elm;
    var oldAttrs = oldVnode.data.attrs || {};
    var attrs = vnode.data.attrs || {};
    // clone observed objects, as the user probably wants to mutate it
    if (isDef(attrs.__ob__)) {
      attrs = vnode.data.attrs = extend({}, attrs);
    }

    for (key in attrs) {
      cur = attrs[key];
      old = oldAttrs[key];
      if (old !== cur) {
        setAttr(elm, key, cur);
      }
    }
    // #4391: in IE9, setting type can reset value for input[type=radio]
    // #6666: IE/Edge forces progress value down to 1 before setting a max
    /* istanbul ignore if */
    if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
      setAttr(elm, 'value', attrs.value);
    }
    for (key in oldAttrs) {
      if (isUndef(attrs[key])) {
        if (isXlink(key)) {
          elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
        } else if (!isEnumeratedAttr(key)) {
          elm.removeAttribute(key);
        }
      }
    }
  }

  function setAttr (el, key, value) {
    if (el.tagName.indexOf('-') > -1) {
      baseSetAttr(el, key, value);
    } else if (isBooleanAttr(key)) {
      // set attribute for blank value
      // e.g. <option disabled>Select one</option>
      if (isFalsyAttrValue(value)) {
        el.removeAttribute(key);
      } else {
        // technically allowfullscreen is a boolean attribute for <iframe>,
        // but Flash expects a value of "true" when used on <embed> tag
        value = key === 'allowfullscreen' && el.tagName === 'EMBED'
          ? 'true'
          : key;
        el.setAttribute(key, value);
      }
    } else if (isEnumeratedAttr(key)) {
      el.setAttribute(key, convertEnumeratedValue(key, value));
    } else if (isXlink(key)) {
      if (isFalsyAttrValue(value)) {
        el.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else {
        el.setAttributeNS(xlinkNS, key, value);
      }
    } else {
      baseSetAttr(el, key, value);
    }
  }

  function baseSetAttr (el, key, value) {
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // #7138: IE10 & 11 fires input event when setting placeholder on
      // <textarea>... block the first input event and remove the blocker
      // immediately.
      /* istanbul ignore if */
      if (
        isIE && !isIE9 &&
        el.tagName === 'TEXTAREA' &&
        key === 'placeholder' && value !== '' && !el.__ieph
      ) {
        var blocker = function (e) {
          e.stopImmediatePropagation();
          el.removeEventListener('input', blocker);
        };
        el.addEventListener('input', blocker);
        // $flow-disable-line
        el.__ieph = true; /* IE placeholder patched */
      }
      el.setAttribute(key, value);
    }
  }

  var attrs = {
    create: updateAttrs,
    update: updateAttrs
  };

  /*  */

  function updateClass (oldVnode, vnode) {
    var el = vnode.elm;
    var data = vnode.data;
    var oldData = oldVnode.data;
    if (
      isUndef(data.staticClass) &&
      isUndef(data.class) && (
        isUndef(oldData) || (
          isUndef(oldData.staticClass) &&
          isUndef(oldData.class)
        )
      )
    ) {
      return
    }

    var cls = genClassForVnode(vnode);

    // handle transition classes
    var transitionClass = el._transitionClasses;
    if (isDef(transitionClass)) {
      cls = concat(cls, stringifyClass(transitionClass));
    }

    // set the class
    if (cls !== el._prevClass) {
      el.setAttribute('class', cls);
      el._prevClass = cls;
    }
  }

  var klass = {
    create: updateClass,
    update: updateClass
  };

  /*  */

  /*  */

  /*  */

  /*  */

  // in some cases, the event used has to be determined at runtime
  // so we used some reserved tokens during compile.
  var RANGE_TOKEN = '__r';
  var CHECKBOX_RADIO_TOKEN = '__c';

  /*  */

  // normalize v-model event tokens that can only be determined at runtime.
  // it's important to place the event as the first in the array because
  // the whole point is ensuring the v-model callback gets called before
  // user-attached handlers.
  function normalizeEvents (on) {
    /* istanbul ignore if */
    if (isDef(on[RANGE_TOKEN])) {
      // IE input[type=range] only supports `change` event
      var event = isIE ? 'change' : 'input';
      on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
      delete on[RANGE_TOKEN];
    }
    // This was originally intended to fix #4521 but no longer necessary
    // after 2.5. Keeping it for backwards compat with generated code from < 2.4
    /* istanbul ignore if */
    if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
      on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
      delete on[CHECKBOX_RADIO_TOKEN];
    }
  }

  var target$1;

  function createOnceHandler$1 (event, handler, capture) {
    var _target = target$1; // save current target element in closure
    return function onceHandler () {
      var res = handler.apply(null, arguments);
      if (res !== null) {
        remove$2(event, onceHandler, capture, _target);
      }
    }
  }

  // #9446: Firefox <= 53 (in particular, ESR 52) has incorrect Event.timeStamp
  // implementation and does not fire microtasks in between event propagation, so
  // safe to exclude.
  var useMicrotaskFix = isUsingMicroTask && !(isFF && Number(isFF[1]) <= 53);

  function add$1 (
    name,
    handler,
    capture,
    passive
  ) {
    // async edge case #6566: inner click event triggers patch, event handler
    // attached to outer element during patch, and triggered again. This
    // happens because browsers fire microtask ticks between event propagation.
    // the solution is simple: we save the timestamp when a handler is attached,
    // and the handler would only fire if the event passed to it was fired
    // AFTER it was attached.
    if (useMicrotaskFix) {
      var attachedTimestamp = currentFlushTimestamp;
      var original = handler;
      handler = original._wrapper = function (e) {
        if (
          // no bubbling, should always fire.
          // this is just a safety net in case event.timeStamp is unreliable in
          // certain weird environments...
          e.target === e.currentTarget ||
          // event is fired after handler attachment
          e.timeStamp >= attachedTimestamp ||
          // bail for environments that have buggy event.timeStamp implementations
          // #9462 iOS 9 bug: event.timeStamp is 0 after history.pushState
          // #9681 QtWebEngine event.timeStamp is negative value
          e.timeStamp <= 0 ||
          // #9448 bail if event is fired in another document in a multi-page
          // electron/nw.js app, since event.timeStamp will be using a different
          // starting reference
          e.target.ownerDocument !== document
        ) {
          return original.apply(this, arguments)
        }
      };
    }
    target$1.addEventListener(
      name,
      handler,
      supportsPassive
        ? { capture: capture, passive: passive }
        : capture
    );
  }

  function remove$2 (
    name,
    handler,
    capture,
    _target
  ) {
    (_target || target$1).removeEventListener(
      name,
      handler._wrapper || handler,
      capture
    );
  }

  function updateDOMListeners (oldVnode, vnode) {
    if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
      return
    }
    var on = vnode.data.on || {};
    var oldOn = oldVnode.data.on || {};
    target$1 = vnode.elm;
    normalizeEvents(on);
    updateListeners(on, oldOn, add$1, remove$2, createOnceHandler$1, vnode.context);
    target$1 = undefined;
  }

  var events = {
    create: updateDOMListeners,
    update: updateDOMListeners
  };

  /*  */

  var svgContainer;

  function updateDOMProps (oldVnode, vnode) {
    if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
      return
    }
    var key, cur;
    var elm = vnode.elm;
    var oldProps = oldVnode.data.domProps || {};
    var props = vnode.data.domProps || {};
    // clone observed objects, as the user probably wants to mutate it
    if (isDef(props.__ob__)) {
      props = vnode.data.domProps = extend({}, props);
    }

    for (key in oldProps) {
      if (!(key in props)) {
        elm[key] = '';
      }
    }

    for (key in props) {
      cur = props[key];
      // ignore children if the node has textContent or innerHTML,
      // as these will throw away existing DOM nodes and cause removal errors
      // on subsequent patches (#3360)
      if (key === 'textContent' || key === 'innerHTML') {
        if (vnode.children) { vnode.children.length = 0; }
        if (cur === oldProps[key]) { continue }
        // #6601 work around Chrome version <= 55 bug where single textNode
        // replaced by innerHTML/textContent retains its parentNode property
        if (elm.childNodes.length === 1) {
          elm.removeChild(elm.childNodes[0]);
        }
      }

      if (key === 'value' && elm.tagName !== 'PROGRESS') {
        // store value as _value as well since
        // non-string values will be stringified
        elm._value = cur;
        // avoid resetting cursor position when value is the same
        var strCur = isUndef(cur) ? '' : String(cur);
        if (shouldUpdateValue(elm, strCur)) {
          elm.value = strCur;
        }
      } else if (key === 'innerHTML' && isSVG(elm.tagName) && isUndef(elm.innerHTML)) {
        // IE doesn't support innerHTML for SVG elements
        svgContainer = svgContainer || document.createElement('div');
        svgContainer.innerHTML = "<svg>" + cur + "</svg>";
        var svg = svgContainer.firstChild;
        while (elm.firstChild) {
          elm.removeChild(elm.firstChild);
        }
        while (svg.firstChild) {
          elm.appendChild(svg.firstChild);
        }
      } else if (
        // skip the update if old and new VDOM state is the same.
        // `value` is handled separately because the DOM value may be temporarily
        // out of sync with VDOM state due to focus, composition and modifiers.
        // This  #4521 by skipping the unnecesarry `checked` update.
        cur !== oldProps[key]
      ) {
        // some property updates can throw
        // e.g. `value` on <progress> w/ non-finite value
        try {
          elm[key] = cur;
        } catch (e) {}
      }
    }
  }

  // check platforms/web/util/attrs.js acceptValue


  function shouldUpdateValue (elm, checkVal) {
    return (!elm.composing && (
      elm.tagName === 'OPTION' ||
      isNotInFocusAndDirty(elm, checkVal) ||
      isDirtyWithModifiers(elm, checkVal)
    ))
  }

  function isNotInFocusAndDirty (elm, checkVal) {
    // return true when textbox (.number and .trim) loses focus and its value is
    // not equal to the updated value
    var notInFocus = true;
    // #6157
    // work around IE bug when accessing document.activeElement in an iframe
    try { notInFocus = document.activeElement !== elm; } catch (e) {}
    return notInFocus && elm.value !== checkVal
  }

  function isDirtyWithModifiers (elm, newVal) {
    var value = elm.value;
    var modifiers = elm._vModifiers; // injected by v-model runtime
    if (isDef(modifiers)) {
      if (modifiers.number) {
        return toNumber(value) !== toNumber(newVal)
      }
      if (modifiers.trim) {
        return value.trim() !== newVal.trim()
      }
    }
    return value !== newVal
  }

  var domProps = {
    create: updateDOMProps,
    update: updateDOMProps
  };

  /*  */

  var parseStyleText = cached(function (cssText) {
    var res = {};
    var listDelimiter = /;(?![^(]*\))/g;
    var propertyDelimiter = /:(.+)/;
    cssText.split(listDelimiter).forEach(function (item) {
      if (item) {
        var tmp = item.split(propertyDelimiter);
        tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
      }
    });
    return res
  });

  // merge static and dynamic style data on the same vnode
  function normalizeStyleData (data) {
    var style = normalizeStyleBinding(data.style);
    // static style is pre-processed into an object during compilation
    // and is always a fresh object, so it's safe to merge into it
    return data.staticStyle
      ? extend(data.staticStyle, style)
      : style
  }

  // normalize possible array / string values into Object
  function normalizeStyleBinding (bindingStyle) {
    if (Array.isArray(bindingStyle)) {
      return toObject(bindingStyle)
    }
    if (typeof bindingStyle === 'string') {
      return parseStyleText(bindingStyle)
    }
    return bindingStyle
  }

  /**
   * parent component style should be after child's
   * so that parent component's style could override it
   */
  function getStyle (vnode, checkChild) {
    var res = {};
    var styleData;

    if (checkChild) {
      var childNode = vnode;
      while (childNode.componentInstance) {
        childNode = childNode.componentInstance._vnode;
        if (
          childNode && childNode.data &&
          (styleData = normalizeStyleData(childNode.data))
        ) {
          extend(res, styleData);
        }
      }
    }

    if ((styleData = normalizeStyleData(vnode.data))) {
      extend(res, styleData);
    }

    var parentNode = vnode;
    while ((parentNode = parentNode.parent)) {
      if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
        extend(res, styleData);
      }
    }
    return res
  }

  /*  */

  var cssVarRE = /^--/;
  var importantRE = /\s*!important$/;
  var setProp = function (el, name, val) {
    /* istanbul ignore if */
    if (cssVarRE.test(name)) {
      el.style.setProperty(name, val);
    } else if (importantRE.test(val)) {
      el.style.setProperty(hyphenate(name), val.replace(importantRE, ''), 'important');
    } else {
      var normalizedName = normalize(name);
      if (Array.isArray(val)) {
        // Support values array created by autoprefixer, e.g.
        // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
        // Set them one by one, and the browser will only set those it can recognize
        for (var i = 0, len = val.length; i < len; i++) {
          el.style[normalizedName] = val[i];
        }
      } else {
        el.style[normalizedName] = val;
      }
    }
  };

  var vendorNames = ['Webkit', 'Moz', 'ms'];

  var emptyStyle;
  var normalize = cached(function (prop) {
    emptyStyle = emptyStyle || document.createElement('div').style;
    prop = camelize(prop);
    if (prop !== 'filter' && (prop in emptyStyle)) {
      return prop
    }
    var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
    for (var i = 0; i < vendorNames.length; i++) {
      var name = vendorNames[i] + capName;
      if (name in emptyStyle) {
        return name
      }
    }
  });

  function updateStyle (oldVnode, vnode) {
    var data = vnode.data;
    var oldData = oldVnode.data;

    if (isUndef(data.staticStyle) && isUndef(data.style) &&
      isUndef(oldData.staticStyle) && isUndef(oldData.style)
    ) {
      return
    }

    var cur, name;
    var el = vnode.elm;
    var oldStaticStyle = oldData.staticStyle;
    var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

    // if static style exists, stylebinding already merged into it when doing normalizeStyleData
    var oldStyle = oldStaticStyle || oldStyleBinding;

    var style = normalizeStyleBinding(vnode.data.style) || {};

    // store normalized style under a different key for next diff
    // make sure to clone it if it's reactive, since the user likely wants
    // to mutate it.
    vnode.data.normalizedStyle = isDef(style.__ob__)
      ? extend({}, style)
      : style;

    var newStyle = getStyle(vnode, true);

    for (name in oldStyle) {
      if (isUndef(newStyle[name])) {
        setProp(el, name, '');
      }
    }
    for (name in newStyle) {
      cur = newStyle[name];
      if (cur !== oldStyle[name]) {
        // ie9 setting to null has no effect, must use empty string
        setProp(el, name, cur == null ? '' : cur);
      }
    }
  }

  var style = {
    create: updateStyle,
    update: updateStyle
  };

  /*  */

  var whitespaceRE = /\s+/;

  /**
   * Add class with compatibility for SVG since classList is not supported on
   * SVG elements in IE
   */
  function addClass (el, cls) {
    /* istanbul ignore if */
    if (!cls || !(cls = cls.trim())) {
      return
    }

    /* istanbul ignore else */
    if (el.classList) {
      if (cls.indexOf(' ') > -1) {
        cls.split(whitespaceRE).forEach(function (c) { return el.classList.add(c); });
      } else {
        el.classList.add(cls);
      }
    } else {
      var cur = " " + (el.getAttribute('class') || '') + " ";
      if (cur.indexOf(' ' + cls + ' ') < 0) {
        el.setAttribute('class', (cur + cls).trim());
      }
    }
  }

  /**
   * Remove class with compatibility for SVG since classList is not supported on
   * SVG elements in IE
   */
  function removeClass (el, cls) {
    /* istanbul ignore if */
    if (!cls || !(cls = cls.trim())) {
      return
    }

    /* istanbul ignore else */
    if (el.classList) {
      if (cls.indexOf(' ') > -1) {
        cls.split(whitespaceRE).forEach(function (c) { return el.classList.remove(c); });
      } else {
        el.classList.remove(cls);
      }
      if (!el.classList.length) {
        el.removeAttribute('class');
      }
    } else {
      var cur = " " + (el.getAttribute('class') || '') + " ";
      var tar = ' ' + cls + ' ';
      while (cur.indexOf(tar) >= 0) {
        cur = cur.replace(tar, ' ');
      }
      cur = cur.trim();
      if (cur) {
        el.setAttribute('class', cur);
      } else {
        el.removeAttribute('class');
      }
    }
  }

  /*  */

  function resolveTransition (def$$1) {
    if (!def$$1) {
      return
    }
    /* istanbul ignore else */
    if (typeof def$$1 === 'object') {
      var res = {};
      if (def$$1.css !== false) {
        extend(res, autoCssTransition(def$$1.name || 'v'));
      }
      extend(res, def$$1);
      return res
    } else if (typeof def$$1 === 'string') {
      return autoCssTransition(def$$1)
    }
  }

  var autoCssTransition = cached(function (name) {
    return {
      enterClass: (name + "-enter"),
      enterToClass: (name + "-enter-to"),
      enterActiveClass: (name + "-enter-active"),
      leaveClass: (name + "-leave"),
      leaveToClass: (name + "-leave-to"),
      leaveActiveClass: (name + "-leave-active")
    }
  });

  var hasTransition = inBrowser && !isIE9;
  var TRANSITION = 'transition';
  var ANIMATION = 'animation';

  // Transition property/event sniffing
  var transitionProp = 'transition';
  var transitionEndEvent = 'transitionend';
  var animationProp = 'animation';
  var animationEndEvent = 'animationend';
  if (hasTransition) {
    /* istanbul ignore if */
    if (window.ontransitionend === undefined &&
      window.onwebkittransitionend !== undefined
    ) {
      transitionProp = 'WebkitTransition';
      transitionEndEvent = 'webkitTransitionEnd';
    }
    if (window.onanimationend === undefined &&
      window.onwebkitanimationend !== undefined
    ) {
      animationProp = 'WebkitAnimation';
      animationEndEvent = 'webkitAnimationEnd';
    }
  }

  // binding to window is necessary to make hot reload work in IE in strict mode
  var raf = inBrowser
    ? window.requestAnimationFrame
      ? window.requestAnimationFrame.bind(window)
      : setTimeout
    : /* istanbul ignore next */ function (fn) { return fn(); };

  function nextFrame (fn) {
    raf(function () {
      raf(fn);
    });
  }

  function addTransitionClass (el, cls) {
    var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
    if (transitionClasses.indexOf(cls) < 0) {
      transitionClasses.push(cls);
      addClass(el, cls);
    }
  }

  function removeTransitionClass (el, cls) {
    if (el._transitionClasses) {
      remove(el._transitionClasses, cls);
    }
    removeClass(el, cls);
  }

  function whenTransitionEnds (
    el,
    expectedType,
    cb
  ) {
    var ref = getTransitionInfo(el, expectedType);
    var type = ref.type;
    var timeout = ref.timeout;
    var propCount = ref.propCount;
    if (!type) { return cb() }
    var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
    var ended = 0;
    var end = function () {
      el.removeEventListener(event, onEnd);
      cb();
    };
    var onEnd = function (e) {
      if (e.target === el) {
        if (++ended >= propCount) {
          end();
        }
      }
    };
    setTimeout(function () {
      if (ended < propCount) {
        end();
      }
    }, timeout + 1);
    el.addEventListener(event, onEnd);
  }

  var transformRE = /\b(transform|all)(,|$)/;

  function getTransitionInfo (el, expectedType) {
    var styles = window.getComputedStyle(el);
    // JSDOM may return undefined for transition properties
    var transitionDelays = (styles[transitionProp + 'Delay'] || '').split(', ');
    var transitionDurations = (styles[transitionProp + 'Duration'] || '').split(', ');
    var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
    var animationDelays = (styles[animationProp + 'Delay'] || '').split(', ');
    var animationDurations = (styles[animationProp + 'Duration'] || '').split(', ');
    var animationTimeout = getTimeout(animationDelays, animationDurations);

    var type;
    var timeout = 0;
    var propCount = 0;
    /* istanbul ignore if */
    if (expectedType === TRANSITION) {
      if (transitionTimeout > 0) {
        type = TRANSITION;
        timeout = transitionTimeout;
        propCount = transitionDurations.length;
      }
    } else if (expectedType === ANIMATION) {
      if (animationTimeout > 0) {
        type = ANIMATION;
        timeout = animationTimeout;
        propCount = animationDurations.length;
      }
    } else {
      timeout = Math.max(transitionTimeout, animationTimeout);
      type = timeout > 0
        ? transitionTimeout > animationTimeout
          ? TRANSITION
          : ANIMATION
        : null;
      propCount = type
        ? type === TRANSITION
          ? transitionDurations.length
          : animationDurations.length
        : 0;
    }
    var hasTransform =
      type === TRANSITION &&
      transformRE.test(styles[transitionProp + 'Property']);
    return {
      type: type,
      timeout: timeout,
      propCount: propCount,
      hasTransform: hasTransform
    }
  }

  function getTimeout (delays, durations) {
    /* istanbul ignore next */
    while (delays.length < durations.length) {
      delays = delays.concat(delays);
    }

    return Math.max.apply(null, durations.map(function (d, i) {
      return toMs(d) + toMs(delays[i])
    }))
  }

  // Old versions of Chromium (below 61.0.3163.100) formats floating pointer numbers
  // in a locale-dependent way, using a comma instead of a dot.
  // If comma is not replaced with a dot, the input will be rounded down (i.e. acting
  // as a floor function) causing unexpected behaviors
  function toMs (s) {
    return Number(s.slice(0, -1).replace(',', '.')) * 1000
  }

  /*  */

  function enter (vnode, toggleDisplay) {
    var el = vnode.elm;

    // call leave callback now
    if (isDef(el._leaveCb)) {
      el._leaveCb.cancelled = true;
      el._leaveCb();
    }

    var data = resolveTransition(vnode.data.transition);
    if (isUndef(data)) {
      return
    }

    /* istanbul ignore if */
    if (isDef(el._enterCb) || el.nodeType !== 1) {
      return
    }

    var css = data.css;
    var type = data.type;
    var enterClass = data.enterClass;
    var enterToClass = data.enterToClass;
    var enterActiveClass = data.enterActiveClass;
    var appearClass = data.appearClass;
    var appearToClass = data.appearToClass;
    var appearActiveClass = data.appearActiveClass;
    var beforeEnter = data.beforeEnter;
    var enter = data.enter;
    var afterEnter = data.afterEnter;
    var enterCancelled = data.enterCancelled;
    var beforeAppear = data.beforeAppear;
    var appear = data.appear;
    var afterAppear = data.afterAppear;
    var appearCancelled = data.appearCancelled;
    var duration = data.duration;

    // activeInstance will always be the <transition> component managing this
    // transition. One edge case to check is when the <transition> is placed
    // as the root node of a child component. In that case we need to check
    // <transition>'s parent for appear check.
    var context = activeInstance;
    var transitionNode = activeInstance.$vnode;
    while (transitionNode && transitionNode.parent) {
      context = transitionNode.context;
      transitionNode = transitionNode.parent;
    }

    var isAppear = !context._isMounted || !vnode.isRootInsert;

    if (isAppear && !appear && appear !== '') {
      return
    }

    var startClass = isAppear && appearClass
      ? appearClass
      : enterClass;
    var activeClass = isAppear && appearActiveClass
      ? appearActiveClass
      : enterActiveClass;
    var toClass = isAppear && appearToClass
      ? appearToClass
      : enterToClass;

    var beforeEnterHook = isAppear
      ? (beforeAppear || beforeEnter)
      : beforeEnter;
    var enterHook = isAppear
      ? (typeof appear === 'function' ? appear : enter)
      : enter;
    var afterEnterHook = isAppear
      ? (afterAppear || afterEnter)
      : afterEnter;
    var enterCancelledHook = isAppear
      ? (appearCancelled || enterCancelled)
      : enterCancelled;

    var explicitEnterDuration = toNumber(
      isObject(duration)
        ? duration.enter
        : duration
    );

    if ( explicitEnterDuration != null) {
      checkDuration(explicitEnterDuration, 'enter', vnode);
    }

    var expectsCSS = css !== false && !isIE9;
    var userWantsControl = getHookArgumentsLength(enterHook);

    var cb = el._enterCb = once(function () {
      if (expectsCSS) {
        removeTransitionClass(el, toClass);
        removeTransitionClass(el, activeClass);
      }
      if (cb.cancelled) {
        if (expectsCSS) {
          removeTransitionClass(el, startClass);
        }
        enterCancelledHook && enterCancelledHook(el);
      } else {
        afterEnterHook && afterEnterHook(el);
      }
      el._enterCb = null;
    });

    if (!vnode.data.show) {
      // remove pending leave element on enter by injecting an insert hook
      mergeVNodeHook(vnode, 'insert', function () {
        var parent = el.parentNode;
        var pendingNode = parent && parent._pending && parent._pending[vnode.key];
        if (pendingNode &&
          pendingNode.tag === vnode.tag &&
          pendingNode.elm._leaveCb
        ) {
          pendingNode.elm._leaveCb();
        }
        enterHook && enterHook(el, cb);
      });
    }

    // start enter transition
    beforeEnterHook && beforeEnterHook(el);
    if (expectsCSS) {
      addTransitionClass(el, startClass);
      addTransitionClass(el, activeClass);
      nextFrame(function () {
        removeTransitionClass(el, startClass);
        if (!cb.cancelled) {
          addTransitionClass(el, toClass);
          if (!userWantsControl) {
            if (isValidDuration(explicitEnterDuration)) {
              setTimeout(cb, explicitEnterDuration);
            } else {
              whenTransitionEnds(el, type, cb);
            }
          }
        }
      });
    }

    if (vnode.data.show) {
      toggleDisplay && toggleDisplay();
      enterHook && enterHook(el, cb);
    }

    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }

  function leave (vnode, rm) {
    var el = vnode.elm;

    // call enter callback now
    if (isDef(el._enterCb)) {
      el._enterCb.cancelled = true;
      el._enterCb();
    }

    var data = resolveTransition(vnode.data.transition);
    if (isUndef(data) || el.nodeType !== 1) {
      return rm()
    }

    /* istanbul ignore if */
    if (isDef(el._leaveCb)) {
      return
    }

    var css = data.css;
    var type = data.type;
    var leaveClass = data.leaveClass;
    var leaveToClass = data.leaveToClass;
    var leaveActiveClass = data.leaveActiveClass;
    var beforeLeave = data.beforeLeave;
    var leave = data.leave;
    var afterLeave = data.afterLeave;
    var leaveCancelled = data.leaveCancelled;
    var delayLeave = data.delayLeave;
    var duration = data.duration;

    var expectsCSS = css !== false && !isIE9;
    var userWantsControl = getHookArgumentsLength(leave);

    var explicitLeaveDuration = toNumber(
      isObject(duration)
        ? duration.leave
        : duration
    );

    if ( isDef(explicitLeaveDuration)) {
      checkDuration(explicitLeaveDuration, 'leave', vnode);
    }

    var cb = el._leaveCb = once(function () {
      if (el.parentNode && el.parentNode._pending) {
        el.parentNode._pending[vnode.key] = null;
      }
      if (expectsCSS) {
        removeTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveActiveClass);
      }
      if (cb.cancelled) {
        if (expectsCSS) {
          removeTransitionClass(el, leaveClass);
        }
        leaveCancelled && leaveCancelled(el);
      } else {
        rm();
        afterLeave && afterLeave(el);
      }
      el._leaveCb = null;
    });

    if (delayLeave) {
      delayLeave(performLeave);
    } else {
      performLeave();
    }

    function performLeave () {
      // the delayed leave may have already been cancelled
      if (cb.cancelled) {
        return
      }
      // record leaving element
      if (!vnode.data.show && el.parentNode) {
        (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
      }
      beforeLeave && beforeLeave(el);
      if (expectsCSS) {
        addTransitionClass(el, leaveClass);
        addTransitionClass(el, leaveActiveClass);
        nextFrame(function () {
          removeTransitionClass(el, leaveClass);
          if (!cb.cancelled) {
            addTransitionClass(el, leaveToClass);
            if (!userWantsControl) {
              if (isValidDuration(explicitLeaveDuration)) {
                setTimeout(cb, explicitLeaveDuration);
              } else {
                whenTransitionEnds(el, type, cb);
              }
            }
          }
        });
      }
      leave && leave(el, cb);
      if (!expectsCSS && !userWantsControl) {
        cb();
      }
    }
  }

  // only used in dev mode
  function checkDuration (val, name, vnode) {
    if (typeof val !== 'number') {
      warn(
        "<transition> explicit " + name + " duration is not a valid number - " +
        "got " + (JSON.stringify(val)) + ".",
        vnode.context
      );
    } else if (isNaN(val)) {
      warn(
        "<transition> explicit " + name + " duration is NaN - " +
        'the duration expression might be incorrect.',
        vnode.context
      );
    }
  }

  function isValidDuration (val) {
    return typeof val === 'number' && !isNaN(val)
  }

  /**
   * Normalize a transition hook's argument length. The hook may be:
   * - a merged hook (invoker) with the original in .fns
   * - a wrapped component method (check ._length)
   * - a plain function (.length)
   */
  function getHookArgumentsLength (fn) {
    if (isUndef(fn)) {
      return false
    }
    var invokerFns = fn.fns;
    if (isDef(invokerFns)) {
      // invoker
      return getHookArgumentsLength(
        Array.isArray(invokerFns)
          ? invokerFns[0]
          : invokerFns
      )
    } else {
      return (fn._length || fn.length) > 1
    }
  }

  function _enter (_, vnode) {
    if (vnode.data.show !== true) {
      enter(vnode);
    }
  }

  var transition = inBrowser ? {
    create: _enter,
    activate: _enter,
    remove: function remove$$1 (vnode, rm) {
      /* istanbul ignore else */
      if (vnode.data.show !== true) {
        leave(vnode, rm);
      } else {
        rm();
      }
    }
  } : {};

  var platformModules = [
    attrs,
    klass,
    events,
    domProps,
    style,
    transition
  ];

  /*  */

  // the directive module should be applied last, after all
  // built-in modules have been applied.
  var modules = platformModules.concat(baseModules);

  var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

  /**
   * Not type checking this file because flow doesn't like attaching
   * properties to Elements.
   */

  /* istanbul ignore if */
  if (isIE9) {
    // http://www.matts411.com/post/internet-explorer-9-oninput/
    document.addEventListener('selectionchange', function () {
      var el = document.activeElement;
      if (el && el.vmodel) {
        trigger(el, 'input');
      }
    });
  }

  var directive = {
    inserted: function inserted (el, binding, vnode, oldVnode) {
      if (vnode.tag === 'select') {
        // #6903
        if (oldVnode.elm && !oldVnode.elm._vOptions) {
          mergeVNodeHook(vnode, 'postpatch', function () {
            directive.componentUpdated(el, binding, vnode);
          });
        } else {
          setSelected(el, binding, vnode.context);
        }
        el._vOptions = [].map.call(el.options, getValue);
      } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
        el._vModifiers = binding.modifiers;
        if (!binding.modifiers.lazy) {
          el.addEventListener('compositionstart', onCompositionStart);
          el.addEventListener('compositionend', onCompositionEnd);
          // Safari < 10.2 & UIWebView doesn't fire compositionend when
          // switching focus before confirming composition choice
          // this also fixes the issue where some browsers e.g. iOS Chrome
          // fires "change" instead of "input" on autocomplete.
          el.addEventListener('change', onCompositionEnd);
          /* istanbul ignore if */
          if (isIE9) {
            el.vmodel = true;
          }
        }
      }
    },

    componentUpdated: function componentUpdated (el, binding, vnode) {
      if (vnode.tag === 'select') {
        setSelected(el, binding, vnode.context);
        // in case the options rendered by v-for have changed,
        // it's possible that the value is out-of-sync with the rendered options.
        // detect such cases and filter out values that no longer has a matching
        // option in the DOM.
        var prevOptions = el._vOptions;
        var curOptions = el._vOptions = [].map.call(el.options, getValue);
        if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
          // trigger change event if
          // no matching option found for at least one value
          var needReset = el.multiple
            ? binding.value.some(function (v) { return hasNoMatchingOption(v, curOptions); })
            : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
          if (needReset) {
            trigger(el, 'change');
          }
        }
      }
    }
  };

  function setSelected (el, binding, vm) {
    actuallySetSelected(el, binding, vm);
    /* istanbul ignore if */
    if (isIE || isEdge) {
      setTimeout(function () {
        actuallySetSelected(el, binding, vm);
      }, 0);
    }
  }

  function actuallySetSelected (el, binding, vm) {
    var value = binding.value;
    var isMultiple = el.multiple;
    if (isMultiple && !Array.isArray(value)) {
       warn(
        "<select multiple v-model=\"" + (binding.expression) + "\"> " +
        "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
        vm
      );
      return
    }
    var selected, option;
    for (var i = 0, l = el.options.length; i < l; i++) {
      option = el.options[i];
      if (isMultiple) {
        selected = looseIndexOf(value, getValue(option)) > -1;
        if (option.selected !== selected) {
          option.selected = selected;
        }
      } else {
        if (looseEqual(getValue(option), value)) {
          if (el.selectedIndex !== i) {
            el.selectedIndex = i;
          }
          return
        }
      }
    }
    if (!isMultiple) {
      el.selectedIndex = -1;
    }
  }

  function hasNoMatchingOption (value, options) {
    return options.every(function (o) { return !looseEqual(o, value); })
  }

  function getValue (option) {
    return '_value' in option
      ? option._value
      : option.value
  }

  function onCompositionStart (e) {
    e.target.composing = true;
  }

  function onCompositionEnd (e) {
    // prevent triggering an input event for no reason
    if (!e.target.composing) { return }
    e.target.composing = false;
    trigger(e.target, 'input');
  }

  function trigger (el, type) {
    var e = document.createEvent('HTMLEvents');
    e.initEvent(type, true, true);
    el.dispatchEvent(e);
  }

  /*  */

  // recursively search for possible transition defined inside the component root
  function locateNode (vnode) {
    return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
      ? locateNode(vnode.componentInstance._vnode)
      : vnode
  }

  var show = {
    bind: function bind (el, ref, vnode) {
      var value = ref.value;

      vnode = locateNode(vnode);
      var transition$$1 = vnode.data && vnode.data.transition;
      var originalDisplay = el.__vOriginalDisplay =
        el.style.display === 'none' ? '' : el.style.display;
      if (value && transition$$1) {
        vnode.data.show = true;
        enter(vnode, function () {
          el.style.display = originalDisplay;
        });
      } else {
        el.style.display = value ? originalDisplay : 'none';
      }
    },

    update: function update (el, ref, vnode) {
      var value = ref.value;
      var oldValue = ref.oldValue;

      /* istanbul ignore if */
      if (!value === !oldValue) { return }
      vnode = locateNode(vnode);
      var transition$$1 = vnode.data && vnode.data.transition;
      if (transition$$1) {
        vnode.data.show = true;
        if (value) {
          enter(vnode, function () {
            el.style.display = el.__vOriginalDisplay;
          });
        } else {
          leave(vnode, function () {
            el.style.display = 'none';
          });
        }
      } else {
        el.style.display = value ? el.__vOriginalDisplay : 'none';
      }
    },

    unbind: function unbind (
      el,
      binding,
      vnode,
      oldVnode,
      isDestroy
    ) {
      if (!isDestroy) {
        el.style.display = el.__vOriginalDisplay;
      }
    }
  };

  var platformDirectives = {
    model: directive,
    show: show
  };

  /*  */

  var transitionProps = {
    name: String,
    appear: Boolean,
    css: Boolean,
    mode: String,
    type: String,
    enterClass: String,
    leaveClass: String,
    enterToClass: String,
    leaveToClass: String,
    enterActiveClass: String,
    leaveActiveClass: String,
    appearClass: String,
    appearActiveClass: String,
    appearToClass: String,
    duration: [Number, String, Object]
  };

  // in case the child is also an abstract component, e.g. <keep-alive>
  // we want to recursively retrieve the real component to be rendered
  function getRealChild (vnode) {
    var compOptions = vnode && vnode.componentOptions;
    if (compOptions && compOptions.Ctor.options.abstract) {
      return getRealChild(getFirstComponentChild(compOptions.children))
    } else {
      return vnode
    }
  }

  function extractTransitionData (comp) {
    var data = {};
    var options = comp.$options;
    // props
    for (var key in options.propsData) {
      data[key] = comp[key];
    }
    // events.
    // extract listeners and pass them directly to the transition methods
    var listeners = options._parentListeners;
    for (var key$1 in listeners) {
      data[camelize(key$1)] = listeners[key$1];
    }
    return data
  }

  function placeholder (h, rawChild) {
    if (/\d-keep-alive$/.test(rawChild.tag)) {
      return h('keep-alive', {
        props: rawChild.componentOptions.propsData
      })
    }
  }

  function hasParentTransition (vnode) {
    while ((vnode = vnode.parent)) {
      if (vnode.data.transition) {
        return true
      }
    }
  }

  function isSameChild (child, oldChild) {
    return oldChild.key === child.key && oldChild.tag === child.tag
  }

  var isNotTextNode = function (c) { return c.tag || isAsyncPlaceholder(c); };

  var isVShowDirective = function (d) { return d.name === 'show'; };

  var Transition = {
    name: 'transition',
    props: transitionProps,
    abstract: true,

    render: function render (h) {
      var this$1 = this;

      var children = this.$slots.default;
      if (!children) {
        return
      }

      // filter out text nodes (possible whitespaces)
      children = children.filter(isNotTextNode);
      /* istanbul ignore if */
      if (!children.length) {
        return
      }

      // warn multiple elements
      if ( children.length > 1) {
        warn(
          '<transition> can only be used on a single element. Use ' +
          '<transition-group> for lists.',
          this.$parent
        );
      }

      var mode = this.mode;

      // warn invalid mode
      if (
        mode && mode !== 'in-out' && mode !== 'out-in'
      ) {
        warn(
          'invalid <transition> mode: ' + mode,
          this.$parent
        );
      }

      var rawChild = children[0];

      // if this is a component root node and the component's
      // parent container node also has transition, skip.
      if (hasParentTransition(this.$vnode)) {
        return rawChild
      }

      // apply transition data to child
      // use getRealChild() to ignore abstract components e.g. keep-alive
      var child = getRealChild(rawChild);
      /* istanbul ignore if */
      if (!child) {
        return rawChild
      }

      if (this._leaving) {
        return placeholder(h, rawChild)
      }

      // ensure a key that is unique to the vnode type and to this transition
      // component instance. This key will be used to remove pending leaving nodes
      // during entering.
      var id = "__transition-" + (this._uid) + "-";
      child.key = child.key == null
        ? child.isComment
          ? id + 'comment'
          : id + child.tag
        : isPrimitive(child.key)
          ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
          : child.key;

      var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
      var oldRawChild = this._vnode;
      var oldChild = getRealChild(oldRawChild);

      // mark v-show
      // so that the transition module can hand over the control to the directive
      if (child.data.directives && child.data.directives.some(isVShowDirective)) {
        child.data.show = true;
      }

      if (
        oldChild &&
        oldChild.data &&
        !isSameChild(child, oldChild) &&
        !isAsyncPlaceholder(oldChild) &&
        // #6687 component root is a comment node
        !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)
      ) {
        // replace old child transition data with fresh one
        // important for dynamic transitions!
        var oldData = oldChild.data.transition = extend({}, data);
        // handle transition mode
        if (mode === 'out-in') {
          // return placeholder node and queue update when leave finishes
          this._leaving = true;
          mergeVNodeHook(oldData, 'afterLeave', function () {
            this$1._leaving = false;
            this$1.$forceUpdate();
          });
          return placeholder(h, rawChild)
        } else if (mode === 'in-out') {
          if (isAsyncPlaceholder(child)) {
            return oldRawChild
          }
          var delayedLeave;
          var performLeave = function () { delayedLeave(); };
          mergeVNodeHook(data, 'afterEnter', performLeave);
          mergeVNodeHook(data, 'enterCancelled', performLeave);
          mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
        }
      }

      return rawChild
    }
  };

  /*  */

  var props = extend({
    tag: String,
    moveClass: String
  }, transitionProps);

  delete props.mode;

  var TransitionGroup = {
    props: props,

    beforeMount: function beforeMount () {
      var this$1 = this;

      var update = this._update;
      this._update = function (vnode, hydrating) {
        var restoreActiveInstance = setActiveInstance(this$1);
        // force removing pass
        this$1.__patch__(
          this$1._vnode,
          this$1.kept,
          false, // hydrating
          true // removeOnly (!important, avoids unnecessary moves)
        );
        this$1._vnode = this$1.kept;
        restoreActiveInstance();
        update.call(this$1, vnode, hydrating);
      };
    },

    render: function render (h) {
      var tag = this.tag || this.$vnode.data.tag || 'span';
      var map = Object.create(null);
      var prevChildren = this.prevChildren = this.children;
      var rawChildren = this.$slots.default || [];
      var children = this.children = [];
      var transitionData = extractTransitionData(this);

      for (var i = 0; i < rawChildren.length; i++) {
        var c = rawChildren[i];
        if (c.tag) {
          if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
            children.push(c);
            map[c.key] = c
            ;(c.data || (c.data = {})).transition = transitionData;
          } else {
            var opts = c.componentOptions;
            var name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
            warn(("<transition-group> children must be keyed: <" + name + ">"));
          }
        }
      }

      if (prevChildren) {
        var kept = [];
        var removed = [];
        for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
          var c$1 = prevChildren[i$1];
          c$1.data.transition = transitionData;
          c$1.data.pos = c$1.elm.getBoundingClientRect();
          if (map[c$1.key]) {
            kept.push(c$1);
          } else {
            removed.push(c$1);
          }
        }
        this.kept = h(tag, null, kept);
        this.removed = removed;
      }

      return h(tag, null, children)
    },

    updated: function updated () {
      var children = this.prevChildren;
      var moveClass = this.moveClass || ((this.name || 'v') + '-move');
      if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
        return
      }

      // we divide the work into three loops to avoid mixing DOM reads and writes
      // in each iteration - which helps prevent layout thrashing.
      children.forEach(callPendingCbs);
      children.forEach(recordPosition);
      children.forEach(applyTranslation);

      // force reflow to put everything in position
      // assign to this to avoid being removed in tree-shaking
      // $flow-disable-line
      this._reflow = document.body.offsetHeight;

      children.forEach(function (c) {
        if (c.data.moved) {
          var el = c.elm;
          var s = el.style;
          addTransitionClass(el, moveClass);
          s.transform = s.WebkitTransform = s.transitionDuration = '';
          el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
            if (e && e.target !== el) {
              return
            }
            if (!e || /transform$/.test(e.propertyName)) {
              el.removeEventListener(transitionEndEvent, cb);
              el._moveCb = null;
              removeTransitionClass(el, moveClass);
            }
          });
        }
      });
    },

    methods: {
      hasMove: function hasMove (el, moveClass) {
        /* istanbul ignore if */
        if (!hasTransition) {
          return false
        }
        /* istanbul ignore if */
        if (this._hasMove) {
          return this._hasMove
        }
        // Detect whether an element with the move class applied has
        // CSS transitions. Since the element may be inside an entering
        // transition at this very moment, we make a clone of it and remove
        // all other transition classes applied to ensure only the move class
        // is applied.
        var clone = el.cloneNode();
        if (el._transitionClasses) {
          el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
        }
        addClass(clone, moveClass);
        clone.style.display = 'none';
        this.$el.appendChild(clone);
        var info = getTransitionInfo(clone);
        this.$el.removeChild(clone);
        return (this._hasMove = info.hasTransform)
      }
    }
  };

  function callPendingCbs (c) {
    /* istanbul ignore if */
    if (c.elm._moveCb) {
      c.elm._moveCb();
    }
    /* istanbul ignore if */
    if (c.elm._enterCb) {
      c.elm._enterCb();
    }
  }

  function recordPosition (c) {
    c.data.newPos = c.elm.getBoundingClientRect();
  }

  function applyTranslation (c) {
    var oldPos = c.data.pos;
    var newPos = c.data.newPos;
    var dx = oldPos.left - newPos.left;
    var dy = oldPos.top - newPos.top;
    if (dx || dy) {
      c.data.moved = true;
      var s = c.elm.style;
      s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
      s.transitionDuration = '0s';
    }
  }

  var platformComponents = {
    Transition: Transition,
    TransitionGroup: TransitionGroup
  };

  /*  */

  // install platform specific utils
  Vue.config.mustUseProp = mustUseProp;
  Vue.config.isReservedTag = isReservedTag;
  Vue.config.isReservedAttr = isReservedAttr;
  Vue.config.getTagNamespace = getTagNamespace;
  Vue.config.isUnknownElement = isUnknownElement;

  // install platform runtime directives & components
  extend(Vue.options.directives, platformDirectives);
  extend(Vue.options.components, platformComponents);

  // install platform patch function
  Vue.prototype.__patch__ = inBrowser ? patch : noop;

  // public mount method
  Vue.prototype.$mount = function (
    el,
    hydrating
  ) {
    el = el && inBrowser ? query(el) : undefined;
    return mountComponent(this, el, hydrating)
  };

  // devtools global hook
  /* istanbul ignore next */
  if (inBrowser) {
    setTimeout(function () {
      if (config.devtools) {
        if (devtools) {
          devtools.emit('init', Vue);
        } else {
          console[console.info ? 'info' : 'log'](
            'Download the Vue Devtools extension for a better development experience:\n' +
            'https://github.com/vuejs/vue-devtools'
          );
        }
      }
      if (
        config.productionTip !== false &&
        typeof console !== 'undefined'
      ) {
        console[console.info ? 'info' : 'log'](
          "You are running Vue in development mode.\n" +
          "Make sure to turn on production mode when deploying for production.\n" +
          "See more tips at https://vuejs.org/guide/deployment.html"
        );
      }
    }, 0);
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var headful_1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
      value: true
  });

  var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

  exports.default = headful;


  var conf = {
      debug: false
  };

  var propertySetters = {
      html: function html(obj) {
          obj && Object.keys(obj).forEach(function (selector) {
              return setRootElementAttributes(selector, obj[selector]);
          });
      },
      head: function head(obj) {
          obj && Object.keys(obj).forEach(function (selector) {
              return setHeadElementAttributes(selector, obj[selector]);
          });
      },
      title: function title(val) {
          document.title = isRemoveValue(val) ? '' : val;
          setMetaContent('itemprop="name"', val);
          setMetaContent('property="og:title"', val);
          setMetaContent('name="twitter:title"', val);
      },
      description: function description(val) {
          setMetaContent('name="description"', val);
          setMetaContent('itemprop="description"', val);
          setMetaContent('property="og:description"', val);
          setMetaContent('name="twitter:description"', val);
      },
      keywords: function keywords(val) {
          setMetaContent('name="keywords"', Array.isArray(val) ? val.join(', ') : val);
      },
      image: function image(val) {
          setMetaContent('itemprop="image"', val);
          setMetaContent('property="og:image"', val);
          setMetaContent('name="twitter:image"', val);
      },
      lang: function lang(val, props) {
          setRootElementAttributes('html', { lang: val });
          noProp(props, this.ogLocale) && setOgLocaleIfValid(val);
      },
      ogLocale: function ogLocale(val) {
          setMetaContent('property="og:locale"', val);
      },
      url: function url(val) {
          setHeadElementAttributes('link[rel="canonical"]', { href: val });
          setMetaContent('property="og:url"', val);
          setMetaContent('name="twitter:url"', val);
      }
  };

  function headful(props, userConf) {
      Object.assign(conf, userConf);
      Object.keys(props).forEach(function (prop) {
          if (!propertySetters.hasOwnProperty(prop)) {
              throw new Error('Headful: Property \'' + prop + '\' is unknown.');
          }
          propertySetters[prop](props[prop], props);
      });
  }

  headful.props = propertySetters;

  /**
   * Tests whether the given `props` object contains a property with the name of `propNameOrFunction`.
   */
  function noProp(props, propNameOrFunction) {
      if (!props) {
          throw new Error('Headful: You must pass all declared props when you use headful.props.x() calls.');
      }
      var propName = typeof propNameOrFunction === 'function' ? propNameOrFunction.name : propNameOrFunction;
      return !props.hasOwnProperty(propName);
  }

  function setMetaContent(attr, val) {
      setHeadElementAttributes('meta[' + attr + ']', { content: val });
  }

  function setRootElementAttributes(selector, attributes) {
      setElementAttributes(getElement(document, selector), attributes);
  }

  function setHeadElementAttributes(selector, attributes) {
      setElementAttributes(getElement(document.head, selector), attributes);
  }

  function setElementAttributes(element, attributes) {
      if (element) {
          Object.keys(attributes).forEach(function (attrName) {
              if (isRemoveValue(attributes[attrName])) {
                  element.removeAttribute(attrName);
              } else {
                  element.setAttribute(attrName, attributes[attrName]);
              }
          });
      }
  }

  function getElement(parent, selector) {
      var element = parent.querySelector(selector);
      if (!element && conf.debug) {
          console.error('Headful: Element \'' + selector + '\' was not found.');
      }
      return element;
  }

  function setOgLocaleIfValid(locale) {
      if (isRemoveValue(locale)) {
          propertySetters.ogLocale(locale);
      } else if (locale.match(/^[a-z]{2}-[a-z]{2}$/i)) {
          var _locale$split = locale.split('-'),
              _locale$split2 = _slicedToArray(_locale$split, 2),
              language = _locale$split2[0],
              region = _locale$split2[1];

          var ogLocale = language + '_' + region.toUpperCase();
          propertySetters.ogLocale(ogLocale);
      }
  }

  function isRemoveValue(val) {
      return val === undefined || val === null;
  }
  });

  unwrapExports(headful_1);

  var vueHeadful = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
      value: true
  });



  var _headful2 = _interopRequireDefault(headful_1);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var handler = function handler(props) {
      return (0, _headful2.default)(getPassedProps(props));
  };

  exports.default = {
      name: 'vue-headful',
      props: Object.keys(_headful2.default.props),
      watch: {
          '$props': {
              handler: handler,
              deep: true,
              immediate: true
          }
      },
      activated: function activated() {
          // required for keep-alive components https://vuejs.org/v2/api/#keep-alive
          handler(this.$props);
      },
      render: function render() {}
  };


  function getPassedProps(props) {
      return Object.keys(props).reduce(function (passedProps, propKey) {
          if (props[propKey] !== undefined) {
              passedProps[propKey] = props[propKey];
          }
          return passedProps;
      }, {});
  }
  });

  var vueHeadful$1 = unwrapExports(vueHeadful);

  /*!
    * vue-router v3.1.5
    * (c) 2020 Evan You
    * @license MIT
    */
  /*  */

  function assert (condition, message) {
    if (!condition) {
      throw new Error(("[vue-router] " + message))
    }
  }

  function warn$1 (condition, message) {
    if ( !condition) {
      typeof console !== 'undefined' && console.warn(("[vue-router] " + message));
    }
  }

  function isError (err) {
    return Object.prototype.toString.call(err).indexOf('Error') > -1
  }

  function isExtendedError (constructor, err) {
    return (
      err instanceof constructor ||
      // _name is to support IE9 too
      (err && (err.name === constructor.name || err._name === constructor._name))
    )
  }

  function extend$1 (a, b) {
    for (var key in b) {
      a[key] = b[key];
    }
    return a
  }

  var View = {
    name: 'RouterView',
    functional: true,
    props: {
      name: {
        type: String,
        default: 'default'
      }
    },
    render: function render (_, ref) {
      var props = ref.props;
      var children = ref.children;
      var parent = ref.parent;
      var data = ref.data;

      // used by devtools to display a router-view badge
      data.routerView = true;

      // directly use parent context's createElement() function
      // so that components rendered by router-view can resolve named slots
      var h = parent.$createElement;
      var name = props.name;
      var route = parent.$route;
      var cache = parent._routerViewCache || (parent._routerViewCache = {});

      // determine current view depth, also check to see if the tree
      // has been toggled inactive but kept-alive.
      var depth = 0;
      var inactive = false;
      while (parent && parent._routerRoot !== parent) {
        var vnodeData = parent.$vnode ? parent.$vnode.data : {};
        if (vnodeData.routerView) {
          depth++;
        }
        if (vnodeData.keepAlive && parent._directInactive && parent._inactive) {
          inactive = true;
        }
        parent = parent.$parent;
      }
      data.routerViewDepth = depth;

      // render previous view if the tree is inactive and kept-alive
      if (inactive) {
        var cachedData = cache[name];
        var cachedComponent = cachedData && cachedData.component;
        if (cachedComponent) {
          // #2301
          // pass props
          if (cachedData.configProps) {
            fillPropsinData(cachedComponent, data, cachedData.route, cachedData.configProps);
          }
          return h(cachedComponent, data, children)
        } else {
          // render previous empty view
          return h()
        }
      }

      var matched = route.matched[depth];
      var component = matched && matched.components[name];

      // render empty node if no matched route or no config component
      if (!matched || !component) {
        cache[name] = null;
        return h()
      }

      // cache component
      cache[name] = { component: component };

      // attach instance registration hook
      // this will be called in the instance's injected lifecycle hooks
      data.registerRouteInstance = function (vm, val) {
        // val could be undefined for unregistration
        var current = matched.instances[name];
        if (
          (val && current !== vm) ||
          (!val && current === vm)
        ) {
          matched.instances[name] = val;
        }
      }

      // also register instance in prepatch hook
      // in case the same component instance is reused across different routes
      ;(data.hook || (data.hook = {})).prepatch = function (_, vnode) {
        matched.instances[name] = vnode.componentInstance;
      };

      // register instance in init hook
      // in case kept-alive component be actived when routes changed
      data.hook.init = function (vnode) {
        if (vnode.data.keepAlive &&
          vnode.componentInstance &&
          vnode.componentInstance !== matched.instances[name]
        ) {
          matched.instances[name] = vnode.componentInstance;
        }
      };

      var configProps = matched.props && matched.props[name];
      // save route and configProps in cachce
      if (configProps) {
        extend$1(cache[name], {
          route: route,
          configProps: configProps
        });
        fillPropsinData(component, data, route, configProps);
      }

      return h(component, data, children)
    }
  };

  function fillPropsinData (component, data, route, configProps) {
    // resolve props
    var propsToPass = data.props = resolveProps(route, configProps);
    if (propsToPass) {
      // clone to prevent mutation
      propsToPass = data.props = extend$1({}, propsToPass);
      // pass non-declared props as attrs
      var attrs = data.attrs = data.attrs || {};
      for (var key in propsToPass) {
        if (!component.props || !(key in component.props)) {
          attrs[key] = propsToPass[key];
          delete propsToPass[key];
        }
      }
    }
  }

  function resolveProps (route, config) {
    switch (typeof config) {
      case 'undefined':
        return
      case 'object':
        return config
      case 'function':
        return config(route)
      case 'boolean':
        return config ? route.params : undefined
      default:
        {
          warn$1(
            false,
            "props in \"" + (route.path) + "\" is a " + (typeof config) + ", " +
            "expecting an object, function or boolean."
          );
        }
    }
  }

  /*  */

  var encodeReserveRE = /[!'()*]/g;
  var encodeReserveReplacer = function (c) { return '%' + c.charCodeAt(0).toString(16); };
  var commaRE = /%2C/g;

  // fixed encodeURIComponent which is more conformant to RFC3986:
  // - escapes [!'()*]
  // - preserve commas
  var encode = function (str) { return encodeURIComponent(str)
    .replace(encodeReserveRE, encodeReserveReplacer)
    .replace(commaRE, ','); };

  var decode = decodeURIComponent;

  function resolveQuery (
    query,
    extraQuery,
    _parseQuery
  ) {
    if ( extraQuery === void 0 ) extraQuery = {};

    var parse = _parseQuery || parseQuery;
    var parsedQuery;
    try {
      parsedQuery = parse(query || '');
    } catch (e) {
       warn$1(false, e.message);
      parsedQuery = {};
    }
    for (var key in extraQuery) {
      parsedQuery[key] = extraQuery[key];
    }
    return parsedQuery
  }

  function parseQuery (query) {
    var res = {};

    query = query.trim().replace(/^(\?|#|&)/, '');

    if (!query) {
      return res
    }

    query.split('&').forEach(function (param) {
      var parts = param.replace(/\+/g, ' ').split('=');
      var key = decode(parts.shift());
      var val = parts.length > 0
        ? decode(parts.join('='))
        : null;

      if (res[key] === undefined) {
        res[key] = val;
      } else if (Array.isArray(res[key])) {
        res[key].push(val);
      } else {
        res[key] = [res[key], val];
      }
    });

    return res
  }

  function stringifyQuery (obj) {
    var res = obj ? Object.keys(obj).map(function (key) {
      var val = obj[key];

      if (val === undefined) {
        return ''
      }

      if (val === null) {
        return encode(key)
      }

      if (Array.isArray(val)) {
        var result = [];
        val.forEach(function (val2) {
          if (val2 === undefined) {
            return
          }
          if (val2 === null) {
            result.push(encode(key));
          } else {
            result.push(encode(key) + '=' + encode(val2));
          }
        });
        return result.join('&')
      }

      return encode(key) + '=' + encode(val)
    }).filter(function (x) { return x.length > 0; }).join('&') : null;
    return res ? ("?" + res) : ''
  }

  /*  */

  var trailingSlashRE = /\/?$/;

  function createRoute (
    record,
    location,
    redirectedFrom,
    router
  ) {
    var stringifyQuery = router && router.options.stringifyQuery;

    var query = location.query || {};
    try {
      query = clone(query);
    } catch (e) {}

    var route = {
      name: location.name || (record && record.name),
      meta: (record && record.meta) || {},
      path: location.path || '/',
      hash: location.hash || '',
      query: query,
      params: location.params || {},
      fullPath: getFullPath(location, stringifyQuery),
      matched: record ? formatMatch(record) : []
    };
    if (redirectedFrom) {
      route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery);
    }
    return Object.freeze(route)
  }

  function clone (value) {
    if (Array.isArray(value)) {
      return value.map(clone)
    } else if (value && typeof value === 'object') {
      var res = {};
      for (var key in value) {
        res[key] = clone(value[key]);
      }
      return res
    } else {
      return value
    }
  }

  // the starting route that represents the initial state
  var START = createRoute(null, {
    path: '/'
  });

  function formatMatch (record) {
    var res = [];
    while (record) {
      res.unshift(record);
      record = record.parent;
    }
    return res
  }

  function getFullPath (
    ref,
    _stringifyQuery
  ) {
    var path = ref.path;
    var query = ref.query; if ( query === void 0 ) query = {};
    var hash = ref.hash; if ( hash === void 0 ) hash = '';

    var stringify = _stringifyQuery || stringifyQuery;
    return (path || '/') + stringify(query) + hash
  }

  function isSameRoute (a, b) {
    if (b === START) {
      return a === b
    } else if (!b) {
      return false
    } else if (a.path && b.path) {
      return (
        a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') &&
        a.hash === b.hash &&
        isObjectEqual(a.query, b.query)
      )
    } else if (a.name && b.name) {
      return (
        a.name === b.name &&
        a.hash === b.hash &&
        isObjectEqual(a.query, b.query) &&
        isObjectEqual(a.params, b.params)
      )
    } else {
      return false
    }
  }

  function isObjectEqual (a, b) {
    if ( a === void 0 ) a = {};
    if ( b === void 0 ) b = {};

    // handle null value #1566
    if (!a || !b) { return a === b }
    var aKeys = Object.keys(a);
    var bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) {
      return false
    }
    return aKeys.every(function (key) {
      var aVal = a[key];
      var bVal = b[key];
      // check nested equality
      if (typeof aVal === 'object' && typeof bVal === 'object') {
        return isObjectEqual(aVal, bVal)
      }
      return String(aVal) === String(bVal)
    })
  }

  function isIncludedRoute (current, target) {
    return (
      current.path.replace(trailingSlashRE, '/').indexOf(
        target.path.replace(trailingSlashRE, '/')
      ) === 0 &&
      (!target.hash || current.hash === target.hash) &&
      queryIncludes(current.query, target.query)
    )
  }

  function queryIncludes (current, target) {
    for (var key in target) {
      if (!(key in current)) {
        return false
      }
    }
    return true
  }

  /*  */

  function resolvePath (
    relative,
    base,
    append
  ) {
    var firstChar = relative.charAt(0);
    if (firstChar === '/') {
      return relative
    }

    if (firstChar === '?' || firstChar === '#') {
      return base + relative
    }

    var stack = base.split('/');

    // remove trailing segment if:
    // - not appending
    // - appending to trailing slash (last segment is empty)
    if (!append || !stack[stack.length - 1]) {
      stack.pop();
    }

    // resolve relative path
    var segments = relative.replace(/^\//, '').split('/');
    for (var i = 0; i < segments.length; i++) {
      var segment = segments[i];
      if (segment === '..') {
        stack.pop();
      } else if (segment !== '.') {
        stack.push(segment);
      }
    }

    // ensure leading slash
    if (stack[0] !== '') {
      stack.unshift('');
    }

    return stack.join('/')
  }

  function parsePath$1 (path) {
    var hash = '';
    var query = '';

    var hashIndex = path.indexOf('#');
    if (hashIndex >= 0) {
      hash = path.slice(hashIndex);
      path = path.slice(0, hashIndex);
    }

    var queryIndex = path.indexOf('?');
    if (queryIndex >= 0) {
      query = path.slice(queryIndex + 1);
      path = path.slice(0, queryIndex);
    }

    return {
      path: path,
      query: query,
      hash: hash
    }
  }

  function cleanPath (path) {
    return path.replace(/\/\//g, '/')
  }

  var isarray = Array.isArray || function (arr) {
    return Object.prototype.toString.call(arr) == '[object Array]';
  };

  /**
   * Expose `pathToRegexp`.
   */
  var pathToRegexp_1 = pathToRegexp;
  var parse_1 = parse;
  var compile_1 = compile;
  var tokensToFunction_1 = tokensToFunction;
  var tokensToRegExp_1 = tokensToRegExp;

  /**
   * The main path matching regexp utility.
   *
   * @type {RegExp}
   */
  var PATH_REGEXP = new RegExp([
    // Match escaped characters that would otherwise appear in future matches.
    // This allows the user to escape special characters that won't transform.
    '(\\\\.)',
    // Match Express-style parameters and un-named parameters with a prefix
    // and optional suffixes. Matches appear as:
    //
    // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
    // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
    // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
    '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
  ].join('|'), 'g');

  /**
   * Parse a string for the raw tokens.
   *
   * @param  {string}  str
   * @param  {Object=} options
   * @return {!Array}
   */
  function parse (str, options) {
    var tokens = [];
    var key = 0;
    var index = 0;
    var path = '';
    var defaultDelimiter = options && options.delimiter || '/';
    var res;

    while ((res = PATH_REGEXP.exec(str)) != null) {
      var m = res[0];
      var escaped = res[1];
      var offset = res.index;
      path += str.slice(index, offset);
      index = offset + m.length;

      // Ignore already escaped sequences.
      if (escaped) {
        path += escaped[1];
        continue
      }

      var next = str[index];
      var prefix = res[2];
      var name = res[3];
      var capture = res[4];
      var group = res[5];
      var modifier = res[6];
      var asterisk = res[7];

      // Push the current path onto the tokens.
      if (path) {
        tokens.push(path);
        path = '';
      }

      var partial = prefix != null && next != null && next !== prefix;
      var repeat = modifier === '+' || modifier === '*';
      var optional = modifier === '?' || modifier === '*';
      var delimiter = res[2] || defaultDelimiter;
      var pattern = capture || group;

      tokens.push({
        name: name || key++,
        prefix: prefix || '',
        delimiter: delimiter,
        optional: optional,
        repeat: repeat,
        partial: partial,
        asterisk: !!asterisk,
        pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
      });
    }

    // Match any characters still remaining.
    if (index < str.length) {
      path += str.substr(index);
    }

    // If the path exists, push it onto the end.
    if (path) {
      tokens.push(path);
    }

    return tokens
  }

  /**
   * Compile a string to a template function for the path.
   *
   * @param  {string}             str
   * @param  {Object=}            options
   * @return {!function(Object=, Object=)}
   */
  function compile (str, options) {
    return tokensToFunction(parse(str, options))
  }

  /**
   * Prettier encoding of URI path segments.
   *
   * @param  {string}
   * @return {string}
   */
  function encodeURIComponentPretty (str) {
    return encodeURI(str).replace(/[\/?#]/g, function (c) {
      return '%' + c.charCodeAt(0).toString(16).toUpperCase()
    })
  }

  /**
   * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
   *
   * @param  {string}
   * @return {string}
   */
  function encodeAsterisk (str) {
    return encodeURI(str).replace(/[?#]/g, function (c) {
      return '%' + c.charCodeAt(0).toString(16).toUpperCase()
    })
  }

  /**
   * Expose a method for transforming tokens into the path function.
   */
  function tokensToFunction (tokens) {
    // Compile all the tokens into regexps.
    var matches = new Array(tokens.length);

    // Compile all the patterns before compilation.
    for (var i = 0; i < tokens.length; i++) {
      if (typeof tokens[i] === 'object') {
        matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$');
      }
    }

    return function (obj, opts) {
      var path = '';
      var data = obj || {};
      var options = opts || {};
      var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

      for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];

        if (typeof token === 'string') {
          path += token;

          continue
        }

        var value = data[token.name];
        var segment;

        if (value == null) {
          if (token.optional) {
            // Prepend partial segment prefixes.
            if (token.partial) {
              path += token.prefix;
            }

            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to be defined')
          }
        }

        if (isarray(value)) {
          if (!token.repeat) {
            throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
          }

          if (value.length === 0) {
            if (token.optional) {
              continue
            } else {
              throw new TypeError('Expected "' + token.name + '" to not be empty')
            }
          }

          for (var j = 0; j < value.length; j++) {
            segment = encode(value[j]);

            if (!matches[i].test(segment)) {
              throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
            }

            path += (j === 0 ? token.prefix : token.delimiter) + segment;
          }

          continue
        }

        segment = token.asterisk ? encodeAsterisk(value) : encode(value);

        if (!matches[i].test(segment)) {
          throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
        }

        path += token.prefix + segment;
      }

      return path
    }
  }

  /**
   * Escape a regular expression string.
   *
   * @param  {string} str
   * @return {string}
   */
  function escapeString (str) {
    return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
  }

  /**
   * Escape the capturing group by escaping special characters and meaning.
   *
   * @param  {string} group
   * @return {string}
   */
  function escapeGroup (group) {
    return group.replace(/([=!:$\/()])/g, '\\$1')
  }

  /**
   * Attach the keys as a property of the regexp.
   *
   * @param  {!RegExp} re
   * @param  {Array}   keys
   * @return {!RegExp}
   */
  function attachKeys (re, keys) {
    re.keys = keys;
    return re
  }

  /**
   * Get the flags for a regexp from the options.
   *
   * @param  {Object} options
   * @return {string}
   */
  function flags (options) {
    return options.sensitive ? '' : 'i'
  }

  /**
   * Pull out keys from a regexp.
   *
   * @param  {!RegExp} path
   * @param  {!Array}  keys
   * @return {!RegExp}
   */
  function regexpToRegexp (path, keys) {
    // Use a negative lookahead to match only capturing groups.
    var groups = path.source.match(/\((?!\?)/g);

    if (groups) {
      for (var i = 0; i < groups.length; i++) {
        keys.push({
          name: i,
          prefix: null,
          delimiter: null,
          optional: false,
          repeat: false,
          partial: false,
          asterisk: false,
          pattern: null
        });
      }
    }

    return attachKeys(path, keys)
  }

  /**
   * Transform an array into a regexp.
   *
   * @param  {!Array}  path
   * @param  {Array}   keys
   * @param  {!Object} options
   * @return {!RegExp}
   */
  function arrayToRegexp (path, keys, options) {
    var parts = [];

    for (var i = 0; i < path.length; i++) {
      parts.push(pathToRegexp(path[i], keys, options).source);
    }

    var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

    return attachKeys(regexp, keys)
  }

  /**
   * Create a path regexp from string input.
   *
   * @param  {string}  path
   * @param  {!Array}  keys
   * @param  {!Object} options
   * @return {!RegExp}
   */
  function stringToRegexp (path, keys, options) {
    return tokensToRegExp(parse(path, options), keys, options)
  }

  /**
   * Expose a function for taking tokens and returning a RegExp.
   *
   * @param  {!Array}          tokens
   * @param  {(Array|Object)=} keys
   * @param  {Object=}         options
   * @return {!RegExp}
   */
  function tokensToRegExp (tokens, keys, options) {
    if (!isarray(keys)) {
      options = /** @type {!Object} */ (keys || options);
      keys = [];
    }

    options = options || {};

    var strict = options.strict;
    var end = options.end !== false;
    var route = '';

    // Iterate over the tokens and create our regexp string.
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        route += escapeString(token);
      } else {
        var prefix = escapeString(token.prefix);
        var capture = '(?:' + token.pattern + ')';

        keys.push(token);

        if (token.repeat) {
          capture += '(?:' + prefix + capture + ')*';
        }

        if (token.optional) {
          if (!token.partial) {
            capture = '(?:' + prefix + '(' + capture + '))?';
          } else {
            capture = prefix + '(' + capture + ')?';
          }
        } else {
          capture = prefix + '(' + capture + ')';
        }

        route += capture;
      }
    }

    var delimiter = escapeString(options.delimiter || '/');
    var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

    // In non-strict mode we allow a slash at the end of match. If the path to
    // match already ends with a slash, we remove it for consistency. The slash
    // is valid at the end of a path match, not in the middle. This is important
    // in non-ending mode, where "/test/" shouldn't match "/test//route".
    if (!strict) {
      route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
    }

    if (end) {
      route += '$';
    } else {
      // In non-ending mode, we need the capturing groups to match as much as
      // possible by using a positive lookahead to the end or next path segment.
      route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
    }

    return attachKeys(new RegExp('^' + route, flags(options)), keys)
  }

  /**
   * Normalize the given path string, returning a regular expression.
   *
   * An empty array can be passed in for the keys, which will hold the
   * placeholder key descriptions. For example, using `/user/:id`, `keys` will
   * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
   *
   * @param  {(string|RegExp|Array)} path
   * @param  {(Array|Object)=}       keys
   * @param  {Object=}               options
   * @return {!RegExp}
   */
  function pathToRegexp (path, keys, options) {
    if (!isarray(keys)) {
      options = /** @type {!Object} */ (keys || options);
      keys = [];
    }

    options = options || {};

    if (path instanceof RegExp) {
      return regexpToRegexp(path, /** @type {!Array} */ (keys))
    }

    if (isarray(path)) {
      return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
    }

    return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
  }
  pathToRegexp_1.parse = parse_1;
  pathToRegexp_1.compile = compile_1;
  pathToRegexp_1.tokensToFunction = tokensToFunction_1;
  pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

  /*  */

  // $flow-disable-line
  var regexpCompileCache = Object.create(null);

  function fillParams (
    path,
    params,
    routeMsg
  ) {
    params = params || {};
    try {
      var filler =
        regexpCompileCache[path] ||
        (regexpCompileCache[path] = pathToRegexp_1.compile(path));

      // Fix #2505 resolving asterisk routes { name: 'not-found', params: { pathMatch: '/not-found' }}
      if (params.pathMatch) { params[0] = params.pathMatch; }

      return filler(params, { pretty: true })
    } catch (e) {
      {
        // Fix #3072 no warn if `pathMatch` is string
        warn$1(typeof params.pathMatch === 'string', ("missing param for " + routeMsg + ": " + (e.message)));
      }
      return ''
    } finally {
      // delete the 0 if it was added
      delete params[0];
    }
  }

  /*  */

  function normalizeLocation (
    raw,
    current,
    append,
    router
  ) {
    var next = typeof raw === 'string' ? { path: raw } : raw;
    // named target
    if (next._normalized) {
      return next
    } else if (next.name) {
      next = extend$1({}, raw);
      var params = next.params;
      if (params && typeof params === 'object') {
        next.params = extend$1({}, params);
      }
      return next
    }

    // relative params
    if (!next.path && next.params && current) {
      next = extend$1({}, next);
      next._normalized = true;
      var params$1 = extend$1(extend$1({}, current.params), next.params);
      if (current.name) {
        next.name = current.name;
        next.params = params$1;
      } else if (current.matched.length) {
        var rawPath = current.matched[current.matched.length - 1].path;
        next.path = fillParams(rawPath, params$1, ("path " + (current.path)));
      } else {
        warn$1(false, "relative params navigation requires a current route.");
      }
      return next
    }

    var parsedPath = parsePath$1(next.path || '');
    var basePath = (current && current.path) || '/';
    var path = parsedPath.path
      ? resolvePath(parsedPath.path, basePath, append || next.append)
      : basePath;

    var query = resolveQuery(
      parsedPath.query,
      next.query,
      router && router.options.parseQuery
    );

    var hash = next.hash || parsedPath.hash;
    if (hash && hash.charAt(0) !== '#') {
      hash = "#" + hash;
    }

    return {
      _normalized: true,
      path: path,
      query: query,
      hash: hash
    }
  }

  /*  */

  // work around weird flow bug
  var toTypes = [String, Object];
  var eventTypes = [String, Array];

  var noop$1 = function () {};

  var Link = {
    name: 'RouterLink',
    props: {
      to: {
        type: toTypes,
        required: true
      },
      tag: {
        type: String,
        default: 'a'
      },
      exact: Boolean,
      append: Boolean,
      replace: Boolean,
      activeClass: String,
      exactActiveClass: String,
      event: {
        type: eventTypes,
        default: 'click'
      }
    },
    render: function render (h) {
      var this$1 = this;

      var router = this.$router;
      var current = this.$route;
      var ref = router.resolve(
        this.to,
        current,
        this.append
      );
      var location = ref.location;
      var route = ref.route;
      var href = ref.href;

      var classes = {};
      var globalActiveClass = router.options.linkActiveClass;
      var globalExactActiveClass = router.options.linkExactActiveClass;
      // Support global empty active class
      var activeClassFallback =
        globalActiveClass == null ? 'router-link-active' : globalActiveClass;
      var exactActiveClassFallback =
        globalExactActiveClass == null
          ? 'router-link-exact-active'
          : globalExactActiveClass;
      var activeClass =
        this.activeClass == null ? activeClassFallback : this.activeClass;
      var exactActiveClass =
        this.exactActiveClass == null
          ? exactActiveClassFallback
          : this.exactActiveClass;

      var compareTarget = route.redirectedFrom
        ? createRoute(null, normalizeLocation(route.redirectedFrom), null, router)
        : route;

      classes[exactActiveClass] = isSameRoute(current, compareTarget);
      classes[activeClass] = this.exact
        ? classes[exactActiveClass]
        : isIncludedRoute(current, compareTarget);

      var handler = function (e) {
        if (guardEvent(e)) {
          if (this$1.replace) {
            router.replace(location, noop$1);
          } else {
            router.push(location, noop$1);
          }
        }
      };

      var on = { click: guardEvent };
      if (Array.isArray(this.event)) {
        this.event.forEach(function (e) {
          on[e] = handler;
        });
      } else {
        on[this.event] = handler;
      }

      var data = { class: classes };

      var scopedSlot =
        !this.$scopedSlots.$hasNormal &&
        this.$scopedSlots.default &&
        this.$scopedSlots.default({
          href: href,
          route: route,
          navigate: handler,
          isActive: classes[activeClass],
          isExactActive: classes[exactActiveClass]
        });

      if (scopedSlot) {
        if (scopedSlot.length === 1) {
          return scopedSlot[0]
        } else if (scopedSlot.length > 1 || !scopedSlot.length) {
          {
            warn$1(
              false,
              ("RouterLink with to=\"" + (this.to) + "\" is trying to use a scoped slot but it didn't provide exactly one child. Wrapping the content with a span element.")
            );
          }
          return scopedSlot.length === 0 ? h() : h('span', {}, scopedSlot)
        }
      }

      if (this.tag === 'a') {
        data.on = on;
        data.attrs = { href: href };
      } else {
        // find the first <a> child and apply listener and href
        var a = findAnchor(this.$slots.default);
        if (a) {
          // in case the <a> is a static node
          a.isStatic = false;
          var aData = (a.data = extend$1({}, a.data));
          aData.on = aData.on || {};
          // transform existing events in both objects into arrays so we can push later
          for (var event in aData.on) {
            var handler$1 = aData.on[event];
            if (event in on) {
              aData.on[event] = Array.isArray(handler$1) ? handler$1 : [handler$1];
            }
          }
          // append new listeners for router-link
          for (var event$1 in on) {
            if (event$1 in aData.on) {
              // on[event] is always a function
              aData.on[event$1].push(on[event$1]);
            } else {
              aData.on[event$1] = handler;
            }
          }

          var aAttrs = (a.data.attrs = extend$1({}, a.data.attrs));
          aAttrs.href = href;
        } else {
          // doesn't have <a> child, apply listener to self
          data.on = on;
        }
      }

      return h(this.tag, data, this.$slots.default)
    }
  };

  function guardEvent (e) {
    // don't redirect with control keys
    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) { return }
    // don't redirect when preventDefault called
    if (e.defaultPrevented) { return }
    // don't redirect on right click
    if (e.button !== undefined && e.button !== 0) { return }
    // don't redirect if `target="_blank"`
    if (e.currentTarget && e.currentTarget.getAttribute) {
      var target = e.currentTarget.getAttribute('target');
      if (/\b_blank\b/i.test(target)) { return }
    }
    // this may be a Weex event which doesn't have this method
    if (e.preventDefault) {
      e.preventDefault();
    }
    return true
  }

  function findAnchor (children) {
    if (children) {
      var child;
      for (var i = 0; i < children.length; i++) {
        child = children[i];
        if (child.tag === 'a') {
          return child
        }
        if (child.children && (child = findAnchor(child.children))) {
          return child
        }
      }
    }
  }

  var _Vue;

  function install (Vue) {
    if (install.installed && _Vue === Vue) { return }
    install.installed = true;

    _Vue = Vue;

    var isDef = function (v) { return v !== undefined; };

    var registerInstance = function (vm, callVal) {
      var i = vm.$options._parentVnode;
      if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
        i(vm, callVal);
      }
    };

    Vue.mixin({
      beforeCreate: function beforeCreate () {
        if (isDef(this.$options.router)) {
          this._routerRoot = this;
          this._router = this.$options.router;
          this._router.init(this);
          Vue.util.defineReactive(this, '_route', this._router.history.current);
        } else {
          this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
        }
        registerInstance(this, this);
      },
      destroyed: function destroyed () {
        registerInstance(this);
      }
    });

    Object.defineProperty(Vue.prototype, '$router', {
      get: function get () { return this._routerRoot._router }
    });

    Object.defineProperty(Vue.prototype, '$route', {
      get: function get () { return this._routerRoot._route }
    });

    Vue.component('RouterView', View);
    Vue.component('RouterLink', Link);

    var strats = Vue.config.optionMergeStrategies;
    // use the same hook merging strategy for route hooks
    strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created;
  }

  /*  */

  var inBrowser$1 = typeof window !== 'undefined';

  /*  */

  function createRouteMap (
    routes,
    oldPathList,
    oldPathMap,
    oldNameMap
  ) {
    // the path list is used to control path matching priority
    var pathList = oldPathList || [];
    // $flow-disable-line
    var pathMap = oldPathMap || Object.create(null);
    // $flow-disable-line
    var nameMap = oldNameMap || Object.create(null);

    routes.forEach(function (route) {
      addRouteRecord(pathList, pathMap, nameMap, route);
    });

    // ensure wildcard routes are always at the end
    for (var i = 0, l = pathList.length; i < l; i++) {
      if (pathList[i] === '*') {
        pathList.push(pathList.splice(i, 1)[0]);
        l--;
        i--;
      }
    }

    {
      // warn if routes do not include leading slashes
      var found = pathList
      // check for missing leading slash
        .filter(function (path) { return path && path.charAt(0) !== '*' && path.charAt(0) !== '/'; });

      if (found.length > 0) {
        var pathNames = found.map(function (path) { return ("- " + path); }).join('\n');
        warn$1(false, ("Non-nested routes must include a leading slash character. Fix the following routes: \n" + pathNames));
      }
    }

    return {
      pathList: pathList,
      pathMap: pathMap,
      nameMap: nameMap
    }
  }

  function addRouteRecord (
    pathList,
    pathMap,
    nameMap,
    route,
    parent,
    matchAs
  ) {
    var path = route.path;
    var name = route.name;
    {
      assert(path != null, "\"path\" is required in a route configuration.");
      assert(
        typeof route.component !== 'string',
        "route config \"component\" for path: " + (String(
          path || name
        )) + " cannot be a " + "string id. Use an actual component instead."
      );
    }

    var pathToRegexpOptions =
      route.pathToRegexpOptions || {};
    var normalizedPath = normalizePath(path, parent, pathToRegexpOptions.strict);

    if (typeof route.caseSensitive === 'boolean') {
      pathToRegexpOptions.sensitive = route.caseSensitive;
    }

    var record = {
      path: normalizedPath,
      regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
      components: route.components || { default: route.component },
      instances: {},
      name: name,
      parent: parent,
      matchAs: matchAs,
      redirect: route.redirect,
      beforeEnter: route.beforeEnter,
      meta: route.meta || {},
      props:
        route.props == null
          ? {}
          : route.components
            ? route.props
            : { default: route.props }
    };

    if (route.children) {
      // Warn if route is named, does not redirect and has a default child route.
      // If users navigate to this route by name, the default child will
      // not be rendered (GH Issue #629)
      {
        if (
          route.name &&
          !route.redirect &&
          route.children.some(function (child) { return /^\/?$/.test(child.path); })
        ) {
          warn$1(
            false,
            "Named Route '" + (route.name) + "' has a default child route. " +
              "When navigating to this named route (:to=\"{name: '" + (route.name) + "'\"), " +
              "the default child route will not be rendered. Remove the name from " +
              "this route and use the name of the default child route for named " +
              "links instead."
          );
        }
      }
      route.children.forEach(function (child) {
        var childMatchAs = matchAs
          ? cleanPath((matchAs + "/" + (child.path)))
          : undefined;
        addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs);
      });
    }

    if (!pathMap[record.path]) {
      pathList.push(record.path);
      pathMap[record.path] = record;
    }

    if (route.alias !== undefined) {
      var aliases = Array.isArray(route.alias) ? route.alias : [route.alias];
      for (var i = 0; i < aliases.length; ++i) {
        var alias = aliases[i];
        if ( alias === path) {
          warn$1(
            false,
            ("Found an alias with the same value as the path: \"" + path + "\". You have to remove that alias. It will be ignored in development.")
          );
          // skip in dev to make it work
          continue
        }

        var aliasRoute = {
          path: alias,
          children: route.children
        };
        addRouteRecord(
          pathList,
          pathMap,
          nameMap,
          aliasRoute,
          parent,
          record.path || '/' // matchAs
        );
      }
    }

    if (name) {
      if (!nameMap[name]) {
        nameMap[name] = record;
      } else if ( !matchAs) {
        warn$1(
          false,
          "Duplicate named routes definition: " +
            "{ name: \"" + name + "\", path: \"" + (record.path) + "\" }"
        );
      }
    }
  }

  function compileRouteRegex (
    path,
    pathToRegexpOptions
  ) {
    var regex = pathToRegexp_1(path, [], pathToRegexpOptions);
    {
      var keys = Object.create(null);
      regex.keys.forEach(function (key) {
        warn$1(
          !keys[key.name],
          ("Duplicate param keys in route with path: \"" + path + "\"")
        );
        keys[key.name] = true;
      });
    }
    return regex
  }

  function normalizePath (
    path,
    parent,
    strict
  ) {
    if (!strict) { path = path.replace(/\/$/, ''); }
    if (path[0] === '/') { return path }
    if (parent == null) { return path }
    return cleanPath(((parent.path) + "/" + path))
  }

  /*  */



  function createMatcher (
    routes,
    router
  ) {
    var ref = createRouteMap(routes);
    var pathList = ref.pathList;
    var pathMap = ref.pathMap;
    var nameMap = ref.nameMap;

    function addRoutes (routes) {
      createRouteMap(routes, pathList, pathMap, nameMap);
    }

    function match (
      raw,
      currentRoute,
      redirectedFrom
    ) {
      var location = normalizeLocation(raw, currentRoute, false, router);
      var name = location.name;

      if (name) {
        var record = nameMap[name];
        {
          warn$1(record, ("Route with name '" + name + "' does not exist"));
        }
        if (!record) { return _createRoute(null, location) }
        var paramNames = record.regex.keys
          .filter(function (key) { return !key.optional; })
          .map(function (key) { return key.name; });

        if (typeof location.params !== 'object') {
          location.params = {};
        }

        if (currentRoute && typeof currentRoute.params === 'object') {
          for (var key in currentRoute.params) {
            if (!(key in location.params) && paramNames.indexOf(key) > -1) {
              location.params[key] = currentRoute.params[key];
            }
          }
        }

        location.path = fillParams(record.path, location.params, ("named route \"" + name + "\""));
        return _createRoute(record, location, redirectedFrom)
      } else if (location.path) {
        location.params = {};
        for (var i = 0; i < pathList.length; i++) {
          var path = pathList[i];
          var record$1 = pathMap[path];
          if (matchRoute(record$1.regex, location.path, location.params)) {
            return _createRoute(record$1, location, redirectedFrom)
          }
        }
      }
      // no match
      return _createRoute(null, location)
    }

    function redirect (
      record,
      location
    ) {
      var originalRedirect = record.redirect;
      var redirect = typeof originalRedirect === 'function'
        ? originalRedirect(createRoute(record, location, null, router))
        : originalRedirect;

      if (typeof redirect === 'string') {
        redirect = { path: redirect };
      }

      if (!redirect || typeof redirect !== 'object') {
        {
          warn$1(
            false, ("invalid redirect option: " + (JSON.stringify(redirect)))
          );
        }
        return _createRoute(null, location)
      }

      var re = redirect;
      var name = re.name;
      var path = re.path;
      var query = location.query;
      var hash = location.hash;
      var params = location.params;
      query = re.hasOwnProperty('query') ? re.query : query;
      hash = re.hasOwnProperty('hash') ? re.hash : hash;
      params = re.hasOwnProperty('params') ? re.params : params;

      if (name) {
        // resolved named direct
        var targetRecord = nameMap[name];
        {
          assert(targetRecord, ("redirect failed: named route \"" + name + "\" not found."));
        }
        return match({
          _normalized: true,
          name: name,
          query: query,
          hash: hash,
          params: params
        }, undefined, location)
      } else if (path) {
        // 1. resolve relative redirect
        var rawPath = resolveRecordPath(path, record);
        // 2. resolve params
        var resolvedPath = fillParams(rawPath, params, ("redirect route with path \"" + rawPath + "\""));
        // 3. rematch with existing query and hash
        return match({
          _normalized: true,
          path: resolvedPath,
          query: query,
          hash: hash
        }, undefined, location)
      } else {
        {
          warn$1(false, ("invalid redirect option: " + (JSON.stringify(redirect))));
        }
        return _createRoute(null, location)
      }
    }

    function alias (
      record,
      location,
      matchAs
    ) {
      var aliasedPath = fillParams(matchAs, location.params, ("aliased route with path \"" + matchAs + "\""));
      var aliasedMatch = match({
        _normalized: true,
        path: aliasedPath
      });
      if (aliasedMatch) {
        var matched = aliasedMatch.matched;
        var aliasedRecord = matched[matched.length - 1];
        location.params = aliasedMatch.params;
        return _createRoute(aliasedRecord, location)
      }
      return _createRoute(null, location)
    }

    function _createRoute (
      record,
      location,
      redirectedFrom
    ) {
      if (record && record.redirect) {
        return redirect(record, redirectedFrom || location)
      }
      if (record && record.matchAs) {
        return alias(record, location, record.matchAs)
      }
      return createRoute(record, location, redirectedFrom, router)
    }

    return {
      match: match,
      addRoutes: addRoutes
    }
  }

  function matchRoute (
    regex,
    path,
    params
  ) {
    var m = path.match(regex);

    if (!m) {
      return false
    } else if (!params) {
      return true
    }

    for (var i = 1, len = m.length; i < len; ++i) {
      var key = regex.keys[i - 1];
      var val = typeof m[i] === 'string' ? decodeURIComponent(m[i]) : m[i];
      if (key) {
        // Fix #1994: using * with props: true generates a param named 0
        params[key.name || 'pathMatch'] = val;
      }
    }

    return true
  }

  function resolveRecordPath (path, record) {
    return resolvePath(path, record.parent ? record.parent.path : '/', true)
  }

  /*  */

  // use User Timing api (if present) for more accurate key precision
  var Time =
    inBrowser$1 && window.performance && window.performance.now
      ? window.performance
      : Date;

  function genStateKey () {
    return Time.now().toFixed(3)
  }

  var _key = genStateKey();

  function getStateKey () {
    return _key
  }

  function setStateKey (key) {
    return (_key = key)
  }

  /*  */

  var positionStore = Object.create(null);

  function setupScroll () {
    // Fix for #1585 for Firefox
    // Fix for #2195 Add optional third attribute to workaround a bug in safari https://bugs.webkit.org/show_bug.cgi?id=182678
    // Fix for #2774 Support for apps loaded from Windows file shares not mapped to network drives: replaced location.origin with
    // window.location.protocol + '//' + window.location.host
    // location.host contains the port and location.hostname doesn't
    var protocolAndPath = window.location.protocol + '//' + window.location.host;
    var absolutePath = window.location.href.replace(protocolAndPath, '');
    window.history.replaceState({ key: getStateKey() }, '', absolutePath);
    window.addEventListener('popstate', function (e) {
      saveScrollPosition();
      if (e.state && e.state.key) {
        setStateKey(e.state.key);
      }
    });
  }

  function handleScroll (
    router,
    to,
    from,
    isPop
  ) {
    if (!router.app) {
      return
    }

    var behavior = router.options.scrollBehavior;
    if (!behavior) {
      return
    }

    {
      assert(typeof behavior === 'function', "scrollBehavior must be a function");
    }

    // wait until re-render finishes before scrolling
    router.app.$nextTick(function () {
      var position = getScrollPosition();
      var shouldScroll = behavior.call(
        router,
        to,
        from,
        isPop ? position : null
      );

      if (!shouldScroll) {
        return
      }

      if (typeof shouldScroll.then === 'function') {
        shouldScroll
          .then(function (shouldScroll) {
            scrollToPosition((shouldScroll), position);
          })
          .catch(function (err) {
            {
              assert(false, err.toString());
            }
          });
      } else {
        scrollToPosition(shouldScroll, position);
      }
    });
  }

  function saveScrollPosition () {
    var key = getStateKey();
    if (key) {
      positionStore[key] = {
        x: window.pageXOffset,
        y: window.pageYOffset
      };
    }
  }

  function getScrollPosition () {
    var key = getStateKey();
    if (key) {
      return positionStore[key]
    }
  }

  function getElementPosition (el, offset) {
    var docEl = document.documentElement;
    var docRect = docEl.getBoundingClientRect();
    var elRect = el.getBoundingClientRect();
    return {
      x: elRect.left - docRect.left - offset.x,
      y: elRect.top - docRect.top - offset.y
    }
  }

  function isValidPosition (obj) {
    return isNumber(obj.x) || isNumber(obj.y)
  }

  function normalizePosition (obj) {
    return {
      x: isNumber(obj.x) ? obj.x : window.pageXOffset,
      y: isNumber(obj.y) ? obj.y : window.pageYOffset
    }
  }

  function normalizeOffset (obj) {
    return {
      x: isNumber(obj.x) ? obj.x : 0,
      y: isNumber(obj.y) ? obj.y : 0
    }
  }

  function isNumber (v) {
    return typeof v === 'number'
  }

  var hashStartsWithNumberRE = /^#\d/;

  function scrollToPosition (shouldScroll, position) {
    var isObject = typeof shouldScroll === 'object';
    if (isObject && typeof shouldScroll.selector === 'string') {
      // getElementById would still fail if the selector contains a more complicated query like #main[data-attr]
      // but at the same time, it doesn't make much sense to select an element with an id and an extra selector
      var el = hashStartsWithNumberRE.test(shouldScroll.selector) // $flow-disable-line
        ? document.getElementById(shouldScroll.selector.slice(1)) // $flow-disable-line
        : document.querySelector(shouldScroll.selector);

      if (el) {
        var offset =
          shouldScroll.offset && typeof shouldScroll.offset === 'object'
            ? shouldScroll.offset
            : {};
        offset = normalizeOffset(offset);
        position = getElementPosition(el, offset);
      } else if (isValidPosition(shouldScroll)) {
        position = normalizePosition(shouldScroll);
      }
    } else if (isObject && isValidPosition(shouldScroll)) {
      position = normalizePosition(shouldScroll);
    }

    if (position) {
      window.scrollTo(position.x, position.y);
    }
  }

  /*  */

  var supportsPushState =
    inBrowser$1 &&
    (function () {
      var ua = window.navigator.userAgent;

      if (
        (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
        ua.indexOf('Mobile Safari') !== -1 &&
        ua.indexOf('Chrome') === -1 &&
        ua.indexOf('Windows Phone') === -1
      ) {
        return false
      }

      return window.history && 'pushState' in window.history
    })();

  function pushState (url, replace) {
    saveScrollPosition();
    // try...catch the pushState call to get around Safari
    // DOM Exception 18 where it limits to 100 pushState calls
    var history = window.history;
    try {
      if (replace) {
        // preserve existing history state as it could be overriden by the user
        var stateCopy = extend$1({}, history.state);
        stateCopy.key = getStateKey();
        history.replaceState(stateCopy, '', url);
      } else {
        history.pushState({ key: setStateKey(genStateKey()) }, '', url);
      }
    } catch (e) {
      window.location[replace ? 'replace' : 'assign'](url);
    }
  }

  function replaceState (url) {
    pushState(url, true);
  }

  /*  */

  function runQueue (queue, fn, cb) {
    var step = function (index) {
      if (index >= queue.length) {
        cb();
      } else {
        if (queue[index]) {
          fn(queue[index], function () {
            step(index + 1);
          });
        } else {
          step(index + 1);
        }
      }
    };
    step(0);
  }

  /*  */

  function resolveAsyncComponents (matched) {
    return function (to, from, next) {
      var hasAsync = false;
      var pending = 0;
      var error = null;

      flatMapComponents(matched, function (def, _, match, key) {
        // if it's a function and doesn't have cid attached,
        // assume it's an async component resolve function.
        // we are not using Vue's default async resolving mechanism because
        // we want to halt the navigation until the incoming component has been
        // resolved.
        if (typeof def === 'function' && def.cid === undefined) {
          hasAsync = true;
          pending++;

          var resolve = once$1(function (resolvedDef) {
            if (isESModule(resolvedDef)) {
              resolvedDef = resolvedDef.default;
            }
            // save resolved on async factory in case it's used elsewhere
            def.resolved = typeof resolvedDef === 'function'
              ? resolvedDef
              : _Vue.extend(resolvedDef);
            match.components[key] = resolvedDef;
            pending--;
            if (pending <= 0) {
              next();
            }
          });

          var reject = once$1(function (reason) {
            var msg = "Failed to resolve async component " + key + ": " + reason;
             warn$1(false, msg);
            if (!error) {
              error = isError(reason)
                ? reason
                : new Error(msg);
              next(error);
            }
          });

          var res;
          try {
            res = def(resolve, reject);
          } catch (e) {
            reject(e);
          }
          if (res) {
            if (typeof res.then === 'function') {
              res.then(resolve, reject);
            } else {
              // new syntax in Vue 2.3
              var comp = res.component;
              if (comp && typeof comp.then === 'function') {
                comp.then(resolve, reject);
              }
            }
          }
        }
      });

      if (!hasAsync) { next(); }
    }
  }

  function flatMapComponents (
    matched,
    fn
  ) {
    return flatten(matched.map(function (m) {
      return Object.keys(m.components).map(function (key) { return fn(
        m.components[key],
        m.instances[key],
        m, key
      ); })
    }))
  }

  function flatten (arr) {
    return Array.prototype.concat.apply([], arr)
  }

  var hasSymbol$1 =
    typeof Symbol === 'function' &&
    typeof Symbol.toStringTag === 'symbol';

  function isESModule (obj) {
    return obj.__esModule || (hasSymbol$1 && obj[Symbol.toStringTag] === 'Module')
  }

  // in Webpack 2, require.ensure now also returns a Promise
  // so the resolve/reject functions may get called an extra time
  // if the user uses an arrow function shorthand that happens to
  // return that Promise.
  function once$1 (fn) {
    var called = false;
    return function () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      if (called) { return }
      called = true;
      return fn.apply(this, args)
    }
  }

  var NavigationDuplicated = /*@__PURE__*/(function (Error) {
    function NavigationDuplicated (normalizedLocation) {
      Error.call(this);
      this.name = this._name = 'NavigationDuplicated';
      // passing the message to super() doesn't seem to work in the transpiled version
      this.message = "Navigating to current location (\"" + (normalizedLocation.fullPath) + "\") is not allowed";
      // add a stack property so services like Sentry can correctly display it
      Object.defineProperty(this, 'stack', {
        value: new Error().stack,
        writable: true,
        configurable: true
      });
      // we could also have used
      // Error.captureStackTrace(this, this.constructor)
      // but it only exists on node and chrome
    }

    if ( Error ) NavigationDuplicated.__proto__ = Error;
    NavigationDuplicated.prototype = Object.create( Error && Error.prototype );
    NavigationDuplicated.prototype.constructor = NavigationDuplicated;

    return NavigationDuplicated;
  }(Error));

  // support IE9
  NavigationDuplicated._name = 'NavigationDuplicated';

  /*  */

  var History = function History (router, base) {
    this.router = router;
    this.base = normalizeBase(base);
    // start with a route object that stands for "nowhere"
    this.current = START;
    this.pending = null;
    this.ready = false;
    this.readyCbs = [];
    this.readyErrorCbs = [];
    this.errorCbs = [];
  };

  History.prototype.listen = function listen (cb) {
    this.cb = cb;
  };

  History.prototype.onReady = function onReady (cb, errorCb) {
    if (this.ready) {
      cb();
    } else {
      this.readyCbs.push(cb);
      if (errorCb) {
        this.readyErrorCbs.push(errorCb);
      }
    }
  };

  History.prototype.onError = function onError (errorCb) {
    this.errorCbs.push(errorCb);
  };

  History.prototype.transitionTo = function transitionTo (
    location,
    onComplete,
    onAbort
  ) {
      var this$1 = this;

    var route = this.router.match(location, this.current);
    this.confirmTransition(
      route,
      function () {
        this$1.updateRoute(route);
        onComplete && onComplete(route);
        this$1.ensureURL();

        // fire ready cbs once
        if (!this$1.ready) {
          this$1.ready = true;
          this$1.readyCbs.forEach(function (cb) {
            cb(route);
          });
        }
      },
      function (err) {
        if (onAbort) {
          onAbort(err);
        }
        if (err && !this$1.ready) {
          this$1.ready = true;
          this$1.readyErrorCbs.forEach(function (cb) {
            cb(err);
          });
        }
      }
    );
  };

  History.prototype.confirmTransition = function confirmTransition (route, onComplete, onAbort) {
      var this$1 = this;

    var current = this.current;
    var abort = function (err) {
      // after merging https://github.com/vuejs/vue-router/pull/2771 we
      // When the user navigates through history through back/forward buttons
      // we do not want to throw the error. We only throw it if directly calling
      // push/replace. That's why it's not included in isError
      if (!isExtendedError(NavigationDuplicated, err) && isError(err)) {
        if (this$1.errorCbs.length) {
          this$1.errorCbs.forEach(function (cb) {
            cb(err);
          });
        } else {
          warn$1(false, 'uncaught error during route navigation:');
          console.error(err);
        }
      }
      onAbort && onAbort(err);
    };
    if (
      isSameRoute(route, current) &&
      // in the case the route map has been dynamically appended to
      route.matched.length === current.matched.length
    ) {
      this.ensureURL();
      return abort(new NavigationDuplicated(route))
    }

    var ref = resolveQueue(
      this.current.matched,
      route.matched
    );
      var updated = ref.updated;
      var deactivated = ref.deactivated;
      var activated = ref.activated;

    var queue = [].concat(
      // in-component leave guards
      extractLeaveGuards(deactivated),
      // global before hooks
      this.router.beforeHooks,
      // in-component update hooks
      extractUpdateHooks(updated),
      // in-config enter guards
      activated.map(function (m) { return m.beforeEnter; }),
      // async components
      resolveAsyncComponents(activated)
    );

    this.pending = route;
    var iterator = function (hook, next) {
      if (this$1.pending !== route) {
        return abort()
      }
      try {
        hook(route, current, function (to) {
          if (to === false || isError(to)) {
            // next(false) -> abort navigation, ensure current URL
            this$1.ensureURL(true);
            abort(to);
          } else if (
            typeof to === 'string' ||
            (typeof to === 'object' &&
              (typeof to.path === 'string' || typeof to.name === 'string'))
          ) {
            // next('/') or next({ path: '/' }) -> redirect
            abort();
            if (typeof to === 'object' && to.replace) {
              this$1.replace(to);
            } else {
              this$1.push(to);
            }
          } else {
            // confirm transition and pass on the value
            next(to);
          }
        });
      } catch (e) {
        abort(e);
      }
    };

    runQueue(queue, iterator, function () {
      var postEnterCbs = [];
      var isValid = function () { return this$1.current === route; };
      // wait until async components are resolved before
      // extracting in-component enter guards
      var enterGuards = extractEnterGuards(activated, postEnterCbs, isValid);
      var queue = enterGuards.concat(this$1.router.resolveHooks);
      runQueue(queue, iterator, function () {
        if (this$1.pending !== route) {
          return abort()
        }
        this$1.pending = null;
        onComplete(route);
        if (this$1.router.app) {
          this$1.router.app.$nextTick(function () {
            postEnterCbs.forEach(function (cb) {
              cb();
            });
          });
        }
      });
    });
  };

  History.prototype.updateRoute = function updateRoute (route) {
    var prev = this.current;
    this.current = route;
    this.cb && this.cb(route);
    this.router.afterHooks.forEach(function (hook) {
      hook && hook(route, prev);
    });
  };

  function normalizeBase (base) {
    if (!base) {
      if (inBrowser$1) {
        // respect <base> tag
        var baseEl = document.querySelector('base');
        base = (baseEl && baseEl.getAttribute('href')) || '/';
        // strip full URL origin
        base = base.replace(/^https?:\/\/[^\/]+/, '');
      } else {
        base = '/';
      }
    }
    // make sure there's the starting slash
    if (base.charAt(0) !== '/') {
      base = '/' + base;
    }
    // remove trailing slash
    return base.replace(/\/$/, '')
  }

  function resolveQueue (
    current,
    next
  ) {
    var i;
    var max = Math.max(current.length, next.length);
    for (i = 0; i < max; i++) {
      if (current[i] !== next[i]) {
        break
      }
    }
    return {
      updated: next.slice(0, i),
      activated: next.slice(i),
      deactivated: current.slice(i)
    }
  }

  function extractGuards (
    records,
    name,
    bind,
    reverse
  ) {
    var guards = flatMapComponents(records, function (def, instance, match, key) {
      var guard = extractGuard(def, name);
      if (guard) {
        return Array.isArray(guard)
          ? guard.map(function (guard) { return bind(guard, instance, match, key); })
          : bind(guard, instance, match, key)
      }
    });
    return flatten(reverse ? guards.reverse() : guards)
  }

  function extractGuard (
    def,
    key
  ) {
    if (typeof def !== 'function') {
      // extend now so that global mixins are applied.
      def = _Vue.extend(def);
    }
    return def.options[key]
  }

  function extractLeaveGuards (deactivated) {
    return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true)
  }

  function extractUpdateHooks (updated) {
    return extractGuards(updated, 'beforeRouteUpdate', bindGuard)
  }

  function bindGuard (guard, instance) {
    if (instance) {
      return function boundRouteGuard () {
        return guard.apply(instance, arguments)
      }
    }
  }

  function extractEnterGuards (
    activated,
    cbs,
    isValid
  ) {
    return extractGuards(
      activated,
      'beforeRouteEnter',
      function (guard, _, match, key) {
        return bindEnterGuard(guard, match, key, cbs, isValid)
      }
    )
  }

  function bindEnterGuard (
    guard,
    match,
    key,
    cbs,
    isValid
  ) {
    return function routeEnterGuard (to, from, next) {
      return guard(to, from, function (cb) {
        if (typeof cb === 'function') {
          cbs.push(function () {
            // #750
            // if a router-view is wrapped with an out-in transition,
            // the instance may not have been registered at this time.
            // we will need to poll for registration until current route
            // is no longer valid.
            poll(cb, match.instances, key, isValid);
          });
        }
        next(cb);
      })
    }
  }

  function poll (
    cb, // somehow flow cannot infer this is a function
    instances,
    key,
    isValid
  ) {
    if (
      instances[key] &&
      !instances[key]._isBeingDestroyed // do not reuse being destroyed instance
    ) {
      cb(instances[key]);
    } else if (isValid()) {
      setTimeout(function () {
        poll(cb, instances, key, isValid);
      }, 16);
    }
  }

  /*  */

  var HTML5History = /*@__PURE__*/(function (History) {
    function HTML5History (router, base) {
      var this$1 = this;

      History.call(this, router, base);

      var expectScroll = router.options.scrollBehavior;
      var supportsScroll = supportsPushState && expectScroll;

      if (supportsScroll) {
        setupScroll();
      }

      var initLocation = getLocation(this.base);
      window.addEventListener('popstate', function (e) {
        var current = this$1.current;

        // Avoiding first `popstate` event dispatched in some browsers but first
        // history route not updated since async guard at the same time.
        var location = getLocation(this$1.base);
        if (this$1.current === START && location === initLocation) {
          return
        }

        this$1.transitionTo(location, function (route) {
          if (supportsScroll) {
            handleScroll(router, route, current, true);
          }
        });
      });
    }

    if ( History ) HTML5History.__proto__ = History;
    HTML5History.prototype = Object.create( History && History.prototype );
    HTML5History.prototype.constructor = HTML5History;

    HTML5History.prototype.go = function go (n) {
      window.history.go(n);
    };

    HTML5History.prototype.push = function push (location, onComplete, onAbort) {
      var this$1 = this;

      var ref = this;
      var fromRoute = ref.current;
      this.transitionTo(location, function (route) {
        pushState(cleanPath(this$1.base + route.fullPath));
        handleScroll(this$1.router, route, fromRoute, false);
        onComplete && onComplete(route);
      }, onAbort);
    };

    HTML5History.prototype.replace = function replace (location, onComplete, onAbort) {
      var this$1 = this;

      var ref = this;
      var fromRoute = ref.current;
      this.transitionTo(location, function (route) {
        replaceState(cleanPath(this$1.base + route.fullPath));
        handleScroll(this$1.router, route, fromRoute, false);
        onComplete && onComplete(route);
      }, onAbort);
    };

    HTML5History.prototype.ensureURL = function ensureURL (push) {
      if (getLocation(this.base) !== this.current.fullPath) {
        var current = cleanPath(this.base + this.current.fullPath);
        push ? pushState(current) : replaceState(current);
      }
    };

    HTML5History.prototype.getCurrentLocation = function getCurrentLocation () {
      return getLocation(this.base)
    };

    return HTML5History;
  }(History));

  function getLocation (base) {
    var path = decodeURI(window.location.pathname);
    if (base && path.indexOf(base) === 0) {
      path = path.slice(base.length);
    }
    return (path || '/') + window.location.search + window.location.hash
  }

  /*  */

  var HashHistory = /*@__PURE__*/(function (History) {
    function HashHistory (router, base, fallback) {
      History.call(this, router, base);
      // check history fallback deeplinking
      if (fallback && checkFallback(this.base)) {
        return
      }
      ensureSlash();
    }

    if ( History ) HashHistory.__proto__ = History;
    HashHistory.prototype = Object.create( History && History.prototype );
    HashHistory.prototype.constructor = HashHistory;

    // this is delayed until the app mounts
    // to avoid the hashchange listener being fired too early
    HashHistory.prototype.setupListeners = function setupListeners () {
      var this$1 = this;

      var router = this.router;
      var expectScroll = router.options.scrollBehavior;
      var supportsScroll = supportsPushState && expectScroll;

      if (supportsScroll) {
        setupScroll();
      }

      window.addEventListener(
        supportsPushState ? 'popstate' : 'hashchange',
        function () {
          var current = this$1.current;
          if (!ensureSlash()) {
            return
          }
          this$1.transitionTo(getHash(), function (route) {
            if (supportsScroll) {
              handleScroll(this$1.router, route, current, true);
            }
            if (!supportsPushState) {
              replaceHash(route.fullPath);
            }
          });
        }
      );
    };

    HashHistory.prototype.push = function push (location, onComplete, onAbort) {
      var this$1 = this;

      var ref = this;
      var fromRoute = ref.current;
      this.transitionTo(
        location,
        function (route) {
          pushHash(route.fullPath);
          handleScroll(this$1.router, route, fromRoute, false);
          onComplete && onComplete(route);
        },
        onAbort
      );
    };

    HashHistory.prototype.replace = function replace (location, onComplete, onAbort) {
      var this$1 = this;

      var ref = this;
      var fromRoute = ref.current;
      this.transitionTo(
        location,
        function (route) {
          replaceHash(route.fullPath);
          handleScroll(this$1.router, route, fromRoute, false);
          onComplete && onComplete(route);
        },
        onAbort
      );
    };

    HashHistory.prototype.go = function go (n) {
      window.history.go(n);
    };

    HashHistory.prototype.ensureURL = function ensureURL (push) {
      var current = this.current.fullPath;
      if (getHash() !== current) {
        push ? pushHash(current) : replaceHash(current);
      }
    };

    HashHistory.prototype.getCurrentLocation = function getCurrentLocation () {
      return getHash()
    };

    return HashHistory;
  }(History));

  function checkFallback (base) {
    var location = getLocation(base);
    if (!/^\/#/.test(location)) {
      window.location.replace(cleanPath(base + '/#' + location));
      return true
    }
  }

  function ensureSlash () {
    var path = getHash();
    if (path.charAt(0) === '/') {
      return true
    }
    replaceHash('/' + path);
    return false
  }

  function getHash () {
    // We can't use window.location.hash here because it's not
    // consistent across browsers - Firefox will pre-decode it!
    var href = window.location.href;
    var index = href.indexOf('#');
    // empty path
    if (index < 0) { return '' }

    href = href.slice(index + 1);
    // decode the hash but not the search or hash
    // as search(query) is already decoded
    // https://github.com/vuejs/vue-router/issues/2708
    var searchIndex = href.indexOf('?');
    if (searchIndex < 0) {
      var hashIndex = href.indexOf('#');
      if (hashIndex > -1) {
        href = decodeURI(href.slice(0, hashIndex)) + href.slice(hashIndex);
      } else { href = decodeURI(href); }
    } else {
      href = decodeURI(href.slice(0, searchIndex)) + href.slice(searchIndex);
    }

    return href
  }

  function getUrl (path) {
    var href = window.location.href;
    var i = href.indexOf('#');
    var base = i >= 0 ? href.slice(0, i) : href;
    return (base + "#" + path)
  }

  function pushHash (path) {
    if (supportsPushState) {
      pushState(getUrl(path));
    } else {
      window.location.hash = path;
    }
  }

  function replaceHash (path) {
    if (supportsPushState) {
      replaceState(getUrl(path));
    } else {
      window.location.replace(getUrl(path));
    }
  }

  /*  */

  var AbstractHistory = /*@__PURE__*/(function (History) {
    function AbstractHistory (router, base) {
      History.call(this, router, base);
      this.stack = [];
      this.index = -1;
    }

    if ( History ) AbstractHistory.__proto__ = History;
    AbstractHistory.prototype = Object.create( History && History.prototype );
    AbstractHistory.prototype.constructor = AbstractHistory;

    AbstractHistory.prototype.push = function push (location, onComplete, onAbort) {
      var this$1 = this;

      this.transitionTo(
        location,
        function (route) {
          this$1.stack = this$1.stack.slice(0, this$1.index + 1).concat(route);
          this$1.index++;
          onComplete && onComplete(route);
        },
        onAbort
      );
    };

    AbstractHistory.prototype.replace = function replace (location, onComplete, onAbort) {
      var this$1 = this;

      this.transitionTo(
        location,
        function (route) {
          this$1.stack = this$1.stack.slice(0, this$1.index).concat(route);
          onComplete && onComplete(route);
        },
        onAbort
      );
    };

    AbstractHistory.prototype.go = function go (n) {
      var this$1 = this;

      var targetIndex = this.index + n;
      if (targetIndex < 0 || targetIndex >= this.stack.length) {
        return
      }
      var route = this.stack[targetIndex];
      this.confirmTransition(
        route,
        function () {
          this$1.index = targetIndex;
          this$1.updateRoute(route);
        },
        function (err) {
          if (isExtendedError(NavigationDuplicated, err)) {
            this$1.index = targetIndex;
          }
        }
      );
    };

    AbstractHistory.prototype.getCurrentLocation = function getCurrentLocation () {
      var current = this.stack[this.stack.length - 1];
      return current ? current.fullPath : '/'
    };

    AbstractHistory.prototype.ensureURL = function ensureURL () {
      // noop
    };

    return AbstractHistory;
  }(History));

  /*  */



  var VueRouter = function VueRouter (options) {
    if ( options === void 0 ) options = {};

    this.app = null;
    this.apps = [];
    this.options = options;
    this.beforeHooks = [];
    this.resolveHooks = [];
    this.afterHooks = [];
    this.matcher = createMatcher(options.routes || [], this);

    var mode = options.mode || 'hash';
    this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false;
    if (this.fallback) {
      mode = 'hash';
    }
    if (!inBrowser$1) {
      mode = 'abstract';
    }
    this.mode = mode;

    switch (mode) {
      case 'history':
        this.history = new HTML5History(this, options.base);
        break
      case 'hash':
        this.history = new HashHistory(this, options.base, this.fallback);
        break
      case 'abstract':
        this.history = new AbstractHistory(this, options.base);
        break
      default:
        {
          assert(false, ("invalid mode: " + mode));
        }
    }
  };

  var prototypeAccessors$1 = { currentRoute: { configurable: true } };

  VueRouter.prototype.match = function match (
    raw,
    current,
    redirectedFrom
  ) {
    return this.matcher.match(raw, current, redirectedFrom)
  };

  prototypeAccessors$1.currentRoute.get = function () {
    return this.history && this.history.current
  };

  VueRouter.prototype.init = function init (app /* Vue component instance */) {
      var this$1 = this;

     assert(
      install.installed,
      "not installed. Make sure to call `Vue.use(VueRouter)` " +
      "before creating root instance."
    );

    this.apps.push(app);

    // set up app destroyed handler
    // https://github.com/vuejs/vue-router/issues/2639
    app.$once('hook:destroyed', function () {
      // clean out app from this.apps array once destroyed
      var index = this$1.apps.indexOf(app);
      if (index > -1) { this$1.apps.splice(index, 1); }
      // ensure we still have a main app or null if no apps
      // we do not release the router so it can be reused
      if (this$1.app === app) { this$1.app = this$1.apps[0] || null; }
    });

    // main app previously initialized
    // return as we don't need to set up new history listener
    if (this.app) {
      return
    }

    this.app = app;

    var history = this.history;

    if (history instanceof HTML5History) {
      history.transitionTo(history.getCurrentLocation());
    } else if (history instanceof HashHistory) {
      var setupHashListener = function () {
        history.setupListeners();
      };
      history.transitionTo(
        history.getCurrentLocation(),
        setupHashListener,
        setupHashListener
      );
    }

    history.listen(function (route) {
      this$1.apps.forEach(function (app) {
        app._route = route;
      });
    });
  };

  VueRouter.prototype.beforeEach = function beforeEach (fn) {
    return registerHook(this.beforeHooks, fn)
  };

  VueRouter.prototype.beforeResolve = function beforeResolve (fn) {
    return registerHook(this.resolveHooks, fn)
  };

  VueRouter.prototype.afterEach = function afterEach (fn) {
    return registerHook(this.afterHooks, fn)
  };

  VueRouter.prototype.onReady = function onReady (cb, errorCb) {
    this.history.onReady(cb, errorCb);
  };

  VueRouter.prototype.onError = function onError (errorCb) {
    this.history.onError(errorCb);
  };

  VueRouter.prototype.push = function push (location, onComplete, onAbort) {
      var this$1 = this;

    // $flow-disable-line
    if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
      return new Promise(function (resolve, reject) {
        this$1.history.push(location, resolve, reject);
      })
    } else {
      this.history.push(location, onComplete, onAbort);
    }
  };

  VueRouter.prototype.replace = function replace (location, onComplete, onAbort) {
      var this$1 = this;

    // $flow-disable-line
    if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
      return new Promise(function (resolve, reject) {
        this$1.history.replace(location, resolve, reject);
      })
    } else {
      this.history.replace(location, onComplete, onAbort);
    }
  };

  VueRouter.prototype.go = function go (n) {
    this.history.go(n);
  };

  VueRouter.prototype.back = function back () {
    this.go(-1);
  };

  VueRouter.prototype.forward = function forward () {
    this.go(1);
  };

  VueRouter.prototype.getMatchedComponents = function getMatchedComponents (to) {
    var route = to
      ? to.matched
        ? to
        : this.resolve(to).route
      : this.currentRoute;
    if (!route) {
      return []
    }
    return [].concat.apply([], route.matched.map(function (m) {
      return Object.keys(m.components).map(function (key) {
        return m.components[key]
      })
    }))
  };

  VueRouter.prototype.resolve = function resolve (
    to,
    current,
    append
  ) {
    current = current || this.history.current;
    var location = normalizeLocation(
      to,
      current,
      append,
      this
    );
    var route = this.match(location, current);
    var fullPath = route.redirectedFrom || route.fullPath;
    var base = this.history.base;
    var href = createHref(base, fullPath, this.mode);
    return {
      location: location,
      route: route,
      href: href,
      // for backwards compat
      normalizedTo: location,
      resolved: route
    }
  };

  VueRouter.prototype.addRoutes = function addRoutes (routes) {
    this.matcher.addRoutes(routes);
    if (this.history.current !== START) {
      this.history.transitionTo(this.history.getCurrentLocation());
    }
  };

  Object.defineProperties( VueRouter.prototype, prototypeAccessors$1 );

  function registerHook (list, fn) {
    list.push(fn);
    return function () {
      var i = list.indexOf(fn);
      if (i > -1) { list.splice(i, 1); }
    }
  }

  function createHref (base, fullPath, mode) {
    var path = mode === 'hash' ? '#' + fullPath : fullPath;
    return base ? cleanPath(base + '/' + path) : path
  }

  VueRouter.install = install;
  VueRouter.version = '3.1.5';

  if (inBrowser$1 && window.Vue) {
    window.Vue.use(VueRouter);
  }

  var Global = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  var PI_OVER_180 = Math.PI / 180;
  function detectBrowser() {
      return (typeof window !== 'undefined' &&
          ({}.toString.call(window) === '[object Window]' ||
              {}.toString.call(window) === '[object global]'));
  }
  var _detectIE = function (ua) {
      var msie = ua.indexOf('msie ');
      if (msie > 0) {
          return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
      }
      var trident = ua.indexOf('trident/');
      if (trident > 0) {
          var rv = ua.indexOf('rv:');
          return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
      }
      var edge = ua.indexOf('edge/');
      if (edge > 0) {
          return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
      }
      return false;
  };
  exports._parseUA = function (userAgent) {
      var ua = userAgent.toLowerCase(), match = /(chrome)[ /]([\w.]+)/.exec(ua) ||
          /(webkit)[ /]([\w.]+)/.exec(ua) ||
          /(opera)(?:.*version|)[ /]([\w.]+)/.exec(ua) ||
          /(msie) ([\w.]+)/.exec(ua) ||
          (ua.indexOf('compatible') < 0 &&
              /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua)) ||
          [], mobile = !!userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i), ieMobile = !!userAgent.match(/IEMobile/i);
      return {
          browser: match[1] || '',
          version: match[2] || '0',
          isIE: _detectIE(ua),
          mobile: mobile,
          ieMobile: ieMobile
      };
  };
  exports.glob = typeof commonjsGlobal !== 'undefined'
      ? commonjsGlobal
      : typeof window !== 'undefined'
          ? window
          : typeof WorkerGlobalScope !== 'undefined'
              ? self
              : {};
  exports.Konva = {
      _global: exports.glob,
      version: '4.1.2',
      isBrowser: detectBrowser(),
      isUnminified: /param/.test(function (param) { }.toString()),
      dblClickWindow: 400,
      getAngle: function (angle) {
          return exports.Konva.angleDeg ? angle * PI_OVER_180 : angle;
      },
      enableTrace: false,
      _pointerEventsEnabled: false,
      hitOnDragEnabled: false,
      captureTouchEventsEnabled: false,
      listenClickTap: false,
      inDblClickWindow: false,
      pixelRatio: undefined,
      dragDistance: 3,
      angleDeg: true,
      showWarnings: true,
      dragButtons: [0, 1],
      isDragging: function () {
          return exports.Konva['DD'].isDragging;
      },
      isDragReady: function () {
          return !!exports.Konva['DD'].node;
      },
      UA: exports._parseUA((exports.glob.navigator && exports.glob.navigator.userAgent) || ''),
      document: exports.glob.document,
      _injectGlobal: function (Konva) {
          exports.glob.Konva = Konva;
      },
      _parseUA: exports._parseUA
  };
  exports._NODES_REGISTRY = {};
  exports._registerNode = function (NodeClass) {
      exports._NODES_REGISTRY[NodeClass.prototype.getClassName()] = NodeClass;
      exports.Konva[NodeClass.prototype.getClassName()] = NodeClass;
  };
  });

  unwrapExports(Global);
  var Global_1 = Global._parseUA;
  var Global_2 = Global.glob;
  var Global_3 = Global.Konva;
  var Global_4 = Global._NODES_REGISTRY;
  var Global_5 = Global._registerNode;

  var Util = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });

  var Collection = (function () {
      function Collection() {
      }
      Collection.toCollection = function (arr) {
          var collection = new Collection(), len = arr.length, n;
          for (n = 0; n < len; n++) {
              collection.push(arr[n]);
          }
          return collection;
      };
      Collection._mapMethod = function (methodName) {
          Collection.prototype[methodName] = function () {
              var len = this.length, i;
              var args = [].slice.call(arguments);
              for (i = 0; i < len; i++) {
                  this[i][methodName].apply(this[i], args);
              }
              return this;
          };
      };
      Collection.mapMethods = function (constructor) {
          var prot = constructor.prototype;
          for (var methodName in prot) {
              Collection._mapMethod(methodName);
          }
      };
      return Collection;
  }());
  exports.Collection = Collection;
  Collection.prototype = [];
  Collection.prototype.each = function (func) {
      for (var n = 0; n < this.length; n++) {
          func(this[n], n);
      }
  };
  Collection.prototype.toArray = function () {
      var arr = [], len = this.length, n;
      for (n = 0; n < len; n++) {
          arr.push(this[n]);
      }
      return arr;
  };
  var Transform = (function () {
      function Transform(m) {
          if (m === void 0) { m = [1, 0, 0, 1, 0, 0]; }
          this.m = (m && m.slice()) || [1, 0, 0, 1, 0, 0];
      }
      Transform.prototype.copy = function () {
          return new Transform(this.m);
      };
      Transform.prototype.point = function (point) {
          var m = this.m;
          return {
              x: m[0] * point.x + m[2] * point.y + m[4],
              y: m[1] * point.x + m[3] * point.y + m[5]
          };
      };
      Transform.prototype.translate = function (x, y) {
          this.m[4] += this.m[0] * x + this.m[2] * y;
          this.m[5] += this.m[1] * x + this.m[3] * y;
          return this;
      };
      Transform.prototype.scale = function (sx, sy) {
          this.m[0] *= sx;
          this.m[1] *= sx;
          this.m[2] *= sy;
          this.m[3] *= sy;
          return this;
      };
      Transform.prototype.rotate = function (rad) {
          var c = Math.cos(rad);
          var s = Math.sin(rad);
          var m11 = this.m[0] * c + this.m[2] * s;
          var m12 = this.m[1] * c + this.m[3] * s;
          var m21 = this.m[0] * -s + this.m[2] * c;
          var m22 = this.m[1] * -s + this.m[3] * c;
          this.m[0] = m11;
          this.m[1] = m12;
          this.m[2] = m21;
          this.m[3] = m22;
          return this;
      };
      Transform.prototype.getTranslation = function () {
          return {
              x: this.m[4],
              y: this.m[5]
          };
      };
      Transform.prototype.skew = function (sx, sy) {
          var m11 = this.m[0] + this.m[2] * sy;
          var m12 = this.m[1] + this.m[3] * sy;
          var m21 = this.m[2] + this.m[0] * sx;
          var m22 = this.m[3] + this.m[1] * sx;
          this.m[0] = m11;
          this.m[1] = m12;
          this.m[2] = m21;
          this.m[3] = m22;
          return this;
      };
      Transform.prototype.multiply = function (matrix) {
          var m11 = this.m[0] * matrix.m[0] + this.m[2] * matrix.m[1];
          var m12 = this.m[1] * matrix.m[0] + this.m[3] * matrix.m[1];
          var m21 = this.m[0] * matrix.m[2] + this.m[2] * matrix.m[3];
          var m22 = this.m[1] * matrix.m[2] + this.m[3] * matrix.m[3];
          var dx = this.m[0] * matrix.m[4] + this.m[2] * matrix.m[5] + this.m[4];
          var dy = this.m[1] * matrix.m[4] + this.m[3] * matrix.m[5] + this.m[5];
          this.m[0] = m11;
          this.m[1] = m12;
          this.m[2] = m21;
          this.m[3] = m22;
          this.m[4] = dx;
          this.m[5] = dy;
          return this;
      };
      Transform.prototype.invert = function () {
          var d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]);
          var m0 = this.m[3] * d;
          var m1 = -this.m[1] * d;
          var m2 = -this.m[2] * d;
          var m3 = this.m[0] * d;
          var m4 = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4]);
          var m5 = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
          this.m[0] = m0;
          this.m[1] = m1;
          this.m[2] = m2;
          this.m[3] = m3;
          this.m[4] = m4;
          this.m[5] = m5;
          return this;
      };
      Transform.prototype.getMatrix = function () {
          return this.m;
      };
      Transform.prototype.setAbsolutePosition = function (x, y) {
          var m0 = this.m[0], m1 = this.m[1], m2 = this.m[2], m3 = this.m[3], m4 = this.m[4], m5 = this.m[5], yt = (m0 * (y - m5) - m1 * (x - m4)) / (m0 * m3 - m1 * m2), xt = (x - m4 - m2 * yt) / m0;
          return this.translate(xt, yt);
      };
      return Transform;
  }());
  exports.Transform = Transform;
  var OBJECT_ARRAY = '[object Array]', OBJECT_NUMBER = '[object Number]', OBJECT_STRING = '[object String]', OBJECT_BOOLEAN = '[object Boolean]', PI_OVER_DEG180 = Math.PI / 180, DEG180_OVER_PI = 180 / Math.PI, HASH = '#', EMPTY_STRING = '', ZERO = '0', KONVA_WARNING = 'Konva warning: ', KONVA_ERROR = 'Konva error: ', RGB_PAREN = 'rgb(', COLORS = {
      aliceblue: [240, 248, 255],
      antiquewhite: [250, 235, 215],
      aqua: [0, 255, 255],
      aquamarine: [127, 255, 212],
      azure: [240, 255, 255],
      beige: [245, 245, 220],
      bisque: [255, 228, 196],
      black: [0, 0, 0],
      blanchedalmond: [255, 235, 205],
      blue: [0, 0, 255],
      blueviolet: [138, 43, 226],
      brown: [165, 42, 42],
      burlywood: [222, 184, 135],
      cadetblue: [95, 158, 160],
      chartreuse: [127, 255, 0],
      chocolate: [210, 105, 30],
      coral: [255, 127, 80],
      cornflowerblue: [100, 149, 237],
      cornsilk: [255, 248, 220],
      crimson: [220, 20, 60],
      cyan: [0, 255, 255],
      darkblue: [0, 0, 139],
      darkcyan: [0, 139, 139],
      darkgoldenrod: [184, 132, 11],
      darkgray: [169, 169, 169],
      darkgreen: [0, 100, 0],
      darkgrey: [169, 169, 169],
      darkkhaki: [189, 183, 107],
      darkmagenta: [139, 0, 139],
      darkolivegreen: [85, 107, 47],
      darkorange: [255, 140, 0],
      darkorchid: [153, 50, 204],
      darkred: [139, 0, 0],
      darksalmon: [233, 150, 122],
      darkseagreen: [143, 188, 143],
      darkslateblue: [72, 61, 139],
      darkslategray: [47, 79, 79],
      darkslategrey: [47, 79, 79],
      darkturquoise: [0, 206, 209],
      darkviolet: [148, 0, 211],
      deeppink: [255, 20, 147],
      deepskyblue: [0, 191, 255],
      dimgray: [105, 105, 105],
      dimgrey: [105, 105, 105],
      dodgerblue: [30, 144, 255],
      firebrick: [178, 34, 34],
      floralwhite: [255, 255, 240],
      forestgreen: [34, 139, 34],
      fuchsia: [255, 0, 255],
      gainsboro: [220, 220, 220],
      ghostwhite: [248, 248, 255],
      gold: [255, 215, 0],
      goldenrod: [218, 165, 32],
      gray: [128, 128, 128],
      green: [0, 128, 0],
      greenyellow: [173, 255, 47],
      grey: [128, 128, 128],
      honeydew: [240, 255, 240],
      hotpink: [255, 105, 180],
      indianred: [205, 92, 92],
      indigo: [75, 0, 130],
      ivory: [255, 255, 240],
      khaki: [240, 230, 140],
      lavender: [230, 230, 250],
      lavenderblush: [255, 240, 245],
      lawngreen: [124, 252, 0],
      lemonchiffon: [255, 250, 205],
      lightblue: [173, 216, 230],
      lightcoral: [240, 128, 128],
      lightcyan: [224, 255, 255],
      lightgoldenrodyellow: [250, 250, 210],
      lightgray: [211, 211, 211],
      lightgreen: [144, 238, 144],
      lightgrey: [211, 211, 211],
      lightpink: [255, 182, 193],
      lightsalmon: [255, 160, 122],
      lightseagreen: [32, 178, 170],
      lightskyblue: [135, 206, 250],
      lightslategray: [119, 136, 153],
      lightslategrey: [119, 136, 153],
      lightsteelblue: [176, 196, 222],
      lightyellow: [255, 255, 224],
      lime: [0, 255, 0],
      limegreen: [50, 205, 50],
      linen: [250, 240, 230],
      magenta: [255, 0, 255],
      maroon: [128, 0, 0],
      mediumaquamarine: [102, 205, 170],
      mediumblue: [0, 0, 205],
      mediumorchid: [186, 85, 211],
      mediumpurple: [147, 112, 219],
      mediumseagreen: [60, 179, 113],
      mediumslateblue: [123, 104, 238],
      mediumspringgreen: [0, 250, 154],
      mediumturquoise: [72, 209, 204],
      mediumvioletred: [199, 21, 133],
      midnightblue: [25, 25, 112],
      mintcream: [245, 255, 250],
      mistyrose: [255, 228, 225],
      moccasin: [255, 228, 181],
      navajowhite: [255, 222, 173],
      navy: [0, 0, 128],
      oldlace: [253, 245, 230],
      olive: [128, 128, 0],
      olivedrab: [107, 142, 35],
      orange: [255, 165, 0],
      orangered: [255, 69, 0],
      orchid: [218, 112, 214],
      palegoldenrod: [238, 232, 170],
      palegreen: [152, 251, 152],
      paleturquoise: [175, 238, 238],
      palevioletred: [219, 112, 147],
      papayawhip: [255, 239, 213],
      peachpuff: [255, 218, 185],
      peru: [205, 133, 63],
      pink: [255, 192, 203],
      plum: [221, 160, 203],
      powderblue: [176, 224, 230],
      purple: [128, 0, 128],
      rebeccapurple: [102, 51, 153],
      red: [255, 0, 0],
      rosybrown: [188, 143, 143],
      royalblue: [65, 105, 225],
      saddlebrown: [139, 69, 19],
      salmon: [250, 128, 114],
      sandybrown: [244, 164, 96],
      seagreen: [46, 139, 87],
      seashell: [255, 245, 238],
      sienna: [160, 82, 45],
      silver: [192, 192, 192],
      skyblue: [135, 206, 235],
      slateblue: [106, 90, 205],
      slategray: [119, 128, 144],
      slategrey: [119, 128, 144],
      snow: [255, 255, 250],
      springgreen: [0, 255, 127],
      steelblue: [70, 130, 180],
      tan: [210, 180, 140],
      teal: [0, 128, 128],
      thistle: [216, 191, 216],
      transparent: [255, 255, 255, 0],
      tomato: [255, 99, 71],
      turquoise: [64, 224, 208],
      violet: [238, 130, 238],
      wheat: [245, 222, 179],
      white: [255, 255, 255],
      whitesmoke: [245, 245, 245],
      yellow: [255, 255, 0],
      yellowgreen: [154, 205, 5]
  }, RGB_REGEX = /rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/, animQueue = [];
  exports.Util = {
      _isElement: function (obj) {
          return !!(obj && obj.nodeType == 1);
      },
      _isFunction: function (obj) {
          return !!(obj && obj.constructor && obj.call && obj.apply);
      },
      _isPlainObject: function (obj) {
          return !!obj && obj.constructor === Object;
      },
      _isArray: function (obj) {
          return Object.prototype.toString.call(obj) === OBJECT_ARRAY;
      },
      _isNumber: function (obj) {
          return (Object.prototype.toString.call(obj) === OBJECT_NUMBER &&
              !isNaN(obj) &&
              isFinite(obj));
      },
      _isString: function (obj) {
          return Object.prototype.toString.call(obj) === OBJECT_STRING;
      },
      _isBoolean: function (obj) {
          return Object.prototype.toString.call(obj) === OBJECT_BOOLEAN;
      },
      isObject: function (val) {
          return val instanceof Object;
      },
      isValidSelector: function (selector) {
          if (typeof selector !== 'string') {
              return false;
          }
          var firstChar = selector[0];
          return (firstChar === '#' ||
              firstChar === '.' ||
              firstChar === firstChar.toUpperCase());
      },
      _sign: function (number) {
          if (number === 0) {
              return 0;
          }
          if (number > 0) {
              return 1;
          }
          else {
              return -1;
          }
      },
      requestAnimFrame: function (callback) {
          animQueue.push(callback);
          if (animQueue.length === 1) {
              requestAnimationFrame(function () {
                  var queue = animQueue;
                  animQueue = [];
                  queue.forEach(function (cb) {
                      cb();
                  });
              });
          }
      },
      createCanvasElement: function () {
          var canvas = document.createElement('canvas');
          try {
              canvas.style = canvas.style || {};
          }
          catch (e) { }
          return canvas;
      },
      createImageElement: function () {
          return document.createElement('img');
      },
      _isInDocument: function (el) {
          while ((el = el.parentNode)) {
              if (el == document) {
                  return true;
              }
          }
          return false;
      },
      _simplifyArray: function (arr) {
          var retArr = [], len = arr.length, util = exports.Util, n, val;
          for (n = 0; n < len; n++) {
              val = arr[n];
              if (util._isNumber(val)) {
                  val = Math.round(val * 1000) / 1000;
              }
              else if (!util._isString(val)) {
                  val = val.toString();
              }
              retArr.push(val);
          }
          return retArr;
      },
      _urlToImage: function (url, callback) {
          var imageObj = new Global.glob.Image();
          imageObj.onload = function () {
              callback(imageObj);
          };
          imageObj.src = url;
      },
      _rgbToHex: function (r, g, b) {
          return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
      },
      _hexToRgb: function (hex) {
          hex = hex.replace(HASH, EMPTY_STRING);
          var bigint = parseInt(hex, 16);
          return {
              r: (bigint >> 16) & 255,
              g: (bigint >> 8) & 255,
              b: bigint & 255
          };
      },
      getRandomColor: function () {
          var randColor = ((Math.random() * 0xffffff) << 0).toString(16);
          while (randColor.length < 6) {
              randColor = ZERO + randColor;
          }
          return HASH + randColor;
      },
      get: function (val, def) {
          if (val === undefined) {
              return def;
          }
          else {
              return val;
          }
      },
      getRGB: function (color) {
          var rgb;
          if (color in COLORS) {
              rgb = COLORS[color];
              return {
                  r: rgb[0],
                  g: rgb[1],
                  b: rgb[2]
              };
          }
          else if (color[0] === HASH) {
              return this._hexToRgb(color.substring(1));
          }
          else if (color.substr(0, 4) === RGB_PAREN) {
              rgb = RGB_REGEX.exec(color.replace(/ /g, ''));
              return {
                  r: parseInt(rgb[1], 10),
                  g: parseInt(rgb[2], 10),
                  b: parseInt(rgb[3], 10)
              };
          }
          else {
              return {
                  r: 0,
                  g: 0,
                  b: 0
              };
          }
      },
      colorToRGBA: function (str) {
          str = str || 'black';
          return (exports.Util._namedColorToRBA(str) ||
              exports.Util._hex3ColorToRGBA(str) ||
              exports.Util._hex6ColorToRGBA(str) ||
              exports.Util._rgbColorToRGBA(str) ||
              exports.Util._rgbaColorToRGBA(str) ||
              exports.Util._hslColorToRGBA(str));
      },
      _namedColorToRBA: function (str) {
          var c = COLORS[str.toLowerCase()];
          if (!c) {
              return null;
          }
          return {
              r: c[0],
              g: c[1],
              b: c[2],
              a: 1
          };
      },
      _rgbColorToRGBA: function (str) {
          if (str.indexOf('rgb(') === 0) {
              str = str.match(/rgb\(([^)]+)\)/)[1];
              var parts = str.split(/ *, */).map(Number);
              return {
                  r: parts[0],
                  g: parts[1],
                  b: parts[2],
                  a: 1
              };
          }
      },
      _rgbaColorToRGBA: function (str) {
          if (str.indexOf('rgba(') === 0) {
              str = str.match(/rgba\(([^)]+)\)/)[1];
              var parts = str.split(/ *, */).map(Number);
              return {
                  r: parts[0],
                  g: parts[1],
                  b: parts[2],
                  a: parts[3]
              };
          }
      },
      _hex6ColorToRGBA: function (str) {
          if (str[0] === '#' && str.length === 7) {
              return {
                  r: parseInt(str.slice(1, 3), 16),
                  g: parseInt(str.slice(3, 5), 16),
                  b: parseInt(str.slice(5, 7), 16),
                  a: 1
              };
          }
      },
      _hex3ColorToRGBA: function (str) {
          if (str[0] === '#' && str.length === 4) {
              return {
                  r: parseInt(str[1] + str[1], 16),
                  g: parseInt(str[2] + str[2], 16),
                  b: parseInt(str[3] + str[3], 16),
                  a: 1
              };
          }
      },
      _hslColorToRGBA: function (str) {
          if (/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.test(str)) {
              var _a = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(str), _ = _a[0], hsl = _a.slice(1);
              var h = Number(hsl[0]) / 360;
              var s = Number(hsl[1]) / 100;
              var l = Number(hsl[2]) / 100;
              var t2 = void 0;
              var t3 = void 0;
              var val = void 0;
              if (s === 0) {
                  val = l * 255;
                  return {
                      r: Math.round(val),
                      g: Math.round(val),
                      b: Math.round(val),
                      a: 1
                  };
              }
              if (l < 0.5) {
                  t2 = l * (1 + s);
              }
              else {
                  t2 = l + s - l * s;
              }
              var t1 = 2 * l - t2;
              var rgb = [0, 0, 0];
              for (var i = 0; i < 3; i++) {
                  t3 = h + (1 / 3) * -(i - 1);
                  if (t3 < 0) {
                      t3++;
                  }
                  if (t3 > 1) {
                      t3--;
                  }
                  if (6 * t3 < 1) {
                      val = t1 + (t2 - t1) * 6 * t3;
                  }
                  else if (2 * t3 < 1) {
                      val = t2;
                  }
                  else if (3 * t3 < 2) {
                      val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
                  }
                  else {
                      val = t1;
                  }
                  rgb[i] = val * 255;
              }
              return {
                  r: Math.round(rgb[0]),
                  g: Math.round(rgb[1]),
                  b: Math.round(rgb[2]),
                  a: 1
              };
          }
      },
      haveIntersection: function (r1, r2) {
          return !(r2.x > r1.x + r1.width ||
              r2.x + r2.width < r1.x ||
              r2.y > r1.y + r1.height ||
              r2.y + r2.height < r1.y);
      },
      cloneObject: function (obj) {
          var retObj = {};
          for (var key in obj) {
              if (this._isPlainObject(obj[key])) {
                  retObj[key] = this.cloneObject(obj[key]);
              }
              else if (this._isArray(obj[key])) {
                  retObj[key] = this.cloneArray(obj[key]);
              }
              else {
                  retObj[key] = obj[key];
              }
          }
          return retObj;
      },
      cloneArray: function (arr) {
          return arr.slice(0);
      },
      _degToRad: function (deg) {
          return deg * PI_OVER_DEG180;
      },
      _radToDeg: function (rad) {
          return rad * DEG180_OVER_PI;
      },
      _capitalize: function (str) {
          return str.charAt(0).toUpperCase() + str.slice(1);
      },
      throw: function (str) {
          throw new Error(KONVA_ERROR + str);
      },
      error: function (str) {
          console.error(KONVA_ERROR + str);
      },
      warn: function (str) {
          if (!Global.Konva.showWarnings) {
              return;
          }
          console.warn(KONVA_WARNING + str);
      },
      extend: function (child, parent) {
          function Ctor() {
              this.constructor = child;
          }
          Ctor.prototype = parent.prototype;
          var oldProto = child.prototype;
          child.prototype = new Ctor();
          for (var key in oldProto) {
              if (oldProto.hasOwnProperty(key)) {
                  child.prototype[key] = oldProto[key];
              }
          }
          child.__super__ = parent.prototype;
          child.super = parent;
      },
      _getControlPoints: function (x0, y0, x1, y1, x2, y2, t) {
          var d01 = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2)), d12 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)), fa = (t * d01) / (d01 + d12), fb = (t * d12) / (d01 + d12), p1x = x1 - fa * (x2 - x0), p1y = y1 - fa * (y2 - y0), p2x = x1 + fb * (x2 - x0), p2y = y1 + fb * (y2 - y0);
          return [p1x, p1y, p2x, p2y];
      },
      _expandPoints: function (p, tension) {
          var len = p.length, allPoints = [], n, cp;
          for (n = 2; n < len - 2; n += 2) {
              cp = exports.Util._getControlPoints(p[n - 2], p[n - 1], p[n], p[n + 1], p[n + 2], p[n + 3], tension);
              allPoints.push(cp[0]);
              allPoints.push(cp[1]);
              allPoints.push(p[n]);
              allPoints.push(p[n + 1]);
              allPoints.push(cp[2]);
              allPoints.push(cp[3]);
          }
          return allPoints;
      },
      each: function (obj, func) {
          for (var key in obj) {
              func(key, obj[key]);
          }
      },
      _inRange: function (val, left, right) {
          return left <= val && val < right;
      },
      _getProjectionToSegment: function (x1, y1, x2, y2, x3, y3) {
          var x, y, dist;
          var pd2 = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
          if (pd2 == 0) {
              x = x1;
              y = y1;
              dist = (x3 - x2) * (x3 - x2) + (y3 - y2) * (y3 - y2);
          }
          else {
              var u = ((x3 - x1) * (x2 - x1) + (y3 - y1) * (y2 - y1)) / pd2;
              if (u < 0) {
                  x = x1;
                  y = y1;
                  dist = (x1 - x3) * (x1 - x3) + (y1 - y3) * (y1 - y3);
              }
              else if (u > 1.0) {
                  x = x2;
                  y = y2;
                  dist = (x2 - x3) * (x2 - x3) + (y2 - y3) * (y2 - y3);
              }
              else {
                  x = x1 + u * (x2 - x1);
                  y = y1 + u * (y2 - y1);
                  dist = (x - x3) * (x - x3) + (y - y3) * (y - y3);
              }
          }
          return [x, y, dist];
      },
      _getProjectionToLine: function (pt, line, isClosed) {
          var pc = exports.Util.cloneObject(pt);
          var dist = Number.MAX_VALUE;
          line.forEach(function (p1, i) {
              if (!isClosed && i === line.length - 1) {
                  return;
              }
              var p2 = line[(i + 1) % line.length];
              var proj = exports.Util._getProjectionToSegment(p1.x, p1.y, p2.x, p2.y, pt.x, pt.y);
              var px = proj[0], py = proj[1], pdist = proj[2];
              if (pdist < dist) {
                  pc.x = px;
                  pc.y = py;
                  dist = pdist;
              }
          });
          return pc;
      },
      _prepareArrayForTween: function (startArray, endArray, isClosed) {
          var n, start = [], end = [];
          if (startArray.length > endArray.length) {
              var temp = endArray;
              endArray = startArray;
              startArray = temp;
          }
          for (n = 0; n < startArray.length; n += 2) {
              start.push({
                  x: startArray[n],
                  y: startArray[n + 1]
              });
          }
          for (n = 0; n < endArray.length; n += 2) {
              end.push({
                  x: endArray[n],
                  y: endArray[n + 1]
              });
          }
          var newStart = [];
          end.forEach(function (point) {
              var pr = exports.Util._getProjectionToLine(point, start, isClosed);
              newStart.push(pr.x);
              newStart.push(pr.y);
          });
          return newStart;
      },
      _prepareToStringify: function (obj) {
          var desc;
          obj.visitedByCircularReferenceRemoval = true;
          for (var key in obj) {
              if (!(obj.hasOwnProperty(key) && obj[key] && typeof obj[key] == 'object')) {
                  continue;
              }
              desc = Object.getOwnPropertyDescriptor(obj, key);
              if (obj[key].visitedByCircularReferenceRemoval ||
                  exports.Util._isElement(obj[key])) {
                  if (desc.configurable) {
                      delete obj[key];
                  }
                  else {
                      return null;
                  }
              }
              else if (exports.Util._prepareToStringify(obj[key]) === null) {
                  if (desc.configurable) {
                      delete obj[key];
                  }
                  else {
                      return null;
                  }
              }
          }
          delete obj.visitedByCircularReferenceRemoval;
          return obj;
      },
      _assign: function (target, source) {
          for (var key in source) {
              target[key] = source[key];
          }
          return target;
      },
      _getFirstPointerId: function (evt) {
          if (!evt.touches) {
              return 999;
          }
          else {
              return evt.changedTouches[0].identifier;
          }
      }
  };
  });

  unwrapExports(Util);
  var Util_1 = Util.Collection;
  var Util_2 = Util.Transform;
  var Util_3 = Util.Util;

  var Validators = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });


  function _formatValue(val) {
      if (Util.Util._isString(val)) {
          return '"' + val + '"';
      }
      if (Object.prototype.toString.call(val) === '[object Number]') {
          return val;
      }
      if (Util.Util._isBoolean(val)) {
          return val;
      }
      return Object.prototype.toString.call(val);
  }
  function RGBComponent(val) {
      if (val > 255) {
          return 255;
      }
      else if (val < 0) {
          return 0;
      }
      return Math.round(val);
  }
  exports.RGBComponent = RGBComponent;
  function alphaComponent(val) {
      if (val > 1) {
          return 1;
      }
      else if (val < 0.0001) {
          return 0.0001;
      }
      return val;
  }
  exports.alphaComponent = alphaComponent;
  function getNumberValidator() {
      if (Global.Konva.isUnminified) {
          return function (val, attr) {
              if (!Util.Util._isNumber(val)) {
                  Util.Util.warn(_formatValue(val) +
                      ' is a not valid value for "' +
                      attr +
                      '" attribute. The value should be a number.');
              }
              return val;
          };
      }
  }
  exports.getNumberValidator = getNumberValidator;
  function getNumberOrAutoValidator() {
      if (Global.Konva.isUnminified) {
          return function (val, attr) {
              var isNumber = Util.Util._isNumber(val);
              var isAuto = val === 'auto';
              if (!(isNumber || isAuto)) {
                  Util.Util.warn(_formatValue(val) +
                      ' is a not valid value for "' +
                      attr +
                      '" attribute. The value should be a number or "auto".');
              }
              return val;
          };
      }
  }
  exports.getNumberOrAutoValidator = getNumberOrAutoValidator;
  function getStringValidator() {
      if (Global.Konva.isUnminified) {
          return function (val, attr) {
              if (!Util.Util._isString(val)) {
                  Util.Util.warn(_formatValue(val) +
                      ' is a not valid value for "' +
                      attr +
                      '" attribute. The value should be a string.');
              }
              return val;
          };
      }
  }
  exports.getStringValidator = getStringValidator;
  function getFunctionValidator() {
      if (Global.Konva.isUnminified) {
          return function (val, attr) {
              if (!Util.Util._isFunction(val)) {
                  Util.Util.warn(_formatValue(val) +
                      ' is a not valid value for "' +
                      attr +
                      '" attribute. The value should be a function.');
              }
              return val;
          };
      }
  }
  exports.getFunctionValidator = getFunctionValidator;
  function getNumberArrayValidator() {
      if (Global.Konva.isUnminified) {
          return function (val, attr) {
              if (!Util.Util._isArray(val)) {
                  Util.Util.warn(_formatValue(val) +
                      ' is a not valid value for "' +
                      attr +
                      '" attribute. The value should be a array of numbers.');
              }
              else {
                  val.forEach(function (item) {
                      if (!Util.Util._isNumber(item)) {
                          Util.Util.warn('"' +
                              attr +
                              '" attribute has non numeric element ' +
                              item +
                              '. Make sure that all elements are numbers.');
                      }
                  });
              }
              return val;
          };
      }
  }
  exports.getNumberArrayValidator = getNumberArrayValidator;
  function getBooleanValidator() {
      if (Global.Konva.isUnminified) {
          return function (val, attr) {
              var isBool = val === true || val === false;
              if (!isBool) {
                  Util.Util.warn(_formatValue(val) +
                      ' is a not valid value for "' +
                      attr +
                      '" attribute. The value should be a boolean.');
              }
              return val;
          };
      }
  }
  exports.getBooleanValidator = getBooleanValidator;
  function getComponentValidator(components) {
      if (Global.Konva.isUnminified) {
          return function (val, attr) {
              if (!Util.Util.isObject(val)) {
                  Util.Util.warn(_formatValue(val) +
                      ' is a not valid value for "' +
                      attr +
                      '" attribute. The value should be an object with properties ' +
                      components);
              }
              return val;
          };
      }
  }
  exports.getComponentValidator = getComponentValidator;
  });

  unwrapExports(Validators);
  var Validators_1 = Validators.RGBComponent;
  var Validators_2 = Validators.alphaComponent;
  var Validators_3 = Validators.getNumberValidator;
  var Validators_4 = Validators.getNumberOrAutoValidator;
  var Validators_5 = Validators.getStringValidator;
  var Validators_6 = Validators.getFunctionValidator;
  var Validators_7 = Validators.getNumberArrayValidator;
  var Validators_8 = Validators.getBooleanValidator;
  var Validators_9 = Validators.getComponentValidator;

  var Factory = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });


  var GET = 'get', SET = 'set';
  exports.Factory = {
      addGetterSetter: function (constructor, attr, def, validator, after) {
          this.addGetter(constructor, attr, def);
          this.addSetter(constructor, attr, validator, after);
          this.addOverloadedGetterSetter(constructor, attr);
      },
      addGetter: function (constructor, attr, def) {
          var method = GET + Util.Util._capitalize(attr);
          constructor.prototype[method] =
              constructor.prototype[method] ||
                  function () {
                      var val = this.attrs[attr];
                      return val === undefined ? def : val;
                  };
      },
      addSetter: function (constructor, attr, validator, after) {
          var method = SET + Util.Util._capitalize(attr);
          if (!constructor.prototype[method]) {
              exports.Factory.overWriteSetter(constructor, attr, validator, after);
          }
      },
      overWriteSetter: function (constructor, attr, validator, after) {
          var method = SET + Util.Util._capitalize(attr);
          constructor.prototype[method] = function (val) {
              if (validator && val !== undefined && val !== null) {
                  val = validator.call(this, val, attr);
              }
              this._setAttr(attr, val);
              if (after) {
                  after.call(this);
              }
              return this;
          };
      },
      addComponentsGetterSetter: function (constructor, attr, components, validator, after) {
          var len = components.length, capitalize = Util.Util._capitalize, getter = GET + capitalize(attr), setter = SET + capitalize(attr), n, component;
          constructor.prototype[getter] = function () {
              var ret = {};
              for (n = 0; n < len; n++) {
                  component = components[n];
                  ret[component] = this.getAttr(attr + capitalize(component));
              }
              return ret;
          };
          var basicValidator = Validators.getComponentValidator(components);
          constructor.prototype[setter] = function (val) {
              var oldVal = this.attrs[attr], key;
              if (validator) {
                  val = validator.call(this, val);
              }
              if (basicValidator) {
                  basicValidator.call(this, val, attr);
              }
              for (key in val) {
                  if (!val.hasOwnProperty(key)) {
                      continue;
                  }
                  this._setAttr(attr + capitalize(key), val[key]);
              }
              this._fireChangeEvent(attr, oldVal, val);
              if (after) {
                  after.call(this);
              }
              return this;
          };
          this.addOverloadedGetterSetter(constructor, attr);
      },
      addOverloadedGetterSetter: function (constructor, attr) {
          var capitalizedAttr = Util.Util._capitalize(attr), setter = SET + capitalizedAttr, getter = GET + capitalizedAttr;
          constructor.prototype[attr] = function () {
              if (arguments.length) {
                  this[setter](arguments[0]);
                  return this;
              }
              return this[getter]();
          };
      },
      addDeprecatedGetterSetter: function (constructor, attr, def, validator) {
          Util.Util.error('Adding deprecated ' + attr);
          var method = GET + Util.Util._capitalize(attr);
          var message = attr +
              ' property is deprecated and will be removed soon. Look at Konva change log for more information.';
          constructor.prototype[method] = function () {
              Util.Util.error(message);
              var val = this.attrs[attr];
              return val === undefined ? def : val;
          };
          this.addSetter(constructor, attr, validator, function () {
              Util.Util.error(message);
          });
          this.addOverloadedGetterSetter(constructor, attr);
      },
      backCompat: function (constructor, methods) {
          Util.Util.each(methods, function (oldMethodName, newMethodName) {
              var method = constructor.prototype[newMethodName];
              var oldGetter = GET + Util.Util._capitalize(oldMethodName);
              var oldSetter = SET + Util.Util._capitalize(oldMethodName);
              function deprecated() {
                  method.apply(this, arguments);
                  Util.Util.error('"' +
                      oldMethodName +
                      '" method is deprecated and will be removed soon. Use ""' +
                      newMethodName +
                      '" instead.');
              }
              constructor.prototype[oldMethodName] = deprecated;
              constructor.prototype[oldGetter] = deprecated;
              constructor.prototype[oldSetter] = deprecated;
          });
      },
      afterSetFilter: function () {
          this._filterUpToDate = false;
      }
  };
  });

  unwrapExports(Factory);
  var Factory_1 = Factory.Factory;

  var Context_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });


  var COMMA = ',', OPEN_PAREN = '(', CLOSE_PAREN = ')', OPEN_PAREN_BRACKET = '([', CLOSE_BRACKET_PAREN = '])', SEMICOLON = ';', DOUBLE_PAREN = '()', EQUALS = '=', CONTEXT_METHODS = [
      'arc',
      'arcTo',
      'beginPath',
      'bezierCurveTo',
      'clearRect',
      'clip',
      'closePath',
      'createLinearGradient',
      'createPattern',
      'createRadialGradient',
      'drawImage',
      'ellipse',
      'fill',
      'fillText',
      'getImageData',
      'createImageData',
      'lineTo',
      'moveTo',
      'putImageData',
      'quadraticCurveTo',
      'rect',
      'restore',
      'rotate',
      'save',
      'scale',
      'setLineDash',
      'setTransform',
      'stroke',
      'strokeText',
      'transform',
      'translate'
  ];
  var CONTEXT_PROPERTIES = [
      'fillStyle',
      'strokeStyle',
      'shadowColor',
      'shadowBlur',
      'shadowOffsetX',
      'shadowOffsetY',
      'lineCap',
      'lineDashOffset',
      'lineJoin',
      'lineWidth',
      'miterLimit',
      'font',
      'textAlign',
      'textBaseline',
      'globalAlpha',
      'globalCompositeOperation',
      'imageSmoothingEnabled'
  ];
  var traceArrMax = 100;
  var Context = (function () {
      function Context(canvas) {
          this.canvas = canvas;
          this._context = canvas._canvas.getContext('2d');
          if (Global.Konva.enableTrace) {
              this.traceArr = [];
              this._enableTrace();
          }
      }
      Context.prototype.fillShape = function (shape) {
          if (shape.getFillEnabled()) {
              this._fill(shape);
          }
      };
      Context.prototype._fill = function (shape) {
      };
      Context.prototype.strokeShape = function (shape) {
          if (shape.getStrokeEnabled()) {
              this._stroke(shape);
          }
      };
      Context.prototype._stroke = function (shape) {
      };
      Context.prototype.fillStrokeShape = function (shape) {
          if (shape.getFillEnabled()) {
              this._fill(shape);
          }
          if (shape.getStrokeEnabled()) {
              this._stroke(shape);
          }
      };
      Context.prototype.getTrace = function (relaxed) {
          var traceArr = this.traceArr, len = traceArr.length, str = '', n, trace, method, args;
          for (n = 0; n < len; n++) {
              trace = traceArr[n];
              method = trace.method;
              if (method) {
                  args = trace.args;
                  str += method;
                  if (relaxed) {
                      str += DOUBLE_PAREN;
                  }
                  else {
                      if (Util.Util._isArray(args[0])) {
                          str += OPEN_PAREN_BRACKET + args.join(COMMA) + CLOSE_BRACKET_PAREN;
                      }
                      else {
                          str += OPEN_PAREN + args.join(COMMA) + CLOSE_PAREN;
                      }
                  }
              }
              else {
                  str += trace.property;
                  if (!relaxed) {
                      str += EQUALS + trace.val;
                  }
              }
              str += SEMICOLON;
          }
          return str;
      };
      Context.prototype.clearTrace = function () {
          this.traceArr = [];
      };
      Context.prototype._trace = function (str) {
          var traceArr = this.traceArr, len;
          traceArr.push(str);
          len = traceArr.length;
          if (len >= traceArrMax) {
              traceArr.shift();
          }
      };
      Context.prototype.reset = function () {
          var pixelRatio = this.getCanvas().getPixelRatio();
          this.setTransform(1 * pixelRatio, 0, 0, 1 * pixelRatio, 0, 0);
      };
      Context.prototype.getCanvas = function () {
          return this.canvas;
      };
      Context.prototype.clear = function (bounds) {
          var canvas = this.getCanvas();
          if (bounds) {
              this.clearRect(bounds.x || 0, bounds.y || 0, bounds.width || 0, bounds.height || 0);
          }
          else {
              this.clearRect(0, 0, canvas.getWidth() / canvas.pixelRatio, canvas.getHeight() / canvas.pixelRatio);
          }
      };
      Context.prototype._applyLineCap = function (shape) {
          var lineCap = shape.getLineCap();
          if (lineCap) {
              this.setAttr('lineCap', lineCap);
          }
      };
      Context.prototype._applyOpacity = function (shape) {
          var absOpacity = shape.getAbsoluteOpacity();
          if (absOpacity !== 1) {
              this.setAttr('globalAlpha', absOpacity);
          }
      };
      Context.prototype._applyLineJoin = function (shape) {
          var lineJoin = shape.getLineJoin();
          if (lineJoin) {
              this.setAttr('lineJoin', lineJoin);
          }
      };
      Context.prototype.setAttr = function (attr, val) {
          this._context[attr] = val;
      };
      Context.prototype.arc = function (a0, a1, a2, a3, a4, a5) {
          this._context.arc(a0, a1, a2, a3, a4, a5);
      };
      Context.prototype.arcTo = function (a0, a1, a2, a3, a4) {
          this._context.arcTo(a0, a1, a2, a3, a4);
      };
      Context.prototype.beginPath = function () {
          this._context.beginPath();
      };
      Context.prototype.bezierCurveTo = function (a0, a1, a2, a3, a4, a5) {
          this._context.bezierCurveTo(a0, a1, a2, a3, a4, a5);
      };
      Context.prototype.clearRect = function (a0, a1, a2, a3) {
          this._context.clearRect(a0, a1, a2, a3);
      };
      Context.prototype.clip = function () {
          this._context.clip();
      };
      Context.prototype.closePath = function () {
          this._context.closePath();
      };
      Context.prototype.createImageData = function (a0, a1) {
          var a = arguments;
          if (a.length === 2) {
              return this._context.createImageData(a0, a1);
          }
          else if (a.length === 1) {
              return this._context.createImageData(a0);
          }
      };
      Context.prototype.createLinearGradient = function (a0, a1, a2, a3) {
          return this._context.createLinearGradient(a0, a1, a2, a3);
      };
      Context.prototype.createPattern = function (a0, a1) {
          return this._context.createPattern(a0, a1);
      };
      Context.prototype.createRadialGradient = function (a0, a1, a2, a3, a4, a5) {
          return this._context.createRadialGradient(a0, a1, a2, a3, a4, a5);
      };
      Context.prototype.drawImage = function (a0, a1, a2, a3, a4, a5, a6, a7, a8) {
          var a = arguments, _context = this._context;
          if (a.length === 3) {
              _context.drawImage(a0, a1, a2);
          }
          else if (a.length === 5) {
              _context.drawImage(a0, a1, a2, a3, a4);
          }
          else if (a.length === 9) {
              _context.drawImage(a0, a1, a2, a3, a4, a5, a6, a7, a8);
          }
      };
      Context.prototype.ellipse = function (a0, a1, a2, a3, a4, a5, a6, a7) {
          this._context.ellipse(a0, a1, a2, a3, a4, a5, a6, a7);
      };
      Context.prototype.isPointInPath = function (x, y) {
          return this._context.isPointInPath(x, y);
      };
      Context.prototype.fill = function () {
          this._context.fill();
      };
      Context.prototype.fillRect = function (x, y, width, height) {
          this._context.fillRect(x, y, width, height);
      };
      Context.prototype.strokeRect = function (x, y, width, height) {
          this._context.strokeRect(x, y, width, height);
      };
      Context.prototype.fillText = function (a0, a1, a2) {
          this._context.fillText(a0, a1, a2);
      };
      Context.prototype.measureText = function (text) {
          return this._context.measureText(text);
      };
      Context.prototype.getImageData = function (a0, a1, a2, a3) {
          return this._context.getImageData(a0, a1, a2, a3);
      };
      Context.prototype.lineTo = function (a0, a1) {
          this._context.lineTo(a0, a1);
      };
      Context.prototype.moveTo = function (a0, a1) {
          this._context.moveTo(a0, a1);
      };
      Context.prototype.rect = function (a0, a1, a2, a3) {
          this._context.rect(a0, a1, a2, a3);
      };
      Context.prototype.putImageData = function (a0, a1, a2) {
          this._context.putImageData(a0, a1, a2);
      };
      Context.prototype.quadraticCurveTo = function (a0, a1, a2, a3) {
          this._context.quadraticCurveTo(a0, a1, a2, a3);
      };
      Context.prototype.restore = function () {
          this._context.restore();
      };
      Context.prototype.rotate = function (a0) {
          this._context.rotate(a0);
      };
      Context.prototype.save = function () {
          this._context.save();
      };
      Context.prototype.scale = function (a0, a1) {
          this._context.scale(a0, a1);
      };
      Context.prototype.setLineDash = function (a0) {
          if (this._context.setLineDash) {
              this._context.setLineDash(a0);
          }
          else if ('mozDash' in this._context) {
              this._context['mozDash'] = a0;
          }
          else if ('webkitLineDash' in this._context) {
              this._context['webkitLineDash'] = a0;
          }
      };
      Context.prototype.getLineDash = function () {
          return this._context.getLineDash();
      };
      Context.prototype.setTransform = function (a0, a1, a2, a3, a4, a5) {
          this._context.setTransform(a0, a1, a2, a3, a4, a5);
      };
      Context.prototype.stroke = function () {
          this._context.stroke();
      };
      Context.prototype.strokeText = function (a0, a1, a2, a3) {
          this._context.strokeText(a0, a1, a2, a3);
      };
      Context.prototype.transform = function (a0, a1, a2, a3, a4, a5) {
          this._context.transform(a0, a1, a2, a3, a4, a5);
      };
      Context.prototype.translate = function (a0, a1) {
          this._context.translate(a0, a1);
      };
      Context.prototype._enableTrace = function () {
          var that = this, len = CONTEXT_METHODS.length, _simplifyArray = Util.Util._simplifyArray, origSetter = this.setAttr, n, args;
          var func = function (methodName) {
              var origMethod = that[methodName], ret;
              that[methodName] = function () {
                  args = _simplifyArray(Array.prototype.slice.call(arguments, 0));
                  ret = origMethod.apply(that, arguments);
                  that._trace({
                      method: methodName,
                      args: args
                  });
                  return ret;
              };
          };
          for (n = 0; n < len; n++) {
              func(CONTEXT_METHODS[n]);
          }
          that.setAttr = function () {
              origSetter.apply(that, arguments);
              var prop = arguments[0];
              var val = arguments[1];
              if (prop === 'shadowOffsetX' ||
                  prop === 'shadowOffsetY' ||
                  prop === 'shadowBlur') {
                  val = val / this.canvas.getPixelRatio();
              }
              that._trace({
                  property: prop,
                  val: val
              });
          };
      };
      Context.prototype._applyGlobalCompositeOperation = function (node) {
          var globalCompositeOperation = node.getGlobalCompositeOperation();
          if (globalCompositeOperation !== 'source-over') {
              this.setAttr('globalCompositeOperation', globalCompositeOperation);
          }
      };
      return Context;
  }());
  exports.Context = Context;
  CONTEXT_PROPERTIES.forEach(function (prop) {
      Object.defineProperty(Context.prototype, prop, {
          get: function () {
              return this._context[prop];
          },
          set: function (val) {
              this._context[prop] = val;
          }
      });
  });
  var SceneContext = (function (_super) {
      __extends(SceneContext, _super);
      function SceneContext() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      SceneContext.prototype._fillColor = function (shape) {
          var fill = shape.fill();
          this.setAttr('fillStyle', fill);
          shape._fillFunc(this);
      };
      SceneContext.prototype._fillPattern = function (shape) {
          var fillPatternX = shape.getFillPatternX(), fillPatternY = shape.getFillPatternY(), fillPatternRotation = Global.Konva.getAngle(shape.getFillPatternRotation()), fillPatternOffsetX = shape.getFillPatternOffsetX(), fillPatternOffsetY = shape.getFillPatternOffsetY(), fillPatternScaleX = shape.getFillPatternScaleX(), fillPatternScaleY = shape.getFillPatternScaleY();
          if (fillPatternX || fillPatternY) {
              this.translate(fillPatternX || 0, fillPatternY || 0);
          }
          if (fillPatternRotation) {
              this.rotate(fillPatternRotation);
          }
          if (fillPatternScaleX || fillPatternScaleY) {
              this.scale(fillPatternScaleX, fillPatternScaleY);
          }
          if (fillPatternOffsetX || fillPatternOffsetY) {
              this.translate(-1 * fillPatternOffsetX, -1 * fillPatternOffsetY);
          }
          this.setAttr('fillStyle', shape._getFillPattern());
          shape._fillFunc(this);
      };
      SceneContext.prototype._fillLinearGradient = function (shape) {
          var grd = shape._getLinearGradient();
          if (grd) {
              this.setAttr('fillStyle', grd);
              shape._fillFunc(this);
          }
      };
      SceneContext.prototype._fillRadialGradient = function (shape) {
          var grd = shape._getRadialGradient();
          if (grd) {
              this.setAttr('fillStyle', grd);
              shape._fillFunc(this);
          }
      };
      SceneContext.prototype._fill = function (shape) {
          var hasColor = shape.fill(), fillPriority = shape.getFillPriority();
          if (hasColor && fillPriority === 'color') {
              this._fillColor(shape);
              return;
          }
          var hasPattern = shape.getFillPatternImage();
          if (hasPattern && fillPriority === 'pattern') {
              this._fillPattern(shape);
              return;
          }
          var hasLinearGradient = shape.getFillLinearGradientColorStops();
          if (hasLinearGradient && fillPriority === 'linear-gradient') {
              this._fillLinearGradient(shape);
              return;
          }
          var hasRadialGradient = shape.getFillRadialGradientColorStops();
          if (hasRadialGradient && fillPriority === 'radial-gradient') {
              this._fillRadialGradient(shape);
              return;
          }
          if (hasColor) {
              this._fillColor(shape);
          }
          else if (hasPattern) {
              this._fillPattern(shape);
          }
          else if (hasLinearGradient) {
              this._fillLinearGradient(shape);
          }
          else if (hasRadialGradient) {
              this._fillRadialGradient(shape);
          }
      };
      SceneContext.prototype._strokeLinearGradient = function (shape) {
          var start = shape.getStrokeLinearGradientStartPoint(), end = shape.getStrokeLinearGradientEndPoint(), colorStops = shape.getStrokeLinearGradientColorStops(), grd = this.createLinearGradient(start.x, start.y, end.x, end.y);
          if (colorStops) {
              for (var n = 0; n < colorStops.length; n += 2) {
                  grd.addColorStop(colorStops[n], colorStops[n + 1]);
              }
              this.setAttr('strokeStyle', grd);
          }
      };
      SceneContext.prototype._stroke = function (shape) {
          var dash = shape.dash(), strokeScaleEnabled = shape.getStrokeScaleEnabled();
          if (shape.hasStroke()) {
              if (!strokeScaleEnabled) {
                  this.save();
                  var pixelRatio = this.getCanvas().getPixelRatio();
                  this.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
              }
              this._applyLineCap(shape);
              if (dash && shape.dashEnabled()) {
                  this.setLineDash(dash);
                  this.setAttr('lineDashOffset', shape.dashOffset());
              }
              this.setAttr('lineWidth', shape.strokeWidth());
              if (!shape.getShadowForStrokeEnabled()) {
                  this.setAttr('shadowColor', 'rgba(0,0,0,0)');
              }
              var hasLinearGradient = shape.getStrokeLinearGradientColorStops();
              if (hasLinearGradient) {
                  this._strokeLinearGradient(shape);
              }
              else {
                  this.setAttr('strokeStyle', shape.stroke());
              }
              shape._strokeFunc(this);
              if (!strokeScaleEnabled) {
                  this.restore();
              }
          }
      };
      SceneContext.prototype._applyShadow = function (shape) {
          var util = Util.Util, color = util.get(shape.getShadowRGBA(), 'black'), blur = util.get(shape.getShadowBlur(), 5), offset = util.get(shape.getShadowOffset(), {
              x: 0,
              y: 0
          }), scale = shape.getAbsoluteScale(), ratio = this.canvas.getPixelRatio(), scaleX = scale.x * ratio, scaleY = scale.y * ratio;
          this.setAttr('shadowColor', color);
          this.setAttr('shadowBlur', blur * Math.min(Math.abs(scaleX), Math.abs(scaleY)));
          this.setAttr('shadowOffsetX', offset.x * scaleX);
          this.setAttr('shadowOffsetY', offset.y * scaleY);
      };
      return SceneContext;
  }(Context));
  exports.SceneContext = SceneContext;
  var HitContext = (function (_super) {
      __extends(HitContext, _super);
      function HitContext() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      HitContext.prototype._fill = function (shape) {
          this.save();
          this.setAttr('fillStyle', shape.colorKey);
          shape._fillFuncHit(this);
          this.restore();
      };
      HitContext.prototype._stroke = function (shape) {
          if (shape.hasHitStroke()) {
              var strokeScaleEnabled = shape.getStrokeScaleEnabled();
              if (!strokeScaleEnabled) {
                  this.save();
                  var pixelRatio = this.getCanvas().getPixelRatio();
                  this.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
              }
              this._applyLineCap(shape);
              var hitStrokeWidth = shape.hitStrokeWidth();
              var strokeWidth = hitStrokeWidth === 'auto' ? shape.strokeWidth() : hitStrokeWidth;
              this.setAttr('lineWidth', strokeWidth);
              this.setAttr('strokeStyle', shape.colorKey);
              shape._strokeFuncHit(this);
              if (!strokeScaleEnabled) {
                  this.restore();
              }
          }
      };
      return HitContext;
  }(Context));
  exports.HitContext = HitContext;
  });

  unwrapExports(Context_1);
  var Context_2 = Context_1.Context;
  var Context_3 = Context_1.SceneContext;
  var Context_4 = Context_1.HitContext;

  var Canvas_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });





  var _pixelRatio;
  function getDevicePixelRatio() {
      if (_pixelRatio) {
          return _pixelRatio;
      }
      var canvas = Util.Util.createCanvasElement();
      var context = canvas.getContext('2d');
      _pixelRatio = (function () {
          var devicePixelRatio = Global.Konva._global.devicePixelRatio || 1, backingStoreRatio = context.webkitBackingStorePixelRatio ||
              context.mozBackingStorePixelRatio ||
              context.msBackingStorePixelRatio ||
              context.oBackingStorePixelRatio ||
              context.backingStorePixelRatio ||
              1;
          return devicePixelRatio / backingStoreRatio;
      })();
      return _pixelRatio;
  }
  var Canvas = (function () {
      function Canvas(config) {
          this.pixelRatio = 1;
          this.width = 0;
          this.height = 0;
          this.isCache = false;
          var conf = config || {};
          var pixelRatio = conf.pixelRatio || Global.Konva.pixelRatio || getDevicePixelRatio();
          this.pixelRatio = pixelRatio;
          this._canvas = Util.Util.createCanvasElement();
          this._canvas.style.padding = '0';
          this._canvas.style.margin = '0';
          this._canvas.style.border = '0';
          this._canvas.style.background = 'transparent';
          this._canvas.style.position = 'absolute';
          this._canvas.style.top = '0';
          this._canvas.style.left = '0';
      }
      Canvas.prototype.getContext = function () {
          return this.context;
      };
      Canvas.prototype.getPixelRatio = function () {
          return this.pixelRatio;
      };
      Canvas.prototype.setPixelRatio = function (pixelRatio) {
          var previousRatio = this.pixelRatio;
          this.pixelRatio = pixelRatio;
          this.setSize(this.getWidth() / previousRatio, this.getHeight() / previousRatio);
      };
      Canvas.prototype.setWidth = function (width) {
          this.width = this._canvas.width = width * this.pixelRatio;
          this._canvas.style.width = width + 'px';
          var pixelRatio = this.pixelRatio, _context = this.getContext()._context;
          _context.scale(pixelRatio, pixelRatio);
      };
      Canvas.prototype.setHeight = function (height) {
          this.height = this._canvas.height = height * this.pixelRatio;
          this._canvas.style.height = height + 'px';
          var pixelRatio = this.pixelRatio, _context = this.getContext()._context;
          _context.scale(pixelRatio, pixelRatio);
      };
      Canvas.prototype.getWidth = function () {
          return this.width;
      };
      Canvas.prototype.getHeight = function () {
          return this.height;
      };
      Canvas.prototype.setSize = function (width, height) {
          this.setWidth(width);
          this.setHeight(height);
      };
      Canvas.prototype.toDataURL = function (mimeType, quality) {
          try {
              return this._canvas.toDataURL(mimeType, quality);
          }
          catch (e) {
              try {
                  return this._canvas.toDataURL();
              }
              catch (err) {
                  Util.Util.error('Unable to get data URL. ' + err.message);
                  return '';
              }
          }
      };
      return Canvas;
  }());
  exports.Canvas = Canvas;
  Factory.Factory.addGetterSetter(Canvas, 'pixelRatio', undefined, Validators.getNumberValidator());
  var SceneCanvas = (function (_super) {
      __extends(SceneCanvas, _super);
      function SceneCanvas(config) {
          if (config === void 0) { config = { width: 0, height: 0 }; }
          var _this = _super.call(this, config) || this;
          _this.context = new Context_1.SceneContext(_this);
          _this.setSize(config.width, config.height);
          return _this;
      }
      return SceneCanvas;
  }(Canvas));
  exports.SceneCanvas = SceneCanvas;
  var HitCanvas = (function (_super) {
      __extends(HitCanvas, _super);
      function HitCanvas(config) {
          if (config === void 0) { config = { width: 0, height: 0 }; }
          var _this = _super.call(this, config) || this;
          _this.hitCanvas = true;
          _this.context = new Context_1.HitContext(_this);
          _this.setSize(config.width, config.height);
          return _this;
      }
      return HitCanvas;
  }(Canvas));
  exports.HitCanvas = HitCanvas;
  });

  unwrapExports(Canvas_1);
  var Canvas_2 = Canvas_1.Canvas;
  var Canvas_3 = Canvas_1.SceneCanvas;
  var Canvas_4 = Canvas_1.HitCanvas;

  var DragAndDrop = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });


  exports.DD = {
      get isDragging() {
          var flag = false;
          exports.DD._dragElements.forEach(function (elem) {
              if (elem.dragStatus === 'dragging') {
                  flag = true;
              }
          });
          return flag;
      },
      justDragged: false,
      get node() {
          var node;
          exports.DD._dragElements.forEach(function (elem) {
              node = elem.node;
          });
          return node;
      },
      _dragElements: new Map(),
      _drag: function (evt) {
          exports.DD._dragElements.forEach(function (elem, key) {
              var node = elem.node;
              var stage = node.getStage();
              stage.setPointersPositions(evt);
              if (elem.pointerId === undefined) {
                  elem.pointerId = Util.Util._getFirstPointerId(evt);
              }
              var pos = stage._changedPointerPositions.find(function (pos) { return pos.id === elem.pointerId; });
              if (!pos) {
                  return;
              }
              if (elem.dragStatus !== 'dragging') {
                  var dragDistance = node.dragDistance();
                  var distance = Math.max(Math.abs(pos.x - elem.startPointerPos.x), Math.abs(pos.y - elem.startPointerPos.y));
                  if (distance < dragDistance) {
                      return;
                  }
                  node.startDrag({ evt: evt });
                  if (!node.isDragging()) {
                      return;
                  }
              }
              node._setDragPosition(evt, elem);
              node.fire('dragmove', {
                  type: 'dragmove',
                  target: node,
                  evt: evt
              }, true);
          });
      },
      _endDragBefore: function (evt) {
          exports.DD._dragElements.forEach(function (elem, key) {
              var node = elem.node;
              var stage = node.getStage();
              if (evt) {
                  stage.setPointersPositions(evt);
              }
              var pos = stage._changedPointerPositions.find(function (pos) { return pos.id === elem.pointerId; });
              if (!pos) {
                  return;
              }
              if (elem.dragStatus === 'dragging' || elem.dragStatus === 'stopped') {
                  exports.DD.justDragged = true;
                  Global.Konva.listenClickTap = false;
                  elem.dragStatus = 'stopped';
              }
              var drawNode = elem.node.getLayer() ||
                  (elem.node instanceof Global.Konva['Stage'] && elem.node);
              if (drawNode) {
                  drawNode.draw();
              }
          });
      },
      _endDragAfter: function (evt) {
          exports.DD._dragElements.forEach(function (elem, key) {
              if (elem.dragStatus === 'stopped') {
                  elem.node.fire('dragend', {
                      type: 'dragend',
                      target: elem.node,
                      evt: evt
                  }, true);
              }
              if (elem.dragStatus !== 'dragging') {
                  exports.DD._dragElements.delete(key);
              }
          });
      }
  };
  if (Global.Konva.isBrowser) {
      window.addEventListener('mouseup', exports.DD._endDragBefore, true);
      window.addEventListener('touchend', exports.DD._endDragBefore, true);
      window.addEventListener('mousemove', exports.DD._drag);
      window.addEventListener('touchmove', exports.DD._drag);
      window.addEventListener('mouseup', exports.DD._endDragAfter, false);
      window.addEventListener('touchend', exports.DD._endDragAfter, false);
  }
  });

  unwrapExports(DragAndDrop);
  var DragAndDrop_1 = DragAndDrop.DD;

  var Node_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });






  exports.ids = {};
  exports.names = {};
  var _addId = function (node, id) {
      if (!id) {
          return;
      }
      exports.ids[id] = node;
  };
  exports._removeId = function (id, node) {
      if (!id) {
          return;
      }
      if (exports.ids[id] !== node) {
          return;
      }
      delete exports.ids[id];
  };
  exports._addName = function (node, name) {
      if (name) {
          if (!exports.names[name]) {
              exports.names[name] = [];
          }
          exports.names[name].push(node);
      }
  };
  exports._removeName = function (name, _id) {
      if (!name) {
          return;
      }
      var nodes = exports.names[name];
      if (!nodes) {
          return;
      }
      for (var n = 0; n < nodes.length; n++) {
          var no = nodes[n];
          if (no._id === _id) {
              nodes.splice(n, 1);
          }
      }
      if (nodes.length === 0) {
          delete exports.names[name];
      }
  };
  var ABSOLUTE_OPACITY = 'absoluteOpacity', ABSOLUTE_TRANSFORM = 'absoluteTransform', ABSOLUTE_SCALE = 'absoluteScale', CANVAS = 'canvas', CHANGE = 'Change', CHILDREN = 'children', KONVA = 'konva', LISTENING = 'listening', MOUSEENTER = 'mouseenter', MOUSELEAVE = 'mouseleave', NAME = 'name', SET = 'set', SHAPE = 'Shape', SPACE = ' ', STAGE = 'stage', TRANSFORM = 'transform', UPPER_STAGE = 'Stage', VISIBLE = 'visible', CLONE_BLACK_LIST = ['id'], TRANSFORM_CHANGE_STR = [
      'xChange.konva',
      'yChange.konva',
      'scaleXChange.konva',
      'scaleYChange.konva',
      'skewXChange.konva',
      'skewYChange.konva',
      'rotationChange.konva',
      'offsetXChange.konva',
      'offsetYChange.konva',
      'transformsEnabledChange.konva'
  ].join(SPACE), SCALE_CHANGE_STR = ['scaleXChange.konva', 'scaleYChange.konva'].join(SPACE);
  var emptyChildren = new Util.Collection();
  var idCounter = 1;
  var Node = (function () {
      function Node(config) {
          var _this = this;
          this._id = idCounter++;
          this.eventListeners = {};
          this.attrs = {};
          this.index = 0;
          this.parent = null;
          this._cache = new Map();
          this._lastPos = null;
          this._filterUpToDate = false;
          this._isUnderCache = false;
          this.children = emptyChildren;
          this._dragEventId = null;
          this.setAttrs(config);
          this.on(TRANSFORM_CHANGE_STR, function () {
              _this._clearCache(TRANSFORM);
              _this._clearSelfAndDescendantCache(ABSOLUTE_TRANSFORM);
          });
          this.on(SCALE_CHANGE_STR, function () {
              _this._clearSelfAndDescendantCache(ABSOLUTE_SCALE);
          });
          this.on('visibleChange.konva', function () {
              _this._clearSelfAndDescendantCache(VISIBLE);
          });
          this.on('listeningChange.konva', function () {
              _this._clearSelfAndDescendantCache(LISTENING);
          });
          this.on('opacityChange.konva', function () {
              _this._clearSelfAndDescendantCache(ABSOLUTE_OPACITY);
          });
      }
      Node.prototype.hasChildren = function () {
          return false;
      };
      Node.prototype.getChildren = function () {
          return emptyChildren;
      };
      Node.prototype._clearCache = function (attr) {
          if (attr) {
              this._cache.delete(attr);
          }
          else {
              this._cache.clear();
          }
      };
      Node.prototype._getCache = function (attr, privateGetter) {
          var cache = this._cache.get(attr);
          if (cache === undefined) {
              cache = privateGetter.call(this);
              this._cache.set(attr, cache);
          }
          return cache;
      };
      Node.prototype._getCanvasCache = function () {
          return this._cache.get(CANVAS);
      };
      Node.prototype._clearSelfAndDescendantCache = function (attr) {
          this._clearCache(attr);
          if (this.isCached()) {
              return;
          }
          if (this.children) {
              this.children.each(function (node) {
                  node._clearSelfAndDescendantCache(attr);
              });
          }
      };
      Node.prototype.clearCache = function () {
          this._cache.delete(CANVAS);
          this._clearSelfAndDescendantCache();
          return this;
      };
      Node.prototype.cache = function (config) {
          var conf = config || {};
          var rect = {};
          if (conf.x === undefined ||
              conf.y === undefined ||
              conf.width === undefined ||
              conf.height === undefined) {
              rect = this.getClientRect({
                  skipTransform: true,
                  relativeTo: this.getParent()
              });
          }
          var width = Math.ceil(conf.width || rect.width), height = Math.ceil(conf.height || rect.height), pixelRatio = conf.pixelRatio, x = conf.x === undefined ? rect.x : conf.x, y = conf.y === undefined ? rect.y : conf.y, offset = conf.offset || 0, drawBorder = conf.drawBorder || false;
          if (!width || !height) {
              Util.Util.error('Can not cache the node. Width or height of the node equals 0. Caching is skipped.');
              return;
          }
          width += offset * 2;
          height += offset * 2;
          x -= offset;
          y -= offset;
          var cachedSceneCanvas = new Canvas_1.SceneCanvas({
              pixelRatio: pixelRatio,
              width: width,
              height: height
          }), cachedFilterCanvas = new Canvas_1.SceneCanvas({
              pixelRatio: pixelRatio,
              width: width,
              height: height
          }), cachedHitCanvas = new Canvas_1.HitCanvas({
              pixelRatio: 1,
              width: width,
              height: height
          }), sceneContext = cachedSceneCanvas.getContext(), hitContext = cachedHitCanvas.getContext();
          cachedHitCanvas.isCache = true;
          this._cache.delete('canvas');
          this._filterUpToDate = false;
          if (conf.imageSmoothingEnabled === false) {
              cachedSceneCanvas.getContext()._context.imageSmoothingEnabled = false;
              cachedFilterCanvas.getContext()._context.imageSmoothingEnabled = false;
              cachedHitCanvas.getContext()._context.imageSmoothingEnabled = false;
          }
          sceneContext.save();
          hitContext.save();
          sceneContext.translate(-x, -y);
          hitContext.translate(-x, -y);
          this._isUnderCache = true;
          this._clearSelfAndDescendantCache(ABSOLUTE_OPACITY);
          this._clearSelfAndDescendantCache(ABSOLUTE_SCALE);
          this.drawScene(cachedSceneCanvas, this, true);
          this.drawHit(cachedHitCanvas, this, true);
          this._isUnderCache = false;
          sceneContext.restore();
          hitContext.restore();
          if (drawBorder) {
              sceneContext.save();
              sceneContext.beginPath();
              sceneContext.rect(0, 0, width, height);
              sceneContext.closePath();
              sceneContext.setAttr('strokeStyle', 'red');
              sceneContext.setAttr('lineWidth', 5);
              sceneContext.stroke();
              sceneContext.restore();
          }
          this._cache.set(CANVAS, {
              scene: cachedSceneCanvas,
              filter: cachedFilterCanvas,
              hit: cachedHitCanvas,
              x: x,
              y: y
          });
          return this;
      };
      Node.prototype.isCached = function () {
          return this._cache.has('canvas');
      };
      Node.prototype.getClientRect = function (config) {
          throw new Error('abstract "getClientRect" method call');
      };
      Node.prototype._transformedRect = function (rect, top) {
          var points = [
              { x: rect.x, y: rect.y },
              { x: rect.x + rect.width, y: rect.y },
              { x: rect.x + rect.width, y: rect.y + rect.height },
              { x: rect.x, y: rect.y + rect.height }
          ];
          var minX, minY, maxX, maxY;
          var trans = this.getAbsoluteTransform(top);
          points.forEach(function (point) {
              var transformed = trans.point(point);
              if (minX === undefined) {
                  minX = maxX = transformed.x;
                  minY = maxY = transformed.y;
              }
              minX = Math.min(minX, transformed.x);
              minY = Math.min(minY, transformed.y);
              maxX = Math.max(maxX, transformed.x);
              maxY = Math.max(maxY, transformed.y);
          });
          return {
              x: minX,
              y: minY,
              width: maxX - minX,
              height: maxY - minY
          };
      };
      Node.prototype._drawCachedSceneCanvas = function (context) {
          context.save();
          context._applyOpacity(this);
          context._applyGlobalCompositeOperation(this);
          var canvasCache = this._getCanvasCache();
          context.translate(canvasCache.x, canvasCache.y);
          var cacheCanvas = this._getCachedSceneCanvas();
          var ratio = cacheCanvas.pixelRatio;
          context.drawImage(cacheCanvas._canvas, 0, 0, cacheCanvas.width / ratio, cacheCanvas.height / ratio);
          context.restore();
      };
      Node.prototype._drawCachedHitCanvas = function (context) {
          var canvasCache = this._getCanvasCache(), hitCanvas = canvasCache.hit;
          context.save();
          context.translate(canvasCache.x, canvasCache.y);
          context.drawImage(hitCanvas._canvas, 0, 0);
          context.restore();
      };
      Node.prototype._getCachedSceneCanvas = function () {
          var filters = this.filters(), cachedCanvas = this._getCanvasCache(), sceneCanvas = cachedCanvas.scene, filterCanvas = cachedCanvas.filter, filterContext = filterCanvas.getContext(), len, imageData, n, filter;
          if (filters) {
              if (!this._filterUpToDate) {
                  var ratio = sceneCanvas.pixelRatio;
                  try {
                      len = filters.length;
                      filterContext.clear();
                      filterContext.drawImage(sceneCanvas._canvas, 0, 0, sceneCanvas.getWidth() / ratio, sceneCanvas.getHeight() / ratio);
                      imageData = filterContext.getImageData(0, 0, filterCanvas.getWidth(), filterCanvas.getHeight());
                      for (n = 0; n < len; n++) {
                          filter = filters[n];
                          if (typeof filter !== 'function') {
                              Util.Util.error('Filter should be type of function, but got ' +
                                  typeof filter +
                                  ' insted. Please check correct filters');
                              continue;
                          }
                          filter.call(this, imageData);
                          filterContext.putImageData(imageData, 0, 0);
                      }
                  }
                  catch (e) {
                      Util.Util.error('Unable to apply filter. ' + e.message);
                  }
                  this._filterUpToDate = true;
              }
              return filterCanvas;
          }
          return sceneCanvas;
      };
      Node.prototype.on = function (evtStr, handler) {
          if (arguments.length === 3) {
              return this._delegate.apply(this, arguments);
          }
          var events = evtStr.split(SPACE), len = events.length, n, event, parts, baseEvent, name;
          for (n = 0; n < len; n++) {
              event = events[n];
              parts = event.split('.');
              baseEvent = parts[0];
              name = parts[1] || '';
              if (!this.eventListeners[baseEvent]) {
                  this.eventListeners[baseEvent] = [];
              }
              this.eventListeners[baseEvent].push({
                  name: name,
                  handler: handler
              });
          }
          return this;
      };
      Node.prototype.off = function (evtStr, callback) {
          var events = (evtStr || '').split(SPACE), len = events.length, n, t, event, parts, baseEvent, name;
          if (!evtStr) {
              for (t in this.eventListeners) {
                  this._off(t);
              }
          }
          for (n = 0; n < len; n++) {
              event = events[n];
              parts = event.split('.');
              baseEvent = parts[0];
              name = parts[1];
              if (baseEvent) {
                  if (this.eventListeners[baseEvent]) {
                      this._off(baseEvent, name, callback);
                  }
              }
              else {
                  for (t in this.eventListeners) {
                      this._off(t, name, callback);
                  }
              }
          }
          return this;
      };
      Node.prototype.dispatchEvent = function (evt) {
          var e = {
              target: this,
              type: evt.type,
              evt: evt
          };
          this.fire(evt.type, e);
          return this;
      };
      Node.prototype.addEventListener = function (type, handler) {
          this.on(type, function (evt) {
              handler.call(this, evt.evt);
          });
          return this;
      };
      Node.prototype.removeEventListener = function (type) {
          this.off(type);
          return this;
      };
      Node.prototype._delegate = function (event, selector, handler) {
          var stopNode = this;
          this.on(event, function (evt) {
              var targets = evt.target.findAncestors(selector, true, stopNode);
              for (var i = 0; i < targets.length; i++) {
                  evt = Util.Util.cloneObject(evt);
                  evt.currentTarget = targets[i];
                  handler.call(targets[i], evt);
              }
          });
      };
      Node.prototype.remove = function () {
          if (this.isDragging()) {
              this.stopDrag();
          }
          DragAndDrop.DD._dragElements.delete(this._id);
          this._remove();
          return this;
      };
      Node.prototype._remove = function () {
          this._clearSelfAndDescendantCache(STAGE);
          this._clearSelfAndDescendantCache(ABSOLUTE_TRANSFORM);
          this._clearSelfAndDescendantCache(VISIBLE);
          this._clearSelfAndDescendantCache(LISTENING);
          this._clearSelfAndDescendantCache(ABSOLUTE_OPACITY);
          var parent = this.getParent();
          if (parent && parent.children) {
              parent.children.splice(this.index, 1);
              parent._setChildrenIndices();
              this.parent = null;
          }
      };
      Node.prototype.destroy = function () {
          exports._removeId(this.id(), this);
          var names = (this.name() || '').split(/\s/g);
          for (var i = 0; i < names.length; i++) {
              var subname = names[i];
              exports._removeName(subname, this._id);
          }
          this.remove();
          return this;
      };
      Node.prototype.getAttr = function (attr) {
          var method = 'get' + Util.Util._capitalize(attr);
          if (Util.Util._isFunction(this[method])) {
              return this[method]();
          }
          return this.attrs[attr];
      };
      Node.prototype.getAncestors = function () {
          var parent = this.getParent(), ancestors = new Util.Collection();
          while (parent) {
              ancestors.push(parent);
              parent = parent.getParent();
          }
          return ancestors;
      };
      Node.prototype.getAttrs = function () {
          return this.attrs || {};
      };
      Node.prototype.setAttrs = function (config) {
          var key, method;
          if (!config) {
              return this;
          }
          for (key in config) {
              if (key === CHILDREN) {
                  continue;
              }
              method = SET + Util.Util._capitalize(key);
              if (Util.Util._isFunction(this[method])) {
                  this[method](config[key]);
              }
              else {
                  this._setAttr(key, config[key]);
              }
          }
          return this;
      };
      Node.prototype.isListening = function () {
          return this._getCache(LISTENING, this._isListening);
      };
      Node.prototype._isListening = function () {
          var listening = this.listening(), parent = this.getParent();
          if (listening === 'inherit') {
              if (parent) {
                  return parent.isListening();
              }
              else {
                  return true;
              }
          }
          else {
              return listening;
          }
      };
      Node.prototype.isVisible = function () {
          return this._getCache(VISIBLE, this._isVisible);
      };
      Node.prototype._isVisible = function (relativeTo) {
          var visible = this.visible(), parent = this.getParent();
          if (visible === 'inherit') {
              if (parent && parent !== relativeTo) {
                  return parent._isVisible(relativeTo);
              }
              else {
                  return true;
              }
          }
          else if (relativeTo && relativeTo !== parent) {
              return visible && parent._isVisible(relativeTo);
          }
          else {
              return visible;
          }
      };
      Node.prototype.shouldDrawHit = function () {
          var layer = this.getLayer();
          return ((!layer && this.isListening() && this.isVisible()) ||
              (layer &&
                  layer.hitGraphEnabled() &&
                  this.isListening() &&
                  this.isVisible()));
      };
      Node.prototype.show = function () {
          this.visible(true);
          return this;
      };
      Node.prototype.hide = function () {
          this.visible(false);
          return this;
      };
      Node.prototype.getZIndex = function () {
          return this.index || 0;
      };
      Node.prototype.getAbsoluteZIndex = function () {
          var depth = this.getDepth(), that = this, index = 0, nodes, len, n, child;
          function addChildren(children) {
              nodes = [];
              len = children.length;
              for (n = 0; n < len; n++) {
                  child = children[n];
                  index++;
                  if (child.nodeType !== SHAPE) {
                      nodes = nodes.concat(child.getChildren().toArray());
                  }
                  if (child._id === that._id) {
                      n = len;
                  }
              }
              if (nodes.length > 0 && nodes[0].getDepth() <= depth) {
                  addChildren(nodes);
              }
          }
          if (that.nodeType !== UPPER_STAGE) {
              addChildren(that.getStage().getChildren());
          }
          return index;
      };
      Node.prototype.getDepth = function () {
          var depth = 0, parent = this.parent;
          while (parent) {
              depth++;
              parent = parent.parent;
          }
          return depth;
      };
      Node.prototype.setPosition = function (pos) {
          this.x(pos.x);
          this.y(pos.y);
          return this;
      };
      Node.prototype.getPosition = function () {
          return {
              x: this.x(),
              y: this.y()
          };
      };
      Node.prototype.getAbsolutePosition = function (top) {
          var haveCachedParent = false;
          var parent = this.parent;
          while (parent) {
              if (parent.isCached()) {
                  haveCachedParent = true;
                  break;
              }
              parent = parent.parent;
          }
          if (haveCachedParent && !top) {
              top = true;
          }
          var absoluteMatrix = this.getAbsoluteTransform(top).getMatrix(), absoluteTransform = new Util.Transform(), offset = this.offset();
          absoluteTransform.m = absoluteMatrix.slice();
          absoluteTransform.translate(offset.x, offset.y);
          return absoluteTransform.getTranslation();
      };
      Node.prototype.setAbsolutePosition = function (pos) {
          var origTrans = this._clearTransform(), it;
          this.attrs.x = origTrans.x;
          this.attrs.y = origTrans.y;
          delete origTrans.x;
          delete origTrans.y;
          it = this.getAbsoluteTransform();
          it.invert();
          it.translate(pos.x, pos.y);
          pos = {
              x: this.attrs.x + it.getTranslation().x,
              y: this.attrs.y + it.getTranslation().y
          };
          this.setPosition({ x: pos.x, y: pos.y });
          this._setTransform(origTrans);
          return this;
      };
      Node.prototype._setTransform = function (trans) {
          var key;
          for (key in trans) {
              this.attrs[key] = trans[key];
          }
          this._clearCache(TRANSFORM);
          this._clearSelfAndDescendantCache(ABSOLUTE_TRANSFORM);
      };
      Node.prototype._clearTransform = function () {
          var trans = {
              x: this.x(),
              y: this.y(),
              rotation: this.rotation(),
              scaleX: this.scaleX(),
              scaleY: this.scaleY(),
              offsetX: this.offsetX(),
              offsetY: this.offsetY(),
              skewX: this.skewX(),
              skewY: this.skewY()
          };
          this.attrs.x = 0;
          this.attrs.y = 0;
          this.attrs.rotation = 0;
          this.attrs.scaleX = 1;
          this.attrs.scaleY = 1;
          this.attrs.offsetX = 0;
          this.attrs.offsetY = 0;
          this.attrs.skewX = 0;
          this.attrs.skewY = 0;
          this._clearCache(TRANSFORM);
          this._clearSelfAndDescendantCache(ABSOLUTE_TRANSFORM);
          return trans;
      };
      Node.prototype.move = function (change) {
          var changeX = change.x, changeY = change.y, x = this.x(), y = this.y();
          if (changeX !== undefined) {
              x += changeX;
          }
          if (changeY !== undefined) {
              y += changeY;
          }
          this.setPosition({ x: x, y: y });
          return this;
      };
      Node.prototype._eachAncestorReverse = function (func, top) {
          var family = [], parent = this.getParent(), len, n;
          if (top && top._id === this._id) {
              func(this);
              return;
          }
          family.unshift(this);
          while (parent && (!top || parent._id !== top._id)) {
              family.unshift(parent);
              parent = parent.parent;
          }
          len = family.length;
          for (n = 0; n < len; n++) {
              func(family[n]);
          }
      };
      Node.prototype.rotate = function (theta) {
          this.rotation(this.rotation() + theta);
          return this;
      };
      Node.prototype.moveToTop = function () {
          if (!this.parent) {
              Util.Util.warn('Node has no parent. moveToTop function is ignored.');
              return false;
          }
          var index = this.index;
          this.parent.children.splice(index, 1);
          this.parent.children.push(this);
          this.parent._setChildrenIndices();
          return true;
      };
      Node.prototype.moveUp = function () {
          if (!this.parent) {
              Util.Util.warn('Node has no parent. moveUp function is ignored.');
              return false;
          }
          var index = this.index, len = this.parent.getChildren().length;
          if (index < len - 1) {
              this.parent.children.splice(index, 1);
              this.parent.children.splice(index + 1, 0, this);
              this.parent._setChildrenIndices();
              return true;
          }
          return false;
      };
      Node.prototype.moveDown = function () {
          if (!this.parent) {
              Util.Util.warn('Node has no parent. moveDown function is ignored.');
              return false;
          }
          var index = this.index;
          if (index > 0) {
              this.parent.children.splice(index, 1);
              this.parent.children.splice(index - 1, 0, this);
              this.parent._setChildrenIndices();
              return true;
          }
          return false;
      };
      Node.prototype.moveToBottom = function () {
          if (!this.parent) {
              Util.Util.warn('Node has no parent. moveToBottom function is ignored.');
              return false;
          }
          var index = this.index;
          if (index > 0) {
              this.parent.children.splice(index, 1);
              this.parent.children.unshift(this);
              this.parent._setChildrenIndices();
              return true;
          }
          return false;
      };
      Node.prototype.setZIndex = function (zIndex) {
          if (!this.parent) {
              Util.Util.warn('Node has no parent. zIndex parameter is ignored.');
              return this;
          }
          if (zIndex < 0 || zIndex >= this.parent.children.length) {
              Util.Util.warn('Unexpected value ' +
                  zIndex +
                  ' for zIndex property. zIndex is just index of a node in children of its parent. Expected value is from 0 to ' +
                  (this.parent.children.length - 1) +
                  '.');
          }
          var index = this.index;
          this.parent.children.splice(index, 1);
          this.parent.children.splice(zIndex, 0, this);
          this.parent._setChildrenIndices();
          return this;
      };
      Node.prototype.getAbsoluteOpacity = function () {
          return this._getCache(ABSOLUTE_OPACITY, this._getAbsoluteOpacity);
      };
      Node.prototype._getAbsoluteOpacity = function () {
          var absOpacity = this.opacity();
          var parent = this.getParent();
          if (parent && !parent._isUnderCache) {
              absOpacity *= parent.getAbsoluteOpacity();
          }
          return absOpacity;
      };
      Node.prototype.moveTo = function (newContainer) {
          if (this.getParent() !== newContainer) {
              this._remove();
              newContainer.add(this);
          }
          return this;
      };
      Node.prototype.toObject = function () {
          var obj = {}, attrs = this.getAttrs(), key, val, getter, defaultValue, nonPlainObject;
          obj.attrs = {};
          for (key in attrs) {
              val = attrs[key];
              nonPlainObject =
                  Util.Util.isObject(val) && !Util.Util._isPlainObject(val) && !Util.Util._isArray(val);
              if (nonPlainObject) {
                  continue;
              }
              getter = typeof this[key] === 'function' && this[key];
              delete attrs[key];
              defaultValue = getter ? getter.call(this) : null;
              attrs[key] = val;
              if (defaultValue !== val) {
                  obj.attrs[key] = val;
              }
          }
          obj.className = this.getClassName();
          return Util.Util._prepareToStringify(obj);
      };
      Node.prototype.toJSON = function () {
          return JSON.stringify(this.toObject());
      };
      Node.prototype.getParent = function () {
          return this.parent;
      };
      Node.prototype.findAncestors = function (selector, includeSelf, stopNode) {
          var res = [];
          if (includeSelf && this._isMatch(selector)) {
              res.push(this);
          }
          var ancestor = this.parent;
          while (ancestor) {
              if (ancestor === stopNode) {
                  return res;
              }
              if (ancestor._isMatch(selector)) {
                  res.push(ancestor);
              }
              ancestor = ancestor.parent;
          }
          return res;
      };
      Node.prototype.isAncestorOf = function (node) {
          return false;
      };
      Node.prototype.findAncestor = function (selector, includeSelf, stopNode) {
          return this.findAncestors(selector, includeSelf, stopNode)[0];
      };
      Node.prototype._isMatch = function (selector) {
          if (!selector) {
              return false;
          }
          if (typeof selector === 'function') {
              return selector(this);
          }
          var selectorArr = selector.replace(/ /g, '').split(','), len = selectorArr.length, n, sel;
          for (n = 0; n < len; n++) {
              sel = selectorArr[n];
              if (!Util.Util.isValidSelector(sel)) {
                  Util.Util.warn('Selector "' +
                      sel +
                      '" is invalid. Allowed selectors examples are "#foo", ".bar" or "Group".');
                  Util.Util.warn('If you have a custom shape with such className, please change it to start with upper letter like "Triangle".');
                  Util.Util.warn('Konva is awesome, right?');
              }
              if (sel.charAt(0) === '#') {
                  if (this.id() === sel.slice(1)) {
                      return true;
                  }
              }
              else if (sel.charAt(0) === '.') {
                  if (this.hasName(sel.slice(1))) {
                      return true;
                  }
              }
              else if (this.className === sel || this.nodeType === sel) {
                  return true;
              }
          }
          return false;
      };
      Node.prototype.getLayer = function () {
          var parent = this.getParent();
          return parent ? parent.getLayer() : null;
      };
      Node.prototype.getStage = function () {
          return this._getCache(STAGE, this._getStage);
      };
      Node.prototype._getStage = function () {
          var parent = this.getParent();
          if (parent) {
              return parent.getStage();
          }
          else {
              return undefined;
          }
      };
      Node.prototype.fire = function (eventType, evt, bubble) {
          evt = evt || {};
          evt.target = evt.target || this;
          if (bubble) {
              this._fireAndBubble(eventType, evt);
          }
          else {
              this._fire(eventType, evt);
          }
          return this;
      };
      Node.prototype.getAbsoluteTransform = function (top) {
          if (top) {
              return this._getAbsoluteTransform(top);
          }
          else {
              return this._getCache(ABSOLUTE_TRANSFORM, this._getAbsoluteTransform);
          }
      };
      Node.prototype._getAbsoluteTransform = function (top) {
          var at;
          if (top) {
              at = new Util.Transform();
              this._eachAncestorReverse(function (node) {
                  var transformsEnabled = node.transformsEnabled();
                  if (transformsEnabled === 'all') {
                      at.multiply(node.getTransform());
                  }
                  else if (transformsEnabled === 'position') {
                      at.translate(node.x() - node.offsetX(), node.y() - node.offsetY());
                  }
              }, top);
              return at;
          }
          else {
              if (this.parent) {
                  at = this.parent.getAbsoluteTransform().copy();
              }
              else {
                  at = new Util.Transform();
              }
              var transformsEnabled = this.transformsEnabled();
              if (transformsEnabled === 'all') {
                  at.multiply(this.getTransform());
              }
              else if (transformsEnabled === 'position') {
                  at.translate(this.x() - this.offsetX(), this.y() - this.offsetY());
              }
              return at;
          }
      };
      Node.prototype.getAbsoluteScale = function (top) {
          if (top) {
              return this._getAbsoluteScale(top);
          }
          else {
              return this._getCache(ABSOLUTE_SCALE, this._getAbsoluteScale);
          }
      };
      Node.prototype._getAbsoluteScale = function (top) {
          var parent = this;
          while (parent) {
              if (parent._isUnderCache) {
                  top = parent;
              }
              parent = parent.getParent();
          }
          var scaleX = 1, scaleY = 1;
          this._eachAncestorReverse(function (node) {
              scaleX *= node.scaleX();
              scaleY *= node.scaleY();
          }, top);
          return {
              x: scaleX,
              y: scaleY
          };
      };
      Node.prototype.getTransform = function () {
          return this._getCache(TRANSFORM, this._getTransform);
      };
      Node.prototype._getTransform = function () {
          var m = new Util.Transform(), x = this.x(), y = this.y(), rotation = Global.Konva.getAngle(this.rotation()), scaleX = this.scaleX(), scaleY = this.scaleY(), skewX = this.skewX(), skewY = this.skewY(), offsetX = this.offsetX(), offsetY = this.offsetY();
          if (x !== 0 || y !== 0) {
              m.translate(x, y);
          }
          if (rotation !== 0) {
              m.rotate(rotation);
          }
          if (skewX !== 0 || skewY !== 0) {
              m.skew(skewX, skewY);
          }
          if (scaleX !== 1 || scaleY !== 1) {
              m.scale(scaleX, scaleY);
          }
          if (offsetX !== 0 || offsetY !== 0) {
              m.translate(-1 * offsetX, -1 * offsetY);
          }
          return m;
      };
      Node.prototype.clone = function (obj) {
          var attrs = Util.Util.cloneObject(this.attrs), key, allListeners, len, n, listener;
          for (var i in CLONE_BLACK_LIST) {
              var blockAttr = CLONE_BLACK_LIST[i];
              delete attrs[blockAttr];
          }
          for (key in obj) {
              attrs[key] = obj[key];
          }
          var node = new this.constructor(attrs);
          for (key in this.eventListeners) {
              allListeners = this.eventListeners[key];
              len = allListeners.length;
              for (n = 0; n < len; n++) {
                  listener = allListeners[n];
                  if (listener.name.indexOf(KONVA) < 0) {
                      if (!node.eventListeners[key]) {
                          node.eventListeners[key] = [];
                      }
                      node.eventListeners[key].push(listener);
                  }
              }
          }
          return node;
      };
      Node.prototype._toKonvaCanvas = function (config) {
          config = config || {};
          var box = this.getClientRect();
          var stage = this.getStage(), x = config.x !== undefined ? config.x : box.x, y = config.y !== undefined ? config.y : box.y, pixelRatio = config.pixelRatio || 1, canvas = new Canvas_1.SceneCanvas({
              width: config.width || box.width || (stage ? stage.width() : 0),
              height: config.height || box.height || (stage ? stage.height() : 0),
              pixelRatio: pixelRatio
          }), context = canvas.getContext();
          context.save();
          if (x || y) {
              context.translate(-1 * x, -1 * y);
          }
          this.drawScene(canvas);
          context.restore();
          return canvas;
      };
      Node.prototype.toCanvas = function (config) {
          return this._toKonvaCanvas(config)._canvas;
      };
      Node.prototype.toDataURL = function (config) {
          config = config || {};
          var mimeType = config.mimeType || null, quality = config.quality || null;
          var url = this._toKonvaCanvas(config).toDataURL(mimeType, quality);
          if (config.callback) {
              config.callback(url);
          }
          return url;
      };
      Node.prototype.toImage = function (config) {
          if (!config || !config.callback) {
              throw 'callback required for toImage method config argument';
          }
          var callback = config.callback;
          delete config.callback;
          Util.Util._urlToImage(this.toDataURL(config), function (img) {
              callback(img);
          });
      };
      Node.prototype.setSize = function (size) {
          this.width(size.width);
          this.height(size.height);
          return this;
      };
      Node.prototype.getSize = function () {
          return {
              width: this.width(),
              height: this.height()
          };
      };
      Node.prototype.getClassName = function () {
          return this.className || this.nodeType;
      };
      Node.prototype.getType = function () {
          return this.nodeType;
      };
      Node.prototype.getDragDistance = function () {
          if (this.attrs.dragDistance !== undefined) {
              return this.attrs.dragDistance;
          }
          else if (this.parent) {
              return this.parent.getDragDistance();
          }
          else {
              return Global.Konva.dragDistance;
          }
      };
      Node.prototype._off = function (type, name, callback) {
          var evtListeners = this.eventListeners[type], i, evtName, handler;
          for (i = 0; i < evtListeners.length; i++) {
              evtName = evtListeners[i].name;
              handler = evtListeners[i].handler;
              if ((evtName !== 'konva' || name === 'konva') &&
                  (!name || evtName === name) &&
                  (!callback || callback === handler)) {
                  evtListeners.splice(i, 1);
                  if (evtListeners.length === 0) {
                      delete this.eventListeners[type];
                      break;
                  }
                  i--;
              }
          }
      };
      Node.prototype._fireChangeEvent = function (attr, oldVal, newVal) {
          this._fire(attr + CHANGE, {
              oldVal: oldVal,
              newVal: newVal
          });
      };
      Node.prototype.setId = function (id) {
          var oldId = this.id();
          exports._removeId(oldId, this);
          _addId(this, id);
          this._setAttr('id', id);
          return this;
      };
      Node.prototype.setName = function (name) {
          var oldNames = (this.name() || '').split(/\s/g);
          var newNames = (name || '').split(/\s/g);
          var subname, i;
          for (i = 0; i < oldNames.length; i++) {
              subname = oldNames[i];
              if (newNames.indexOf(subname) === -1 && subname) {
                  exports._removeName(subname, this._id);
              }
          }
          for (i = 0; i < newNames.length; i++) {
              subname = newNames[i];
              if (oldNames.indexOf(subname) === -1 && subname) {
                  exports._addName(this, subname);
              }
          }
          this._setAttr(NAME, name);
          return this;
      };
      Node.prototype.addName = function (name) {
          if (!this.hasName(name)) {
              var oldName = this.name();
              var newName = oldName ? oldName + ' ' + name : name;
              this.setName(newName);
          }
          return this;
      };
      Node.prototype.hasName = function (name) {
          if (!name) {
              return false;
          }
          var fullName = this.name();
          if (!fullName) {
              return false;
          }
          var names = (fullName || '').split(/\s/g);
          return names.indexOf(name) !== -1;
      };
      Node.prototype.removeName = function (name) {
          var names = (this.name() || '').split(/\s/g);
          var index = names.indexOf(name);
          if (index !== -1) {
              names.splice(index, 1);
              this.setName(names.join(' '));
          }
          return this;
      };
      Node.prototype.setAttr = function (attr, val) {
          var func = this[SET + Util.Util._capitalize(attr)];
          if (Util.Util._isFunction(func)) {
              func.call(this, val);
          }
          else {
              this._setAttr(attr, val);
          }
          return this;
      };
      Node.prototype._setAttr = function (key, val) {
          var oldVal = this.attrs[key];
          if (oldVal === val && !Util.Util.isObject(val)) {
              return;
          }
          if (val === undefined || val === null) {
              delete this.attrs[key];
          }
          else {
              this.attrs[key] = val;
          }
          this._fireChangeEvent(key, oldVal, val);
      };
      Node.prototype._setComponentAttr = function (key, component, val) {
          var oldVal;
          if (val !== undefined) {
              oldVal = this.attrs[key];
              if (!oldVal) {
                  this.attrs[key] = this.getAttr(key);
              }
              this.attrs[key][component] = val;
              this._fireChangeEvent(key, oldVal, val);
          }
      };
      Node.prototype._fireAndBubble = function (eventType, evt, compareShape) {
          if (evt && this.nodeType === SHAPE) {
              evt.target = this;
          }
          var shouldStop = (eventType === MOUSEENTER || eventType === MOUSELEAVE) &&
              ((compareShape &&
                  (this === compareShape ||
                      (this.isAncestorOf && this.isAncestorOf(compareShape)))) ||
                  (this.nodeType === 'Stage' && !compareShape));
          if (!shouldStop) {
              this._fire(eventType, evt);
              var stopBubble = (eventType === MOUSEENTER || eventType === MOUSELEAVE) &&
                  (compareShape &&
                      compareShape.isAncestorOf &&
                      compareShape.isAncestorOf(this) &&
                      !compareShape.isAncestorOf(this.parent));
              if (((evt && !evt.cancelBubble) || !evt) &&
                  this.parent &&
                  this.parent.isListening() &&
                  !stopBubble) {
                  if (compareShape && compareShape.parent) {
                      this._fireAndBubble.call(this.parent, eventType, evt, compareShape.parent);
                  }
                  else {
                      this._fireAndBubble.call(this.parent, eventType, evt);
                  }
              }
          }
      };
      Node.prototype._fire = function (eventType, evt) {
          var events = this.eventListeners[eventType], i;
          if (events) {
              evt = evt || {};
              evt.currentTarget = this;
              evt.type = eventType;
              for (i = 0; i < events.length; i++) {
                  events[i].handler.call(this, evt);
              }
          }
      };
      Node.prototype.draw = function () {
          this.drawScene();
          this.drawHit();
          return this;
      };
      Node.prototype._createDragElement = function (evt) {
          var pointerId = evt ? evt.pointerId : undefined;
          var stage = this.getStage();
          var ap = this.getAbsolutePosition();
          var pos = stage._getPointerById(pointerId) ||
              stage._changedPointerPositions[0] ||
              ap;
          DragAndDrop.DD._dragElements.set(this._id, {
              node: this,
              startPointerPos: pos,
              offset: {
                  x: pos.x - ap.x,
                  y: pos.y - ap.y
              },
              dragStatus: 'ready',
              pointerId: pointerId
          });
      };
      Node.prototype.startDrag = function (evt) {
          if (!DragAndDrop.DD._dragElements.has(this._id)) {
              this._createDragElement(evt);
          }
          var elem = DragAndDrop.DD._dragElements.get(this._id);
          elem.dragStatus = 'dragging';
          this.fire('dragstart', {
              type: 'dragstart',
              target: this,
              evt: evt && evt.evt
          }, true);
      };
      Node.prototype._setDragPosition = function (evt, elem) {
          var pos = this.getStage()._getPointerById(elem.pointerId);
          if (!pos) {
              return;
          }
          var newNodePos = {
              x: pos.x - elem.offset.x,
              y: pos.y - elem.offset.y
          };
          var dbf = this.dragBoundFunc();
          if (dbf !== undefined) {
              var bounded = dbf.call(this, newNodePos, evt);
              if (!bounded) {
                  Util.Util.warn('dragBoundFunc did not return any value. That is unexpected behavior. You must return new absolute position from dragBoundFunc.');
              }
              else {
                  newNodePos = bounded;
              }
          }
          if (!this._lastPos ||
              this._lastPos.x !== newNodePos.x ||
              this._lastPos.y !== newNodePos.y) {
              this.setAbsolutePosition(newNodePos);
              if (this.getLayer()) {
                  this.getLayer().batchDraw();
              }
              else if (this.getStage()) {
                  this.getStage().batchDraw();
              }
          }
          this._lastPos = newNodePos;
      };
      Node.prototype.stopDrag = function (evt) {
          var elem = DragAndDrop.DD._dragElements.get(this._id);
          if (elem) {
              elem.dragStatus = 'stopped';
          }
          DragAndDrop.DD._endDragBefore(evt);
          DragAndDrop.DD._endDragAfter(evt);
      };
      Node.prototype.setDraggable = function (draggable) {
          this._setAttr('draggable', draggable);
          this._dragChange();
      };
      Node.prototype.isDragging = function () {
          var elem = DragAndDrop.DD._dragElements.get(this._id);
          return elem ? elem.dragStatus === 'dragging' : false;
      };
      Node.prototype._listenDrag = function () {
          this._dragCleanup();
          this.on('mousedown.konva touchstart.konva', function (evt) {
              var _this = this;
              var shouldCheckButton = evt.evt['button'] !== undefined;
              var canDrag = !shouldCheckButton || Global.Konva.dragButtons.indexOf(evt.evt['button']) >= 0;
              if (!canDrag) {
                  return;
              }
              if (this.isDragging()) {
                  return;
              }
              var hasDraggingChild = false;
              DragAndDrop.DD._dragElements.forEach(function (elem) {
                  if (_this.isAncestorOf(elem.node)) {
                      hasDraggingChild = true;
                  }
              });
              if (!hasDraggingChild) {
                  this._createDragElement(evt);
              }
          });
      };
      Node.prototype._dragChange = function () {
          if (this.attrs.draggable) {
              this._listenDrag();
          }
          else {
              this._dragCleanup();
              var stage = this.getStage();
              if (stage && DragAndDrop.DD._dragElements.has(this._id)) {
                  this.stopDrag();
              }
          }
      };
      Node.prototype._dragCleanup = function () {
          this.off('mousedown.konva');
          this.off('touchstart.konva');
      };
      Node.create = function (data, container) {
          if (Util.Util._isString(data)) {
              data = JSON.parse(data);
          }
          return this._createNode(data, container);
      };
      Node._createNode = function (obj, container) {
          var className = Node.prototype.getClassName.call(obj), children = obj.children, no, len, n;
          if (container) {
              obj.attrs.container = container;
          }
          if (!Global._NODES_REGISTRY[className]) {
              Util.Util.warn('Can not find a node with class name "' +
                  className +
                  '". Fallback to "Shape".');
              className = 'Shape';
          }
          var Class = Global._NODES_REGISTRY[className];
          no = new Class(obj.attrs);
          if (children) {
              len = children.length;
              for (n = 0; n < len; n++) {
                  no.add(Node._createNode(children[n]));
              }
          }
          return no;
      };
      return Node;
  }());
  exports.Node = Node;
  Node.prototype.nodeType = 'Node';
  Node.prototype._attrsAffectingSize = [];
  Factory.Factory.addGetterSetter(Node, 'zIndex');
  Factory.Factory.addGetterSetter(Node, 'absolutePosition');
  Factory.Factory.addGetterSetter(Node, 'position');
  Factory.Factory.addGetterSetter(Node, 'x', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Node, 'y', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Node, 'globalCompositeOperation', 'source-over', Validators.getStringValidator());
  Factory.Factory.addGetterSetter(Node, 'opacity', 1, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Node, 'name', '', Validators.getStringValidator());
  Factory.Factory.addGetterSetter(Node, 'id', '', Validators.getStringValidator());
  Factory.Factory.addGetterSetter(Node, 'rotation', 0, Validators.getNumberValidator());
  Factory.Factory.addComponentsGetterSetter(Node, 'scale', ['x', 'y']);
  Factory.Factory.addGetterSetter(Node, 'scaleX', 1, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Node, 'scaleY', 1, Validators.getNumberValidator());
  Factory.Factory.addComponentsGetterSetter(Node, 'skew', ['x', 'y']);
  Factory.Factory.addGetterSetter(Node, 'skewX', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Node, 'skewY', 0, Validators.getNumberValidator());
  Factory.Factory.addComponentsGetterSetter(Node, 'offset', ['x', 'y']);
  Factory.Factory.addGetterSetter(Node, 'offsetX', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Node, 'offsetY', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Node, 'dragDistance', null, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Node, 'width', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Node, 'height', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Node, 'listening', 'inherit', function (val) {
      var isValid = val === true || val === false || val === 'inherit';
      if (!isValid) {
          Util.Util.warn(val +
              ' is a not valid value for "listening" attribute. The value may be true, false or "inherit".');
      }
      return val;
  });
  Factory.Factory.addGetterSetter(Node, 'preventDefault', true, Validators.getBooleanValidator());
  Factory.Factory.addGetterSetter(Node, 'filters', null, function (val) {
      this._filterUpToDate = false;
      return val;
  });
  Factory.Factory.addGetterSetter(Node, 'visible', 'inherit', function (val) {
      var isValid = val === true || val === false || val === 'inherit';
      if (!isValid) {
          Util.Util.warn(val +
              ' is a not valid value for "visible" attribute. The value may be true, false or "inherit".');
      }
      return val;
  });
  Factory.Factory.addGetterSetter(Node, 'transformsEnabled', 'all', Validators.getStringValidator());
  Factory.Factory.addGetterSetter(Node, 'size');
  Factory.Factory.addGetterSetter(Node, 'dragBoundFunc');
  Factory.Factory.addGetterSetter(Node, 'draggable', false, Validators.getBooleanValidator());
  Factory.Factory.backCompat(Node, {
      rotateDeg: 'rotate',
      setRotationDeg: 'setRotation',
      getRotationDeg: 'getRotation'
  });
  Util.Collection.mapMethods(Node);
  });

  unwrapExports(Node_1);
  var Node_2 = Node_1.ids;
  var Node_3 = Node_1.names;
  var Node_4 = Node_1._removeId;
  var Node_5 = Node_1._addName;
  var Node_6 = Node_1._removeName;
  var Node_7 = Node_1.Node;

  var Container_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });






  var Container = (function (_super) {
      __extends(Container, _super);
      function Container() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.children = new Util.Collection();
          return _this;
      }
      Container.prototype.getChildren = function (filterFunc) {
          if (!filterFunc) {
              return this.children;
          }
          var results = new Util.Collection();
          this.children.each(function (child) {
              if (filterFunc(child)) {
                  results.push(child);
              }
          });
          return results;
      };
      Container.prototype.hasChildren = function () {
          return this.getChildren().length > 0;
      };
      Container.prototype.removeChildren = function () {
          var child;
          for (var i = 0; i < this.children.length; i++) {
              child = this.children[i];
              child.parent = null;
              child.index = 0;
              child.remove();
          }
          this.children = new Util.Collection();
          return this;
      };
      Container.prototype.destroyChildren = function () {
          var child;
          for (var i = 0; i < this.children.length; i++) {
              child = this.children[i];
              child.parent = null;
              child.index = 0;
              child.destroy();
          }
          this.children = new Util.Collection();
          return this;
      };
      Container.prototype.add = function () {
          var children = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              children[_i] = arguments[_i];
          }
          if (arguments.length > 1) {
              for (var i = 0; i < arguments.length; i++) {
                  this.add(arguments[i]);
              }
              return this;
          }
          var child = arguments[0];
          if (child.getParent()) {
              child.moveTo(this);
              return this;
          }
          var _children = this.children;
          this._validateAdd(child);
          child.index = _children.length;
          child.parent = this;
          _children.push(child);
          this._fire('add', {
              child: child
          });
          return this;
      };
      Container.prototype.destroy = function () {
          if (this.hasChildren()) {
              this.destroyChildren();
          }
          _super.prototype.destroy.call(this);
          return this;
      };
      Container.prototype.find = function (selector) {
          return this._generalFind(selector, false);
      };
      Container.prototype.get = function (selector) {
          Util.Util.warn('collection.get() method is deprecated. Please use collection.find() instead.');
          return this.find(selector);
      };
      Container.prototype.findOne = function (selector) {
          var result = this._generalFind(selector, true);
          return result.length > 0 ? result[0] : undefined;
      };
      Container.prototype._generalFind = function (selector, findOne) {
          var retArr = [];
          this._descendants(function (node) {
              var valid = node._isMatch(selector);
              if (valid) {
                  retArr.push(node);
              }
              if (valid && findOne) {
                  return true;
              }
              return false;
          });
          return Util.Collection.toCollection(retArr);
      };
      Container.prototype._descendants = function (fn) {
          var shouldStop = false;
          for (var i = 0; i < this.children.length; i++) {
              var child = this.children[i];
              shouldStop = fn(child);
              if (shouldStop) {
                  return true;
              }
              if (!child.hasChildren()) {
                  continue;
              }
              shouldStop = child._descendants(fn);
              if (shouldStop) {
                  return true;
              }
          }
          return false;
      };
      Container.prototype.toObject = function () {
          var obj = Node_1.Node.prototype.toObject.call(this);
          obj.children = [];
          var children = this.getChildren();
          var len = children.length;
          for (var n = 0; n < len; n++) {
              var child = children[n];
              obj.children.push(child.toObject());
          }
          return obj;
      };
      Container.prototype._getDescendants = function (arr) {
          var retArr = [];
          var len = arr.length;
          for (var n = 0; n < len; n++) {
              var node = arr[n];
              if (this.isAncestorOf(node)) {
                  retArr.push(node);
              }
          }
          return retArr;
      };
      Container.prototype.isAncestorOf = function (node) {
          var parent = node.getParent();
          while (parent) {
              if (parent._id === this._id) {
                  return true;
              }
              parent = parent.getParent();
          }
          return false;
      };
      Container.prototype.clone = function (obj) {
          var node = Node_1.Node.prototype.clone.call(this, obj);
          this.getChildren().each(function (no) {
              node.add(no.clone());
          });
          return node;
      };
      Container.prototype.getAllIntersections = function (pos) {
          var arr = [];
          this.find('Shape').each(function (shape) {
              if (shape.isVisible() && shape.intersects(pos)) {
                  arr.push(shape);
              }
          });
          return arr;
      };
      Container.prototype._setChildrenIndices = function () {
          this.children.each(function (child, n) {
              child.index = n;
          });
      };
      Container.prototype.drawScene = function (can, top, caching) {
          var layer = this.getLayer(), canvas = can || (layer && layer.getCanvas()), context = canvas && canvas.getContext(), cachedCanvas = this._getCanvasCache(), cachedSceneCanvas = cachedCanvas && cachedCanvas.scene;
          if (this.isVisible() || caching) {
              if (!caching && cachedSceneCanvas) {
                  context.save();
                  layer._applyTransform(this, context, top);
                  this._drawCachedSceneCanvas(context);
                  context.restore();
              }
              else {
                  this._drawChildren(canvas, 'drawScene', top, false, caching, caching);
              }
          }
          return this;
      };
      Container.prototype.drawHit = function (can, top, caching) {
          var layer = this.getLayer(), canvas = can || (layer && layer.hitCanvas), context = canvas && canvas.getContext(), cachedCanvas = this._getCanvasCache(), cachedHitCanvas = cachedCanvas && cachedCanvas.hit;
          if (this.shouldDrawHit(canvas) || caching) {
              if (!caching && cachedHitCanvas) {
                  context.save();
                  layer._applyTransform(this, context, top);
                  this._drawCachedHitCanvas(context);
                  context.restore();
              }
              else {
                  this._drawChildren(canvas, 'drawHit', top, false, caching, caching);
              }
          }
          return this;
      };
      Container.prototype._drawChildren = function (canvas, drawMethod, top, caching, skipBuffer, skipComposition) {
          var layer = this.getLayer(), context = canvas && canvas.getContext(), clipWidth = this.clipWidth(), clipHeight = this.clipHeight(), clipFunc = this.clipFunc(), hasClip = (clipWidth && clipHeight) || clipFunc, clipX, clipY;
          if (hasClip && layer) {
              context.save();
              var transform = this.getAbsoluteTransform(top);
              var m = transform.getMatrix();
              context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
              context.beginPath();
              if (clipFunc) {
                  clipFunc.call(this, context, this);
              }
              else {
                  clipX = this.clipX();
                  clipY = this.clipY();
                  context.rect(clipX, clipY, clipWidth, clipHeight);
              }
              context.clip();
              m = transform
                  .copy()
                  .invert()
                  .getMatrix();
              context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
          }
          var hasComposition = this.globalCompositeOperation() !== 'source-over' &&
              !skipComposition &&
              drawMethod === 'drawScene';
          if (hasComposition && layer) {
              context.save();
              context._applyGlobalCompositeOperation(this);
          }
          this.children.each(function (child) {
              child[drawMethod](canvas, top, caching, skipBuffer);
          });
          if (hasComposition && layer) {
              context.restore();
          }
          if (hasClip && layer) {
              context.restore();
          }
      };
      Container.prototype.shouldDrawHit = function (canvas) {
          if (canvas && canvas.isCache) {
              return true;
          }
          var layer = this.getLayer();
          var layerUnderDrag = false;
          DragAndDrop.DD._dragElements.forEach(function (elem) {
              if (elem.dragStatus === 'dragging' && elem.node.getLayer() === layer) {
                  layerUnderDrag = true;
              }
          });
          var dragSkip = !Global.Konva.hitOnDragEnabled && layerUnderDrag;
          return layer && layer.hitGraphEnabled() && this.isVisible() && !dragSkip;
      };
      Container.prototype.getClientRect = function (attrs) {
          attrs = attrs || {};
          var skipTransform = attrs.skipTransform;
          var relativeTo = attrs.relativeTo;
          var minX, minY, maxX, maxY;
          var selfRect = {
              x: Infinity,
              y: Infinity,
              width: 0,
              height: 0
          };
          var that = this;
          this.children.each(function (child) {
              if (!child.visible()) {
                  return;
              }
              var rect = child.getClientRect({
                  relativeTo: that,
                  skipShadow: attrs.skipShadow,
                  skipStroke: attrs.skipStroke
              });
              if (rect.width === 0 && rect.height === 0) {
                  return;
              }
              if (minX === undefined) {
                  minX = rect.x;
                  minY = rect.y;
                  maxX = rect.x + rect.width;
                  maxY = rect.y + rect.height;
              }
              else {
                  minX = Math.min(minX, rect.x);
                  minY = Math.min(minY, rect.y);
                  maxX = Math.max(maxX, rect.x + rect.width);
                  maxY = Math.max(maxY, rect.y + rect.height);
              }
          });
          var shapes = this.find('Shape');
          var hasVisible = false;
          for (var i = 0; i < shapes.length; i++) {
              var shape = shapes[i];
              if (shape._isVisible(this)) {
                  hasVisible = true;
                  break;
              }
          }
          if (hasVisible && minX !== undefined) {
              selfRect = {
                  x: minX,
                  y: minY,
                  width: maxX - minX,
                  height: maxY - minY
              };
          }
          else {
              selfRect = {
                  x: 0,
                  y: 0,
                  width: 0,
                  height: 0
              };
          }
          if (!skipTransform) {
              return this._transformedRect(selfRect, relativeTo);
          }
          return selfRect;
      };
      return Container;
  }(Node_1.Node));
  exports.Container = Container;
  Factory.Factory.addComponentsGetterSetter(Container, 'clip', [
      'x',
      'y',
      'width',
      'height'
  ]);
  Factory.Factory.addGetterSetter(Container, 'clipX', undefined, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Container, 'clipY', undefined, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Container, 'clipWidth', undefined, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Container, 'clipHeight', undefined, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Container, 'clipFunc');
  Util.Collection.mapMethods(Container);
  });

  unwrapExports(Container_1);
  var Container_2 = Container_1.Container;

  var PointerEvents = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });

  var Captures = new Map();
  var SUPPORT_POINTER_EVENTS = Global.Konva._global['PointerEvent'] !== undefined;
  function getCapturedShape(pointerId) {
      return Captures.get(pointerId);
  }
  exports.getCapturedShape = getCapturedShape;
  function createEvent(evt) {
      return {
          evt: evt,
          pointerId: evt.pointerId
      };
  }
  exports.createEvent = createEvent;
  function hasPointerCapture(pointerId, shape) {
      return Captures.get(pointerId) === shape;
  }
  exports.hasPointerCapture = hasPointerCapture;
  function setPointerCapture(pointerId, shape) {
      releaseCapture(pointerId);
      var stage = shape.getStage();
      if (!stage)
          return;
      Captures.set(pointerId, shape);
      if (SUPPORT_POINTER_EVENTS) {
          shape._fire('gotpointercapture', createEvent(new PointerEvent('gotpointercapture')));
      }
  }
  exports.setPointerCapture = setPointerCapture;
  function releaseCapture(pointerId, target) {
      var shape = Captures.get(pointerId);
      if (!shape)
          return;
      var stage = shape.getStage();
      if (stage && stage.content) ;
      Captures.delete(pointerId);
      if (SUPPORT_POINTER_EVENTS) {
          shape._fire('lostpointercapture', createEvent(new PointerEvent('lostpointercapture')));
      }
  }
  exports.releaseCapture = releaseCapture;
  });

  unwrapExports(PointerEvents);
  var PointerEvents_1 = PointerEvents.getCapturedShape;
  var PointerEvents_2 = PointerEvents.createEvent;
  var PointerEvents_3 = PointerEvents.hasPointerCapture;
  var PointerEvents_4 = PointerEvents.setPointerCapture;
  var PointerEvents_5 = PointerEvents.releaseCapture;

  var Stage_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });






  var Global_2 = Global;

  var STAGE = 'Stage', STRING = 'string', PX = 'px', MOUSEOUT = 'mouseout', MOUSELEAVE = 'mouseleave', MOUSEOVER = 'mouseover', MOUSEENTER = 'mouseenter', MOUSEMOVE = 'mousemove', MOUSEDOWN = 'mousedown', MOUSEUP = 'mouseup', POINTERMOVE = 'pointermove', POINTERDOWN = 'pointerdown', POINTERUP = 'pointerup', POINTERCANCEL = 'pointercancel', LOSTPOINTERCAPTURE = 'lostpointercapture', CONTEXTMENU = 'contextmenu', CLICK = 'click', DBL_CLICK = 'dblclick', TOUCHSTART = 'touchstart', TOUCHEND = 'touchend', TAP = 'tap', DBL_TAP = 'dbltap', TOUCHMOVE = 'touchmove', WHEEL = 'wheel', CONTENT_MOUSEOUT = 'contentMouseout', CONTENT_MOUSEOVER = 'contentMouseover', CONTENT_MOUSEMOVE = 'contentMousemove', CONTENT_MOUSEDOWN = 'contentMousedown', CONTENT_MOUSEUP = 'contentMouseup', CONTENT_CONTEXTMENU = 'contentContextmenu', CONTENT_CLICK = 'contentClick', CONTENT_DBL_CLICK = 'contentDblclick', CONTENT_TOUCHSTART = 'contentTouchstart', CONTENT_TOUCHEND = 'contentTouchend', CONTENT_DBL_TAP = 'contentDbltap', CONTENT_TAP = 'contentTap', CONTENT_TOUCHMOVE = 'contentTouchmove', CONTENT_WHEEL = 'contentWheel', RELATIVE = 'relative', KONVA_CONTENT = 'konvajs-content', UNDERSCORE = '_', CONTAINER = 'container', MAX_LAYERS_NUMBER = 5, EMPTY_STRING = '', EVENTS = [
      MOUSEENTER,
      MOUSEDOWN,
      MOUSEMOVE,
      MOUSEUP,
      MOUSEOUT,
      TOUCHSTART,
      TOUCHMOVE,
      TOUCHEND,
      MOUSEOVER,
      WHEEL,
      CONTEXTMENU,
      POINTERDOWN,
      POINTERMOVE,
      POINTERUP,
      POINTERCANCEL,
      LOSTPOINTERCAPTURE
  ], eventsLength = EVENTS.length;
  function addEvent(ctx, eventName) {
      ctx.content.addEventListener(eventName, function (evt) {
          ctx[UNDERSCORE + eventName](evt);
      }, false);
  }
  var NO_POINTERS_MESSAGE = "Pointer position is missing and not registered by the stage. Looks like it is outside of the stage container. You can set it manually from event: stage.setPointersPositions(event);";
  exports.stages = [];
  function checkNoClip(attrs) {
      if (attrs === void 0) { attrs = {}; }
      if (attrs.clipFunc || attrs.clipWidth || attrs.clipHeight) {
          Util.Util.warn('Stage does not support clipping. Please use clip for Layers or Groups.');
      }
      return attrs;
  }
  var Stage = (function (_super) {
      __extends(Stage, _super);
      function Stage(config) {
          var _this = _super.call(this, checkNoClip(config)) || this;
          _this._pointerPositions = [];
          _this._changedPointerPositions = [];
          _this._buildDOM();
          _this._bindContentEvents();
          exports.stages.push(_this);
          _this.on('widthChange.konva heightChange.konva', _this._resizeDOM);
          _this.on('visibleChange.konva', _this._checkVisibility);
          _this.on('clipWidthChange.konva clipHeightChange.konva clipFuncChange.konva', function () {
              checkNoClip(_this.attrs);
          });
          _this._checkVisibility();
          return _this;
      }
      Stage.prototype._validateAdd = function (child) {
          var isLayer = child.getType() === 'Layer';
          var isFastLayer = child.getType() === 'FastLayer';
          var valid = isLayer || isFastLayer;
          if (!valid) {
              Util.Util.throw('You may only add layers to the stage.');
          }
      };
      Stage.prototype._checkVisibility = function () {
          var style = this.visible() ? '' : 'none';
          this.content.style.display = style;
      };
      Stage.prototype.setContainer = function (container) {
          if (typeof container === STRING) {
              if (container.charAt(0) === '.') {
                  var className = container.slice(1);
                  container = document.getElementsByClassName(className)[0];
              }
              else {
                  var id;
                  if (container.charAt(0) !== '#') {
                      id = container;
                  }
                  else {
                      id = container.slice(1);
                  }
                  container = document.getElementById(id);
              }
              if (!container) {
                  throw 'Can not find container in document with id ' + id;
              }
          }
          this._setAttr(CONTAINER, container);
          if (this.content) {
              if (this.content.parentElement) {
                  this.content.parentElement.removeChild(this.content);
              }
              container.appendChild(this.content);
          }
          return this;
      };
      Stage.prototype.shouldDrawHit = function () {
          return true;
      };
      Stage.prototype.clear = function () {
          var layers = this.children, len = layers.length, n;
          for (n = 0; n < len; n++) {
              layers[n].clear();
          }
          return this;
      };
      Stage.prototype.clone = function (obj) {
          if (!obj) {
              obj = {};
          }
          obj.container = document.createElement('div');
          return Container_1.Container.prototype.clone.call(this, obj);
      };
      Stage.prototype.destroy = function () {
          _super.prototype.destroy.call(this);
          var content = this.content;
          if (content && Util.Util._isInDocument(content)) {
              this.container().removeChild(content);
          }
          var index = exports.stages.indexOf(this);
          if (index > -1) {
              exports.stages.splice(index, 1);
          }
          return this;
      };
      Stage.prototype.getPointerPosition = function () {
          var pos = this._pointerPositions[0] || this._changedPointerPositions[0];
          if (!pos) {
              Util.Util.warn(NO_POINTERS_MESSAGE);
              return null;
          }
          return {
              x: pos.x,
              y: pos.y
          };
      };
      Stage.prototype._getPointerById = function (id) {
          return this._pointerPositions.find(function (p) { return p.id === id; });
      };
      Stage.prototype.getPointersPositions = function () {
          return this._pointerPositions;
      };
      Stage.prototype.getStage = function () {
          return this;
      };
      Stage.prototype.getContent = function () {
          return this.content;
      };
      Stage.prototype._toKonvaCanvas = function (config) {
          config = config || {};
          var x = config.x || 0, y = config.y || 0, canvas = new Canvas_1.SceneCanvas({
              width: config.width || this.width(),
              height: config.height || this.height(),
              pixelRatio: config.pixelRatio || 1
          }), _context = canvas.getContext()._context, layers = this.children;
          if (x || y) {
              _context.translate(-1 * x, -1 * y);
          }
          layers.each(function (layer) {
              if (!layer.isVisible()) {
                  return;
              }
              var layerCanvas = layer._toKonvaCanvas(config);
              _context.drawImage(layerCanvas._canvas, x, y, layerCanvas.getWidth() / layerCanvas.getPixelRatio(), layerCanvas.getHeight() / layerCanvas.getPixelRatio());
          });
          return canvas;
      };
      Stage.prototype.getIntersection = function (pos, selector) {
          if (!pos) {
              return null;
          }
          var layers = this.children, len = layers.length, end = len - 1, n, shape;
          for (n = end; n >= 0; n--) {
              shape = layers[n].getIntersection(pos, selector);
              if (shape) {
                  return shape;
              }
          }
          return null;
      };
      Stage.prototype._resizeDOM = function () {
          if (this.content) {
              var width = this.width(), height = this.height(), layers = this.getChildren(), len = layers.length, n, layer;
              this.content.style.width = width + PX;
              this.content.style.height = height + PX;
              this.bufferCanvas.setSize(width, height);
              this.bufferHitCanvas.setSize(width, height);
              for (n = 0; n < len; n++) {
                  layer = layers[n];
                  layer.setSize({ width: width, height: height });
                  layer.draw();
              }
          }
      };
      Stage.prototype.add = function (layer) {
          if (arguments.length > 1) {
              for (var i = 0; i < arguments.length; i++) {
                  this.add(arguments[i]);
              }
              return this;
          }
          _super.prototype.add.call(this, layer);
          var length = this.children.length;
          if (length > MAX_LAYERS_NUMBER) {
              Util.Util.warn('The stage has ' +
                  length +
                  ' layers. Recommended maximum number of layers is 3-5. Adding more layers into the stage may drop the performance. Rethink your tree structure, you can use Konva.Group.');
          }
          layer._setCanvasSize(this.width(), this.height());
          layer.draw();
          if (Global.Konva.isBrowser) {
              this.content.appendChild(layer.canvas._canvas);
          }
          return this;
      };
      Stage.prototype.getParent = function () {
          return null;
      };
      Stage.prototype.getLayer = function () {
          return null;
      };
      Stage.prototype.hasPointerCapture = function (pointerId) {
          return PointerEvents.hasPointerCapture(pointerId, this);
      };
      Stage.prototype.setPointerCapture = function (pointerId) {
          PointerEvents.setPointerCapture(pointerId, this);
      };
      Stage.prototype.releaseCapture = function (pointerId) {
          PointerEvents.releaseCapture(pointerId, this);
      };
      Stage.prototype.getLayers = function () {
          return this.getChildren();
      };
      Stage.prototype._bindContentEvents = function () {
          if (!Global.Konva.isBrowser) {
              return;
          }
          for (var n = 0; n < eventsLength; n++) {
              addEvent(this, EVENTS[n]);
          }
      };
      Stage.prototype._mouseenter = function (evt) {
          this.setPointersPositions(evt);
          this._fire(MOUSEENTER, { evt: evt, target: this, currentTarget: this });
      };
      Stage.prototype._mouseover = function (evt) {
          this.setPointersPositions(evt);
          this._fire(CONTENT_MOUSEOVER, { evt: evt });
          this._fire(MOUSEOVER, { evt: evt, target: this, currentTarget: this });
      };
      Stage.prototype._mouseout = function (evt) {
          this.setPointersPositions(evt);
          var targetShape = this.targetShape;
          var eventsEnabled = !DragAndDrop.DD.isDragging || Global.Konva.hitOnDragEnabled;
          if (targetShape && eventsEnabled) {
              targetShape._fireAndBubble(MOUSEOUT, { evt: evt });
              targetShape._fireAndBubble(MOUSELEAVE, { evt: evt });
              this._fire(MOUSELEAVE, { evt: evt, target: this, currentTarget: this });
              this.targetShape = null;
          }
          else if (eventsEnabled) {
              this._fire(MOUSELEAVE, {
                  evt: evt,
                  target: this,
                  currentTarget: this
              });
              this._fire(MOUSEOUT, {
                  evt: evt,
                  target: this,
                  currentTarget: this
              });
          }
          this.pointerPos = undefined;
          this._pointerPositions = [];
          this._fire(CONTENT_MOUSEOUT, { evt: evt });
      };
      Stage.prototype._mousemove = function (evt) {
          if (Global.Konva.UA.ieMobile) {
              return this._touchmove(evt);
          }
          this.setPointersPositions(evt);
          var pointerId = Util.Util._getFirstPointerId(evt);
          var shape;
          var eventsEnabled = !DragAndDrop.DD.isDragging || Global.Konva.hitOnDragEnabled;
          if (eventsEnabled) {
              shape = this.getIntersection(this.getPointerPosition());
              if (shape && shape.isListening()) {
                  var differentTarget = !this.targetShape || this.targetShape !== shape;
                  if (eventsEnabled && differentTarget) {
                      if (this.targetShape) {
                          this.targetShape._fireAndBubble(MOUSEOUT, { evt: evt, pointerId: pointerId }, shape);
                          this.targetShape._fireAndBubble(MOUSELEAVE, { evt: evt, pointerId: pointerId }, shape);
                      }
                      shape._fireAndBubble(MOUSEOVER, { evt: evt, pointerId: pointerId }, this.targetShape);
                      shape._fireAndBubble(MOUSEENTER, { evt: evt, pointerId: pointerId }, this.targetShape);
                      shape._fireAndBubble(MOUSEMOVE, { evt: evt, pointerId: pointerId });
                      this.targetShape = shape;
                  }
                  else {
                      shape._fireAndBubble(MOUSEMOVE, { evt: evt, pointerId: pointerId });
                  }
              }
              else {
                  if (this.targetShape && eventsEnabled) {
                      this.targetShape._fireAndBubble(MOUSEOUT, { evt: evt, pointerId: pointerId });
                      this.targetShape._fireAndBubble(MOUSELEAVE, { evt: evt, pointerId: pointerId });
                      this._fire(MOUSEOVER, {
                          evt: evt,
                          target: this,
                          currentTarget: this,
                          pointerId: pointerId
                      });
                      this.targetShape = null;
                  }
                  this._fire(MOUSEMOVE, {
                      evt: evt,
                      target: this,
                      currentTarget: this,
                      pointerId: pointerId
                  });
              }
              this._fire(CONTENT_MOUSEMOVE, { evt: evt });
          }
          if (evt.cancelable) {
              evt.preventDefault();
          }
      };
      Stage.prototype._mousedown = function (evt) {
          if (Global.Konva.UA.ieMobile) {
              return this._touchstart(evt);
          }
          this.setPointersPositions(evt);
          var pointerId = Util.Util._getFirstPointerId(evt);
          var shape = this.getIntersection(this.getPointerPosition());
          DragAndDrop.DD.justDragged = false;
          Global.Konva.listenClickTap = true;
          if (shape && shape.isListening()) {
              this.clickStartShape = shape;
              shape._fireAndBubble(MOUSEDOWN, { evt: evt, pointerId: pointerId });
          }
          else {
              this._fire(MOUSEDOWN, {
                  evt: evt,
                  target: this,
                  currentTarget: this,
                  pointerId: pointerId
              });
          }
          this._fire(CONTENT_MOUSEDOWN, { evt: evt });
      };
      Stage.prototype._mouseup = function (evt) {
          if (Global.Konva.UA.ieMobile) {
              return this._touchend(evt);
          }
          this.setPointersPositions(evt);
          var pointerId = Util.Util._getFirstPointerId(evt);
          var shape = this.getIntersection(this.getPointerPosition()), clickStartShape = this.clickStartShape, clickEndShape = this.clickEndShape, fireDblClick = false;
          if (Global.Konva.inDblClickWindow) {
              fireDblClick = true;
              clearTimeout(this.dblTimeout);
          }
          else if (!DragAndDrop.DD.justDragged) {
              Global.Konva.inDblClickWindow = true;
              clearTimeout(this.dblTimeout);
          }
          this.dblTimeout = setTimeout(function () {
              Global.Konva.inDblClickWindow = false;
          }, Global.Konva.dblClickWindow);
          if (shape && shape.isListening()) {
              this.clickEndShape = shape;
              shape._fireAndBubble(MOUSEUP, { evt: evt, pointerId: pointerId });
              if (Global.Konva.listenClickTap &&
                  clickStartShape &&
                  clickStartShape._id === shape._id) {
                  shape._fireAndBubble(CLICK, { evt: evt, pointerId: pointerId });
                  if (fireDblClick && clickEndShape && clickEndShape === shape) {
                      shape._fireAndBubble(DBL_CLICK, { evt: evt, pointerId: pointerId });
                  }
              }
          }
          else {
              this._fire(MOUSEUP, {
                  evt: evt,
                  target: this,
                  currentTarget: this,
                  pointerId: pointerId
              });
              if (Global.Konva.listenClickTap) {
                  this._fire(CLICK, {
                      evt: evt,
                      target: this,
                      currentTarget: this,
                      pointerId: pointerId
                  });
              }
              if (fireDblClick) {
                  this._fire(DBL_CLICK, {
                      evt: evt,
                      target: this,
                      currentTarget: this,
                      pointerId: pointerId
                  });
              }
          }
          this._fire(CONTENT_MOUSEUP, { evt: evt });
          if (Global.Konva.listenClickTap) {
              this._fire(CONTENT_CLICK, { evt: evt });
              if (fireDblClick) {
                  this._fire(CONTENT_DBL_CLICK, { evt: evt });
              }
          }
          Global.Konva.listenClickTap = false;
          if (evt.cancelable) {
              evt.preventDefault();
          }
      };
      Stage.prototype._contextmenu = function (evt) {
          this.setPointersPositions(evt);
          var shape = this.getIntersection(this.getPointerPosition());
          if (shape && shape.isListening()) {
              shape._fireAndBubble(CONTEXTMENU, { evt: evt });
          }
          else {
              this._fire(CONTEXTMENU, {
                  evt: evt,
                  target: this,
                  currentTarget: this
              });
          }
          this._fire(CONTENT_CONTEXTMENU, { evt: evt });
      };
      Stage.prototype._touchstart = function (evt) {
          var _this = this;
          this.setPointersPositions(evt);
          var triggeredOnShape = false;
          this._changedPointerPositions.forEach(function (pos) {
              var shape = _this.getIntersection(pos);
              Global.Konva.listenClickTap = true;
              DragAndDrop.DD.justDragged = false;
              var hasShape = shape && shape.isListening();
              if (!hasShape) {
                  return;
              }
              if (Global.Konva.captureTouchEventsEnabled) {
                  shape.setPointerCapture(pos.id);
              }
              _this.tapStartShape = shape;
              shape._fireAndBubble(TOUCHSTART, { evt: evt, pointerId: pos.id }, _this);
              triggeredOnShape = true;
              if (shape.isListening() && shape.preventDefault() && evt.cancelable) {
                  evt.preventDefault();
              }
          });
          if (!triggeredOnShape) {
              this._fire(TOUCHSTART, {
                  evt: evt,
                  target: this,
                  currentTarget: this,
                  pointerId: this._changedPointerPositions[0].id
              });
          }
          this._fire(CONTENT_TOUCHSTART, { evt: evt });
      };
      Stage.prototype._touchmove = function (evt) {
          var _this = this;
          this.setPointersPositions(evt);
          var eventsEnabled = !DragAndDrop.DD.isDragging || Global.Konva.hitOnDragEnabled;
          if (eventsEnabled) {
              var triggeredOnShape = false;
              var processedShapesIds = {};
              this._changedPointerPositions.forEach(function (pos) {
                  var shape = PointerEvents.getCapturedShape(pos.id) || _this.getIntersection(pos);
                  var hasShape = shape && shape.isListening();
                  if (!hasShape) {
                      return;
                  }
                  if (processedShapesIds[shape._id]) {
                      return;
                  }
                  processedShapesIds[shape._id] = true;
                  shape._fireAndBubble(TOUCHMOVE, { evt: evt, pointerId: pos.id });
                  triggeredOnShape = true;
                  if (shape.isListening() && shape.preventDefault() && evt.cancelable) {
                      evt.preventDefault();
                  }
              });
              if (!triggeredOnShape) {
                  this._fire(TOUCHMOVE, {
                      evt: evt,
                      target: this,
                      currentTarget: this,
                      pointerId: this._changedPointerPositions[0].id
                  });
              }
              this._fire(CONTENT_TOUCHMOVE, { evt: evt });
          }
          if (DragAndDrop.DD.isDragging && DragAndDrop.DD.node.preventDefault() && evt.cancelable) {
              evt.preventDefault();
          }
      };
      Stage.prototype._touchend = function (evt) {
          var _this = this;
          this.setPointersPositions(evt);
          var clickEndShape = this.clickEndShape, fireDblClick = false;
          if (Global.Konva.inDblClickWindow) {
              fireDblClick = true;
              clearTimeout(this.dblTimeout);
          }
          else if (!DragAndDrop.DD.justDragged) {
              Global.Konva.inDblClickWindow = true;
              clearTimeout(this.dblTimeout);
          }
          this.dblTimeout = setTimeout(function () {
              Global.Konva.inDblClickWindow = false;
          }, Global.Konva.dblClickWindow);
          var triggeredOnShape = false;
          var processedShapesIds = {};
          var tapTriggered = false;
          var dblTapTriggered = false;
          this._changedPointerPositions.forEach(function (pos) {
              var shape = PointerEvents.getCapturedShape(pos.id) ||
                  _this.getIntersection(pos);
              if (shape) {
                  shape.releaseCapture(pos.id);
              }
              var hasShape = shape && shape.isListening();
              if (!hasShape) {
                  return;
              }
              if (processedShapesIds[shape._id]) {
                  return;
              }
              processedShapesIds[shape._id] = true;
              _this.clickEndShape = shape;
              shape._fireAndBubble(TOUCHEND, { evt: evt, pointerId: pos.id });
              triggeredOnShape = true;
              if (Global.Konva.listenClickTap && shape === _this.tapStartShape) {
                  tapTriggered = true;
                  shape._fireAndBubble(TAP, { evt: evt, pointerId: pos.id });
                  if (fireDblClick && clickEndShape && clickEndShape === shape) {
                      dblTapTriggered = true;
                      shape._fireAndBubble(DBL_TAP, { evt: evt, pointerId: pos.id });
                  }
              }
              if (shape.isListening() && shape.preventDefault() && evt.cancelable) {
                  evt.preventDefault();
              }
          });
          if (!triggeredOnShape) {
              this._fire(TOUCHEND, {
                  evt: evt,
                  target: this,
                  currentTarget: this,
                  pointerId: this._changedPointerPositions[0].id
              });
          }
          if (Global.Konva.listenClickTap && !tapTriggered) {
              this._fire(TAP, {
                  evt: evt,
                  target: this,
                  currentTarget: this,
                  pointerId: this._changedPointerPositions[0].id
              });
          }
          if (fireDblClick && !dblTapTriggered) {
              this._fire(DBL_TAP, {
                  evt: evt,
                  target: this,
                  currentTarget: this,
                  pointerId: this._changedPointerPositions[0].id
              });
          }
          this._fire(CONTENT_TOUCHEND, { evt: evt });
          if (Global.Konva.listenClickTap) {
              this._fire(CONTENT_TAP, { evt: evt });
              if (fireDblClick) {
                  this._fire(CONTENT_DBL_TAP, { evt: evt });
              }
          }
          Global.Konva.listenClickTap = false;
      };
      Stage.prototype._wheel = function (evt) {
          this.setPointersPositions(evt);
          var shape = this.getIntersection(this.getPointerPosition());
          if (shape && shape.isListening()) {
              shape._fireAndBubble(WHEEL, { evt: evt });
          }
          else {
              this._fire(WHEEL, {
                  evt: evt,
                  target: this,
                  currentTarget: this
              });
          }
          this._fire(CONTENT_WHEEL, { evt: evt });
      };
      Stage.prototype._pointerdown = function (evt) {
          if (!Global.Konva._pointerEventsEnabled) {
              return;
          }
          this.setPointersPositions(evt);
          var shape = PointerEvents.getCapturedShape(evt.pointerId) ||
              this.getIntersection(this.getPointerPosition());
          if (shape) {
              shape._fireAndBubble(POINTERDOWN, PointerEvents.createEvent(evt));
          }
      };
      Stage.prototype._pointermove = function (evt) {
          if (!Global.Konva._pointerEventsEnabled) {
              return;
          }
          this.setPointersPositions(evt);
          var shape = PointerEvents.getCapturedShape(evt.pointerId) ||
              this.getIntersection(this.getPointerPosition());
          if (shape) {
              shape._fireAndBubble(POINTERMOVE, PointerEvents.createEvent(evt));
          }
      };
      Stage.prototype._pointerup = function (evt) {
          if (!Global.Konva._pointerEventsEnabled) {
              return;
          }
          this.setPointersPositions(evt);
          var shape = PointerEvents.getCapturedShape(evt.pointerId) ||
              this.getIntersection(this.getPointerPosition());
          if (shape) {
              shape._fireAndBubble(POINTERUP, PointerEvents.createEvent(evt));
          }
          PointerEvents.releaseCapture(evt.pointerId);
      };
      Stage.prototype._pointercancel = function (evt) {
          if (!Global.Konva._pointerEventsEnabled) {
              return;
          }
          this.setPointersPositions(evt);
          var shape = PointerEvents.getCapturedShape(evt.pointerId) ||
              this.getIntersection(this.getPointerPosition());
          if (shape) {
              shape._fireAndBubble(POINTERUP, PointerEvents.createEvent(evt));
          }
          PointerEvents.releaseCapture(evt.pointerId);
      };
      Stage.prototype._lostpointercapture = function (evt) {
          PointerEvents.releaseCapture(evt.pointerId);
      };
      Stage.prototype.setPointersPositions = function (evt) {
          var _this = this;
          var contentPosition = this._getContentPosition(), x = null, y = null;
          evt = evt ? evt : window.event;
          if (evt.touches !== undefined) {
              this._pointerPositions = [];
              this._changedPointerPositions = [];
              Util.Collection.prototype.each.call(evt.touches, function (touch) {
                  _this._pointerPositions.push({
                      id: touch.identifier,
                      x: (touch.clientX - contentPosition.left) / contentPosition.scaleX,
                      y: (touch.clientY - contentPosition.top) / contentPosition.scaleY
                  });
              });
              Util.Collection.prototype.each.call(evt.changedTouches || evt.touches, function (touch) {
                  _this._changedPointerPositions.push({
                      id: touch.identifier,
                      x: (touch.clientX - contentPosition.left) / contentPosition.scaleX,
                      y: (touch.clientY - contentPosition.top) / contentPosition.scaleY
                  });
              });
          }
          else {
              x = (evt.clientX - contentPosition.left) / contentPosition.scaleX;
              y = (evt.clientY - contentPosition.top) / contentPosition.scaleY;
              this.pointerPos = {
                  x: x,
                  y: y
              };
              this._pointerPositions = [{ x: x, y: y, id: Util.Util._getFirstPointerId(evt) }];
              this._changedPointerPositions = [
                  { x: x, y: y, id: Util.Util._getFirstPointerId(evt) }
              ];
          }
      };
      Stage.prototype._setPointerPosition = function (evt) {
          Util.Util.warn('Method _setPointerPosition is deprecated. Use "stage.setPointersPositions(event)" instead.');
          this.setPointersPositions(evt);
      };
      Stage.prototype._getContentPosition = function () {
          var rect = this.content.getBoundingClientRect
              ? this.content.getBoundingClientRect()
              : { top: 0, left: 0, width: 1000, height: 1000 };
          return {
              top: rect.top,
              left: rect.left,
              scaleX: rect.width / this.content.clientWidth || 1,
              scaleY: rect.height / this.content.clientHeight || 1,
          };
      };
      Stage.prototype._buildDOM = function () {
          this.bufferCanvas = new Canvas_1.SceneCanvas();
          this.bufferHitCanvas = new Canvas_1.HitCanvas({ pixelRatio: 1 });
          if (!Global.Konva.isBrowser) {
              return;
          }
          var container = this.container();
          if (!container) {
              throw 'Stage has no container. A container is required.';
          }
          container.innerHTML = EMPTY_STRING;
          this.content = document.createElement('div');
          this.content.style.position = RELATIVE;
          this.content.style.userSelect = 'none';
          this.content.className = KONVA_CONTENT;
          this.content.setAttribute('role', 'presentation');
          container.appendChild(this.content);
          this._resizeDOM();
      };
      Stage.prototype.cache = function () {
          Util.Util.warn('Cache function is not allowed for stage. You may use cache only for layers, groups and shapes.');
          return this;
      };
      Stage.prototype.clearCache = function () {
          return this;
      };
      Stage.prototype.batchDraw = function () {
          this.children.each(function (layer) {
              layer.batchDraw();
          });
          return this;
      };
      return Stage;
  }(Container_1.Container));
  exports.Stage = Stage;
  Stage.prototype.nodeType = STAGE;
  Global_2._registerNode(Stage);
  Factory.Factory.addGetterSetter(Stage, 'container');
  });

  unwrapExports(Stage_1);
  var Stage_2 = Stage_1.stages;
  var Stage_3 = Stage_1.Stage;

  var BaseLayer_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });





  var BaseLayer = (function (_super) {
      __extends(BaseLayer, _super);
      function BaseLayer(config) {
          var _this = _super.call(this, config) || this;
          _this.canvas = new Canvas_1.SceneCanvas();
          _this._waitingForDraw = false;
          _this.on('visibleChange', _this._checkVisibility);
          _this._checkVisibility();
          _this.on('imageSmoothingEnabledChange', _this._checkSmooth);
          _this._checkSmooth();
          return _this;
      }
      BaseLayer.prototype.createPNGStream = function () {
          var c = this.canvas._canvas;
          return c.createPNGStream();
      };
      BaseLayer.prototype.getCanvas = function () {
          return this.canvas;
      };
      BaseLayer.prototype.getHitCanvas = function () {
          return this.hitCanvas;
      };
      BaseLayer.prototype.getContext = function () {
          return this.getCanvas().getContext();
      };
      BaseLayer.prototype.clear = function (bounds) {
          this.getContext().clear(bounds);
          return this;
      };
      BaseLayer.prototype.setZIndex = function (index) {
          _super.prototype.setZIndex.call(this, index);
          var stage = this.getStage();
          if (stage) {
              stage.content.removeChild(this.getCanvas()._canvas);
              if (index < stage.getChildren().length - 1) {
                  stage.content.insertBefore(this.getCanvas()._canvas, stage.getChildren()[index + 1].getCanvas()._canvas);
              }
              else {
                  stage.content.appendChild(this.getCanvas()._canvas);
              }
          }
          return this;
      };
      BaseLayer.prototype.moveToTop = function () {
          Node_1.Node.prototype.moveToTop.call(this);
          var stage = this.getStage();
          if (stage) {
              stage.content.removeChild(this.getCanvas()._canvas);
              stage.content.appendChild(this.getCanvas()._canvas);
          }
          return true;
      };
      BaseLayer.prototype.moveUp = function () {
          var moved = Node_1.Node.prototype.moveUp.call(this);
          if (!moved) {
              return false;
          }
          var stage = this.getStage();
          if (!stage) {
              return false;
          }
          stage.content.removeChild(this.getCanvas()._canvas);
          if (this.index < stage.getChildren().length - 1) {
              stage.content.insertBefore(this.getCanvas()._canvas, stage.getChildren()[this.index + 1].getCanvas()._canvas);
          }
          else {
              stage.content.appendChild(this.getCanvas()._canvas);
          }
          return true;
      };
      BaseLayer.prototype.moveDown = function () {
          if (Node_1.Node.prototype.moveDown.call(this)) {
              var stage = this.getStage();
              if (stage) {
                  var children = stage.getChildren();
                  stage.content.removeChild(this.getCanvas()._canvas);
                  stage.content.insertBefore(this.getCanvas()._canvas, children[this.index + 1].getCanvas()._canvas);
              }
              return true;
          }
          return false;
      };
      BaseLayer.prototype.moveToBottom = function () {
          if (Node_1.Node.prototype.moveToBottom.call(this)) {
              var stage = this.getStage();
              if (stage) {
                  var children = stage.getChildren();
                  stage.content.removeChild(this.getCanvas()._canvas);
                  stage.content.insertBefore(this.getCanvas()._canvas, children[1].getCanvas()._canvas);
              }
              return true;
          }
          return false;
      };
      BaseLayer.prototype.getLayer = function () {
          return this;
      };
      BaseLayer.prototype.hitGraphEnabled = function () {
          return true;
      };
      BaseLayer.prototype.remove = function () {
          var _canvas = this.getCanvas()._canvas;
          Node_1.Node.prototype.remove.call(this);
          if (_canvas && _canvas.parentNode && Util.Util._isInDocument(_canvas)) {
              _canvas.parentNode.removeChild(_canvas);
          }
          return this;
      };
      BaseLayer.prototype.getStage = function () {
          return this.parent;
      };
      BaseLayer.prototype.setSize = function (_a) {
          var width = _a.width, height = _a.height;
          this.canvas.setSize(width, height);
          return this;
      };
      BaseLayer.prototype._toKonvaCanvas = function (config) {
          config = config || {};
          config.width = config.width || this.getWidth();
          config.height = config.height || this.getHeight();
          config.x = config.x !== undefined ? config.x : this.x();
          config.y = config.y !== undefined ? config.y : this.y();
          return Node_1.Node.prototype._toKonvaCanvas.call(this, config);
      };
      BaseLayer.prototype._checkVisibility = function () {
          var visible = this.visible();
          if (visible) {
              this.canvas._canvas.style.display = 'block';
          }
          else {
              this.canvas._canvas.style.display = 'none';
          }
      };
      BaseLayer.prototype._checkSmooth = function () {
          this.getContext()._context.imageSmoothingEnabled = this.imageSmoothingEnabled();
      };
      BaseLayer.prototype.getWidth = function () {
          if (this.parent) {
              return this.parent.width();
          }
      };
      BaseLayer.prototype.setWidth = function () {
          Util.Util.warn('Can not change width of layer. Use "stage.width(value)" function instead.');
      };
      BaseLayer.prototype.getHeight = function () {
          if (this.parent) {
              return this.parent.height();
          }
      };
      BaseLayer.prototype.setHeight = function () {
          Util.Util.warn('Can not change height of layer. Use "stage.height(value)" function instead.');
      };
      BaseLayer.prototype.getIntersection = function (pos, selector) {
          return null;
      };
      BaseLayer.prototype.batchDraw = function () {
          var _this = this;
          if (!this._waitingForDraw) {
              this._waitingForDraw = true;
              Util.Util.requestAnimFrame(function () {
                  _this.draw();
                  _this._waitingForDraw = false;
              });
          }
          return this;
      };
      BaseLayer.prototype._applyTransform = function (shape, context, top) {
          var m = shape.getAbsoluteTransform(top).getMatrix();
          context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
      };
      return BaseLayer;
  }(Container_1.Container));
  exports.BaseLayer = BaseLayer;
  BaseLayer.prototype.nodeType = 'BaseLayer';
  Factory.Factory.addGetterSetter(BaseLayer, 'imageSmoothingEnabled', true);
  Factory.Factory.addGetterSetter(BaseLayer, 'clearBeforeDraw', true);
  Util.Collection.mapMethods(BaseLayer);
  });

  unwrapExports(BaseLayer_1);
  var BaseLayer_2 = BaseLayer_1.BaseLayer;

  var Shape_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });






  var HAS_SHADOW = 'hasShadow';
  var SHADOW_RGBA = 'shadowRGBA';
  var patternImage = 'patternImage';
  var linearGradient = 'linearGradient';
  var radialGradient = 'radialGradient';
  var dummyContext;
  function getDummyContext() {
      if (dummyContext) {
          return dummyContext;
      }
      dummyContext = Util.Util.createCanvasElement().getContext('2d');
      return dummyContext;
  }
  exports.shapes = {};
  function _fillFunc(context) {
      context.fill();
  }
  function _strokeFunc(context) {
      context.stroke();
  }
  function _fillFuncHit(context) {
      context.fill();
  }
  function _strokeFuncHit(context) {
      context.stroke();
  }
  function _clearHasShadowCache() {
      this._clearCache(HAS_SHADOW);
  }
  function _clearGetShadowRGBACache() {
      this._clearCache(SHADOW_RGBA);
  }
  function _clearFillPatternCache() {
      this._clearCache(patternImage);
  }
  function _clearLinearGradientCache() {
      this._clearCache(linearGradient);
  }
  function _clearRadialGradientCache() {
      this._clearCache(radialGradient);
  }
  var Shape = (function (_super) {
      __extends(Shape, _super);
      function Shape(config) {
          var _this = _super.call(this, config) || this;
          var key;
          while (true) {
              key = Util.Util.getRandomColor();
              if (key && !(key in exports.shapes)) {
                  break;
              }
          }
          _this.colorKey = key;
          exports.shapes[key] = _this;
          _this.on('shadowColorChange.konva shadowBlurChange.konva shadowOffsetChange.konva shadowOpacityChange.konva shadowEnabledChange.konva', _clearHasShadowCache);
          _this.on('shadowColorChange.konva shadowOpacityChange.konva shadowEnabledChange.konva', _clearGetShadowRGBACache);
          _this.on('fillPriorityChange.konva fillPatternImageChange.konva fillPatternRepeatChange.konva fillPatternScaleXChange.konva fillPatternScaleYChange.konva', _clearFillPatternCache);
          _this.on('fillPriorityChange.konva fillLinearGradientColorStopsChange.konva fillLinearGradientStartPointXChange.konva fillLinearGradientStartPointYChange.konva fillLinearGradientEndPointXChange.konva fillLinearGradientEndPointYChange.konva', _clearLinearGradientCache);
          _this.on('fillPriorityChange.konva fillRadialGradientColorStopsChange.konva fillRadialGradientStartPointXChange.konva fillRadialGradientStartPointYChange.konva fillRadialGradientEndPointXChange.konva fillRadialGradientEndPointYChange.konva fillRadialGradientStartRadiusChange.konva fillRadialGradientEndRadiusChange.konva', _clearRadialGradientCache);
          return _this;
      }
      Shape.prototype.getContext = function () {
          return this.getLayer().getContext();
      };
      Shape.prototype.getCanvas = function () {
          return this.getLayer().getCanvas();
      };
      Shape.prototype.getSceneFunc = function () {
          return this.attrs.sceneFunc || this['_sceneFunc'];
      };
      Shape.prototype.getHitFunc = function () {
          return this.attrs.hitFunc || this['_hitFunc'];
      };
      Shape.prototype.hasShadow = function () {
          return this._getCache(HAS_SHADOW, this._hasShadow);
      };
      Shape.prototype._hasShadow = function () {
          return (this.shadowEnabled() &&
              (this.shadowOpacity() !== 0 &&
                  !!(this.shadowColor() ||
                      this.shadowBlur() ||
                      this.shadowOffsetX() ||
                      this.shadowOffsetY())));
      };
      Shape.prototype._getFillPattern = function () {
          return this._getCache(patternImage, this.__getFillPattern);
      };
      Shape.prototype.__getFillPattern = function () {
          if (this.fillPatternImage()) {
              var ctx = getDummyContext();
              var pattern = ctx.createPattern(this.fillPatternImage(), this.fillPatternRepeat() || 'repeat');
              return pattern;
          }
      };
      Shape.prototype._getLinearGradient = function () {
          return this._getCache(linearGradient, this.__getLinearGradient);
      };
      Shape.prototype.__getLinearGradient = function () {
          var colorStops = this.fillLinearGradientColorStops();
          if (colorStops) {
              var ctx = getDummyContext();
              var start = this.fillLinearGradientStartPoint();
              var end = this.fillLinearGradientEndPoint();
              var grd = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
              for (var n = 0; n < colorStops.length; n += 2) {
                  grd.addColorStop(colorStops[n], colorStops[n + 1]);
              }
              return grd;
          }
      };
      Shape.prototype._getRadialGradient = function () {
          return this._getCache(radialGradient, this.__getRadialGradient);
      };
      Shape.prototype.__getRadialGradient = function () {
          var colorStops = this.fillRadialGradientColorStops();
          if (colorStops) {
              var ctx = getDummyContext();
              var start = this.fillRadialGradientStartPoint();
              var end = this.fillRadialGradientEndPoint();
              var grd = ctx.createRadialGradient(start.x, start.y, this.fillRadialGradientStartRadius(), end.x, end.y, this.fillRadialGradientEndRadius());
              for (var n = 0; n < colorStops.length; n += 2) {
                  grd.addColorStop(colorStops[n], colorStops[n + 1]);
              }
              return grd;
          }
      };
      Shape.prototype.getShadowRGBA = function () {
          return this._getCache(SHADOW_RGBA, this._getShadowRGBA);
      };
      Shape.prototype._getShadowRGBA = function () {
          if (this.hasShadow()) {
              var rgba = Util.Util.colorToRGBA(this.shadowColor());
              return ('rgba(' +
                  rgba.r +
                  ',' +
                  rgba.g +
                  ',' +
                  rgba.b +
                  ',' +
                  rgba.a * (this.shadowOpacity() || 1) +
                  ')');
          }
      };
      Shape.prototype.hasFill = function () {
          return !!(this.fill() ||
              this.fillPatternImage() ||
              this.fillLinearGradientColorStops() ||
              this.fillRadialGradientColorStops());
      };
      Shape.prototype.hasStroke = function () {
          return (this.strokeEnabled() &&
              this.strokeWidth() &&
              !!(this.stroke() || this.strokeLinearGradientColorStops()));
      };
      Shape.prototype.hasHitStroke = function () {
          var width = this.hitStrokeWidth();
          return (this.strokeEnabled() &&
              (width || this.strokeWidth() && width === 'auto'));
      };
      Shape.prototype.intersects = function (point) {
          var stage = this.getStage(), bufferHitCanvas = stage.bufferHitCanvas, p;
          bufferHitCanvas.getContext().clear();
          this.drawHit(bufferHitCanvas);
          p = bufferHitCanvas.context.getImageData(Math.round(point.x), Math.round(point.y), 1, 1).data;
          return p[3] > 0;
      };
      Shape.prototype.destroy = function () {
          Node_1.Node.prototype.destroy.call(this);
          delete exports.shapes[this.colorKey];
          delete this.colorKey;
          return this;
      };
      Shape.prototype._useBufferCanvas = function (caching) {
          return !!((!caching || this.hasShadow()) &&
              this.perfectDrawEnabled() &&
              this.getAbsoluteOpacity() !== 1 &&
              this.hasFill() &&
              this.hasStroke() &&
              this.getStage());
      };
      Shape.prototype.setStrokeHitEnabled = function (val) {
          if (val) {
              this.hitStrokeWidth('auto');
          }
          else {
              this.hitStrokeWidth(0);
          }
      };
      Shape.prototype.getStrokeHitEnabled = function () {
          if (this.hitStrokeWidth() === 0) {
              return false;
          }
          else {
              return true;
          }
      };
      Shape.prototype.getSelfRect = function () {
          var size = this.size();
          return {
              x: this._centroid ? Math.round(-size.width / 2) : 0,
              y: this._centroid ? Math.round(-size.height / 2) : 0,
              width: size.width,
              height: size.height
          };
      };
      Shape.prototype.getClientRect = function (attrs) {
          attrs = attrs || {};
          var skipTransform = attrs.skipTransform;
          var relativeTo = attrs.relativeTo;
          var fillRect = this.getSelfRect();
          var applyStroke = !attrs.skipStroke && this.hasStroke();
          var strokeWidth = (applyStroke && this.strokeWidth()) || 0;
          var fillAndStrokeWidth = fillRect.width + strokeWidth;
          var fillAndStrokeHeight = fillRect.height + strokeWidth;
          var applyShadow = !attrs.skipShadow && this.hasShadow();
          var shadowOffsetX = applyShadow ? this.shadowOffsetX() : 0;
          var shadowOffsetY = applyShadow ? this.shadowOffsetY() : 0;
          var preWidth = fillAndStrokeWidth + Math.abs(shadowOffsetX);
          var preHeight = fillAndStrokeHeight + Math.abs(shadowOffsetY);
          var blurRadius = (applyShadow && this.shadowBlur()) || 0;
          var width = preWidth + blurRadius * 2;
          var height = preHeight + blurRadius * 2;
          var roundingOffset = 0;
          if (Math.round(strokeWidth / 2) !== strokeWidth / 2) {
              roundingOffset = 1;
          }
          var rect = {
              width: width + roundingOffset,
              height: height + roundingOffset,
              x: -Math.round(strokeWidth / 2 + blurRadius) +
                  Math.min(shadowOffsetX, 0) +
                  fillRect.x,
              y: -Math.round(strokeWidth / 2 + blurRadius) +
                  Math.min(shadowOffsetY, 0) +
                  fillRect.y
          };
          if (!skipTransform) {
              return this._transformedRect(rect, relativeTo);
          }
          return rect;
      };
      Shape.prototype.drawScene = function (can, top, caching, skipBuffer) {
          var layer = this.getLayer(), canvas = can || layer.getCanvas(), context = canvas.getContext(), cachedCanvas = this._getCanvasCache(), drawFunc = this.sceneFunc(), hasShadow = this.hasShadow(), hasStroke = this.hasStroke(), stage, bufferCanvas, bufferContext;
          if (!this.isVisible() && !caching) {
              return this;
          }
          if (cachedCanvas) {
              context.save();
              layer._applyTransform(this, context, top);
              this._drawCachedSceneCanvas(context);
              context.restore();
              return this;
          }
          if (!drawFunc) {
              return this;
          }
          context.save();
          if (this._useBufferCanvas(caching) && !skipBuffer) {
              stage = this.getStage();
              bufferCanvas = stage.bufferCanvas;
              bufferContext = bufferCanvas.getContext();
              bufferContext.clear();
              bufferContext.save();
              bufferContext._applyLineJoin(this);
              if (!caching) {
                  if (layer) {
                      layer._applyTransform(this, bufferContext, top);
                  }
                  else {
                      var m = this.getAbsoluteTransform(top).getMatrix();
                      context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
                  }
              }
              drawFunc.call(this, bufferContext, this);
              bufferContext.restore();
              var ratio = bufferCanvas.pixelRatio;
              if (hasShadow && !canvas.hitCanvas) {
                  context.save();
                  context._applyShadow(this);
                  context._applyOpacity(this);
                  context._applyGlobalCompositeOperation(this);
                  context.drawImage(bufferCanvas._canvas, 0, 0, bufferCanvas.width / ratio, bufferCanvas.height / ratio);
                  context.restore();
              }
              else {
                  context._applyOpacity(this);
                  context._applyGlobalCompositeOperation(this);
                  context.drawImage(bufferCanvas._canvas, 0, 0, bufferCanvas.width / ratio, bufferCanvas.height / ratio);
              }
          }
          else {
              context._applyLineJoin(this);
              if (!caching) {
                  if (layer) {
                      layer._applyTransform(this, context, top);
                  }
                  else {
                      var o = this.getAbsoluteTransform(top).getMatrix();
                      context.transform(o[0], o[1], o[2], o[3], o[4], o[5]);
                  }
              }
              if (hasShadow && hasStroke && !canvas.hitCanvas) {
                  context.save();
                  if (!caching) {
                      context._applyOpacity(this);
                      context._applyGlobalCompositeOperation(this);
                  }
                  context._applyShadow(this);
                  drawFunc.call(this, context, this);
                  context.restore();
                  if (this.hasFill() && this.shadowForStrokeEnabled()) {
                      drawFunc.call(this, context, this);
                  }
              }
              else if (hasShadow && !canvas.hitCanvas) {
                  context.save();
                  if (!caching) {
                      context._applyOpacity(this);
                      context._applyGlobalCompositeOperation(this);
                  }
                  context._applyShadow(this);
                  drawFunc.call(this, context, this);
                  context.restore();
              }
              else {
                  if (!caching) {
                      context._applyOpacity(this);
                      context._applyGlobalCompositeOperation(this);
                  }
                  drawFunc.call(this, context, this);
              }
          }
          context.restore();
          return this;
      };
      Shape.prototype.drawHit = function (can, top, caching) {
          var layer = this.getLayer(), canvas = can || layer.hitCanvas, context = canvas && canvas.getContext(), drawFunc = this.hitFunc() || this.sceneFunc(), cachedCanvas = this._getCanvasCache(), cachedHitCanvas = cachedCanvas && cachedCanvas.hit;
          if (!this.colorKey) {
              console.log(this);
              Util.Util.warn('Looks like your canvas has a destroyed shape in it. Do not reuse shape after you destroyed it. See the shape in logs above. If you want to reuse shape you should call remove() instead of destroy()');
          }
          if (!this.shouldDrawHit() && !caching) {
              return this;
          }
          if (cachedHitCanvas) {
              context.save();
              layer._applyTransform(this, context, top);
              this._drawCachedHitCanvas(context);
              context.restore();
              return this;
          }
          if (!drawFunc) {
              return this;
          }
          context.save();
          context._applyLineJoin(this);
          if (!caching) {
              if (layer) {
                  layer._applyTransform(this, context, top);
              }
              else {
                  var o = this.getAbsoluteTransform(top).getMatrix();
                  context.transform(o[0], o[1], o[2], o[3], o[4], o[5]);
              }
          }
          drawFunc.call(this, context, this);
          context.restore();
          return this;
      };
      Shape.prototype.drawHitFromCache = function (alphaThreshold) {
          if (alphaThreshold === void 0) { alphaThreshold = 0; }
          var cachedCanvas = this._getCanvasCache(), sceneCanvas = this._getCachedSceneCanvas(), hitCanvas = cachedCanvas.hit, hitContext = hitCanvas.getContext(), hitWidth = hitCanvas.getWidth(), hitHeight = hitCanvas.getHeight(), hitImageData, hitData, len, rgbColorKey, i, alpha;
          hitContext.clear();
          hitContext.drawImage(sceneCanvas._canvas, 0, 0, hitWidth, hitHeight);
          try {
              hitImageData = hitContext.getImageData(0, 0, hitWidth, hitHeight);
              hitData = hitImageData.data;
              len = hitData.length;
              rgbColorKey = Util.Util._hexToRgb(this.colorKey);
              for (i = 0; i < len; i += 4) {
                  alpha = hitData[i + 3];
                  if (alpha > alphaThreshold) {
                      hitData[i] = rgbColorKey.r;
                      hitData[i + 1] = rgbColorKey.g;
                      hitData[i + 2] = rgbColorKey.b;
                      hitData[i + 3] = 255;
                  }
                  else {
                      hitData[i + 3] = 0;
                  }
              }
              hitContext.putImageData(hitImageData, 0, 0);
          }
          catch (e) {
              Util.Util.error('Unable to draw hit graph from cached scene canvas. ' + e.message);
          }
          return this;
      };
      Shape.prototype.hasPointerCapture = function (pointerId) {
          return PointerEvents.hasPointerCapture(pointerId, this);
      };
      Shape.prototype.setPointerCapture = function (pointerId) {
          PointerEvents.setPointerCapture(pointerId, this);
      };
      Shape.prototype.releaseCapture = function (pointerId) {
          PointerEvents.releaseCapture(pointerId, this);
      };
      return Shape;
  }(Node_1.Node));
  exports.Shape = Shape;
  Shape.prototype._fillFunc = _fillFunc;
  Shape.prototype._strokeFunc = _strokeFunc;
  Shape.prototype._fillFuncHit = _fillFuncHit;
  Shape.prototype._strokeFuncHit = _strokeFuncHit;
  Shape.prototype._centroid = false;
  Shape.prototype.nodeType = 'Shape';
  Global._registerNode(Shape);
  Factory.Factory.addGetterSetter(Shape, 'stroke', undefined, Validators.getStringValidator());
  Factory.Factory.addGetterSetter(Shape, 'strokeWidth', 2, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Shape, 'hitStrokeWidth', 'auto', Validators.getNumberOrAutoValidator());
  Factory.Factory.addGetterSetter(Shape, 'strokeHitEnabled', true, Validators.getBooleanValidator());
  Factory.Factory.addGetterSetter(Shape, 'perfectDrawEnabled', true, Validators.getBooleanValidator());
  Factory.Factory.addGetterSetter(Shape, 'shadowForStrokeEnabled', true, Validators.getBooleanValidator());
  Factory.Factory.addGetterSetter(Shape, 'lineJoin');
  Factory.Factory.addGetterSetter(Shape, 'lineCap');
  Factory.Factory.addGetterSetter(Shape, 'sceneFunc');
  Factory.Factory.addGetterSetter(Shape, 'hitFunc');
  Factory.Factory.addGetterSetter(Shape, 'dash');
  Factory.Factory.addGetterSetter(Shape, 'dashOffset', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Shape, 'shadowColor', undefined, Validators.getStringValidator());
  Factory.Factory.addGetterSetter(Shape, 'shadowBlur', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Shape, 'shadowOpacity', 1, Validators.getNumberValidator());
  Factory.Factory.addComponentsGetterSetter(Shape, 'shadowOffset', ['x', 'y']);
  Factory.Factory.addGetterSetter(Shape, 'shadowOffsetX', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Shape, 'shadowOffsetY', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Shape, 'fillPatternImage');
  Factory.Factory.addGetterSetter(Shape, 'fill', undefined, Validators.getStringValidator());
  Factory.Factory.addGetterSetter(Shape, 'fillPatternX', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Shape, 'fillPatternY', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Shape, 'fillLinearGradientColorStops');
  Factory.Factory.addGetterSetter(Shape, 'strokeLinearGradientColorStops');
  Factory.Factory.addGetterSetter(Shape, 'fillRadialGradientStartRadius', 0);
  Factory.Factory.addGetterSetter(Shape, 'fillRadialGradientEndRadius', 0);
  Factory.Factory.addGetterSetter(Shape, 'fillRadialGradientColorStops');
  Factory.Factory.addGetterSetter(Shape, 'fillPatternRepeat', 'repeat');
  Factory.Factory.addGetterSetter(Shape, 'fillEnabled', true);
  Factory.Factory.addGetterSetter(Shape, 'strokeEnabled', true);
  Factory.Factory.addGetterSetter(Shape, 'shadowEnabled', true);
  Factory.Factory.addGetterSetter(Shape, 'dashEnabled', true);
  Factory.Factory.addGetterSetter(Shape, 'strokeScaleEnabled', true);
  Factory.Factory.addGetterSetter(Shape, 'fillPriority', 'color');
  Factory.Factory.addComponentsGetterSetter(Shape, 'fillPatternOffset', ['x', 'y']);
  Factory.Factory.addGetterSetter(Shape, 'fillPatternOffsetX', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Shape, 'fillPatternOffsetY', 0, Validators.getNumberValidator());
  Factory.Factory.addComponentsGetterSetter(Shape, 'fillPatternScale', ['x', 'y']);
  Factory.Factory.addGetterSetter(Shape, 'fillPatternScaleX', 1, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Shape, 'fillPatternScaleY', 1, Validators.getNumberValidator());
  Factory.Factory.addComponentsGetterSetter(Shape, 'fillLinearGradientStartPoint', [
      'x',
      'y'
  ]);
  Factory.Factory.addComponentsGetterSetter(Shape, 'strokeLinearGradientStartPoint', [
      'x',
      'y'
  ]);
  Factory.Factory.addGetterSetter(Shape, 'fillLinearGradientStartPointX', 0);
  Factory.Factory.addGetterSetter(Shape, 'strokeLinearGradientStartPointX', 0);
  Factory.Factory.addGetterSetter(Shape, 'fillLinearGradientStartPointY', 0);
  Factory.Factory.addGetterSetter(Shape, 'strokeLinearGradientStartPointY', 0);
  Factory.Factory.addComponentsGetterSetter(Shape, 'fillLinearGradientEndPoint', [
      'x',
      'y'
  ]);
  Factory.Factory.addComponentsGetterSetter(Shape, 'strokeLinearGradientEndPoint', [
      'x',
      'y'
  ]);
  Factory.Factory.addGetterSetter(Shape, 'fillLinearGradientEndPointX', 0);
  Factory.Factory.addGetterSetter(Shape, 'strokeLinearGradientEndPointX', 0);
  Factory.Factory.addGetterSetter(Shape, 'fillLinearGradientEndPointY', 0);
  Factory.Factory.addGetterSetter(Shape, 'strokeLinearGradientEndPointY', 0);
  Factory.Factory.addComponentsGetterSetter(Shape, 'fillRadialGradientStartPoint', [
      'x',
      'y'
  ]);
  Factory.Factory.addGetterSetter(Shape, 'fillRadialGradientStartPointX', 0);
  Factory.Factory.addGetterSetter(Shape, 'fillRadialGradientStartPointY', 0);
  Factory.Factory.addComponentsGetterSetter(Shape, 'fillRadialGradientEndPoint', [
      'x',
      'y'
  ]);
  Factory.Factory.addGetterSetter(Shape, 'fillRadialGradientEndPointX', 0);
  Factory.Factory.addGetterSetter(Shape, 'fillRadialGradientEndPointY', 0);
  Factory.Factory.addGetterSetter(Shape, 'fillPatternRotation', 0);
  Factory.Factory.backCompat(Shape, {
      dashArray: 'dash',
      getDashArray: 'getDash',
      setDashArray: 'getDash',
      drawFunc: 'sceneFunc',
      getDrawFunc: 'getSceneFunc',
      setDrawFunc: 'setSceneFunc',
      drawHitFunc: 'hitFunc',
      getDrawHitFunc: 'getHitFunc',
      setDrawHitFunc: 'setHitFunc'
  });
  Util.Collection.mapMethods(Shape);
  });

  unwrapExports(Shape_1);
  var Shape_2 = Shape_1.shapes;
  var Shape_3 = Shape_1.Shape;

  var Layer_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });








  var HASH = '#', BEFORE_DRAW = 'beforeDraw', DRAW = 'draw', INTERSECTION_OFFSETS = [
      { x: 0, y: 0 },
      { x: -1, y: -1 },
      { x: 1, y: -1 },
      { x: 1, y: 1 },
      { x: -1, y: 1 }
  ], INTERSECTION_OFFSETS_LEN = INTERSECTION_OFFSETS.length;
  var Layer = (function (_super) {
      __extends(Layer, _super);
      function Layer() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.hitCanvas = new Canvas_1.HitCanvas({
              pixelRatio: 1
          });
          return _this;
      }
      Layer.prototype._setCanvasSize = function (width, height) {
          this.canvas.setSize(width, height);
          this.hitCanvas.setSize(width, height);
          this._checkSmooth();
      };
      Layer.prototype._validateAdd = function (child) {
          var type = child.getType();
          if (type !== 'Group' && type !== 'Shape') {
              Util.Util.throw('You may only add groups and shapes to a layer.');
          }
      };
      Layer.prototype.getIntersection = function (pos, selector) {
          var obj, i, intersectionOffset, shape;
          if (!this.hitGraphEnabled() || !this.isVisible()) {
              return null;
          }
          var spiralSearchDistance = 1;
          var continueSearch = false;
          while (true) {
              for (i = 0; i < INTERSECTION_OFFSETS_LEN; i++) {
                  intersectionOffset = INTERSECTION_OFFSETS[i];
                  obj = this._getIntersection({
                      x: pos.x + intersectionOffset.x * spiralSearchDistance,
                      y: pos.y + intersectionOffset.y * spiralSearchDistance
                  });
                  shape = obj.shape;
                  if (shape && selector) {
                      return shape.findAncestor(selector, true);
                  }
                  else if (shape) {
                      return shape;
                  }
                  continueSearch = !!obj.antialiased;
                  if (!obj.antialiased) {
                      break;
                  }
              }
              if (continueSearch) {
                  spiralSearchDistance += 1;
              }
              else {
                  return null;
              }
          }
      };
      Layer.prototype._getIntersection = function (pos) {
          var ratio = this.hitCanvas.pixelRatio;
          var p = this.hitCanvas.context.getImageData(Math.round(pos.x * ratio), Math.round(pos.y * ratio), 1, 1).data, p3 = p[3], colorKey, shape;
          if (p3 === 255) {
              colorKey = Util.Util._rgbToHex(p[0], p[1], p[2]);
              shape = Shape_1.shapes[HASH + colorKey];
              if (shape) {
                  return {
                      shape: shape
                  };
              }
              return {
                  antialiased: true
              };
          }
          else if (p3 > 0) {
              return {
                  antialiased: true
              };
          }
          return {};
      };
      Layer.prototype.drawScene = function (can, top) {
          var layer = this.getLayer(), canvas = can || (layer && layer.getCanvas());
          this._fire(BEFORE_DRAW, {
              node: this
          });
          if (this.clearBeforeDraw()) {
              canvas.getContext().clear();
          }
          Container_1.Container.prototype.drawScene.call(this, canvas, top);
          this._fire(DRAW, {
              node: this
          });
          return this;
      };
      Layer.prototype.drawHit = function (can, top) {
          var layer = this.getLayer(), canvas = can || (layer && layer.hitCanvas);
          if (layer && layer.clearBeforeDraw()) {
              layer
                  .getHitCanvas()
                  .getContext()
                  .clear();
          }
          Container_1.Container.prototype.drawHit.call(this, canvas, top);
          return this;
      };
      Layer.prototype.clear = function (bounds) {
          BaseLayer_1.BaseLayer.prototype.clear.call(this, bounds);
          this.getHitCanvas()
              .getContext()
              .clear(bounds);
          return this;
      };
      Layer.prototype.enableHitGraph = function () {
          this.hitGraphEnabled(true);
          return this;
      };
      Layer.prototype.disableHitGraph = function () {
          this.hitGraphEnabled(false);
          return this;
      };
      Layer.prototype.toggleHitCanvas = function () {
          if (!this.parent) {
              return;
          }
          var parent = this.parent;
          var added = !!this.hitCanvas._canvas.parentNode;
          if (added) {
              parent.content.removeChild(this.hitCanvas._canvas);
          }
          else {
              parent.content.appendChild(this.hitCanvas._canvas);
          }
      };
      Layer.prototype.setSize = function (_a) {
          var width = _a.width, height = _a.height;
          _super.prototype.setSize.call(this, { width: width, height: height });
          this.hitCanvas.setSize(width, height);
          return this;
      };
      return Layer;
  }(BaseLayer_1.BaseLayer));
  exports.Layer = Layer;
  Layer.prototype.nodeType = 'Layer';
  Global._registerNode(Layer);
  Factory.Factory.addGetterSetter(Layer, 'hitGraphEnabled', true, Validators.getBooleanValidator());
  Util.Collection.mapMethods(Layer);
  });

  unwrapExports(Layer_1);
  var Layer_2 = Layer_1.Layer;

  var FastLayer_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });




  var FastLayer = (function (_super) {
      __extends(FastLayer, _super);
      function FastLayer() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      FastLayer.prototype._validateAdd = function (child) {
          var type = child.getType();
          if (type !== 'Shape') {
              Util.Util.throw('You may only add shapes to a fast layer.');
          }
      };
      FastLayer.prototype._setCanvasSize = function (width, height) {
          this.canvas.setSize(width, height);
          this._checkSmooth();
      };
      FastLayer.prototype.hitGraphEnabled = function () {
          return false;
      };
      FastLayer.prototype.drawScene = function (can) {
          var layer = this.getLayer(), canvas = can || (layer && layer.getCanvas());
          if (this.clearBeforeDraw()) {
              canvas.getContext().clear();
          }
          Container_1.Container.prototype.drawScene.call(this, canvas);
          return this;
      };
      FastLayer.prototype.draw = function () {
          this.drawScene();
          return this;
      };
      return FastLayer;
  }(BaseLayer_1.BaseLayer));
  exports.FastLayer = FastLayer;
  FastLayer.prototype.nodeType = 'FastLayer';
  Global._registerNode(FastLayer);
  Util.Collection.mapMethods(FastLayer);
  });

  unwrapExports(FastLayer_1);
  var FastLayer_2 = FastLayer_1.FastLayer;

  var Group_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });



  var Group = (function (_super) {
      __extends(Group, _super);
      function Group() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Group.prototype._validateAdd = function (child) {
          var type = child.getType();
          if (type !== 'Group' && type !== 'Shape') {
              Util.Util.throw('You may only add groups and shapes to groups.');
          }
      };
      return Group;
  }(Container_1.Container));
  exports.Group = Group;
  Group.prototype.nodeType = 'Group';
  Global._registerNode(Group);
  Util.Collection.mapMethods(Group);
  });

  unwrapExports(Group_1);
  var Group_2 = Group_1.Group;

  var Animation_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });

  var now = (function () {
      if (Global.glob.performance && Global.glob.performance.now) {
          return function () {
              return Global.glob.performance.now();
          };
      }
      return function () {
          return new Date().getTime();
      };
  })();
  var Animation = (function () {
      function Animation(func, layers) {
          this.id = Animation.animIdCounter++;
          this.frame = {
              time: 0,
              timeDiff: 0,
              lastTime: now(),
              frameRate: 0
          };
          this.func = func;
          this.setLayers(layers);
      }
      Animation.prototype.setLayers = function (layers) {
          var lays = [];
          if (!layers) {
              lays = [];
          }
          else if (layers.length > 0) {
              lays = layers;
          }
          else {
              lays = [layers];
          }
          this.layers = lays;
          return this;
      };
      Animation.prototype.getLayers = function () {
          return this.layers;
      };
      Animation.prototype.addLayer = function (layer) {
          var layers = this.layers, len = layers.length, n;
          for (n = 0; n < len; n++) {
              if (layers[n]._id === layer._id) {
                  return false;
              }
          }
          this.layers.push(layer);
          return true;
      };
      Animation.prototype.isRunning = function () {
          var a = Animation, animations = a.animations, len = animations.length, n;
          for (n = 0; n < len; n++) {
              if (animations[n].id === this.id) {
                  return true;
              }
          }
          return false;
      };
      Animation.prototype.start = function () {
          this.stop();
          this.frame.timeDiff = 0;
          this.frame.lastTime = now();
          Animation._addAnimation(this);
          return this;
      };
      Animation.prototype.stop = function () {
          Animation._removeAnimation(this);
          return this;
      };
      Animation.prototype._updateFrameObject = function (time) {
          this.frame.timeDiff = time - this.frame.lastTime;
          this.frame.lastTime = time;
          this.frame.time += this.frame.timeDiff;
          this.frame.frameRate = 1000 / this.frame.timeDiff;
      };
      Animation._addAnimation = function (anim) {
          this.animations.push(anim);
          this._handleAnimation();
      };
      Animation._removeAnimation = function (anim) {
          var id = anim.id, animations = this.animations, len = animations.length, n;
          for (n = 0; n < len; n++) {
              if (animations[n].id === id) {
                  this.animations.splice(n, 1);
                  break;
              }
          }
      };
      Animation._runFrames = function () {
          var layerHash = {}, animations = this.animations, anim, layers, func, n, i, layersLen, layer, key, needRedraw;
          for (n = 0; n < animations.length; n++) {
              anim = animations[n];
              layers = anim.layers;
              func = anim.func;
              anim._updateFrameObject(now());
              layersLen = layers.length;
              if (func) {
                  needRedraw = func.call(anim, anim.frame) !== false;
              }
              else {
                  needRedraw = true;
              }
              if (!needRedraw) {
                  continue;
              }
              for (i = 0; i < layersLen; i++) {
                  layer = layers[i];
                  if (layer._id !== undefined) {
                      layerHash[layer._id] = layer;
                  }
              }
          }
          for (key in layerHash) {
              if (!layerHash.hasOwnProperty(key)) {
                  continue;
              }
              layerHash[key].draw();
          }
      };
      Animation._animationLoop = function () {
          var Anim = Animation;
          if (Anim.animations.length) {
              Anim._runFrames();
              requestAnimationFrame(Anim._animationLoop);
          }
          else {
              Anim.animRunning = false;
          }
      };
      Animation._handleAnimation = function () {
          if (!this.animRunning) {
              this.animRunning = true;
              requestAnimationFrame(this._animationLoop);
          }
      };
      Animation.animations = [];
      Animation.animIdCounter = 0;
      Animation.animRunning = false;
      return Animation;
  }());
  exports.Animation = Animation;
  });

  unwrapExports(Animation_1);
  var Animation_2 = Animation_1.Animation;

  var Tween_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });




  var blacklist = {
      node: 1,
      duration: 1,
      easing: 1,
      onFinish: 1,
      yoyo: 1
  }, PAUSED = 1, PLAYING = 2, REVERSING = 3, idCounter = 0, colorAttrs = ['fill', 'stroke', 'shadowColor'];
  var TweenEngine = (function () {
      function TweenEngine(prop, propFunc, func, begin, finish, duration, yoyo) {
          this.prop = prop;
          this.propFunc = propFunc;
          this.begin = begin;
          this._pos = begin;
          this.duration = duration;
          this._change = 0;
          this.prevPos = 0;
          this.yoyo = yoyo;
          this._time = 0;
          this._position = 0;
          this._startTime = 0;
          this._finish = 0;
          this.func = func;
          this._change = finish - this.begin;
          this.pause();
      }
      TweenEngine.prototype.fire = function (str) {
          var handler = this[str];
          if (handler) {
              handler();
          }
      };
      TweenEngine.prototype.setTime = function (t) {
          if (t > this.duration) {
              if (this.yoyo) {
                  this._time = this.duration;
                  this.reverse();
              }
              else {
                  this.finish();
              }
          }
          else if (t < 0) {
              if (this.yoyo) {
                  this._time = 0;
                  this.play();
              }
              else {
                  this.reset();
              }
          }
          else {
              this._time = t;
              this.update();
          }
      };
      TweenEngine.prototype.getTime = function () {
          return this._time;
      };
      TweenEngine.prototype.setPosition = function (p) {
          this.prevPos = this._pos;
          this.propFunc(p);
          this._pos = p;
      };
      TweenEngine.prototype.getPosition = function (t) {
          if (t === undefined) {
              t = this._time;
          }
          return this.func(t, this.begin, this._change, this.duration);
      };
      TweenEngine.prototype.play = function () {
          this.state = PLAYING;
          this._startTime = this.getTimer() - this._time;
          this.onEnterFrame();
          this.fire('onPlay');
      };
      TweenEngine.prototype.reverse = function () {
          this.state = REVERSING;
          this._time = this.duration - this._time;
          this._startTime = this.getTimer() - this._time;
          this.onEnterFrame();
          this.fire('onReverse');
      };
      TweenEngine.prototype.seek = function (t) {
          this.pause();
          this._time = t;
          this.update();
          this.fire('onSeek');
      };
      TweenEngine.prototype.reset = function () {
          this.pause();
          this._time = 0;
          this.update();
          this.fire('onReset');
      };
      TweenEngine.prototype.finish = function () {
          this.pause();
          this._time = this.duration;
          this.update();
          this.fire('onFinish');
      };
      TweenEngine.prototype.update = function () {
          this.setPosition(this.getPosition(this._time));
      };
      TweenEngine.prototype.onEnterFrame = function () {
          var t = this.getTimer() - this._startTime;
          if (this.state === PLAYING) {
              this.setTime(t);
          }
          else if (this.state === REVERSING) {
              this.setTime(this.duration - t);
          }
      };
      TweenEngine.prototype.pause = function () {
          this.state = PAUSED;
          this.fire('onPause');
      };
      TweenEngine.prototype.getTimer = function () {
          return new Date().getTime();
      };
      return TweenEngine;
  }());
  var Tween = (function () {
      function Tween(config) {
          var that = this, node = config.node, nodeId = node._id, duration, easing = config.easing || exports.Easings.Linear, yoyo = !!config.yoyo, key;
          if (typeof config.duration === 'undefined') {
              duration = 0.3;
          }
          else if (config.duration === 0) {
              duration = 0.001;
          }
          else {
              duration = config.duration;
          }
          this.node = node;
          this._id = idCounter++;
          var layers = node.getLayer() ||
              (node instanceof Global.Konva['Stage'] ? node.getLayers() : null);
          if (!layers) {
              Util.Util.error('Tween constructor have `node` that is not in a layer. Please add node into layer first.');
          }
          this.anim = new Animation_1.Animation(function () {
              that.tween.onEnterFrame();
          }, layers);
          this.tween = new TweenEngine(key, function (i) {
              that._tweenFunc(i);
          }, easing, 0, 1, duration * 1000, yoyo);
          this._addListeners();
          if (!Tween.attrs[nodeId]) {
              Tween.attrs[nodeId] = {};
          }
          if (!Tween.attrs[nodeId][this._id]) {
              Tween.attrs[nodeId][this._id] = {};
          }
          if (!Tween.tweens[nodeId]) {
              Tween.tweens[nodeId] = {};
          }
          for (key in config) {
              if (blacklist[key] === undefined) {
                  this._addAttr(key, config[key]);
              }
          }
          this.reset();
          this.onFinish = config.onFinish;
          this.onReset = config.onReset;
      }
      Tween.prototype._addAttr = function (key, end) {
          var node = this.node, nodeId = node._id, start, diff, tweenId, n, len, trueEnd, trueStart, endRGBA;
          tweenId = Tween.tweens[nodeId][key];
          if (tweenId) {
              delete Tween.attrs[nodeId][tweenId][key];
          }
          start = node.getAttr(key);
          if (Util.Util._isArray(end)) {
              diff = [];
              len = Math.max(end.length, start.length);
              if (key === 'points' && end.length !== start.length) {
                  if (end.length > start.length) {
                      trueStart = start;
                      start = Util.Util._prepareArrayForTween(start, end, node.closed());
                  }
                  else {
                      trueEnd = end;
                      end = Util.Util._prepareArrayForTween(end, start, node.closed());
                  }
              }
              if (key.indexOf('fill') === 0) {
                  for (n = 0; n < len; n++) {
                      if (n % 2 === 0) {
                          diff.push(end[n] - start[n]);
                      }
                      else {
                          var startRGBA = Util.Util.colorToRGBA(start[n]);
                          endRGBA = Util.Util.colorToRGBA(end[n]);
                          start[n] = startRGBA;
                          diff.push({
                              r: endRGBA.r - startRGBA.r,
                              g: endRGBA.g - startRGBA.g,
                              b: endRGBA.b - startRGBA.b,
                              a: endRGBA.a - startRGBA.a
                          });
                      }
                  }
              }
              else {
                  for (n = 0; n < len; n++) {
                      diff.push(end[n] - start[n]);
                  }
              }
          }
          else if (colorAttrs.indexOf(key) !== -1) {
              start = Util.Util.colorToRGBA(start);
              endRGBA = Util.Util.colorToRGBA(end);
              diff = {
                  r: endRGBA.r - start.r,
                  g: endRGBA.g - start.g,
                  b: endRGBA.b - start.b,
                  a: endRGBA.a - start.a
              };
          }
          else {
              diff = end - start;
          }
          Tween.attrs[nodeId][this._id][key] = {
              start: start,
              diff: diff,
              end: end,
              trueEnd: trueEnd,
              trueStart: trueStart
          };
          Tween.tweens[nodeId][key] = this._id;
      };
      Tween.prototype._tweenFunc = function (i) {
          var node = this.node, attrs = Tween.attrs[node._id][this._id], key, attr, start, diff, newVal, n, len, end;
          for (key in attrs) {
              attr = attrs[key];
              start = attr.start;
              diff = attr.diff;
              end = attr.end;
              if (Util.Util._isArray(start)) {
                  newVal = [];
                  len = Math.max(start.length, end.length);
                  if (key.indexOf('fill') === 0) {
                      for (n = 0; n < len; n++) {
                          if (n % 2 === 0) {
                              newVal.push((start[n] || 0) + diff[n] * i);
                          }
                          else {
                              newVal.push('rgba(' +
                                  Math.round(start[n].r + diff[n].r * i) +
                                  ',' +
                                  Math.round(start[n].g + diff[n].g * i) +
                                  ',' +
                                  Math.round(start[n].b + diff[n].b * i) +
                                  ',' +
                                  (start[n].a + diff[n].a * i) +
                                  ')');
                          }
                      }
                  }
                  else {
                      for (n = 0; n < len; n++) {
                          newVal.push((start[n] || 0) + diff[n] * i);
                      }
                  }
              }
              else if (colorAttrs.indexOf(key) !== -1) {
                  newVal =
                      'rgba(' +
                          Math.round(start.r + diff.r * i) +
                          ',' +
                          Math.round(start.g + diff.g * i) +
                          ',' +
                          Math.round(start.b + diff.b * i) +
                          ',' +
                          (start.a + diff.a * i) +
                          ')';
              }
              else {
                  newVal = start + diff * i;
              }
              node.setAttr(key, newVal);
          }
      };
      Tween.prototype._addListeners = function () {
          var _this = this;
          this.tween.onPlay = function () {
              _this.anim.start();
          };
          this.tween.onReverse = function () {
              _this.anim.start();
          };
          this.tween.onPause = function () {
              _this.anim.stop();
          };
          this.tween.onFinish = function () {
              var node = _this.node;
              var attrs = Tween.attrs[node._id][_this._id];
              if (attrs.points && attrs.points.trueEnd) {
                  node.setAttr('points', attrs.points.trueEnd);
              }
              if (_this.onFinish) {
                  _this.onFinish.call(_this);
              }
          };
          this.tween.onReset = function () {
              var node = _this.node;
              var attrs = Tween.attrs[node._id][_this._id];
              if (attrs.points && attrs.points.trueStart) {
                  node.points(attrs.points.trueStart);
              }
              if (_this.onReset) {
                  _this.onReset();
              }
          };
      };
      Tween.prototype.play = function () {
          this.tween.play();
          return this;
      };
      Tween.prototype.reverse = function () {
          this.tween.reverse();
          return this;
      };
      Tween.prototype.reset = function () {
          this.tween.reset();
          return this;
      };
      Tween.prototype.seek = function (t) {
          this.tween.seek(t * 1000);
          return this;
      };
      Tween.prototype.pause = function () {
          this.tween.pause();
          return this;
      };
      Tween.prototype.finish = function () {
          this.tween.finish();
          return this;
      };
      Tween.prototype.destroy = function () {
          var nodeId = this.node._id, thisId = this._id, attrs = Tween.tweens[nodeId], key;
          this.pause();
          for (key in attrs) {
              delete Tween.tweens[nodeId][key];
          }
          delete Tween.attrs[nodeId][thisId];
      };
      Tween.attrs = {};
      Tween.tweens = {};
      return Tween;
  }());
  exports.Tween = Tween;
  Node_1.Node.prototype.to = function (params) {
      var onFinish = params.onFinish;
      params.node = this;
      params.onFinish = function () {
          this.destroy();
          if (onFinish) {
              onFinish();
          }
      };
      var tween = new Tween(params);
      tween.play();
  };
  exports.Easings = {
      BackEaseIn: function (t, b, c, d) {
          var s = 1.70158;
          return c * (t /= d) * t * ((s + 1) * t - s) + b;
      },
      BackEaseOut: function (t, b, c, d) {
          var s = 1.70158;
          return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
      },
      BackEaseInOut: function (t, b, c, d) {
          var s = 1.70158;
          if ((t /= d / 2) < 1) {
              return (c / 2) * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
          }
          return (c / 2) * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
      },
      ElasticEaseIn: function (t, b, c, d, a, p) {
          var s = 0;
          if (t === 0) {
              return b;
          }
          if ((t /= d) === 1) {
              return b + c;
          }
          if (!p) {
              p = d * 0.3;
          }
          if (!a || a < Math.abs(c)) {
              a = c;
              s = p / 4;
          }
          else {
              s = (p / (2 * Math.PI)) * Math.asin(c / a);
          }
          return (-(a *
              Math.pow(2, 10 * (t -= 1)) *
              Math.sin(((t * d - s) * (2 * Math.PI)) / p)) + b);
      },
      ElasticEaseOut: function (t, b, c, d, a, p) {
          var s = 0;
          if (t === 0) {
              return b;
          }
          if ((t /= d) === 1) {
              return b + c;
          }
          if (!p) {
              p = d * 0.3;
          }
          if (!a || a < Math.abs(c)) {
              a = c;
              s = p / 4;
          }
          else {
              s = (p / (2 * Math.PI)) * Math.asin(c / a);
          }
          return (a * Math.pow(2, -10 * t) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) +
              c +
              b);
      },
      ElasticEaseInOut: function (t, b, c, d, a, p) {
          var s = 0;
          if (t === 0) {
              return b;
          }
          if ((t /= d / 2) === 2) {
              return b + c;
          }
          if (!p) {
              p = d * (0.3 * 1.5);
          }
          if (!a || a < Math.abs(c)) {
              a = c;
              s = p / 4;
          }
          else {
              s = (p / (2 * Math.PI)) * Math.asin(c / a);
          }
          if (t < 1) {
              return (-0.5 *
                  (a *
                      Math.pow(2, 10 * (t -= 1)) *
                      Math.sin(((t * d - s) * (2 * Math.PI)) / p)) +
                  b);
          }
          return (a *
              Math.pow(2, -10 * (t -= 1)) *
              Math.sin(((t * d - s) * (2 * Math.PI)) / p) *
              0.5 +
              c +
              b);
      },
      BounceEaseOut: function (t, b, c, d) {
          if ((t /= d) < 1 / 2.75) {
              return c * (7.5625 * t * t) + b;
          }
          else if (t < 2 / 2.75) {
              return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
          }
          else if (t < 2.5 / 2.75) {
              return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
          }
          else {
              return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
          }
      },
      BounceEaseIn: function (t, b, c, d) {
          return c - exports.Easings.BounceEaseOut(d - t, 0, c, d) + b;
      },
      BounceEaseInOut: function (t, b, c, d) {
          if (t < d / 2) {
              return exports.Easings.BounceEaseIn(t * 2, 0, c, d) * 0.5 + b;
          }
          else {
              return exports.Easings.BounceEaseOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
          }
      },
      EaseIn: function (t, b, c, d) {
          return c * (t /= d) * t + b;
      },
      EaseOut: function (t, b, c, d) {
          return -c * (t /= d) * (t - 2) + b;
      },
      EaseInOut: function (t, b, c, d) {
          if ((t /= d / 2) < 1) {
              return (c / 2) * t * t + b;
          }
          return (-c / 2) * (--t * (t - 2) - 1) + b;
      },
      StrongEaseIn: function (t, b, c, d) {
          return c * (t /= d) * t * t * t * t + b;
      },
      StrongEaseOut: function (t, b, c, d) {
          return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
      },
      StrongEaseInOut: function (t, b, c, d) {
          if ((t /= d / 2) < 1) {
              return (c / 2) * t * t * t * t * t + b;
          }
          return (c / 2) * ((t -= 2) * t * t * t * t + 2) + b;
      },
      Linear: function (t, b, c, d) {
          return (c * t) / d + b;
      }
  };
  });

  unwrapExports(Tween_1);
  var Tween_2 = Tween_1.Tween;
  var Tween_3 = Tween_1.Easings;

  var _CoreInternals = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });














  exports.Konva = Util.Util._assign(Global.Konva, {
      Collection: Util.Collection,
      Util: Util.Util,
      Transform: Util.Transform,
      Node: Node_1.Node,
      ids: Node_1.ids,
      names: Node_1.names,
      Container: Container_1.Container,
      Stage: Stage_1.Stage,
      stages: Stage_1.stages,
      Layer: Layer_1.Layer,
      FastLayer: FastLayer_1.FastLayer,
      Group: Group_1.Group,
      DD: DragAndDrop.DD,
      Shape: Shape_1.Shape,
      shapes: Shape_1.shapes,
      Animation: Animation_1.Animation,
      Tween: Tween_1.Tween,
      Easings: Tween_1.Easings,
      Context: Context_1.Context,
      Canvas: Canvas_1.Canvas
  });
  });

  unwrapExports(_CoreInternals);
  var _CoreInternals_1 = _CoreInternals.Konva;

  var Arc_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });





  var Global_2 = Global;
  var Arc = (function (_super) {
      __extends(Arc, _super);
      function Arc() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Arc.prototype._sceneFunc = function (context) {
          var angle = Global.Konva.getAngle(this.angle()), clockwise = this.clockwise();
          context.beginPath();
          context.arc(0, 0, this.outerRadius(), 0, angle, clockwise);
          context.arc(0, 0, this.innerRadius(), angle, 0, !clockwise);
          context.closePath();
          context.fillStrokeShape(this);
      };
      Arc.prototype.getWidth = function () {
          return this.outerRadius() * 2;
      };
      Arc.prototype.getHeight = function () {
          return this.outerRadius() * 2;
      };
      Arc.prototype.setWidth = function (width) {
          this.outerRadius(width / 2);
      };
      Arc.prototype.setHeight = function (height) {
          this.outerRadius(height / 2);
      };
      return Arc;
  }(Shape_1.Shape));
  exports.Arc = Arc;
  Arc.prototype._centroid = true;
  Arc.prototype.className = 'Arc';
  Arc.prototype._attrsAffectingSize = ['innerRadius', 'outerRadius'];
  Global_2._registerNode(Arc);
  Factory.Factory.addGetterSetter(Arc, 'innerRadius', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Arc, 'outerRadius', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Arc, 'angle', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Arc, 'clockwise', false, Validators.getBooleanValidator());
  Util.Collection.mapMethods(Arc);
  });

  unwrapExports(Arc_1);
  var Arc_2 = Arc_1.Arc;

  var Line_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  var __spreadArrays = (commonjsGlobal && commonjsGlobal.__spreadArrays) || function () {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
      for (var r = Array(s), k = 0, i = 0; i < il; i++)
          for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
              r[k] = a[j];
      return r;
  };
  Object.defineProperty(exports, "__esModule", { value: true });





  var Line = (function (_super) {
      __extends(Line, _super);
      function Line(config) {
          var _this = _super.call(this, config) || this;
          _this.on('pointsChange.konva tensionChange.konva closedChange.konva bezierChange.konva', function () {
              this._clearCache('tensionPoints');
          });
          return _this;
      }
      Line.prototype._sceneFunc = function (context) {
          var points = this.points(), length = points.length, tension = this.tension(), closed = this.closed(), bezier = this.bezier(), tp, len, n;
          if (!length) {
              return;
          }
          context.beginPath();
          context.moveTo(points[0], points[1]);
          if (tension !== 0 && length > 4) {
              tp = this.getTensionPoints();
              len = tp.length;
              n = closed ? 0 : 4;
              if (!closed) {
                  context.quadraticCurveTo(tp[0], tp[1], tp[2], tp[3]);
              }
              while (n < len - 2) {
                  context.bezierCurveTo(tp[n++], tp[n++], tp[n++], tp[n++], tp[n++], tp[n++]);
              }
              if (!closed) {
                  context.quadraticCurveTo(tp[len - 2], tp[len - 1], points[length - 2], points[length - 1]);
              }
          }
          else if (bezier) {
              n = 2;
              while (n < length) {
                  context.bezierCurveTo(points[n++], points[n++], points[n++], points[n++], points[n++], points[n++]);
              }
          }
          else {
              for (n = 2; n < length; n += 2) {
                  context.lineTo(points[n], points[n + 1]);
              }
          }
          if (closed) {
              context.closePath();
              context.fillStrokeShape(this);
          }
          else {
              context.strokeShape(this);
          }
      };
      Line.prototype.getTensionPoints = function () {
          return this._getCache('tensionPoints', this._getTensionPoints);
      };
      Line.prototype._getTensionPoints = function () {
          if (this.closed()) {
              return this._getTensionPointsClosed();
          }
          else {
              return Util.Util._expandPoints(this.points(), this.tension());
          }
      };
      Line.prototype._getTensionPointsClosed = function () {
          var p = this.points(), len = p.length, tension = this.tension(), firstControlPoints = Util.Util._getControlPoints(p[len - 2], p[len - 1], p[0], p[1], p[2], p[3], tension), lastControlPoints = Util.Util._getControlPoints(p[len - 4], p[len - 3], p[len - 2], p[len - 1], p[0], p[1], tension), middle = Util.Util._expandPoints(p, tension), tp = [firstControlPoints[2], firstControlPoints[3]]
              .concat(middle)
              .concat([
              lastControlPoints[0],
              lastControlPoints[1],
              p[len - 2],
              p[len - 1],
              lastControlPoints[2],
              lastControlPoints[3],
              firstControlPoints[0],
              firstControlPoints[1],
              p[0],
              p[1]
          ]);
          return tp;
      };
      Line.prototype.getWidth = function () {
          return this.getSelfRect().width;
      };
      Line.prototype.getHeight = function () {
          return this.getSelfRect().height;
      };
      Line.prototype.getSelfRect = function () {
          var points = this.points();
          if (points.length < 4) {
              return {
                  x: points[0] || 0,
                  y: points[1] || 0,
                  width: 0,
                  height: 0
              };
          }
          if (this.tension() !== 0) {
              points = __spreadArrays([
                  points[0],
                  points[1]
              ], this._getTensionPoints(), [
                  points[points.length - 2],
                  points[points.length - 2]
              ]);
          }
          else {
              points = this.points();
          }
          var minX = points[0];
          var maxX = points[0];
          var minY = points[1];
          var maxY = points[1];
          var x, y;
          for (var i = 0; i < points.length / 2; i++) {
              x = points[i * 2];
              y = points[i * 2 + 1];
              minX = Math.min(minX, x);
              maxX = Math.max(maxX, x);
              minY = Math.min(minY, y);
              maxY = Math.max(maxY, y);
          }
          return {
              x: Math.round(minX),
              y: Math.round(minY),
              width: Math.round(maxX - minX),
              height: Math.round(maxY - minY)
          };
      };
      return Line;
  }(Shape_1.Shape));
  exports.Line = Line;
  Line.prototype.className = 'Line';
  Line.prototype._attrsAffectingSize = ['points', 'bezier', 'tension'];
  Global._registerNode(Line);
  Factory.Factory.addGetterSetter(Line, 'closed', false);
  Factory.Factory.addGetterSetter(Line, 'bezier', false);
  Factory.Factory.addGetterSetter(Line, 'tension', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Line, 'points', [], Validators.getNumberArrayValidator());
  Util.Collection.mapMethods(Line);
  });

  unwrapExports(Line_1);
  var Line_2 = Line_1.Line;

  var Arrow_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });





  var Arrow = (function (_super) {
      __extends(Arrow, _super);
      function Arrow() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Arrow.prototype._sceneFunc = function (ctx) {
          _super.prototype._sceneFunc.call(this, ctx);
          var PI2 = Math.PI * 2;
          var points = this.points();
          var tp = points;
          var fromTension = this.tension() !== 0 && points.length > 4;
          if (fromTension) {
              tp = this.getTensionPoints();
          }
          var n = points.length;
          var dx, dy;
          if (fromTension) {
              dx = points[n - 2] - (tp[tp.length - 2] + tp[tp.length - 4]) / 2;
              dy = points[n - 1] - (tp[tp.length - 1] + tp[tp.length - 3]) / 2;
          }
          else {
              dx = points[n - 2] - points[n - 4];
              dy = points[n - 1] - points[n - 3];
          }
          var radians = (Math.atan2(dy, dx) + PI2) % PI2;
          var length = this.pointerLength();
          var width = this.pointerWidth();
          ctx.save();
          ctx.beginPath();
          ctx.translate(points[n - 2], points[n - 1]);
          ctx.rotate(radians);
          ctx.moveTo(0, 0);
          ctx.lineTo(-length, width / 2);
          ctx.lineTo(-length, -width / 2);
          ctx.closePath();
          ctx.restore();
          if (this.pointerAtBeginning()) {
              ctx.save();
              ctx.translate(points[0], points[1]);
              if (fromTension) {
                  dx = (tp[0] + tp[2]) / 2 - points[0];
                  dy = (tp[1] + tp[3]) / 2 - points[1];
              }
              else {
                  dx = points[2] - points[0];
                  dy = points[3] - points[1];
              }
              ctx.rotate((Math.atan2(-dy, -dx) + PI2) % PI2);
              ctx.moveTo(0, 0);
              ctx.lineTo(-length, width / 2);
              ctx.lineTo(-length, -width / 2);
              ctx.closePath();
              ctx.restore();
          }
          var isDashEnabled = this.dashEnabled();
          if (isDashEnabled) {
              this.attrs.dashEnabled = false;
              ctx.setLineDash([]);
          }
          ctx.fillStrokeShape(this);
          if (isDashEnabled) {
              this.attrs.dashEnabled = true;
          }
      };
      Arrow.prototype.getSelfRect = function () {
          var lineRect = _super.prototype.getSelfRect.call(this);
          var offset = this.pointerWidth() / 2;
          return {
              x: lineRect.x - offset,
              y: lineRect.y - offset,
              width: lineRect.width + offset * 2,
              height: lineRect.height + offset * 2,
          };
      };
      return Arrow;
  }(Line_1.Line));
  exports.Arrow = Arrow;
  Arrow.prototype.className = 'Arrow';
  Global._registerNode(Arrow);
  Factory.Factory.addGetterSetter(Arrow, 'pointerLength', 10, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Arrow, 'pointerWidth', 10, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Arrow, 'pointerAtBeginning', false);
  Util.Collection.mapMethods(Arrow);
  });

  unwrapExports(Arrow_1);
  var Arrow_2 = Arrow_1.Arrow;

  var Circle_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });





  var Circle = (function (_super) {
      __extends(Circle, _super);
      function Circle() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Circle.prototype._sceneFunc = function (context) {
          context.beginPath();
          context.arc(0, 0, this.radius(), 0, Math.PI * 2, false);
          context.closePath();
          context.fillStrokeShape(this);
      };
      Circle.prototype.getWidth = function () {
          return this.radius() * 2;
      };
      Circle.prototype.getHeight = function () {
          return this.radius() * 2;
      };
      Circle.prototype.setWidth = function (width) {
          if (this.radius() !== width / 2) {
              this.radius(width / 2);
          }
      };
      Circle.prototype.setHeight = function (height) {
          if (this.radius() !== height / 2) {
              this.radius(height / 2);
          }
      };
      return Circle;
  }(Shape_1.Shape));
  exports.Circle = Circle;
  Circle.prototype._centroid = true;
  Circle.prototype.className = 'Circle';
  Circle.prototype._attrsAffectingSize = ['radius'];
  Global._registerNode(Circle);
  Factory.Factory.addGetterSetter(Circle, 'radius', 0, Validators.getNumberValidator());
  Util.Collection.mapMethods(Circle);
  });

  unwrapExports(Circle_1);
  var Circle_2 = Circle_1.Circle;

  var Ellipse_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });





  var Ellipse = (function (_super) {
      __extends(Ellipse, _super);
      function Ellipse() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Ellipse.prototype._sceneFunc = function (context) {
          var rx = this.radiusX(), ry = this.radiusY();
          context.beginPath();
          context.save();
          if (rx !== ry) {
              context.scale(1, ry / rx);
          }
          context.arc(0, 0, rx, 0, Math.PI * 2, false);
          context.restore();
          context.closePath();
          context.fillStrokeShape(this);
      };
      Ellipse.prototype.getWidth = function () {
          return this.radiusX() * 2;
      };
      Ellipse.prototype.getHeight = function () {
          return this.radiusY() * 2;
      };
      Ellipse.prototype.setWidth = function (width) {
          this.radiusX(width / 2);
      };
      Ellipse.prototype.setHeight = function (height) {
          this.radiusY(height / 2);
      };
      return Ellipse;
  }(Shape_1.Shape));
  exports.Ellipse = Ellipse;
  Ellipse.prototype.className = 'Ellipse';
  Ellipse.prototype._centroid = true;
  Ellipse.prototype._attrsAffectingSize = ['radiusX', 'radiusY'];
  Global._registerNode(Ellipse);
  Factory.Factory.addComponentsGetterSetter(Ellipse, 'radius', ['x', 'y']);
  Factory.Factory.addGetterSetter(Ellipse, 'radiusX', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Ellipse, 'radiusY', 0, Validators.getNumberValidator());
  Util.Collection.mapMethods(Ellipse);
  });

  unwrapExports(Ellipse_1);
  var Ellipse_2 = Ellipse_1.Ellipse;

  var Image_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });





  var Image = (function (_super) {
      __extends(Image, _super);
      function Image() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Image.prototype._useBufferCanvas = function () {
          return !!((this.hasShadow() || this.getAbsoluteOpacity() !== 1) &&
              this.hasStroke() &&
              this.getStage());
      };
      Image.prototype._sceneFunc = function (context) {
          var width = this.width(), height = this.height(), image = this.image(), cropWidth, cropHeight, params;
          if (image) {
              cropWidth = this.cropWidth();
              cropHeight = this.cropHeight();
              if (cropWidth && cropHeight) {
                  params = [
                      image,
                      this.cropX(),
                      this.cropY(),
                      cropWidth,
                      cropHeight,
                      0,
                      0,
                      width,
                      height
                  ];
              }
              else {
                  params = [image, 0, 0, width, height];
              }
          }
          if (this.hasFill() || this.hasStroke()) {
              context.beginPath();
              context.rect(0, 0, width, height);
              context.closePath();
              context.fillStrokeShape(this);
          }
          if (image) {
              context.drawImage.apply(context, params);
          }
      };
      Image.prototype._hitFunc = function (context) {
          var width = this.width(), height = this.height();
          context.beginPath();
          context.rect(0, 0, width, height);
          context.closePath();
          context.fillStrokeShape(this);
      };
      Image.prototype.getWidth = function () {
          var _a;
          var image = this.image();
          return _a = this.attrs.width, (_a !== null && _a !== void 0 ? _a : (image ? image.width : 0));
      };
      Image.prototype.getHeight = function () {
          var _a;
          var image = this.image();
          return _a = this.attrs.height, (_a !== null && _a !== void 0 ? _a : (image ? image.height : 0));
      };
      Image.fromURL = function (url, callback) {
          var img = Util.Util.createImageElement();
          img.onload = function () {
              var image = new Image({
                  image: img
              });
              callback(image);
          };
          img.crossOrigin = 'Anonymous';
          img.src = url;
      };
      return Image;
  }(Shape_1.Shape));
  exports.Image = Image;
  Image.prototype.className = 'Image';
  Global._registerNode(Image);
  Factory.Factory.addGetterSetter(Image, 'image');
  Factory.Factory.addComponentsGetterSetter(Image, 'crop', ['x', 'y', 'width', 'height']);
  Factory.Factory.addGetterSetter(Image, 'cropX', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Image, 'cropY', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Image, 'cropWidth', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Image, 'cropHeight', 0, Validators.getNumberValidator());
  Util.Collection.mapMethods(Image);
  });

  unwrapExports(Image_1);
  var Image_2 = Image_1.Image;

  var Label_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });






  var ATTR_CHANGE_LIST = [
      'fontFamily',
      'fontSize',
      'fontStyle',
      'padding',
      'lineHeight',
      'text',
      'width'
  ], CHANGE_KONVA = 'Change.konva', NONE = 'none', UP = 'up', RIGHT = 'right', DOWN = 'down', LEFT = 'left', attrChangeListLen = ATTR_CHANGE_LIST.length;
  var Label = (function (_super) {
      __extends(Label, _super);
      function Label(config) {
          var _this = _super.call(this, config) || this;
          _this.on('add.konva', function (evt) {
              this._addListeners(evt.child);
              this._sync();
          });
          return _this;
      }
      Label.prototype.getText = function () {
          return this.find('Text')[0];
      };
      Label.prototype.getTag = function () {
          return this.find('Tag')[0];
      };
      Label.prototype._addListeners = function (text) {
          var that = this, n;
          var func = function () {
              that._sync();
          };
          for (n = 0; n < attrChangeListLen; n++) {
              text.on(ATTR_CHANGE_LIST[n] + CHANGE_KONVA, func);
          }
      };
      Label.prototype.getWidth = function () {
          return this.getText().width();
      };
      Label.prototype.getHeight = function () {
          return this.getText().height();
      };
      Label.prototype._sync = function () {
          var text = this.getText(), tag = this.getTag(), width, height, pointerDirection, pointerWidth, x, y, pointerHeight;
          if (text && tag) {
              width = text.width();
              height = text.height();
              pointerDirection = tag.pointerDirection();
              pointerWidth = tag.pointerWidth();
              pointerHeight = tag.pointerHeight();
              x = 0;
              y = 0;
              switch (pointerDirection) {
                  case UP:
                      x = width / 2;
                      y = -1 * pointerHeight;
                      break;
                  case RIGHT:
                      x = width + pointerWidth;
                      y = height / 2;
                      break;
                  case DOWN:
                      x = width / 2;
                      y = height + pointerHeight;
                      break;
                  case LEFT:
                      x = -1 * pointerWidth;
                      y = height / 2;
                      break;
              }
              tag.setAttrs({
                  x: -1 * x,
                  y: -1 * y,
                  width: width,
                  height: height
              });
              text.setAttrs({
                  x: -1 * x,
                  y: -1 * y
              });
          }
      };
      return Label;
  }(Group_1.Group));
  exports.Label = Label;
  Label.prototype.className = 'Label';
  Global._registerNode(Label);
  Util.Collection.mapMethods(Label);
  var Tag = (function (_super) {
      __extends(Tag, _super);
      function Tag() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Tag.prototype._sceneFunc = function (context) {
          var width = this.width(), height = this.height(), pointerDirection = this.pointerDirection(), pointerWidth = this.pointerWidth(), pointerHeight = this.pointerHeight(), cornerRadius = Math.min(this.cornerRadius(), width / 2, height / 2);
          context.beginPath();
          if (!cornerRadius) {
              context.moveTo(0, 0);
          }
          else {
              context.moveTo(cornerRadius, 0);
          }
          if (pointerDirection === UP) {
              context.lineTo((width - pointerWidth) / 2, 0);
              context.lineTo(width / 2, -1 * pointerHeight);
              context.lineTo((width + pointerWidth) / 2, 0);
          }
          if (!cornerRadius) {
              context.lineTo(width, 0);
          }
          else {
              context.lineTo(width - cornerRadius, 0);
              context.arc(width - cornerRadius, cornerRadius, cornerRadius, (Math.PI * 3) / 2, 0, false);
          }
          if (pointerDirection === RIGHT) {
              context.lineTo(width, (height - pointerHeight) / 2);
              context.lineTo(width + pointerWidth, height / 2);
              context.lineTo(width, (height + pointerHeight) / 2);
          }
          if (!cornerRadius) {
              context.lineTo(width, height);
          }
          else {
              context.lineTo(width, height - cornerRadius);
              context.arc(width - cornerRadius, height - cornerRadius, cornerRadius, 0, Math.PI / 2, false);
          }
          if (pointerDirection === DOWN) {
              context.lineTo((width + pointerWidth) / 2, height);
              context.lineTo(width / 2, height + pointerHeight);
              context.lineTo((width - pointerWidth) / 2, height);
          }
          if (!cornerRadius) {
              context.lineTo(0, height);
          }
          else {
              context.lineTo(cornerRadius, height);
              context.arc(cornerRadius, height - cornerRadius, cornerRadius, Math.PI / 2, Math.PI, false);
          }
          if (pointerDirection === LEFT) {
              context.lineTo(0, (height + pointerHeight) / 2);
              context.lineTo(-1 * pointerWidth, height / 2);
              context.lineTo(0, (height - pointerHeight) / 2);
          }
          if (cornerRadius) {
              context.lineTo(0, cornerRadius);
              context.arc(cornerRadius, cornerRadius, cornerRadius, Math.PI, (Math.PI * 3) / 2, false);
          }
          context.closePath();
          context.fillStrokeShape(this);
      };
      Tag.prototype.getSelfRect = function () {
          var x = 0, y = 0, pointerWidth = this.pointerWidth(), pointerHeight = this.pointerHeight(), direction = this.pointerDirection(), width = this.width(), height = this.height();
          if (direction === UP) {
              y -= pointerHeight;
              height += pointerHeight;
          }
          else if (direction === DOWN) {
              height += pointerHeight;
          }
          else if (direction === LEFT) {
              x -= pointerWidth * 1.5;
              width += pointerWidth;
          }
          else if (direction === RIGHT) {
              width += pointerWidth * 1.5;
          }
          return {
              x: x,
              y: y,
              width: width,
              height: height
          };
      };
      return Tag;
  }(Shape_1.Shape));
  exports.Tag = Tag;
  Tag.prototype.className = 'Tag';
  Global._registerNode(Tag);
  Factory.Factory.addGetterSetter(Tag, 'pointerDirection', NONE);
  Factory.Factory.addGetterSetter(Tag, 'pointerWidth', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Tag, 'pointerHeight', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Tag, 'cornerRadius', 0, Validators.getNumberValidator());
  Util.Collection.mapMethods(Tag);
  });

  unwrapExports(Label_1);
  var Label_2 = Label_1.Label;
  var Label_3 = Label_1.Tag;

  var Path_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });




  var Path = (function (_super) {
      __extends(Path, _super);
      function Path(config) {
          var _this = _super.call(this, config) || this;
          _this.dataArray = [];
          _this.pathLength = 0;
          _this.dataArray = Path.parsePathData(_this.data());
          _this.pathLength = 0;
          for (var i = 0; i < _this.dataArray.length; ++i) {
              _this.pathLength += _this.dataArray[i].pathLength;
          }
          _this.on('dataChange.konva', function () {
              this.dataArray = Path.parsePathData(this.data());
              this.pathLength = 0;
              for (var i = 0; i < this.dataArray.length; ++i) {
                  this.pathLength += this.dataArray[i].pathLength;
              }
          });
          return _this;
      }
      Path.prototype._sceneFunc = function (context) {
          var ca = this.dataArray;
          context.beginPath();
          for (var n = 0; n < ca.length; n++) {
              var c = ca[n].command;
              var p = ca[n].points;
              switch (c) {
                  case 'L':
                      context.lineTo(p[0], p[1]);
                      break;
                  case 'M':
                      context.moveTo(p[0], p[1]);
                      break;
                  case 'C':
                      context.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]);
                      break;
                  case 'Q':
                      context.quadraticCurveTo(p[0], p[1], p[2], p[3]);
                      break;
                  case 'A':
                      var cx = p[0], cy = p[1], rx = p[2], ry = p[3], theta = p[4], dTheta = p[5], psi = p[6], fs = p[7];
                      var r = rx > ry ? rx : ry;
                      var scaleX = rx > ry ? 1 : rx / ry;
                      var scaleY = rx > ry ? ry / rx : 1;
                      context.translate(cx, cy);
                      context.rotate(psi);
                      context.scale(scaleX, scaleY);
                      context.arc(0, 0, r, theta, theta + dTheta, 1 - fs);
                      context.scale(1 / scaleX, 1 / scaleY);
                      context.rotate(-psi);
                      context.translate(-cx, -cy);
                      break;
                  case 'z':
                      context.closePath();
                      break;
              }
          }
          context.fillStrokeShape(this);
      };
      Path.prototype.getSelfRect = function () {
          var points = [];
          this.dataArray.forEach(function (data) {
              if (data.command === 'A') {
                  points = points.concat([
                      data.points[0] - data.points[2],
                      data.points[1] - data.points[3],
                      data.points[0] + data.points[2],
                      data.points[1] + data.points[3]
                  ]);
              }
              else {
                  points = points.concat(data.points);
              }
          });
          var minX = points[0];
          var maxX = points[0];
          var minY = points[1];
          var maxY = points[1];
          var x, y;
          for (var i = 0; i < points.length / 2; i++) {
              x = points[i * 2];
              y = points[i * 2 + 1];
              if (!isNaN(x)) {
                  minX = Math.min(minX, x);
                  maxX = Math.max(maxX, x);
              }
              if (!isNaN(y)) {
                  minY = Math.min(minY, y);
                  maxY = Math.max(maxY, y);
              }
          }
          return {
              x: Math.round(minX),
              y: Math.round(minY),
              width: Math.round(maxX - minX),
              height: Math.round(maxY - minY)
          };
      };
      Path.prototype.getLength = function () {
          return this.pathLength;
      };
      Path.prototype.getPointAtLength = function (length) {
          var point, i = 0, ii = this.dataArray.length;
          if (!ii) {
              return null;
          }
          while (i < ii && length > this.dataArray[i].pathLength) {
              length -= this.dataArray[i].pathLength;
              ++i;
          }
          if (i === ii) {
              point = this.dataArray[i - 1].points.slice(-2);
              return {
                  x: point[0],
                  y: point[1]
              };
          }
          if (length < 0.01) {
              point = this.dataArray[i].points.slice(0, 2);
              return {
                  x: point[0],
                  y: point[1]
              };
          }
          var cp = this.dataArray[i];
          var p = cp.points;
          switch (cp.command) {
              case 'L':
                  return Path.getPointOnLine(length, cp.start.x, cp.start.y, p[0], p[1]);
              case 'C':
                  return Path.getPointOnCubicBezier(length / cp.pathLength, cp.start.x, cp.start.y, p[0], p[1], p[2], p[3], p[4], p[5]);
              case 'Q':
                  return Path.getPointOnQuadraticBezier(length / cp.pathLength, cp.start.x, cp.start.y, p[0], p[1], p[2], p[3]);
              case 'A':
                  var cx = p[0], cy = p[1], rx = p[2], ry = p[3], theta = p[4], dTheta = p[5], psi = p[6];
                  theta += (dTheta * length) / cp.pathLength;
                  return Path.getPointOnEllipticalArc(cx, cy, rx, ry, theta, psi);
          }
          return null;
      };
      Path.getLineLength = function (x1, y1, x2, y2) {
          return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
      };
      Path.getPointOnLine = function (dist, P1x, P1y, P2x, P2y, fromX, fromY) {
          if (fromX === undefined) {
              fromX = P1x;
          }
          if (fromY === undefined) {
              fromY = P1y;
          }
          var m = (P2y - P1y) / (P2x - P1x + 0.00000001);
          var run = Math.sqrt((dist * dist) / (1 + m * m));
          if (P2x < P1x) {
              run *= -1;
          }
          var rise = m * run;
          var pt;
          if (P2x === P1x) {
              pt = {
                  x: fromX,
                  y: fromY + rise
              };
          }
          else if ((fromY - P1y) / (fromX - P1x + 0.00000001) === m) {
              pt = {
                  x: fromX + run,
                  y: fromY + rise
              };
          }
          else {
              var ix, iy;
              var len = this.getLineLength(P1x, P1y, P2x, P2y);
              if (len < 0.00000001) {
                  return undefined;
              }
              var u = (fromX - P1x) * (P2x - P1x) + (fromY - P1y) * (P2y - P1y);
              u = u / (len * len);
              ix = P1x + u * (P2x - P1x);
              iy = P1y + u * (P2y - P1y);
              var pRise = this.getLineLength(fromX, fromY, ix, iy);
              var pRun = Math.sqrt(dist * dist - pRise * pRise);
              run = Math.sqrt((pRun * pRun) / (1 + m * m));
              if (P2x < P1x) {
                  run *= -1;
              }
              rise = m * run;
              pt = {
                  x: ix + run,
                  y: iy + rise
              };
          }
          return pt;
      };
      Path.getPointOnCubicBezier = function (pct, P1x, P1y, P2x, P2y, P3x, P3y, P4x, P4y) {
          function CB1(t) {
              return t * t * t;
          }
          function CB2(t) {
              return 3 * t * t * (1 - t);
          }
          function CB3(t) {
              return 3 * t * (1 - t) * (1 - t);
          }
          function CB4(t) {
              return (1 - t) * (1 - t) * (1 - t);
          }
          var x = P4x * CB1(pct) + P3x * CB2(pct) + P2x * CB3(pct) + P1x * CB4(pct);
          var y = P4y * CB1(pct) + P3y * CB2(pct) + P2y * CB3(pct) + P1y * CB4(pct);
          return {
              x: x,
              y: y
          };
      };
      Path.getPointOnQuadraticBezier = function (pct, P1x, P1y, P2x, P2y, P3x, P3y) {
          function QB1(t) {
              return t * t;
          }
          function QB2(t) {
              return 2 * t * (1 - t);
          }
          function QB3(t) {
              return (1 - t) * (1 - t);
          }
          var x = P3x * QB1(pct) + P2x * QB2(pct) + P1x * QB3(pct);
          var y = P3y * QB1(pct) + P2y * QB2(pct) + P1y * QB3(pct);
          return {
              x: x,
              y: y
          };
      };
      Path.getPointOnEllipticalArc = function (cx, cy, rx, ry, theta, psi) {
          var cosPsi = Math.cos(psi), sinPsi = Math.sin(psi);
          var pt = {
              x: rx * Math.cos(theta),
              y: ry * Math.sin(theta)
          };
          return {
              x: cx + (pt.x * cosPsi - pt.y * sinPsi),
              y: cy + (pt.x * sinPsi + pt.y * cosPsi)
          };
      };
      Path.parsePathData = function (data) {
          if (!data) {
              return [];
          }
          var cs = data;
          var cc = [
              'm',
              'M',
              'l',
              'L',
              'v',
              'V',
              'h',
              'H',
              'z',
              'Z',
              'c',
              'C',
              'q',
              'Q',
              't',
              'T',
              's',
              'S',
              'a',
              'A'
          ];
          cs = cs.replace(new RegExp(' ', 'g'), ',');
          for (var n = 0; n < cc.length; n++) {
              cs = cs.replace(new RegExp(cc[n], 'g'), '|' + cc[n]);
          }
          var arr = cs.split('|');
          var ca = [];
          var coords = [];
          var cpx = 0;
          var cpy = 0;
          var re = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:e[-+]?\d+)?)/gi;
          var match;
          for (n = 1; n < arr.length; n++) {
              var str = arr[n];
              var c = str.charAt(0);
              str = str.slice(1);
              coords.length = 0;
              while ((match = re.exec(str))) {
                  coords.push(match[0]);
              }
              var p = [];
              for (var j = 0, jlen = coords.length; j < jlen; j++) {
                  var parsed = parseFloat(coords[j]);
                  if (!isNaN(parsed)) {
                      p.push(parsed);
                  }
                  else {
                      p.push(0);
                  }
              }
              while (p.length > 0) {
                  if (isNaN(p[0])) {
                      break;
                  }
                  var cmd = null;
                  var points = [];
                  var startX = cpx, startY = cpy;
                  var prevCmd, ctlPtx, ctlPty;
                  var rx, ry, psi, fa, fs, x1, y1;
                  switch (c) {
                      case 'l':
                          cpx += p.shift();
                          cpy += p.shift();
                          cmd = 'L';
                          points.push(cpx, cpy);
                          break;
                      case 'L':
                          cpx = p.shift();
                          cpy = p.shift();
                          points.push(cpx, cpy);
                          break;
                      case 'm':
                          var dx = p.shift();
                          var dy = p.shift();
                          cpx += dx;
                          cpy += dy;
                          cmd = 'M';
                          if (ca.length > 2 && ca[ca.length - 1].command === 'z') {
                              for (var idx = ca.length - 2; idx >= 0; idx--) {
                                  if (ca[idx].command === 'M') {
                                      cpx = ca[idx].points[0] + dx;
                                      cpy = ca[idx].points[1] + dy;
                                      break;
                                  }
                              }
                          }
                          points.push(cpx, cpy);
                          c = 'l';
                          break;
                      case 'M':
                          cpx = p.shift();
                          cpy = p.shift();
                          cmd = 'M';
                          points.push(cpx, cpy);
                          c = 'L';
                          break;
                      case 'h':
                          cpx += p.shift();
                          cmd = 'L';
                          points.push(cpx, cpy);
                          break;
                      case 'H':
                          cpx = p.shift();
                          cmd = 'L';
                          points.push(cpx, cpy);
                          break;
                      case 'v':
                          cpy += p.shift();
                          cmd = 'L';
                          points.push(cpx, cpy);
                          break;
                      case 'V':
                          cpy = p.shift();
                          cmd = 'L';
                          points.push(cpx, cpy);
                          break;
                      case 'C':
                          points.push(p.shift(), p.shift(), p.shift(), p.shift());
                          cpx = p.shift();
                          cpy = p.shift();
                          points.push(cpx, cpy);
                          break;
                      case 'c':
                          points.push(cpx + p.shift(), cpy + p.shift(), cpx + p.shift(), cpy + p.shift());
                          cpx += p.shift();
                          cpy += p.shift();
                          cmd = 'C';
                          points.push(cpx, cpy);
                          break;
                      case 'S':
                          ctlPtx = cpx;
                          ctlPty = cpy;
                          prevCmd = ca[ca.length - 1];
                          if (prevCmd.command === 'C') {
                              ctlPtx = cpx + (cpx - prevCmd.points[2]);
                              ctlPty = cpy + (cpy - prevCmd.points[3]);
                          }
                          points.push(ctlPtx, ctlPty, p.shift(), p.shift());
                          cpx = p.shift();
                          cpy = p.shift();
                          cmd = 'C';
                          points.push(cpx, cpy);
                          break;
                      case 's':
                          ctlPtx = cpx;
                          ctlPty = cpy;
                          prevCmd = ca[ca.length - 1];
                          if (prevCmd.command === 'C') {
                              ctlPtx = cpx + (cpx - prevCmd.points[2]);
                              ctlPty = cpy + (cpy - prevCmd.points[3]);
                          }
                          points.push(ctlPtx, ctlPty, cpx + p.shift(), cpy + p.shift());
                          cpx += p.shift();
                          cpy += p.shift();
                          cmd = 'C';
                          points.push(cpx, cpy);
                          break;
                      case 'Q':
                          points.push(p.shift(), p.shift());
                          cpx = p.shift();
                          cpy = p.shift();
                          points.push(cpx, cpy);
                          break;
                      case 'q':
                          points.push(cpx + p.shift(), cpy + p.shift());
                          cpx += p.shift();
                          cpy += p.shift();
                          cmd = 'Q';
                          points.push(cpx, cpy);
                          break;
                      case 'T':
                          ctlPtx = cpx;
                          ctlPty = cpy;
                          prevCmd = ca[ca.length - 1];
                          if (prevCmd.command === 'Q') {
                              ctlPtx = cpx + (cpx - prevCmd.points[0]);
                              ctlPty = cpy + (cpy - prevCmd.points[1]);
                          }
                          cpx = p.shift();
                          cpy = p.shift();
                          cmd = 'Q';
                          points.push(ctlPtx, ctlPty, cpx, cpy);
                          break;
                      case 't':
                          ctlPtx = cpx;
                          ctlPty = cpy;
                          prevCmd = ca[ca.length - 1];
                          if (prevCmd.command === 'Q') {
                              ctlPtx = cpx + (cpx - prevCmd.points[0]);
                              ctlPty = cpy + (cpy - prevCmd.points[1]);
                          }
                          cpx += p.shift();
                          cpy += p.shift();
                          cmd = 'Q';
                          points.push(ctlPtx, ctlPty, cpx, cpy);
                          break;
                      case 'A':
                          rx = p.shift();
                          ry = p.shift();
                          psi = p.shift();
                          fa = p.shift();
                          fs = p.shift();
                          x1 = cpx;
                          y1 = cpy;
                          cpx = p.shift();
                          cpy = p.shift();
                          cmd = 'A';
                          points = this.convertEndpointToCenterParameterization(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
                          break;
                      case 'a':
                          rx = p.shift();
                          ry = p.shift();
                          psi = p.shift();
                          fa = p.shift();
                          fs = p.shift();
                          x1 = cpx;
                          y1 = cpy;
                          cpx += p.shift();
                          cpy += p.shift();
                          cmd = 'A';
                          points = this.convertEndpointToCenterParameterization(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
                          break;
                  }
                  ca.push({
                      command: cmd || c,
                      points: points,
                      start: {
                          x: startX,
                          y: startY
                      },
                      pathLength: this.calcLength(startX, startY, cmd || c, points)
                  });
              }
              if (c === 'z' || c === 'Z') {
                  ca.push({
                      command: 'z',
                      points: [],
                      start: undefined,
                      pathLength: 0
                  });
              }
          }
          return ca;
      };
      Path.calcLength = function (x, y, cmd, points) {
          var len, p1, p2, t;
          var path = Path;
          switch (cmd) {
              case 'L':
                  return path.getLineLength(x, y, points[0], points[1]);
              case 'C':
                  len = 0.0;
                  p1 = path.getPointOnCubicBezier(0, x, y, points[0], points[1], points[2], points[3], points[4], points[5]);
                  for (t = 0.01; t <= 1; t += 0.01) {
                      p2 = path.getPointOnCubicBezier(t, x, y, points[0], points[1], points[2], points[3], points[4], points[5]);
                      len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                      p1 = p2;
                  }
                  return len;
              case 'Q':
                  len = 0.0;
                  p1 = path.getPointOnQuadraticBezier(0, x, y, points[0], points[1], points[2], points[3]);
                  for (t = 0.01; t <= 1; t += 0.01) {
                      p2 = path.getPointOnQuadraticBezier(t, x, y, points[0], points[1], points[2], points[3]);
                      len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                      p1 = p2;
                  }
                  return len;
              case 'A':
                  len = 0.0;
                  var start = points[4];
                  var dTheta = points[5];
                  var end = points[4] + dTheta;
                  var inc = Math.PI / 180.0;
                  if (Math.abs(start - end) < inc) {
                      inc = Math.abs(start - end);
                  }
                  p1 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], start, 0);
                  if (dTheta < 0) {
                      for (t = start - inc; t > end; t -= inc) {
                          p2 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], t, 0);
                          len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                          p1 = p2;
                      }
                  }
                  else {
                      for (t = start + inc; t < end; t += inc) {
                          p2 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], t, 0);
                          len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                          p1 = p2;
                      }
                  }
                  p2 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], end, 0);
                  len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                  return len;
          }
          return 0;
      };
      Path.convertEndpointToCenterParameterization = function (x1, y1, x2, y2, fa, fs, rx, ry, psiDeg) {
          var psi = psiDeg * (Math.PI / 180.0);
          var xp = (Math.cos(psi) * (x1 - x2)) / 2.0 + (Math.sin(psi) * (y1 - y2)) / 2.0;
          var yp = (-1 * Math.sin(psi) * (x1 - x2)) / 2.0 +
              (Math.cos(psi) * (y1 - y2)) / 2.0;
          var lambda = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry);
          if (lambda > 1) {
              rx *= Math.sqrt(lambda);
              ry *= Math.sqrt(lambda);
          }
          var f = Math.sqrt((rx * rx * (ry * ry) - rx * rx * (yp * yp) - ry * ry * (xp * xp)) /
              (rx * rx * (yp * yp) + ry * ry * (xp * xp)));
          if (fa === fs) {
              f *= -1;
          }
          if (isNaN(f)) {
              f = 0;
          }
          var cxp = (f * rx * yp) / ry;
          var cyp = (f * -ry * xp) / rx;
          var cx = (x1 + x2) / 2.0 + Math.cos(psi) * cxp - Math.sin(psi) * cyp;
          var cy = (y1 + y2) / 2.0 + Math.sin(psi) * cxp + Math.cos(psi) * cyp;
          var vMag = function (v) {
              return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
          };
          var vRatio = function (u, v) {
              return (u[0] * v[0] + u[1] * v[1]) / (vMag(u) * vMag(v));
          };
          var vAngle = function (u, v) {
              return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(vRatio(u, v));
          };
          var theta = vAngle([1, 0], [(xp - cxp) / rx, (yp - cyp) / ry]);
          var u = [(xp - cxp) / rx, (yp - cyp) / ry];
          var v = [(-1 * xp - cxp) / rx, (-1 * yp - cyp) / ry];
          var dTheta = vAngle(u, v);
          if (vRatio(u, v) <= -1) {
              dTheta = Math.PI;
          }
          if (vRatio(u, v) >= 1) {
              dTheta = 0;
          }
          if (fs === 0 && dTheta > 0) {
              dTheta = dTheta - 2 * Math.PI;
          }
          if (fs === 1 && dTheta < 0) {
              dTheta = dTheta + 2 * Math.PI;
          }
          return [cx, cy, rx, ry, theta, dTheta, psi, fs];
      };
      return Path;
  }(Shape_1.Shape));
  exports.Path = Path;
  Path.prototype.className = 'Path';
  Path.prototype._attrsAffectingSize = ['data'];
  Global._registerNode(Path);
  Factory.Factory.addGetterSetter(Path, 'data');
  Util.Collection.mapMethods(Path);
  });

  unwrapExports(Path_1);
  var Path_2 = Path_1.Path;

  var Rect_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });




  var Rect = (function (_super) {
      __extends(Rect, _super);
      function Rect() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Rect.prototype._sceneFunc = function (context) {
          var cornerRadius = this.cornerRadius(), width = this.width(), height = this.height();
          context.beginPath();
          if (!cornerRadius) {
              context.rect(0, 0, width, height);
          }
          else {
              var topLeft = 0;
              var topRight = 0;
              var bottomLeft = 0;
              var bottomRight = 0;
              if (typeof cornerRadius === 'number') {
                  topLeft = topRight = bottomLeft = bottomRight = Math.min(cornerRadius, width / 2, height / 2);
              }
              else {
                  topLeft = Math.min(cornerRadius[0], width / 2, height / 2);
                  topRight = Math.min(cornerRadius[1], width / 2, height / 2);
                  bottomRight = Math.min(cornerRadius[2], width / 2, height / 2);
                  bottomLeft = Math.min(cornerRadius[3], width / 2, height / 2);
              }
              context.moveTo(topLeft, 0);
              context.lineTo(width - topRight, 0);
              context.arc(width - topRight, topRight, topRight, (Math.PI * 3) / 2, 0, false);
              context.lineTo(width, height - bottomRight);
              context.arc(width - bottomRight, height - bottomRight, bottomRight, 0, Math.PI / 2, false);
              context.lineTo(bottomLeft, height);
              context.arc(bottomLeft, height - bottomLeft, bottomLeft, Math.PI / 2, Math.PI, false);
              context.lineTo(0, topLeft);
              context.arc(topLeft, topLeft, topLeft, Math.PI, (Math.PI * 3) / 2, false);
          }
          context.closePath();
          context.fillStrokeShape(this);
      };
      return Rect;
  }(Shape_1.Shape));
  exports.Rect = Rect;
  Rect.prototype.className = 'Rect';
  Global._registerNode(Rect);
  Factory.Factory.addGetterSetter(Rect, 'cornerRadius', 0);
  Util.Collection.mapMethods(Rect);
  });

  unwrapExports(Rect_1);
  var Rect_2 = Rect_1.Rect;

  var RegularPolygon_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });





  var RegularPolygon = (function (_super) {
      __extends(RegularPolygon, _super);
      function RegularPolygon() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      RegularPolygon.prototype._sceneFunc = function (context) {
          var sides = this.sides(), radius = this.radius(), n, x, y;
          context.beginPath();
          context.moveTo(0, 0 - radius);
          for (n = 1; n < sides; n++) {
              x = radius * Math.sin((n * 2 * Math.PI) / sides);
              y = -1 * radius * Math.cos((n * 2 * Math.PI) / sides);
              context.lineTo(x, y);
          }
          context.closePath();
          context.fillStrokeShape(this);
      };
      RegularPolygon.prototype.getWidth = function () {
          return this.radius() * 2;
      };
      RegularPolygon.prototype.getHeight = function () {
          return this.radius() * 2;
      };
      RegularPolygon.prototype.setWidth = function (width) {
          this.radius(width / 2);
      };
      RegularPolygon.prototype.setHeight = function (height) {
          this.radius(height / 2);
      };
      return RegularPolygon;
  }(Shape_1.Shape));
  exports.RegularPolygon = RegularPolygon;
  RegularPolygon.prototype.className = 'RegularPolygon';
  RegularPolygon.prototype._centroid = true;
  RegularPolygon.prototype._attrsAffectingSize = ['radius'];
  Global._registerNode(RegularPolygon);
  Factory.Factory.addGetterSetter(RegularPolygon, 'radius', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(RegularPolygon, 'sides', 0, Validators.getNumberValidator());
  Util.Collection.mapMethods(RegularPolygon);
  });

  unwrapExports(RegularPolygon_1);
  var RegularPolygon_2 = RegularPolygon_1.RegularPolygon;

  var Ring_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });





  var PIx2 = Math.PI * 2;
  var Ring = (function (_super) {
      __extends(Ring, _super);
      function Ring() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Ring.prototype._sceneFunc = function (context) {
          context.beginPath();
          context.arc(0, 0, this.innerRadius(), 0, PIx2, false);
          context.moveTo(this.outerRadius(), 0);
          context.arc(0, 0, this.outerRadius(), PIx2, 0, true);
          context.closePath();
          context.fillStrokeShape(this);
      };
      Ring.prototype.getWidth = function () {
          return this.outerRadius() * 2;
      };
      Ring.prototype.getHeight = function () {
          return this.outerRadius() * 2;
      };
      Ring.prototype.setWidth = function (width) {
          this.outerRadius(width / 2);
      };
      Ring.prototype.setHeight = function (height) {
          this.outerRadius(height / 2);
      };
      return Ring;
  }(Shape_1.Shape));
  exports.Ring = Ring;
  Ring.prototype.className = 'Ring';
  Ring.prototype._centroid = true;
  Ring.prototype._attrsAffectingSize = ['innerRadius', 'outerRadius'];
  Global._registerNode(Ring);
  Factory.Factory.addGetterSetter(Ring, 'innerRadius', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Ring, 'outerRadius', 0, Validators.getNumberValidator());
  Util.Collection.mapMethods(Ring);
  });

  unwrapExports(Ring_1);
  var Ring_2 = Ring_1.Ring;

  var Sprite_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });






  var Sprite = (function (_super) {
      __extends(Sprite, _super);
      function Sprite(config) {
          var _this = _super.call(this, config) || this;
          _this._updated = true;
          _this.anim = new Animation_1.Animation(function () {
              var updated = _this._updated;
              _this._updated = false;
              return updated;
          });
          _this.on('animationChange.konva', function () {
              this.frameIndex(0);
          });
          _this.on('frameIndexChange.konva', function () {
              this._updated = true;
          });
          _this.on('frameRateChange.konva', function () {
              if (!this.anim.isRunning()) {
                  return;
              }
              clearInterval(this.interval);
              this._setInterval();
          });
          return _this;
      }
      Sprite.prototype._sceneFunc = function (context) {
          var anim = this.animation(), index = this.frameIndex(), ix4 = index * 4, set = this.animations()[anim], offsets = this.frameOffsets(), x = set[ix4 + 0], y = set[ix4 + 1], width = set[ix4 + 2], height = set[ix4 + 3], image = this.image();
          if (this.hasFill() || this.hasStroke()) {
              context.beginPath();
              context.rect(0, 0, width, height);
              context.closePath();
              context.fillStrokeShape(this);
          }
          if (image) {
              if (offsets) {
                  var offset = offsets[anim], ix2 = index * 2;
                  context.drawImage(image, x, y, width, height, offset[ix2 + 0], offset[ix2 + 1], width, height);
              }
              else {
                  context.drawImage(image, x, y, width, height, 0, 0, width, height);
              }
          }
      };
      Sprite.prototype._hitFunc = function (context) {
          var anim = this.animation(), index = this.frameIndex(), ix4 = index * 4, set = this.animations()[anim], offsets = this.frameOffsets(), width = set[ix4 + 2], height = set[ix4 + 3];
          context.beginPath();
          if (offsets) {
              var offset = offsets[anim];
              var ix2 = index * 2;
              context.rect(offset[ix2 + 0], offset[ix2 + 1], width, height);
          }
          else {
              context.rect(0, 0, width, height);
          }
          context.closePath();
          context.fillShape(this);
      };
      Sprite.prototype._useBufferCanvas = function () {
          return ((this.hasShadow() || this.getAbsoluteOpacity() !== 1) && this.hasStroke());
      };
      Sprite.prototype._setInterval = function () {
          var that = this;
          this.interval = setInterval(function () {
              that._updateIndex();
          }, 1000 / this.frameRate());
      };
      Sprite.prototype.start = function () {
          if (this.isRunning()) {
              return;
          }
          var layer = this.getLayer();
          this.anim.setLayers(layer);
          this._setInterval();
          this.anim.start();
      };
      Sprite.prototype.stop = function () {
          this.anim.stop();
          clearInterval(this.interval);
      };
      Sprite.prototype.isRunning = function () {
          return this.anim.isRunning();
      };
      Sprite.prototype._updateIndex = function () {
          var index = this.frameIndex(), animation = this.animation(), animations = this.animations(), anim = animations[animation], len = anim.length / 4;
          if (index < len - 1) {
              this.frameIndex(index + 1);
          }
          else {
              this.frameIndex(0);
          }
      };
      return Sprite;
  }(Shape_1.Shape));
  exports.Sprite = Sprite;
  Sprite.prototype.className = 'Sprite';
  Global._registerNode(Sprite);
  Factory.Factory.addGetterSetter(Sprite, 'animation');
  Factory.Factory.addGetterSetter(Sprite, 'animations');
  Factory.Factory.addGetterSetter(Sprite, 'frameOffsets');
  Factory.Factory.addGetterSetter(Sprite, 'image');
  Factory.Factory.addGetterSetter(Sprite, 'frameIndex', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Sprite, 'frameRate', 17, Validators.getNumberValidator());
  Factory.Factory.backCompat(Sprite, {
      index: 'frameIndex',
      getIndex: 'getFrameIndex',
      setIndex: 'setFrameIndex'
  });
  Util.Collection.mapMethods(Sprite);
  });

  unwrapExports(Sprite_1);
  var Sprite_2 = Sprite_1.Sprite;

  var Star_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });





  var Star = (function (_super) {
      __extends(Star, _super);
      function Star() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Star.prototype._sceneFunc = function (context) {
          var innerRadius = this.innerRadius(), outerRadius = this.outerRadius(), numPoints = this.numPoints();
          context.beginPath();
          context.moveTo(0, 0 - outerRadius);
          for (var n = 1; n < numPoints * 2; n++) {
              var radius = n % 2 === 0 ? outerRadius : innerRadius;
              var x = radius * Math.sin((n * Math.PI) / numPoints);
              var y = -1 * radius * Math.cos((n * Math.PI) / numPoints);
              context.lineTo(x, y);
          }
          context.closePath();
          context.fillStrokeShape(this);
      };
      Star.prototype.getWidth = function () {
          return this.outerRadius() * 2;
      };
      Star.prototype.getHeight = function () {
          return this.outerRadius() * 2;
      };
      Star.prototype.setWidth = function (width) {
          this.outerRadius(width / 2);
      };
      Star.prototype.setHeight = function (height) {
          this.outerRadius(height / 2);
      };
      return Star;
  }(Shape_1.Shape));
  exports.Star = Star;
  Star.prototype.className = 'Star';
  Star.prototype._centroid = true;
  Star.prototype._attrsAffectingSize = ['innerRadius', 'outerRadius'];
  Global._registerNode(Star);
  Factory.Factory.addGetterSetter(Star, 'numPoints', 5, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Star, 'innerRadius', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Star, 'outerRadius', 0, Validators.getNumberValidator());
  Util.Collection.mapMethods(Star);
  });

  unwrapExports(Star_1);
  var Star_2 = Star_1.Star;

  var Text_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });





  var Global_2 = Global;
  var AUTO = 'auto', CENTER = 'center', JUSTIFY = 'justify', CHANGE_KONVA = 'Change.konva', CONTEXT_2D = '2d', DASH = '-', LEFT = 'left', TEXT = 'text', TEXT_UPPER = 'Text', TOP = 'top', BOTTOM = 'bottom', MIDDLE = 'middle', NORMAL = 'normal', PX_SPACE = 'px ', SPACE = ' ', RIGHT = 'right', WORD = 'word', CHAR = 'char', NONE = 'none', ELLIPSIS = '…', ATTR_CHANGE_LIST = [
      'fontFamily',
      'fontSize',
      'fontStyle',
      'fontVariant',
      'padding',
      'align',
      'verticalAlign',
      'lineHeight',
      'text',
      'width',
      'height',
      'wrap',
      'ellipsis',
      'letterSpacing'
  ], attrChangeListLen = ATTR_CHANGE_LIST.length;
  var dummyContext;
  function getDummyContext() {
      if (dummyContext) {
          return dummyContext;
      }
      dummyContext = Util.Util.createCanvasElement().getContext(CONTEXT_2D);
      return dummyContext;
  }
  function _fillFunc(context) {
      context.fillText(this._partialText, this._partialTextX, this._partialTextY);
  }
  function _strokeFunc(context) {
      context.strokeText(this._partialText, this._partialTextX, this._partialTextY);
  }
  function checkDefaultFill(config) {
      config = config || {};
      if (!config.fillLinearGradientColorStops &&
          !config.fillRadialGradientColorStops &&
          !config.fillPatternImage) {
          config.fill = config.fill || 'black';
      }
      return config;
  }
  var Text = (function (_super) {
      __extends(Text, _super);
      function Text(config) {
          var _this = _super.call(this, checkDefaultFill(config)) || this;
          _this._partialTextX = 0;
          _this._partialTextY = 0;
          for (var n = 0; n < attrChangeListLen; n++) {
              _this.on(ATTR_CHANGE_LIST[n] + CHANGE_KONVA, _this._setTextData);
          }
          _this._setTextData();
          return _this;
      }
      Text.prototype._sceneFunc = function (context) {
          var padding = this.padding(), fontSize = this.fontSize(), lineHeightPx = this.lineHeight() * fontSize, textArr = this.textArr, textArrLen = textArr.length, verticalAlign = this.verticalAlign(), alignY = 0, align = this.align(), totalWidth = this.getWidth(), letterSpacing = this.letterSpacing(), fill = this.fill(), textDecoration = this.textDecoration(), shouldUnderline = textDecoration.indexOf('underline') !== -1, shouldLineThrough = textDecoration.indexOf('line-through') !== -1, n;
          var translateY = 0;
          var translateY = lineHeightPx / 2;
          var lineTranslateX = 0;
          var lineTranslateY = 0;
          context.setAttr('font', this._getContextFont());
          context.setAttr('textBaseline', MIDDLE);
          context.setAttr('textAlign', LEFT);
          if (verticalAlign === MIDDLE) {
              alignY = (this.getHeight() - textArrLen * lineHeightPx - padding * 2) / 2;
          }
          else if (verticalAlign === BOTTOM) {
              alignY = this.getHeight() - textArrLen * lineHeightPx - padding * 2;
          }
          context.translate(padding, alignY + padding);
          for (n = 0; n < textArrLen; n++) {
              var lineTranslateX = 0;
              var lineTranslateY = 0;
              var obj = textArr[n], text = obj.text, width = obj.width, lastLine = n !== textArrLen - 1, spacesNumber, oneWord, lineWidth;
              context.save();
              if (align === RIGHT) {
                  lineTranslateX += totalWidth - width - padding * 2;
              }
              else if (align === CENTER) {
                  lineTranslateX += (totalWidth - width - padding * 2) / 2;
              }
              if (shouldUnderline) {
                  context.save();
                  context.beginPath();
                  context.moveTo(lineTranslateX, translateY + lineTranslateY + Math.round(fontSize / 2));
                  spacesNumber = text.split(' ').length - 1;
                  oneWord = spacesNumber === 0;
                  lineWidth =
                      align === JUSTIFY && lastLine && !oneWord
                          ? totalWidth - padding * 2
                          : width;
                  context.lineTo(lineTranslateX + Math.round(lineWidth), translateY + lineTranslateY + Math.round(fontSize / 2));
                  context.lineWidth = fontSize / 15;
                  context.strokeStyle = fill;
                  context.stroke();
                  context.restore();
              }
              if (shouldLineThrough) {
                  context.save();
                  context.beginPath();
                  context.moveTo(lineTranslateX, translateY + lineTranslateY);
                  spacesNumber = text.split(' ').length - 1;
                  oneWord = spacesNumber === 0;
                  lineWidth =
                      align === JUSTIFY && lastLine && !oneWord
                          ? totalWidth - padding * 2
                          : width;
                  context.lineTo(lineTranslateX + Math.round(lineWidth), translateY + lineTranslateY);
                  context.lineWidth = fontSize / 15;
                  context.strokeStyle = fill;
                  context.stroke();
                  context.restore();
              }
              if (letterSpacing !== 0 || align === JUSTIFY) {
                  spacesNumber = text.split(' ').length - 1;
                  for (var li = 0; li < text.length; li++) {
                      var letter = text[li];
                      if (letter === ' ' && n !== textArrLen - 1 && align === JUSTIFY) {
                          lineTranslateX += Math.floor((totalWidth - padding * 2 - width) / spacesNumber);
                      }
                      this._partialTextX = lineTranslateX;
                      this._partialTextY = translateY + lineTranslateY;
                      this._partialText = letter;
                      context.fillStrokeShape(this);
                      lineTranslateX +=
                          Math.round(this.measureSize(letter).width) + letterSpacing;
                  }
              }
              else {
                  this._partialTextX = lineTranslateX;
                  this._partialTextY = translateY + lineTranslateY;
                  this._partialText = text;
                  context.fillStrokeShape(this);
              }
              context.restore();
              if (textArrLen > 1) {
                  translateY += lineHeightPx;
              }
          }
      };
      Text.prototype._hitFunc = function (context) {
          var width = this.getWidth(), height = this.getHeight();
          context.beginPath();
          context.rect(0, 0, width, height);
          context.closePath();
          context.fillStrokeShape(this);
      };
      Text.prototype.setText = function (text) {
          var str = Util.Util._isString(text) ? text : (text === null || text === undefined) ? '' : text + '';
          this._setAttr(TEXT, str);
          return this;
      };
      Text.prototype.getWidth = function () {
          var isAuto = this.attrs.width === AUTO || this.attrs.width === undefined;
          return isAuto ? this.getTextWidth() + this.padding() * 2 : this.attrs.width;
      };
      Text.prototype.getHeight = function () {
          var isAuto = this.attrs.height === AUTO || this.attrs.height === undefined;
          return isAuto
              ? this.fontSize() * this.textArr.length * this.lineHeight() +
                  this.padding() * 2
              : this.attrs.height;
      };
      Text.prototype.getTextWidth = function () {
          return this.textWidth;
      };
      Text.prototype.getTextHeight = function () {
          Util.Util.warn('text.getTextHeight() method is deprecated. Use text.height() - for full height and text.fontSize() - for one line height.');
          return this.textHeight;
      };
      Text.prototype.measureSize = function (text) {
          var _context = getDummyContext(), fontSize = this.fontSize(), metrics;
          _context.save();
          _context.font = this._getContextFont();
          metrics = _context.measureText(text);
          _context.restore();
          return {
              width: metrics.width,
              height: fontSize
          };
      };
      Text.prototype._getContextFont = function () {
          if (Global.Konva.UA.isIE) {
              return (this.fontStyle() +
                  SPACE +
                  this.fontSize() +
                  PX_SPACE +
                  this.fontFamily());
          }
          return (this.fontStyle() +
              SPACE +
              this.fontVariant() +
              SPACE +
              this.fontSize() +
              PX_SPACE +
              this.fontFamily());
      };
      Text.prototype._addTextLine = function (line) {
          if (this.align() === JUSTIFY) {
              line = line.trim();
          }
          var width = this._getTextWidth(line);
          return this.textArr.push({ text: line, width: width });
      };
      Text.prototype._getTextWidth = function (text) {
          var letterSpacing = this.letterSpacing();
          var length = text.length;
          return (getDummyContext().measureText(text).width +
              (length ? letterSpacing * (length - 1) : 0));
      };
      Text.prototype._setTextData = function () {
          var lines = this.text().split('\n'), fontSize = +this.fontSize(), textWidth = 0, lineHeightPx = this.lineHeight() * fontSize, width = this.attrs.width, height = this.attrs.height, fixedWidth = width !== AUTO && width !== undefined, fixedHeight = height !== AUTO && height !== undefined, padding = this.padding(), maxWidth = width - padding * 2, maxHeightPx = height - padding * 2, currentHeightPx = 0, wrap = this.wrap(), shouldWrap = wrap !== NONE, wrapAtWord = wrap !== CHAR && shouldWrap, shouldAddEllipsis = this.ellipsis() && !shouldWrap;
          this.textArr = [];
          getDummyContext().font = this._getContextFont();
          var additionalWidth = shouldAddEllipsis ? this._getTextWidth(ELLIPSIS) : 0;
          for (var i = 0, max = lines.length; i < max; ++i) {
              var line = lines[i];
              var lineWidth = this._getTextWidth(line);
              if (fixedWidth && lineWidth > maxWidth) {
                  while (line.length > 0) {
                      var low = 0, high = line.length, match = '', matchWidth = 0;
                      while (low < high) {
                          var mid = (low + high) >>> 1, substr = line.slice(0, mid + 1), substrWidth = this._getTextWidth(substr) + additionalWidth;
                          if (substrWidth <= maxWidth) {
                              low = mid + 1;
                              match = substr + (shouldAddEllipsis ? ELLIPSIS : '');
                              matchWidth = substrWidth;
                          }
                          else {
                              high = mid;
                          }
                      }
                      if (match) {
                          if (wrapAtWord) {
                              var wrapIndex;
                              var nextChar = line[match.length];
                              var nextIsSpaceOrDash = nextChar === SPACE || nextChar === DASH;
                              if (nextIsSpaceOrDash && matchWidth <= maxWidth) {
                                  wrapIndex = match.length;
                              }
                              else {
                                  wrapIndex =
                                      Math.max(match.lastIndexOf(SPACE), match.lastIndexOf(DASH)) +
                                          1;
                              }
                              if (wrapIndex > 0) {
                                  low = wrapIndex;
                                  match = match.slice(0, low);
                                  matchWidth = this._getTextWidth(match);
                              }
                          }
                          match = match.trimRight();
                          this._addTextLine(match);
                          textWidth = Math.max(textWidth, matchWidth);
                          currentHeightPx += lineHeightPx;
                          if (!shouldWrap ||
                              (fixedHeight && currentHeightPx + lineHeightPx > maxHeightPx)) {
                              break;
                          }
                          line = line.slice(low);
                          line = line.trimLeft();
                          if (line.length > 0) {
                              lineWidth = this._getTextWidth(line);
                              if (lineWidth <= maxWidth) {
                                  this._addTextLine(line);
                                  currentHeightPx += lineHeightPx;
                                  textWidth = Math.max(textWidth, lineWidth);
                                  break;
                              }
                          }
                      }
                      else {
                          break;
                      }
                  }
              }
              else {
                  this._addTextLine(line);
                  currentHeightPx += lineHeightPx;
                  textWidth = Math.max(textWidth, lineWidth);
              }
              if (fixedHeight && currentHeightPx + lineHeightPx > maxHeightPx) {
                  break;
              }
          }
          this.textHeight = fontSize;
          this.textWidth = textWidth;
      };
      Text.prototype.getStrokeScaleEnabled = function () {
          return true;
      };
      return Text;
  }(Shape_1.Shape));
  exports.Text = Text;
  Text.prototype._fillFunc = _fillFunc;
  Text.prototype._strokeFunc = _strokeFunc;
  Text.prototype.className = TEXT_UPPER;
  Text.prototype._attrsAffectingSize = [
      'text',
      'fontSize',
      'padding',
      'wrap',
      'lineHeight'
  ];
  Global_2._registerNode(Text);
  Factory.Factory.overWriteSetter(Text, 'width', Validators.getNumberOrAutoValidator());
  Factory.Factory.overWriteSetter(Text, 'height', Validators.getNumberOrAutoValidator());
  Factory.Factory.addGetterSetter(Text, 'fontFamily', 'Arial');
  Factory.Factory.addGetterSetter(Text, 'fontSize', 12, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Text, 'fontStyle', NORMAL);
  Factory.Factory.addGetterSetter(Text, 'fontVariant', NORMAL);
  Factory.Factory.addGetterSetter(Text, 'padding', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Text, 'align', LEFT);
  Factory.Factory.addGetterSetter(Text, 'verticalAlign', TOP);
  Factory.Factory.addGetterSetter(Text, 'lineHeight', 1, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Text, 'wrap', WORD);
  Factory.Factory.addGetterSetter(Text, 'ellipsis', false);
  Factory.Factory.addGetterSetter(Text, 'letterSpacing', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Text, 'text', '', Validators.getStringValidator());
  Factory.Factory.addGetterSetter(Text, 'textDecoration', '');
  Util.Collection.mapMethods(Text);
  });

  unwrapExports(Text_1);
  var Text_2 = Text_1.Text;

  var TextPath_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });







  var EMPTY_STRING = '', NORMAL = 'normal';
  function _fillFunc(context) {
      context.fillText(this.partialText, 0, 0);
  }
  function _strokeFunc(context) {
      context.strokeText(this.partialText, 0, 0);
  }
  var TextPath = (function (_super) {
      __extends(TextPath, _super);
      function TextPath(config) {
          var _this = _super.call(this, config) || this;
          _this.dummyCanvas = Util.Util.createCanvasElement();
          _this.dataArray = [];
          _this.dataArray = Path_1.Path.parsePathData(_this.attrs.data);
          _this.on('dataChange.konva', function () {
              this.dataArray = Path_1.Path.parsePathData(this.attrs.data);
              this._setTextData();
          });
          _this.on('textChange.konva alignChange.konva letterSpacingChange.konva kerningFuncChange.konva', _this._setTextData);
          if (config && config['getKerning']) {
              Util.Util.warn('getKerning TextPath API is deprecated. Please use "kerningFunc" instead.');
              _this.kerningFunc(config['getKerning']);
          }
          _this._setTextData();
          return _this;
      }
      TextPath.prototype._sceneFunc = function (context) {
          context.setAttr('font', this._getContextFont());
          context.setAttr('textBaseline', this.textBaseline());
          context.setAttr('textAlign', 'left');
          context.save();
          var textDecoration = this.textDecoration();
          var fill = this.fill();
          var fontSize = this.fontSize();
          var glyphInfo = this.glyphInfo;
          if (textDecoration === 'underline') {
              context.beginPath();
          }
          for (var i = 0; i < glyphInfo.length; i++) {
              context.save();
              var p0 = glyphInfo[i].p0;
              context.translate(p0.x, p0.y);
              context.rotate(glyphInfo[i].rotation);
              this.partialText = glyphInfo[i].text;
              context.fillStrokeShape(this);
              if (textDecoration === 'underline') {
                  if (i === 0) {
                      context.moveTo(0, fontSize / 2 + 1);
                  }
                  context.lineTo(fontSize, fontSize / 2 + 1);
              }
              context.restore();
          }
          if (textDecoration === 'underline') {
              context.strokeStyle = fill;
              context.lineWidth = fontSize / 20;
              context.stroke();
          }
          context.restore();
      };
      TextPath.prototype._hitFunc = function (context) {
          context.beginPath();
          var glyphInfo = this.glyphInfo;
          if (glyphInfo.length >= 1) {
              var p0 = glyphInfo[0].p0;
              context.moveTo(p0.x, p0.y);
          }
          for (var i = 0; i < glyphInfo.length; i++) {
              var p1 = glyphInfo[i].p1;
              context.lineTo(p1.x, p1.y);
          }
          context.setAttr('lineWidth', this.fontSize());
          context.setAttr('strokeStyle', this.colorKey);
          context.stroke();
      };
      TextPath.prototype.getTextWidth = function () {
          return this.textWidth;
      };
      TextPath.prototype.getTextHeight = function () {
          Util.Util.warn('text.getTextHeight() method is deprecated. Use text.height() - for full height and text.fontSize() - for one line height.');
          return this.textHeight;
      };
      TextPath.prototype.setText = function (text) {
          return Text_1.Text.prototype.setText.call(this, text);
      };
      TextPath.prototype._getContextFont = function () {
          return Text_1.Text.prototype._getContextFont.call(this);
      };
      TextPath.prototype._getTextSize = function (text) {
          var dummyCanvas = this.dummyCanvas;
          var _context = dummyCanvas.getContext('2d');
          _context.save();
          _context.font = this._getContextFont();
          var metrics = _context.measureText(text);
          _context.restore();
          return {
              width: metrics.width,
              height: parseInt(this.attrs.fontSize, 10)
          };
      };
      TextPath.prototype._setTextData = function () {
          var that = this;
          var size = this._getTextSize(this.attrs.text);
          var letterSpacing = this.letterSpacing();
          var align = this.align();
          var kerningFunc = this.kerningFunc();
          this.textWidth = size.width;
          this.textHeight = size.height;
          var textFullWidth = Math.max(this.textWidth + ((this.attrs.text || '').length - 1) * letterSpacing, 0);
          this.glyphInfo = [];
          var fullPathWidth = 0;
          for (var l = 0; l < that.dataArray.length; l++) {
              if (that.dataArray[l].pathLength > 0) {
                  fullPathWidth += that.dataArray[l].pathLength;
              }
          }
          var offset = 0;
          if (align === 'center') {
              offset = Math.max(0, fullPathWidth / 2 - textFullWidth / 2);
          }
          if (align === 'right') {
              offset = Math.max(0, fullPathWidth - textFullWidth);
          }
          var charArr = this.text().split('');
          var spacesNumber = this.text().split(' ').length - 1;
          var p0, p1, pathCmd;
          var pIndex = -1;
          var currentT = 0;
          var getNextPathSegment = function () {
              currentT = 0;
              var pathData = that.dataArray;
              for (var j = pIndex + 1; j < pathData.length; j++) {
                  if (pathData[j].pathLength > 0) {
                      pIndex = j;
                      return pathData[j];
                  }
                  else if (pathData[j].command === 'M') {
                      p0 = {
                          x: pathData[j].points[0],
                          y: pathData[j].points[1]
                      };
                  }
              }
              return {};
          };
          var findSegmentToFitCharacter = function (c) {
              var glyphWidth = that._getTextSize(c).width + letterSpacing;
              if (c === ' ' && align === 'justify') {
                  glyphWidth += (fullPathWidth - textFullWidth) / spacesNumber;
              }
              var currLen = 0;
              var attempts = 0;
              p1 = undefined;
              while (Math.abs(glyphWidth - currLen) / glyphWidth > 0.01 &&
                  attempts < 25) {
                  attempts++;
                  var cumulativePathLength = currLen;
                  while (pathCmd === undefined) {
                      pathCmd = getNextPathSegment();
                      if (pathCmd &&
                          cumulativePathLength + pathCmd.pathLength < glyphWidth) {
                          cumulativePathLength += pathCmd.pathLength;
                          pathCmd = undefined;
                      }
                  }
                  if (pathCmd === {} || p0 === undefined) {
                      return undefined;
                  }
                  var needNewSegment = false;
                  switch (pathCmd.command) {
                      case 'L':
                          if (Path_1.Path.getLineLength(p0.x, p0.y, pathCmd.points[0], pathCmd.points[1]) > glyphWidth) {
                              p1 = Path_1.Path.getPointOnLine(glyphWidth, p0.x, p0.y, pathCmd.points[0], pathCmd.points[1], p0.x, p0.y);
                          }
                          else {
                              pathCmd = undefined;
                          }
                          break;
                      case 'A':
                          var start = pathCmd.points[4];
                          var dTheta = pathCmd.points[5];
                          var end = pathCmd.points[4] + dTheta;
                          if (currentT === 0) {
                              currentT = start + 0.00000001;
                          }
                          else if (glyphWidth > currLen) {
                              currentT += ((Math.PI / 180.0) * dTheta) / Math.abs(dTheta);
                          }
                          else {
                              currentT -= ((Math.PI / 360.0) * dTheta) / Math.abs(dTheta);
                          }
                          if ((dTheta < 0 && currentT < end) ||
                              (dTheta >= 0 && currentT > end)) {
                              currentT = end;
                              needNewSegment = true;
                          }
                          p1 = Path_1.Path.getPointOnEllipticalArc(pathCmd.points[0], pathCmd.points[1], pathCmd.points[2], pathCmd.points[3], currentT, pathCmd.points[6]);
                          break;
                      case 'C':
                          if (currentT === 0) {
                              if (glyphWidth > pathCmd.pathLength) {
                                  currentT = 0.00000001;
                              }
                              else {
                                  currentT = glyphWidth / pathCmd.pathLength;
                              }
                          }
                          else if (glyphWidth > currLen) {
                              currentT += (glyphWidth - currLen) / pathCmd.pathLength;
                          }
                          else {
                              currentT -= (currLen - glyphWidth) / pathCmd.pathLength;
                          }
                          if (currentT > 1.0) {
                              currentT = 1.0;
                              needNewSegment = true;
                          }
                          p1 = Path_1.Path.getPointOnCubicBezier(currentT, pathCmd.start.x, pathCmd.start.y, pathCmd.points[0], pathCmd.points[1], pathCmd.points[2], pathCmd.points[3], pathCmd.points[4], pathCmd.points[5]);
                          break;
                      case 'Q':
                          if (currentT === 0) {
                              currentT = glyphWidth / pathCmd.pathLength;
                          }
                          else if (glyphWidth > currLen) {
                              currentT += (glyphWidth - currLen) / pathCmd.pathLength;
                          }
                          else {
                              currentT -= (currLen - glyphWidth) / pathCmd.pathLength;
                          }
                          if (currentT > 1.0) {
                              currentT = 1.0;
                              needNewSegment = true;
                          }
                          p1 = Path_1.Path.getPointOnQuadraticBezier(currentT, pathCmd.start.x, pathCmd.start.y, pathCmd.points[0], pathCmd.points[1], pathCmd.points[2], pathCmd.points[3]);
                          break;
                  }
                  if (p1 !== undefined) {
                      currLen = Path_1.Path.getLineLength(p0.x, p0.y, p1.x, p1.y);
                  }
                  if (needNewSegment) {
                      needNewSegment = false;
                      pathCmd = undefined;
                  }
              }
          };
          var testChar = 'C';
          var glyphWidth = that._getTextSize(testChar).width + letterSpacing;
          var lettersInOffset = offset / glyphWidth - 1;
          for (var k = 0; k < lettersInOffset; k++) {
              findSegmentToFitCharacter(testChar);
              if (p0 === undefined || p1 === undefined) {
                  break;
              }
              p0 = p1;
          }
          for (var i = 0; i < charArr.length; i++) {
              findSegmentToFitCharacter(charArr[i]);
              if (p0 === undefined || p1 === undefined) {
                  break;
              }
              var width = Path_1.Path.getLineLength(p0.x, p0.y, p1.x, p1.y);
              var kern = 0;
              if (kerningFunc) {
                  try {
                      kern = kerningFunc(charArr[i - 1], charArr[i]) * this.fontSize();
                  }
                  catch (e) {
                      kern = 0;
                  }
              }
              p0.x += kern;
              p1.x += kern;
              this.textWidth += kern;
              var midpoint = Path_1.Path.getPointOnLine(kern + width / 2.0, p0.x, p0.y, p1.x, p1.y);
              var rotation = Math.atan2(p1.y - p0.y, p1.x - p0.x);
              this.glyphInfo.push({
                  transposeX: midpoint.x,
                  transposeY: midpoint.y,
                  text: charArr[i],
                  rotation: rotation,
                  p0: p0,
                  p1: p1
              });
              p0 = p1;
          }
      };
      TextPath.prototype.getSelfRect = function () {
          if (!this.glyphInfo.length) {
              return {
                  x: 0,
                  y: 0,
                  width: 0,
                  height: 0
              };
          }
          var points = [];
          this.glyphInfo.forEach(function (info) {
              points.push(info.p0.x);
              points.push(info.p0.y);
              points.push(info.p1.x);
              points.push(info.p1.y);
          });
          var minX = points[0] || 0;
          var maxX = points[0] || 0;
          var minY = points[1] || 0;
          var maxY = points[1] || 0;
          var x, y;
          for (var i = 0; i < points.length / 2; i++) {
              x = points[i * 2];
              y = points[i * 2 + 1];
              minX = Math.min(minX, x);
              maxX = Math.max(maxX, x);
              minY = Math.min(minY, y);
              maxY = Math.max(maxY, y);
          }
          var fontSize = this.fontSize();
          return {
              x: Math.round(minX) - fontSize / 2,
              y: Math.round(minY) - fontSize / 2,
              width: Math.round(maxX - minX) + fontSize,
              height: Math.round(maxY - minY) + fontSize
          };
      };
      return TextPath;
  }(Shape_1.Shape));
  exports.TextPath = TextPath;
  TextPath.prototype._fillFunc = _fillFunc;
  TextPath.prototype._strokeFunc = _strokeFunc;
  TextPath.prototype._fillFuncHit = _fillFunc;
  TextPath.prototype._strokeFuncHit = _strokeFunc;
  TextPath.prototype.className = 'TextPath';
  TextPath.prototype._attrsAffectingSize = ['text', 'fontSize', 'data'];
  Global._registerNode(TextPath);
  Factory.Factory.addGetterSetter(TextPath, 'data');
  Factory.Factory.addGetterSetter(TextPath, 'fontFamily', 'Arial');
  Factory.Factory.addGetterSetter(TextPath, 'fontSize', 12, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(TextPath, 'fontStyle', NORMAL);
  Factory.Factory.addGetterSetter(TextPath, 'align', 'left');
  Factory.Factory.addGetterSetter(TextPath, 'letterSpacing', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(TextPath, 'textBaseline', 'middle');
  Factory.Factory.addGetterSetter(TextPath, 'fontVariant', NORMAL);
  Factory.Factory.addGetterSetter(TextPath, 'text', EMPTY_STRING);
  Factory.Factory.addGetterSetter(TextPath, 'textDecoration', null);
  Factory.Factory.addGetterSetter(TextPath, 'kerningFunc', null);
  Util.Collection.mapMethods(TextPath);
  });

  unwrapExports(TextPath_1);
  var TextPath_2 = TextPath_1.TextPath;

  var Transformer_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });








  var Global_2 = Global;
  var EVENTS_NAME = 'tr-konva';
  var ATTR_CHANGE_LIST = [
      'resizeEnabledChange',
      'rotateAnchorOffsetChange',
      'rotateEnabledChange',
      'enabledAnchorsChange',
      'anchorSizeChange',
      'borderEnabledChange',
      'borderStrokeChange',
      'borderStrokeWidthChange',
      'borderDashChange',
      'anchorStrokeChange',
      'anchorStrokeWidthChange',
      'anchorFillChange',
      'anchorCornerRadiusChange',
      'ignoreStrokeChange'
  ]
      .map(function (e) { return e + ("." + EVENTS_NAME); })
      .join(' ');
  var NODE_RECT = 'nodeRect';
  var TRANSFORM_CHANGE_STR = [
      'widthChange',
      'heightChange',
      'scaleXChange',
      'scaleYChange',
      'skewXChange',
      'skewYChange',
      'rotationChange',
      'offsetXChange',
      'offsetYChange',
      'transformsEnabledChange',
      'strokeWidthChange'
  ]
      .map(function (e) { return e + ("." + EVENTS_NAME); })
      .join(' ');
  var ANGLES = {
      'top-left': -45,
      'top-center': 0,
      'top-right': 45,
      'middle-right': -90,
      'middle-left': 90,
      'bottom-left': -135,
      'bottom-center': 180,
      'bottom-right': 135
  };
  var TOUCH_DEVICE = 'ontouchstart' in Global.Konva._global;
  function getCursor(anchorName, rad, isMirrored) {
      if (anchorName === 'rotater') {
          return 'crosshair';
      }
      rad += Util.Util._degToRad(ANGLES[anchorName] || 0);
      if (isMirrored) {
          rad *= -1;
      }
      var angle = ((Util.Util._radToDeg(rad) % 360) + 360) % 360;
      if (Util.Util._inRange(angle, 315 + 22.5, 360) || Util.Util._inRange(angle, 0, 22.5)) {
          return 'ns-resize';
      }
      else if (Util.Util._inRange(angle, 45 - 22.5, 45 + 22.5)) {
          return 'nesw-resize';
      }
      else if (Util.Util._inRange(angle, 90 - 22.5, 90 + 22.5)) {
          return 'ew-resize';
      }
      else if (Util.Util._inRange(angle, 135 - 22.5, 135 + 22.5)) {
          return 'nwse-resize';
      }
      else if (Util.Util._inRange(angle, 180 - 22.5, 180 + 22.5)) {
          return 'ns-resize';
      }
      else if (Util.Util._inRange(angle, 225 - 22.5, 225 + 22.5)) {
          return 'nesw-resize';
      }
      else if (Util.Util._inRange(angle, 270 - 22.5, 270 + 22.5)) {
          return 'ew-resize';
      }
      else if (Util.Util._inRange(angle, 315 - 22.5, 315 + 22.5)) {
          return 'nwse-resize';
      }
      else {
          Util.Util.error('Transformer has unknown angle for cursor detection: ' + angle);
          return 'pointer';
      }
  }
  var ANCHORS_NAMES = [
      'top-left',
      'top-center',
      'top-right',
      'middle-right',
      'middle-left',
      'bottom-left',
      'bottom-center',
      'bottom-right'
  ];
  var MAX_SAFE_INTEGER = 100000000;
  var Transformer = (function (_super) {
      __extends(Transformer, _super);
      function Transformer(config) {
          var _this = _super.call(this, config) || this;
          _this._transforming = false;
          _this._createElements();
          _this._handleMouseMove = _this._handleMouseMove.bind(_this);
          _this._handleMouseUp = _this._handleMouseUp.bind(_this);
          _this.update = _this.update.bind(_this);
          _this.on(ATTR_CHANGE_LIST, _this.update);
          if (_this.getNode()) {
              _this.update();
          }
          return _this;
      }
      Transformer.prototype.attachTo = function (node) {
          this.setNode(node);
          return this;
      };
      Transformer.prototype.setNode = function (node) {
          var _this = this;
          if (this._node) {
              this.detach();
          }
          this._node = node;
          this._resetTransformCache();
          var additionalEvents = node._attrsAffectingSize
              .map(function (prop) { return prop + 'Change.' + EVENTS_NAME; })
              .join(' ');
          var onChange = function () {
              _this._resetTransformCache();
              if (!_this._transforming) {
                  _this.update();
              }
          };
          node.on(additionalEvents, onChange);
          node.on(TRANSFORM_CHANGE_STR, onChange);
          node.on("xChange." + EVENTS_NAME + " yChange." + EVENTS_NAME, function () {
              return _this._resetTransformCache();
          });
          var elementsCreated = !!this.findOne('.top-left');
          if (elementsCreated) {
              this.update();
          }
          return this;
      };
      Transformer.prototype.getNode = function () {
          return this._node;
      };
      Transformer.prototype.detach = function () {
          if (this.getNode()) {
              this.getNode().off('.' + EVENTS_NAME);
              this._node = undefined;
          }
          this._resetTransformCache();
      };
      Transformer.prototype._resetTransformCache = function () {
          this._clearCache(NODE_RECT);
          this._clearCache('transform');
          this._clearSelfAndDescendantCache('absoluteTransform');
      };
      Transformer.prototype._getNodeRect = function () {
          return this._getCache(NODE_RECT, this.__getNodeRect);
      };
      Transformer.prototype.__getNodeRect = function () {
          var node = this.getNode();
          if (!node) {
              return {
                  x: -MAX_SAFE_INTEGER,
                  y: -MAX_SAFE_INTEGER,
                  width: 0,
                  height: 0,
                  rotation: 0
              };
          }
          if (node.parent && this.parent && node.parent !== this.parent) {
              Util.Util.warn('Transformer and attached node have different parents. Konva does not support such case right now. Please move Transformer to the parent of attaching node.');
          }
          var rect = node.getClientRect({
              skipTransform: true,
              skipShadow: true,
              skipStroke: this.ignoreStroke()
          });
          var rotation = Global.Konva.getAngle(node.rotation());
          var dx = rect.x * node.scaleX() - node.offsetX() * node.scaleX();
          var dy = rect.y * node.scaleY() - node.offsetY() * node.scaleY();
          return {
              x: node.x() + dx * Math.cos(rotation) + dy * Math.sin(-rotation),
              y: node.y() + dy * Math.cos(rotation) + dx * Math.sin(rotation),
              width: rect.width * node.scaleX(),
              height: rect.height * node.scaleY(),
              rotation: node.rotation()
          };
      };
      Transformer.prototype.getX = function () {
          return this._getNodeRect().x;
      };
      Transformer.prototype.getY = function () {
          return this._getNodeRect().y;
      };
      Transformer.prototype.getRotation = function () {
          return this._getNodeRect().rotation;
      };
      Transformer.prototype.getWidth = function () {
          return this._getNodeRect().width;
      };
      Transformer.prototype.getHeight = function () {
          return this._getNodeRect().height;
      };
      Transformer.prototype._createElements = function () {
          this._createBack();
          ANCHORS_NAMES.forEach(function (name) {
              this._createAnchor(name);
          }.bind(this));
          this._createAnchor('rotater');
      };
      Transformer.prototype._createAnchor = function (name) {
          var _this = this;
          var anchor = new Rect_1.Rect({
              stroke: 'rgb(0, 161, 255)',
              fill: 'white',
              strokeWidth: 1,
              name: name + ' _anchor',
              dragDistance: 0,
              draggable: true,
              hitStrokeWidth: TOUCH_DEVICE ? 10 : 'auto'
          });
          var self = this;
          anchor.on('mousedown touchstart', function (e) {
              self._handleMouseDown(e);
          });
          anchor.on('dragstart', function (e) {
              e.cancelBubble = true;
          });
          anchor.on('dragmove', function (e) {
              e.cancelBubble = true;
          });
          anchor.on('dragend', function (e) {
              e.cancelBubble = true;
          });
          anchor.on('mouseenter', function () {
              var rad = Global.Konva.getAngle(_this.rotation());
              var scale = _this.getNode().getAbsoluteScale();
              var isMirrored = scale.y * scale.x < 0;
              var cursor = getCursor(name, rad, isMirrored);
              anchor.getStage().content.style.cursor = cursor;
              _this._cursorChange = true;
          });
          anchor.on('mouseout', function () {
              if (!anchor.getStage() || !anchor.getParent()) {
                  return;
              }
              anchor.getStage().content.style.cursor = '';
              _this._cursorChange = false;
          });
          this.add(anchor);
      };
      Transformer.prototype._createBack = function () {
          var back = new Shape_1.Shape({
              name: 'back',
              width: 0,
              height: 0,
              listening: false,
              sceneFunc: function (ctx) {
                  var tr = this.getParent();
                  var padding = tr.padding();
                  ctx.beginPath();
                  ctx.rect(-padding, -padding, this.width() + padding * 2, this.height() + padding * 2);
                  ctx.moveTo(this.width() / 2, -padding);
                  if (tr.rotateEnabled()) {
                      ctx.lineTo(this.width() / 2, -tr.rotateAnchorOffset() * Util.Util._sign(this.height()) - padding);
                  }
                  ctx.fillStrokeShape(this);
              }
          });
          this.add(back);
      };
      Transformer.prototype._handleMouseDown = function (e) {
          this._movingAnchorName = e.target.name().split(' ')[0];
          var attrs = this._getNodeRect();
          var width = attrs.width;
          var height = attrs.height;
          var hypotenuse = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
          this.sin = Math.abs(height / hypotenuse);
          this.cos = Math.abs(width / hypotenuse);
          window.addEventListener('mousemove', this._handleMouseMove);
          window.addEventListener('touchmove', this._handleMouseMove);
          window.addEventListener('mouseup', this._handleMouseUp, true);
          window.addEventListener('touchend', this._handleMouseUp, true);
          this._transforming = true;
          this._fire('transformstart', { evt: e });
          this.getNode()._fire('transformstart', { evt: e });
      };
      Transformer.prototype._handleMouseMove = function (e) {
          var x, y, newHypotenuse;
          var anchorNode = this.findOne('.' + this._movingAnchorName);
          var stage = anchorNode.getStage();
          var box = stage.getContent().getBoundingClientRect();
          var zeroPoint = {
              x: box.left,
              y: box.top
          };
          var pointerPos = {
              left: e.clientX !== undefined ? e.clientX : e.touches[0].clientX,
              top: e.clientX !== undefined ? e.clientY : e.touches[0].clientY
          };
          var newAbsPos = {
              x: pointerPos.left - zeroPoint.x,
              y: pointerPos.top - zeroPoint.y
          };
          anchorNode.setAbsolutePosition(newAbsPos);
          var keepProportion = this.keepRatio() || e.shiftKey;
          var padding = this.padding();
          if (this._movingAnchorName === 'top-left') {
              if (keepProportion) {
                  newHypotenuse = Math.sqrt(Math.pow(this.findOne('.bottom-right').x() - anchorNode.x() - padding * 2, 2) +
                      Math.pow(this.findOne('.bottom-right').y() - anchorNode.y() - padding * 2, 2));
                  var reverseX = this.findOne('.top-left').x() > this.findOne('.bottom-right').x()
                      ? -1
                      : 1;
                  var reverseY = this.findOne('.top-left').y() > this.findOne('.bottom-right').y()
                      ? -1
                      : 1;
                  x = newHypotenuse * this.cos * reverseX;
                  y = newHypotenuse * this.sin * reverseY;
                  this.findOne('.top-left').x(this.findOne('.bottom-right').x() - x - padding * 2);
                  this.findOne('.top-left').y(this.findOne('.bottom-right').y() - y - padding * 2);
              }
          }
          else if (this._movingAnchorName === 'top-center') {
              this.findOne('.top-left').y(anchorNode.y());
          }
          else if (this._movingAnchorName === 'top-right') {
              if (keepProportion) {
                  newHypotenuse = Math.sqrt(Math.pow(anchorNode.x() - this.findOne('.bottom-left').x() - padding * 2, 2) +
                      Math.pow(this.findOne('.bottom-left').y() - anchorNode.y() - padding * 2, 2));
                  var reverseX = this.findOne('.top-right').x() < this.findOne('.top-left').x()
                      ? -1
                      : 1;
                  var reverseY = this.findOne('.top-right').y() > this.findOne('.bottom-left').y()
                      ? -1
                      : 1;
                  x = newHypotenuse * this.cos * reverseX;
                  y = newHypotenuse * this.sin * reverseY;
                  this.findOne('.top-right').x(x + padding);
                  this.findOne('.top-right').y(this.findOne('.bottom-left').y() - y - padding * 2);
              }
              var pos = anchorNode.position();
              this.findOne('.top-left').y(pos.y);
              this.findOne('.bottom-right').x(pos.x);
          }
          else if (this._movingAnchorName === 'middle-left') {
              this.findOne('.top-left').x(anchorNode.x());
          }
          else if (this._movingAnchorName === 'middle-right') {
              this.findOne('.bottom-right').x(anchorNode.x());
          }
          else if (this._movingAnchorName === 'bottom-left') {
              if (keepProportion) {
                  newHypotenuse = Math.sqrt(Math.pow(this.findOne('.top-right').x() - anchorNode.x() - padding * 2, 2) +
                      Math.pow(anchorNode.y() - this.findOne('.top-right').y() - padding * 2, 2));
                  var reverseX = this.findOne('.top-right').x() < this.findOne('.bottom-left').x()
                      ? -1
                      : 1;
                  var reverseY = this.findOne('.bottom-right').y() < this.findOne('.top-left').y()
                      ? -1
                      : 1;
                  x = newHypotenuse * this.cos * reverseX;
                  y = newHypotenuse * this.sin * reverseY;
                  this.findOne('.bottom-left').x(this.findOne('.top-right').x() - x - padding * 2);
                  this.findOne('.bottom-left').y(y + padding);
              }
              pos = anchorNode.position();
              this.findOne('.top-left').x(pos.x);
              this.findOne('.bottom-right').y(pos.y);
          }
          else if (this._movingAnchorName === 'bottom-center') {
              this.findOne('.bottom-right').y(anchorNode.y());
          }
          else if (this._movingAnchorName === 'bottom-right') {
              if (keepProportion) {
                  newHypotenuse = Math.sqrt(Math.pow(this.findOne('.bottom-right').x() - padding, 2) +
                      Math.pow(this.findOne('.bottom-right').y() - padding, 2));
                  var reverseX = this.findOne('.top-left').x() > this.findOne('.bottom-right').x()
                      ? -1
                      : 1;
                  var reverseY = this.findOne('.top-left').y() > this.findOne('.bottom-right').y()
                      ? -1
                      : 1;
                  x = newHypotenuse * this.cos * reverseX;
                  y = newHypotenuse * this.sin * reverseY;
                  this.findOne('.bottom-right').x(x + padding);
                  this.findOne('.bottom-right').y(y + padding);
              }
          }
          else if (this._movingAnchorName === 'rotater') {
              var attrs = this._getNodeRect();
              x = anchorNode.x() - attrs.width / 2;
              y = -anchorNode.y() + attrs.height / 2;
              var dAlpha = Math.atan2(-y, x) + Math.PI / 2;
              if (attrs.height < 0) {
                  dAlpha -= Math.PI;
              }
              var rot = Global.Konva.getAngle(this.rotation());
              var newRotation = Util.Util._radToDeg(rot) + Util.Util._radToDeg(dAlpha);
              var alpha = Global.Konva.getAngle(this.getNode().rotation());
              var newAlpha = Util.Util._degToRad(newRotation);
              var snaps = this.rotationSnaps();
              var offset = 0.1;
              for (var i = 0; i < snaps.length; i++) {
                  var angle = Global.Konva.getAngle(snaps[i]);
                  var dif = Math.abs(angle - Util.Util._degToRad(newRotation)) % (Math.PI * 2);
                  if (dif < offset) {
                      newRotation = Util.Util._radToDeg(angle);
                      newAlpha = Util.Util._degToRad(newRotation);
                  }
              }
              var dx = padding;
              var dy = padding;
              this._fitNodeInto({
                  rotation: Global.Konva.angleDeg ? newRotation : Util.Util._degToRad(newRotation),
                  x: attrs.x +
                      (attrs.width / 2 + padding) *
                          (Math.cos(alpha) - Math.cos(newAlpha)) +
                      (attrs.height / 2 + padding) *
                          (Math.sin(-alpha) - Math.sin(-newAlpha)) -
                      (dx * Math.cos(rot) + dy * Math.sin(-rot)),
                  y: attrs.y +
                      (attrs.height / 2 + padding) *
                          (Math.cos(alpha) - Math.cos(newAlpha)) +
                      (attrs.width / 2 + padding) *
                          (Math.sin(alpha) - Math.sin(newAlpha)) -
                      (dy * Math.cos(rot) + dx * Math.sin(rot)),
                  width: attrs.width + padding * 2,
                  height: attrs.height + padding * 2
              }, e);
          }
          else {
              console.error(new Error('Wrong position argument of selection resizer: ' +
                  this._movingAnchorName));
          }
          if (this._movingAnchorName === 'rotater') {
              return;
          }
          var centeredScaling = this.centeredScaling() || e.altKey;
          if (centeredScaling) {
              var topLeft = this.findOne('.top-left');
              var bottomRight = this.findOne('.bottom-right');
              var topOffsetX = topLeft.x() + padding;
              var topOffsetY = topLeft.y() + padding;
              var bottomOffsetX = this.getWidth() - bottomRight.x() + padding;
              var bottomOffsetY = this.getHeight() - bottomRight.y() + padding;
              bottomRight.move({
                  x: -topOffsetX,
                  y: -topOffsetY
              });
              topLeft.move({
                  x: bottomOffsetX,
                  y: bottomOffsetY
              });
          }
          var absPos = this.findOne('.top-left').getAbsolutePosition(this.getParent());
          x = absPos.x;
          y = absPos.y;
          var width = this.findOne('.bottom-right').x() - this.findOne('.top-left').x();
          var height = this.findOne('.bottom-right').y() - this.findOne('.top-left').y();
          this._fitNodeInto({
              x: x + this.offsetX(),
              y: y + this.offsetY(),
              width: width,
              height: height
          }, e);
      };
      Transformer.prototype._handleMouseUp = function (e) {
          this._removeEvents(e);
      };
      Transformer.prototype._removeEvents = function (e) {
          if (this._transforming) {
              this._transforming = false;
              window.removeEventListener('mousemove', this._handleMouseMove);
              window.removeEventListener('touchmove', this._handleMouseMove);
              window.removeEventListener('mouseup', this._handleMouseUp, true);
              window.removeEventListener('touchend', this._handleMouseUp, true);
              this._fire('transformend', { evt: e });
              var node = this.getNode();
              if (node) {
                  node.fire('transformend', { evt: e });
              }
          }
      };
      Transformer.prototype._fitNodeInto = function (newAttrs, evt) {
          var boundBoxFunc = this.boundBoxFunc();
          if (boundBoxFunc) {
              var oldAttrs = this._getNodeRect();
              newAttrs = boundBoxFunc.call(this, oldAttrs, newAttrs);
          }
          var node = this.getNode();
          if (newAttrs.rotation !== undefined) {
              this.getNode().rotation(newAttrs.rotation);
          }
          var pure = node.getClientRect({
              skipTransform: true,
              skipShadow: true,
              skipStroke: this.ignoreStroke()
          });
          var padding = this.padding();
          var scaleX = pure.width ? (newAttrs.width - padding * 2) / pure.width : 1;
          var scaleY = pure.height
              ? (newAttrs.height - padding * 2) / pure.height
              : 1;
          var rotation = Global.Konva.getAngle(node.rotation());
          var dx = pure.x * scaleX - padding - node.offsetX() * scaleX;
          var dy = pure.y * scaleY - padding - node.offsetY() * scaleY;
          this.getNode().setAttrs({
              scaleX: scaleX,
              scaleY: scaleY,
              x: newAttrs.x - (dx * Math.cos(rotation) + dy * Math.sin(-rotation)),
              y: newAttrs.y - (dy * Math.cos(rotation) + dx * Math.sin(rotation))
          });
          this._fire('transform', { evt: evt });
          this.getNode()._fire('transform', { evt: evt });
          this.update();
          this.getLayer().batchDraw();
      };
      Transformer.prototype.forceUpdate = function () {
          this._resetTransformCache();
          this.update();
      };
      Transformer.prototype.update = function () {
          var _this = this;
          var attrs = this._getNodeRect();
          var node = this.getNode();
          var scale = { x: 1, y: 1 };
          if (node && node.getParent()) {
              scale = node.getParent().getAbsoluteScale();
          }
          var invertedScale = {
              x: 1 / scale.x,
              y: 1 / scale.y
          };
          var width = attrs.width;
          var height = attrs.height;
          var enabledAnchors = this.enabledAnchors();
          var resizeEnabled = this.resizeEnabled();
          var padding = this.padding();
          var anchorSize = this.anchorSize();
          this.find('._anchor').each(function (node) {
              return node.setAttrs({
                  width: anchorSize,
                  height: anchorSize,
                  offsetX: anchorSize / 2,
                  offsetY: anchorSize / 2,
                  stroke: _this.anchorStroke(),
                  strokeWidth: _this.anchorStrokeWidth(),
                  fill: _this.anchorFill(),
                  cornerRadius: _this.anchorCornerRadius()
              });
          });
          this.findOne('.top-left').setAttrs({
              x: -padding,
              y: -padding,
              scale: invertedScale,
              visible: resizeEnabled && enabledAnchors.indexOf('top-left') >= 0
          });
          this.findOne('.top-center').setAttrs({
              x: width / 2,
              y: -padding,
              scale: invertedScale,
              visible: resizeEnabled && enabledAnchors.indexOf('top-center') >= 0
          });
          this.findOne('.top-right').setAttrs({
              x: width + padding,
              y: -padding,
              scale: invertedScale,
              visible: resizeEnabled && enabledAnchors.indexOf('top-right') >= 0
          });
          this.findOne('.middle-left').setAttrs({
              x: -padding,
              y: height / 2,
              scale: invertedScale,
              visible: resizeEnabled && enabledAnchors.indexOf('middle-left') >= 0
          });
          this.findOne('.middle-right').setAttrs({
              x: width + padding,
              y: height / 2,
              scale: invertedScale,
              visible: resizeEnabled && enabledAnchors.indexOf('middle-right') >= 0
          });
          this.findOne('.bottom-left').setAttrs({
              x: -padding,
              y: height + padding,
              scale: invertedScale,
              visible: resizeEnabled && enabledAnchors.indexOf('bottom-left') >= 0
          });
          this.findOne('.bottom-center').setAttrs({
              x: width / 2,
              y: height + padding,
              scale: invertedScale,
              visible: resizeEnabled && enabledAnchors.indexOf('bottom-center') >= 0
          });
          this.findOne('.bottom-right').setAttrs({
              x: width + padding,
              y: height + padding,
              scale: invertedScale,
              visible: resizeEnabled && enabledAnchors.indexOf('bottom-right') >= 0
          });
          var scaledRotateAnchorOffset = -this.rotateAnchorOffset() * Math.abs(invertedScale.y);
          this.findOne('.rotater').setAttrs({
              x: width / 2,
              y: scaledRotateAnchorOffset * Util.Util._sign(height) - padding,
              scale: invertedScale,
              visible: this.rotateEnabled()
          });
          this.findOne('.back').setAttrs({
              width: width * scale.x,
              height: height * scale.y,
              scale: invertedScale,
              visible: this.borderEnabled(),
              stroke: this.borderStroke(),
              strokeWidth: this.borderStrokeWidth(),
              dash: this.borderDash()
          });
      };
      Transformer.prototype.isTransforming = function () {
          return this._transforming;
      };
      Transformer.prototype.stopTransform = function () {
          if (this._transforming) {
              this._removeEvents();
              var anchorNode = this.findOne('.' + this._movingAnchorName);
              if (anchorNode) {
                  anchorNode.stopDrag();
              }
          }
      };
      Transformer.prototype.destroy = function () {
          if (this.getStage() && this._cursorChange) {
              this.getStage().content.style.cursor = '';
          }
          Group_1.Group.prototype.destroy.call(this);
          this.detach();
          this._removeEvents();
          return this;
      };
      Transformer.prototype.toObject = function () {
          return Node_1.Node.prototype.toObject.call(this);
      };
      return Transformer;
  }(Group_1.Group));
  exports.Transformer = Transformer;
  function validateAnchors(val) {
      if (!(val instanceof Array)) {
          Util.Util.warn('enabledAnchors value should be an array');
      }
      if (val instanceof Array) {
          val.forEach(function (name) {
              if (ANCHORS_NAMES.indexOf(name) === -1) {
                  Util.Util.warn('Unknown anchor name: ' +
                      name +
                      '. Available names are: ' +
                      ANCHORS_NAMES.join(', '));
              }
          });
      }
      return val || [];
  }
  Transformer.prototype.className = 'Transformer';
  Global_2._registerNode(Transformer);
  Factory.Factory.addGetterSetter(Transformer, 'enabledAnchors', ANCHORS_NAMES, validateAnchors);
  Factory.Factory.addGetterSetter(Transformer, 'resizeEnabled', true);
  Factory.Factory.addGetterSetter(Transformer, 'anchorSize', 10, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Transformer, 'rotateEnabled', true);
  Factory.Factory.addGetterSetter(Transformer, 'rotationSnaps', []);
  Factory.Factory.addGetterSetter(Transformer, 'rotateAnchorOffset', 50, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Transformer, 'borderEnabled', true);
  Factory.Factory.addGetterSetter(Transformer, 'anchorStroke', 'rgb(0, 161, 255)');
  Factory.Factory.addGetterSetter(Transformer, 'anchorStrokeWidth', 1, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Transformer, 'anchorFill', 'white');
  Factory.Factory.addGetterSetter(Transformer, 'anchorCornerRadius', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Transformer, 'borderStroke', 'rgb(0, 161, 255)');
  Factory.Factory.addGetterSetter(Transformer, 'borderStrokeWidth', 1, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Transformer, 'borderDash');
  Factory.Factory.addGetterSetter(Transformer, 'keepRatio', true);
  Factory.Factory.addGetterSetter(Transformer, 'centeredScaling', false);
  Factory.Factory.addGetterSetter(Transformer, 'ignoreStroke', false);
  Factory.Factory.addGetterSetter(Transformer, 'padding', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Transformer, 'node');
  Factory.Factory.addGetterSetter(Transformer, 'boundBoxFunc');
  Factory.Factory.backCompat(Transformer, {
      lineEnabled: 'borderEnabled',
      rotateHandlerOffset: 'rotateAnchorOffset',
      enabledHandlers: 'enabledAnchors'
  });
  Util.Collection.mapMethods(Transformer);
  });

  unwrapExports(Transformer_1);
  var Transformer_2 = Transformer_1.Transformer;

  var Wedge_1 = createCommonjsModule(function (module, exports) {
  var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
      var extendStatics = function (d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };
      return function (d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
  })();
  Object.defineProperty(exports, "__esModule", { value: true });





  var Global_2 = Global;
  var Wedge = (function (_super) {
      __extends(Wedge, _super);
      function Wedge() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Wedge.prototype._sceneFunc = function (context) {
          context.beginPath();
          context.arc(0, 0, this.radius(), 0, Global.Konva.getAngle(this.angle()), this.clockwise());
          context.lineTo(0, 0);
          context.closePath();
          context.fillStrokeShape(this);
      };
      Wedge.prototype.getWidth = function () {
          return this.radius() * 2;
      };
      Wedge.prototype.getHeight = function () {
          return this.radius() * 2;
      };
      Wedge.prototype.setWidth = function (width) {
          this.radius(width / 2);
      };
      Wedge.prototype.setHeight = function (height) {
          this.radius(height / 2);
      };
      return Wedge;
  }(Shape_1.Shape));
  exports.Wedge = Wedge;
  Wedge.prototype.className = 'Wedge';
  Wedge.prototype._centroid = true;
  Wedge.prototype._attrsAffectingSize = ['radius'];
  Global_2._registerNode(Wedge);
  Factory.Factory.addGetterSetter(Wedge, 'radius', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Wedge, 'angle', 0, Validators.getNumberValidator());
  Factory.Factory.addGetterSetter(Wedge, 'clockwise', false);
  Factory.Factory.backCompat(Wedge, {
      angleDeg: 'angle',
      getAngleDeg: 'getAngle',
      setAngleDeg: 'setAngle'
  });
  Util.Collection.mapMethods(Wedge);
  });

  unwrapExports(Wedge_1);
  var Wedge_2 = Wedge_1.Wedge;

  var Blur = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });



  function BlurStack() {
      this.r = 0;
      this.g = 0;
      this.b = 0;
      this.a = 0;
      this.next = null;
  }
  var mul_table = [
      512,
      512,
      456,
      512,
      328,
      456,
      335,
      512,
      405,
      328,
      271,
      456,
      388,
      335,
      292,
      512,
      454,
      405,
      364,
      328,
      298,
      271,
      496,
      456,
      420,
      388,
      360,
      335,
      312,
      292,
      273,
      512,
      482,
      454,
      428,
      405,
      383,
      364,
      345,
      328,
      312,
      298,
      284,
      271,
      259,
      496,
      475,
      456,
      437,
      420,
      404,
      388,
      374,
      360,
      347,
      335,
      323,
      312,
      302,
      292,
      282,
      273,
      265,
      512,
      497,
      482,
      468,
      454,
      441,
      428,
      417,
      405,
      394,
      383,
      373,
      364,
      354,
      345,
      337,
      328,
      320,
      312,
      305,
      298,
      291,
      284,
      278,
      271,
      265,
      259,
      507,
      496,
      485,
      475,
      465,
      456,
      446,
      437,
      428,
      420,
      412,
      404,
      396,
      388,
      381,
      374,
      367,
      360,
      354,
      347,
      341,
      335,
      329,
      323,
      318,
      312,
      307,
      302,
      297,
      292,
      287,
      282,
      278,
      273,
      269,
      265,
      261,
      512,
      505,
      497,
      489,
      482,
      475,
      468,
      461,
      454,
      447,
      441,
      435,
      428,
      422,
      417,
      411,
      405,
      399,
      394,
      389,
      383,
      378,
      373,
      368,
      364,
      359,
      354,
      350,
      345,
      341,
      337,
      332,
      328,
      324,
      320,
      316,
      312,
      309,
      305,
      301,
      298,
      294,
      291,
      287,
      284,
      281,
      278,
      274,
      271,
      268,
      265,
      262,
      259,
      257,
      507,
      501,
      496,
      491,
      485,
      480,
      475,
      470,
      465,
      460,
      456,
      451,
      446,
      442,
      437,
      433,
      428,
      424,
      420,
      416,
      412,
      408,
      404,
      400,
      396,
      392,
      388,
      385,
      381,
      377,
      374,
      370,
      367,
      363,
      360,
      357,
      354,
      350,
      347,
      344,
      341,
      338,
      335,
      332,
      329,
      326,
      323,
      320,
      318,
      315,
      312,
      310,
      307,
      304,
      302,
      299,
      297,
      294,
      292,
      289,
      287,
      285,
      282,
      280,
      278,
      275,
      273,
      271,
      269,
      267,
      265,
      263,
      261,
      259
  ];
  var shg_table = [
      9,
      11,
      12,
      13,
      13,
      14,
      14,
      15,
      15,
      15,
      15,
      16,
      16,
      16,
      16,
      17,
      17,
      17,
      17,
      17,
      17,
      17,
      18,
      18,
      18,
      18,
      18,
      18,
      18,
      18,
      18,
      19,
      19,
      19,
      19,
      19,
      19,
      19,
      19,
      19,
      19,
      19,
      19,
      19,
      19,
      20,
      20,
      20,
      20,
      20,
      20,
      20,
      20,
      20,
      20,
      20,
      20,
      20,
      20,
      20,
      20,
      20,
      20,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      21,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      22,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      23,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24,
      24
  ];
  function filterGaussBlurRGBA(imageData, radius) {
      var pixels = imageData.data, width = imageData.width, height = imageData.height;
      var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum, r_out_sum, g_out_sum, b_out_sum, a_out_sum, r_in_sum, g_in_sum, b_in_sum, a_in_sum, pr, pg, pb, pa, rbs;
      var div = radius + radius + 1, widthMinus1 = width - 1, heightMinus1 = height - 1, radiusPlus1 = radius + 1, sumFactor = (radiusPlus1 * (radiusPlus1 + 1)) / 2, stackStart = new BlurStack(), stackEnd = null, stack = stackStart, stackIn = null, stackOut = null, mul_sum = mul_table[radius], shg_sum = shg_table[radius];
      for (i = 1; i < div; i++) {
          stack = stack.next = new BlurStack();
          if (i === radiusPlus1) {
              stackEnd = stack;
          }
      }
      stack.next = stackStart;
      yw = yi = 0;
      for (y = 0; y < height; y++) {
          r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;
          r_out_sum = radiusPlus1 * (pr = pixels[yi]);
          g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
          b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
          a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);
          r_sum += sumFactor * pr;
          g_sum += sumFactor * pg;
          b_sum += sumFactor * pb;
          a_sum += sumFactor * pa;
          stack = stackStart;
          for (i = 0; i < radiusPlus1; i++) {
              stack.r = pr;
              stack.g = pg;
              stack.b = pb;
              stack.a = pa;
              stack = stack.next;
          }
          for (i = 1; i < radiusPlus1; i++) {
              p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
              r_sum += (stack.r = pr = pixels[p]) * (rbs = radiusPlus1 - i);
              g_sum += (stack.g = pg = pixels[p + 1]) * rbs;
              b_sum += (stack.b = pb = pixels[p + 2]) * rbs;
              a_sum += (stack.a = pa = pixels[p + 3]) * rbs;
              r_in_sum += pr;
              g_in_sum += pg;
              b_in_sum += pb;
              a_in_sum += pa;
              stack = stack.next;
          }
          stackIn = stackStart;
          stackOut = stackEnd;
          for (x = 0; x < width; x++) {
              pixels[yi + 3] = pa = (a_sum * mul_sum) >> shg_sum;
              if (pa !== 0) {
                  pa = 255 / pa;
                  pixels[yi] = ((r_sum * mul_sum) >> shg_sum) * pa;
                  pixels[yi + 1] = ((g_sum * mul_sum) >> shg_sum) * pa;
                  pixels[yi + 2] = ((b_sum * mul_sum) >> shg_sum) * pa;
              }
              else {
                  pixels[yi] = pixels[yi + 1] = pixels[yi + 2] = 0;
              }
              r_sum -= r_out_sum;
              g_sum -= g_out_sum;
              b_sum -= b_out_sum;
              a_sum -= a_out_sum;
              r_out_sum -= stackIn.r;
              g_out_sum -= stackIn.g;
              b_out_sum -= stackIn.b;
              a_out_sum -= stackIn.a;
              p = (yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1)) << 2;
              r_in_sum += stackIn.r = pixels[p];
              g_in_sum += stackIn.g = pixels[p + 1];
              b_in_sum += stackIn.b = pixels[p + 2];
              a_in_sum += stackIn.a = pixels[p + 3];
              r_sum += r_in_sum;
              g_sum += g_in_sum;
              b_sum += b_in_sum;
              a_sum += a_in_sum;
              stackIn = stackIn.next;
              r_out_sum += pr = stackOut.r;
              g_out_sum += pg = stackOut.g;
              b_out_sum += pb = stackOut.b;
              a_out_sum += pa = stackOut.a;
              r_in_sum -= pr;
              g_in_sum -= pg;
              b_in_sum -= pb;
              a_in_sum -= pa;
              stackOut = stackOut.next;
              yi += 4;
          }
          yw += width;
      }
      for (x = 0; x < width; x++) {
          g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;
          yi = x << 2;
          r_out_sum = radiusPlus1 * (pr = pixels[yi]);
          g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
          b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
          a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);
          r_sum += sumFactor * pr;
          g_sum += sumFactor * pg;
          b_sum += sumFactor * pb;
          a_sum += sumFactor * pa;
          stack = stackStart;
          for (i = 0; i < radiusPlus1; i++) {
              stack.r = pr;
              stack.g = pg;
              stack.b = pb;
              stack.a = pa;
              stack = stack.next;
          }
          yp = width;
          for (i = 1; i <= radius; i++) {
              yi = (yp + x) << 2;
              r_sum += (stack.r = pr = pixels[yi]) * (rbs = radiusPlus1 - i);
              g_sum += (stack.g = pg = pixels[yi + 1]) * rbs;
              b_sum += (stack.b = pb = pixels[yi + 2]) * rbs;
              a_sum += (stack.a = pa = pixels[yi + 3]) * rbs;
              r_in_sum += pr;
              g_in_sum += pg;
              b_in_sum += pb;
              a_in_sum += pa;
              stack = stack.next;
              if (i < heightMinus1) {
                  yp += width;
              }
          }
          yi = x;
          stackIn = stackStart;
          stackOut = stackEnd;
          for (y = 0; y < height; y++) {
              p = yi << 2;
              pixels[p + 3] = pa = (a_sum * mul_sum) >> shg_sum;
              if (pa > 0) {
                  pa = 255 / pa;
                  pixels[p] = ((r_sum * mul_sum) >> shg_sum) * pa;
                  pixels[p + 1] = ((g_sum * mul_sum) >> shg_sum) * pa;
                  pixels[p + 2] = ((b_sum * mul_sum) >> shg_sum) * pa;
              }
              else {
                  pixels[p] = pixels[p + 1] = pixels[p + 2] = 0;
              }
              r_sum -= r_out_sum;
              g_sum -= g_out_sum;
              b_sum -= b_out_sum;
              a_sum -= a_out_sum;
              r_out_sum -= stackIn.r;
              g_out_sum -= stackIn.g;
              b_out_sum -= stackIn.b;
              a_out_sum -= stackIn.a;
              p =
                  (x +
                      ((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width) <<
                      2;
              r_sum += r_in_sum += stackIn.r = pixels[p];
              g_sum += g_in_sum += stackIn.g = pixels[p + 1];
              b_sum += b_in_sum += stackIn.b = pixels[p + 2];
              a_sum += a_in_sum += stackIn.a = pixels[p + 3];
              stackIn = stackIn.next;
              r_out_sum += pr = stackOut.r;
              g_out_sum += pg = stackOut.g;
              b_out_sum += pb = stackOut.b;
              a_out_sum += pa = stackOut.a;
              r_in_sum -= pr;
              g_in_sum -= pg;
              b_in_sum -= pb;
              a_in_sum -= pa;
              stackOut = stackOut.next;
              yi += width;
          }
      }
  }
  exports.Blur = function Blur(imageData) {
      var radius = Math.round(this.blurRadius());
      if (radius > 0) {
          filterGaussBlurRGBA(imageData, radius);
      }
  };
  Factory.Factory.addGetterSetter(Node_1.Node, 'blurRadius', 0, Validators.getNumberValidator(), Factory.Factory.afterSetFilter);
  });

  unwrapExports(Blur);
  var Blur_1 = Blur.Blur;

  var Brighten = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });



  exports.Brighten = function (imageData) {
      var brightness = this.brightness() * 255, data = imageData.data, len = data.length, i;
      for (i = 0; i < len; i += 4) {
          data[i] += brightness;
          data[i + 1] += brightness;
          data[i + 2] += brightness;
      }
  };
  Factory.Factory.addGetterSetter(Node_1.Node, 'brightness', 0, Validators.getNumberValidator(), Factory.Factory.afterSetFilter);
  });

  unwrapExports(Brighten);
  var Brighten_1 = Brighten.Brighten;

  var Contrast = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });



  exports.Contrast = function (imageData) {
      var adjust = Math.pow((this.contrast() + 100) / 100, 2);
      var data = imageData.data, nPixels = data.length, red = 150, green = 150, blue = 150, i;
      for (i = 0; i < nPixels; i += 4) {
          red = data[i];
          green = data[i + 1];
          blue = data[i + 2];
          red /= 255;
          red -= 0.5;
          red *= adjust;
          red += 0.5;
          red *= 255;
          green /= 255;
          green -= 0.5;
          green *= adjust;
          green += 0.5;
          green *= 255;
          blue /= 255;
          blue -= 0.5;
          blue *= adjust;
          blue += 0.5;
          blue *= 255;
          red = red < 0 ? 0 : red > 255 ? 255 : red;
          green = green < 0 ? 0 : green > 255 ? 255 : green;
          blue = blue < 0 ? 0 : blue > 255 ? 255 : blue;
          data[i] = red;
          data[i + 1] = green;
          data[i + 2] = blue;
      }
  };
  Factory.Factory.addGetterSetter(Node_1.Node, 'contrast', 0, Validators.getNumberValidator(), Factory.Factory.afterSetFilter);
  });

  unwrapExports(Contrast);
  var Contrast_1 = Contrast.Contrast;

  var Emboss = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });




  exports.Emboss = function (imageData) {
      var strength = this.embossStrength() * 10, greyLevel = this.embossWhiteLevel() * 255, direction = this.embossDirection(), blend = this.embossBlend(), dirY = 0, dirX = 0, data = imageData.data, w = imageData.width, h = imageData.height, w4 = w * 4, y = h;
      switch (direction) {
          case 'top-left':
              dirY = -1;
              dirX = -1;
              break;
          case 'top':
              dirY = -1;
              dirX = 0;
              break;
          case 'top-right':
              dirY = -1;
              dirX = 1;
              break;
          case 'right':
              dirY = 0;
              dirX = 1;
              break;
          case 'bottom-right':
              dirY = 1;
              dirX = 1;
              break;
          case 'bottom':
              dirY = 1;
              dirX = 0;
              break;
          case 'bottom-left':
              dirY = 1;
              dirX = -1;
              break;
          case 'left':
              dirY = 0;
              dirX = -1;
              break;
          default:
              Util.Util.error('Unknown emboss direction: ' + direction);
      }
      do {
          var offsetY = (y - 1) * w4;
          var otherY = dirY;
          if (y + otherY < 1) {
              otherY = 0;
          }
          if (y + otherY > h) {
              otherY = 0;
          }
          var offsetYOther = (y - 1 + otherY) * w * 4;
          var x = w;
          do {
              var offset = offsetY + (x - 1) * 4;
              var otherX = dirX;
              if (x + otherX < 1) {
                  otherX = 0;
              }
              if (x + otherX > w) {
                  otherX = 0;
              }
              var offsetOther = offsetYOther + (x - 1 + otherX) * 4;
              var dR = data[offset] - data[offsetOther];
              var dG = data[offset + 1] - data[offsetOther + 1];
              var dB = data[offset + 2] - data[offsetOther + 2];
              var dif = dR;
              var absDif = dif > 0 ? dif : -dif;
              var absG = dG > 0 ? dG : -dG;
              var absB = dB > 0 ? dB : -dB;
              if (absG > absDif) {
                  dif = dG;
              }
              if (absB > absDif) {
                  dif = dB;
              }
              dif *= strength;
              if (blend) {
                  var r = data[offset] + dif;
                  var g = data[offset + 1] + dif;
                  var b = data[offset + 2] + dif;
                  data[offset] = r > 255 ? 255 : r < 0 ? 0 : r;
                  data[offset + 1] = g > 255 ? 255 : g < 0 ? 0 : g;
                  data[offset + 2] = b > 255 ? 255 : b < 0 ? 0 : b;
              }
              else {
                  var grey = greyLevel - dif;
                  if (grey < 0) {
                      grey = 0;
                  }
                  else if (grey > 255) {
                      grey = 255;
                  }
                  data[offset] = data[offset + 1] = data[offset + 2] = grey;
              }
          } while (--x);
      } while (--y);
  };
  Factory.Factory.addGetterSetter(Node_1.Node, 'embossStrength', 0.5, Validators.getNumberValidator(), Factory.Factory.afterSetFilter);
  Factory.Factory.addGetterSetter(Node_1.Node, 'embossWhiteLevel', 0.5, Validators.getNumberValidator(), Factory.Factory.afterSetFilter);
  Factory.Factory.addGetterSetter(Node_1.Node, 'embossDirection', 'top-left', null, Factory.Factory.afterSetFilter);
  Factory.Factory.addGetterSetter(Node_1.Node, 'embossBlend', false, null, Factory.Factory.afterSetFilter);
  });

  unwrapExports(Emboss);
  var Emboss_1 = Emboss.Emboss;

  var Enhance = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });



  function remap(fromValue, fromMin, fromMax, toMin, toMax) {
      var fromRange = fromMax - fromMin, toRange = toMax - toMin, toValue;
      if (fromRange === 0) {
          return toMin + toRange / 2;
      }
      if (toRange === 0) {
          return toMin;
      }
      toValue = (fromValue - fromMin) / fromRange;
      toValue = toRange * toValue + toMin;
      return toValue;
  }
  exports.Enhance = function (imageData) {
      var data = imageData.data, nSubPixels = data.length, rMin = data[0], rMax = rMin, r, gMin = data[1], gMax = gMin, g, bMin = data[2], bMax = bMin, b, i;
      var enhanceAmount = this.enhance();
      if (enhanceAmount === 0) {
          return;
      }
      for (i = 0; i < nSubPixels; i += 4) {
          r = data[i + 0];
          if (r < rMin) {
              rMin = r;
          }
          else if (r > rMax) {
              rMax = r;
          }
          g = data[i + 1];
          if (g < gMin) {
              gMin = g;
          }
          else if (g > gMax) {
              gMax = g;
          }
          b = data[i + 2];
          if (b < bMin) {
              bMin = b;
          }
          else if (b > bMax) {
              bMax = b;
          }
      }
      if (rMax === rMin) {
          rMax = 255;
          rMin = 0;
      }
      if (gMax === gMin) {
          gMax = 255;
          gMin = 0;
      }
      if (bMax === bMin) {
          bMax = 255;
          bMin = 0;
      }
      var rMid, rGoalMax, rGoalMin, gMid, gGoalMax, gGoalMin, bMid, bGoalMax, bGoalMin;
      if (enhanceAmount > 0) {
          rGoalMax = rMax + enhanceAmount * (255 - rMax);
          rGoalMin = rMin - enhanceAmount * (rMin - 0);
          gGoalMax = gMax + enhanceAmount * (255 - gMax);
          gGoalMin = gMin - enhanceAmount * (gMin - 0);
          bGoalMax = bMax + enhanceAmount * (255 - bMax);
          bGoalMin = bMin - enhanceAmount * (bMin - 0);
      }
      else {
          rMid = (rMax + rMin) * 0.5;
          rGoalMax = rMax + enhanceAmount * (rMax - rMid);
          rGoalMin = rMin + enhanceAmount * (rMin - rMid);
          gMid = (gMax + gMin) * 0.5;
          gGoalMax = gMax + enhanceAmount * (gMax - gMid);
          gGoalMin = gMin + enhanceAmount * (gMin - gMid);
          bMid = (bMax + bMin) * 0.5;
          bGoalMax = bMax + enhanceAmount * (bMax - bMid);
          bGoalMin = bMin + enhanceAmount * (bMin - bMid);
      }
      for (i = 0; i < nSubPixels; i += 4) {
          data[i + 0] = remap(data[i + 0], rMin, rMax, rGoalMin, rGoalMax);
          data[i + 1] = remap(data[i + 1], gMin, gMax, gGoalMin, gGoalMax);
          data[i + 2] = remap(data[i + 2], bMin, bMax, bGoalMin, bGoalMax);
      }
  };
  Factory.Factory.addGetterSetter(Node_1.Node, 'enhance', 0, Validators.getNumberValidator(), Factory.Factory.afterSetFilter);
  });

  unwrapExports(Enhance);
  var Enhance_1 = Enhance.Enhance;

  var Grayscale = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.Grayscale = function (imageData) {
      var data = imageData.data, len = data.length, i, brightness;
      for (i = 0; i < len; i += 4) {
          brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
          data[i] = brightness;
          data[i + 1] = brightness;
          data[i + 2] = brightness;
      }
  };
  });

  unwrapExports(Grayscale);
  var Grayscale_1 = Grayscale.Grayscale;

  var HSL = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });



  Factory.Factory.addGetterSetter(Node_1.Node, 'hue', 0, Validators.getNumberValidator(), Factory.Factory.afterSetFilter);
  Factory.Factory.addGetterSetter(Node_1.Node, 'saturation', 0, Validators.getNumberValidator(), Factory.Factory.afterSetFilter);
  Factory.Factory.addGetterSetter(Node_1.Node, 'luminance', 0, Validators.getNumberValidator(), Factory.Factory.afterSetFilter);
  exports.HSL = function (imageData) {
      var data = imageData.data, nPixels = data.length, v = 1, s = Math.pow(2, this.saturation()), h = Math.abs(this.hue() + 360) % 360, l = this.luminance() * 127, i;
      var vsu = v * s * Math.cos((h * Math.PI) / 180), vsw = v * s * Math.sin((h * Math.PI) / 180);
      var rr = 0.299 * v + 0.701 * vsu + 0.167 * vsw, rg = 0.587 * v - 0.587 * vsu + 0.33 * vsw, rb = 0.114 * v - 0.114 * vsu - 0.497 * vsw;
      var gr = 0.299 * v - 0.299 * vsu - 0.328 * vsw, gg = 0.587 * v + 0.413 * vsu + 0.035 * vsw, gb = 0.114 * v - 0.114 * vsu + 0.293 * vsw;
      var br = 0.299 * v - 0.3 * vsu + 1.25 * vsw, bg = 0.587 * v - 0.586 * vsu - 1.05 * vsw, bb = 0.114 * v + 0.886 * vsu - 0.2 * vsw;
      var r, g, b, a;
      for (i = 0; i < nPixels; i += 4) {
          r = data[i + 0];
          g = data[i + 1];
          b = data[i + 2];
          a = data[i + 3];
          data[i + 0] = rr * r + rg * g + rb * b + l;
          data[i + 1] = gr * r + gg * g + gb * b + l;
          data[i + 2] = br * r + bg * g + bb * b + l;
          data[i + 3] = a;
      }
  };
  });

  unwrapExports(HSL);
  var HSL_1 = HSL.HSL;

  var HSV = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });



  exports.HSV = function (imageData) {
      var data = imageData.data, nPixels = data.length, v = Math.pow(2, this.value()), s = Math.pow(2, this.saturation()), h = Math.abs(this.hue() + 360) % 360, i;
      var vsu = v * s * Math.cos((h * Math.PI) / 180), vsw = v * s * Math.sin((h * Math.PI) / 180);
      var rr = 0.299 * v + 0.701 * vsu + 0.167 * vsw, rg = 0.587 * v - 0.587 * vsu + 0.33 * vsw, rb = 0.114 * v - 0.114 * vsu - 0.497 * vsw;
      var gr = 0.299 * v - 0.299 * vsu - 0.328 * vsw, gg = 0.587 * v + 0.413 * vsu + 0.035 * vsw, gb = 0.114 * v - 0.114 * vsu + 0.293 * vsw;
      var br = 0.299 * v - 0.3 * vsu + 1.25 * vsw, bg = 0.587 * v - 0.586 * vsu - 1.05 * vsw, bb = 0.114 * v + 0.886 * vsu - 0.2 * vsw;
      var r, g, b, a;
      for (i = 0; i < nPixels; i += 4) {
          r = data[i + 0];
          g = data[i + 1];
          b = data[i + 2];
          a = data[i + 3];
          data[i + 0] = rr * r + rg * g + rb * b;
          data[i + 1] = gr * r + gg * g + gb * b;
          data[i + 2] = br * r + bg * g + bb * b;
          data[i + 3] = a;
      }
  };
  Factory.Factory.addGetterSetter(Node_1.Node, 'hue', 0, Validators.getNumberValidator(), Factory.Factory.afterSetFilter);
  Factory.Factory.addGetterSetter(Node_1.Node, 'saturation', 0, Validators.getNumberValidator(), Factory.Factory.afterSetFilter);
  Factory.Factory.addGetterSetter(Node_1.Node, 'value', 0, Validators.getNumberValidator(), Factory.Factory.afterSetFilter);
  });

  unwrapExports(HSV);
  var HSV_1 = HSV.HSV;

  var Invert = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.Invert = function (imageData) {
      var data = imageData.data, len = data.length, i;
      for (i = 0; i < len; i += 4) {
          data[i] = 255 - data[i];
          data[i + 1] = 255 - data[i + 1];
          data[i + 2] = 255 - data[i + 2];
      }
  };
  });

  unwrapExports(Invert);
  var Invert_1 = Invert.Invert;

  var Kaleidoscope = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });




  var ToPolar = function (src, dst, opt) {
      var srcPixels = src.data, dstPixels = dst.data, xSize = src.width, ySize = src.height, xMid = opt.polarCenterX || xSize / 2, yMid = opt.polarCenterY || ySize / 2, i, x, y, r = 0, g = 0, b = 0, a = 0;
      var rad, rMax = Math.sqrt(xMid * xMid + yMid * yMid);
      x = xSize - xMid;
      y = ySize - yMid;
      rad = Math.sqrt(x * x + y * y);
      rMax = rad > rMax ? rad : rMax;
      var rSize = ySize, tSize = xSize, radius, theta;
      var conversion = ((360 / tSize) * Math.PI) / 180, sin, cos;
      for (theta = 0; theta < tSize; theta += 1) {
          sin = Math.sin(theta * conversion);
          cos = Math.cos(theta * conversion);
          for (radius = 0; radius < rSize; radius += 1) {
              x = Math.floor(xMid + ((rMax * radius) / rSize) * cos);
              y = Math.floor(yMid + ((rMax * radius) / rSize) * sin);
              i = (y * xSize + x) * 4;
              r = srcPixels[i + 0];
              g = srcPixels[i + 1];
              b = srcPixels[i + 2];
              a = srcPixels[i + 3];
              i = (theta + radius * xSize) * 4;
              dstPixels[i + 0] = r;
              dstPixels[i + 1] = g;
              dstPixels[i + 2] = b;
              dstPixels[i + 3] = a;
          }
      }
  };
  var FromPolar = function (src, dst, opt) {
      var srcPixels = src.data, dstPixels = dst.data, xSize = src.width, ySize = src.height, xMid = opt.polarCenterX || xSize / 2, yMid = opt.polarCenterY || ySize / 2, i, x, y, dx, dy, r = 0, g = 0, b = 0, a = 0;
      var rad, rMax = Math.sqrt(xMid * xMid + yMid * yMid);
      x = xSize - xMid;
      y = ySize - yMid;
      rad = Math.sqrt(x * x + y * y);
      rMax = rad > rMax ? rad : rMax;
      var rSize = ySize, tSize = xSize, radius, theta, phaseShift = opt.polarRotation || 0;
      var x1, y1;
      for (x = 0; x < xSize; x += 1) {
          for (y = 0; y < ySize; y += 1) {
              dx = x - xMid;
              dy = y - yMid;
              radius = (Math.sqrt(dx * dx + dy * dy) * rSize) / rMax;
              theta = ((Math.atan2(dy, dx) * 180) / Math.PI + 360 + phaseShift) % 360;
              theta = (theta * tSize) / 360;
              x1 = Math.floor(theta);
              y1 = Math.floor(radius);
              i = (y1 * xSize + x1) * 4;
              r = srcPixels[i + 0];
              g = srcPixels[i + 1];
              b = srcPixels[i + 2];
              a = srcPixels[i + 3];
              i = (y * xSize + x) * 4;
              dstPixels[i + 0] = r;
              dstPixels[i + 1] = g;
              dstPixels[i + 2] = b;
              dstPixels[i + 3] = a;
          }
      }
  };
  exports.Kaleidoscope = function (imageData) {
      var xSize = imageData.width, ySize = imageData.height;
      var x, y, xoff, i, r, g, b, a, srcPos, dstPos;
      var power = Math.round(this.kaleidoscopePower());
      var angle = Math.round(this.kaleidoscopeAngle());
      var offset = Math.floor((xSize * (angle % 360)) / 360);
      if (power < 1) {
          return;
      }
      var tempCanvas = Util.Util.createCanvasElement();
      tempCanvas.width = xSize;
      tempCanvas.height = ySize;
      var scratchData = tempCanvas
          .getContext('2d')
          .getImageData(0, 0, xSize, ySize);
      ToPolar(imageData, scratchData, {
          polarCenterX: xSize / 2,
          polarCenterY: ySize / 2
      });
      var minSectionSize = xSize / Math.pow(2, power);
      while (minSectionSize <= 8) {
          minSectionSize = minSectionSize * 2;
          power -= 1;
      }
      minSectionSize = Math.ceil(minSectionSize);
      var sectionSize = minSectionSize;
      var xStart = 0, xEnd = sectionSize, xDelta = 1;
      if (offset + minSectionSize > xSize) {
          xStart = sectionSize;
          xEnd = 0;
          xDelta = -1;
      }
      for (y = 0; y < ySize; y += 1) {
          for (x = xStart; x !== xEnd; x += xDelta) {
              xoff = Math.round(x + offset) % xSize;
              srcPos = (xSize * y + xoff) * 4;
              r = scratchData.data[srcPos + 0];
              g = scratchData.data[srcPos + 1];
              b = scratchData.data[srcPos + 2];
              a = scratchData.data[srcPos + 3];
              dstPos = (xSize * y + x) * 4;
              scratchData.data[dstPos + 0] = r;
              scratchData.data[dstPos + 1] = g;
              scratchData.data[dstPos + 2] = b;
              scratchData.data[dstPos + 3] = a;
          }
      }
      for (y = 0; y < ySize; y += 1) {
          sectionSize = Math.floor(minSectionSize);
          for (i = 0; i < power; i += 1) {
              for (x = 0; x < sectionSize + 1; x += 1) {
                  srcPos = (xSize * y + x) * 4;
                  r = scratchData.data[srcPos + 0];
                  g = scratchData.data[srcPos + 1];
                  b = scratchData.data[srcPos + 2];
                  a = scratchData.data[srcPos + 3];
                  dstPos = (xSize * y + sectionSize * 2 - x - 1) * 4;
                  scratchData.data[dstPos + 0] = r;
                  scratchData.data[dstPos + 1] = g;
                  scratchData.data[dstPos + 2] = b;
                  scratchData.data[dstPos + 3] = a;
              }
              sectionSize *= 2;
          }
      }
      FromPolar(scratchData, imageData, { polarRotation: 0 });
  };
  Factory.Factory.addGetterSetter(Node_1.Node, 'kaleidoscopePower', 2, Validators.getNumberValidator(), Factory.Factory.afterSetFilter);
  Factory.Factory.addGetterSetter(Node_1.Node, 'kaleidoscopeAngle', 0, Validators.getNumberValidator(), Factory.Factory.afterSetFilter);
  });

  unwrapExports(Kaleidoscope);
  var Kaleidoscope_1 = Kaleidoscope.Kaleidoscope;

  var Mask = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });



  function pixelAt(idata, x, y) {
      var idx = (y * idata.width + x) * 4;
      var d = [];
      d.push(idata.data[idx++], idata.data[idx++], idata.data[idx++], idata.data[idx++]);
      return d;
  }
  function rgbDistance(p1, p2) {
      return Math.sqrt(Math.pow(p1[0] - p2[0], 2) +
          Math.pow(p1[1] - p2[1], 2) +
          Math.pow(p1[2] - p2[2], 2));
  }
  function rgbMean(pTab) {
      var m = [0, 0, 0];
      for (var i = 0; i < pTab.length; i++) {
          m[0] += pTab[i][0];
          m[1] += pTab[i][1];
          m[2] += pTab[i][2];
      }
      m[0] /= pTab.length;
      m[1] /= pTab.length;
      m[2] /= pTab.length;
      return m;
  }
  function backgroundMask(idata, threshold) {
      var rgbv_no = pixelAt(idata, 0, 0);
      var rgbv_ne = pixelAt(idata, idata.width - 1, 0);
      var rgbv_so = pixelAt(idata, 0, idata.height - 1);
      var rgbv_se = pixelAt(idata, idata.width - 1, idata.height - 1);
      var thres = threshold || 10;
      if (rgbDistance(rgbv_no, rgbv_ne) < thres &&
          rgbDistance(rgbv_ne, rgbv_se) < thres &&
          rgbDistance(rgbv_se, rgbv_so) < thres &&
          rgbDistance(rgbv_so, rgbv_no) < thres) {
          var mean = rgbMean([rgbv_ne, rgbv_no, rgbv_se, rgbv_so]);
          var mask = [];
          for (var i = 0; i < idata.width * idata.height; i++) {
              var d = rgbDistance(mean, [
                  idata.data[i * 4],
                  idata.data[i * 4 + 1],
                  idata.data[i * 4 + 2]
              ]);
              mask[i] = d < thres ? 0 : 255;
          }
          return mask;
      }
  }
  function applyMask(idata, mask) {
      for (var i = 0; i < idata.width * idata.height; i++) {
          idata.data[4 * i + 3] = mask[i];
      }
  }
  function erodeMask(mask, sw, sh) {
      var weights = [1, 1, 1, 1, 0, 1, 1, 1, 1];
      var side = Math.round(Math.sqrt(weights.length));
      var halfSide = Math.floor(side / 2);
      var maskResult = [];
      for (var y = 0; y < sh; y++) {
          for (var x = 0; x < sw; x++) {
              var so = y * sw + x;
              var a = 0;
              for (var cy = 0; cy < side; cy++) {
                  for (var cx = 0; cx < side; cx++) {
                      var scy = y + cy - halfSide;
                      var scx = x + cx - halfSide;
                      if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                          var srcOff = scy * sw + scx;
                          var wt = weights[cy * side + cx];
                          a += mask[srcOff] * wt;
                      }
                  }
              }
              maskResult[so] = a === 255 * 8 ? 255 : 0;
          }
      }
      return maskResult;
  }
  function dilateMask(mask, sw, sh) {
      var weights = [1, 1, 1, 1, 1, 1, 1, 1, 1];
      var side = Math.round(Math.sqrt(weights.length));
      var halfSide = Math.floor(side / 2);
      var maskResult = [];
      for (var y = 0; y < sh; y++) {
          for (var x = 0; x < sw; x++) {
              var so = y * sw + x;
              var a = 0;
              for (var cy = 0; cy < side; cy++) {
                  for (var cx = 0; cx < side; cx++) {
                      var scy = y + cy - halfSide;
                      var scx = x + cx - halfSide;
                      if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                          var srcOff = scy * sw + scx;
                          var wt = weights[cy * side + cx];
                          a += mask[srcOff] * wt;
                      }
                  }
              }
              maskResult[so] = a >= 255 * 4 ? 255 : 0;
          }
      }
      return maskResult;
  }
  function smoothEdgeMask(mask, sw, sh) {
      var weights = [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9];
      var side = Math.round(Math.sqrt(weights.length));
      var halfSide = Math.floor(side / 2);
      var maskResult = [];
      for (var y = 0; y < sh; y++) {
          for (var x = 0; x < sw; x++) {
              var so = y * sw + x;
              var a = 0;
              for (var cy = 0; cy < side; cy++) {
                  for (var cx = 0; cx < side; cx++) {
                      var scy = y + cy - halfSide;
                      var scx = x + cx - halfSide;
                      if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                          var srcOff = scy * sw + scx;
                          var wt = weights[cy * side + cx];
                          a += mask[srcOff] * wt;
                      }
                  }
              }
              maskResult[so] = a;
          }
      }
      return maskResult;
  }
  exports.Mask = function (imageData) {
      var threshold = this.threshold(), mask = backgroundMask(imageData, threshold);
      if (mask) {
          mask = erodeMask(mask, imageData.width, imageData.height);
          mask = dilateMask(mask, imageData.width, imageData.height);
          mask = smoothEdgeMask(mask, imageData.width, imageData.height);
          applyMask(imageData, mask);
      }
      return imageData;
  };
  Factory.Factory.addGetterSetter(Node_1.Node, 'threshold', 0, Validators.getNumberValidator(), Factory.Factory.afterSetFilter);
  });

  unwrapExports(Mask);
  var Mask_1 = Mask.Mask;

  var Noise = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });



  exports.Noise = function (imageData) {
      var amount = this.noise() * 255, data = imageData.data, nPixels = data.length, half = amount / 2, i;
      for (i = 0; i < nPixels; i += 4) {
          data[i + 0] += half - 2 * half * Math.random();
          data[i + 1] += half - 2 * half * Math.random();
          data[i + 2] += half - 2 * half * Math.random();
      }
  };
  Factory.Factory.addGetterSetter(Node_1.Node, 'noise', 0.2, Validators.getNumberValidator(), Factory.Factory.afterSetFilter);
  });

  unwrapExports(Noise);
  var Noise_1 = Noise.Noise;

  var Pixelate = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });




  exports.Pixelate = function (imageData) {
      var pixelSize = Math.ceil(this.pixelSize()), width = imageData.width, height = imageData.height, x, y, i, red, green, blue, alpha, nBinsX = Math.ceil(width / pixelSize), nBinsY = Math.ceil(height / pixelSize), xBinStart, xBinEnd, yBinStart, yBinEnd, xBin, yBin, pixelsInBin, data = imageData.data;
      if (pixelSize <= 0) {
          Util.Util.error('pixelSize value can not be <= 0');
          return;
      }
      for (xBin = 0; xBin < nBinsX; xBin += 1) {
          for (yBin = 0; yBin < nBinsY; yBin += 1) {
              red = 0;
              green = 0;
              blue = 0;
              alpha = 0;
              xBinStart = xBin * pixelSize;
              xBinEnd = xBinStart + pixelSize;
              yBinStart = yBin * pixelSize;
              yBinEnd = yBinStart + pixelSize;
              pixelsInBin = 0;
              for (x = xBinStart; x < xBinEnd; x += 1) {
                  if (x >= width) {
                      continue;
                  }
                  for (y = yBinStart; y < yBinEnd; y += 1) {
                      if (y >= height) {
                          continue;
                      }
                      i = (width * y + x) * 4;
                      red += data[i + 0];
                      green += data[i + 1];
                      blue += data[i + 2];
                      alpha += data[i + 3];
                      pixelsInBin += 1;
                  }
              }
              red = red / pixelsInBin;
              green = green / pixelsInBin;
              blue = blue / pixelsInBin;
              alpha = alpha / pixelsInBin;
              for (x = xBinStart; x < xBinEnd; x += 1) {
                  if (x >= width) {
                      continue;
                  }
                  for (y = yBinStart; y < yBinEnd; y += 1) {
                      if (y >= height) {
                          continue;
                      }
                      i = (width * y + x) * 4;
                      data[i + 0] = red;
                      data[i + 1] = green;
                      data[i + 2] = blue;
                      data[i + 3] = alpha;
                  }
              }
          }
      }
  };
  Factory.Factory.addGetterSetter(Node_1.Node, 'pixelSize', 8, Validators.getNumberValidator(), Factory.Factory.afterSetFilter);
  });

  unwrapExports(Pixelate);
  var Pixelate_1 = Pixelate.Pixelate;

  var Posterize = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });



  exports.Posterize = function (imageData) {
      var levels = Math.round(this.levels() * 254) + 1, data = imageData.data, len = data.length, scale = 255 / levels, i;
      for (i = 0; i < len; i += 1) {
          data[i] = Math.floor(data[i] / scale) * scale;
      }
  };
  Factory.Factory.addGetterSetter(Node_1.Node, 'levels', 0.5, Validators.getNumberValidator(), Factory.Factory.afterSetFilter);
  });

  unwrapExports(Posterize);
  var Posterize_1 = Posterize.Posterize;

  var RGB = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });



  exports.RGB = function (imageData) {
      var data = imageData.data, nPixels = data.length, red = this.red(), green = this.green(), blue = this.blue(), i, brightness;
      for (i = 0; i < nPixels; i += 4) {
          brightness =
              (0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2]) / 255;
          data[i] = brightness * red;
          data[i + 1] = brightness * green;
          data[i + 2] = brightness * blue;
          data[i + 3] = data[i + 3];
      }
  };
  Factory.Factory.addGetterSetter(Node_1.Node, 'red', 0, function (val) {
      this._filterUpToDate = false;
      if (val > 255) {
          return 255;
      }
      else if (val < 0) {
          return 0;
      }
      else {
          return Math.round(val);
      }
  });
  Factory.Factory.addGetterSetter(Node_1.Node, 'green', 0, function (val) {
      this._filterUpToDate = false;
      if (val > 255) {
          return 255;
      }
      else if (val < 0) {
          return 0;
      }
      else {
          return Math.round(val);
      }
  });
  Factory.Factory.addGetterSetter(Node_1.Node, 'blue', 0, Validators.RGBComponent, Factory.Factory.afterSetFilter);
  });

  unwrapExports(RGB);
  var RGB_1 = RGB.RGB;

  var RGBA = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });



  exports.RGBA = function (imageData) {
      var data = imageData.data, nPixels = data.length, red = this.red(), green = this.green(), blue = this.blue(), alpha = this.alpha(), i, ia;
      for (i = 0; i < nPixels; i += 4) {
          ia = 1 - alpha;
          data[i] = red * alpha + data[i] * ia;
          data[i + 1] = green * alpha + data[i + 1] * ia;
          data[i + 2] = blue * alpha + data[i + 2] * ia;
      }
  };
  Factory.Factory.addGetterSetter(Node_1.Node, 'red', 0, function (val) {
      this._filterUpToDate = false;
      if (val > 255) {
          return 255;
      }
      else if (val < 0) {
          return 0;
      }
      else {
          return Math.round(val);
      }
  });
  Factory.Factory.addGetterSetter(Node_1.Node, 'green', 0, function (val) {
      this._filterUpToDate = false;
      if (val > 255) {
          return 255;
      }
      else if (val < 0) {
          return 0;
      }
      else {
          return Math.round(val);
      }
  });
  Factory.Factory.addGetterSetter(Node_1.Node, 'blue', 0, Validators.RGBComponent, Factory.Factory.afterSetFilter);
  Factory.Factory.addGetterSetter(Node_1.Node, 'alpha', 1, function (val) {
      this._filterUpToDate = false;
      if (val > 1) {
          return 1;
      }
      else if (val < 0) {
          return 0;
      }
      else {
          return val;
      }
  });
  });

  unwrapExports(RGBA);
  var RGBA_1 = RGBA.RGBA;

  var Sepia = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.Sepia = function (imageData) {
      var data = imageData.data, nPixels = data.length, i, r, g, b;
      for (i = 0; i < nPixels; i += 4) {
          r = data[i + 0];
          g = data[i + 1];
          b = data[i + 2];
          data[i + 0] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
          data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
          data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
      }
  };
  });

  unwrapExports(Sepia);
  var Sepia_1 = Sepia.Sepia;

  var Solarize = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.Solarize = function (imageData) {
      var data = imageData.data, w = imageData.width, h = imageData.height, w4 = w * 4, y = h;
      do {
          var offsetY = (y - 1) * w4;
          var x = w;
          do {
              var offset = offsetY + (x - 1) * 4;
              var r = data[offset];
              var g = data[offset + 1];
              var b = data[offset + 2];
              if (r > 127) {
                  r = 255 - r;
              }
              if (g > 127) {
                  g = 255 - g;
              }
              if (b > 127) {
                  b = 255 - b;
              }
              data[offset] = r;
              data[offset + 1] = g;
              data[offset + 2] = b;
          } while (--x);
      } while (--y);
  };
  });

  unwrapExports(Solarize);
  var Solarize_1 = Solarize.Solarize;

  var Threshold = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });



  exports.Threshold = function (imageData) {
      var level = this.threshold() * 255, data = imageData.data, len = data.length, i;
      for (i = 0; i < len; i += 1) {
          data[i] = data[i] < level ? 0 : 255;
      }
  };
  Factory.Factory.addGetterSetter(Node_1.Node, 'threshold', 0.5, Validators.getNumberValidator(), Factory.Factory.afterSetFilter);
  });

  unwrapExports(Threshold);
  var Threshold_1 = Threshold.Threshold;

  var _FullInternals = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });





































  exports.Konva = _CoreInternals.Konva.Util._assign(_CoreInternals.Konva, {
      Arc: Arc_1.Arc,
      Arrow: Arrow_1.Arrow,
      Circle: Circle_1.Circle,
      Ellipse: Ellipse_1.Ellipse,
      Image: Image_1.Image,
      Label: Label_1.Label,
      Tag: Label_1.Tag,
      Line: Line_1.Line,
      Path: Path_1.Path,
      Rect: Rect_1.Rect,
      RegularPolygon: RegularPolygon_1.RegularPolygon,
      Ring: Ring_1.Ring,
      Sprite: Sprite_1.Sprite,
      Star: Star_1.Star,
      Text: Text_1.Text,
      TextPath: TextPath_1.TextPath,
      Transformer: Transformer_1.Transformer,
      Wedge: Wedge_1.Wedge,
      Filters: {
          Blur: Blur.Blur,
          Brighten: Brighten.Brighten,
          Contrast: Contrast.Contrast,
          Emboss: Emboss.Emboss,
          Enhance: Enhance.Enhance,
          Grayscale: Grayscale.Grayscale,
          HSL: HSL.HSL,
          HSV: HSV.HSV,
          Invert: Invert.Invert,
          Kaleidoscope: Kaleidoscope.Kaleidoscope,
          Mask: Mask.Mask,
          Noise: Noise.Noise,
          Pixelate: Pixelate.Pixelate,
          Posterize: Posterize.Posterize,
          RGB: RGB.RGB,
          RGBA: RGBA.RGBA,
          Sepia: Sepia.Sepia,
          Solarize: Solarize.Solarize,
          Threshold: Threshold.Threshold
      }
  });
  });

  unwrapExports(_FullInternals);
  var _FullInternals_1 = _FullInternals.Konva;

  var lib = createCommonjsModule(function (module, exports) {
  var Konva = _FullInternals.Konva;
  Konva._injectGlobal(Konva);
  exports['default'] = Konva;
  module.exports = exports['default'];
  });
  var lib_1 = lib.Animation;

  var vueKonva = createCommonjsModule(function (module, exports) {
  /*!
   * vue-konva v2.1.0 - https://github.com/konvajs/vue-konva#readme
   * MIT Licensed
   */
  (function webpackUniversalModuleDefinition(root, factory) {
  	module.exports = factory(Vue, lib);
  })(commonjsGlobal, function(__WEBPACK_EXTERNAL_MODULE__0__, __WEBPACK_EXTERNAL_MODULE__2__) {
  return /******/ (function(modules) { // webpackBootstrap
  /******/ 	// The module cache
  /******/ 	var installedModules = {};
  /******/
  /******/ 	// The require function
  /******/ 	function __webpack_require__(moduleId) {
  /******/
  /******/ 		// Check if module is in cache
  /******/ 		if(installedModules[moduleId]) {
  /******/ 			return installedModules[moduleId].exports;
  /******/ 		}
  /******/ 		// Create a new module (and put it into the cache)
  /******/ 		var module = installedModules[moduleId] = {
  /******/ 			i: moduleId,
  /******/ 			l: false,
  /******/ 			exports: {}
  /******/ 		};
  /******/
  /******/ 		// Execute the module function
  /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
  /******/
  /******/ 		// Flag the module as loaded
  /******/ 		module.l = true;
  /******/
  /******/ 		// Return the exports of the module
  /******/ 		return module.exports;
  /******/ 	}
  /******/
  /******/
  /******/ 	// expose the modules object (__webpack_modules__)
  /******/ 	__webpack_require__.m = modules;
  /******/
  /******/ 	// expose the module cache
  /******/ 	__webpack_require__.c = installedModules;
  /******/
  /******/ 	// define getter function for harmony exports
  /******/ 	__webpack_require__.d = function(exports, name, getter) {
  /******/ 		if(!__webpack_require__.o(exports, name)) {
  /******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
  /******/ 		}
  /******/ 	};
  /******/
  /******/ 	// define __esModule on exports
  /******/ 	__webpack_require__.r = function(exports) {
  /******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
  /******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
  /******/ 		}
  /******/ 		Object.defineProperty(exports, '__esModule', { value: true });
  /******/ 	};
  /******/
  /******/ 	// create a fake namespace object
  /******/ 	// mode & 1: value is a module id, require it
  /******/ 	// mode & 2: merge all properties of value into the ns
  /******/ 	// mode & 4: return value when already ns object
  /******/ 	// mode & 8|1: behave like require
  /******/ 	__webpack_require__.t = function(value, mode) {
  /******/ 		if(mode & 1) value = __webpack_require__(value);
  /******/ 		if(mode & 8) return value;
  /******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
  /******/ 		var ns = Object.create(null);
  /******/ 		__webpack_require__.r(ns);
  /******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
  /******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
  /******/ 		return ns;
  /******/ 	};
  /******/
  /******/ 	// getDefaultExport function for compatibility with non-harmony modules
  /******/ 	__webpack_require__.n = function(module) {
  /******/ 		var getter = module && module.__esModule ?
  /******/ 			function getDefault() { return module['default']; } :
  /******/ 			function getModuleExports() { return module; };
  /******/ 		__webpack_require__.d(getter, 'a', getter);
  /******/ 		return getter;
  /******/ 	};
  /******/
  /******/ 	// Object.prototype.hasOwnProperty.call
  /******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
  /******/
  /******/ 	// __webpack_public_path__
  /******/ 	__webpack_require__.p = "";
  /******/
  /******/
  /******/ 	// Load entry module and return exports
  /******/ 	return __webpack_require__(__webpack_require__.s = 1);
  /******/ })
  /************************************************************************/
  /******/ ([
  /* 0 */
  /***/ (function(module, exports) {

  module.exports = __WEBPACK_EXTERNAL_MODULE__0__;

  /***/ }),
  /* 1 */
  /***/ (function(module, exports, __webpack_require__) {

  module.exports = __webpack_require__(3);


  /***/ }),
  /* 2 */
  /***/ (function(module, exports) {

  module.exports = __WEBPACK_EXTERNAL_MODULE__2__;

  /***/ }),
  /* 3 */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  __webpack_require__.r(__webpack_exports__);

  // EXTERNAL MODULE: external {"root":"Vue","commonjs2":"vue","commonjs":"vue","amd":"vue"}
  var external_root_Vue_commonjs2_vue_commonjs_vue_amd_vue_ = __webpack_require__(0);
  var external_root_Vue_commonjs2_vue_commonjs_vue_amd_vue_default = /*#__PURE__*/__webpack_require__.n(external_root_Vue_commonjs2_vue_commonjs_vue_amd_vue_);

  // CONCATENATED MODULE: ./src/utils/updatePicture.js
  // adapted FROM: https://github.com/lavrton/react-konva/blob/master/src/react-konva-fiber.js

  function updatePicture(node) {
    var drawingNode = node.getLayer() || node.getStage();
    drawingNode && drawingNode.batchDraw();
  }
  // CONCATENATED MODULE: ./src/utils/applyNodeProps.js
  // adapted FROM: https://github.com/lavrton/react-konva/blob/master/src/react-konva-fiber.js



  var propsToSkip = { key: true, style: true, elm: true, isRootInsert: true };
  var EVENTS_NAMESPACE = '.vue-konva-event';

  function applyNodeProps(vueComponent) {
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var oldProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var instance = vueComponent._konvaNode;
    var updatedProps = {};
    var hasUpdates = false;
    for (var key in oldProps) {
      if (propsToSkip[key]) {
        continue;
      }
      var isEvent = key.slice(0, 2) === 'on';
      var propChanged = oldProps[key] !== props[key];
      if (isEvent && propChanged) {
        var eventName = key.substr(2).toLowerCase();
        if (eventName.substr(0, 7) === 'content') {
          eventName = 'content' + eventName.substr(7, 1).toUpperCase() + eventName.substr(8);
        }
        instance.off(eventName + EVENTS_NAMESPACE, oldProps[key]);
      }
      var toRemove = !props.hasOwnProperty(key);
      if (toRemove) {
        instance.setAttr(key, undefined);
      }
    }
    for (var _key in props) {
      if (propsToSkip[_key]) {
        continue;
      }
      var _isEvent = _key.slice(0, 2) === 'on';
      var toAdd = oldProps[_key] !== props[_key];
      if (_isEvent && toAdd) {
        var _eventName = _key.substr(2).toLowerCase();
        if (_eventName.substr(0, 7) === 'content') {
          _eventName = 'content' + _eventName.substr(7, 1).toUpperCase() + _eventName.substr(8);
        }
        if (props[_key]) {
          instance.off(_eventName + EVENTS_NAMESPACE);
          instance.on(_eventName + EVENTS_NAMESPACE, props[_key]);
        }
      }
      if (!_isEvent && props[_key] !== oldProps[_key]) {
        hasUpdates = true;
        updatedProps[_key] = props[_key];
      }
    }

    if (hasUpdates) {
      instance.setAttrs(updatedProps);
      updatePicture(instance);
    }
  }
  // CONCATENATED MODULE: ./src/utils/index.js



  var componentPrefix = 'v';
  var konvaNodeMarker = '_konvaNode';

  function createListener(obj) {
    var output = {};
    Object.keys(obj).forEach(function (eventName) {
      output['on' + eventName] = obj[eventName];
    });
    return output;
  }

  function findParentKonva(instance) {
    function re(instance) {
      if (instance._konvaNode) {
        return instance;
      }
      if (instance.$parent) {
        return re(instance.$parent);
      }
      return {};
    }
    return re(instance.$parent);
  }

  function findKonvaNode(instance) {
    if (instance.$options[konvaNodeMarker]) {
      return instance.getNode();
    } else if (instance.$children.length === 0) {
      return null;
    } else {
      return findKonvaNode(instance.$children[0]);
    }
  }


  // CONCATENATED MODULE: ./src/components/Stage.js
  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };




  /* harmony default export */ var Stage = (external_root_Vue_commonjs2_vue_commonjs_vue_amd_vue_default.a.component('v-stage', {
    render: function render(createElement) {
      return createElement('div', this.$slots.default);
    },
    watch: {
      config: {
        handler: function handler(val) {
          this.uploadKonva();
        },

        deep: true
      }
    },
    props: {
      config: {
        type: Object,
        default: function _default() {
          return {};
        }
      }
    },

    created: function created() {
      this._konvaNode = new window.Konva.Stage({
        width: this.config.width,
        height: this.config.height,
        // create fake container, later it will be replaced with real div on the page
        container: document.createElement('div')
      });
    },
    mounted: function mounted() {
      this.$el.innerHTML = '';
      this._konvaNode.container(this.$el);
      this.uploadKonva();
    },
    updated: function updated() {
      this.uploadKonva();
    },
    beforeDestroy: function beforeDestroy() {
      this._konvaNode.destroy();
    },

    methods: {
      getNode: function getNode() {
        return this._konvaNode;
      },
      getStage: function getStage() {
        return this._konvaNode;
      },
      uploadKonva: function uploadKonva() {
        var oldProps = this.oldProps || {};
        var props = _extends({}, this.$attrs, this.config, createListener(this.$listeners));
        applyNodeProps(this, props, oldProps);
        this.oldProps = props;
      }
    }
  }));
  // CONCATENATED MODULE: ./src/components/KonvaNode.js
  var KonvaNode_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };



  var KonvaNode_EVENTS_NAMESPACE = '.vue-konva-event';

  /* harmony default export */ var KonvaNode = (function (nameNode) {
    var _ref;

    return _ref = {}, _ref[konvaNodeMarker] = true, _ref.render = function render(createElement) {
      return createElement('div', this.$slots.default);
    }, _ref.watch = {
      config: {
        handler: function handler(val) {
          this.uploadKonva();
        },

        deep: true
      }
    }, _ref.props = {
      config: {
        type: Object,
        default: function _default() {
          return {};
        }
      }
    }, _ref.created = function created() {
      this.initKonva();
    }, _ref.mounted = function mounted() {
      var parentVueInstance = findParentKonva(this);
      var parentKonvaNode = parentVueInstance._konvaNode;
      parentKonvaNode.add(this._konvaNode);
      updatePicture(this._konvaNode);
    }, _ref.updated = function updated() {
      this.uploadKonva();
      var needRedraw = false;
      // check indexes
      // somehow this.$children are not ordered correctly
      // so we have to dive-in into componentOptions of vnode
      // also componentOptions.children may have empty nodes, so we need to filter them first
      var children = this.$vnode.componentOptions.children && this.$vnode.componentOptions.children.filter(function (c) {
        return c.componentInstance;
      });

      children && children.forEach(function ($vnode, index) {
        // const vnode = component.$vnode;
        // const index = children.indexOf(vnode);
        var konvaNode = findKonvaNode($vnode.componentInstance);
        if (konvaNode.getZIndex() !== index) {
          konvaNode.setZIndex(index);
          needRedraw = true;
        }
      });
      if (needRedraw) {
        updatePicture(this._konvaNode);
      }
    }, _ref.destroyed = function destroyed() {
      updatePicture(this._konvaNode);
      this._konvaNode.destroy();
      this._konvaNode.off(KonvaNode_EVENTS_NAMESPACE);
    }, _ref.methods = {
      getNode: function getNode() {
        return this._konvaNode;
      },
      getStage: function getStage() {
        return this._konvaNode;
      },
      initKonva: function initKonva() {
        var NodeClass = window.Konva[nameNode];

        if (!NodeClass) {
          console.error('vue-konva error: Can not find node ' + nameNode);
          return;
        }

        this._konvaNode = new NodeClass();
        this._konvaNode.VueComponent = this;

        this.uploadKonva();
      },
      uploadKonva: function uploadKonva() {
        var oldProps = this.oldProps || {};
        var props = KonvaNode_extends({}, this.$attrs, this.config, createListener(this.$listeners));
        applyNodeProps(this, props, oldProps);
        this.oldProps = props;
      }
    }, _ref;
  });
  // CONCATENATED MODULE: ./src/index.js




  if (typeof window !== 'undefined' && !window.Konva) {
    __webpack_require__(2);
  }

  var KONVA_NODES = ['Layer', 'FastLayer', 'Group', 'Label', 'Rect', 'Circle', 'Ellipse', 'Wedge', 'Line', 'Sprite', 'Image', 'Text', 'TextPath', 'Star', 'Ring', 'Arc', 'Tag', 'Path', 'RegularPolygon', 'Arrow', 'Shape', 'Transformer'];
  var components = [{
    name: 'Stage',
    component: Stage
  }].concat(KONVA_NODES.map(function (name) {
    return {
      name: name,
      component: KonvaNode(name)
    };
  }));

  var VueKonva = {
    install: function install(Vue, options) {
      var prefixToUse = componentPrefix;
      if (options && options.prefix) {
        prefixToUse = options.prefix;
      }
      components.forEach(function (k) {
        Vue.component('' + prefixToUse + k.name, k.component);
      });
    }
  };

  /* harmony default export */ var src = __webpack_exports__["default"] = (VueKonva);

  if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(VueKonva);
  }

  /***/ })
  /******/ ])["default"];
  });
  });

  var VueKonva = unwrapExports(vueKonva);

  var bind$1 = function bind(fn, thisArg) {
    return function wrap() {
      var args = new Array(arguments.length);
      for (var i = 0; i < args.length; i++) {
        args[i] = arguments[i];
      }
      return fn.apply(thisArg, args);
    };
  };

  /*global toString:true*/

  // utils is a library of generic helper functions non-specific to axios

  var toString$1 = Object.prototype.toString;

  /**
   * Determine if a value is an Array
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an Array, otherwise false
   */
  function isArray(val) {
    return toString$1.call(val) === '[object Array]';
  }

  /**
   * Determine if a value is undefined
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if the value is undefined, otherwise false
   */
  function isUndefined(val) {
    return typeof val === 'undefined';
  }

  /**
   * Determine if a value is a Buffer
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Buffer, otherwise false
   */
  function isBuffer(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
      && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
  }

  /**
   * Determine if a value is an ArrayBuffer
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an ArrayBuffer, otherwise false
   */
  function isArrayBuffer(val) {
    return toString$1.call(val) === '[object ArrayBuffer]';
  }

  /**
   * Determine if a value is a FormData
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an FormData, otherwise false
   */
  function isFormData(val) {
    return (typeof FormData !== 'undefined') && (val instanceof FormData);
  }

  /**
   * Determine if a value is a view on an ArrayBuffer
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
   */
  function isArrayBufferView(val) {
    var result;
    if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
      result = ArrayBuffer.isView(val);
    } else {
      result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
    }
    return result;
  }

  /**
   * Determine if a value is a String
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a String, otherwise false
   */
  function isString(val) {
    return typeof val === 'string';
  }

  /**
   * Determine if a value is a Number
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Number, otherwise false
   */
  function isNumber$1(val) {
    return typeof val === 'number';
  }

  /**
   * Determine if a value is an Object
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an Object, otherwise false
   */
  function isObject$1(val) {
    return val !== null && typeof val === 'object';
  }

  /**
   * Determine if a value is a Date
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Date, otherwise false
   */
  function isDate(val) {
    return toString$1.call(val) === '[object Date]';
  }

  /**
   * Determine if a value is a File
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a File, otherwise false
   */
  function isFile(val) {
    return toString$1.call(val) === '[object File]';
  }

  /**
   * Determine if a value is a Blob
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Blob, otherwise false
   */
  function isBlob(val) {
    return toString$1.call(val) === '[object Blob]';
  }

  /**
   * Determine if a value is a Function
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Function, otherwise false
   */
  function isFunction(val) {
    return toString$1.call(val) === '[object Function]';
  }

  /**
   * Determine if a value is a Stream
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Stream, otherwise false
   */
  function isStream(val) {
    return isObject$1(val) && isFunction(val.pipe);
  }

  /**
   * Determine if a value is a URLSearchParams object
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a URLSearchParams object, otherwise false
   */
  function isURLSearchParams(val) {
    return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
  }

  /**
   * Trim excess whitespace off the beginning and end of a string
   *
   * @param {String} str The String to trim
   * @returns {String} The String freed of excess whitespace
   */
  function trim(str) {
    return str.replace(/^\s*/, '').replace(/\s*$/, '');
  }

  /**
   * Determine if we're running in a standard browser environment
   *
   * This allows axios to run in a web worker, and react-native.
   * Both environments support XMLHttpRequest, but not fully standard globals.
   *
   * web workers:
   *  typeof window -> undefined
   *  typeof document -> undefined
   *
   * react-native:
   *  navigator.product -> 'ReactNative'
   * nativescript
   *  navigator.product -> 'NativeScript' or 'NS'
   */
  function isStandardBrowserEnv() {
    if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                             navigator.product === 'NativeScript' ||
                                             navigator.product === 'NS')) {
      return false;
    }
    return (
      typeof window !== 'undefined' &&
      typeof document !== 'undefined'
    );
  }

  /**
   * Iterate over an Array or an Object invoking a function for each item.
   *
   * If `obj` is an Array callback will be called passing
   * the value, index, and complete array for each item.
   *
   * If 'obj' is an Object callback will be called passing
   * the value, key, and complete object for each property.
   *
   * @param {Object|Array} obj The object to iterate
   * @param {Function} fn The callback to invoke for each item
   */
  function forEach(obj, fn) {
    // Don't bother if no value provided
    if (obj === null || typeof obj === 'undefined') {
      return;
    }

    // Force an array if not already something iterable
    if (typeof obj !== 'object') {
      /*eslint no-param-reassign:0*/
      obj = [obj];
    }

    if (isArray(obj)) {
      // Iterate over array values
      for (var i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      // Iterate over object keys
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          fn.call(null, obj[key], key, obj);
        }
      }
    }
  }

  /**
   * Accepts varargs expecting each argument to be an object, then
   * immutably merges the properties of each object and returns result.
   *
   * When multiple objects contain the same key the later object in
   * the arguments list will take precedence.
   *
   * Example:
   *
   * ```js
   * var result = merge({foo: 123}, {foo: 456});
   * console.log(result.foo); // outputs 456
   * ```
   *
   * @param {Object} obj1 Object to merge
   * @returns {Object} Result of all merge properties
   */
  function merge(/* obj1, obj2, obj3, ... */) {
    var result = {};
    function assignValue(val, key) {
      if (typeof result[key] === 'object' && typeof val === 'object') {
        result[key] = merge(result[key], val);
      } else {
        result[key] = val;
      }
    }

    for (var i = 0, l = arguments.length; i < l; i++) {
      forEach(arguments[i], assignValue);
    }
    return result;
  }

  /**
   * Function equal to merge with the difference being that no reference
   * to original objects is kept.
   *
   * @see merge
   * @param {Object} obj1 Object to merge
   * @returns {Object} Result of all merge properties
   */
  function deepMerge(/* obj1, obj2, obj3, ... */) {
    var result = {};
    function assignValue(val, key) {
      if (typeof result[key] === 'object' && typeof val === 'object') {
        result[key] = deepMerge(result[key], val);
      } else if (typeof val === 'object') {
        result[key] = deepMerge({}, val);
      } else {
        result[key] = val;
      }
    }

    for (var i = 0, l = arguments.length; i < l; i++) {
      forEach(arguments[i], assignValue);
    }
    return result;
  }

  /**
   * Extends object a by mutably adding to it the properties of object b.
   *
   * @param {Object} a The object to be extended
   * @param {Object} b The object to copy properties from
   * @param {Object} thisArg The object to bind function to
   * @return {Object} The resulting value of object a
   */
  function extend$2(a, b, thisArg) {
    forEach(b, function assignValue(val, key) {
      if (thisArg && typeof val === 'function') {
        a[key] = bind$1(val, thisArg);
      } else {
        a[key] = val;
      }
    });
    return a;
  }

  var utils = {
    isArray: isArray,
    isArrayBuffer: isArrayBuffer,
    isBuffer: isBuffer,
    isFormData: isFormData,
    isArrayBufferView: isArrayBufferView,
    isString: isString,
    isNumber: isNumber$1,
    isObject: isObject$1,
    isUndefined: isUndefined,
    isDate: isDate,
    isFile: isFile,
    isBlob: isBlob,
    isFunction: isFunction,
    isStream: isStream,
    isURLSearchParams: isURLSearchParams,
    isStandardBrowserEnv: isStandardBrowserEnv,
    forEach: forEach,
    merge: merge,
    deepMerge: deepMerge,
    extend: extend$2,
    trim: trim
  };

  function encode$1(val) {
    return encodeURIComponent(val).
      replace(/%40/gi, '@').
      replace(/%3A/gi, ':').
      replace(/%24/g, '$').
      replace(/%2C/gi, ',').
      replace(/%20/g, '+').
      replace(/%5B/gi, '[').
      replace(/%5D/gi, ']');
  }

  /**
   * Build a URL by appending params to the end
   *
   * @param {string} url The base of the url (e.g., http://www.google.com)
   * @param {object} [params] The params to be appended
   * @returns {string} The formatted url
   */
  var buildURL = function buildURL(url, params, paramsSerializer) {
    /*eslint no-param-reassign:0*/
    if (!params) {
      return url;
    }

    var serializedParams;
    if (paramsSerializer) {
      serializedParams = paramsSerializer(params);
    } else if (utils.isURLSearchParams(params)) {
      serializedParams = params.toString();
    } else {
      var parts = [];

      utils.forEach(params, function serialize(val, key) {
        if (val === null || typeof val === 'undefined') {
          return;
        }

        if (utils.isArray(val)) {
          key = key + '[]';
        } else {
          val = [val];
        }

        utils.forEach(val, function parseValue(v) {
          if (utils.isDate(v)) {
            v = v.toISOString();
          } else if (utils.isObject(v)) {
            v = JSON.stringify(v);
          }
          parts.push(encode$1(key) + '=' + encode$1(v));
        });
      });

      serializedParams = parts.join('&');
    }

    if (serializedParams) {
      var hashmarkIndex = url.indexOf('#');
      if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
      }

      url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
    }

    return url;
  };

  function InterceptorManager() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  InterceptorManager.prototype.use = function use(fulfilled, rejected) {
    this.handlers.push({
      fulfilled: fulfilled,
      rejected: rejected
    });
    return this.handlers.length - 1;
  };

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   */
  InterceptorManager.prototype.eject = function eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  };

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   */
  InterceptorManager.prototype.forEach = function forEach(fn) {
    utils.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  };

  var InterceptorManager_1 = InterceptorManager;

  /**
   * Transform the data for a request or a response
   *
   * @param {Object|String} data The data to be transformed
   * @param {Array} headers The headers for the request or response
   * @param {Array|Function} fns A single function or Array of functions
   * @returns {*} The resulting transformed data
   */
  var transformData = function transformData(data, headers, fns) {
    /*eslint no-param-reassign:0*/
    utils.forEach(fns, function transform(fn) {
      data = fn(data, headers);
    });

    return data;
  };

  var isCancel = function isCancel(value) {
    return !!(value && value.__CANCEL__);
  };

  var normalizeHeaderName = function normalizeHeaderName(headers, normalizedName) {
    utils.forEach(headers, function processHeader(value, name) {
      if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
        headers[normalizedName] = value;
        delete headers[name];
      }
    });
  };

  /**
   * Update an Error with the specified config, error code, and response.
   *
   * @param {Error} error The error to update.
   * @param {Object} config The config.
   * @param {string} [code] The error code (for example, 'ECONNABORTED').
   * @param {Object} [request] The request.
   * @param {Object} [response] The response.
   * @returns {Error} The error.
   */
  var enhanceError = function enhanceError(error, config, code, request, response) {
    error.config = config;
    if (code) {
      error.code = code;
    }

    error.request = request;
    error.response = response;
    error.isAxiosError = true;

    error.toJSON = function() {
      return {
        // Standard
        message: this.message,
        name: this.name,
        // Microsoft
        description: this.description,
        number: this.number,
        // Mozilla
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        // Axios
        config: this.config,
        code: this.code
      };
    };
    return error;
  };

  /**
   * Create an Error with the specified message, config, error code, request and response.
   *
   * @param {string} message The error message.
   * @param {Object} config The config.
   * @param {string} [code] The error code (for example, 'ECONNABORTED').
   * @param {Object} [request] The request.
   * @param {Object} [response] The response.
   * @returns {Error} The created error.
   */
  var createError = function createError(message, config, code, request, response) {
    var error = new Error(message);
    return enhanceError(error, config, code, request, response);
  };

  /**
   * Resolve or reject a Promise based on response status.
   *
   * @param {Function} resolve A function that resolves the promise.
   * @param {Function} reject A function that rejects the promise.
   * @param {object} response The response.
   */
  var settle = function settle(resolve, reject, response) {
    var validateStatus = response.config.validateStatus;
    if (!validateStatus || validateStatus(response.status)) {
      resolve(response);
    } else {
      reject(createError(
        'Request failed with status code ' + response.status,
        response.config,
        null,
        response.request,
        response
      ));
    }
  };

  /**
   * Determines whether the specified URL is absolute
   *
   * @param {string} url The URL to test
   * @returns {boolean} True if the specified URL is absolute, otherwise false
   */
  var isAbsoluteURL = function isAbsoluteURL(url) {
    // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
    // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
    // by any combination of letters, digits, plus, period, or hyphen.
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
  };

  /**
   * Creates a new URL by combining the specified URLs
   *
   * @param {string} baseURL The base URL
   * @param {string} relativeURL The relative URL
   * @returns {string} The combined URL
   */
  var combineURLs = function combineURLs(baseURL, relativeURL) {
    return relativeURL
      ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
      : baseURL;
  };

  /**
   * Creates a new URL by combining the baseURL with the requestedURL,
   * only when the requestedURL is not already an absolute URL.
   * If the requestURL is absolute, this function returns the requestedURL untouched.
   *
   * @param {string} baseURL The base URL
   * @param {string} requestedURL Absolute or relative URL to combine
   * @returns {string} The combined full path
   */
  var buildFullPath = function buildFullPath(baseURL, requestedURL) {
    if (baseURL && !isAbsoluteURL(requestedURL)) {
      return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
  };

  // Headers whose duplicates are ignored by node
  // c.f. https://nodejs.org/api/http.html#http_message_headers
  var ignoreDuplicateOf = [
    'age', 'authorization', 'content-length', 'content-type', 'etag',
    'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
    'last-modified', 'location', 'max-forwards', 'proxy-authorization',
    'referer', 'retry-after', 'user-agent'
  ];

  /**
   * Parse headers into an object
   *
   * ```
   * Date: Wed, 27 Aug 2014 08:58:49 GMT
   * Content-Type: application/json
   * Connection: keep-alive
   * Transfer-Encoding: chunked
   * ```
   *
   * @param {String} headers Headers needing to be parsed
   * @returns {Object} Headers parsed into an object
   */
  var parseHeaders = function parseHeaders(headers) {
    var parsed = {};
    var key;
    var val;
    var i;

    if (!headers) { return parsed; }

    utils.forEach(headers.split('\n'), function parser(line) {
      i = line.indexOf(':');
      key = utils.trim(line.substr(0, i)).toLowerCase();
      val = utils.trim(line.substr(i + 1));

      if (key) {
        if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
          return;
        }
        if (key === 'set-cookie') {
          parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
        } else {
          parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
        }
      }
    });

    return parsed;
  };

  var isValidXss = function isValidXss(requestURL) {
    var xssRegex = /(\b)(on\w+)=|javascript|(<\s*)(\/*)script/gi;
    return xssRegex.test(requestURL);
  };

  var isURLSameOrigin = (
    utils.isStandardBrowserEnv() ?

    // Standard browser envs have full support of the APIs needed to test
    // whether the request URL is of the same origin as current location.
      (function standardBrowserEnv() {
        var msie = /(msie|trident)/i.test(navigator.userAgent);
        var urlParsingNode = document.createElement('a');
        var originURL;

        /**
      * Parse a URL to discover it's components
      *
      * @param {String} url The URL to be parsed
      * @returns {Object}
      */
        function resolveURL(url) {
          var href = url;

          if (isValidXss(url)) {
            throw new Error('URL contains XSS injection attempt');
          }

          if (msie) {
          // IE needs attribute set twice to normalize properties
            urlParsingNode.setAttribute('href', href);
            href = urlParsingNode.href;
          }

          urlParsingNode.setAttribute('href', href);

          // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
          return {
            href: urlParsingNode.href,
            protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
            host: urlParsingNode.host,
            search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
            hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
            hostname: urlParsingNode.hostname,
            port: urlParsingNode.port,
            pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
              urlParsingNode.pathname :
              '/' + urlParsingNode.pathname
          };
        }

        originURL = resolveURL(window.location.href);

        /**
      * Determine if a URL shares the same origin as the current location
      *
      * @param {String} requestURL The URL to test
      * @returns {boolean} True if URL shares the same origin, otherwise false
      */
        return function isURLSameOrigin(requestURL) {
          var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
          return (parsed.protocol === originURL.protocol &&
              parsed.host === originURL.host);
        };
      })() :

    // Non standard browser envs (web workers, react-native) lack needed support.
      (function nonStandardBrowserEnv() {
        return function isURLSameOrigin() {
          return true;
        };
      })()
  );

  var cookies = (
    utils.isStandardBrowserEnv() ?

    // Standard browser envs support document.cookie
      (function standardBrowserEnv() {
        return {
          write: function write(name, value, expires, path, domain, secure) {
            var cookie = [];
            cookie.push(name + '=' + encodeURIComponent(value));

            if (utils.isNumber(expires)) {
              cookie.push('expires=' + new Date(expires).toGMTString());
            }

            if (utils.isString(path)) {
              cookie.push('path=' + path);
            }

            if (utils.isString(domain)) {
              cookie.push('domain=' + domain);
            }

            if (secure === true) {
              cookie.push('secure');
            }

            document.cookie = cookie.join('; ');
          },

          read: function read(name) {
            var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
            return (match ? decodeURIComponent(match[3]) : null);
          },

          remove: function remove(name) {
            this.write(name, '', Date.now() - 86400000);
          }
        };
      })() :

    // Non standard browser env (web workers, react-native) lack needed support.
      (function nonStandardBrowserEnv() {
        return {
          write: function write() {},
          read: function read() { return null; },
          remove: function remove() {}
        };
      })()
  );

  var xhr = function xhrAdapter(config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      var requestData = config.data;
      var requestHeaders = config.headers;

      if (utils.isFormData(requestData)) {
        delete requestHeaders['Content-Type']; // Let the browser set it
      }

      var request = new XMLHttpRequest();

      // HTTP basic authentication
      if (config.auth) {
        var username = config.auth.username || '';
        var password = config.auth.password || '';
        requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
      }

      var fullPath = buildFullPath(config.baseURL, config.url);
      request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

      // Set the request timeout in MS
      request.timeout = config.timeout;

      // Listen for ready state
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }

        // Prepare the response
        var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
        var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
        var response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config: config,
          request: request
        };

        settle(resolve, reject, response);

        // Clean up request
        request = null;
      };

      // Handle browser request cancellation (as opposed to a manual cancellation)
      request.onabort = function handleAbort() {
        if (!request) {
          return;
        }

        reject(createError('Request aborted', config, 'ECONNABORTED', request));

        // Clean up request
        request = null;
      };

      // Handle low level network errors
      request.onerror = function handleError() {
        // Real errors are hidden from us by the browser
        // onerror should only fire if it's a network error
        reject(createError('Network Error', config, null, request));

        // Clean up request
        request = null;
      };

      // Handle timeout
      request.ontimeout = function handleTimeout() {
        var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
        if (config.timeoutErrorMessage) {
          timeoutErrorMessage = config.timeoutErrorMessage;
        }
        reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
          request));

        // Clean up request
        request = null;
      };

      // Add xsrf header
      // This is only done if running in a standard browser environment.
      // Specifically not if we're in a web worker, or react-native.
      if (utils.isStandardBrowserEnv()) {
        var cookies$1 = cookies;

        // Add xsrf header
        var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
          cookies$1.read(config.xsrfCookieName) :
          undefined;

        if (xsrfValue) {
          requestHeaders[config.xsrfHeaderName] = xsrfValue;
        }
      }

      // Add headers to the request
      if ('setRequestHeader' in request) {
        utils.forEach(requestHeaders, function setRequestHeader(val, key) {
          if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
            // Remove Content-Type if data is undefined
            delete requestHeaders[key];
          } else {
            // Otherwise add header to the request
            request.setRequestHeader(key, val);
          }
        });
      }

      // Add withCredentials to request if needed
      if (!utils.isUndefined(config.withCredentials)) {
        request.withCredentials = !!config.withCredentials;
      }

      // Add responseType to request if needed
      if (config.responseType) {
        try {
          request.responseType = config.responseType;
        } catch (e) {
          // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
          // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
          if (config.responseType !== 'json') {
            throw e;
          }
        }
      }

      // Handle progress if needed
      if (typeof config.onDownloadProgress === 'function') {
        request.addEventListener('progress', config.onDownloadProgress);
      }

      // Not all browsers support upload events
      if (typeof config.onUploadProgress === 'function' && request.upload) {
        request.upload.addEventListener('progress', config.onUploadProgress);
      }

      if (config.cancelToken) {
        // Handle cancellation
        config.cancelToken.promise.then(function onCanceled(cancel) {
          if (!request) {
            return;
          }

          request.abort();
          reject(cancel);
          // Clean up request
          request = null;
        });
      }

      if (requestData === undefined) {
        requestData = null;
      }

      // Send the request
      request.send(requestData);
    });
  };

  var DEFAULT_CONTENT_TYPE = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  function setContentTypeIfUnset(headers, value) {
    if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
      headers['Content-Type'] = value;
    }
  }

  function getDefaultAdapter() {
    var adapter;
    if (typeof XMLHttpRequest !== 'undefined') {
      // For browsers use XHR adapter
      adapter = xhr;
    } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
      // For node use HTTP adapter
      adapter = xhr;
    }
    return adapter;
  }

  var defaults = {
    adapter: getDefaultAdapter(),

    transformRequest: [function transformRequest(data, headers) {
      normalizeHeaderName(headers, 'Accept');
      normalizeHeaderName(headers, 'Content-Type');
      if (utils.isFormData(data) ||
        utils.isArrayBuffer(data) ||
        utils.isBuffer(data) ||
        utils.isStream(data) ||
        utils.isFile(data) ||
        utils.isBlob(data)
      ) {
        return data;
      }
      if (utils.isArrayBufferView(data)) {
        return data.buffer;
      }
      if (utils.isURLSearchParams(data)) {
        setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
        return data.toString();
      }
      if (utils.isObject(data)) {
        setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
        return JSON.stringify(data);
      }
      return data;
    }],

    transformResponse: [function transformResponse(data) {
      /*eslint no-param-reassign:0*/
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (e) { /* Ignore */ }
      }
      return data;
    }],

    /**
     * A timeout in milliseconds to abort a request. If set to 0 (default) a
     * timeout is not created.
     */
    timeout: 0,

    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',

    maxContentLength: -1,

    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    }
  };

  defaults.headers = {
    common: {
      'Accept': 'application/json, text/plain, */*'
    }
  };

  utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
    defaults.headers[method] = {};
  });

  utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
    defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
  });

  var defaults_1 = defaults;

  /**
   * Throws a `Cancel` if cancellation has been requested.
   */
  function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
      config.cancelToken.throwIfRequested();
    }
  }

  /**
   * Dispatch a request to the server using the configured adapter.
   *
   * @param {object} config The config that is to be used for the request
   * @returns {Promise} The Promise to be fulfilled
   */
  var dispatchRequest = function dispatchRequest(config) {
    throwIfCancellationRequested(config);

    // Ensure headers exist
    config.headers = config.headers || {};

    // Transform request data
    config.data = transformData(
      config.data,
      config.headers,
      config.transformRequest
    );

    // Flatten headers
    config.headers = utils.merge(
      config.headers.common || {},
      config.headers[config.method] || {},
      config.headers
    );

    utils.forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      function cleanHeaderConfig(method) {
        delete config.headers[method];
      }
    );

    var adapter = config.adapter || defaults_1.adapter;

    return adapter(config).then(function onAdapterResolution(response) {
      throwIfCancellationRequested(config);

      // Transform response data
      response.data = transformData(
        response.data,
        response.headers,
        config.transformResponse
      );

      return response;
    }, function onAdapterRejection(reason) {
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config);

        // Transform response data
        if (reason && reason.response) {
          reason.response.data = transformData(
            reason.response.data,
            reason.response.headers,
            config.transformResponse
          );
        }
      }

      return Promise.reject(reason);
    });
  };

  /**
   * Config-specific merge-function which creates a new config-object
   * by merging two configuration objects together.
   *
   * @param {Object} config1
   * @param {Object} config2
   * @returns {Object} New object resulting from merging config2 to config1
   */
  var mergeConfig = function mergeConfig(config1, config2) {
    // eslint-disable-next-line no-param-reassign
    config2 = config2 || {};
    var config = {};

    var valueFromConfig2Keys = ['url', 'method', 'params', 'data'];
    var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy'];
    var defaultToConfig2Keys = [
      'baseURL', 'url', 'transformRequest', 'transformResponse', 'paramsSerializer',
      'timeout', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
      'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress',
      'maxContentLength', 'validateStatus', 'maxRedirects', 'httpAgent',
      'httpsAgent', 'cancelToken', 'socketPath'
    ];

    utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
      if (typeof config2[prop] !== 'undefined') {
        config[prop] = config2[prop];
      }
    });

    utils.forEach(mergeDeepPropertiesKeys, function mergeDeepProperties(prop) {
      if (utils.isObject(config2[prop])) {
        config[prop] = utils.deepMerge(config1[prop], config2[prop]);
      } else if (typeof config2[prop] !== 'undefined') {
        config[prop] = config2[prop];
      } else if (utils.isObject(config1[prop])) {
        config[prop] = utils.deepMerge(config1[prop]);
      } else if (typeof config1[prop] !== 'undefined') {
        config[prop] = config1[prop];
      }
    });

    utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
      if (typeof config2[prop] !== 'undefined') {
        config[prop] = config2[prop];
      } else if (typeof config1[prop] !== 'undefined') {
        config[prop] = config1[prop];
      }
    });

    var axiosKeys = valueFromConfig2Keys
      .concat(mergeDeepPropertiesKeys)
      .concat(defaultToConfig2Keys);

    var otherKeys = Object
      .keys(config2)
      .filter(function filterAxiosKeys(key) {
        return axiosKeys.indexOf(key) === -1;
      });

    utils.forEach(otherKeys, function otherKeysDefaultToConfig2(prop) {
      if (typeof config2[prop] !== 'undefined') {
        config[prop] = config2[prop];
      } else if (typeof config1[prop] !== 'undefined') {
        config[prop] = config1[prop];
      }
    });

    return config;
  };

  /**
   * Create a new instance of Axios
   *
   * @param {Object} instanceConfig The default config for the instance
   */
  function Axios(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager_1(),
      response: new InterceptorManager_1()
    };
  }

  /**
   * Dispatch a request
   *
   * @param {Object} config The config specific for this request (merged with this.defaults)
   */
  Axios.prototype.request = function request(config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof config === 'string') {
      config = arguments[1] || {};
      config.url = arguments[0];
    } else {
      config = config || {};
    }

    config = mergeConfig(this.defaults, config);

    // Set config.method
    if (config.method) {
      config.method = config.method.toLowerCase();
    } else if (this.defaults.method) {
      config.method = this.defaults.method.toLowerCase();
    } else {
      config.method = 'get';
    }

    // Hook up interceptors middleware
    var chain = [dispatchRequest, undefined];
    var promise = Promise.resolve(config);

    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      chain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      chain.push(interceptor.fulfilled, interceptor.rejected);
    });

    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  };

  Axios.prototype.getUri = function getUri(config) {
    config = mergeConfig(this.defaults, config);
    return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
  };

  // Provide aliases for supported request methods
  utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
    /*eslint func-names:0*/
    Axios.prototype[method] = function(url, config) {
      return this.request(utils.merge(config || {}, {
        method: method,
        url: url
      }));
    };
  });

  utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
    /*eslint func-names:0*/
    Axios.prototype[method] = function(url, data, config) {
      return this.request(utils.merge(config || {}, {
        method: method,
        url: url,
        data: data
      }));
    };
  });

  var Axios_1 = Axios;

  /**
   * A `Cancel` is an object that is thrown when an operation is canceled.
   *
   * @class
   * @param {string=} message The message.
   */
  function Cancel(message) {
    this.message = message;
  }

  Cancel.prototype.toString = function toString() {
    return 'Cancel' + (this.message ? ': ' + this.message : '');
  };

  Cancel.prototype.__CANCEL__ = true;

  var Cancel_1 = Cancel;

  /**
   * A `CancelToken` is an object that can be used to request cancellation of an operation.
   *
   * @class
   * @param {Function} executor The executor function.
   */
  function CancelToken(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    var resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    var token = this;
    executor(function cancel(message) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new Cancel_1(message);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `Cancel` if cancellation has been requested.
   */
  CancelToken.prototype.throwIfRequested = function throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  };

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  CancelToken.source = function source() {
    var cancel;
    var token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token: token,
      cancel: cancel
    };
  };

  var CancelToken_1 = CancelToken;

  /**
   * Syntactic sugar for invoking a function and expanding an array for arguments.
   *
   * Common use case would be to use `Function.prototype.apply`.
   *
   *  ```js
   *  function f(x, y, z) {}
   *  var args = [1, 2, 3];
   *  f.apply(null, args);
   *  ```
   *
   * With `spread` this example can be re-written.
   *
   *  ```js
   *  spread(function(x, y, z) {})([1, 2, 3]);
   *  ```
   *
   * @param {Function} callback
   * @returns {Function}
   */
  var spread = function spread(callback) {
    return function wrap(arr) {
      return callback.apply(null, arr);
    };
  };

  /**
   * Create an instance of Axios
   *
   * @param {Object} defaultConfig The default config for the instance
   * @return {Axios} A new instance of Axios
   */
  function createInstance(defaultConfig) {
    var context = new Axios_1(defaultConfig);
    var instance = bind$1(Axios_1.prototype.request, context);

    // Copy axios.prototype to instance
    utils.extend(instance, Axios_1.prototype, context);

    // Copy context to instance
    utils.extend(instance, context);

    return instance;
  }

  // Create the default instance to be exported
  var axios = createInstance(defaults_1);

  // Expose Axios class to allow class inheritance
  axios.Axios = Axios_1;

  // Factory for creating new instances
  axios.create = function create(instanceConfig) {
    return createInstance(mergeConfig(axios.defaults, instanceConfig));
  };

  // Expose Cancel & CancelToken
  axios.Cancel = Cancel_1;
  axios.CancelToken = CancelToken_1;
  axios.isCancel = isCancel;

  // Expose all/spread
  axios.all = function all(promises) {
    return Promise.all(promises);
  };
  axios.spread = spread;

  var axios_1 = axios;

  // Allow use of default import syntax in TypeScript
  var default_1 = axios;
  axios_1.default = default_1;

  var axios$1 = axios_1;

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  var script = {};

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof shadowMode !== 'boolean') {
          createInjectorSSR = createInjector;
          createInjector = shadowMode;
          shadowMode = false;
      }
      // Vue.extend constructor export interop.
      const options = typeof script === 'function' ? script.options : script;
      // render functions
      if (template && template.render) {
          options.render = template.render;
          options.staticRenderFns = template.staticRenderFns;
          options._compiled = true;
          // functional template
          if (isFunctionalTemplate) {
              options.functional = true;
          }
      }
      // scopedId
      if (scopeId) {
          options._scopeId = scopeId;
      }
      let hook;
      if (moduleIdentifier) {
          // server build
          hook = function (context) {
              // 2.3 injection
              context =
                  context || // cached call
                      (this.$vnode && this.$vnode.ssrContext) || // stateful
                      (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
              // 2.2 with runInNewContext: true
              if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                  context = __VUE_SSR_CONTEXT__;
              }
              // inject component styles
              if (style) {
                  style.call(this, createInjectorSSR(context));
              }
              // register component module identifier for async chunk inference
              if (context && context._registeredComponents) {
                  context._registeredComponents.add(moduleIdentifier);
              }
          };
          // used by ssr in case component is cached and beforeCreate
          // never gets called
          options._ssrRegister = hook;
      }
      else if (style) {
          hook = shadowMode
              ? function (context) {
                  style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
              }
              : function (context) {
                  style.call(this, createInjector(context));
              };
      }
      if (hook) {
          if (options.functional) {
              // register for functional component in vue file
              const originalRender = options.render;
              options.render = function renderWithStyleInjection(h, context) {
                  hook.call(context);
                  return originalRender(h, context);
              };
          }
          else {
              // inject component registration as beforeCreate hook
              const existing = options.beforeCreate;
              options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
          }
      }
      return script;
  }
  //# sourceMappingURL=normalize-component.mjs.map

  const isOldIE = typeof navigator !== 'undefined' &&
      /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  function createInjector(context) {
      return (id, style) => addStyle(id, style);
  }
  let HEAD;
  const styles = {};
  function addStyle(id, css) {
      const group = isOldIE ? css.media || 'default' : id;
      const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
      if (!style.ids.has(id)) {
          style.ids.add(id);
          let code = css.source;
          if (css.map) {
              // https://developer.chrome.com/devtools/docs/javascript-debugging
              // this makes source maps inside style tags work properly in Chrome
              code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
              // http://stackoverflow.com/a/26603875
              code +=
                  '\n/*# sourceMappingURL=data:application/json;base64,' +
                      btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                      ' */';
          }
          if (!style.element) {
              style.element = document.createElement('style');
              style.element.type = 'text/css';
              if (css.media)
                  style.element.setAttribute('media', css.media);
              if (HEAD === undefined) {
                  HEAD = document.head || document.getElementsByTagName('head')[0];
              }
              HEAD.appendChild(style.element);
          }
          if ('styleSheet' in style.element) {
              style.styles.push(code);
              style.element.styleSheet.cssText = style.styles
                  .filter(Boolean)
                  .join('\n');
          }
          else {
              const index = style.ids.size - 1;
              const textNode = document.createTextNode(code);
              const nodes = style.element.childNodes;
              if (nodes[index])
                  style.element.removeChild(nodes[index]);
              if (nodes.length)
                  style.element.insertBefore(textNode, nodes[index]);
              else
                  style.element.appendChild(textNode);
          }
      }
  }
  //# sourceMappingURL=browser.mjs.map

  /* script */
  const __vue_script__ = script;

  /* template */
  var __vue_render__ = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", [
      _c(
        "div",
        [
          _c("h1", [_vm._v("Welcome")]),
          _vm._v(" "),
          _vm._m(0),
          _vm._v(" "),
          _c("p", [_vm._v("Welcome to Armygeddon!")]),
          _vm._v(" "),
          _c("p", [
            _vm._v(
              "Armygeddon is a turn-based browser strategy game, which allows players to organize duels and test their skills and tactics agains each other."
            )
          ]),
          _vm._v(" "),
          _c("p", [
            _vm._v(
              "The game is currently under development (but already playable) and new features and bug fixes are arriving on daily schedule."
            )
          ]),
          _vm._v(" "),
          _c("p", [
            _vm._v(
              "Please feel free to test current game features and enjoy the game."
            )
          ]),
          _vm._v(" "),
          _c(
            "router-link",
            { staticClass: "btn btn_normal", attrs: { to: "/start" } },
            [_vm._v("Begin the game")]
          ),
          _vm._v(" "),
          _c(
            "router-link",
            {
              staticClass: "btn btn_normal",
              attrs: { to: "/tutorial", disabled: "" }
            },
            [_vm._v("Read the tutorial")]
          )
        ],
        1
      )
    ])
  };
  var __vue_staticRenderFns__ = [
    function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("p", [_c("small", [_vm._v("2018.04.17")])])
    }
  ];
  __vue_render__._withStripped = true;

    /* style */
    const __vue_inject_styles__ = function (inject) {
      if (!inject) return
      inject("data-v-7d873a31_0", { source: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", map: undefined, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__ = "data-v-7d873a31";
    /* module identifier */
    const __vue_module_identifier__ = undefined;
    /* functional template */
    const __vue_is_functional_template__ = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__ = normalizeComponent(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      false,
      createInjector,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  var script$1 = {
    data: function() {
      return {
        ranking: [
          {
            playerName: "",
            totalExp: "",
            totalRank: ""
          }
        ]
      };
    }
  };

  /* script */
  const __vue_script__$1 = script$1;

  /* template */
  var __vue_render__$1 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", [
      _c("div", [
        _c("h2", [_vm._v("Ranking")]),
        _vm._v(" "),
        _c(
          "ul",
          { staticClass: "select-list" },
          _vm._l(_vm.ranking, function(item) {
            return _c("li", { key: item.playerName }, [
              _c("span", [_vm._v(_vm._s(item.playerName))]),
              _vm._v(" "),
              _c("span", [_vm._v(_vm._s(item.totalExp))]),
              _vm._v(" "),
              _c("span", [_vm._v(_vm._s(item.totalRank))])
            ])
          }),
          0
        )
      ])
    ])
  };
  var __vue_staticRenderFns__$1 = [];
  __vue_render__$1._withStripped = true;

    /* style */
    const __vue_inject_styles__$1 = function (inject) {
      if (!inject) return
      inject("data-v-7ebdd8b6_0", { source: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", map: undefined, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$1 = "data-v-7ebdd8b6";
    /* module identifier */
    const __vue_module_identifier__$1 = undefined;
    /* functional template */
    const __vue_is_functional_template__$1 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$1 = normalizeComponent(
      { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
      __vue_inject_styles__$1,
      __vue_script__$1,
      __vue_scope_id__$1,
      __vue_is_functional_template__$1,
      __vue_module_identifier__$1,
      false,
      createInjector,
      undefined,
      undefined
    );

  function doesHttpOnlyCookieExist(cookiename) {
      var d = new Date();
      d.setTime(d.getTime() + (1000));
      var expires = "expires=" + d.toUTCString();
   
      document.cookie = cookiename + "=undefined;path=/;" + expires;
      if (document.cookie.indexOf(cookiename + '=') == -1) {
          return true;
       } else {
          return false;
       }
   }

  const state = Vue.observable({
      name: "",
      authenticated: false
  });

  const getters = {
      name: () => state.name,
      authenticated: () => state.authenticated || doesHttpOnlyCookieExist('a_token'),
  };

  const mutations = {
      login(data) {
          return new Promise((resolve, reject) => {
              axios$1.post('/login', data).then(r => {
                  state.name = r.data.name;
                  state.authenticated = true;
                  resolve();
              }, e => {
                  state.authenticated = false;
                  reject();
              });
          });
      },
      register(data) {
          return new Promise((resolve, reject) => {
              axios$1.post('/register', data).then(r => {
                  state.name = r.data.name;
                  state.authenticated = true;
                  resolve();
              }, e => {
                  state.authenticated = false;
                  reject(e.response.data.message);
              });
          });
      },
      logout() {
          state.name = '';
          state.authenticated = false;
      }
  };

  //

  var script$2 = {
    computed: { ...getters }
  };

  /* script */
  const __vue_script__$2 = script$2;

  /* template */
  var __vue_render__$2 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "pure-menu pure-menu-horizontal" }, [
      _vm.authenticated
        ? _c("div", { staticClass: "user" }, [
            _vm._v("\n      " + _vm._s(_vm.name) + "\n  ")
          ])
        : _c("ul", { staticClass: "pure-menu-list" }, [
            _c(
              "li",
              { staticClass: "pure-menu-item" },
              [_c("router-link", { attrs: { to: "/login" } }, [_vm._v("Login")])],
              1
            ),
            _vm._v(" "),
            _c(
              "li",
              { staticClass: "pure-menu-item" },
              [
                _c("router-link", { attrs: { to: "/register" } }, [
                  _vm._v("Register")
                ])
              ],
              1
            )
          ])
    ])
  };
  var __vue_staticRenderFns__$2 = [];
  __vue_render__$2._withStripped = true;

    /* style */
    const __vue_inject_styles__$2 = function (inject) {
      if (!inject) return
      inject("data-v-3501618d_0", { source: "\n.user[data-v-3501618d]{\r\n  color: antiquewhite;\n}\r\n", map: undefined, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$2 = "data-v-3501618d";
    /* module identifier */
    const __vue_module_identifier__$2 = undefined;
    /* functional template */
    const __vue_is_functional_template__$2 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$2 = normalizeComponent(
      { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
      __vue_inject_styles__$2,
      __vue_script__$2,
      __vue_scope_id__$2,
      __vue_is_functional_template__$2,
      __vue_module_identifier__$2,
      false,
      createInjector,
      undefined,
      undefined
    );

  /* script */

  /* template */
  var __vue_render__$3 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "panel" }, [
      _vm._m(0),
      _vm._v(" "),
      _vm._m(1),
      _vm._v(" "),
      _vm._m(2),
      _vm._v(" "),
      _vm._m(3),
      _vm._v(" "),
      _c("div", { staticClass: "slot" }, [_vm._t("default")], 2),
      _vm._v(" "),
      _vm._m(4),
      _vm._v(" "),
      _vm._m(5),
      _vm._v(" "),
      _vm._m(6),
      _vm._v(" "),
      _vm._m(7)
    ])
  };
  var __vue_staticRenderFns__$3 = [
    function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", { staticClass: "corner_dbl_tl" }, [_c("div")])
    },
    function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", { staticClass: "line_dbl_h1" }, [_c("div")])
    },
    function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", { staticClass: "corner_dbl_tr" }, [_c("div")])
    },
    function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", { staticClass: "line_dbl_v1" }, [_c("div")])
    },
    function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", { staticClass: "line_dbl_v2" }, [_c("div")])
    },
    function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", { staticClass: "corner_dbl_bl" }, [_c("div")])
    },
    function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", { staticClass: "line_dbl_h2" }, [_c("div")])
    },
    function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", { staticClass: "corner_dbl_br" }, [_c("div")])
    }
  ];
  __vue_render__$3._withStripped = true;

    /* style */
    const __vue_inject_styles__$3 = function (inject) {
      if (!inject) return
      inject("data-v-1bd59c18_0", { source: "\n.panel {\r\n  display: grid;\r\n  grid-template-columns: 25px auto 25px;\r\n  grid-template-rows: 25px auto 25px;\r\n  grid-column-gap: 0px;\r\n  grid-row-gap: 0px;\r\n  justify-items: stretch;\r\n  align-items: stretch;\r\n  margin: 8px;\n}\n.panel > .slot {\r\n  background-color: #a59e95;\r\n  margin: -10px;\r\n  padding: 10px;\r\n  box-shadow: black -22px 22px 22px 0px;\n}\n.panel h1 {\r\n  font-weight: normal;\r\n  font-size: 2em;\r\n  text-shadow: 1px 2px 2px #ccc;\r\n  margin-top: 0px;\n}\n.panel h2 {\r\n  font-weight: normal;\r\n  font-size: 1.5em;\r\n  text-shadow: 1px 2px 2px #ccc;\r\n  margin-top: 0px;\n}\n.panel h1:first-letter {\r\n  font-family: SquareCaps;\r\n  font-size: 2em;\r\n  text-shadow: 2px 2px 0px #e6e2d2;\n}\n.panel h2:first-letter {\r\n  font-family: SquareCaps;\r\n  font-size: 1.5em;\r\n  text-shadow: 2px 2px 0px #e6e2d2;\n}\n.panel div.right-aligned {\r\n  position: absolute;\r\n  top: 20px;\r\n  right: 30px;\r\n  width: auto;\n}\n.line_dbl_v1 {\r\n  z-index: 1;\r\n  background: url(styles/line_dbl_v.png) repeat-y;\r\n  height: 100%;\r\n  margin-left: 1px;\n}\n.line_dbl_h1 {\r\n  background: url(styles/line_dbl_h.png) repeat-x;\r\n  width: 100%;\r\n  margin-top: 1px;\n}\n.line_dbl_h2 {\r\n  background: url(styles/line_dbl_h.png) repeat-x;\r\n  width: 100%;\r\n  margin-top: 7px;\n}\n.line_dbl_v2 {\r\n  z-index: 1;\r\n  background: url(styles/line_dbl_v.png) repeat-y;\r\n  height: 100%;\r\n  margin-left: 7px;\n}\r\n", map: undefined, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$3 = undefined;
    /* module identifier */
    const __vue_module_identifier__$3 = undefined;
    /* functional template */
    const __vue_is_functional_template__$3 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$3 = normalizeComponent(
      { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
      __vue_inject_styles__$3,
      {},
      __vue_scope_id__$3,
      __vue_is_functional_template__$3,
      __vue_module_identifier__$3,
      false,
      createInjector,
      undefined,
      undefined
    );

  //

  var script$3 = {
    components: {
      User: __vue_component__$2,
      Panel: __vue_component__$3
    },
    data: function() {
      return {
        title: "Armygeddon"
      };
    }
  };

  /* script */
  const __vue_script__$3 = script$3;

  /* template */
  var __vue_render__$4 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      [
        _c("vue-headful", {
          attrs: { title: _vm.title, description: _vm.title }
        }),
        _vm._v(" "),
        _c("div", { staticClass: "pure-g" }, [
          _c("div", { staticClass: "pure-u-1 pure-u-md-1-8" }),
          _vm._v(" "),
          _c("div", { staticClass: "pure-u-1 pure-u-md-3-4" }, [
            _c(
              "div",
              { staticClass: "title-box" },
              [
                _c(
                  "Panel",
                  [
                    _c(
                      "h1",
                      { staticClass: "pulsate-bck" },
                      [
                        _c("router-link", { attrs: { to: "/" } }, [
                          _vm._v(_vm._s(_vm.title))
                        ])
                      ],
                      1
                    ),
                    _vm._v(" "),
                    _c("user", { staticClass: "right-aligned" })
                  ],
                  1
                )
              ],
              1
            )
          ])
        ])
      ],
      1
    )
  };
  var __vue_staticRenderFns__$4 = [];
  __vue_render__$4._withStripped = true;

    /* style */
    const __vue_inject_styles__$4 = function (inject) {
      if (!inject) return
      inject("data-v-27dffaaa_0", { source: "\n.title-box {\r\n  position: relative;\r\n  margin-top: -20px;\n}\n.title-box > .panel > .slot {\r\n  background: url(images/stone1.jpg) repeat;\r\n  background-size: 180px 180px;\n}\n.title-box > .panel > .slot > h1 {\r\n  margin-bottom: -10px;\r\n  margin-top: -20px;\r\n  padding-top: 16px;\r\n  padding-left: 10px;\r\n  background: rgb(0, 0, 0);\r\n  background: linear-gradient(\r\n    180deg,\r\n    rgba(0, 0, 0, 1) 0%,\r\n    rgba(0, 0, 0, 0.7) 0%,\r\n    rgba(0, 0, 0, 0) 100%\r\n  );\r\n  margin-left: -10px;\r\n  margin-right: -10px;\r\n  background-size: 200% 200%;\r\n  padding-bottom: 6px;\n}\n.title-box a {\r\n  font-weight: normal;\r\n  text-decoration-line: none;\r\n  color: inherit;\n}\n.title-box > .panel > .slot .pure-menu a {\r\n  color: antiquewhite;\n}\n.pulsate-bck {\r\n  animation: pulsate-anim 0.8s ease-in-out infinite both;\n}\n@keyframes pulsate-anim {\n0% {\r\n    background-position: 100% 60%;\n}\n40% {\r\n    background-position: 100% 52%;\n}\n50% {\r\n    background-position: 100% 68%;\n}\n65% {\r\n    background-position: 100% 55%;\n}\n90% {\r\n    background-position: 100% 60%;\n}\n100% {\r\n    background-position: 100% 56%;\n}\n}\r\n", map: undefined, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$4 = undefined;
    /* module identifier */
    const __vue_module_identifier__$4 = undefined;
    /* functional template */
    const __vue_is_functional_template__$4 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$4 = normalizeComponent(
      { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
      __vue_inject_styles__$4,
      __vue_script__$3,
      __vue_scope_id__$4,
      __vue_is_functional_template__$4,
      __vue_module_identifier__$4,
      false,
      createInjector,
      undefined,
      undefined
    );

  //
  var script$4 = {
    components: {
      Welcome: __vue_component__,
      Ranking: __vue_component__$1,
      Title: __vue_component__$4,
      Panel: __vue_component__$3
    }
  };

  /* script */
  const __vue_script__$4 = script$4;

  /* template */
  var __vue_render__$5 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      [
        _c("Title"),
        _vm._v(" "),
        _c("div", { staticClass: "pure-g" }, [
          _c("div", { staticClass: "pure-u-1 pure-u-md-1-8" }),
          _vm._v(" "),
          _c("div", { staticClass: "pure-u-1 pure-u-md-3-4" }, [
            _c("div", { staticClass: "pure-g" }, [
              _c(
                "div",
                { staticClass: "pure-u-1 pure-u-md-2-3" },
                [_c("Panel", [_c("Welcome")], 1)],
                1
              ),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "pure-u-1 pure-u-md-1-3" },
                [_c("Panel", [_c("Ranking")], 1)],
                1
              )
            ])
          ])
        ])
      ],
      1
    )
  };
  var __vue_staticRenderFns__$5 = [];
  __vue_render__$5._withStripped = true;

    /* style */
    const __vue_inject_styles__$5 = function (inject) {
      if (!inject) return
      inject("data-v-77a6eb12_0", { source: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", map: undefined, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$5 = "data-v-77a6eb12";
    /* module identifier */
    const __vue_module_identifier__$5 = undefined;
    /* functional template */
    const __vue_is_functional_template__$5 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$5 = normalizeComponent(
      { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
      __vue_inject_styles__$5,
      __vue_script__$4,
      __vue_scope_id__$5,
      __vue_is_functional_template__$5,
      __vue_module_identifier__$5,
      false,
      createInjector,
      undefined,
      undefined
    );

  //

  var script$5 = {
    components: {
      Home: __vue_component__$5
    },
    created: function() {
      const self = this;
      axios$1.interceptors.response.use(undefined, (err) => {
        return new Promise((resolve, reject) => {
          if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
            mutations.logout();
            reject(err);
          }
          else if (err.response.status >= 500 && err.response.status < 600){
            self.$router.push({name: 'error', params: { error: err.response.data.message }});
            reject(err);
          }
          else{
            reject(err);
          }
        });
      });
    }
  };

  /* script */
  const __vue_script__$5 = script$5;

  /* template */
  var __vue_render__$6 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { attrs: { id: "app" } }, [_c("router-view")], 1)
  };
  var __vue_staticRenderFns__$6 = [];
  __vue_render__$6._withStripped = true;

    /* style */
    const __vue_inject_styles__$6 = function (inject) {
      if (!inject) return
      inject("data-v-0420eeeb_0", { source: "\np[data-v-0420eeeb] {\r\n  font-size: 2em;\r\n  text-align: center;\n}\r\n", map: undefined, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$6 = "data-v-0420eeeb";
    /* module identifier */
    const __vue_module_identifier__$6 = undefined;
    /* functional template */
    const __vue_is_functional_template__$6 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$6 = normalizeComponent(
      { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
      __vue_inject_styles__$6,
      __vue_script__$5,
      __vue_scope_id__$6,
      __vue_is_functional_template__$6,
      __vue_module_identifier__$6,
      false,
      createInjector,
      undefined,
      undefined
    );

  //
  var script$6 = {
    components: {
      Title: __vue_component__$4,
      Panel: __vue_component__$3
    },
    data() {
      return {
        name: "",
        password: "",
        sending: false,
        error: undefined
      };
    },
    methods: {
      login() {
        this.sending = true;
        mutations.login({ name: this.name, password: this.password }).then(
          r => this.$router.push("/"),
          e => {
            this.sending = false;
            this.password = "";
            this.error = "Unrecognized user. Please check login data.";
          }
        );
      }
    }
  };

  /* script */
  const __vue_script__$6 = script$6;

  /* template */
  var __vue_render__$7 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      [
        _c("Title"),
        _vm._v(" "),
        _c("div", { staticClass: "pure-g" }, [
          _c("div", { staticClass: "pure-u-1 pure-u-sm-1-8 pure-u-md-1-4" }),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "pure-u-1 pure-u-sm-3-4 pure-u-md-1-2" },
            [
              _c("Panel", [
                _c("div", [
                  _c("h2", [_vm._v("Who art thou, Sir?")]),
                  _vm._v(" "),
                  _c("div", { staticClass: "pure-form pure-form-aligned" }, [
                    _c("fieldset", [
                      _c("div", { staticClass: "pure-control-group" }, [
                        _c("label", { attrs: { for: "name" } }, [
                          _vm._v("Username")
                        ]),
                        _vm._v(" "),
                        _c("input", {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model",
                              value: _vm.name,
                              expression: "name"
                            }
                          ],
                          attrs: {
                            type: "text",
                            name: "name",
                            placeholder: "Username or Email"
                          },
                          domProps: { value: _vm.name },
                          on: {
                            input: function($event) {
                              if ($event.target.composing) {
                                return
                              }
                              _vm.name = $event.target.value;
                            }
                          }
                        })
                      ]),
                      _vm._v(" "),
                      _c("div", { staticClass: "pure-control-group" }, [
                        _c("label", { attrs: { for: "name" } }, [
                          _vm._v("Password")
                        ]),
                        _vm._v(" "),
                        _c("input", {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model",
                              value: _vm.password,
                              expression: "password"
                            }
                          ],
                          attrs: {
                            type: "password",
                            name: "password",
                            placeholder: "Password"
                          },
                          domProps: { value: _vm.password },
                          on: {
                            input: function($event) {
                              if ($event.target.composing) {
                                return
                              }
                              _vm.password = $event.target.value;
                            }
                          }
                        })
                      ]),
                      _vm._v(" "),
                      _c("div", [_vm._v(_vm._s(_vm.error))]),
                      _vm._v(" "),
                      _c(
                        "div",
                        [
                          _c(
                            "a",
                            {
                              staticClass: "btn btn_normal",
                              attrs: { href: "#", disabled: _vm.sending },
                              on: { click: _vm.login }
                            },
                            [_vm._v("Login")]
                          ),
                          _vm._v(" "),
                          _c(
                            "div",
                            { staticStyle: { margin: "0 auto", width: "16px" } },
                            [_vm._v("or")]
                          ),
                          _vm._v(" "),
                          _c(
                            "router-link",
                            {
                              staticClass: "btn btn_normal",
                              attrs: { to: "/register" }
                            },
                            [_vm._v("Register")]
                          )
                        ],
                        1
                      )
                    ])
                  ])
                ])
              ])
            ],
            1
          )
        ])
      ],
      1
    )
  };
  var __vue_staticRenderFns__$7 = [];
  __vue_render__$7._withStripped = true;

    /* style */
    const __vue_inject_styles__$7 = function (inject) {
      if (!inject) return
      inject("data-v-6e634d14_0", { source: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", map: undefined, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$7 = "data-v-6e634d14";
    /* module identifier */
    const __vue_module_identifier__$7 = undefined;
    /* functional template */
    const __vue_is_functional_template__$7 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$7 = normalizeComponent(
      { render: __vue_render__$7, staticRenderFns: __vue_staticRenderFns__$7 },
      __vue_inject_styles__$7,
      __vue_script__$6,
      __vue_scope_id__$7,
      __vue_is_functional_template__$7,
      __vue_module_identifier__$7,
      false,
      createInjector,
      undefined,
      undefined
    );

  //
  var script$7 = {
    components: {
      Title: __vue_component__$4,
      Panel: __vue_component__$3
    },
    data() {
      return {
        name: "",
        mail: "",
        password: "",
        confirm: "",
        sending: false,
        error: undefined
      };
    },
    methods: {
      register() {
        this.sending = true;
        mutations.register({ name: this.name, mail: this.mail, password: this.password, confirm: this.confirm }).then(
          r => this.$router.push("/"),
          e => {
            this.sending = false;
            this.password = this.confirm = "";
            this.error = e;
          }
        );
      }
    }
  };

  /* script */
  const __vue_script__$7 = script$7;

  /* template */
  var __vue_render__$8 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      [
        _c("Title"),
        _vm._v(" "),
        _c("div", { staticClass: "pure-g" }, [
          _c("div", { staticClass: "pure-u-1 pure-u-sm-1-8 pure-u-md-1-4" }),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "pure-u-1 pure-u-sm-3-4 pure-u-md-1-2" },
            [
              _c("Panel", [
                _c("h2", [_vm._v("Register yourself, Sir")]),
                _vm._v(" "),
                _c("div", { staticClass: "pure-form pure-form-aligned" }, [
                  _c("fieldset", [
                    _c("div", { staticClass: "pure-control-group" }, [
                      _c("label", { attrs: { for: "name" } }, [
                        _vm._v("Username")
                      ]),
                      _vm._v(" "),
                      _c("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.name,
                            expression: "name"
                          }
                        ],
                        attrs: {
                          type: "text",
                          name: "name",
                          placeholder: "Username"
                        },
                        domProps: { value: _vm.name },
                        on: {
                          input: function($event) {
                            if ($event.target.composing) {
                              return
                            }
                            _vm.name = $event.target.value;
                          }
                        }
                      })
                    ]),
                    _vm._v(" "),
                    _c("div", { staticClass: "pure-control-group" }, [
                      _c("label", { attrs: { for: "mail" } }, [_vm._v("Email")]),
                      _vm._v(" "),
                      _c("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.mail,
                            expression: "mail"
                          }
                        ],
                        attrs: {
                          type: "text",
                          name: "mail",
                          placeholder: "Email"
                        },
                        domProps: { value: _vm.mail },
                        on: {
                          input: function($event) {
                            if ($event.target.composing) {
                              return
                            }
                            _vm.mail = $event.target.value;
                          }
                        }
                      })
                    ]),
                    _vm._v(" "),
                    _c("div", { staticClass: "pure-control-group" }, [
                      _c("label", { attrs: { for: "password" } }, [
                        _vm._v("Password")
                      ]),
                      _vm._v(" "),
                      _c("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.password,
                            expression: "password"
                          }
                        ],
                        attrs: {
                          type: "password",
                          name: "password",
                          placeholder: "Password"
                        },
                        domProps: { value: _vm.password },
                        on: {
                          input: function($event) {
                            if ($event.target.composing) {
                              return
                            }
                            _vm.password = $event.target.value;
                          }
                        }
                      })
                    ]),
                    _vm._v(" "),
                    _c("div", { staticClass: "pure-control-group" }, [
                      _c("label", { attrs: { for: "confirm" } }, [
                        _vm._v("Confirm password")
                      ]),
                      _vm._v(" "),
                      _c("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.confirm,
                            expression: "confirm"
                          }
                        ],
                        attrs: {
                          type: "password",
                          name: "confirm",
                          placeholder: "Confirm password"
                        },
                        domProps: { value: _vm.confirm },
                        on: {
                          input: function($event) {
                            if ($event.target.composing) {
                              return
                            }
                            _vm.confirm = $event.target.value;
                          }
                        }
                      })
                    ]),
                    _vm._v(" "),
                    _c("div", [_vm._v(_vm._s(_vm.error))]),
                    _vm._v(" "),
                    _c(
                      "div",
                      [
                        _c(
                          "a",
                          {
                            staticClass: "btn btn_normal",
                            attrs: { href: "#", disabled: _vm.sending },
                            on: { click: _vm.register }
                          },
                          [_vm._v("Register")]
                        ),
                        _vm._v(" "),
                        _c(
                          "div",
                          { staticStyle: { margin: "0 auto", width: "16px" } },
                          [_vm._v("or")]
                        ),
                        _vm._v(" "),
                        _c(
                          "router-link",
                          {
                            staticClass: "btn btn_normal",
                            attrs: { to: "/login" }
                          },
                          [_vm._v("Login")]
                        )
                      ],
                      1
                    )
                  ])
                ])
              ])
            ],
            1
          )
        ])
      ],
      1
    )
  };
  var __vue_staticRenderFns__$8 = [];
  __vue_render__$8._withStripped = true;

    /* style */
    const __vue_inject_styles__$8 = function (inject) {
      if (!inject) return
      inject("data-v-18958e08_0", { source: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", map: undefined, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$8 = "data-v-18958e08";
    /* module identifier */
    const __vue_module_identifier__$8 = undefined;
    /* functional template */
    const __vue_is_functional_template__$8 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$8 = normalizeComponent(
      { render: __vue_render__$8, staticRenderFns: __vue_staticRenderFns__$8 },
      __vue_inject_styles__$8,
      __vue_script__$7,
      __vue_scope_id__$8,
      __vue_is_functional_template__$8,
      __vue_module_identifier__$8,
      false,
      createInjector,
      undefined,
      undefined
    );

  //
  var script$8 = {
    components: {
      Title: __vue_component__$4
    }
  };

  /* script */
  const __vue_script__$8 = script$8;

  /* template */
  var __vue_render__$9 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", [_c("Title"), _vm._v("\n  TODO\n")], 1)
  };
  var __vue_staticRenderFns__$9 = [];
  __vue_render__$9._withStripped = true;

    /* style */
    const __vue_inject_styles__$9 = function (inject) {
      if (!inject) return
      inject("data-v-2ebcd5f4_0", { source: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", map: undefined, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$9 = "data-v-2ebcd5f4";
    /* module identifier */
    const __vue_module_identifier__$9 = undefined;
    /* functional template */
    const __vue_is_functional_template__$9 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$9 = normalizeComponent(
      { render: __vue_render__$9, staticRenderFns: __vue_staticRenderFns__$9 },
      __vue_inject_styles__$9,
      __vue_script__$8,
      __vue_scope_id__$9,
      __vue_is_functional_template__$9,
      __vue_module_identifier__$9,
      false,
      createInjector,
      undefined,
      undefined
    );

  //
  var script$9 = {
    components: {
      Title: __vue_component__$4,
      Ranking: __vue_component__$1,
      Panel: __vue_component__$3
    }
  };

  /* script */
  const __vue_script__$9 = script$9;

  /* template */
  var __vue_render__$a = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      [
        _c("Title"),
        _vm._v(" "),
        _c("div", { staticClass: "pure-g" }, [
          _c("div", { staticClass: "pure-u-1 pure-u-md-1-8" }),
          _vm._v(" "),
          _c("div", { staticClass: "pure-u-1 pure-u-md-3-4" }, [
            _c("div", { staticClass: "pure-g" }, [
              _c(
                "div",
                { staticClass: "pure-u-1 pure-u-md-1-2 pure-u-lg-1-3" },
                [
                  _c(
                    "Panel",
                    [
                      _c("h2", [_vm._v("Select battle")]),
                      _vm._v(" "),
                      _c(
                        "a",
                        {
                          staticClass: "btn btn_normal",
                          attrs: { href: "/battle" }
                        },
                        [_vm._v("Start new battle")]
                      ),
                      _vm._v(" "),
                      _c(
                        "a",
                        {
                          staticClass: "btn btn_normal",
                          attrs: { href: "/single" }
                        },
                        [_vm._v("Hot seat")]
                      ),
                      _vm._v(" "),
                      _c(
                        "router-link",
                        {
                          staticClass: "btn btn_normal",
                          attrs: { to: "/single" }
                        },
                        [_vm._v("Hot seat (Vue)")]
                      )
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "pure-u-1 pure-u-md-1-2 pure-u-lg-2-3" },
                [_c("Panel", [_c("Ranking")], 1)],
                1
              )
            ])
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "pure-u-1 pure-u-md-1-8" }),
          _vm._v(" "),
          _c("div", { staticClass: "pure-u-1 pure-u-md-1-8" }),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "pure-u-1 pure-u-md-3-4" },
            [_c("Panel", [_c("h2", [_vm._v("Open battles")])])],
            1
          )
        ])
      ],
      1
    )
  };
  var __vue_staticRenderFns__$a = [];
  __vue_render__$a._withStripped = true;

    /* style */
    const __vue_inject_styles__$a = function (inject) {
      if (!inject) return
      inject("data-v-d4169814_0", { source: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", map: undefined, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$a = "data-v-d4169814";
    /* module identifier */
    const __vue_module_identifier__$a = undefined;
    /* functional template */
    const __vue_is_functional_template__$a = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$a = normalizeComponent(
      { render: __vue_render__$a, staticRenderFns: __vue_staticRenderFns__$a },
      __vue_inject_styles__$a,
      __vue_script__$9,
      __vue_scope_id__$a,
      __vue_is_functional_template__$a,
      __vue_module_identifier__$a,
      false,
      createInjector,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //

  var script$a = {
  };

  /* script */
  const __vue_script__$a = script$a;

  /* template */
  var __vue_render__$b = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", [_vm._v("\n  TODO\n")])
  };
  var __vue_staticRenderFns__$b = [];
  __vue_render__$b._withStripped = true;

    /* style */
    const __vue_inject_styles__$b = function (inject) {
      if (!inject) return
      inject("data-v-8bfb4e50_0", { source: "\n\n\n\n\n\n\n\n\n\n\n\n", map: undefined, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$b = "data-v-8bfb4e50";
    /* module identifier */
    const __vue_module_identifier__$b = undefined;
    /* functional template */
    const __vue_is_functional_template__$b = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$b = normalizeComponent(
      { render: __vue_render__$b, staticRenderFns: __vue_staticRenderFns__$b },
      __vue_inject_styles__$b,
      __vue_script__$a,
      __vue_scope_id__$b,
      __vue_is_functional_template__$b,
      __vue_module_identifier__$b,
      false,
      createInjector,
      undefined,
      undefined
    );

  /* script */

  /* template */
  var __vue_render__$c = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "game-menu" }, [
      _c("div", { staticClass: "icon" }),
      _vm._v(" "),
      _c("input", { staticClass: "wrapper", attrs: { type: "checkbox" } }),
      _vm._v(" "),
      _c("div", { staticClass: "contents" }, [
        _c("ul", [
          _c("li", [_vm._v("test 1")]),
          _vm._v(" "),
          _c("li", [_vm._v("test 2")]),
          _vm._v(" "),
          _c(
            "li",
            [_c("router-link", { attrs: { to: "/" } }, [_vm._v("Exit")])],
            1
          )
        ])
      ])
    ])
  };
  var __vue_staticRenderFns__$c = [];
  __vue_render__$c._withStripped = true;

    /* style */
    const __vue_inject_styles__$c = undefined;
    /* scoped */
    const __vue_scope_id__$c = undefined;
    /* module identifier */
    const __vue_module_identifier__$c = undefined;
    /* functional template */
    const __vue_is_functional_template__$c = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$c = normalizeComponent(
      { render: __vue_render__$c, staticRenderFns: __vue_staticRenderFns__$c },
      __vue_inject_styles__$c,
      {},
      __vue_scope_id__$c,
      __vue_is_functional_template__$c,
      __vue_module_identifier__$c,
      false,
      undefined,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //

  var script$b = {
    props: {
      stageOffset: Object
    },
    watch: {
      // whenever stageX changes, this function will run
      stageOffset(newOffset, oldOffset) {
        var stage = this.$children[0].getStage();
        var layers = stage.children
          .forEach(l => this.cullView(this.$el, stage, l));
      }
    },
    methods: {
      cullView(container, stage, layer) {
        var c = layer.children;
        var cullMargin = 20;
        var boundingX =
          -1 * stage.getAbsolutePosition().x - layer.getX() - cullMargin;
        var boundingY =
          -1 * stage.getAbsolutePosition().y - layer.getY() - cullMargin;
        var boundingWidth = container.clientWidth + cullMargin * 2;
        var boundingHeight = container.clientHeight + cullMargin * 2;
        var x = 0;
        var y = 0;
        for (var i = 0; i < c.length; i++) {
          x = c[i].getX();
          y = c[i].getY();
          if (
            x > boundingX &&
            x < boundingX + boundingWidth &&
            y > boundingY &&
            y < boundingY + boundingHeight
          ) {
            if (!c[i].visible()) {
              c[i].show();
            }
          } else {
            c[i].hide();
          }
        }
      }
    }
  };

  /* script */
  const __vue_script__$b = script$b;

  /* template */
  var __vue_render__$d = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: "slot" }, [_vm._t("default")], 2)
  };
  var __vue_staticRenderFns__$d = [];
  __vue_render__$d._withStripped = true;

    /* style */
    const __vue_inject_styles__$d = undefined;
    /* scoped */
    const __vue_scope_id__$d = undefined;
    /* module identifier */
    const __vue_module_identifier__$d = undefined;
    /* functional template */
    const __vue_is_functional_template__$d = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$d = normalizeComponent(
      { render: __vue_render__$d, staticRenderFns: __vue_staticRenderFns__$d },
      __vue_inject_styles__$d,
      __vue_script__$b,
      __vue_scope_id__$d,
      __vue_is_functional_template__$d,
      __vue_module_identifier__$d,
      false,
      undefined,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  var script$c = {
    props: {
      x: Number,
      y: Number,
      fill: String,
      opacity: Number
    },
    methods: {
      hexDrawSceneFunc(context, shape) {
        context.beginPath();
        context.moveTo(0, 30);
        context.lineTo(-26, 15);
        context.lineTo(-26, -15);
        context.lineTo(0, -30);
        context.lineTo(26, -15);
        context.lineTo(26, 15);
        context.closePath();
        context.fillStrokeShape(shape);
      }
    }
  };

  /* script */
  const __vue_script__$c = script$c;

  /* template */
  var __vue_render__$e = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("konva-shape", {
      attrs: {
        config: {
          sceneFunc: _vm.hexDrawSceneFunc,
          stroke: "#113311",
          strokeWidth: 0.7,
          strokeHitEnabled: false,
          perfectDrawEnabled: false,
          fill: _vm.fill,
          opacity: _vm.opacity,
          listening: false,
          x: _vm.x,
          y: _vm.y
        }
      }
    })
  };
  var __vue_staticRenderFns__$e = [];
  __vue_render__$e._withStripped = true;

    /* style */
    const __vue_inject_styles__$e = undefined;
    /* scoped */
    const __vue_scope_id__$e = undefined;
    /* module identifier */
    const __vue_module_identifier__$e = undefined;
    /* functional template */
    const __vue_is_functional_template__$e = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$e = normalizeComponent(
      { render: __vue_render__$e, staticRenderFns: __vue_staticRenderFns__$e },
      __vue_inject_styles__$e,
      __vue_script__$c,
      __vue_scope_id__$e,
      __vue_is_functional_template__$e,
      __vue_module_identifier__$e,
      false,
      undefined,
      undefined,
      undefined
    );

  function isArrayLike(input) {
      return input.length !== undefined;
  }
  function loadSingleImage(image) {
      var promise = new Promise(function (resolve, reject) {
          if (image.naturalWidth) {
              // If the browser can determine the naturalWidth the image is already loaded successfully
              resolve(image);
          }
          else if (image.complete) {
              // If the image is complete but the naturalWidth is 0px it is probably broken
              reject(image);
          }
          else {
              image.addEventListener('load', fulfill);
              image.addEventListener('error', fulfill);
          }
          function fulfill() {
              if (image.naturalWidth) {
                  resolve(image);
              }
              else {
                  reject(image);
              }
              image.removeEventListener('load', fulfill);
              image.removeEventListener('error', fulfill);
          }
      });
      return Object.assign(promise, { image: image });
  }
  function loadImages(input, attributes) {
      if (attributes === void 0) { attributes = {}; }
      if (input instanceof HTMLImageElement) {
          return loadSingleImage(input);
      }
      if (typeof input === 'string') {
          /* Create a <img> from a string */
          var src = input;
          var image_1 = new Image();
          Object.keys(attributes).forEach(function (name) { return image_1.setAttribute(name, attributes[name]); });
          image_1.src = src;
          return loadSingleImage(image_1);
      }
      if (isArrayLike(input)) {
          // Momentarily ignore errors
          var reflect = function (img) { return loadImages(img, attributes).catch(function (error) { return error; }); };
          var reflected = [].map.call(input, reflect);
          var tsFix_1 = Promise.all(reflected).then(function (results) {
              var loaded = results.filter(function (x) { return x.naturalWidth; });
              if (loaded.length === results.length) {
                  return loaded;
              }
              return Promise.reject({
                  loaded: loaded,
                  errored: results.filter(function (x) { return !x.naturalWidth; })
              });
          });
          // Variables named `tsFix` are only here because TypeScript hates Promise-returning functions.
          return tsFix_1;
      }
      var tsFix = Promise.reject(new TypeError('input is not an image, a URL string, or an array of them.'));
      return tsFix;
  }
  //# sourceMappingURL=index.js.map

  var defaultHeaders = { 'Content-Type': 'application/json' };
  var fetchOpts = {
      get: {
          method: 'GET',
          credentials: 'include',
          defaultHeaders
      },
      post: {
          method: 'POST',
          credentials: 'include',
          defaultHeaders
      }
  };

  function fetch$1 () {
      return { 
          get: url => fetch(url, fetchOpts.get)
              .then(response => response.text())
              .then(json => JSON.parse(json)),
          post: (url, body) => {
              var opts = body 
              ? Object.assign({}, fetchOpts.post, { 
                  body: JSON.stringify(body),
                  headers: {
                      'Accept': 'application/json, text/plain, */*',
                      'Content-Type': 'application/json'
                  }
              })
              : fetchOpts.post;
              
              return fetch(url, opts)
                  .then(response => response.text())
                  .then(json => JSON.parse(json));
          }
              
      };	
  }

  var eventBus = (function EventBus(){
    var events = {};
    return {
        on: (eventName, callback) => {
          if (!events[eventName]){
            events[eventName] = [];
          }
          events[eventName].push(callback);
        },
        publish: (eventName, data) => {
          if (events[eventName]){
            events[eventName].forEach(cb => cb(data));
          }
        }
    };    
  })();

  var army = function (army, unitTypes) {
  	this.playerId = army.id;
  	this.playerName = army.name;
  	this.unitTypes = unitTypes;
  	this.units = Object.keys(army.units).map(key => army.units[key]);
  };

  army.prototype.getArmy = function () {
  	return this.units;
  };

  army.prototype.restoreUnit = function(upd) {
  	var unit = this.units.find(u => u.id == upd.id);
  	Object.assign(unit, upd);
  };

  // Binary Heap implementation by bgrins https://github.com/bgrins/javascript-astar
  // Based on implementation by Marijn Haverbeke http://eloquentjavascript.net/1st_edition/appendix2.html

  var BinaryHeap = function (scoreFunction) {
      this.content = [];
      this.scoreFunction = scoreFunction;
  };

  BinaryHeap.prototype = {
      push: function(element) {
          // Add the new element to the end of the array.
          this.content.push(element);

          // Allow it to sink down.
          this.sinkDown(this.content.length - 1);
      },
      pop: function() {
          // Store the first element so we can return it later.
          var result = this.content[0];
          // Get the element at the end of the array.
          var end = this.content.pop();
          // If there are any elements left, put the end element at the
          // start, and let it bubble up.
          if (this.content.length > 0) {
              this.content[0] = end;
              this.bubbleUp(0);
          }
          return result;
      },
      remove: function(node) {
          var i = this.content.indexOf(node);

          // When it is found, the process seen in 'pop' is repeated
          // to fill up the hole.
          var end = this.content.pop();

          if (i !== this.content.length - 1) {
              this.content[i] = end;

              if (this.scoreFunction(end) < this.scoreFunction(node)) {
                  this.sinkDown(i);
              }
              else {
                  this.bubbleUp(i);
              }
          }
      },
      size: function() {
          return this.content.length;
      },
      rescoreElement: function(node) {
          this.sinkDown(this.content.indexOf(node));
      },
      sinkDown: function(n) {
          // Fetch the element that has to be sunk.
          var element = this.content[n];

          // When at 0, an element can not sink any further.
          while (n > 0) {

              // Compute the parent element's index, and fetch it.
              var parentN = ((n + 1) >> 1) - 1,
                  parent = this.content[parentN];
              // Swap the elements if the parent is greater.
              if (this.scoreFunction(element) < this.scoreFunction(parent)) {
                  this.content[parentN] = element;
                  this.content[n] = parent;
                  // Update 'n' to continue at the new position.
                  n = parentN;
              }
              // Found a parent that is less, no need to sink any further.
              else {
                  break;
              }
          }
      },
      bubbleUp: function(n) {
          // Look up the target element and its score.
          var length = this.content.length,
              element = this.content[n],
              elemScore = this.scoreFunction(element);

          while(true) {
              // Compute the indices of the child elements.
              var child2N = (n + 1) << 1,
                  child1N = child2N - 1;
              // This is used to store the new position of the element, if any.
              var swap = null,
                  child1Score;
              // If the first child exists (is inside the array)...
              if (child1N < length) {
                  // Look it up and compute its score.
                  var child1 = this.content[child1N];
                  child1Score = this.scoreFunction(child1);

                  // If the score is less than our element's, we need to swap.
                  if (child1Score < elemScore){
                      swap = child1N;
                  }
              }

              // Do the same checks for the other child.
              if (child2N < length) {
                  var child2 = this.content[child2N],
                      child2Score = this.scoreFunction(child2);
                  if (child2Score < (swap === null ? elemScore : child1Score)) {
                      swap = child2N;
                  }
              }

              // If the element needs to be moved, swap it, and continue.
              if (swap !== null) {
                  this.content[n] = this.content[swap];
                  this.content[swap] = element;
                  n = swap;
              }
              // Otherwise, we are done.
              else {
                  break;
              }
          }
      }
  };
  /**
   * The namespace. This namespace does by itself not include any code related to drawing Hexagons. It's just the logics of them.
   * @namespace
   */
  var BHex = BHex || {};

  /**
   * BHex.Axial is a axial position of a Hexagon within a grid.
   * @class
   * @param {number} x - Value of the X axis
   * @param {number} y - Value of the Y axis
   * @property {number} x - Value of the X axis
   * @property {number} y - Value of the Y axis
   */
  BHex.Axial = function (x, y) {
  	this.x = x;
  	this.y = y;
  };

  BHex.Axial.prototype.getKey = function () {
  	return this.x + "x" + this.y;
  };

  /**
   * Return a BHex.Cube representation of the axial.
   * @returns {BHex.Cube}
   */
  BHex.Axial.prototype.toCube = function() {
  	return new BHex.Cube(this.x, -this.x - this.y, this.y);
  };

  /**
   * Check if two Axial items has the same x and y.
   * @param {BHex.Axial} other - The object to compare to.
   * @returns {boolean}
   */
  BHex.Axial.prototype.compareTo = function(other) {
  	return (this.x == other.x && this.y == other.y);
  };

  /**
   * BHex.Cube is a cubic position of a Hexagon within a grid which includes the Z variable. Note that in a hexagonal grid, x + y + z should always equal 0!
   * @class
   * @augments BHex.Axial
   * @param {number} x - Value of the cubic X axis
   * @param {number} y - Value of the cubic Y axis
   * @param {number} [z=x + y] - Value of the cubic Z axis.
   * @property {number} x - Value of the cubic X axis
   * @property {number} y - Value of the cubic Y axis
   * @property {number} < - Value of the cubic Z axis.
   */
  BHex.Cube = function (x, y, z) {
  	BHex.Axial.call(this, x, y);
  	this.z = z || -x-y;
  };
  BHex.Cube.prototype = BHex.Axial.prototype;

  /**
   * Returns a BHex.Axial representation of the cube.
   * @returns {BHex.Axial}
   */
  BHex.Cube.prototype.toAxial = function () {
  	return new BHex.Axial(this.x, this.z);
  };

  /**
   * BHex.Hexagon
   * @class
   * @augments BHex.Axial
   * @param {number} x - Value of the X axis
   * @param {number} y - Value of the Y axis
   * @param {number} [cost=1] - The movement cost to step on the hexagon. For the pathfinding to work optimally, minimum cost should be 1.
   * @param {boolean} [blocked=false] - If movement is enabled on this hexagon.
   * @property {number} x - Value of the X axis
   * @property {number} y - Value of the Y axis
   * @property {number} cost - The movement cost to step on the hexagon. For the pathfinding to work optimally, minimum cost should be 1.
   * @property {boolean} blocked - If movement is enabled on this hexagon.
   */
  BHex.Hexagon = function (x, y, cost, blocked) {
  	BHex.Axial.call(this, x, y);

  	this.cost = (cost) ? cost : 1;
  	this.blocked = !!blocked;
  };
  BHex.Hexagon.prototype = BHex.Axial.prototype;

  /**
   * BHex.Grid is a grid of one or more Hexagons, created from the center outwards in a circle.
   * @class
   * @param {number} radius - The radius of the grid with 0 being just the center piece.
   * @property {number} radius - The radius of the grid with 0 being just the center piece.
   * @property {Array} hexes - The hexes of the grid.
   */
  BHex.Grid = function (radius) {
  	this.radius = radius || 0;
  	this.hexes = [];
  	
  	for (var x = -radius; x <= radius; x++)
  		for (var y = -radius; y <= radius; y++)
  			for (var z = -radius; z <= radius; z++)
  				if (x + y + z == 0)
  					this.hexes.push(new BHex.Hexagon(x, y));
  };

  /*BHex.Grid = function (radius, height) {
  	this.radius = radius || 0;
  	this.hexes = [];
  	
  	for (var x = -radius; x <= radius; x++)
  		for (var y = -radius; y <= radius; y++)
  			for (var z = -radius; z <= radius; z++)
  				if (x + y + z == 0 && Math.abs(y) * 2 < height)
  					this.hexes.push(new BHex.Hexagon(x, y));
  };*/

  /**
   * Get the hexagon at a given axial position.
   * @param {BHex.Axial} a - The axial position to look for.
   * @returns {BHex.Hexagon}
   */
  BHex.Grid.prototype.getHexAt = function (a) {
  	var hex;
  	this.hexes.some(function(h) {
  		if (h.compareTo(a)) 
  			return hex = h;
  	});
  	return hex;
  };

  /**
   * Get the neighboring hexagons at a given axial position.
   * @param {BHex.Axial} a - The axial position to get neighbors for.
   * @returns {BHex.Hexagon[]} Array of neighboring hexagons.
   */
  BHex.Grid.prototype.getNeighbors = function (a) {
  	var grid = this;
  	
  	var neighbors = [],
  		directions = [
  			new BHex.Axial(a.x + 1, a.y), new BHex.Axial(a.x + 1, a.y - 1), new BHex.Axial(a.x, a.y - 1),
  			new BHex.Axial(a.x - 1, a.y), new BHex.Axial(a.x - 1, a.y + 1), new BHex.Axial(a.x, a.y + 1)
  		];
  	
  	directions.forEach(function(d) {
  		var h = grid.getHexAt(d);
  		if (h) neighbors.push(h);
  	});
  	
  	return neighbors;
  	
  };

  /**
   * Gets the distance between two axial positions ignoring any obstacles.
   * @param {BHex.Axial} a - The first axial position.
   * @param {BHex.Axial} b - The second axial position.
   * @returns {number} How many hexes it is between the given Axials.
   */
  BHex.Grid.prototype.getDistance = function (a, b) {
  	return (Math.abs(a.x - b.x) 
  		+ Math.abs(a.x + a.y - b.x - b.y)
  		+ Math.abs(a.y - b.y))
  		/ 2
  };


  /**
   * Contains helper objects for doing searches within the grid.
   * @namespace
   * @private
   */
  BHex.Grid.Search = BHex.Grid.Search || {};


  /**
   * Creates a binary heap.
   * @class
   * @private
   */
  BHex.Grid.Search.Heap = function () {
  	if (!BinaryHeap) throw new Error("BinaryHeap was not found.");
  	
  	return new BinaryHeap(function (node) {
  		return node.F;
  	});
  };

  /**
   * Helper class to store data relevant to our astar search. This class is used to avoid dumping data on our hexes.
   * @class
   * @private
   * @param {BHex.Hexagon} hex - The hexagon this node is relevant for.
   * @param {BHex.Hexagon} parent - How we came to this hexagon.
   * @param {number} g - The movement cost to move from the starting point A to a given hex on the grid, following the path generated to get there.
   * @param {number} [h=0] - The Heuristic (estimated) cost to get to the final destination.
   * @property {number} F - The sum of G + H
   */
  BHex.Grid.Search.Node = function (hex, parent, g, h) {
  	this.hex = hex;
  	this.parent = this.G = this.H = this.F = null;
  	this.rescore(parent, g, h);
  };
  /**
   * Rescore the node. Set a new parent and updates the G, H and F score.
   * @param {BHex.Hexagon} parent - How we came to this hexagon.
   * @param {number} g - The movement cost to move from the starting point A to a given hex on the grid, following the path generated to get there.
   * @property {number} [h=0] - The Heuristic (estimated) cost to get to the final destination.
   */
  BHex.Grid.Search.Node.prototype.rescore = function (parent, g, h) {
  	this.parent = parent;
  	this.G = g;
  	this.H = h || 0;
  	this.F = this.G + this.H;
  };

  /**
   * Get a line of sight between two axial positions.
   * @param {BHex.Axial} start -  The starting axial position.
   * @param {BHex.Axial} end -  The ending axial position.
   * @returns {BHex.Hexagon[]} The hexagons along the line of sight, excluding starting position.
   */
  BHex.Grid.prototype.getLine = function (start, end) {
  	if (start.compareTo(end)) return [];
  	
  	var cube_lerp = function (a, b, t) {
  			return new BHex.Cube(a.x + (b.x - a.x) * t,
  								 a.y + (b.y - a.y) * t,
  								 a.z + (b.z - a.z) * t);
  		},
  	
  		N = this.getDistance(start, end),
  		line1 = [],
  		line2 = [],
  		
  		cStart = start.toCube(),
  		cEnd1 = end.toCube(),
  		cEnd2 = end.toCube();
  	
  	// Offset the ends slightly to get two lines, handling horizontal and vertical lines (in FlatTop and PointyTop respectively).
  	cEnd1.x -= 1e-6; cEnd1.y -= 1e-6; cEnd1.z += 2e-6;
  	cEnd2.x += 1e-6; cEnd2.y += 1e-6; cEnd2.z -= 2e-6;
  	
  	for (var i = 0; i <= N; i++) {
  		var axial = cube_lerp(cStart, cEnd1, 1.0/N * i).round().toAxial();
  		
  		var hex = this.getHexAt(axial);
  		
  		if (!start.compareTo(hex)) {
  			if (!hex.blocked) {
  				line1.push(hex);
  			} else break;
  		}
  	}

  	for (var i = 0; i <= N; i++) {
  		var axial = cube_lerp(cStart, cEnd2, 1.0/N * i).round().toAxial();
  		
  		var hex = this.getHexAt(axial);
  		
  		if (!start.compareTo(hex)) {
  			if (!hex.blocked) {
  				line2.push(hex);
  			} else break;
  		}
  	}
  	
  	return (line1.length > line2.length) ? line1 : line2;
  };

  BHex.Grid.prototype.getConeRange = function (coneStart, coneEnd, movement, ignoreInertia) {
  	var startRange = this.getRange(coneStart, movement, ignoreInertia);
  	var endRange = this.getRange(coneEnd, movement - 1, true);
  	endRange.push(this.getHexAt(coneEnd));
  	endRange = endRange.concat(this.getNeighbors(coneStart));
  	let a = new Set(startRange);
  	let b = new Set(endRange);
  	let intersection = new Set([...a].filter(x => b.has(x)));
  	return [...intersection];
  };

  /**
   * Gets all the hexes within a specified range, taking inertia (BHex.Hexagon.cost) into account.
   * @param {BHex.Axial} a - The starting axial position.
   * @param {number} movement - How far from the starting axial should be fetched.
   * @returns {BHex.Hexagon[]} All the hexes within range (excluding the starting position).
   */
  BHex.Grid.prototype.getRange = function (start, movement, ignoreInertia) {
  	var grid = this,
  	
  		openHeap = BHex.Grid.Search.Heap(),
  		closedHexes = {},
  		visitedNodes = {};

  	openHeap.push(new BHex.Grid.Search.Node(start, null, 0));
  	
  	while(openHeap.size() > 0) {
  		// Get the item with the lowest score (current + heuristic).
  		var current = openHeap.pop();
  		
  		// Close the hex as processed.
  		closedHexes[current.hex.getKey()] = current.hex;
  		
  		// Get and iterate the neighbors.
  		var neighbors = grid.getNeighbors(current.hex);

  		neighbors.forEach(function(n) {
  			// Make sure the neighbor is not blocked and that we haven't already processed it.
  			if ((!ignoreInertia && n.blocked) || closedHexes[n.getKey()]) return;
  			
  			// Get the total cost of going to this neighbor.
  			var g = current.G + (ignoreInertia ? 1: n.cost),
  				visited = visitedNodes[n.getKey()];
  			
  			// Is it cheaper the previously best path to get here?
  			if (g <= movement && (!visited || g < visited.G)) {
  				var h = 0;
  				
  				if (!visited) {
  					// This was the first time we visited this node, add it to the heap.
  					var nNode = new BHex.Grid.Search.Node(n, current, g, h);
  					visitedNodes[n.getKey()] = nNode;
  					openHeap.push(nNode);
  				} else {
  					// We've visited this path before, but found a better path. Rescore it.
  					visited.rescore(current, g, h);
  					openHeap.rescoreElement(visited);
  				}
  			}
  		});
  	}
  	
  	var arr = [];
  	for (var i in visitedNodes)
  		if (visitedNodes.hasOwnProperty(i))
  			arr.push(visitedNodes[i].hex);
  	
  	return arr;
  };

  /**
   * Get the shortest path from two axial positions, taking inertia (BHex.Hexagon.cost) into account.
   * @param {BHex.Axial} start - The starting axial position.
   * @param {BHex.Axial} end - The ending axial position.
   * @returns {BHex.Hexagon[]} The path from the first hex to the last hex (excluding the starting position).
   */
  BHex.Grid.prototype.findPath = function (start, end, ignoreInertia) {
  	var grid = this,
  		openHeap = new BHex.Grid.Search.Heap(),
  		closedHexes = {},
  		visitedNodes = {};
  	
  	openHeap.push(new BHex.Grid.Search.Node(start, null, 0, grid.getDistance(start, end)));
  	
  	while(openHeap.size() > 0) {
  		// Get the item with the lowest score (current + heuristic).
  		var current = openHeap.pop();
  		
  		// SUCCESS: If this is where we're going, backtrack and return the path.
  		if (current.hex.compareTo(end)) {
  			var path = [];
  			while(current.parent) {
  				path.push(current);
  				current = current.parent;
  			}
  			return path.map(function(x) { return x.hex; }).reverse();
  		}
  		
  		// Close the hex as processed.
  		closedHexes[current.hex.getKey()] = current;
  		
  		// Get and iterate the neighbors.
  		var neighbors = grid.getNeighbors(current.hex);
  		neighbors.forEach(function(n) {
  			// Make sure the neighbor is not blocked and that we haven't already processed it.
  			if ((!ignoreInertia && n.blocked) || closedHexes[n.getKey()]) return;
  			
  			// Get the total cost of going to this neighbor.
  			var g = current.G + (ignoreInertia ? 1: n.cost),
  				visited = visitedNodes[n.getKey()];
  			
  			// Is it cheaper the previously best path to get here?
  			if (!visited || g < visited.G) {
  				var h = grid.getDistance(n, end);
  				
  				if (!visited) {
  					// This was the first time we visited this node, add it to the heap.
  					var nNode = new BHex.Grid.Search.Node(n, current, g, h);
  					closedHexes[nNode.hex.getKey()] = nNode;
  					openHeap.push(nNode);
  				} else {
  					// We've visited this path before, but found a better path. Rescore it.
  					visited.rescore(current, g, h);
  					openHeap.rescoreElement(visited);
  				}
  			}
  		});
  	}

  	// Failed to find a path
  	return [];
  };

  var bhex = BHex;
  // Extend a few objects from BHex

  /**
   * The center of the hexagon.
   * @type {BHex.Drawing.Point}
   */
  BHex.Hexagon.prototype.center = null;

  /**
   * Array of each of the 6 corners in the hexagon.
   * @type {BHex.Drawing.Point[]}
   */
  BHex.Hexagon.prototype.points = null;

  /**
   * Rounds the values of x, y and z. Needed to find a hex at a specific position. Returns itself after.
   */
  BHex.Cube.prototype.round = function () {
  	var cx = this.x, 
  		cy = this.y,
  		cz = this.z;
  	
  	this.x = Math.round(cx);
  	this.y = Math.round(cy);
  	this.z = Math.round(cz);

  	var x_diff = Math.abs(this.x - cx),
  		y_diff = Math.abs(this.y - cy),
  		z_diff = Math.abs(this.z - cz);

  	if (x_diff > y_diff && x_diff > z_diff)
  		this.x = -this.y -this.z;
  	else if (y_diff > z_diff)
  		this.y = -this.x -this.z;
  	else
  		this.z = -this.x -this.y;
  	
  	return this;
  };


  /**
   * This namespace does not include any code related to actually drawing hexagons. It's just the logics needed to draw them, such as calculating the corners and finding a hexagon at a specific point.
   * @namespace
   */
  BHex.Drawing = BHex.Drawing || {};

  /**
   * BHex.Drawing is used for all you need to draw the hexagon grid and finding hexagons within the grid. 
   * In using this constructor, the corners of all the hexes will be generated.
   * @class
   * @param {BHex.Grid} grid - The grid of hexagons to be used.
   * @param {BHex.Drawing.Options} options - Options to be used.
   * @property {BHex.Grid} grid - The grid of hexagons to be used.
   * @property {BHex.Drawing.Options} options - Options to be used.
   */
  BHex.Drawing.Drawing = function (grid, options) {

  	this.grid = grid;
  	this.options = options;
  	
  	this.grid.hexes.forEach(function(hex) {
  		hex.center = BHex.Drawing.Drawing.getCenter(hex, options);
  		hex.points = BHex.Drawing.Drawing.getCorners(hex.center, options);
  	});
  };

  /**
   * Creates 6 points that marks the corners of a hexagon.
   * @private
   * @param {BHex.Drawing.Point} center - The center point of the hexagon.
   * @param {BHex.Drawing.Options} options - Drawing options to be used.
   * @returns {BHex.Drawing.Point[]}
   */
  BHex.Drawing.Drawing.getCorners = function (center, options) {
  	var points = [];
  		
  	for (var i = 0; i < 6; i++) {
  		points.push(BHex.Drawing.Drawing.getCorner(center, options, i));
  	}
  	return points;
  };

  /**
   * Find the given corner for a hex.
   * @param {BHex.Drawing.Point} center - The center of the hexagon.
   * @param {BHex.Drawing.Options} options - Drawing options to be used.
   * @param {number} corner - Which of the 6 corners should be calculated?
   * @returns {BHex.Drawing.Point}
   */
  BHex.Drawing.Drawing.getCorner = function (center, options, corner) {
  	var offset = (options.orientation == BHex.Drawing.Static.Orientation.PointyTop) ? 90 : 0,
  		angle_deg = 60 * corner + offset,
  		angle_rad = Math.PI / 180 * angle_deg;
  	return new BHex.Drawing.Point(Math.round(center.x + options.size * Math.cos(angle_rad)),
  								  Math.round(center.y + options.size * Math.sin(angle_rad)));
  };

  /**
   * Find the center point of the axial, given the options provided.
   * @param {BHex.Axial} axial - The axial for which to find the center point.
   * @param {BHex.Drawing.Options} options - Drawing options to be used.
   * @returns {BHex.Drawing.Point}
   */
  BHex.Drawing.Drawing.getCenter = function (axial, options) {
  	var x = 0, y = 0, c = axial.toCube();
  			
  	if (options.orientation == BHex.Drawing.Static.Orientation.FlatTop) {
  		x = c.x * options.width * 3/4;
  		y = (c.z + c.x / 2) * options.height;
  		
  	} else {
  		x = (c.x + c.z / 2) * options.width;
  		y = c.z * options.height * 3/4;
  	}
  	
  	return new BHex.Drawing.Point(Math.round(x), Math.round(y));
  };

  /**
   * Get the hexagon at a specific point.
   * @param {BHex.Drawing.Point} p - The points for which to find a hex.
   * @returns {BHex.Hexagon}
   */
  BHex.Drawing.Drawing.prototype.getHexAt = function (p) {
  	var x, y;
  	
  	if (this.options.orientation == BHex.Drawing.Static.Orientation.FlatTop) {
  		x = p.x * 2/3 / this.options.size;
  		y = (-p.x / 3 + Math.sqrt(3)/3 * p.y) / this.options.size;
  	} else {
  		x = (p.x * Math.sqrt(3)/3 - p.y / 3) / this.options.size;
  		y = p.y * 2/3 / this.options.size;
  	}
  	
  	var a = new BHex.Axial(x, y).toCube().round().toAxial();
  	
  	return this.grid.getHexAt(a);
  };

  /**
   * A number of enums used to describe a grid.
   * @namespace
   */
  BHex.Drawing.Static = {
  	/**
  	 * The rotation of the hexagon when drawn.
  	 * @enum {number}
  	 */
  	Orientation: {
  		/** The hexagon will have flat tops and bottom, and pointy sides. */
  		FlatTop: 1,
  		/** The hexagon will have flat sides, and pointy top and bottom. */
  		PointyTop: 2
  	}
  };

  /**
   * BHex.Drawing.Point is a horizontal and vertical representation of a position. 
   * @class
   * @param {number} x - The horizontal position.
   * @param {number} y - The vertical position.
   * @property {number} x - The horizontal position.
   * @property {number} y - The vertical position.
   */
  BHex.Drawing.Point = function (x, y) {
  	this.x = x;
  	this.y = y;
  };

  /**
   * A Hexagon is a 6 sided polygon, our hexes don't have to be symmetrical, i.e. ratio of width to height could be 4 to 3
   * @class
   * @param {number} side - How long the flat side should be.
   * @param {BHex.Drawing.Static.Orientation} [orientation=BHex.Drawing.Static.Orientation.FlatTop] - Which orientation the hex will have.
   * @param {BHex.Drawing.Point} [center=new BHex.Drawing.Point(0, 0)] - Where is the center of the grid located. This helps by saving you the trouble of keeping track of the offset yourself.
   * @property {number} side - How long the flat side should be.
   * @property {BHex.Drawing.Static.Orientation} orientation - Which orientation the hex will have.
   */
  BHex.Drawing.Options = function (side, orientation, center) {
  	this.size = side;
  	this.orientation = orientation || BHex.Drawing.Static.Orientation.FlatTop;
  	this.center = center || new BHex.Drawing.Point(0, 0);
  	
  	if (this.orientation == BHex.Drawing.Static.Orientation.FlatTop) {
  		this.width = side * 2;
  		this.height = Math.sqrt(3) / 2 * this.width;
  	} else {
  		this.height = side * 2;
  		this.width = Math.sqrt(3) / 2 * this.height;
  	}
  };

  function initGrid(sceneSize, terrain, units, getters, actions) {
    function setSelectedHex(x, y) {
      grid.selectedHex = null;
      if (x != undefined && y != undefined) {
        var hex = grid.getHexAt(new bhex.Axial(x, y));
        grid.selectedHex = hex;
      }
    }

    function getMoveCost(sourceHex, targetHex, range) {
      var gridPath = grid.findPath(new bhex.Axial(sourceHex.x, sourceHex.y), new bhex.Axial(targetHex.x, targetHex.y));
      var path = gridPath.filter(h => getters.terrain().find(t => t.x == h.x && t.y == h.y)) || [];
      var cost = path.map(x => x.cost).reduce((a, b) => a + b, 0);
      return cost;
    }

    function getPathInRange(sourceHex, targetHex) {
      var unit = getters.unitAt(sourceHex.x, sourceHex.y);
      if (!unit) {
        var gridPath = grid.findPath(new bhex.Axial(sourceHex.x, sourceHex.y), new bhex.Axial(targetHex.x, targetHex.y), ignoreInertia);
        var path = gridPath.filter(h => getters.terrain().find(t => t.x == h.x && t.y == h.y));

        return [sourceHex].concat(path);
      }
      else {
        var range;
        var ignoreInertia;
        var unitState = getters.unitState(unit);
        var gridPath = [];

        switch (unitState) {
          case 'moving':
            range = unit.mobility;
            gridPath = grid.findPath(new bhex.Axial(sourceHex.x, sourceHex.y), new bhex.Axial(targetHex.x, targetHex.y), ignoreInertia);
            if (gridPath.length && unit.agility) {
              var t = getTurnCoords();
              var x = t[unit.directions[0] - 1];
              var posStart = new bhex.Axial(sourceHex.x, sourceHex.y);
              var posEnd = new bhex.Axial(unit.pos.x + (x.x * (unit.mobility - 1)), unit.pos.y + (x.y * (unit.mobility - 1)));
              var gridRange = grid.getConeRange(posStart, posEnd, unit.mobility);
              gridPath = gridPath.filter(x => gridRange.some(g => g.x == x.x && g.y == x.y));
            }
            break;
          case 'attacking':
            range = unit.range;
            ignoreInertia = true;
            gridPath = grid.findPath(new bhex.Axial(sourceHex.x, sourceHex.y), new bhex.Axial(targetHex.x, targetHex.y), ignoreInertia);
            break;
        }
        var path = gridPath.filter(h => getters.terrain().find(t => t.x == h.x && t.y == h.y));

        var inRange = path.reduce((acc, curr) => {
          var accCost = acc.map(x => x.cost).reduce((a, b) => a + b, -sourceHex.cost);
          if (ignoreInertia || accCost + curr.cost <= range) {
            acc.push(curr);
          }
          return acc;
        }, [sourceHex]);
        return inRange;
      }
    }

    function hexSelected(hex) {
      var selectedHex = grid.selectedHex;
      if (selectedHex) {
        selectedHex.blocked = false;
      }
      var unit = grid.selectedHex && hex ? getters.unitAt(grid.selectedHex.x, grid.selectedHex.y) : null;

      var unitState = getters.unitState(unit);
      switch (unitState) {
        case 'moving':
          var path = getPathInRange(selectedHex, hex);
          var lastStep = path[path.length - 1];
          if (lastStep.x == hex.x && lastStep.y == hex.y) {
            actions.unitMoving(unit, hex.x, hex.y);
          }
          break;
        case 'turning':
          actions.unitTurning(unit, hex.x, hex.y);
          break;
        case 'attacking':
          var path = getPathInRange(selectedHex, hex, unit.range);
          var lastStep = path[path.length - 1];
          if (lastStep.x == hex.x && lastStep.y == hex.y) {
            actions.unitAttacking(unit, hex.x, hex.y);
          }
          break;
        default:
          var unit = getters.nextUnit();
          if (unit) {
            var nextHex = grid.getHexAt(new bhex.Axial(unit.pos.x, unit.pos.y));
            setSelectedHex(nextHex.x, nextHex.y);
          }
          break;
      }
    }
    function getTurnCoords() {
      return [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 1 },
        { x: -1, y: 0 },
        { x: 0, y: -1 },
        { x: 1, y: -1 },
      ];
    }

    function getTurnAngle(unit) {
      var turns = getTurnCoords();

      var dir = unit.directions[0];

      var t = [turns[dir - 1]];
      for (var i = 1; i <= unit.agility; i++) {
        var n1 = dir - 1 - i;
        if (n1 < 0) {
          n1 = turns.length + n1;
        }
        var n2 = dir - 1 + i;
        if (n2 > turns.length - 1) {
          n2 = n2 - turns.length;
        }
        t.push(turns[n1]);
        t.push(turns[n2]);
      }
      return t;
    }

    function getSelectedHexRange() {
      var unit = grid.selectedHex ? getters.unitAt(grid.selectedHex.x, grid.selectedHex.y) : null;
      if (!unit) {
        return [];
      }

      var state = getters.unitState(unit);
      var gridRange = [];
      if (state == 'moving') {
        if (!unit.agility) {
          gridRange = grid.getRange(new bhex.Axial(grid.selectedHex.x, grid.selectedHex.y), unit.mobility);
        }
        else {
          var t = getTurnCoords();
          var x = t[unit.directions[0] - 1];
          var posStart = new bhex.Axial(grid.selectedHex.x, grid.selectedHex.y);
          var posEnd = new bhex.Axial(unit.pos.x + (x.x * (unit.mobility - 1)), unit.pos.y + (x.y * (unit.mobility - 1)));
          gridRange = grid.getConeRange(posStart, posEnd, unit.mobility);
        }
      }
      else if (state == 'turning') {
        gridRange = getTurnAngle(unit).map(a => grid.getHexAt(new bhex.Axial(unit.pos.x + a.x, unit.pos.y + a.y)));
      }
      else {
        gridRange = grid.getRange(new bhex.Axial(grid.selectedHex.x, grid.selectedHex.y), unit.range, true);
      }

      return gridRange.filter(h => getters.terrain().find(t => t.x == h.x && t.y == h.y));
    }
    function getSelectedHexState() {
      return getters.unitState(grid.selectedHex ? getters.unitAt(grid.selectedHex.x, grid.selectedHex.y) : null);
    }
    function initDrawing(center) {
      var sideWidth = 30;
      var options = new bhex.Drawing.Options(sideWidth, bhex.Drawing.Static.Orientation.PointyTop, new bhex.Drawing.Point(center.x, center.y));
      bhex.Drawing.Drawing(grid, options);

      var minX = 999999999;
      var minY = 999999999;
      var maxX = 0;
      var maxY = 0;
      getHexes().sort((a, b) => {
        if (a.center.x < minX) minX = a.center.x;
        if (a.center.x > maxX) maxX = a.center.x;
        if (a.center.y < minY) minY = a.center.y;
        if (a.center.y > maxY) maxY = a.center.y;

        if (a.y > b.y) return 1;
        if (a.y < b.y) return -1;

        if (a.x > b.x) return 1;
        if (a.x < b.x) return -1;

        return 0;
      });

      return { minX, minY, maxX, maxY };
    }
    function getHexes() {
      return getters.terrain().map(t => grid.hexes.find(h => t.x == h.x && t.y == h.y));
    }
    var grid = new bhex.Grid(sceneSize);

    terrain.forEach(terrain => {
      grid.getHexAt(new bhex.Axial(terrain.x, terrain.y)).cost = terrain.cost;
    });

    return {
      getHexes: getHexes,
      getSelectedHex: () => grid.selectedHex ? grid.getHexAt(new bhex.Axial(grid.selectedHex.x, grid.selectedHex.y)) : null,
      getHexAt: (x, y) => grid.getHexAt(new bhex.Axial(x, y)),
      hexSelected: hexSelected,
      getSelectedHexRange: getSelectedHexRange,
      getSelectedHexState: getSelectedHexState,
      getPathBetween: getPathInRange,
      getSelectedHexMoveCost: (x, y) => grid.selectedHex ? getMoveCost(grid.selectedHex, grid.getHexAt(new bhex.Axial(x, y)), getters.unitAt(grid.selectedHex.x, grid.selectedHex.y)) : null,
      initDrawing: initDrawing,
      setBlocked: (posArray) => {
        var set = new Set(posArray.map(p => `${p.x}:${p.y}`));
        getHexes().forEach(h => {
          h.blocked = set.has(`${h.x}:${h.y}`);
        });
      }
    }
  }

  function requestMove(bid, uid, x, y) {
      fetch$1().post(`/singlebattle/${bid}/${uid}/move/${x}/${y}`).then(data =>{
          eventBus.publish(data.event, data);
      });
  }
  function requestTurn(bid, uid, x, y){
      fetch$1().post(`/singlebattle/${bid}/${uid}/turn/${x}/${y}`).then(data =>{
          eventBus.publish(data.event, data);
      });
  }
  function requestAttack(bid, uid, x, y){
      fetch$1().post(`/singlebattle/${bid}/${uid}/attack/${x}/${y}`).then(data =>{
          eventBus.publish(data.event, data);
      });
  }

  function loadImages$1() {
      return loadImages([
          "/images/grid/plain1.png",
          "/images/grid/plain2.png",
          "/images/grid/plain3.png",
          "/images/grid/plain4.png",
          "/images/grid/plain5.png",
          "/images/grid/plain6.png",
          "/images/grid/forrest1.png",
          "/images/grid/forrest2.png"
      ]).then(imgs => {
          return {
              plains: imgs.slice(0, 6),
              forrests: [imgs[6], imgs[7]]
          };
      });
  }

  const state$1 = Vue.observable({
      center: { x: 0, y: 0 },
      boundingBox: null,
      sceneSize: '',
      grid: null,
      imageShapes: [],
      animating: false,
      pendingAnimations: {},
      battleState: '',
      battleId: '',
      selfArmy: null,
      terrain: null,
      unitQueue: [],
      firstArmy: null,
      secondArmy: null,
      nextPlayer: null,
      winningArmy: null,
      selectedHex: null,
      unitHexes: [],
      targetUnit: null,
      currentUnit: null
  });

  const getters$1 = {
      animating: () => state$1.animating,
      pendingAnimations: () => state$1.pendingAnimations,
      center: () => state$1.center,
      boundingBox: () => state$1.boundingBox,
      grid: () => state$1.grid,
      selectedHex: () => state$1.selectedHex,
      imageShapes: () => state$1.imageShapes,
      sceneSize: () => state$1.sceneSize,
      battleState: () => state$1.battleState,
      battleId: () => state$1.battleId,
      selfArmy: () => state$1.selfArmy,
      terrain: () => state$1.terrain,
      unitQueue: () => state$1.unitQueue,
      firstArmy: () => state$1.firstArmy,
      secondArmy: () => state$1.secondArmy,
      currentUnit: () => state$1.currentUnit,
      currentUnitRange: () => {
          if (getters$1.currentUnit() && getters$1.isPlayerArmy(getters$1.currentUnit().id)) {
              return state$1.grid.getSelectedHexRange();
              // disabled of performance reasons
              //this.path = this.grid.getPathBetween(selHex, hex);
          }
          return [];
      },
      currentUnitState: () => {
          if (getters$1.currentUnit() && getters$1.isPlayerArmy(getters$1.currentUnit().id)) {
              return state$1.grid.getSelectedHexState();
          }
          return null;
      },
      targetUnit: () => state$1.targetUnit,
      nextUnit: () => getters$1.units().find(u => u.id == state$1.unitQueue[0]),
      nextPlayer: () => actions.getArmy(nextUnit).playerName,
      winningArmy: () => state$1.winningArmy,
      unitHexes: () => state$1.unitHexes,
      units: () => {
          if (!state$1.firstArmy) {
              return null;
          }
          if (!state$1.secondArmy) {
              return state$1.firstArmy.getArmy();
          }
          return state$1.firstArmy.getArmy().concat(state$1.secondArmy.getArmy());
      },
      army(unitId) {
          return state$1.firstArmy.getArmy().some(x => x.id == unitId)
              ? state$1.firstArmy
              : state$1.secondArmy;
      },
      opposingArmy(unitId) {
          return state$1.firstArmy.getArmy().some(x => x.id == unitId)
              ? state$1.secondArmy
              : state$1.firstArmy;
      },
      unitAt(x, y) {
          return getters$1.units().find(u => u.pos.x == x && u.pos.y == y);
      },
      unitState(unit) {
          if (!unit) {
              return 'none';
          }
          if (unit.endurance <= 0) {
              return 'dead';
          }
          if (unit.mobility > 0) {
              return 'moving';
          }
          if (unit.agility > 0) {
              return 'turning';
          }
          if (unit.attacks > 0) {
              return 'attacking';
          }
      },
      isPlayerArmy(unitId, exactMatch) {
          var army = getters$1.army(unitId);
          if (exactMatch) {
              return state$1.selfArmy === army.playerId;
          }

          return state$1.selfArmy === army.playerId
              || '_' + state$1.selfArmy === army.playerId
              || state$1.selfArmy === '_' + army.playerId;
      },
  };

  const mutations$1 = {
      loadData(data, single) {
          var armies = Object.keys(data.armies).map(key => data.armies[key]);
          sessionStorage.setItem(single ? 'singlebattleid' : 'battleid', data.id);
          state$1.battleState = 'created';
          state$1.battleId = data.id;
          state$1.selfArmy = data.selfArmy;
          state$1.terrain = data.terrain;
          state$1.sceneSize = data.sceneSize;
          state$1.unitQueue = data.turns[data.turns.length - 1].readyUnits;
          state$1.firstArmy = new army(armies[0], data.unitTypes);
          //var bsTxt1 = this.getBattleStateText();
          //setTimeout(() => eventBus.publish('battlestate', bsTxt1), 0);
          if (armies.length == 2) {
              state$1.secondArmy = new army(armies[1], data.unitTypes);
              state$1.battleState = 'ready';
              state$1.winningArmy = data.winningArmy;
              if (state$1.winningArmy) {
                  return mutations$1.end(data);
              }
              //var bsTxt2 = this.getBattleStateText();
              setTimeout(() => eventBus.publish('battlestarted'), 0);
              //setTimeout(() => eventBus.publish('battlestate', bsTxt2), 0);
              var nextUnitArmy = getters$1.army(getters$1.nextUnit().id);
              setTimeout(() => eventBus.publish('battlestate', `${nextUnitArmy.playerName} ${getters$1.nextUnit().type} unit is next to act`), 0);
          }
          else {
              setTimeout(() => eventBus.publish('battlewaiting'), 0);
          }
          state$1.grid = initGrid(state$1.sceneSize, state$1.terrain, state$1.firstArmy.getArmy().concat(state$1.secondArmy.getArmy()), getters$1, actions);

          var { minX, minY, maxX, maxY } = state$1.grid.initDrawing(state$1.center);
          state$1.boundingBox = { minX: minX, minY: minY, maxX: maxX, maxY: maxY };
          var y = (Math.abs(state$1.boundingBox.minY) + Math.abs(state$1.boundingBox.maxY) + 160) / 2;
          mutations$1.setCenter(state$1.center.x, y);

          mutations$1.setUnitHexes();

          state$1.grid.hexSelected();
          var selHex = state$1.grid.getSelectedHex();
          if (selHex) {
              state$1.selectedHex = selHex;
              var unit = getters$1.unitAt(selHex.x, selHex.y);
              state$1.currentUnit = unit;
          }

          eventBus.on('update', mutations$1.update);
          eventBus.on('end', mutations$1.end);
      },
      update(data) {
          state$1.battleState = 'started';
          state$1.currentUnit = data.currUnit;
          state$1.currentUnit.agility = data.currUnit.agility;
          state$1.currentUnit.mobility = data.currUnit.mobility;
          state$1.currentUnit.pos = data.currUnit.pos;
          var delta = {
              source: getters$1.nextUnit().pos,
              target: data.currUnit.pos
          };
          state$1.unitQueue = data.unitQueue;
          state$1.targetUnit = delta.target;

          mutations$1.setUnitHexes();
          actions.animateUnit(state$1.currentUnit, delta.source, delta.target);

          setTimeout(() => eventBus.publish('battleupdated', { delta: delta, data: data }), 0);
          //setTimeout(() => eventBus.publish('battlestate', this.getBattleStateText()), 0);
          var nextUnit = getters$1.nextUnit();
          nextUnit.agility = data.nextUnit.agility;
          nextUnit.mobility = data.nextUnit.mobility;
          nextUnit.pos = data.nextUnit.pos;
          
          var nextUnitArmy = getters$1.army(nextUnit.id);
          setTimeout(() => eventBus.publish('battlestate', `${nextUnitArmy.playerName} ${getters$1.nextUnit().type} unit is next to act`), 0);
      },
      end(data) {
          state$1.battleState = 'finished';
          mutations$1.setUnitHexes();
          //setTimeout(() => eventBus.publish('battleended', this.getBattleSummary(data)), 0);
          //setTimeout(() => eventBus.publish('battlestate', this.getBattleStateText()), 0);
      },
      setCenter(x, y) {
          state$1.center = { x: x, y: y };
      },
      setSelectedHex(hex) {
          state$1.selectedHex = hex;
          state$1.grid.hexSelected(hex);
      },
      setUnitHexes() {
          state$1.unitHexes = getters$1.units().map(u => getters$1.grid().getHexAt(u.pos.x, u.pos.y));
          getters$1.grid().setBlocked(state$1.unitHexes);
      },
      setPendingAnimations(unit, animation) {
          if (!unit || !animation) {
              state$1.pendingAnimations = {};
          }
          else {
              state$1.pendingAnimations[unit.id] = animation;
              state$1.pendingAnimations = Object.assign({}, state$1.pendingAnimations);
          }
      },
      setAnimating(anim) {
          if (!anim) {
              mutations$1.setPendingAnimations(null);
          }
          state$1.animating = anim;
      }
  };

  const actions = {
      load() {
          var battleid = sessionStorage.getItem('singlebattleid');
          var url = `/singlebattle/join/${battleid ? battleid : ''}`;
          Promise.all([loadImages$1(), fetch$1().post(url)]).then(result => {
              var images = result[0];
              var data = result[1];

              state$1.imageShapes = {
                  plains: images.plains,
                  forrests: images.forrests
              };
              mutations$1.loadData(data, true);
          });
      },
      setCenter(x, y) {
          mutations$1.setCenter(x, y);
      },
      setSelectedHex(hex) {
          mutations$1.setSelectedHex(hex);
      },
      unitMoving(unit, x, y) {
          requestMove(state$1.battleId, unit.id, x, y);
      },
      unitTurning(unit, x, y) {
          requestTurn(state$1.battleId, unit.id, x, y);
      },
      unitAttacking(unit, x, y) {
          requestAttack(state$1.battleId, unit.id, x, y);
      },
      animateUnit(unit, from, to) {
          var animationPath = getters$1.grid().getPathBetween(
              getters$1.grid().getHexAt(from.x, from.y),
              getters$1.grid().getHexAt(to.x, to.y)
          );
          mutations$1.setPendingAnimations(unit, animationPath);
          mutations$1.setAnimating(true);
      },
      updateGrid() {
          var nextUnit = getters$1.nextUnit();
          var nextHex = getters$1.grid().getHexAt(nextUnit.pos.x, nextUnit.pos.y);
          mutations$1.setSelectedHex(nextHex);
      }
  };

  //

  var script$d = {
    components: {
      Hex: __vue_component__$e
    },
    computed:{
      imageShapes: () => getters$1.imageShapes(),
      center: () => getters$1.center(),
      hexes: () => getters$1.grid() ? getters$1.grid().getHexes() : []
    },
    methods: {
      getHexTerrainImage(hex) {
        if (hex.cost < 0) {
          return;
        } else if (hex.cost == 1) {
          var gNumber = Math.floor(Math.random() * 6);
          return this.imageShapes.plains[gNumber];
        } else {
          var gNumber = Math.floor(Math.random() * 2);
          return this.imageShapes.forrests[gNumber];
        }
      },
      hexSelected(evt, hex) {
        actions.setSelectedHex(hex);
      },
      hexFocused(evt, hex) {
        this.$emit("focused", hex);
      }
    }
  };

  /* script */
  const __vue_script__$d = script$d;

  /* template */
  var __vue_render__$f = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "konva-layer",
      { ref: "layer" },
      _vm._l(_vm.hexes, function(hex) {
        return _c(
          "konva-group",
          {
            key: hex.x + ":" + hex.y,
            attrs: {
              config: {
                x: _vm.center.x + hex.center.x,
                y: _vm.center.y + hex.center.y
              }
            },
            on: {
              click: function(evt) {
                return _vm.hexSelected(evt, hex)
              },
              dbltap: function(evt) {
                return _vm.hexSelected(evt, hex)
              },
              tap: function(evt) {
                return _vm.hexFocused(evt, hex)
              },
              mouseenter: function(evt) {
                return _vm.hexFocused(evt, hex)
              }
            }
          },
          [
            _c("konva-image", {
              attrs: {
                config: {
                  image: _vm.getHexTerrainImage(hex),
                  width: 70,
                  height: 70,
                  offset: {
                    x: 35,
                    y: 35
                  },
                  opacity: 0.99,
                  rotation: 30,
                  listening: true,
                  perfectDrawEnabled: false
                }
              }
            }),
            _vm._v(" "),
            _c("Hex")
          ],
          1
        )
      }),
      1
    )
  };
  var __vue_staticRenderFns__$f = [];
  __vue_render__$f._withStripped = true;

    /* style */
    const __vue_inject_styles__$f = undefined;
    /* scoped */
    const __vue_scope_id__$f = undefined;
    /* module identifier */
    const __vue_module_identifier__$f = undefined;
    /* functional template */
    const __vue_is_functional_template__$f = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$f = normalizeComponent(
      { render: __vue_render__$f, staticRenderFns: __vue_staticRenderFns__$f },
      __vue_inject_styles__$f,
      __vue_script__$d,
      __vue_scope_id__$f,
      __vue_is_functional_template__$f,
      __vue_module_identifier__$f,
      false,
      undefined,
      undefined,
      undefined
    );

  //
  var script$e = {
    components: {
      Hex: __vue_component__$e
    },
    props: {
      highlight: Object,
      focus: Object,
      path: Array,
      range: Array,
      rangeType: String
    },
    computed:{
      center: () => getters$1.center()
    },
    methods: {
        getFill(){
            switch(this.rangeType){
                case 'moving': return '#ffffff';
                case 'turning': return '#ffad33';
                case 'attacking': return '#DD1111';
            }
        },
        getOpacity(){
            switch(this.rangeType){
                case 'moving': return 0.15;
                case 'turning': return 0.15;
                case 'attacking': return 0.5;
            }
        }
    }
  };

  /* script */
  const __vue_script__$e = script$e;

  /* template */
  var __vue_render__$g = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "konva-fast-layer",
      { ref: "layer" },
      [
        _vm.highlight
          ? _c("Hex", {
              attrs: {
                x: _vm.center.x + _vm.highlight.center.x,
                y: _vm.center.y + _vm.highlight.center.y,
                fill: "#ffffff",
                opacity: 0.35
              }
            })
          : _vm._e(),
        _vm._v(" "),
        _vm.focus
          ? _c("Hex", {
              attrs: {
                x: _vm.center.x + _vm.focus.center.x,
                y: _vm.center.y + _vm.focus.center.y,
                fill: "#ffffff",
                opacity: 0.35
              }
            })
          : _vm._e(),
        _vm._v(" "),
        _vm._l(_vm.range, function(hex) {
          return _c("Hex", {
            key: hex.x + ":" + hex.y,
            attrs: {
              x: _vm.center.x + hex.center.x,
              y: _vm.center.y + hex.center.y,
              fill: _vm.getFill(),
              opacity: _vm.getOpacity()
            }
          })
        })
      ],
      2
    )
  };
  var __vue_staticRenderFns__$g = [];
  __vue_render__$g._withStripped = true;

    /* style */
    const __vue_inject_styles__$g = undefined;
    /* scoped */
    const __vue_scope_id__$g = undefined;
    /* module identifier */
    const __vue_module_identifier__$g = undefined;
    /* functional template */
    const __vue_is_functional_template__$g = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$g = normalizeComponent(
      { render: __vue_render__$g, staticRenderFns: __vue_staticRenderFns__$g },
      __vue_inject_styles__$g,
      __vue_script__$e,
      __vue_scope_id__$g,
      __vue_is_functional_template__$g,
      __vue_module_identifier__$g,
      false,
      undefined,
      undefined,
      undefined
    );

  function getShape(id) {
      switch (id) {
          case 'unitBack':
              return 'M 316 308 c -11 0 -22 -7 -26 -17 l -2 -5 l 45 -7 a 6 6 0 0 0 5 -7 c -6 -37 -7 -76 -3 -113 l 1 -12 a 107 107 0 0 0 -74 -114 c -13 -4 -23 -15 -26 -29 c 0 -2 -2 -4 -5 -4 a 6 6 0 0 0 -5 5 c -3 13 -13 24 -26 28 a 106 106 0 0 0 -74 114 l 1 12 a 415 415 0 0 1 -2 117 l 4 3 l 48 7 l -2 5 c -5 10 -15 17 -27 17 h -2 c -32 0 -58 26 -58 58 v 91 c 0 3 2 5 5 5 h 276 c 3 0 5 -2 5 -5 v -91 c 0 -32 -26 -58 -58 -58 z';
          case 'unitPath':
              return 'M316 308c-11 0-22-7-26-17l-2-5 45-7a6 6 0 0 0 5-7c-6-37-7-76-3-113l1-12a107 107 0 0 0-74-114c-13-4-23-15-26-29 0-2-2-4-5-4a6 6 0 0 0-5 5c-3 13-13 24-26 28a106 106 0 0 0-74 114l1 12a415 415 0 0 1-2 117l4 3 48 7-2 5c-5 10-15 17-27 17h-2c-32 0-58 26-58 58v91c0 3 2 5 5 5h276c3 0 5-2 5-5v-91c0-32-26-58-58-58zm47 58v59a61 61 0 0 1-70-60c0-18 8-35 22-46h1c26 0 47 21 47 47zm-132-63c-14 0-27-5-37-14l17 3a5 5 0 0 0 7-7l-2-10a66 66 0 0 0 30 0l-1 10a6 6 0 0 0 6 7l17-3c-10 9-23 14-37 14zm18-40a55 55 0 0 1-35 0l-14-75c-1-3-3-4-6-4h-16a19 19 0 0 1-20-21c0-10 9-19 20-19h106a19 19 0 0 1 20 20c0 11-9 20-20 20h-16c-3 0-5 1-6 4l-13 75zM138 157l-1-11a96 96 0 0 1 66-103c9-2 17-8 23-14v86a6 6 0 0 0 11 0V29c5 6 13 12 22 14a95 95 0 0 1 66 103l-1 11c-4 37-3 75 2 112l-69 11 15-85h12c17 0 31-14 31-30a30 30 0 0 0-31-32H178c-16 0-30 14-31 30a30 30 0 0 0 31 32h12l15 85-69-11c6-37 6-75 2-112zm8 162h1c14 11 22 28 22 46a61 61 0 0 1-70 60v-59c0-26 21-47 47-47zM99 436a72 72 0 0 0 81-71c0-18-7-35-19-48 10-4 19-11 24-22 11 11 25 18 40 19v137H99v-15zm137 15V314c17-1 32-9 43-21l1 2c4 10 12 17 22 21a72 72 0 0 0 62 120v15H235z';
          case 'inf1':
              return 'M237.3 60.5c-4.7 3.5-68.5 51-150.2 67.3-10.8 188.8 150 286.5 150.2 286.4 0 0 161-97.6 150.2-286.4-81.8-16.3-150.2-67.3-150.2-67.3z';
          case 'inf2':
              return 'M440.6 97.4a12.6 12.6 0 0 0-10-11.6c-99.8-20-185-82.7-185.8-83.3a12.6 12.6 0 0 0-15.2 0C226.3 5.2 146.2 65.4 44 85.9c-5.6 1.1-9.8 6-10.1 11.6-8.2 143.4 59 246.6 117 307.9a479.7 479.7 0 0 0 73 63c7 4.8 9.1 6.1 13 6.2h.5c4 0 6.3-1.5 12.4-5.7a473 473 0 0 0 65.3-54.7c37.3-37.5 67-79.4 88.3-124.3a392.4 392.4 0 0 0 37.2-192.4zm-110.4 262a442 442 0 0 1-93 87.5 442 442 0 0 1-92.8-87.5c-60-75.2-88.8-159.6-85.8-251C145 89 214.8 44 237.3 28.2c22.9 15.8 94 61.1 178.6 80.4 3 91.3-25.8 175.7-85.7 250.9z';
          case 'arch':
              return 'M301.3 246.2l-55.7-19s-2.3-1.1-3.2-2L188 170.8c-1.1-.7-.4-1.8 0-2.2L288.5 68.1c24.1-24.1 14.5-46.3-8.3-23.5-6 6-18.3 6.2-33.6 3l-10.2-2.4C200.9 37 161 27.8 101 82.1c-.3.3-1.1 1.2-2.4-.1C87 70.4 78 61 69.8 52.7c-1.8-1.9-.4-3.1-.4-3.1l4.4-4.4c5.5-5.5 4.2-12.6-2.8-15.9l-61-28C3-2 0 1.2 3.1 8.2l28 61c3.3 7 10.5 8.3 16 2.8l3.4-3.5s2-2.5 4-.5l28.4 28.4c1.5 1.3 1.3 2.4 1 2.7-56 61.2-45.6 108.2-37.2 146.3l.4 1.8c3.7 16.7 2.2 29.9-5.8 37.9-17.3 17.3-11.2 41.4 26.4 3.8l103-103c.3-.2.9-.7 2 .3l54.6 54.6c.7.7 1.7 2.9 1.7 2.9l19 55.8c2.6 7.4 7.1 7.5 10.2.4l7.5-17.5c3-7.2 11.4-15.5 18.5-18.5l17.5-7.5c7.2-3.1 7-7.7-.4-10.2zM231 69c3.5.8 7 1.7 10.7 2.4 4.3 1 8.4 1.6 12.3 2L173.2 154c-1.1 1-2.2-.2-2.2-.2l-52.5-52.6c-.9-1-.5-1.6-.2-1.9 49.9-45 80.4-37.9 112.6-30.4zm-158 185.3c-.3-3.9-1-8-2-12.4l-.4-1.8c-7.8-35.6-16-72.4 30.7-123.7.3-.3 1.2-.6 2 .3l53 53s.5.9-.3 1.7l-83 83z';
          case 'cav1':
              return 'M82.2 50c-.5-.2-13.1-3-12.6-22.7.3-10.7-6.3-18.8-19.2-23.5A69.4 69.4 0 0 0 31.7 0a3 3 0 0 0-2.9 2.3 3 3 0 0 0-2.3 2l-.6 2-1.7-1.7a3 3 0 0 0-3.4-.6l-1.2.6a3 3 0 0 0-1.7 3l.1 1.5c.1 1.4.2 3 .7 4.6.4 1.3.3 2.2-.5 3.4A20.5 20.5 0 0 0 14 30.8c.3 4.3-2.3 8.4-5.3 12.7-3.4 4.9-1.1 9 .3 11.5a9.7 9.7 0 0 0 11 4c2.1-.7 4-2.8 4.6-4.9 1-3.5 3.7-5.4 7-7.6l1.8-1.4 2.6-1.3c1.3 10.6-.2 18.4-5 24.7a19.3 19.3 0 0 0-2.1 20.7l.1.3a3 3 0 0 0 3.6 1.9 58.2 58.2 0 0 0 34.6-27.7c.4.3.9.1 1.2-.2h.7c7.6 0 14.2-7.9 15-8.8a3 3 0 0 0-1.8-4.8zM31.7 88.4c0-.2 0-.4-.2-.6-2.7-6-2.4-11.9 1.8-17.5 6-8.1 6.8-17.5 5.5-27.1-.1-1.3-1-2.4-1.5-3.5-2.3 1.2-4.2 1.8-5.7 3-4 2.8-8.5 5.2-10 10.5a4.9 4.9 0 0 1-2.7 3l-1.7.2c-2.3 0-4.8-1.2-5.7-3-1.5-2.6-2.7-5-.4-8.3 3-4.4 6.2-9.2 5.8-14.6-.3-4.8 1.4-8.2 3.8-11.8a6.5 6.5 0 0 0 .9-6C21 11 21 9 20.9 7.2l1.2-.6 5.3 5 2-6.5L32 9.4l1.6 2.6c.1.4.4.7 1 .7 23 .2 22.4 32 30.6 48.2a55.2 55.2 0 0 1-33.5 27.6zm37.3-28c-.6 0-1.2 0-1.8-.2-8.9-16.5-7.8-48.3-31.6-49.5L31.7 3s35.6 1.6 35 24.2C66 50 81.6 53 81.6 53s-6.3 7.7-12.7 7.7z';
          case 'cav2':
              return 'M20.9 29.9c-1.3 0-1.3 2 0 2s1.3-2 0-2zM12.5 48.2c-1.1-.6-2.1 1.1-1 1.7.7.4 1.1.9 1 1.7 0 .5.5 1 1 1 .6 0 1-.5 1-1 .2-1.5-.8-2.8-2-3.4z';
          default:
              return undefined;
      }
  }

  //

  var script$f = {
    props: { type: String },
    data() {
      return {
        parts: this.getParts()
      };
    },
    methods: {
      getShape: getShape,
      getParts() {
        switch (this.type) {
          case "inf":
            return [
              {
                index: 0,
                config: {
                  data: getShape("inf1"),
                  fill: "#000000",
                  scale: {
                    x: 0.035,
                    y: 0.035
                  },
                  strokeHitEnabled: false,
                  perfectDrawEnabled: false
                }
              },
              {
                index: 1,
                config: {
                  data: getShape("inf2"),
                  fill: "#222222",
                  scale: {
                    x: 0.035,
                    y: 0.035
                  },
                  strokeHitEnabled: false,
                  perfectDrawEnabled: false
                }
              }
            ];
          case "arch":
            return [
              {
                index: 0,
                config: {
                  data: getShape("arch"),
                  fill: "#000000",
                  scale: {
                    x: 0.04,
                    y: 0.04
                  },
                  offset: {
                    x: -80,
                    y: -80
                  },
                  strokeHitEnabled: false,
                  perfectDrawEnabled: false
                }
              }
            ];
          case "cav":
            return [
              {
                index: 0,
                config: {
                  data: getShape("cav1"),
                  fill: "#222222",
                  scale: {
                    x: 0.2,
                    y: 0.2
                  },
                  strokeHitEnabled: false,
                  perfectDrawEnabled: false
                }
              },
              {
                index: 1,
                config: {
                  data: getShape("cav2"),
                  fill: "#222222",
                  scale: {
                    x: 0.2,
                    y: 0.2
                  },
                  strokeHitEnabled: false,
                  perfectDrawEnabled: false
                }
              }
            ];
        }
      }
    }
  };

  /* script */
  const __vue_script__$f = script$f;

  /* template */
  var __vue_render__$h = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "konva-group",
      {
        ref: "unitType",
        attrs: {
          config: {
            offset: {
              x: -18,
              y: -17
            }
          }
        }
      },
      [
        _c("konva-circle", {
          attrs: {
            config: {
              radius: 10,
              fill: "white",
              stroke: "black",
              strokeWidth: 1,
              offset: {
                x: -8,
                y: -8
              },
              opacity: 0.7,
              strokeHitEnabled: false,
              perfectDrawEnabled: false
            }
          }
        }),
        _vm._v(" "),
        _vm._l(_vm.parts, function(part) {
          return _c("konva-path", {
            key: part.index,
            attrs: { config: part.config }
          })
        })
      ],
      2
    )
  };
  var __vue_staticRenderFns__$h = [];
  __vue_render__$h._withStripped = true;

    /* style */
    const __vue_inject_styles__$h = undefined;
    /* scoped */
    const __vue_scope_id__$h = undefined;
    /* module identifier */
    const __vue_module_identifier__$h = undefined;
    /* functional template */
    const __vue_is_functional_template__$h = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$h = normalizeComponent(
      { render: __vue_render__$h, staticRenderFns: __vue_staticRenderFns__$h },
      __vue_inject_styles__$h,
      __vue_script__$f,
      __vue_scope_id__$h,
      __vue_is_functional_template__$h,
      __vue_module_identifier__$h,
      false,
      undefined,
      undefined,
      undefined
    );

  //

  var script$g = {
    components: {
      UnitType: __vue_component__$h
    },
    props: {
      center: Object,
      hexCenter: Object,
      unit: Object,
      color: String
    },
    computed: {
      directions() { return this.unit.directions; },
      endurance() { return Math.min(0, this.unit.endurance / this.unit.lifetime.endurance); }
    },
    methods: {
      getShape: getShape,
      directionSceneFunc(context, shape) {
        if (!this.unit.armor) {
          return;
        }
        var x = this.directions.length > 1 ? 1 : 0;
        var rotation = -30 + (this.directions[0] - 1) * 60 - x * 60;
        var angle = 60 * this.directions.length;
        context.rotate(window.Konva.getAngle(rotation));
        context.beginPath();
        context.arc(0, 0, 32, 0, window.Konva.getAngle(angle), false);
        context.lineTo(0, 0);
        context.closePath();
        context.fillStrokeShape(shape);
      },
      healthSceneFunc(context, shape) {
        var off = Math.floor(30 * this.endurance);
        context.beginPath();
        context.rect(0, 30 - off, 2, off);
        context.closePath();
        context.fillStrokeShape(shape);
      }
    }
  };

  /* script */
  const __vue_script__$g = script$g;

  /* template */
  var __vue_render__$i = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "konva-group",
      {
        attrs: {
          config: {
            listening: false,
            x: _vm.center.x + _vm.hexCenter.x,
            y: _vm.center.y + _vm.hexCenter.y,
            offset: {
              x: 19,
              y: 15
            }
          }
        }
      },
      [
        _c("konva-path", {
          ref: "direction",
          attrs: {
            config: {
              x: 19,
              y: 15,
              fill: "#ffff66",
              opacity: 0.35,
              perfectDrawEnabled: false,
              strokeHitEnabled: false,
              sceneFunc: _vm.directionSceneFunc
            }
          }
        }),
        _vm._v(" "),
        _c("konva-path", {
          ref: "unitBack",
          attrs: {
            config: {
              data: _vm.getShape("unitBack"),
              fill: _vm.color,
              scale: {
                x: 0.08,
                y: 0.08
              },
              offsetY: 60,
              shadowColor: "black",
              shadowBlur: 10,
              shadowOffset: { x: 40, y: 20 },
              shadowOpacity: 0.5,
              strokeHitEnabled: false,
              perfectDrawEnabled: false
            }
          }
        }),
        _vm._v(" "),
        _c("konva-path", {
          ref: "unitPath",
          attrs: {
            config: {
              data: _vm.getShape("unitPath"),
              fill: "#000000",
              scale: {
                x: 0.08,
                y: 0.08
              },
              offsetY: 60,
              strokeHitEnabled: false,
              perfectDrawEnabled: false
            }
          }
        }),
        _vm._v(" "),
        _c("UnitType", { attrs: { type: _vm.unit.type } }),
        _vm._v(" "),
        _c(
          "konva-group",
          { ref: "health" },
          [
            _c("konva-rect", {
              attrs: {
                config: {
                  width: 2,
                  height: 30,
                  fill: "white",
                  stroke: "black",
                  strokeWidth: 1,
                  strokeHitEnabled: false,
                  perfectDrawEnabled: false
                }
              }
            }),
            _vm._v(" "),
            _c("konva-shape", {
              attrs: {
                config: {
                  sceneFunc: _vm.healthSceneFunc,
                  fill: "green",
                  stroke: "black",
                  strokeWidth: 0.5,
                  strokeHitEnabled: false,
                  perfectDrawEnabled: false
                }
              }
            })
          ],
          1
        )
      ],
      1
    )
  };
  var __vue_staticRenderFns__$i = [];
  __vue_render__$i._withStripped = true;

    /* style */
    const __vue_inject_styles__$i = undefined;
    /* scoped */
    const __vue_scope_id__$i = undefined;
    /* module identifier */
    const __vue_module_identifier__$i = undefined;
    /* functional template */
    const __vue_is_functional_template__$i = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$i = normalizeComponent(
      { render: __vue_render__$i, staticRenderFns: __vue_staticRenderFns__$i },
      __vue_inject_styles__$i,
      __vue_script__$g,
      __vue_scope_id__$i,
      __vue_is_functional_template__$i,
      __vue_module_identifier__$i,
      false,
      undefined,
      undefined,
      undefined
    );

  //

  var script$h = {
    computed: {
      center: () => getters$1.center(),
      pendingAnimations: () => getters$1.pendingAnimations()
    },
    watch: {
      pendingAnimations: {
        handler(newVal, oldVal) {
          if (!newVal || Object.keys(newVal).length == 0) {
            return;
          }

          var animations = this.$children
            .filter(n => newVal[n.unit.id])
            .map(n =>
              this.getUnitMoveAnim(newVal[n.unit.id], n.$children[0].getNode())
            );

          Promise.all(animations).then(() => {
            mutations$1.setAnimating(false);
          });
        }
      }
    },
    methods: {
      getUnitMoveAnim(steps, node) {
        var center = this.center;
        return new Promise((resolve, reject) => {
          if (!steps || steps.length <= 1) {
            resolve();
            return;
          }

          var currStep = steps.shift();
          var anim = new lib_1(frame => {
            if (!steps.length) {
              anim.stop();
              resolve();
              return;
            }

            var progress = frame.time / 400;
            var sourceY = center.y + currStep.center.y;
            var targetY = center.y + steps[0].center.y;
            var diffY = targetY - sourceY;
            var calcY = sourceY + diffY * progress;
            node.setY(calcY);
            var sourceX = center.x + currStep.center.x;
            var targetX = center.x + steps[0].center.x;
            var diffX = targetX - sourceX;
            var calcX = sourceX + diffX * progress;
            node.setX(calcX);
            if (
              (diffX > 0 && calcX >= targetX) ||
              (diffX < 0 && calcX <= targetX) ||
              (diffY > 0 && calcY >= targetY) ||
              (diffY < 0 && calcY <= targetY)
            ) {
              currStep = steps.shift();
              frame.time = 0; // ????????
            }
          }, node.getLayer());
          anim.start();
        });
      }
    }
  };

  /* script */
  const __vue_script__$h = script$h;

  /* template */
  var __vue_render__$j = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { ref: "slot" }, [_vm._t("default")], 2)
  };
  var __vue_staticRenderFns__$j = [];
  __vue_render__$j._withStripped = true;

    /* style */
    const __vue_inject_styles__$j = undefined;
    /* scoped */
    const __vue_scope_id__$j = undefined;
    /* module identifier */
    const __vue_module_identifier__$j = undefined;
    /* functional template */
    const __vue_is_functional_template__$j = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$j = normalizeComponent(
      { render: __vue_render__$j, staticRenderFns: __vue_staticRenderFns__$j },
      __vue_inject_styles__$j,
      __vue_script__$h,
      __vue_scope_id__$j,
      __vue_is_functional_template__$j,
      __vue_module_identifier__$j,
      false,
      undefined,
      undefined,
      undefined
    );

  //

  var armyColors = ["#12cc31", "#c80b04"];

  var script$i = {
    components: {
      Unit: __vue_component__$i,
      Animator: __vue_component__$j
    },
    computed: {
      center: () => getters$1.center(),
      units: () =>
        getters$1.unitHexes().map(h => {
          var u = getters$1.unitAt(h.x, h.y);
          return {
            unit: u,
            hexCenter: h.center,
            color: getters$1.isPlayerArmy(u) ? armyColors[0] : armyColors[1]
          };
        })
    }
  };

  /* script */
  const __vue_script__$i = script$i;

  /* template */
  var __vue_render__$k = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "konva-layer",
      {
        ref: "layer",
        attrs: {
          config: {
            hitGraphEnabled: false
          }
        }
      },
      [
        _c(
          "Animator",
          _vm._l(_vm.units, function(u) {
            return _c("Unit", {
              key: u.unit.pos.x + ":" + u.unit.pos.y,
              attrs: {
                center: _vm.center,
                hexCenter: u.hexCenter,
                unit: u.unit,
                color: u.color
              }
            })
          }),
          1
        )
      ],
      1
    )
  };
  var __vue_staticRenderFns__$k = [];
  __vue_render__$k._withStripped = true;

    /* style */
    const __vue_inject_styles__$k = undefined;
    /* scoped */
    const __vue_scope_id__$k = undefined;
    /* module identifier */
    const __vue_module_identifier__$k = undefined;
    /* functional template */
    const __vue_is_functional_template__$k = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$k = normalizeComponent(
      { render: __vue_render__$k, staticRenderFns: __vue_staticRenderFns__$k },
      __vue_inject_styles__$k,
      __vue_script__$i,
      __vue_scope_id__$k,
      __vue_is_functional_template__$k,
      __vue_module_identifier__$k,
      false,
      undefined,
      undefined,
      undefined
    );

  //

  var script$j = {
    components: {
      ViewCull: __vue_component__$d,
      TerrainLayer: __vue_component__$f,
      EffectLayer: __vue_component__$g,
      UnitLayer: __vue_component__$k
    },
    computed: {
      animating: () => getters$1.animating(),
      selectedHex: () => getters$1.selectedHex(),
      grid: () => getters$1.grid(),
      center: () => getters$1.center(),
      unitRange: () => getters$1.animating() ? [] : getters$1.currentUnitRange(),
      unitState: () => getters$1.currentUnitState(),
      stageConfig: args => {
        var width =
          Math.abs(getters$1.boundingBox().minX) +
          Math.abs(getters$1.boundingBox().maxX) +
          60;
        var height =
          Math.abs(getters$1.boundingBox().minY) +
          Math.abs(getters$1.boundingBox().maxY) +
          60;

        if (width < window.visualViewport.width) {
          width = window.visualViewport.width;
        }
        if (height < window.visualViewport.height) {
          height = window.visualViewport.height;
        }

        return {
          width: width,
          height: height,
          draggable: true,
          dragBoundFunc: pos => {
            var ratiox = window.visualViewport.width / width;
            var ratioy = window.visualViewport.height / height;
            var margin = 50;
            var c = {
              x: pos.x,
              y: pos.y,
              sx: args.center.x / ratiox,
              sy: args.center.y / ratioy
            };
            if (Math.abs(c.x) + margin > c.sx) {
              c.x = args.$refs.stage.getStage().getAbsolutePosition().x;
            }
            if (Math.abs(c.y) + margin > c.sy) {
              c.y = args.$refs.stage.getStage().getAbsolutePosition().y;
            }
            args.stageOffset = { x: c.x, y: c.y };

            return args.stageOffset;
          }
        };
      }
    },
    watch: {
      animating(newVal, oldVal) {
        this.listening = !newVal;
        if (!newVal){
          actions.updateGrid();
        }
        this.centerHex(this.selectedHex);
        this.hexFocused(this.selectedHex);
        this.$refs.stage.getStage().batchDraw();
      }
    },
    data() {
      return {
        imageShapes: null,
        focusHex: null,
        path: null,
        listening: true,
        stageOffset: { x: 0, y: 0 }
      };
    },
    mounted() {
      actions.setCenter(window.innerWidth / 2, window.innerHeight / 2);
      eventBus.on("battlewaiting", () => {
        console.log("battlewaiting");
        /*waitLayer.show([
          "Sir, You're first on the battlefield.",
          "Hopefully the other army will arrive soon."
        ]);*/
      });

      eventBus.on("battlestarted", () => {
        console.log("battlestarted");
        //waitLayer.hide();
      });

      eventBus.on("battleended", result => {
        this.focusHex = null;
        this.path = [];
        /*effectLayer.highlightNode(null);
        effectLayer.drawPath([]);
        effectLayer.highlightRange([], grid.getSelectedHexState());*/
        //grid.hexSelected();
        //tooltipLayer.hideTooltip();
        //waitLayer.show(["Battle has ended", ...result]);
      });

      eventBus.on("battlestate", txt => {
        console.log(txt);
      });
    },
    methods: {
      handleDragStart() {
        this.listening = false;
      },
      handleDragEnd() {
        this.listening = true;
      },
      hexFocused(hex) {
        if (this.animating) {
          return;
        }
        this.focusHex = hex;

        var aUnit = null;
        var selHex = this.selectedHex;
        if (selHex) {
          aUnit = getters$1.unitAt(selHex.x, selHex.y);
        }
        var tUnit = getters$1.unitAt(hex.x, hex.y);
        if (this.unitState == "moving" || this.unitState == "turning") ; else if (this.unitState == "attacking") ;
      },
      centerHex(hex) {
        var stage = this.$refs.stage.getStage();
        var unit = getters$1.unitAt(hex.x, hex.y);
        if (!unit) {
          return;
        }
        var margin = 150;
        var center = getters$1.center();
        if (
          stage.getX() + center.x + hex.center.x < margin ||
          stage.getX() + center.x + hex.center.x > window.innerWidth - margin ||
          stage.getY() + center.y + hex.center.y < margin ||
          stage.getY() + center.y + hex.center.y > window.innerHeight - margin
        ) {
          stage.setX(-hex.center.x);
          stage.setY(-hex.center.y);
        }
        this.stageOffset = { x: stage.getX(), y: stage.getY() };
      }
    }
  };

  /* script */
  const __vue_script__$j = script$j;

  /* template */
  var __vue_render__$l = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "ViewCull",
      { attrs: { stageOffset: _vm.stageOffset } },
      [
        _vm.grid
          ? _c(
              "konva-stage",
              {
                ref: "stage",
                attrs: { config: _vm.stageConfig },
                on: { dragstart: _vm.handleDragStart, dragend: _vm.handleDragEnd }
              },
              [
                _c("TerrainLayer", {
                  ref: "terrainLayer",
                  on: { focused: _vm.hexFocused }
                }),
                _vm._v(" "),
                _c("EffectLayer", {
                  ref: "effectLayer",
                  attrs: {
                    highlight: _vm.selectedHex,
                    focus: _vm.focusHex,
                    path: _vm.path,
                    range: _vm.unitRange,
                    rangeType: _vm.unitState
                  }
                }),
                _vm._v(" "),
                _c("UnitLayer", { ref: "unitLayer" })
              ],
              1
            )
          : _vm._e()
      ],
      1
    )
  };
  var __vue_staticRenderFns__$l = [];
  __vue_render__$l._withStripped = true;

    /* style */
    const __vue_inject_styles__$l = undefined;
    /* scoped */
    const __vue_scope_id__$l = undefined;
    /* module identifier */
    const __vue_module_identifier__$l = undefined;
    /* functional template */
    const __vue_is_functional_template__$l = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$l = normalizeComponent(
      { render: __vue_render__$l, staticRenderFns: __vue_staticRenderFns__$l },
      __vue_inject_styles__$l,
      __vue_script__$j,
      __vue_scope_id__$l,
      __vue_is_functional_template__$l,
      __vue_module_identifier__$l,
      false,
      undefined,
      undefined,
      undefined
    );

  //

  var script$k = {
    components: {
      Menu: __vue_component__$c,
      Panel: __vue_component__$3,
      GameStage: __vue_component__$l
    },
    created() {
      actions.load();
    }
  };

  /* script */
  const __vue_script__$k = script$k;

  /* template */
  var __vue_render__$m = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { attrs: { id: "battle-scene" } },
      [
        _c("Menu"),
        _vm._v(" "),
        _c(
          "Panel",
          { staticClass: "battle-panel" },
          [_c("GameStage", { staticClass: "battle-stage" })],
          1
        )
      ],
      1
    )
  };
  var __vue_staticRenderFns__$m = [];
  __vue_render__$m._withStripped = true;

    /* style */
    const __vue_inject_styles__$m = function (inject) {
      if (!inject) return
      inject("data-v-1d8178c0_0", { source: "\n.battle-panel[data-v-1d8178c0] {\r\n  margin: -5px;\r\n  position: absolute;\r\n  top: 0;\r\n  left: 0;\r\n  right: 0;\r\n  bottom: 0;\r\n  overflow: hidden;\r\n  margin-right: 0px;\n}\n.battle-stage[data-v-1d8178c0] {\r\n  margin: -10px;\r\n  position: absolute;\n}\r\n", map: undefined, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$m = "data-v-1d8178c0";
    /* module identifier */
    const __vue_module_identifier__$m = undefined;
    /* functional template */
    const __vue_is_functional_template__$m = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$m = normalizeComponent(
      { render: __vue_render__$m, staticRenderFns: __vue_staticRenderFns__$m },
      __vue_inject_styles__$m,
      __vue_script__$k,
      __vue_scope_id__$m,
      __vue_is_functional_template__$m,
      __vue_module_identifier__$m,
      false,
      createInjector,
      undefined,
      undefined
    );

  //
  var script$l = {
    components: {
      Title: __vue_component__$4,
      Panel: __vue_component__$3
    },
    props: ["error"],
  };

  /* script */
  const __vue_script__$l = script$l;

  /* template */
  var __vue_render__$n = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      [
        _c("Title"),
        _vm._v(" "),
        _c("div", { staticClass: "pure-g" }, [
          _c("div", { staticClass: "pure-u-1 pure-u-sm-1-8 pure-u-md-1-4" }),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "pure-u-1 pure-u-sm-3-4 pure-u-md-1-2" },
            [
              _c("Panel", [_vm._v("\n        " + _vm._s(_vm.error) + "\n      ")])
            ],
            1
          )
        ])
      ],
      1
    )
  };
  var __vue_staticRenderFns__$n = [];
  __vue_render__$n._withStripped = true;

    /* style */
    const __vue_inject_styles__$n = function (inject) {
      if (!inject) return
      inject("data-v-59507c18_0", { source: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", map: undefined, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$n = "data-v-59507c18";
    /* module identifier */
    const __vue_module_identifier__$n = undefined;
    /* functional template */
    const __vue_is_functional_template__$n = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$n = normalizeComponent(
      { render: __vue_render__$n, staticRenderFns: __vue_staticRenderFns__$n },
      __vue_inject_styles__$n,
      __vue_script__$l,
      __vue_scope_id__$n,
      __vue_is_functional_template__$n,
      __vue_module_identifier__$n,
      false,
      createInjector,
      undefined,
      undefined
    );

  //
  var script$m = {
    components: {
      Title: __vue_component__$4,
      Panel: __vue_component__$3
    }
  };

  /* script */
  const __vue_script__$m = script$m;

  /* template */
  var __vue_render__$o = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      [
        _c("Title"),
        _vm._v(" "),
        _c("div", { staticClass: "pure-g" }, [
          _c("div", { staticClass: "pure-u-1 pure-u-sm-1-8 pure-u-md-1-4" }),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "pure-u-1 pure-u-sm-3-4 pure-u-md-1-2" },
            [_c("Panel", [_vm._v("\n        Location not found, sir.\n      ")])],
            1
          )
        ])
      ],
      1
    )
  };
  var __vue_staticRenderFns__$o = [];
  __vue_render__$o._withStripped = true;

    /* style */
    const __vue_inject_styles__$o = function (inject) {
      if (!inject) return
      inject("data-v-088d9a08_0", { source: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", map: undefined, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$o = "data-v-088d9a08";
    /* module identifier */
    const __vue_module_identifier__$o = undefined;
    /* functional template */
    const __vue_is_functional_template__$o = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$o = normalizeComponent(
      { render: __vue_render__$o, staticRenderFns: __vue_staticRenderFns__$o },
      __vue_inject_styles__$o,
      __vue_script__$m,
      __vue_scope_id__$o,
      __vue_is_functional_template__$o,
      __vue_module_identifier__$o,
      false,
      createInjector,
      undefined,
      undefined
    );

  const ifAuthenticated = (to, from, next) => {
      if (getters.authenticated()) {
        next();
        return
      }
      next('/login');
    };

  const routes = [
      { path: '/', component: __vue_component__$5 },
      { path: '/login', component: __vue_component__$7 },
      { path: '/register', component: __vue_component__$8 },
      { path: '/tutorial', component: __vue_component__$9, beforeEnter: ifAuthenticated },
      { path: '/start', component: __vue_component__$a, beforeEnter: ifAuthenticated },
      { path: '/battle', component: __vue_component__$b, beforeEnter: ifAuthenticated },
      { path: '/single', component: __vue_component__$m, beforeEnter: ifAuthenticated },
      { path: "/error", name: 'error', component: __vue_component__$n, props: true },
      { path: "*", component: __vue_component__$o }
  ];

  const router = new VueRouter({
      routes
  });

  Vue.use(VueRouter);
  Vue.use(VueKonva, { prefix: 'Konva' });

  Vue.component('vue-headful', vueHeadful$1);

  new Vue({
    el: '#app',
    router,
    render: h => h(__vue_component__$6),
  });

}());
//# sourceMappingURL=app.js.map
