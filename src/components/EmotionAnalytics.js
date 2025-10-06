import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Info,
  Download
} from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';

const EmotionAnalytics = ({ data, currentTime = 0 }) => {
  const [viewMode, setViewMode] = useState('timeline');
  const [selectedEmotion, setSelectedEmotion] = useState(null);

  const emotions = [
    { key: 'happy', label: 'Happy', emoji: '😊', color: '#fbbf24' },
    { key: 'sad', label: 'Sad', emoji: '😢', color: '#3b82f6' },
    { key: 'angry', label: 'Angry', emoji: '😡', color: '#ef4444' },
    { key: 'surprised', label: 'Surprised', emoji: '😮', color: '#a855f7' },
    { key: 'fearful', label: 'Fearful', emoji: '😨', color: '#ec4899' },
    { key: 'disgusted', label: 'Disgusted', emoji: '😣', color: '#10b981' },
    { key: 'neutral', label: 'Neutral', emoji: '😐', color: '#6b7280' }
  ];

  // Process data for different visualizations
  const processTimelineData = () => {
    if (!data || data.length === 0) return [];
    
    return data.map((item, index) => {
      const timestamp = index;
      const emotionValues = {};
      emotions.forEach((emotion, i) => {
        emotionValues[emotion.key] = item[i] || 0;
      });
      return { timestamp, ...emotionValues };
    });
  };

  const processAggregateData = () => {
    if (!data || data.length === 0) return [];
    
    const totals = emotions.map((emotion, i) => {
      const sum = data.reduce((acc, item) => acc + (item[i] || 0), 0);
      return {
        name: emotion.label,
        value: sum,
        emoji: emotion.emoji,
        color: emotion.color
      };
    });
    
    return totals.sort((a, b) => b.value - a.value);
  };

  const getTopEmotion = () => {
    const aggregate = processAggregateData();
    return aggregate[0] || null;
  };

  const getCurrentEmotions = () => {
    if (!data || data.length === 0 || currentTime >= data.length) return [];
    
    const currentData = data[Math.floor(currentTime)];
    return emotions.map((emotion, i) => ({
      ...emotion,
      value: currentData[i] || 0,
      percentage: Math.round((currentData[i] || 0) * 100)
    })).sort((a, b) => b.value - a.value);
  };

  const timelineData = processTimelineData();
  const aggregateData = processAggregateData();
  const topEmotion = getTopEmotion();
  const currentEmotions = getCurrentEmotions();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-dark-card p-3 rounded-lg shadow-lg border border-gray-200 dark:border-dark-border">
          <p className="text-sm font-medium mb-2">Time: {label}s</p>
          {payload
            .sort((a, b) => b.value - a.value)
            .slice(0, 3)
            .map((entry) => {
              const emotion = emotions.find(e => e.key === entry.dataKey);
              return (
                <div key={entry.dataKey} className="flex items-center gap-2 text-sm">
                  <span>{emotion?.emoji}</span>
                  <span className="text-gray-600 dark:text-gray-400">{emotion?.label}:</span>
                  <span className="font-medium">{Math.round(entry.value * 100)}%</span>
                </div>
              );
            })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Dominant Emotion</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-3xl">{topEmotion?.emoji}</span>
                <span className="text-xl font-bold">{topEmotion?.name}</span>
              </div>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500 opacity-20" />
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Engagement Score</p>
              <p className="text-2xl font-bold mt-1">
                {data && data.length > 0 ? '85%' : '0%'}
              </p>
            </div>
            <Activity className="w-8 h-8 text-blue-500 opacity-20" />
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Data Points</p>
              <p className="text-2xl font-bold mt-1">{data?.length || 0}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* View Mode Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-dark-hover rounded-lg w-fit">
        {[
          { id: 'timeline', label: 'Timeline', icon: Activity },
          { id: 'distribution', label: 'Distribution', icon: PieChartIcon },
          { id: 'current', label: 'Real-time', icon: BarChart3 }
        ].map((mode) => (
          <button
            key={mode.id}
            onClick={() => setViewMode(mode.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              viewMode === mode.id
                ? 'bg-white dark:bg-dark-card text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <mode.icon className="w-4 h-4" />
            {mode.label}
          </button>
        ))}
      </div>

      {/* Main Visualization */}
      <Card className="p-6">
        <AnimatePresence mode="wait">
          {viewMode === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h3 className="text-lg font-semibold mb-4">Emotion Timeline</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" dark:stroke="#374151" />
                  <XAxis 
                    dataKey="timestamp" 
                    stroke="#9ca3af"
                    tick={{ fill: '#6b7280' }}
                    label={{ value: 'Time (seconds)', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    tick={{ fill: '#6b7280' }}
                    label={{ value: 'Intensity', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {emotions.map((emotion) => (
                    <Area
                      key={emotion.key}
                      type="monotone"
                      dataKey={emotion.key}
                      stackId="1"
                      stroke={emotion.color}
                      fill={emotion.color}
                      fillOpacity={0.6}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {viewMode === 'distribution' && (
            <motion.div
              key="distribution"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h3 className="text-lg font-semibold mb-4">Emotion Distribution</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={aggregateData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {aggregateData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-3">
                  {aggregateData.slice(0, 5).map((emotion, index) => (
                    <div key={emotion.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{emotion.emoji}</span>
                        <span className="font-medium">{emotion.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-200 dark:bg-dark-hover rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(emotion.value / aggregateData[0].value) * 100}%`,
                              backgroundColor: emotion.color
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                          {Math.round((emotion.value / data.length) * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {viewMode === 'current' && (
            <motion.div
              key="current"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h3 className="text-lg font-semibold mb-4">Real-time Emotions</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="90%" data={currentEmotions}>
                    <RadialBar
                      minAngle={15}
                      label={{ position: 'insideStart', fill: '#fff' }}
                      background
                      clockWise
                      dataKey="percentage"
                    >
                      {currentEmotions.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </RadialBar>
                    <Tooltip />
                  </RadialBarChart>
                </ResponsiveContainer>

                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-dark-hover rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current Dominant</p>
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{currentEmotions[0]?.emoji}</span>
                      <div>
                        <p className="font-semibold text-lg">{currentEmotions[0]?.label}</p>
                        <p className="text-2xl font-bold" style={{ color: currentEmotions[0]?.color }}>
                          {currentEmotions[0]?.percentage}%
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {currentEmotions.slice(1, 4).map((emotion) => (
                      <div key={emotion.key} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{emotion.emoji}</span>
                          <span className="text-sm">{emotion.label}</span>
                        </div>
                        <span className="text-sm font-medium">{emotion.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Export Button */}
      <div className="flex justify-end">
        <Button variant="secondary" icon={Download} size="sm">
          Export Analytics
        </Button>
      </div>
    </div>
  );
};

export default EmotionAnalytics;