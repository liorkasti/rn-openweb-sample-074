/**
 * OpenWeb SDK Sample App
 * React Native 0.74.3 - Demonstrates SDK integration with
 * authentication, pre-conversation, full conversation, and analytics.
 *
 * @format
 */

import React, {useEffect} from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {OpenWeb} from 'react-native-openweb-sdk';
import {AuthProvider} from './src/context/AuthContext';
import {HomeScreen} from './src/screens/HomeScreen';
import {PreConversationScreen} from './src/screens/PreConversationScreen';
import {ConversationScreen} from './src/screens/ConversationScreen';
import {Colors} from './src/theme/colors';
import type {RootStackParamList} from './src/navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppContent = (): React.JSX.Element => {
  useEffect(() => {
    // Subscribe to SDK analytics events
    const unsubscribe = OpenWeb.manager.analytics.onAnalyticsEvent(event => {
      console.log('[Analytics]', event.event, event.postId, event);
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {backgroundColor: Colors.primary},
          headerTintColor: Colors.white,
          headerTitleStyle: {fontWeight: '600', fontSize: 17},
          headerBackTitle: '',
          headerShadowVisible: false,
          animation: 'slide_from_right',
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({navigation}) => ({
            title: 'OpenWeb SDK',
            headerLargeTitle: false,
            headerRight: () => (
              <TouchableOpacity
                onPress={() => {
                  navigation.setParams({_openSettings: Date.now()});
                }}
                style={headerStyles.settingsButton}
                hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                <Text style={headerStyles.settingsIcon}>&#9881;</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="PreConversation"
          component={PreConversationScreen}
          options={{title: 'Pre-Conversation'}}
        />
        <Stack.Screen
          name="Conversation"
          component={ConversationScreen}
          options={{title: 'Conversation'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = (): React.JSX.Element => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const headerStyles = StyleSheet.create({
  settingsButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    fontSize: 18,
    color: Colors.white,
  },
});

export default App;
