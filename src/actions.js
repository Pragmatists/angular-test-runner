var jQuery = require('jquery');
var _ = require('lodash');

function assertSingle(fn) {
  var name = fn.name;
  return function ($el) {
    var found = $el.size();
    if (found === 0) {
      throw new Error('Could not find ' + $el.selector + ' element for ' + name + ' action');
    }
    if (found > 1) {
      throw new Error('Found multiple ' + $el.selector + ' elements for ' + name + ' action');
    }
    return fn.apply(this, _.toArray(arguments));
  };
}

function type(text) {
  return withIn(assertSingle(function type($el) {
    $el.val(text);
    $el.change();
  }));
}

function keypress(key) {
  return withIn(assertSingle(function keypress($el) {
    $el.trigger(jQuery.Event('keypress', {keyCode: key, which: key}));
  }));
}

function keydown(key) {
  return withIn(assertSingle(function keydown($el) {
    $el.trigger(jQuery.Event('keydown', {keyCode: key, which: key}));
  }));
}

function keyup(key) {
  return withIn(assertSingle(function keyup($el) {
    $el.trigger(jQuery.Event('keyup', {keyCode: key, which: key}));
  }));
}

function blur($el) {
  $el.trigger(jQuery.Event('blur'));
}

function mouseover($el) {
  $el.trigger(jQuery.Event('mouseover'));
}

function mouseleave($el) {
  $el.trigger(jQuery.Event('mouseleave'));
}

function apply($el) {
  var scope = angular.element($el).scope();
  scope.$apply();
}

function click($el) {
  $el.click();
}

function listenTo(event, handler) {
  return function ($el) {
    findScope($el).$on(event, function ($event, data) {
      handler(data);
    });
  };
}

function publishEvent(event, data) {
  return function ($el) {
    findScope($el).$broadcast(event, data);
  };
}

function findScope(el) {
  if (scopeFor(el)) {
    return scopeFor(el);
  }
  var children = el.children();
  for (var i = 0; i < children.length; i++) {
    var scope = scopeFor(children[i]);
    if (scope) {
      return scope;
    }
  }
  throw new Error('Cannot find scope on top level children of root element', el);

  function scopeFor(element) {
    return angular.element(element).scope();
  }
}

function wait(timeout) {
  return function () {
    return {
      then: function (callback) {
        setTimeout(callback, timeout || 0);
      }
    };
  };
}

function navigateTo(url) {
  return withAfter(function ($el) {
    angular
      .element('<a href="' + url + '"></a>')
      .appendTo($el)
      .click()
      .remove();
  });
}

function withIn(fn) {
  fn.in = selectWithAfter(fn);
  return withAfter(fn);
}

function withFrom(fn) {
  fn.from = selectWithAfter(fn);
  return withAfter(fn);
}

function selectWithAfter(fn) {
  return function (selector) {
    return withAfter(function ($el) {
      fn($el.find(selector));
    });
  }
}

function withAfter(fn) {
  fn.after = function (timeout) {
    return function ($el) {
      var callback = _.noop;
      setTimeout(function () {
        fn($el);
        callback();
      }, timeout);

      return {
        then: function (cb) {
          callback = cb;
        }
      }
    };
  };
  return fn;
}

function expectElement(selector) {

  var perform = {
    not: {}
  };

  var jasmine = expect('');

  _(jasmine)
    .map(function (fn, name) {
      return {fn: fn, name: name};
    })
    .filter(function (fn) {
      return fn.name.indexOf('to') === 0 && _.isFunction(fn.fn);
    })
    .forEach(function (fn) {
      perform[fn.name] = function () {
        var args = _.toArray(arguments);
        return withAfter(function ($el) {
          var x = $el.find(selector);
          x.toString = function () {
            return '[\n\t' + (x[0] ? x[0].outerHTML : '(no elements matched)') + '\n]';
          };
          var actual = expect(x);
          var matcher = actual[fn.name];
          var result = matcher.apply(actual, args);
        });
      };
      perform.not[fn.name] = function () {
        var args = _.toArray(arguments);
        return withAfter(function ($el) {
          var x = $el.find(selector);
          x.toString = function () {
            return '[\n\t' + (x[0] ? x[0].outerHTML : '(no elements matched)') + '\n]';
          };
          var actual = expect(x).not;
          var matcher = actual[fn.name];
          var result = matcher.apply(actual, args);
        });
      };
    });

  return perform;
}

module.exports = {
  click: withIn(assertSingle(click)),
  wait: wait,
  type: type,
  keypress: keypress,
  keyup: keyup,
  keydown: keydown,
  mouseover: withIn(assertSingle(mouseover)),
  mouseleave: withIn(assertSingle(mouseleave)),
  blur: withFrom(assertSingle(blur)),
  navigateTo: navigateTo,
  apply: apply,
  expectElement: expectElement,
  listenTo: listenTo,
  publishEvent: publishEvent
};

