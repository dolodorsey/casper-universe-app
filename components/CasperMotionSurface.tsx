import React from 'react';
import { ImageBackground, Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import type { RealmMedia } from '@/lib/casperMedia';

export default function CasperMotionSurface({
  media,
  style,
  children,
  dim = 0.22,
}: {
  media: RealmMedia;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  dim?: number;
}) {
  if (Platform.OS === 'web' && media.kind === 'video') {
    return (
      <View style={[styles.frame, style]}>
        {React.createElement('video', {
          src: media.motion,
          autoPlay: true,
          muted: true,
          loop: true,
          playsInline: true,
          preload: 'metadata',
          'aria-hidden': true,
          style: {
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            pointerEvents: 'none',
          },
        } as any)}
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: `rgba(5,5,9,${dim})` }]} />
        {children}
      </View>
    );
  }

  return (
    <ImageBackground
      source={{ uri: media.kind === 'gif' ? media.motion : media.nativeFallback }}
      resizeMode="cover"
      style={[styles.frame, style]}
      imageStyle={styles.image}
    >
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: `rgba(5,5,9,${dim})` }]} />
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  frame: { position: 'relative', overflow: 'hidden', backgroundColor: '#07070B' },
  image: { backgroundColor: '#07070B' },
});
