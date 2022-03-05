// import { mul } from './test';

console.log('index.js is loading');

document.getElementById('btn').onclick = function () {
  // lazy loading
  // pre loading -> prefetch，预加载，等其他资源加载完毕，浏览器空闲了才加载资源。
  // prefetch问题：兼容性差
  import(/* webpackChunkName: 'test', webpackPrefetch: true*/ './test').then(
    ({ mul }) => {
      console.log(mul(4, 5));
    }
  );
};
