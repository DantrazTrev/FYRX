import React, { useState, useEffect } from 'react';
import { Stack } from '@visx/shape';
import { scaleLinear, scaleOrdinal } from '@visx/scale';
import { transpose } from 'd3-array';
import { animated, useSpring } from 'react-spring';
import { COLOR_ARRAY } from '../data';
import axios from 'axios';
import { useFirebase } from 'react-redux-firebase';
// constants

// utils
const range = (n) => Array.from(new Array(n), (_, i) => i);

// scales

function Timeline({ data, animate = true }) {
  const width = 800;
  const height = 200;
  console.log('gimd', Math.max(...[].concat(...data)));
  var xScale = scaleLinear({
    domain: [0, data.length - 1],
  });
  var yScale = scaleLinear({
    domain: [0, Math.max(...[].concat(...data)) + 100],
  });

  // accessors

  const getY0 = (d) => yScale(d[0]) ?? 0;
  const getY1 = (d) => yScale(d[1]) ?? 0;
  xScale.range([0, width]);
  yScale.range([height, 0]);

  // generate layers in render to update on touch

  return (
    <svg width={width} height={height}>
      <g>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={'transparent'}
          rx={14}
        />
        <Stack
          data={data}
          keys={range(data.length)}
          color={COLOR_ARRAY}
          x={(_, i) => xScale(i) ?? 0}
          y0={getY0}
          y1={getY1}
        >
          {({ stacks, path }) =>
            stacks.map((stack) => {
              // Alternatively use renderprops <Spring to={{ d }}>{tweened => ...}</Spring>
              const pathString = path(stack) || '';
              const tweened = { pathString };
              const color = COLOR_ARRAY[stack.key];

              return (
                <g key={`series-${stack.key}`}>
                  <animated.path d={tweened.pathString} fill={color} />
                </g>
              );
            })
          }
        </Stack>
      </g>
    </svg>
  );
}
export default React.memo(Timeline);
