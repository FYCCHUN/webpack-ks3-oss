# webpack-ks3-oss
一个 上传 文件到金山云的webpack 插件

Install
------------------------
```shell
$ npm i webpack-ks3-oss -D
```

Options
------------------------

- `region`: 金山云上传区域
- `AK`: 金山云的授权accessKeyId
- `SK`: 金山云的授权accessKeySecret
- `bucket`: 远程目标 bucket
- `test`: 测试，

#### 注意: `accessKeyId, accessKeySecret` 很重要，注意保密!!!

Example
------------------------

##### 作为webpack插件使用
```javascript
const WebpackKs3Oss = require('webpack-ks3-oss');
const webpackConfig = {
  // ... 省略其他
  plugins: [new WebpackKs3Oss({
    region: 'BEIJING', // 默认不传为BEIJING
    AK: 'your accessKeyId ',
    SK: 'your accessKeySecret',
    bucket: 'your remote bucket',
    Key: 'your remote filename',
    filePath: 'the filename you want to upload', 
    fileSetting: {
      isDeep: true // 打开是文件夹上传否则是文件上传
    },
    ACL: 'public-read' // 资源访问权限
  })]
}
```

##### 独立使用

```javascript
const WebpackKs3Oss = require('webpack-Ks3-oss');
new WebpackKs3Oss({
    region: 'BEIJING', // 默认不传为BEIJING
    AK: 'your accessKeyId ',
    SK: 'your accessKeySecret',
    bucket: 'your remote bucket',
    Key: 'your remote filename',
    filePath: 'the filename you want to upload', 
    fileSetting: {
      isDeep: true // 打开是文件夹上传否则是文件上传
    },
    ACL: 'public-read' // 资源访问权限
}).apply(); 
```   
