
import fs from 'fs';
import { sortFiles, sortFile, getFiles, moveToDst, getDstPath, exists } from '../src/sort.js';

const structures = ['yyyy-mm-dd', 'yyyymm-dd', 'yyyy-mm', 'yyyymm', 'yyyymmdd'];

const usage = () => {
  console.log();
  console.log(' USAGE: node dist/index.js <SRC> <DST> [OPTIONS]');
  console.log();
  console.log();
  console.log("\n   OPTIONS");
  console.log('     -s or --sortby <STRUCT>:   sort files by this, resulting in directory structure');
  console.log();
  console.log('       STRUCT:')
  console.log();
  console.log('         yyyy-mm-dd');
  console.log('         yyyymm-dd (DEFAULT)');
  console.log('         yyyy-mm');
  console.log('         yyyymm');
  console.log('         yyyymmdd');
  console.log();
  console.log('     -h or --help:                  show this message');
  console.log();
}

let args = process.argv.slice(2);

const exitProgram = (msg) => {
  if (msg) console.log(msg);
  usage();
  process.exit();
}

const src = args.shift();
const dst = args.shift();

if (!src || !dst) {
  exitProgram('Specify SRC and DST directories');
}

if (!fs.existsSync(src)) {
  exitProgram('SRC Not Found: ' + src);
}

const stats = fs.statSync(src);
if (!stats.isDirectory()) {
  exitProgram('Not Directory: ' + src);
}

let opt = {
  dstBase: dst,
  sortby: 'yyyymm-dd'
};

while(args.length > 0) {
  let arg = args.shift();
  if (arg === '-h' || arg === '--help') {
    exitProgram();
  } else if (arg === '-s' || arg === '--sortby') {
    opt.sortby = arg.shift();
  } else {
    exitProgram('Invalid Argument: ' + arg);
  }
}

if (!structures.includes(opt.sortby)) {
  exitProgram('Unsupported Directory Structure: ' + opt.sortby);
}

console.log(opt);
//sortFiles(src, opt);

