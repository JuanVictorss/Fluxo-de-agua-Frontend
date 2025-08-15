# 💧 Fluxo de Água - Frontend

![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-black?logo=socket.io)
![Recharts](https://img.shields.io/badge/Recharts-3.x-blue)

---

## 📜 Visão Geral

Este repositório contém o **frontend** do projeto **Fluxo de Água**.  
Ele exibe em **tempo real** e em **modo histórico** os dados de vazão e volume coletados pelo **ESP32**, enviados ao **backend** via **MQTT** e repassados ao frontend com **Socket.IO**.  
A interface foi construída utilizando **React** com **Vite**.

---

## ✨ Funcionalidades

- 📊 Dashboard em tempo real da vazão de água.
- 📈 Histórico de sessões com gráfico de vazão.
- 🔄 Comunicação em tempo real via **Socket.IO**.
- 🌐 Consumo da **API REST** do backend para buscar logs.

---

## 📂 Estrutura do Projeto

```
fluxo-de-agua-frontend/
│── node_modules/           # Dependências do projeto
│── public/                 # Arquivos estáticos
│── src/                    # Código-fonte principal
│   ├── components/         # Dashboards e componentes de UI
│   ├── icon/               # Ícones do projeto
│   ├── App.jsx             # Componente principal
│   ├── main.jsx            # Entrada da aplicação React
│   ├── index.css           # Estilos globais
│── package.json            # Dependências e scripts
│── vite.config.js          # Configuração do Vite
│── README.md               # Documentação do projeto
```

---

## 🚀 Como Rodar o Projeto

### 1️⃣ Clonar repositório

```bash
git clone
cd fluxo-de-agua-frontend
```

### 2️⃣ Instalar dependências

```bash
npm install
```

### 3️⃣ Iniciar servidor de desenvolvimento

```bash
npm run dev
```

### 4️⃣ Acessar aplicação

Abra no navegador:

```
http://localhost:5173
```

---

## 📦 Dependências

```json
"dependencies": {
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "recharts": "^3.1.2",
  "socket.io-client": "^4.8.1"
}
```

---

## 🔗 Repositórios Relacionados

- [📂 Backend](https://github.com/JuanVictorss/Fluxo-de-agua-Backend)
- [📂 Firmware ESP32]()

---

## 👨‍💻 Autor

**Juan Victor Souza Silva**.  
Projeto para fins acadêmicos na disciplina de **Sistemas Embarcados**.
