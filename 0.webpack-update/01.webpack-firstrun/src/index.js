/*

index.js: webpack entry point

1. run command:
    development env: webpack ./src/index.js -o ./build/build.js --mode=development
    production env: webpack ./src/index.js -o ./build/build.js --mode=production

2. webpacknatively does not support packaging css/img resources

*/
import _ from 'lodash';
import data from './data.json';
import './index.less';
import Icon from './4q.png';
import printMe from './print';

function component() {
  // loader json file
  console.log(data);

  const element = document.createElement('div');
  const btn = document.createElement('button');

  // Lodash, now imported by this script
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.classList.add('hello');

  btn.innerHTML = 'Click me and check the console!';

  btn.onclick = printMe;

  element.appendChild(btn);
  // Add the image to our existing div.
  // const myIcon = new Image();
  // myIcon.src = Icon;

  // element.appendChild(myIcon);

  return element;
}

document.body.appendChild(component());
