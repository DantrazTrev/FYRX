import React from 'react';
import { scaleOrdinal } from '@visx/scale';
import Pie, { ProvidedProps, PieArcDatum } from '@visx/shape/lib/shapes/Pie';
import { Group } from '@visx/group';
import { animated, useTransition, interpolate } from 'react-spring';

const data = [{ happy: 33 }, { sad: 10 }, { angry: 20 }, { surprised: 43 }];
const dataz = data.map((datum) => ({
  label: Object.keys(datum)[0],
  usage: datum[Object.keys(datum)[0]],
}));

const colors = {
  happy: 'rgba(255,215,0,0.7)',
  sad: 'rgba(0,0,139,0.7)',
  angry: 'rgba(128,0,0,0.8)',
  surprised: 'rgba(128,0,128,0.7)',
};

const getColor = (label) => {
  return colors[label];
};

function Charts() {
  const margin = { top: 10, right: 10, bottom: 10, left: 10 };

  const centerY = 150;
  const centerX = 150;

  return (
    <>
      <svg width={330} height={350}>
        <Group top={centerY + margin.top} left={centerX + margin.left}>
          <Pie
            data={dataz}
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
                  return getColor(arc.data.label);
                }}
                getKey={(arc) => arc.data.label}
              />
            )}
          </Pie>
        </Group>
      </svg>
      <h3 style={{ textAlign: 'center' }}>Data Samples:2</h3>
    </>
  );
}

const fromLeaveTransition = ({ endAngle }) => ({
  // enter from 360° if end angle is > 180°
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
              fontSize={9}
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

export default Charts;
