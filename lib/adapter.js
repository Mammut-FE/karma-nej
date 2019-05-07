(function (karma, nejDefine, Nej) {
    var config = karma.config;
    var alias = config.nejAlias;

    if (console !== undefined) {
        // Monkey Patching console.log
        var rawLog = console.log;
        console.log = function (message) {
            // 禁止NEJ的log 信息
            if (('' + message).indexOf('do ') === 0) return;
            return rawLog.apply(console, arguments);
        };
    }

    window.define = function () {
        var args = [];

        [].slice.call(arguments).forEach(function (arg) {
            if (Array.isArray(arg)) { // 数组是为依赖
                const deps = [];

                arg.forEach(function (dep) {
                    Nej.parseBrowserDeps(alias, dep).forEach(function (absolutePath) {
                        deps.push(absolutePath);
                    });
                });

                args.push(deps);
            } else {
                args.push(arg);
            }
        });

        nejDefine.apply(window, args);
    };

    karma.loaded = function () {
    };

})(window.__karma__, window.define, window.__karmaNej__);
