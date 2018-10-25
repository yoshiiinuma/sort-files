
import fs from 'fs-extra';
import path from 'path';
import { expect } from 'chai';
import dateFormat from 'dateformat';

import { sortFiles, sortFile, getFiles, moveToDst, exists } from '../src/sort.js';


const file = 'file1';
const src = './test/data';
const srcPath = src + '/' + file;
const dstBase = './test/dst';
const stats = fs.statSync(srcPath);
const created = dateFormat(stats.mtime, 'yyyymmdd'); 
const dstPath = path.join(dstBase, created, file);

const bulkCopy = (src, dst) => {
  return getFiles(src).then((files) => {
    return Promise.all(files.map((f) => fs.ensureLink(path.join(src, f), path.join(dst, f))))
  });
};

describe('sort#exists', () => {
  context('when files exists', () => {
    it('returns true', () => {
      exists(srcPath).then((r) => {
        expect(r).to.equal(true);
      });
    });
  });

  context('when files does not exist', () => {
    const fakePath = src + '/nonexistent';
    it('returns false', () => {
      exists(fakePath).then((r) => {
        expect(r).to.equal(false);
      });
    });
  });
});

describe('sort#sortFile', () => {
  const src1 = './test/data1';
  const srcPath1 = src1 + '/' + file;
  const dstBase = './test/dst1';
  const dstPath = path.join(dstBase, created, file);
  const sortby = 'yyyymmdd';

  before((done) => {
    fs.ensureLink(srcPath, srcPath1)
      .then(() => done())
      .catch(err => console.log(err));
  });

  after((done) => {
    fs.emptyDir(dstBase)
      .then(() => done())
      .catch(err => console.log(err));
  });

  it('moves a given file to the destination directory', (done) => {
    sortFile(srcPath1, { dstBase, sortby }).then(() => {
      exists(dstPath)
        .then((r) => { expect(r).to.equal(true) })
        .then(() => done())
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
  })
});

describe('sort#sortFiles', () => {
  const src2 = './test/data2';
  const dstBase = './test/dst2';
  const sortby = 'yyyymmdd';

  before((done) => {
    bulkCopy(src, src2)
      .then(() => done());
  });

  after((done) => {
    fs.emptyDir(dstBase)
      .then(() => done())
      .catch(err => console.log(err));
  });

  it('sorts out files in a given directory', (done) => {
    sortFiles(src2, { dstBase, sortby })
      .then(() => {
        return Promise.all([
          Promise.resolve(expect(fs.existsSync('./test/dst2/20170405/file1')).to.equal(true)),
          Promise.resolve(expect(fs.existsSync('./test/dst2/20170405/file2')).to.equal(true)),
          Promise.resolve(expect(fs.existsSync('./test/dst2/20170406/file3')).to.equal(true)),
          Promise.resolve(expect(fs.existsSync('./test/dst2/20170406/file4')).to.equal(true)),
          Promise.resolve(expect(fs.existsSync('./test/dst2/20170414/file5')).to.equal(true)),
          Promise.resolve(expect(fs.existsSync('./test/dst2/20170505/file6')).to.equal(true)),
          Promise.resolve(expect(fs.existsSync('./test/dst2/20170501/file7')).to.equal(true)),
          Promise.resolve(expect(fs.existsSync('./test/dst2/20170501/file8')).to.equal(true))
        ])
      })
      .then(() => done())
      .catch((err) => console.log(err));
  })
});
