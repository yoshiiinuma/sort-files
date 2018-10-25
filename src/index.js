
import fs from 'fs';
import { sortFiles } from './sort.js';

const structures = ['yyyy-mm-dd', 'yyyymm-dd', 'yyyy-mm', 'yyyymm', 'yyyymmdd'];

const usage = () => {
  console.log();
  console.log(' USAGE: node dist/index.js <SRC> <DST> [OPTIONS]');
  console.log();
  console.log();
  console.log("\n   OPTIONS");
  console.log('     -h or --help:           show this message');
  console.log('     --dry:                  dry run; do not move files (DEFAULT)');
  console.log('     --run:                  run ');
  console.log('     -c or --copy:           run in copy mode; do not delete src files');
  console.log('     -s or --sortby <SORT>:  sort files by this, resulting in directory structure');
  console.log();
  console.log('       SORT:')
  console.log();
  console.log('         yyyy-mm-dd');
  console.log('         yyyymm-dd (DEFAULT)');
  console.log('         yyyy-mm');
  console.log('         yyyymm');
  console.log('         yyyymmdd');
  console.log();
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

let stats = fs.statSync(src);
if (!stats.isDirectory()) {
  exitProgram('SRC Not Directory: ' + src);
}

stats = fs.statSync(dst);
if (!stats.isDirectory()) {
  exitProgram('DST Not Directory: ' + dst);
}

let opt = {
  dry: true,
  copy: false,
  dstBase: dst,
  sortby: 'yyyymm-dd'
};

while(args.length > 0) {
  let arg = args.shift();
  if (arg === '-h' || arg === '--help') {
    exitProgram();
  } else if (arg === '--dry') {
    opt.dry = true;
  } else if (arg === '--run') {
    opt.dry = false;
  } else if (arg === '-c' || arg === '--copy') {
    opt.dry = false;
    opt.copy = true;
  } else if (arg === '-s' || arg === '--sortby') {
    opt.sortby = arg.shift();
  } else {
    exitProgram('Invalid Argument: ' + arg);
  }
}

if (!structures.includes(opt.sortby)) {
  exitProgram('Unsupported Directory Structure: ' + opt.sortby);
}

sortFiles(src, opt);

