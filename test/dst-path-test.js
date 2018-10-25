
import fs from 'fs-extra';
import path from 'path';
import { expect } from 'chai';
import dateFormat from 'dateformat';

import { convToDir, getDstPath } from '../src/dst-path.js';


describe('dst-path#getDstPath', () => {
  const srcPath = './test/data/file1';
  const dstBase = './test/dst';

  context('with sortby option', () => {
    it('returns the destination directory', () => {
      getDstPath(srcPath, { dstBase, sortby: 'yyyymmdd' }).then((r) => {
        expect(r).to.equal('test/dst/20170405');
      })
      .catch((err) => console.log(err));
    });
  });

  context('without sortby option', () => {
    it('returns the destination directory', () => {
      getDstPath(srcPath, { dstBase }).then((r) => {
        expect(r).to.equal('test/dst/201704/05');
      })
      .catch((err) => console.log(err));
    });
  });
});

describe('dst-path#convToDir', () => {
  const time = new Date(2018, 0, 2, 3, 4);

  context('with pattern', () => {
    it('converts time to directory according to pattern', () => {
      expect(convToDir(time, 'yyyymm-dd')).to.equal('201801/02');
      expect(convToDir(time, 'yyyy-mm-dd')).to.equal('2018/01/02');
      expect(convToDir(time, 'yyyy-mm')).to.equal('2018/01');
      expect(convToDir(time, 'yyyymm')).to.equal('201801');
      expect(convToDir(time, 'yyyymmdd')).to.equal('20180102');
    })
  });

  context('without pattern', () => {
    it('converts time to directory with default pattern', () => {
      expect(() => convToDir(time)).to.throw('Unsupported Pattern: undefined');
    })
  });

  context('with invalid pattern', () => {
    it('throws error', () => {
      expect(() => convToDir(time, 'xxxx')).to.throw('Unsupported Pattern: xxxx');
    })
  });
});

