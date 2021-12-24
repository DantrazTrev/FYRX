import React from 'react';
import { Stack } from '@visx/shape';
import { scaleLinear, scaleOrdinal } from '@visx/scale';
import { transpose } from 'd3-array';
import { animated, useSpring } from 'react-spring';

// constants
const NUM_LAYERS = 4;
const SAMPLES_PER_LAYER = 49;
const BUMPS_PER_LAYER = 5;
export const BACKGROUND = '#transparent';

// utils
const range = (n) => Array.from(new Array(n), (_, i) => i);

const keys = range(NUM_LAYERS);

// scales
const xScale = scaleLinear({
  domain: [0, SAMPLES_PER_LAYER - 1],
});
const yScale = scaleLinear({
  domain: [-30, 50],
});
const colorScale = scaleOrdinal({
  domain: keys,
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

// accessors

const getY0 = (d) => yScale(d[0]) ?? 0;
const getY1 = (d) => yScale(d[1]) ?? 0;

export default function Streamgraph({ width, height, animate = true }) {
  const forceUpdate = useForceUpdate();
  const handlePress = () => forceUpdate();

  if (width < 10) return null;

  xScale.range([0, width]);
  yScale.range([height, 0]);

  // generate layers in render to update on touch
  const layers = transpose(
    keys.map(() => generateData(SAMPLES_PER_LAYER, BUMPS_PER_LAYER))
  );

  return (
    <svg width={width} height={height}>
      <g onClick={handlePress} onTouchStart={handlePress}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={BACKGROUND}
          rx={14}
        />
        <Stack
          data={layers}
          keys={keys}
          color={colorScale}
          x={(_, i) => xScale(i) ?? 0}
          y0={getY0}
          y1={getY1}
        >
          {({ stacks, path }) =>
            stacks.map((stack) => {
              // Alternatively use renderprops <Spring to={{ d }}>{tweened => ...}</Spring>
              const pathString = path(stack) || '';
              const tweened = animate
                ? useSpring({ pathString })
                : { pathString };
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
