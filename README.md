# react-image-lazy-progressive-load-with-progress-bar
Reusable React Image lazy load component with progress bar to show the user loading percentage, works with minimum configuration

## Demo
[Click here for demo](https://react-lazy-progress-bar-demo.herokuapp.com/)

## Features:
 - Lazy load images to make your page load faster and put less stress on your server
 - Progressive load with blur transition to provide a better user experience
 - Progress spinner to give an instant feedback of the loading progress
 - Throttled `scroll` and `resize` listeners for better performance
 - Highly customizable yet can also work with minimum configuration
 - Mimics Instagram's way of loading image(placeholder -> preview -> source image)

## To install:
`npm install react-image-lazy-progressive-load-with-progress-bar`

## Usage:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import ImageLoading from 'react-image-lazy-progressive-load-with-progress-bar';

const App = () => {
  return (
    <div>
      <ImageLoading
        preview="https://farm5.staticflickr.com/4744/25793011168_e4b52e55e7_q_d.jpg"
        src="https://farm5.staticflickr.com/4744/25793011168_fae24a3fb6_k_d.jpg"
        width={600}
        height={600}
        lazyLoadScreenOffSet={200}
        blur={10}
        transitionTime={0.6}
        spinnerSize={70}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.body);
```

### Props:
```javascript
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
```

## Licence:
MIT
