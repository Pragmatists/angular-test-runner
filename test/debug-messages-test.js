describe('debug messages test', function () {

  angular.module('debug-app', []);

  var app, html;
  var actions = testRunner.actions;

  beforeEach(function () {
    app = testRunner.app(['debug-app']);
  });

  var singleElementActions = {
    click: actions.click,
    type: actions.type('text'),
    keypress: actions.keypress(13),
    keyup: actions.keyup(13),
    keydown: actions.keydown(13)
  };

  var singleElementActionsWithFrom = {
    blur: actions.blur
  };

  beforeEach(function () {
    // given:
    html = app.runHtml('<div><span class="ambiguous"></span><span class="ambiguous"></span></div>');
  });

  _(singleElementActions).each(function (action, name) {

    it('fails meaningfully if target for a "' + name + '" action cannot be find', function () {

      // when:
      try {
        html.perform(
          action.in('#missing')
        );
        fail('expected exception due to #missing not found');

      } catch (e) {
        // then:
        expect(e).toEqual(new Error('Could not find #missing element for ' + name + ' action'));
      }

    });

    it('fails meaningfully if target for a "' + name + '" action is ambiguous', function () {

      // when:
      try {
        html.perform(
          action.in('.ambiguous')
        );
        fail('expected exception due to multiple .ambiguous found');

      } catch (e) {
        // then:
        expect(e).toEqual(new Error('Found multiple .ambiguous elements for ' + name + ' action'));
      }

    });

  });

  _(singleElementActionsWithFrom).each(function (action, name) {

    it('fails meaningfully if target for a "' + name + '" action cannot be find', function () {

      // when:
      try {
        html.perform(
          action.from('#missing')
        );
        fail('expected exception due to #missing not found');

      } catch (e) {
        // then:
        expect(e).toEqual(new Error('Could not find #missing element for ' + name + ' action'));
      }

    });

    it('fails meaningfully if target for a "' + name + '" action is ambiguous', function () {

      // when:
      try {
        html.perform(
          action.from('.ambiguous')
        );
        fail('expected exception due to multiple .ambiguous found');

      } catch (e) {
        // then:
        expect(e).toEqual(new Error('Found multiple .ambiguous elements for ' + name + ' action'));
      }

    });

  });

});
