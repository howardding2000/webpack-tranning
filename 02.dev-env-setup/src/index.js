import _ from 'lodash';

import './css/index.less';
import './css/test.css';

import ImgSrc from './imgs/4q.png';

function component() {
  const element = document.createElement('div');
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.classList.add('hello');

  const img = document.createElement('img');
  img.src = ImgSrc;
  img.alt = '4q';

  const box1 = document.createElement('div');
  box.id = 'box1';

  const box2 = document.createElement('div');
  box.id = 'box2';

  element.appendChild(img);
  element.appendChild(box1);
  element.appendChild(box2);

  return element;
}

document.body.appendChild(component());
