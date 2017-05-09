# component-props-schema

Get schema data based on propTypes and defaultProps.

## Usage

```js
let getComponentPropsSchema = require('component-props-schema');
console.log(getComponentPropsSchema('./demo.js'));
```

Intput
```js
// demo.js
class Video extends React.Component {
  static defaultProps = {
    autoPlay: false,
    maxLoops: 10
  };

  static propTypes = {
    autoPlay: PropTypes.bool.isRequired,
    maxLoops: PropTypes.number,
    posterFrameSrc: PropTypes.string.isRequired,
    videoSrc: PropTypes.string.isRequired
  };
}

export default Video;
```

Output
```js
{
  name: 'Video',
  propsSchema: {
    type: 'object',
    properties: {
      autoPlay: {
        isRequired: true,
        type: 'bool'
      },
      maxLoops: {
        type: 'number'
      },
      posterFrameSrc: {
        isRequired: true,
        type: 'string'
      },
      src: {
        isRequired: true,
        type: 'string'
      }
    }
  } 
}
```
