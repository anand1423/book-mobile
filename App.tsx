import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AuthProvider} from './src/contexts/authContext';

// Import screens
import LoginScreen from './src/screens/LoginScreen';
import BooksScreen from './src/screens/BooksScreen';
// import BookDetailScreen from './screens/BookDetailScreen';
// import ChapterScreen from './screens/ChapterScreen';
// import QuizScreen from './screens/QuizScreen';
// import QuizResultScreen from './screens/QuizResultScreen';
// import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Books"
              component={BooksScreen}
              options={{title: 'Book Library'}}
            />
            {/* 
            <Stack.Screen
              name="BookDetail"
              component={BookDetailScreen}
              options={({route}) => ({title: route.params.title})}
            />
            <Stack.Screen
              name="Chapter"
              component={ChapterScreen}
              options={({route}) => ({title: route.params.title})}
            />
            <Stack.Screen
              name="Quiz"
              component={QuizScreen}
              options={{
                headerShown: false,
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="QuizResult"
              component={QuizResultScreen}
              options={{
                title: 'Quiz Results',
                headerLeft: null,
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{title: 'My Profile'}}
            /> */}
          </Stack.Navigator>
          <StatusBar
            animated={true}
            backgroundColor="#61dafb"
            barStyle={'light-content'}
            showHideTransition={'fade'}
            hidden={true}
          />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
