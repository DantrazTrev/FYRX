import React, { useEffect, useState } from 'react';
import Pie from '@visx/shape/lib/shapes/Pie';
import { Group } from '@visx/group';
import { animated, useTransition, interpolate } from 'react-spring';

import { scaleLinear, scaleOrdinal } from '@visx/scale';

const mock_data = [
  { happy: 33 },
  { sad: 10 },
  { angry: 20 },
  { surprised: 23 },
  { fearful: 10 },
  { disgusted: 11 },
  { neutral: 9 },
];

const colorScale = scaleOrdinal({
  domain: Object.keys(mock_data),
  range: [
    '#ffc409',
    '#f14702',
    '#262d97',
    'pink',
    '#036ecd',
    '#9ecadd',
    '#51666e',
  ],
});

const dataloader = (data) => {
  const pie = [
    {
      label: 'happy',
      usage: 0,
    },
    {
      label: 'sad',
      usage: 0,
    },
    {
      label: 'angry',
      usage: 0,
    },
    {
      label: 'surprised',
      usage: 0,
    },
    {
      label: 'disgusted',
      usage: 0,
    },
    {
      label: 'neutral',
      usage: 0,
    },
    {
      label: 'fearful',
      usage: 0,
    },
  ];
  const red_data = data.reduce((r, a) => r.map((b, i) => a[i] + b));
  pie.forEach((pi, idx) => {
    pie[idx].usage = red_data[idx];
  });

  console.log(pie);
  return pie;
};

function Charts({ data }) {
  const margin = { top: 10, right: 10, bottom: 10, left: 10 };
  const [samples, setSamples] = useState(0);
  const centerY = 150;
  const centerX = 150;

  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    setTimeline(dataloader(data));
  }, [data]);

  useEffect(() => {
    setSamples(
      Math.max.apply(
        Math,
        timeline.map(function (o) {
          return o.usage;
        })
      )
    );
  }, [timeline]);

  return (
    <>
      <svg width={330} height={350}>
        <Group top={centerY + margin.top} left={centerX + margin.left}>
          <Pie
            data={timeline}
            pieValue={(d) => {
              return d.usage;
            }}
            outerRadius={150}
            cornerRadius={3}
            padAngle={0.005}
          >
            {(pie) => (
              <AnimatedPie
                {...pie}
                animate={true}
                getColor={(arc) => {
                  return colorScale(arc.data.label);
                }}
                getKey={(arc) => arc.data.label}
              />
            )}
          </Pie>
        </Group>
      </svg>
      <h3 style={{ textAlign: 'center' }}>Data Samples:{samples}</h3>
      {samples < 5 && (
        <>
          <br />
          <h3 style={{ textAlign: 'center', color: 'red' }}>
            ??? Low Data samples
            <br />
            (This data isn't reliable)
          </h3>
        </>
      )}
    </>
  );
}

const fromLeaveTransition = ({ endAngle }) => ({
  // enter from 360?? if end angle is > 180??
  startAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  endAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  opacity: 0,
});
const enterUpdateTransition = ({ startAngle, endAngle }) => ({
  startAngle,
  endAngle,
  opacity: 1,
});

function AnimatedPie({ animate, arcs, path, getKey, getColor }) {
  const transitions = useTransition(arcs, {
    from: animate ? fromLeaveTransition : enterUpdateTransition,
    enter: enterUpdateTransition,
    update: enterUpdateTransition,
    leave: animate ? fromLeaveTransition : enterUpdateTransition,
    keys: getKey,
  });
  return transitions((props, arc, { key }) => {
    const [centroidX, centroidY] = path.centroid(arc);
    const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1;

    return (
      <g key={key}>
        <animated.path
          // compute interpolated path d attribute from intermediate angle values
          d={interpolate(
            [props.startAngle, props.endAngle],
            (startAngle, endAngle) =>
              path({
                ...arc,
                startAngle,
                endAngle,
              })
          )}
          fill={getColor(arc)}
        />
        {hasSpaceForLabel && (
          <animated.g style={{ opacity: props.opacity }}>
            <text
              fill='white'
              x={centroidX}
              y={centroidY}
              dy='.33em'
              fontSize={13}
              textAnchor='middle'
              pointerEvents='none'
            >
              {getKey(arc)}
            </text>
          </animated.g>
        )}
      </g>
    );
  });
}

export default React.memo(Charts);
