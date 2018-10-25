
import fs from 'fs-extra';
import path from 'path';
import dateFormat from 'dateformat';

import { getDstPath } from './dst-path.js';

export const exists = (file) => {
  return new Promise((resolve, reject) => {
    fs.access(file, fs.constants.F_OK, (err) => {
      if (err) {
        if (err.code === 'ENOENT') resolve(false);
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

//export const getDstPath = (file, opts = {}) => {
//  let dst = opts.dstBase ? opts.dstBase : './'
//  return getCreatedTime(file).then((time) => {
//    return path.join(dst, dateFormat(time, 'yyyymmdd'));
//  });
//};

export const moveToDst = (file, dir) => {
  if (!fs.existsSync(dir)) {
    fs.ensureDirSync(dir);
  }
  return fs.ensureLink(file, path.join(dir, path.basename(file)))
    .then(() => fs.remove(file));
};

export const copyToDst = (file, dir) => {
  if (!fs.existsSync(dir)) {
    fs.ensureDirSync(dir);
  }
  return fs.ensureLink(file, path.join(dir, path.basename(file)))
};

export const sortFile = (file, opts = {}) => {
  if (opts.dry) {
    return getDstPath(file, opts).then((dst) => console.log(file + ' => ' + dst));
  } if (opts.copy) {
    return getDstPath(file, opts).then((dst) => copyToDst(file, dst));
  }else {
    return getDstPath(file, opts).then((dst) => moveToDst(file, dst));
  }
};

export const getFiles = (dir) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}

export const sortFiles = (dir, opts = {}) => {
  return getFiles(dir)
    .then((files) => Promise.all(files.map((f) => sortFile(path.join(dir, f), opts))));
}

