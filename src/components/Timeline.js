import React, { useState, useEffect } from 'react';
import { Stack } from '@visx/shape';
import { scaleLinear, scaleOrdinal } from '@visx/scale';
import { transpose } from 'd3-array';
import { animated, useSpring } from 'react-spring';
import { COLOR_ARRAY } from '../data';
import axios from 'axios';
// constants

const BACKGROUND = '#transparent';

// utils
const range = (n) => Array.from(new Array(n), (_, i) => i);

// scales

export default function Timeline({ data, animate = true }) {
  const width = 800;
  const height = 200;
  const [timeline, setTimeline] = useState([]);
  useEffect(() => {
    axios(data).then((res) => {
      console.log('fetching', res.data);
      setTimeline(res.data);
    });
  }, [data]);
  const xScale = scaleLinear({
    domain: [0, timeline.length - 1],
  });
  const yScale = scaleLinear({
    domain: [-2, 10],
  });

  // accessors

  const getY0 = (d) => yScale(d[0]) ?? 0;
  const getY1 = (d) => yScale(d[1]) ?? 0;
  if (width < 10) return null;
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
          fill={BACKGROUND}
          rx={14}
        />
        <Stack
          data={timeline}
          keys={range(timeline.length)}
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
