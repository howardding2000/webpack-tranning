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

/**
 * 通过js代码，让某个文件被单独打包成一个chunk
 */

 import ('./printString')
 .then((result) => {
   // 文件加载成功
   console.log(result);
 })
 .catch(() => {
   console.log('文件加载失败~');
 });
