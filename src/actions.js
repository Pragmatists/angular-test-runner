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
    $el.click();
}

function withIn(fn) {
    fn.in = function (selector) {
        return function ($el) {
            fn($el.find(selector));
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
                return function ($el) {
                    var x = $el.find(selector);
                    x.toString = function () {
                        return '[\n\t' + (x[0] ? x[0].outerHTML : '(no elements matched)') + '\n]';
                    };
                    var actual = expect(x);
                    var matcher = actual[fn.name];
                    var result = matcher.apply(actual, args);
                };
            };
            perform.not[fn.name] = function () {
                var args = _.toArray(arguments);
                return function ($el) {
                    var x = $el.find(selector);
                    x.toString = function () {
                        return '[\n\t' + (x[0] ? x[0].outerHTML : '(no elements matched)') + '\n]';
                    };
                    var actual = expect(x).not;
                    var matcher = actual[fn.name];
                    var result = matcher.apply(actual, args);
                };
            };
        });

    return perform;
}

module.exports = {
    click : withIn(click),
    type : type,
    keypress : keypress,
    keyup : keyup,
    keydown : keydown,
    apply : apply,
    expectElement : expectElement
};

