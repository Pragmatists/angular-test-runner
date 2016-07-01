module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine-jquery', 'jasmine', 'sinon'],
        files: [
            'node_modules/lodash/lodash.js',
            'node_modules/jquery/dist/jquery.js',
            'node_modules/angular/angular.min.js',
            'angular-test-runner.js',
            'test/**/*.js'
        ],
        exclude: [
        ],
        preprocessors: {
          '**/*.html': ['ng-html2js']
        },
        reporters: ['dots'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        singleRun: false,
        browsers: ['PhantomJS']
    });
};