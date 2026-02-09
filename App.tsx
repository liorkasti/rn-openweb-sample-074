import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthProvider} from './src/features/auth/AuthContext';
import {HomeScreen} from './src/screens/HomeScreen';
import {PreConversationScreen} from './src/screens/PreConversationScreen';
import {ConversationScreen} from './src/screens/ConversationScreen';
import {Colors} from './src/theme/colors';
import type {RootStackParamList} from './src/navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = (): React.JSX.Element => (
  <AuthProvider>
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
          options={{title: 'OpenWeb SDK'}}
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
  </AuthProvider>
);

export default App;
