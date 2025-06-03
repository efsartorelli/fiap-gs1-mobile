===============================
🚀 GERENCIADOR DE EVENTOS DE INTERRUPÇÃO
===============================

📌 Descrição  
Este aplicativo mobile foi desenvolvido com React Native para gerenciar eventos relacionados a interrupções, permitindo cadastrar localidades atingidas, tempos de interrupção e prejuízos causados. O usuário pode criar eventos combinando essas informações, visualizar o panorama geral dos eventos cadastrados e apagar registros, tudo com armazenamento local via AsyncStorage. É um projeto acadêmico com foco em consumo de dados locais, persistência, navegação e estilização avançada em tema escuro.

---

🛠️ Tecnologias Utilizadas

- React Native (via Expo)  
- TypeScript  
- React Navigation  
- AsyncStorage para armazenamento local  
- Estilização customizada com cores escuras e destaque amarelo  
- Componentes nativos e customizados para modais e pickers  

---

📱 Funcionalidades do App

🏘️ Cadastro de Localizações  
- Inserção de bairros, cidades ou CEPs atingidos  
- Listagem de localidades cadastradas  
- Exclusão em massa com confirmação  

⏳ Cadastro de Tempos de Interrupção  
- Registro dos períodos de duração da interrupção  

⚠️ Cadastro de Prejuízos Causados  
- Registro textual dos prejuízos associados  

📅 Criação de Eventos  
- Combinação de localização, tempo e prejuízo para criar eventos únicos  
- Validação para evitar duplicidade  
- Confirmação via modal customizado  

📊 Panorama Geral dos Eventos  
- Visualização em lista detalhada com nomes relacionados  
- Botões para navegação entre telas de cadastro  
- Botão para apagar todos os eventos com confirmação  

---

📁 Estrutura do Projeto

GerenciadorEventos/
├── assets/                → imagens e ícones
├── components/            → componentes customizados (Modal, Picker)
├── screens/               → telas: LocalizacaoAtingida, TempoInterrupcao, PrejuizosCausados, CriarEvento, PanoramaGeral
├── App.tsx                → ponto de entrada
├── package.json           → configurações do projeto
└── tsconfig.json          → configurações do TypeScript

---

▶️ Como Executar o Projeto

1. Clone o repositório:  
   git clone https://github.com/efsartorelli/fiap-gs1-mobile

2. Acesse a pasta do projeto:  
   cd GerenciadorEventos

3. Instale as dependências:  
   npm install

4. Inicie o projeto com Expo:  
   npx expo start

---

📦 Instale também as dependências essenciais:

npm install @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context
npx expo install @react-native-async-storage/async-storage
npx expo install @react-native-picker/picker

---

👨‍💻 Autores

- Eduardo de Oliveira Nistal — RM94524  
- Enzo Vazquez Sartorelli — RM94618  

---

📚 Observações Finais

- Projeto acadêmico com foco em persistência local e usabilidade  
- Aplicação 100% mobile, com navegação fluida entre telas  
- Interface em tema escuro com cores de destaque para melhor experiência visual  
- Funcionalidades completas para cadastro, visualização e exclusão de dados  
- Testado em ambiente Expo com React Native  

🗓️ Última atualização: 03/06/2025
