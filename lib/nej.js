/*
 * Copyright (c) 2019 lleohao<lleohao@hotmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE
 */

function isInNode() {
    return typeof module !== 'undefined' && module.exports;
}

/**
 * 处理 NEJ 函数
 * @param nejOptions
 * @param pathLib - node path module
 * @constructor
 */
function Nej({root, alias, testMatch}, pathLib) {
    this.pathLib = pathLib;

    this.nejRoot = root;
    this.testMatch = testMatch;
    this.alias = this.createAlias(alias);
}

Nej.prototype.createAlias = function (alias) {
    var pathLib = this.pathLib;

    this.alias = {
        'lib': pathLib.join(this.nejRoot, '/'),
        'pro': this.pathLib.join(this.nejRoot, '../javascript/')
    };

    for (var key in alias) {
        this.alias[key] = pathLib.join(alias[key] + '/');
    }

    return this.alias;
};

Nej.prototype.getAlias = function () {
    return this.alias;
};

Nej.isAbsolutePath = function (path) {
    return path.startsWith('/');
};

Nej.isRelativePath = function (path) {
    return path.startsWith('.');
};

/**
 * 标准化 nej 的导入格式
 * lib/base/util => {lib}/base/util.js
 * @param {string} path
 */
Nej.normalizePath = function (path) {
    if (/\.(json|html|js|css)$/.test(path)) {
        return path;
    }

    const tmp = path.split('/');

    return `{${tmp[0]}}${tmp.slice(1).join('/')}.js`;
};

const aliasReg = /(^{(\w+)})/;

/**
 * 解析依赖路径, 转换成 karma 支持的绝对路径
 * @param alias
 * @param {string} path
 * @param {boolean} forNode
 * @return {string[]}
 */
Nej._parseDependence = function (alias, path, forNode) {
    let tmp = path.split('!');
    let type = '', uri;

    if (tmp[1]) {
        type = tmp[0];
        uri = tmp[1];
    } else {
        uri = tmp[0];
    }

    uri = Nej.normalizePath(uri);

    if (Nej.isAbsolutePath(uri) || Nej.isRelativePath(uri)) {
        uri = forNode ? uri : ((type ? type + '!' : '') + uri);
        return [uri];
    }

    tmp = uri.match(aliasReg);

    let match = tmp[0];
    let aliasName = tmp[2];

    const lastPath = uri.substring(match.length);

    if (aliasName === 'platform') {
        return [
            './platform/' + lastPath,
            './platform/' + lastPath.replace(/\.js$/, '.patch.js')
        ];
    }

    if (alias[aliasName]) {
        uri = `${alias[aliasName]}` + lastPath;
    } else {
        uri = `${alias.lib}${aliasName}/` + lastPath;
    }

    return [(forNode ? '' : `${type ? type + '!' : ''}/base/`) + uri];
};

Nej.parseBrowserDeps = function (alias, path) {
    return Nej._parseDependence(alias, path, false);
};

Nej.parseNodeDeps = function (alias, path) {
    return Nej._parseDependence(alias, path, true);
};

if (isInNode()) {
    module.exports = Nej;
} else {
    window.__karmaNej__ = Nej;
}

