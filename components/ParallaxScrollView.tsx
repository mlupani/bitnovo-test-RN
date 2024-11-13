import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {useAnimatedRef} from 'react-native-reanimated';

type Props = PropsWithChildren<{
  headerBackgroundColor: { dark: string; light: string };
}>;

export function ParallaxScrollView({
  children,
  headerBackgroundColor,
}: Props) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  return (
    <View style={{flex: 1}}>
      <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
        <View style={styles.content}>{children}</View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 32,
    gap: 16,
    backgroundColor: '#ffffff',
  },
});
