import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Item = {
  id: string;
  name: string;
};

export default function TempoInterrupcaoScreen() {
  const [tempo, setTempo] = useState('');
  const [lista, setLista] = useState<Item[]>([]);

  useEffect(() => {
    carregarTempos();
  }, []);

  async function carregarTempos() {
    try {
      const jsonValue = await AsyncStorage.getItem('@temposInterrupcao');
      const data = jsonValue != null ? JSON.parse(jsonValue) : [];
      setLista(data);
    } catch {
      setLista([]);
    }
  }

  async function salvarTempo() {
    if (!tempo.trim()) {
      Alert.alert('Erro', 'Preencha o tempo de interrupção');
      return;
    }

    const novoItem: Item = { id: Date.now().toString(), name: tempo.trim() };
    const novaLista = [...lista, novoItem];
    try {
      await AsyncStorage.setItem('@temposInterrupcao', JSON.stringify(novaLista));
      setLista(novaLista);
      setTempo('');
      Alert.alert('Sucesso', 'Tempo salvo');
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar');
    }
  }

  function confirmarLimpeza() {
    Alert.alert(
      'Confirmar Limpeza',
      'Deseja realmente apagar todos os tempos cadastrados? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Apagar', style: 'destructive', onPress: limparTempos },
      ],
      { cancelable: true }
    );
  }

  async function limparTempos() {
    try {
      await AsyncStorage.removeItem('@temposInterrupcao');
      setLista([]);
      Alert.alert('Sucesso', 'Tempos apagados.');
    } catch {
      Alert.alert('Erro', 'Falha ao apagar tempos.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tempo de Interrupção</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 2 horas, 30 minutos"
        placeholderTextColor="#90A4AE"
        value={tempo}
        onChangeText={setTempo}
      />
      <TouchableOpacity style={styles.button} onPress={salvarTempo}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#D32F2F' }]} onPress={confirmarLimpeza}>
        <Text style={styles.buttonText}>Limpar Todos os Tempos</Text>
      </TouchableOpacity>

      <Text style={styles.subTitle}>Tempos registrados:</Text>
      <FlatList
        data={lista}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listText}>{item.name}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noDataText}>Nenhum tempo registrado.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20 },
  title: { fontSize: 26, fontWeight: '900', color: '#FFC107', marginBottom: 20, textTransform: 'uppercase', letterSpacing: 1 },
  input: {
    backgroundColor: '#37474F',
    color: '#ECEFF1',
    borderWidth: 1.5,
    borderColor: '#FFC107',
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 15,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#FFC107',
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 5,
  },
  buttonText: { color: '#121212', fontWeight: '900', fontSize: 18 },
  subTitle: { fontSize: 18, color: '#90A4AE', marginBottom: 10, fontWeight: '700', letterSpacing: 0.5 },
  listItem: {
    backgroundColor: '#37474F',
    borderLeftWidth: 6,
    borderLeftColor: '#FFC107',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginVertical: 8,
    borderRadius: 3,
  },
  listText: { color: '#ECEFF1', fontWeight: '700', fontSize: 16 },
  noDataText: { color: '#90A4AE', fontSize: 16, fontStyle: 'italic', marginTop: 40, textAlign: 'center' },
});
