# RiffLingua 🎵

Learn English through music, movies, and daily journaling!

## 🚀 Quick Start

### Prerequisites
- Node.js 20.15.1+
- npm or yarn
- Expo Go app (for testing)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd RiffLingua

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env
# Add your YouTube API key to .env

# Start the development server
npx expo start
```

## 🔐 Environment Setup

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key_here
EXPO_PUBLIC_APP_NAME=RiffLingua
EXPO_PUBLIC_PACKAGE_NAME=com.cengizhancaliskan.rifflingua
```

### Getting YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable **YouTube Data API v3**
4. Create credentials (API Key)
5. Restrict the key with:
   - Package name: `com.cengizhancaliskan.rifflingua`
   - SHA-1: (from EAS credentials)

## 📦 Features

- ✅ **Daily Journal** - Write and track your English learning journey
- ✅ **Dark Mode** - Light and dark theme support
- ✅ **Onboarding** - Welcome screens for new users
- 🎵 **Song Learning** - Learn English through music lyrics
- 🎬 **Movie Clips** - Practice with movie scenes (coming soon)
- 📚 **Vocabulary** - Track learned words (coming soon)

## 🏗️ Tech Stack

- **Framework**: Expo + React Native
- **Navigation**: Expo Router
- **Database**: SQLite (expo-sqlite)
- **State Management**: React Hooks + Context
- **Styling**: React Native StyleSheet
- **APIs**: YouTube Data API v3

## 📱 App Credentials

```
Package Name: com.cengizhancaliskan.rifflingua
Bundle ID (iOS): com.cengizhancaliskan.rifflingua
EAS Project: @zignech/RiffLingua
```

## 🔒 Security Notes

- `.env` file is gitignored (contains API keys)
- Use `.env.example` as template
- Keystore managed by EAS (cloud)
- API keys restricted by package name + SHA-1

## 🛠️ Development

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Build with EAS
npx eas build --platform android
```

## 📝 Project Structure

```
RiffLingua/
├── app/                    # Expo Router pages
├── components/            # Reusable components
│   ├── common/           # Common UI components
│   ├── home/             # Home screen components
│   └── journal/          # Journal-specific components
├── screens/              # Screen components
├── services/             # API services & database
├── types/                # TypeScript types
├── constants/            # App constants & themes
├── data/                 # Mock data & initial content
└── contexts/             # React Context providers
```

