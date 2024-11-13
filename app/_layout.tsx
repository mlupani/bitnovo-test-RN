import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export const unstable_settings = {
  initialRouteName: 'index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'light' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false, statusBarStyle: 'light', contentStyle: {backgroundColor: 'white'}}} />
        <Stack.Screen name="Solicitud-pago" options={{headerShown: false, statusBarStyle: 'light', contentStyle: {backgroundColor: 'white'}}} />
        <Stack.Screen name="Pago-recibido" options={{ headerShown: false, statusBarStyle: 'light', contentStyle: {backgroundColor: 'white',}}} />
        <Stack.Screen name="Mostrar-qr-pago" options={{ headerShown: false, statusBarStyle: 'light', contentStyle: {backgroundColor: '#035AC5',}}} />
      </Stack>
    </ThemeProvider>
  );
}
