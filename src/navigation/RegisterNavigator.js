import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Register from '../Pages/Register';

const Stack = createStackNavigator();

const RegisterNavigator = props => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        // headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        name="registe"
        component={Register}
        options={{
          title: 'Welcome',
          headerTintColor: '#000',
          headerTitleStyle: {
            fontWeight: '600',
            letterSpacing: 0.7,
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default RegisterNavigator;
