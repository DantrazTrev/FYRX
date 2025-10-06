import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Clock, BarChart3 } from 'lucide-react';
import Pie from '@visx/shape/lib/shapes/Pie';
import { Group } from '@visx/group';
import { animated, useTransition, interpolate } from 'react-spring';
import { scaleLinear, scaleOrdinal } from '@visx/scale';
import './Charts.css';

const emotionColors = {
  happy: '#10b981',
  sad: '#3b82f6',
  angry: '#ef4444',
  surprised: '#8b5cf6',
  disgusted: '#f59e0b',
  neutral: '#6b7280',
  fearful: '#ec4899',
};

const emotionIcons = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  surprised: '😲',
  disgusted: '🤢',
  neutral: '😐',
  fearful: '😨',
};

const colorScale = scaleOrdinal({
  domain: Object.keys(emotionColors),
  range: Object.values(emotionColors),
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
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const [samples, setSamples] = useState(0);
  const [totalSamples, setTotalSamples] = useState(0);
  const centerY = 120;
  const centerX = 120;

  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    setTimeline(dataloader(data));
  }, [data]);

  useEffect(() => {
    const maxUsage = Math.max.apply(
      Math,
      timeline.map(function (o) {
        return o.usage;
      })
    );
    const total = timeline.reduce((sum, item) => sum + item.usage, 0);
    setSamples(maxUsage);
    setTotalSamples(total);
  }, [timeline]);

  const getTopEmotion = () => {
    if (timeline.length === 0) return null;
    return timeline.reduce((prev, current) => 
      prev.usage > current.usage ? prev : current
    );
  };

  const topEmotion = getTopEmotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="charts-container"
    >
      {/* Header */}
      <div className="charts-header">
        <div className="charts-title">
          <BarChart3 className="w-6 h-6" />
          <h3>Emotion Analysis</h3>
        </div>
        <div className="charts-stats">
          <div className="stat-item">
            <TrendingUp className="w-4 h-4" />
            <span>{totalSamples} samples</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-wrapper">
        <svg width={280} height={280}>
          <Group top={centerY + margin.top} left={centerX + margin.left}>
            <Pie
              data={timeline}
              pieValue={(d) => d.usage}
              outerRadius={100}
              innerRadius={40}
              cornerRadius={4}
              padAngle={0.01}
            >
              {(pie) => (
                <AnimatedPie
                  {...pie}
                  animate={true}
                  getColor={(arc) => colorScale(arc.data.label)}
                  getKey={(arc) => arc.data.label}
                />
              )}
            </Pie>
          </Group>
        </svg>
        
        {/* Center Info */}
        <div className="chart-center">
          <div className="center-icon">
            {topEmotion && emotionIcons[topEmotion.label]}
          </div>
          <div className="center-label">
            {topEmotion ? topEmotion.label.charAt(0).toUpperCase() + topEmotion.label.slice(1) : 'No Data'}
          </div>
          <div className="center-percentage">
            {topEmotion ? Math.round((topEmotion.usage / totalSamples) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="charts-legend">
        {timeline.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="legend-item"
          >
            <div 
              className="legend-color" 
              style={{ backgroundColor: emotionColors[item.label] }}
            />
            <div className="legend-content">
              <div className="legend-label">
                <span className="legend-emoji">{emotionIcons[item.label]}</span>
                <span className="legend-name">
                  {item.label.charAt(0).toUpperCase() + item.label.slice(1)}
                </span>
              </div>
              <div className="legend-stats">
                <span className="legend-count">{item.usage}</span>
                <span className="legend-percentage">
                  ({Math.round((item.usage / totalSamples) * 100)}%)
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Data Quality Warning */}
      {samples < 5 && totalSamples > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="data-warning"
        >
          <div className="warning-icon">⚠️</div>
          <div className="warning-content">
            <div className="warning-title">Low Data Quality</div>
            <div className="warning-message">
              This analysis may not be reliable due to insufficient data samples.
            </div>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {totalSamples === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="empty-state"
        >
          <div className="empty-icon">📊</div>
          <div className="empty-title">No Data Available</div>
          <div className="empty-message">
            Start analyzing a video to see emotion data here.
          </div>
        </motion.div>
      )}
    </motion.div>
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
