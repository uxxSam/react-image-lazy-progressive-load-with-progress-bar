'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _MuiThemeProvider = require('material-ui/styles/MuiThemeProvider');

var _MuiThemeProvider2 = _interopRequireDefault(_MuiThemeProvider);

var _CircularProgress = require('material-ui/CircularProgress');

var _CircularProgress2 = _interopRequireDefault(_CircularProgress);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ImageLoading = function (_Component) {
  _inherits(ImageLoading, _Component);

  function ImageLoading(props) {
    _classCallCheck(this, ImageLoading);

    var _this = _possibleConstructorReturn(this, (ImageLoading.__proto__ || Object.getPrototypeOf(ImageLoading)).call(this, props));

    _this.state = {
      source: '',
      loadedPreview: false,
      loadedSrc: false,
      srcLoadingProgress: 0
    };
    _this.handleScroll = (0, _lodash.throttle)(_this.handleScroll.bind(_this), 300);
    return _this;
  }

  _createClass(ImageLoading, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.isComponentInViewport()) {
        this.fetchImage();
      } else {
        window.addEventListener('scroll', this.handleScroll);
      } // listen only if this is not in viewport, to avoid loading image multiple times
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('scroll', this.handleScroll);
    }
  }, {
    key: 'fetchImage',
    value: function fetchImage() {
      var _this2 = this;

      var _props = this.props,
          preview = _props.preview,
          src = _props.src;


      var config = {
        responseType: 'arraybuffer',
        onDownloadProgress: function onDownloadProgress(progressEvent) {
          var percentCompleted = Math.floor(progressEvent.loaded * 100 / progressEvent.total);
          _this2.setState({ srcLoadingProgress: percentCompleted });
        }
      };

      _axios2.default.get(preview, { responseType: 'arraybuffer' }).then(function (response) {
        var base64Preview = btoa(new Uint8Array(response.data).reduce(function (data, byte) {
          return data + String.fromCharCode(byte);
        }, ''));
        _this2.setState({ source: 'data:;base64,' + base64Preview, loadedPreview: true });
      }).then(function () {
        _axios2.default.get(src, config).then(function (response) {
          var base64Src = btoa(new Uint8Array(response.data).reduce(function (data, byte) {
            return data + String.fromCharCode(byte);
          }, ''));
          _this2.setState({ source: 'data:;base64,' + base64Src, loadedSrc: true });
        });
      }); // loaded image, hide progress spinner
    }
  }, {
    key: 'isComponentInViewport',
    value: function isComponentInViewport() {
      var lazyLoadScreenOffSet = this.props.lazyLoadScreenOffSet;


      if (this.targetDiv) {
        var rect = this.targetDiv.getBoundingClientRect();
        return rect.top + lazyLoadScreenOffSet >= 0 && rect.left + lazyLoadScreenOffSet >= 0 && rect.bottom - lazyLoadScreenOffSet <= (window.innerHeight || document.documentElement.clientHeight) && rect.right - lazyLoadScreenOffSet <= (window.innerWidth || document.documentElement.clientWidth);
      }
      return false;
    }
  }, {
    key: 'handleScroll',
    value: function handleScroll() {
      if (this.isComponentInViewport()) {
        window.removeEventListener('scroll', this.handleScroll);
        // remove listener immediately to avoid repetitive call to handleScroll()
        this.fetchImage();
      }
    }
  }, {
    key: 'renderProgressBar',
    value: function renderProgressBar() {
      var _state = this.state,
          loadedSrc = _state.loadedSrc,
          loadedPreview = _state.loadedPreview;
      var spinnerSize = this.props.spinnerSize;


      var spinnerStyle = {
        margin: 'auto',
        alignSelf: 'center',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      };

      return loadedSrc || !loadedPreview ? null : _react2.default.createElement(
        _MuiThemeProvider2.default,
        null,
        _react2.default.createElement(_CircularProgress2.default, {
          mode: 'determinate',
          value: this.state.srcLoadingProgress,
          size: spinnerSize,
          thickness: 5,
          color: 'white',
          style: spinnerStyle
        })
      );
      // display spinner only during loading process
    }
  }, {
    key: 'renderImage',
    value: function renderImage() {
      var _state2 = this.state,
          loadedSrc = _state2.loadedSrc,
          source = _state2.source,
          src = _state2.src;
      var _props2 = this.props,
          blur = _props2.blur,
          transitionTime = _props2.transitionTime;


      var imageStyle = {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        filter: loadedSrc ? '' : 'blur(' + blur + 'px)',
        transition: 'all ' + transitionTime + 's ease-in-out'
      };

      var placeHolderStyle = {
        backgroundColor: '#eee',
        display: 'flex',
        height: '100%',
        width: '100%'
      };

      return this.state.loadedPreview ? _react2.default.createElement('img', { src: source, style: imageStyle, alt: src }) : _react2.default.createElement('div', { style: placeHolderStyle }); // prevents showing 'broken image icon' in poor connection
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props3 = this.props,
          width = _props3.width,
          height = _props3.height;


      var divStyle = {
        height: height,
        width: width,
        position: 'relative'
      };

      return _react2.default.createElement(
        'div',
        { style: divStyle, ref: function ref(targetDiv) {
            _this3.targetDiv = targetDiv;
          } },
        this.renderImage(),
        this.renderProgressBar()
      );
    }
  }]);

  return ImageLoading;
}(_react.Component);

ImageLoading.propTypes = {
  preview: _propTypes2.default.string,
  src: _propTypes2.default.string,
  width: _propTypes2.default.number,
  height: _propTypes2.default.number,
  lazyLoadScreenOffSet: _propTypes2.default.number,
  blur: _propTypes2.default.number,
  transitionTime: _propTypes2.default.number,
  spinnerSize: _propTypes2.default.number
};

ImageLoading.defaultProps = {
  preview: '',
  src: '',
  width: 600,
  height: 600,
  lazyLoadScreenOffSet: 300,
  blur: 5,
  transitionTime: 0.8,
  spinnerSize: 80
};

exports.default = ImageLoading;
