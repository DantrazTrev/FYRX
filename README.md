# FYRX - Privacy-First Video Emotion Analytics

A modern, privacy-focused web application that analyzes video emotions in real-time using AI, with all processing happening locally in your browser.

## ✨ Features

- **🔒 100% Privacy-First**: All video analysis happens locally - no data leaves your device
- **🎥 Real-time Analysis**: Live emotion detection using advanced AI models
- **📊 Beautiful Analytics**: Modern dashboard with interactive charts and insights
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **⚡ Lightning Fast**: Optimized performance with modern React 18
- **🎨 Modern UI**: Contemporary design with smooth animations and micro-interactions

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd fyrx-video-analytics
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Tech Stack

- **Frontend**: React 18, Framer Motion, Lucide React
- **Charts**: Visx (D3-based)
- **AI**: Face-api.js for emotion detection
- **Styling**: Modern CSS with CSS Variables
- **State Management**: Redux + React Redux Firebase
- **Video**: React Player for YouTube support

## 📱 Features Overview

### Homepage
- Modern hero section with compelling copy
- Feature highlights with icons and animations
- Clear call-to-action buttons
- Privacy messaging and trust indicators

### Video Analytics
- Upload videos or paste YouTube URLs
- Real-time emotion detection overlay
- Modern video player with custom controls
- Live camera feed for emotion analysis
- Progress tracking and data collection

### Analytics Dashboard
- Interactive pie charts showing emotion distribution
- Detailed statistics and insights
- Search and filter capabilities
- Grid and list view modes
- Data quality indicators

### Privacy & Security
- All processing happens in your browser
- No video data is uploaded to servers
- Local storage only for user preferences
- Clear privacy messaging throughout

## 🎨 Design System

The app uses a modern design system with:
- **Colors**: Primary blue/purple gradient, semantic color tokens
- **Typography**: Inter font family with proper hierarchy
- **Spacing**: Consistent 8px grid system
- **Components**: Reusable, accessible components
- **Animations**: Smooth transitions with Framer Motion

## 📊 Emotion Detection

The app detects 7 different emotions:
- 😊 Happy
- 😢 Sad  
- 😠 Angry
- 😲 Surprised
- 🤢 Disgusted
- 😐 Neutral
- 😨 Fearful

## 🔧 Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── assets/             # Static assets
├── data/               # Data constants and mappings
├── utils/              # Utility functions
├── redux/              # State management
└── App.css             # Global styles
```

## 🌟 Key Improvements

### Modern UI/UX
- Contemporary design with proper spacing and typography
- Smooth animations and micro-interactions
- Responsive design that works on all devices
- Accessible components with proper focus management

### Enhanced Video Experience
- Modern video player with custom controls
- Real-time emotion overlay
- Better progress tracking
- Improved camera interface

### Analytics Dashboard
- Interactive charts with better data visualization
- Search and filtering capabilities
- Data quality indicators
- Modern card-based layout

### Privacy & Trust
- Clear privacy messaging throughout
- Trust indicators and badges
- Local processing emphasis
- No data collection warnings

## 🚀 Performance

- React 18 with concurrent features
- Optimized bundle size
- Lazy loading where appropriate
- Modern CSS with efficient selectors
- Reduced motion support for accessibility

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Face-api.js for emotion detection
- Visx for beautiful charts
- Lucide React for icons
- Framer Motion for animations

---

**FYRX** - Understanding emotions, respecting privacy. 🎥✨