import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Pressable,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

type Item = { id: string; name: string };

export default function CriarEventoScreen({ navigation }: any) {
  const [localizacoes, setLocalizacoes] = useState<Item[]>([]);
  const [tempos, setTempos] = useState<Item[]>([]);
  const [prejuizos, setPrejuizos] = useState<Item[]>([]);

  const [selectedLocal, setSelectedLocal] = useState<string | null>(null);
  const [selectedTempo, setSelectedTempo] = useState<string | null>(null);
  const [selectedPrejuizo, setSelectedPrejuizo] = useState<string | null>(null);

  // Controle do modal customizado
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', carregarDados);
    return unsubscribe;
  }, [navigation]);

  async function carregarDados() {
    try {
      const locRaw = await AsyncStorage.getItem('@localizacoes');
      const temposRaw = await AsyncStorage.getItem('@temposInterrupcao');
      const prejRaw = await AsyncStorage.getItem('@prejuizos');

      setLocalizacoes(locRaw ? JSON.parse(locRaw) : []);
      setTempos(temposRaw ? JSON.parse(temposRaw) : []);
      setPrejuizos(prejRaw ? JSON.parse(prejRaw) : []);

      setSelectedLocal(null);
      setSelectedTempo(null);
      setSelectedPrejuizo(null);
    } catch {
      mostrarModal('Erro ao carregar dados');
    }
  }

  function mostrarModal(msg: string) {
    setModalMessage(msg);
    setModalVisible(true);
  }

  function confirmarSalvarEvento() {
    if (!selectedLocal || !selectedTempo || !selectedPrejuizo) {
      mostrarModal('Selecione uma opção para cada campo');
      return;
    }
    mostrarModal('Deseja realmente criar este evento?');
  }

  async function salvarEvento() {
    try {
      const eventosRaw = await AsyncStorage.getItem('@eventos');
      const eventos = eventosRaw ? JSON.parse(eventosRaw) : [];

      const existe = eventos.some(
        (ev: any) =>
          ev.localId === selectedLocal &&
          ev.tempoId === selectedTempo &&
          ev.prejuizoId === selectedPrejuizo
      );

      if (existe) {
        mostrarModal('Este evento já foi criado.');
        return;
      }

      const novoEvento = {
        id: Date.now().toString(),
        localId: selectedLocal,
        tempoId: selectedTempo,
        prejuizoId: selectedPrejuizo,
      };

      eventos.push(novoEvento);
      await AsyncStorage.setItem('@eventos', JSON.stringify(eventos));
      mostrarModal('Evento criado com sucesso!');
      // Voltar após um tempo para o usuário ler a mensagem
      setTimeout(() => {
        setModalVisible(false);
        navigation.goBack();
      }, 2000);
    } catch {
      mostrarModal('Falha ao salvar evento');
    }
  }

  // Função para controlar o fluxo do modal de confirmação
  function onModalConfirm() {
    if (modalMessage === 'Deseja realmente criar este evento?') {
      setModalVisible(false);
      salvarEvento();
    } else {
      setModalVisible(false);
    }
  }

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Criar Novo Evento</Text>

        <Text style={styles.label}>Selecione a Localização:</Text>
        <Picker
          selectedValue={selectedLocal}
          onValueChange={setSelectedLocal}
          style={styles.picker}
          dropdownIconColor="#FFC107"
        >
          <Picker.Item label="-- Selecione --" value={null} color="#fff" />
          {localizacoes.map((loc) => (
            <Picker.Item key={loc.id} label={loc.name} value={loc.id} color="#fff" />
          ))}
        </Picker>

        <Text style={styles.label}>Selecione o Tempo de Interrupção:</Text>
        <Picker
          selectedValue={selectedTempo}
          onValueChange={setSelectedTempo}
          style={styles.picker}
          dropdownIconColor="#FFC107"
        >
          <Picker.Item label="-- Selecione --" value={null} color="#fff" />
          {tempos.map((t) => (
            <Picker.Item key={t.id} label={t.name} value={t.id} color="#fff" />
          ))}
        </Picker>

        <Text style={styles.label}>Selecione os Prejuízos Causados:</Text>
        <Picker
          selectedValue={selectedPrejuizo}
          onValueChange={setSelectedPrejuizo}
          style={styles.picker}
          dropdownIconColor="#FFC107"
        >
          <Picker.Item label="-- Selecione --" value={null} color="#fff" />
          {prejuizos.map((p) => (
            <Picker.Item key={p.id} label={p.name} value={p.id} color="#fff" />
          ))}
        </Picker>

        <TouchableOpacity
          style={styles.button}
          onPress={confirmarSalvarEvento}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Salvar Evento</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal Customizado */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>{modalMessage}</Text>

            <View style={styles.modalButtons}>
              {/* Se for confirmação, mostrar Confirmar + Cancelar */}
              {modalMessage === 'Deseja realmente criar este evento?' ? (
                <>
                  <Pressable
                    style={[styles.modalButton, styles.modalCancelButton]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>Cancelar</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.modalButton, styles.modalConfirmButton]}
                    onPress={onModalConfirm}
                  >
                    <Text style={styles.modalButtonText}>Confirmar</Text>
                  </Pressable>
                </>
              ) : (
                // Para mensagens normais, só botão OK
                <Pressable
                  style={[styles.modalButton, styles.modalConfirmButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>OK</Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#121212',
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFC107',
    marginBottom: 25,
    textTransform: 'uppercase',
  },
  label: {
    fontSize: 18,
    color: '#90A4AE',
    marginBottom: 8,
    fontWeight: '700',
  },
  picker: {
    backgroundColor: '#37474F',
    color: '#fff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FFC107',
    paddingVertical: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 15,
    elevation: 6,
  },
  buttonText: {
    color: '#121212',
    fontWeight: '900',
    fontSize: 18,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 20,
    width: '100%',
    maxWidth: 350,
  },
  modalText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 4,
    alignItems: 'center',
  },
  modalConfirmButton: {
    backgroundColor: '#FFC107',
  },
  modalCancelButton: {
    backgroundColor: '#555',
  },
  modalButtonText: {
    color: '#121212',
    fontWeight: '700',
    fontSize: 16,
  },
});
