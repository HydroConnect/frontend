import { Typography } from '@/src/components/Typography';
import { Play } from 'lucide-react-native';
import React from 'react';
import { ImageBackground, Linking, TouchableOpacity, View } from 'react-native';

interface BoxVideoProps {
  title: string;
  videoUrl: string;
  thumbnailUrl?: string;
  steps: string[];
}

const BoxVideo: React.FC<BoxVideoProps> = ({ 
  title, 
  videoUrl, 
  thumbnailUrl,
  steps 
}) => {
  const handlePlayVideo = () => {
    Linking.openURL(videoUrl).catch(err => 
      console.error('Error opening video:', err)
    );
  };

  return (
    <View className="bg- rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
      {/* Title */}
      <View className="px-4 pt-4 pb-3 bg-[#E0EEE6]">
        <Typography 
          variant="title" 
          weight="semibold"
          className="text-gray-800"
        >
          {title}
        </Typography>
      </View>

      {/* Video Thumbnail */}
      <TouchableOpacity 
        onPress={handlePlayVideo}
        className="bg-gray-200 aspect-video items-center justify-center"
        activeOpacity={0.7}
      >
        {thumbnailUrl ? (
          <ImageBackground
            source={{ uri: thumbnailUrl }}
            className="w-full h-full items-center justify-center"
            resizeMode="cover"
          >
            <View className="w-16 h-16 bg-white/90 rounded-full items-center justify-center shadow-lg">
              <Play size={28} color="#4B5563" fill="#4B5563" />
            </View>
          </ImageBackground>
        ) : (
          <View className="w-16 h-16 bg-white rounded-full items-center justify-center shadow-lg">
            <Play size={28} color="#4B5563" fill="#4B5563" />
          </View>
        )}
      </TouchableOpacity>

      {/* Steps List */}
      <View className="px-4 py-4 bg-[#E0EEE6]">
        {steps.map((step, index) => (
          <Typography 
            key={index} 
            variant="body" 
            weight="regular"
            className="text-blackmb-1"
          >
            {index + 1}. {step}
          </Typography>
        ))}
      </View>
    </View>
  );
};

export default BoxVideo;