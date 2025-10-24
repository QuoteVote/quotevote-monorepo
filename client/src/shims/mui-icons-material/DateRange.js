import * as React from 'react';
const DateRange = (props) => (
  React.createElement('svg', Object.assign({ viewBox: '0 0 24 24', width: 24, height: 24, fill: 'currentColor' }, props),
    React.createElement('rect', { x: '3', y: '4', width: '18', height: '18', rx: '2' }),
    React.createElement('path', { d: 'M16 2v4M8 2v4' })
  )
);

export default DateRange;
