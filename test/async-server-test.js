describe('async test', function () {

    angular.module('async-server-app', [])
        .directive('greeting', function () {
            return {
                template: ['<div class="greeting">{{ message }}</div>'].join(),
                scope: {
                    name: '='
                },
                controllerAs: 'vm',
                controller: function ($http, $scope) {
                    $scope.message = 'initial';
                    $http.get('/greeting')
                        .then(function (response) {
                            var json = response.data;
                            $scope.message = response.data.message;
                        });

                }
            };
        });

    var server, app;
    var expectElement = testRunner.actions.expectElement;

    beforeEach(function () {

        app = testRunner.app(['async-server-app']);
        server = testRunner.http({
            respondImmediately: false
        });
    });

    afterEach(function () {
        server.stop();
    });

    beforeEach(function () {
        server.get('/greeting', function (req) {
            req.sendJson({
                message: 'Hello from server!'
            });
        });
    });

    it('does not resolve request unless respond()', function () {

        // given:
        var html = app.runHtml('<greeting/>');

        // then:
        html.verify(
            expectElement('.greeting').toHaveText('initial')
        );

    });

    it('resolves request after respond()', function () {

        // given:
        var html = app.runHtml('<greeting/>');

        // when:
        html.perform(
          server.respond
        );

        // then:
        html.verify(
            expectElement('.greeting').toHaveText('Hello from server!')
        );

    });

});
