const fs = require('fs-extra')
const path = require('path')
const webpack = require('webpack');
const WebpackKs3Oss = require('../index.js');
const HtmlWebpackPlugin = require('html-webpack-plugin'); 
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { italic } = require('colors');

function runWebapck(config) {
	return new Promise((resolve, reject) => {
		webpack(config, (err, stats) => {
			if (err) {
				console.error('err', err);
				reject(err)
			} else {
				const info = stats.toJson();

				if (stats.hasErrors()) {
					console.error('error', JSON.stringify(info.errors, null, 2));
					reject(info.errors)
				}else {
					resolve('done')
				}
			}
		})
	})
}
const config = {
  mode: 'production',
  entry: './__test__/src/js/index.js',
  output: {
    path: path.resolve(__dirname, './dist/'),
    filename: 'js/[name].js',
    publicPath: 'http://feijian-yidian.ks3-cn-beijing.ksyuncs.com/testfile'
  },
  module: {
    rules: [
      { 
        test: /\.css$/, 
        use: [{
          loader: MiniCssExtractPlugin.loader,
        }, 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name:'[name].[ext]',
              outputPath:"images/",
              limit: 8192
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: "images/",
              limit: 8192
            }
          }
        ]
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename:'index.html',
      template:'__test__/src/index.html',
      inject: 'body' 
    }),

    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }),

    new WebpackKs3Oss({
      region: 'BEIJING',
      AK: 'your accessKeyId ',
      SK: 'your accessKeySecret',
      bucket: 'your remote bucket',
      Key: 'your remote filename',
      filePath: 'the filename you want to upload', 
      fileSetting: {
        isDeep: true // 打开是文件夹上传否则是文件上传
      },
      ACL: 'public-read' // 资源访问权限
    })
  ]
}

// runWebapck(config);

describe('webpack-ks3-oss', () => {
  it('upload files in webpack', async() => {
    const res = await runWebapck(config);
    console.log('res',res);
    expect(res).toBe('done');
  })
})

