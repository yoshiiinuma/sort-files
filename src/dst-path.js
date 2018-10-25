
import fs from 'fs-extra';
import path from 'path';
import dateFormat from 'dateformat';

const DEFAULT_DIRSTRUCT = 'yyyymm-dd';

const getCreatedTime = (file) => {
  return new Promise((resolve, reject) => {
    fs.stat(file, (err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve(stats.mtime);
      }
    });
  });
};

export const convToDir = (time, pattern) => {
  let dir;
  if (pattern === 'yyyymm-dd') {
    dir = dateFormat(time, 'yyyymm/dd');
  } else if (pattern === 'yyyy-mm-dd') {
    dir = dateFormat(time, 'yyyy/mm/dd');
  } else if (pattern === 'yyyy-mm') {
    dir = dateFormat(time, 'yyyy/mm');
  } else if (pattern === 'yyyymm') {
    dir = dateFormat(time, 'yyyymm');
  } else if (pattern === 'yyyymmdd') {
    dir = dateFormat(time, 'yyyymmdd');
  } else {
    throw new Error('Unsupported Pattern: ' + pattern);
  }
  return dir  
};

export const getDstPath = (file, opts = {}) => {
  const base = opts.dstBase ? opts.dstBase : './';
  const pattern = opts.sortby ? opts.sortby : DEFAULT_DIRSTRUCT;
  return getCreatedTime(file).then((time) => {
    return path.join(base, convToDir(time, pattern));
  });
};
