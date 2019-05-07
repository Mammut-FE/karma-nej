const glob = require('glob');
const fs = require('fs');
const pathLib = require('path');

const Nej = require('./nej');

const depCache = {};
const depsQueue = [];

function insertDependencies(filePath) {
    if (!depCache[filePath]) {
        depCache[filePath] = true;
        depsQueue.push(filePath);
    }
}

/**
 * 检测文件是否存在于白名单中
 * 白名单的文件不需要解析
 * @param filePath
 * @return {boolean}
 */
function inWhitespace(filePath) {
    const whitespace = [
        'nej/util/template/trimpath.js',
        'nej/util/query/nes.js'
    ];

    return whitespace.some(file => filePath.endsWith(file));
}

function runCode(basePath, nejAlias, filePath) {
    // hack define
    function define(args) {
        return Array.isArray(args) ? args : [];
    }

    const NEJ = {define};

    if (filePath.endsWith('.js')) {
        if (!inWhitespace(filePath)) {
            eval(fs.readFileSync(filePath).toString()).forEach(dep => {
                if (Nej.isRelativePath(dep)) {
                    dep = pathLib.resolve(filePath, '..', dep);
                } else {
                    Nej.parseNodeDeps(nejAlias, dep).forEach(relativePath => {
                        if (Nej.isRelativePath(relativePath)) {
                            dep = pathLib.resolve(filePath, '..', relativePath);
                        } else {
                            dep = pathLib.join(basePath, relativePath);
                        }
                    });
                }

                insertDependencies(dep);
            });
        }
    } else {
        insertDependencies(filePath);
    }
}

/**
 * 根据测试文件生成以依赖文件
 * @param {string} basePath
 * @param {Nej} nej
 */
function createDependencies(basePath, nej) {
    const nejAlias = nej.alias;
    const testMatch = nej.testMatch;

    testMatch.forEach(path => {
        glob.sync(path, {cwd: basePath}).forEach(filePath => {
            filePath = pathLib.join(basePath, filePath);

            runCode(basePath, nejAlias, filePath);
        });
    });

    while (depsQueue.length) {
        const filePath = depsQueue.shift();

        runCode(basePath, nejAlias, filePath);
    }

    return Object.keys(depCache);
}

module.exports = {
    createDependencies
};
