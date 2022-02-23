const fs = require('fs');
const path = require('path');
const KS3 = require('ks3');
const globby = require("globby");
const { Console } = require('console');
require('colors');

class WebpackKs3Oss {
  constructor(options){
    const {
      region,
			AK,
			SK,
			bucket,
    } = options;
    
    this.client = new KS3(AK, SK, bucket, region);
    const ks3Config = require('./config');
    this.client.config(ks3Config);
    this.config = Object.assign(options);
    this.errorTips = this.checkOptions(options);
  }

  checkOptions(options = {}){
    const { AK, SK } = options;
		if (!AK) return 'accessKeyId not specified';
		if (!SK) return 'accessKeySecret not specified';
  }

  apply(compiler) {
		if (compiler) {
			return this.doWithWebpack(compiler);
		} else {
			return this.doWidthoutWebpack();
		}
	}

  doWithWebpack(compiler) {
		compiler.hooks.afterEmit.tapPromise('WebpackKs3Oss', async (compilation) => {
			if (this.errorTips) {
				compilation.errors.push(this.errorTips);
				return Promise.resolve();
			}
			const outputPath = path.resolve(this.slash(compiler.options.output.path));
			const { from = outputPath + '/**'} = this.config;

			const files = await globby(from);
      
      const params = {
        Bucket: files,
        Key: this.config.Key || '',
        filePath: this.config.filePath || '', 
        fileSetting: this.config.fileSetting || '',
        ACL: this.config.ACL || 'public-read'
      }
			if (files.length) {
				try {
					return await this.client.upload.start(params,function(val){
            console.log('upload val', val);
          });
				} catch (err) {
					compilation.errors.push(err);
					return Promise.reject(err);
				}
			} else {
				console.log('no files to be uploaded');
				return Promise.resolve('no files to be uploaded');
			}
		});
	}

  async doWidthoutWebpack() {
		if (this.configErrStr) return Promise.reject(this.configErrStr);

		const { from } = this.config;
		const files = await globby(from);

		if (files.length) {
			try {
				return this.upload(files);
			} catch (err) {
				return Promise.reject(err);
			}
		}
		else {
			console.log('no files to be uploaded');
			return Promise.resolve('no files to be uploaded');
		}
	}

  slash(path) {
		const isExtendedLengthPath = /^\\\\\?\\/.test(path);
		if (isExtendedLengthPath) {
			return path;
		}
		return path.replace(/\\/g, '/');
	}
}

module.exports = WebpackKs3Oss;