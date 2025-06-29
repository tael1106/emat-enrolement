import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import 'react-native-gesture-handler';

import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { createNativeStackNavigator } from '@react-navigation/native-stack';


import { useColorScheme } from '@/hooks/useColorScheme';
import HomeScreen from './home';
import IndexScreen from './index';
const Stack = createNativeStackNavigator();

export default function RootLayout() {
  const colorScheme = useColorScheme();




  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>

      <Stack.Navigator
        key={2}
        screenOptions={{
          headerShown: false,
          /*  presentation: 'modal', */
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}>
        <Stack.Screen name="index" component={IndexScreen} />
        <Stack.Screen name="home" component={HomeScreen} />

      </Stack.Navigator>
      {/*  <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      */}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
