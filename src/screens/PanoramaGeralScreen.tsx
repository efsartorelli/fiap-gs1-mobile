import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Evento = {
  id: string;
  localId: string;
  tempoId: string;
  prejuizoId: string;
  localName: string;
  tempoName: string;
  prejuizoName: string;
};

export default function PanoramaGeralScreen({ navigation }: any) {
  const [eventos, setEventos] = useState<Evento[]>([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarEventos();
    });
    return unsubscribe;
  }, [navigation]);

  async function carregarEventos() {
    try {
      const eventosRaw = await AsyncStorage.getItem('@eventos');
      const eventos = eventosRaw ? JSON.parse(eventosRaw) : [];

      const locRaw = await AsyncStorage.getItem('@localizacoes');
      const locais = locRaw ? JSON.parse(locRaw) : [];

      const tempoRaw = await AsyncStorage.getItem('@temposInterrupcao');
      const tempos = tempoRaw ? JSON.parse(tempoRaw) : [];

      const prejRaw = await AsyncStorage.getItem('@prejuizos');
      const prejuizos = prejRaw ? JSON.parse(prejRaw) : [];

      const eventosComInfos = eventos.map((ev: any) => {
        const local = locais.find((l: any) => l.id === ev.localId);
        const tempo = tempos.find((t: any) => t.id === ev.tempoId);
        const prejuizo = prejuizos.find((p: any) => p.id === ev.prejuizoId);

        return {
          id: ev.id,
          localId: ev.localId,
          tempoId: ev.tempoId,
          prejuizoId: ev.prejuizoId,
          localName: local?.name || 'Desconhecido',
          tempoName: tempo?.name || 'Desconhecido',
          prejuizoName: prejuizo?.name || 'Desconhecido',
        };
      });

      setEventos(eventosComInfos);
    } catch {
      setEventos([]);
    }
  }

  async function apagarTodosEventos() {
    Alert.alert(
      'Confirmação',
      'Deseja apagar todos os eventos? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('@eventos');
              setEventos([]);
              Alert.alert('Sucesso', 'Todos os eventos foram apagados.');
            } catch {
              Alert.alert('Erro', 'Falha ao apagar os eventos.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eventos Criados</Text>

      {eventos.length === 0 ? (
        <Text style={styles.noDataText}>Nenhum evento criado.</Text>
      ) : (
        <FlatList
          data={eventos}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.listTitle}>{item.localName}</Text>
              <Text style={styles.listText}>Tempo de Interrupção: {item.tempoName}</Text>
              <Text style={styles.listText}>Prejuízos: {item.prejuizoName}</Text>
            </View>
          )}
        />
      )}

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LocalizacaoAtingida')}>
          <Text style={styles.buttonText}>Cadastrar Localização</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TempoInterrupcao')}>
          <Text style={styles.buttonText}>Cadastrar Tempo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PrejuizosCausados')}>
          <Text style={styles.buttonText}>Cadastrar Prejuízo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CriarEvento')}>
          <Text style={styles.buttonText}>Criar Evento</Text>
        </TouchableOpacity>
        {/* Botão para apagar todos os eventos */}
        <TouchableOpacity style={[styles.button, { backgroundColor: '#D32F2F' }]} onPress={apagarTodosEventos}>
          <Text style={styles.buttonText}>Apagar Todos os Eventos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20 },
  title: { fontSize: 26, fontWeight: '900', color: '#FFC107', marginBottom: 20, textTransform: 'uppercase', letterSpacing: 1 },
  noDataText: { color: '#90A4AE', fontSize: 16, fontStyle: 'italic', marginTop: 40, textAlign: 'center' },
  listItem: {
    backgroundColor: '#37474F',
    borderLeftWidth: 6,
    borderLeftColor: '#FFC107',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginVertical: 8,
    borderRadius: 3,
  },
  listTitle: { color: '#ECEFF1', fontWeight: '900', fontSize: 18, marginBottom: 6 },
  listText: { color: '#ECEFF1', fontWeight: '600', fontSize: 16 },
  buttonsContainer: {
    marginTop: 20,
    justifyContent: 'space-between',
    height: 300,
  },
  button: {
    backgroundColor: '#FFC107',
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: 'center',
    marginVertical: 6,
    elevation: 6,
  },
  buttonText: { color: '#121212', fontWeight: '900', fontSize: 18 },
});
