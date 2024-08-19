import t from 'webpack-sources'
const { ReplaceSource, OriginalSource, RawSource,ConcatSource } = t;
import {describe, test } from 'node:test'
import fs from 'fs';
import path from 'path';
/**
 * 
 * @param {import('webpack-sources').Source} source 
 * @param {string} name 
 */
function write_mapping(source,name){
    const dir = path.resolve(import.meta.dirname, '../fixtures')
    fs.writeFileSync(path.resolve(dir, `${name}.js`),source.source());
    fs.writeFileSync(path.resolve(dir, `${name}.js.map`),JSON.stringify(source.map()), {});
}
describe('basic', () => {
    test('raw', () => {
        let source = new RawSource(`
            let a = 1;
            let b = 2;
            console.log(a,b);
      `);
      
      console.log(source.map())
    })
    test('original', () => {
        let source = new OriginalSource(`
            let a = 1;
            let b = 2;
            console.log(a,b);
      `,'original')
      write_mapping(source, 'original')
    })
    test('banner-replace', () => {
        let source = new OriginalSource(`
            let a = 1;
            let b = 2;
            console.log(a,b);
      `,'original')
      let new_source = new ReplaceSource(source);
      new_source.insert(0, '// webpack-sources');
      write_mapping(new_source, 'banner-replace')
    })
    test('banner-concat', () => {
        let source = new OriginalSource(`
            let a = 1;
            let b = 2;
            console.log(a,b);
      `,'original')
      let banner_source = new OriginalSource(`// webpack-sources`, 'banner.js');
      let concat_source = new ConcatSource(banner_source, source);
      write_mapping(concat_source, 'banner-concat')
    })
})