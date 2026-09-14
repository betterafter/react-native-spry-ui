import { Animated, Image, StyleSheet } from 'react-native';
import { useEffect, useRef } from 'react';

import { isLocalAsset } from './utils';

import type { StackCard } from './types';

type CardContentProps = {
  card: StackCard;
  loaded: boolean;
  onLoad: (card: StackCard) => void;
};

function Skeleton() {
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.75,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [opacity]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.skeleton, { opacity }]}
    />
  );
}

export function CardContent({ card, loaded, onLoad }: CardContentProps) {
  const reportedRef = useRef(false);

  const reportLoaded = () => {
    if (reportedRef.current) {
      return;
    }

    reportedRef.current = true;
    onLoad(card);
  };

  useEffect(() => {
    reportedRef.current = false;

    // require() assets are sync; onLoad often skips after Fast Refresh.
    if (isLocalAsset(card.image)) {
      reportLoaded();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card.id, card.image]);

  return (
    <>
      <Image
        source={
          typeof card.image === 'string' ? { uri: card.image } : card.image
        }
        resizeMode="cover"
        style={styles.image}
        onLoad={reportLoaded}
        onLoadEnd={reportLoaded}
      />

      {!loaded && <Skeleton />}
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },

  skeleton: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#E5E5E5',
  },
});
