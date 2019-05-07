const pathLib = require('path');

const Nej = require('../nej');
const {createDependencies} = require('../utils');

describe('utils test', () => {
    test('createDependencies test', () => {
        const nejOptions = {
            testMatch: ['tests/*.test.js'],
            root: 'src/simpleNej',
            alias: {
                pro: 'src/javascript',
                common: 'src/common'
            }
        };
        const basePath = pathLib.join(__dirname, 'demo');
        const nej = new Nej(nejOptions, pathLib);

        expect(createDependencies(basePath, nej).sort()).toStrictEqual([
            basePath + '/src/javascript/a.js',
            basePath + '/src/simpleNej/base/util.js',
            basePath + '/src/simpleNej/base/global.js',
            basePath + '/src/simpleNej/base/platform.js',
            basePath + '/src/simpleNej/base/platform/util.js',
            basePath + '/src/simpleNej/base/platform/util.patch.js',
            basePath + '/src/common/common.js',
            basePath + '/src/javascript/b.js',
            basePath + '/src/javascript/tpl.html'
        ].sort());
    });
});
