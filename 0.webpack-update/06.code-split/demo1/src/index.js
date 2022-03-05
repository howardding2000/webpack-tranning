// import _ from 'lodash';
// import '@babel/polyfill';
// import './css/index.less';
// import './css/test.css';

const component = () => {
  const element = document.createElement('div');
  element.innerHTML = 'Hello webpack';
  element.classList.add('hello');

  const box1 = document.createElement('div');
  box1.id = 'box1';

  const box2 = document.createElement('div');
  box2.id = 'box2';

  element.appendChild(box1);
  element.appendChild(box2);

  return element;
};

document.body.appendChild(component());
