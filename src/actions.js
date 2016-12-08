var jQuery = require('jquery');

function type(text) {
    return withIn(function ($el) {
        $el.val(text);
        $el.change();
    });
}
function keypress(key) {
    return withIn(function ($el) {
        $el.trigger(jQuery.Event('keypress', {keyCode : key, which : key}));
    });
}
function keydown(key) {
    return withIn(function ($el) {
        $el.trigger(jQuery.Event('keydown', {keyCode : key, which : key}));
    });
}
function keyup(key) {
    return withIn(function ($el) {
        $el.trigger(jQuery.Event('keyup', {keyCode : key, which : key}));
    });
}
function apply($el) {
    var scope = angular.element($el).scope();
    scope.$apply();
}
function click($el) {
    $el.click().trigger('click');
}
function wait(timeout) {
    return function(){
        return {
            then: function(callback){
                setTimeout(callback, timeout || 0);
            }
        };
    };
}

function navigateTo(url){
    return withAfter(function($el){
        jQuery
            .element('<a href="' + url + '"></a>')
            .appendTo($el)
            .click()
            .detach();
    });
}

function withIn(fn) {
    fn.in = function (selector) {
        return withAfter(function ($el) {
            fn($el.find(selector));
        });
    };
    return withAfter(fn);
}
function withAfter(fn) {
    fn.after = function (timeout) {
        return function ($el) {
            var callback = _.noop;
            setTimeout(function(){
                fn($el);
                callback();
            }, timeout);
            
            return {
                then: function(cb){
                    callback = cb;
                }
            }
        };
    };
    return fn;
}

function expectElement(selector) {

    var perform = {
        not : {}
    };

    var jasmine = expect('');

    _(jasmine)
        .map(function (fn, name) {
            return {fn : fn, name : name};
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
    click : withIn(click),
    wait: wait,
    type : type,
    keypress : keypress,
    keyup : keyup,
    keydown : keydown,
    navigateTo: navigateTo,
    apply : apply,
    expectElement : expectElement
};

