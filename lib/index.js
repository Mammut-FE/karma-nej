const pathLib = require('path');
const Nej = require('./nej');
const {createDependencies} = require('./utils');

function createPattern(path, noInclude) {
    return {pattern: path, included: !noInclude, served: true, watched: false};
}

function nejBoot(config) {
    const client = config.client;
    const nejOptions = config.nejOptions;

    let files = config.files;

    // 生成 nej 实例, 处理 alias
    const nej = new Nej(nejOptions, pathLib);
    client.nejAlias = nej.getAlias();

    // 根据测试文件生成依赖文件列表
    const dependencies = createDependencies(config.basePath, nej);
    dependencies.forEach(path => {
        files.unshift(createPattern(path, true));
    });

    files.unshift(createPattern(__dirname + '/adapter.js'));
    files.unshift(createPattern(
        pathLib.join(nejOptions.root, 'define.js')
    ));

    files.unshift(createPattern(__dirname + '/nej.js'));
}

nejBoot.$inject = ['config'];

module.exports = {
    'framework:nej2': ['factory', nejBoot]
};
