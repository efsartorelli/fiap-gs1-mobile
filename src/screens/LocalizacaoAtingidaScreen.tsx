import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Item = { id: string; name: string };

export default function LocalizacaoAtingidaScreen({ navigation }: any) {
  const [localizacao, setLocalizacao] = useState('');
  const [lista, setLista] = useState<Item[]>([]);

  useEffect(() => {
    carregarLocalizacoes();
  }, []);

  async function carregarLocalizacoes() {
    const jsonValue = await AsyncStorage.getItem('@localizacoes');
    const data = jsonValue ? JSON.parse(jsonValue) : [];
    setLista(data);
  }

  async function salvarLocalizacao() {
    if (!localizacao.trim()) {
      Alert.alert('Erro', 'Preencha a localização');
      return;
    }

    const novoItem = { id: Date.now().toString(), name: localizacao.trim() };
    const novaLista = [...lista, novoItem];

    try {
      await AsyncStorage.setItem('@localizacoes', JSON.stringify(novaLista));
      setLista(novaLista);
      setLocalizacao('');
      Alert.alert('Sucesso', 'Localização salva');
      navigation.goBack(); // volta para tela anterior
    } catch {
      Alert.alert('Erro', 'Falha ao salvar localização');
    }
  }

  async function apagarTodasLocalizacoes() {
    Alert.alert(
      'Confirmação',
      'Deseja apagar todas as localizações? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('@localizacoes');
              setLista([]);
              Alert.alert('Sucesso', 'Todas as localizações foram apagadas.');
            } catch {
              Alert.alert('Erro', 'Falha ao apagar localizações.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Localização Atingida</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite bairro, cidade ou CEP"
        placeholderTextColor="#90A4AE"
        value={localizacao}
        onChangeText={setLocalizacao}
      />
      <TouchableOpacity style={styles.button} onPress={salvarLocalizacao}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>

      <Text style={styles.subTitle}>Regiões cadastradas:</Text>
      <FlatList
        data={lista}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text style={styles.listItem}>{item.name}</Text>}
        ListEmptyComponent={<Text style={styles.noDataText}>Nenhuma região cadastrada.</Text>}
      />

      {/* Botão para apagar todas as localizações */}
      {lista.length > 0 && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#D32F2F' }]}
          onPress={apagarTodasLocalizacoes}
        >
          <Text style={styles.buttonText}>Apagar todas as localizações</Text>
        </TouchableOpacity>
      )}
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
    marginBottom: 20,
  },
  buttonText: { color: '#121212', fontWeight: '900', fontSize: 18 },
  subTitle: { color: '#90A4AE', fontWeight: '700', fontSize: 18, marginBottom: 10 },
  listItem: {
    backgroundColor: '#37474F',
    color: '#ECEFF1',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 6,
    borderRadius: 3,
  },
  noDataText: { color: '#90A4AE', fontStyle: 'italic', marginTop: 40, textAlign: 'center' },
});
