'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jszip = require('jszip');

var _jszip2 = _interopRequireDefault(_jszip);

var _fileSaver = require('file-saver');

var _fileSaver2 = _interopRequireDefault(_fileSaver);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JSZipExample = function () {
  function JSZipExample() {
    _classCallCheck(this, JSZipExample);
  }

  _createClass(JSZipExample, [{
    key: 'execute',
    value: function execute(imgDataArray, zipFileName, callBackSuccess, callBackError) {
      this.zip = new _jszip2.default();

      // this.getImageData(imgDataArray).then(({data}) => {

      this.imgData = imgDataArray;
      // console.log(_typeof(this.imgData));
      // console.log(this.imgData);
      // this.createFolder();
      this.getAndCreateImages();
      this.render(zipFileName, callBackSuccess, callBackError);
      //});
    }
  }, {
    key: 'getImageData',
    value: function getImageData(imgDataArray) {
      console.log(imgDataArray);
      return new Promise(function (resolve) {
        _axios2.default.get(imgDataArray).then(function (response) {
          console.log(response);
          resolve(response);
        }).catch(function (error) {
          console.log(error);
          resolve();
        });
      });
    }
  }, {
    key: 'createFile',
    value: function createFile() {

      var fileName = 'ReadMe.txt';
      var content = 'Open nodejs command prompt with administrator access.\n        run \'npm install\'\n        then run \'npm run dev\'\n  \n        ****************************\n  \n        currently I have created an array with 5 images link, you can add 1K, the code will remain the same.\n        I am loading the array JSON file via axios.\n  \n      ';
      this.zip.file(fileName, content);
    }
  }, {
    key: 'createFolder',
    value: function createFolder() {
      var folderName = 'images';
      this.imgFolder = this.zip.folder(folderName);
    }
  }, {
    key: 'getAndCreateImages',
    value: function getAndCreateImages() {
      var _this = this;

      this.imgPromiseStack = this.imgData.map(function (item, i) {
        var extension = item.substring(item.lastIndexOf('.') + 1, item.length);

        return new Promise(function (resolve) {
          _axios2.default.get(item, {
            responseType: 'arraybuffer'
          }).then(function (_ref) {
            var data = _ref.data;


            _this.zip.file('image' + (i + 1) + '.' + extension, data);
            resolve();
          }).catch(function (error) {
            console.log(error);
            resolve();
          });
        });
      });
    }
  }, {
    key: 'render',
    value: function render(fileName, callBackSuccess) {
      var _this2 = this;

      var zipFileName = fileName || 'images.zip';
      zipFileName = zipFileName.includes('.zip') ? zipFileName : zipFileName + '.zip';

      Promise.all(this.imgPromiseStack).then(function () {

        _this2.zip.generateAsync({ type: "blob" }).then(function (content) {
          // alert('Done');

          _fileSaver2.default.saveAs(content, zipFileName);
          callBackSuccess();
        });
        /* this.zip.generateAsync({type:"blob"})
             .then((content) => {
               alert('Done');
               $('#loading').html('Done..');
               FileSaver.saveAs(content, zipFileName);
             });
             */
      });
    }
  }]);

  return JSZipExample;
}();

var obj = new JSZipExample();

var renderImgAsZip = {

  execute: obj.execute

};
renderImgAsZip.execute = renderImgAsZip.execute.bind(obj);

exports.default = renderImgAsZip;

module.exports = renderImgAsZip; // for CommonJS compatibility