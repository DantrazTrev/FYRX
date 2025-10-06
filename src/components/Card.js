import React from 'react';
import queryString from 'query-string';
import { PlayIcon, EyeIcon } from '@heroicons/react/24/outline';

function Card({ item, setvid, setPrivate }) {
  const getEmotionInfo = (emotionId) => {
    const emotions = [
      { emoji: '😊', name: 'Happy', color: 'bg-yellow-100 text-yellow-800' },
      { emoji: '😢', name: 'Sad', color: 'bg-blue-100 text-blue-800' },
      { emoji: '😠', name: 'Angry', color: 'bg-red-100 text-red-800' },
      { emoji: '😲', name: 'Surprised', color: 'bg-purple-100 text-purple-800' },
      { emoji: '🤢', name: 'Disgusted', color: 'bg-green-100 text-green-800' },
      { emoji: '😐', name: 'Neutral', color: 'bg-gray-100 text-gray-800' },
      { emoji: '😨', name: 'Fearful', color: 'bg-indigo-100 text-indigo-800' },
    ];
    return emotions[emotionId] || emotions[5]; // Default to neutral
  };

  var thumb = '';
  if (item.src && item.src.includes('youtube')) {
    let qsp = queryString.parse(item.src);
    thumb = `https://img.youtube.com/vi/${qsp['https://www.youtube.com/watch?v']}/hqdefault.jpg`;
  }

  const emotionInfo = getEmotionInfo(item.emotion_id);

  return (
    <div
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
      onClick={() => {
        setvid(item.id);
        setPrivate();
      }}
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-gray-900 relative overflow-hidden">
        {thumb === '' ? (
          <video 
            className="w-full h-full object-cover" 
            src={item.src}
            muted
            preload="metadata"
          />
        ) : (
          <img 
            className="w-full h-full object-cover" 
            src={thumb}
            alt={item.name}
          />
        )}
        
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
            <PlayIcon className="h-8 w-8 text-gray-900 ml-1" />
          </div>
        </div>

        {/* Emotion badge */}
        <div className="absolute top-3 right-3">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${emotionInfo.color} backdrop-blur-sm`}>
            <span className="mr-1">{emotionInfo.emoji}</span>
            {emotionInfo.name}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 line-clamp-2">
          {item.name || 'Untitled Video'}
        </h3>
        
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <EyeIcon className="h-3 w-3" />
            <span>Analysis available</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
