/*

index.js: webpack entry point

1. run command:
    development env: webpack ./src/index.js -o ./build/build.js --mode=development
    production env: webpack ./src/index.js -o ./build/build.js --mode=production

2. webpacknatively does not support packaging css/img resources

*/

import data from './data.json';
import './index.less';

console.log(data);
function add(x, y) {
  return x + y;
}

console.log(add(1, 2));
