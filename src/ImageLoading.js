import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CircularProgress from 'material-ui/CircularProgress';
import axios from 'axios';
import PropTypes from 'prop-types';
import { throttle } from 'lodash';

class ImageLoading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      source: '',
      loadedPreview: false,
      loadedSrc: false,
      srcLoadingProgress: 0,
    };
    this.handleScroll = throttle(this.handleScroll.bind(this), 300);
  }

  componentDidMount() {
    if (this.isComponentInViewport()) {
      this.fetchImage();
    } else {
      window.addEventListener('scroll', this.handleScroll);
    } // listen only if this is not in viewport, to avoid loading image multiple times
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  fetchImage() {
    const { preview, src } = this.props;

    const config = {
      responseType: 'arraybuffer',
      onDownloadProgress: (progressEvent) => {
        const percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
        this.setState({ srcLoadingProgress: percentCompleted });
      },
    };

    axios.get(preview, { responseType: 'arraybuffer' }).then((response) => {
      const base64Preview = btoa(
        new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '',),);
      this.setState({ source: `data:;base64,${base64Preview}`, loadedPreview: true });
    }).then(() => {
      axios.get(src, config).then((response) => {
        const base64Src = btoa(
          new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '',),);
        this.setState({ source: `data:;base64,${base64Src}`, loadedSrc: true });
      });
    }); // loaded image, hide progress spinner
  }

  isComponentInViewport() {
    const { lazyLoadScreenOffSet } = this.props;

    if (this.targetDiv) {
      const rect = this.targetDiv.getBoundingClientRect();
      return (
        rect.top + lazyLoadScreenOffSet >= 0 &&
        rect.left + lazyLoadScreenOffSet >= 0 &&
        rect.bottom - lazyLoadScreenOffSet <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right - lazyLoadScreenOffSet <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }
    return false;
  }

  handleScroll() {
    if (this.isComponentInViewport()) {
      window.removeEventListener('scroll', this.handleScroll);
      // remove listener immediately to avoid repetitive call to handleScroll()
      this.fetchImage();
    }
  }

  renderProgressBar() {
    const { loadedSrc, loadedPreview } = this.state;
    const { spinnerSize } = this.props;

    const spinnerStyle = {
      margin: 'auto',
      alignSelf: 'center',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    };

    return (loadedSrc || !loadedPreview) ? null :
      <MuiThemeProvider>
        <CircularProgress
          mode="determinate"
          value={this.state.srcLoadingProgress}
          size={spinnerSize}
          thickness={5}
          color={'white'}
          style={spinnerStyle}
        />
      </MuiThemeProvider>;
    // display spinner only during loading process
  }

  renderImage() {
    const { loadedSrc, source, src } = this.state;
    const { blur, transitionTime } = this.props;

    const imageStyle = {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      filter: loadedSrc ? '' : `blur(${blur}px)`,
      transition: `all ${transitionTime}s ease-in-out`,
    };

    const placeHolderStyle = {
      backgroundColor: '#eee',
      display: 'flex',
      height: '100%',
      width: '100%',
    };

    return this.state.loadedPreview ?
      <img src={source} style={imageStyle} alt={src} /> :
      <div style={placeHolderStyle} />; // prevents showing 'broken image icon' in poor connection
  }

  render() {
    const { width, height } = this.props;

    const divStyle = {
      height: height,
      width: width,
      position: 'relative',
    };

    return (
      <div style={divStyle} ref={(targetDiv) => { this.targetDiv = targetDiv; }}>
        {this.renderImage()}
        {this.renderProgressBar()}
      </div>
    );
  }
}

ImageLoading.propTypes = {
  preview: PropTypes.string,
  src: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  lazyLoadScreenOffSet: PropTypes.number,
  blur: PropTypes.number,
  transitionTime: PropTypes.number,
  spinnerSize: PropTypes.number,
};

ImageLoading.defaultProps = {
  preview: '',
  src: '',
  width: 600,
  height: 600,
  lazyLoadScreenOffSet: 300,
  blur: 5,
  transitionTime: 0.8,
  spinnerSize: 80,
};

export default ImageLoading;
