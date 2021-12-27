import React, { useState, useEffect } from 'react';
import { Stack } from '@visx/shape';
import { scaleLinear, scaleOrdinal } from '@visx/scale';
import { animated, useSpring } from 'react-spring';
import { COLOR_ARRAY } from '../data';
import { curveNatural } from '@visx/curve';
// constants

// utils
const range = (n) => Array.from(new Array(n), (_, i) => i);

// scales

function Timeline({ data, animate = true }) {
  const width = 800;
  const height = 120;
  console.log('gimd', Math.max(...[].concat(...data)));
  var xScale = scaleLinear({
    domain: [0, data.length],
  });
  var yScale = scaleLinear({
    domain: [0, Math.max(...[].concat(...data)) * 1.4],
  });

  // accessors
  const colorScale = scaleOrdinal({
    domain: range(data[0].length),
    range: [
      '#ffc409',
      '#f14702',
      '#262d97',
      'white',
      '#036ecd',
      '#9ecadd',
      '#51666e',
    ],
  });
  const getY0 = (d) => yScale(d[0]) ?? 0;
  const getY1 = (d) => yScale(d[1]) ?? 0;
  xScale.range([0, width]);
  yScale.range([height / 2, height]);

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
          rx={19}
        />
        <Stack
          data={data}
          keys={range(data[0].length)}
          x={(_, i) => xScale(i) ?? 0}
          curve={curveNatural}
          offset='wiggle'
          y0={getY0}
          y1={getY1}
          color={colorScale}
        >
          {({ stacks, path }) =>
            stacks.map((stack) => {
              // Alternatively use renderprops <Spring to={{ d }}>{tweened => ...}</Spring>
              const pathString = path(stack) || '';
              const tweened = { pathString };
              const color = colorScale(stack.key);

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
