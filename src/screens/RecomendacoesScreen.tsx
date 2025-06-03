import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const recomendacoes = [
  "Use geradores de energia para manter equipamentos essenciais funcionando.",
  "Evite ligar muitos aparelhos simultaneamente após o restabelecimento da energia para não sobrecarregar a rede.",
  "Tenha lanternas e baterias extras à mão.",
  "Mantenha os dispositivos eletrônicos desligados durante a queda para evitar danos.",
  "Informe vizinhos e autoridades locais sobre a falta de energia.",
  "Em caso de desastres naturais, siga as orientações oficiais de segurança.",
];

export default function RecomendacoesScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Recomendações para Falta de Energia</Text>
      {recomendacoes.map((item, index) => (
        <View key={index} style={styles.item}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.text}>{item}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20 },
  title: { fontSize: 26, fontWeight: '900', color: '#FFC107', marginBottom: 20, letterSpacing: 1, textTransform: 'uppercase' },
  item: { flexDirection: 'row', marginBottom: 12 },
  bullet: { color: '#FFC107', fontSize: 20, marginRight: 8, fontWeight: '900' },
  text: { color: '#ECEFF1', fontSize: 16, flexShrink: 1, fontWeight: '600' },
});
