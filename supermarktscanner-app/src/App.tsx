import React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LocationProvider, useLocationContext } from './context/LocationContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { I18nProvider, useI18n } from './context/I18nContext';
import { LocationSetupScreen } from './screens/LocationSetupScreen';
import { ProductSearchScreen } from './screens/ProductSearchScreen';
import { MapScreen } from './screens/MapScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { SupermarketsDrawerContent } from './components/SupermarketsDrawer';

type RootStackParamList = {
  LocationSetup: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const MapDrawerNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <SupermarketsDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerPosition: 'left',
        drawerType: 'slide',
        drawerStyle: {
          width: 300,
          backgroundColor: colors.drawerBackground,
        },
        overlayColor: 'rgba(0, 0, 0, 0.5)',
        swipeEnabled: true,
      }}
    >
      <Drawer.Screen
        name="MapView"
        component={MapScreen}
        options={{
          drawerItemStyle: { height: 0 },
        }}
      />
    </Drawer.Navigator>
  );
};

const MainTabs: React.FC = () => {
  const { colors } = useTheme();
  const { t } = useI18n();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarStyle: { backgroundColor: colors.tabBar },
        tabBarLabelStyle: { fontWeight: '600' },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="ProductSearch"
        component={ProductSearchScreen}
        options={{
          tabBarLabel: t('nav.search'),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapDrawerNavigator}
        options={{
          tabBarLabel: t('nav.location'),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: t('nav.settings'),
        }}
      />
    </Tab.Navigator>
  );
};

const LocationSetupScreenWrapper: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return <LocationSetupScreen onLocationSet={() => navigation.replace('Main')} />;
};

const AppNavigator: React.FC = () => {
  const { isLocationSet } = useLocationContext();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLocationSet ? (
          <Stack.Screen
            name="Main"
            component={MainTabs}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="LocationSetup"
            component={LocationSetupScreenWrapper}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App: React.FC = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider>
      <ThemeProvider>
        <I18nProvider>
          <LocationProvider>
            <AppNavigator />
          </LocationProvider>
        </I18nProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  </GestureHandlerRootView>
);

export default App;

