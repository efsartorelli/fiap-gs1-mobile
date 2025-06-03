import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import PanoramaGeralScreen from './src/screens/PanoramaGeralScreen';
import LocalizacaoAtingidaScreen from './src/screens/LocalizacaoAtingidaScreen';
import TempoInterrupcaoScreen from './src/screens/TempoInterrupcaoScreen';
import PrejuizosCausadosScreen from './src/screens/PrejuizosCausadosScreen';
import CriarEventoScreen from './src/screens/CriarEventoScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PanoramaGeral">
        <Stack.Screen name="PanoramaGeral" component={PanoramaGeralScreen} options={{ title: 'Panorama Geral' }} />
        <Stack.Screen name="LocalizacaoAtingida" component={LocalizacaoAtingidaScreen} options={{ title: 'Cadastrar Localização' }} />
        <Stack.Screen name="TempoInterrupcao" component={TempoInterrupcaoScreen} options={{ title: 'Cadastrar Tempo' }} />
        <Stack.Screen name="PrejuizosCausados" component={PrejuizosCausadosScreen} options={{ title: 'Cadastrar Prejuízo' }} />
        <Stack.Screen name="CriarEvento" component={CriarEventoScreen} options={{ title: 'Criar Evento' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}