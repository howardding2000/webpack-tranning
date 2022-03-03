// import _ from 'lodash';
// import '@babel/polyfill';

import './css/index.less';
import './css/test.css';

// import ImgSrc from './imgs/4q.png';

// const add = (a, b) => a + b;

const component = () => {
  const element = document.createElement('div');
  element.innerHTML = 'Hello webpack';
  element.classList.add('hello');

  // const img = document.createElement('img');
  // img.src = ImgSrc;
  // img.alt = '4q';

  const box1 = document.createElement('div');
  box1.id = 'box1';

  const box2 = document.createElement('div');
  box2.id = 'box2';

  // element.appendChild(img);
  element.appendChild(box1);
  element.appendChild(box2);

  return element;
};

// const promise = new Promise((resolve) => {
//   setTimeout(() => {
//     console.log('Time over!');
//     resolve();
//   }, 1000);
// });

// console.log(promise);

document.body.appendChild(component());
