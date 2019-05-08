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

const Nej = require('../nej');
const path = require('path');

describe('Nej test', () => {
    const root = 'src/nej';

    test('nejRoot path', () => {
        const nej = new Nej({root, alias: {}}, path);
        const nejAlias = nej.getAlias();

        expect(nej.nejRoot).toBe('src/nej');
        expect(nejAlias).toStrictEqual({
            pro: 'src/javascript/',
            lib: 'src/nej/'
        });
    });

    test('nej alias', () => {
        const nej = new Nej({
            root, alias: {
                pro: 'src/javascript',
                common: 'src/common',
                components: 'src/components'
            }
        }, path);
        const nejAlias = nej.getAlias();

        expect(nejAlias).toStrictEqual({
            lib: 'src/nej/',
            pro: 'src/javascript/',
            common: 'src/common/',
            components: 'src/components/'
        });
    });

    test('Nej isAbsolutePath', () => {
        expect(Nej.isAbsolutePath('/')).toBe(true);
        expect(Nej.isAbsolutePath('base/util')).toBe(false);
    });

    test('Nej isRelativePath', () => {
        expect(Nej.isRelativePath('/')).toBe(false);
        expect(Nej.isRelativePath('./a.js')).toBe(true);
    });

    describe('Nej parseNodeDeps', () => {
        const nej = new Nej({
            root, alias: {
                pro: 'src/javascript',
                common: 'src/common',
                components: 'src/components'
            }
        }, path);
        const nejAlias = nej.getAlias();

        test('normalize path', () => {
            expect(Nej.normalizePath('lib/base/util')).toBe('{lib}base/util.js');
            expect(Nej.normalizePath('{lib}base/util.js')).toBe('{lib}base/util.js');
        });

        test('absolute path', () => {
            expect(Nej.parseNodeDeps(nejAlias, '/src/a.js')[0]).toBe('/src/a.js');
        });

        test('relative path', () => {
            expect(Nej.parseNodeDeps(nejAlias, './a.js')[0]).toBe('./a.js');
        });

        test('other type', () => {
            expect(Nej.parseNodeDeps(nejAlias, 'text!./tpl.html')[0]).toBe('./tpl.html');
            expect(Nej.parseNodeDeps(nejAlias, 'text!{common}tpl.html')[0]).toBe('src/common/tpl.html');
        });

        test('build-in path', () => {
            const cases = [
                {path: 'base/util', expectValue: 'src/nej/base/util.js'},
                {path: '{lib}base/util.js', expectValue: 'src/nej/base/util.js'},
                {path: 'lib/base/util', expectValue: 'src/nej/base/util.js'}
            ];

            cases.forEach(({path, expectValue}) => {
                expect(Nej.parseNodeDeps(nejAlias, path)[0]).toBe(expectValue);
            });
        });

        test('custom path', () => {
            const cases = [
                {path: 'pro/global/util', expectValue: 'src/javascript/global/util.js'},
                {path: '{pro}global/util.js', expectValue: 'src/javascript/global/util.js'},
                {path: '{common}html/tpl.html', expectValue: 'src/common/html/tpl.html'}
            ];

            cases.forEach(({path, expectValue}) => {
                expect(Nej.parseNodeDeps(nejAlias, path)[0]).toBe(expectValue);
            });
        });

        test('platform path', () => {
            const cases = [
                {
                    path: 'platform/util', expectValue: [
                        './platform/util.js',
                        './platform/util.patch.js',
                    ]
                },
                {
                    path: '{platform}util.js', expectValue: [
                        './platform/util.js',
                        './platform/util.patch.js',
                    ]
                }
            ];

            cases.forEach(({path, expectValue}) => {
                expect(Nej.parseNodeDeps(nejAlias, path)).toStrictEqual(expectValue);
            });
        });
    });

    describe('Nej parseBrowserDeps', () => {
        const nej = new Nej({
            root, alias: {
                pro: 'src/javascript',
                common: 'src/common',
                components: 'src/components'
            }
        }, path);
        const nejAlias = nej.getAlias();

        test('normalize path', () => {
            expect(Nej.normalizePath('lib/base/util')).toBe('{lib}base/util.js');
            expect(Nej.normalizePath('{lib}base/util.js')).toBe('{lib}base/util.js');
        });

        test('absolute path', () => {
            expect(Nej.parseBrowserDeps(nejAlias, '/src/a.js')[0]).toBe('/src/a.js');
        });

        test('relative path', () => {
            expect(Nej.parseBrowserDeps(nejAlias, './a.js')[0]).toBe('./a.js');
        });

        test('other type', () => {
            expect(Nej.parseBrowserDeps(nejAlias, 'text!./tpl.html')[0]).toBe('text!./tpl.html');
            expect(Nej.parseBrowserDeps(nejAlias, 'text!{common}tpl.html')[0]).toBe('text!/base/src/common/tpl.html');
        });


        test('build-in path', () => {
            const cases = [
                {path: 'base/util', expectValue: '/base/src/nej/base/util.js'},
                {path: '{lib}base/util.js', expectValue: '/base/src/nej/base/util.js'},
                {path: 'lib/base/util', expectValue: '/base/src/nej/base/util.js'}
            ];

            cases.forEach(({path, expectValue}) => {
                expect(Nej.parseBrowserDeps(nejAlias, path)[0]).toBe(expectValue);
            });
        });

        test('custom path', () => {
            const cases = [
                {path: 'pro/global/util', expectValue: '/base/src/javascript/global/util.js'},
                {path: '{pro}global/util.js', expectValue: '/base/src/javascript/global/util.js'},
                {path: '{common}html/tpl.html', expectValue: '/base/src/common/html/tpl.html'}
            ];

            cases.forEach(({path, expectValue}) => {
                expect(Nej.parseBrowserDeps(nejAlias, path)[0]).toBe(expectValue);
            });
        });

        test('platform path', () => {
            const cases = [
                {
                    path: 'platform/util', expectValue: [
                        './platform/util.js',
                        './platform/util.patch.js',
                    ]
                },
                {
                    path: '{platform}util.js', expectValue: [
                        './platform/util.js',
                        './platform/util.patch.js',
                    ]
                }
            ];

            cases.forEach(({path, expectValue}) => {
                expect(Nej.parseBrowserDeps(nejAlias, path)).toStrictEqual(expectValue);
            });
        });
    });
});

