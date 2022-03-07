# webpack 性能优化

- 开发环境性能优化
- 生产环境性能优化

## 开发环境性能优化

### 优化打包构建速度

- **HMR**->CSS(需要 style-loader),js,html

### 优化代码调试

- **source-map**: 一种提供源代码到构建后代码的映射技术.
  - [inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map
  - **_Vue & React 默认使用 -> cheap-souce-map_**

## 生产环境性能优化

### 优化打包构建速度

- **oneOf**: 一个文件类型只匹配一个 loader 执行,找到了就不再继续往下找
- **cache**
  - **babel 缓存** -> cacheDirectory: true
- **thread load**:多进程打包,一般给 babel-loader 用
- **externals**:防止一些不必要的资源被打包
- **dll**:单独拆分打包库文件
  - 配置在 webpack.dll.js 中, 配置单独打包
  - 在 webpack.config.js 中告诉 webpack 哪些库不需要打包

### 优化代码运行的性能

- **文件资源缓存** ->
  - **hash**: 每次构建时,生成唯一的 hash 值
    - 问题: 因为 js 和 css 同时使用一个 hash 值,如果重新打包,将导致所有缓存都失效
  - **chunkhash**:根据 chunk 生成的 hash.如果打包来源于同一个 chunk,那么 hash 值一样
    - 问题: js 和 css 的 hash 值还是一样的,因为 css 是在 js 中被引进来的
  - **contenthash**:根据文件内容生成 hash 值,文件内容不变,hash 值不变(上线代码性能优化)hash/chunkhash/contenthash
- **tree shaking**树摇:去除无用代码
  - 前提:1.必须使用 ES6 module,2.mode 开启 production
  - 作用:减少代码体积
- **code split**代码分割:主要针对 js

  - 1.code split
  - 1.1 方式 1:配置多入口,生成单独的 bundle 文件。
    - 缺点:不太灵活,每个文件都要配置
  - ! 1.2 方式 2:配置 optimization->splitChunks->chunks,公共文件会打包成单独 chunk

        ```js
        optimization: {
        splitChunks: {
        chunks: 'all',
        },
        },
        ```

  - 1.3 方式 3:通过 js 代码,让某个文件被单独打包成一个 chunk,见 index.js

- **lazing load/pre-load**

```js
import('./test').then(({ mul }) => {
  console.log(mul(4, 5));
});
```

- pwa:Progressive Web Application 离线
