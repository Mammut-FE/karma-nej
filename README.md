# nej 的 karma 插件

[![Build Status](https://travis-ci.com/Mammut-FE/karma-nej.svg?branch=master)](https://travis-ci.com/Mammut-FE/karma-nej)

> 用于 nej 项目的 karma-runner

![](http://s.lleohao.com/demo.png)

## 安装

```
npm i karma-nej2 --save-dev
```

## Karma 配置
    
karma.conf.js

```javascript
const path = require('path');

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // 自定义使用的测试框架, 具体可见 karma 教程
        // 导入 karma-nej
        frameworks: ['mocha', 'nej2'],


        // 需要导入的测试文件
        files: [
            'tests/env.js', // 可选, 环境变量等信息
            {pattern: 'tests/**/*.test.js', include: false},
            {pattern: 'src/**/*.spec.js', include: false},

            'tests/test-main.js' // 必填, 用于启动测试
        ],


        // list of files / patterns to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {},


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        // nej 相关配置
        // root 是 nej 的根目录
        // alias 是 nej 的别名配置
        // testMatch 是测试文件的匹配路径, 用于动态加载测试文件的依赖
        nejOptions: {
            root: path.join(__dirname, 'src/javascript/lib/nej'),
            alias: {
                components: 'src/components/',
                components2: 'src/components2/',
                mod: 'src/html/module/',
                common: 'src/html/common/',
                pro: 'src/javascript',
                lib: 'src/javascript/lib/nej'
            },
            testMatch: [
                'tests/*.test.js',
                'src/**/*.spec.js'
            ]
        }
    });
};
```

test-main.js

```javascript
var tests = [];

var testFileRule = /\.(test|spec)\.js$/ig;

// 获取所有的测试文件
for (var file in window.__karma__.files) {
    if (testFileRule.test(file)) {
        tests.push(file);
    }
}

// 导入所有的测试文件, 并开始 测试
define(tests, window.__karma__.start);
```

## Roadmap

- [ ] 支持 regular 组件测试
