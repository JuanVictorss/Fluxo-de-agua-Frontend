import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "./App.css";
import StatusIndicator from "./components/StatusIndicator";
import DashboardTempoReal from "./components/DashboardTempoReal";
import DashboardHistorico from "./components/DashboardHistorico";
import PaginaConfiguracoes from "./components/PaginaConfiguracoes";
import DashboardRelatorios from "./components/DashboardRelatorios";

const BASE_URL = import.meta.env.VITE_API_URL;

const URL_SERVIDOR_SOCKET = BASE_URL;
const URL_API_HISTORICO = `${BASE_URL}/api/historico/12h`;
const URL_API_RELATORIO_DIARIO = `${BASE_URL}/api/relatorio/diario`;
const URL_API_CONFIG = `${BASE_URL}/api/config`;

function App() {
  const [dadosMaisRecentes, setDadosMaisRecentes] = useState({ flow_rate_lpm: 0, total_liters: 0, volume_sessao_atual: 0 });
  const [dadosGraficoTempoReal, setDadosGraficoTempoReal] = useState([]);
  const [statusEsp, setStatusEsp] = useState('offline');
  const [abaAtiva, setAbaAtiva] = useState('tempoReal');
  const ultimaVazaoRecebida = useRef(0);

  useEffect(() => {
    const socket = io(URL_SERVIDOR_SOCKET);
    socket.on("connect", () => console.log("Conectado ao backend!"));
    socket.on("dados-fluxo", (data) => {
      const dadosParseados = JSON.parse(data);
      setDadosMaisRecentes(dadosParseados);
      ultimaVazaoRecebida.current = dadosParseados.flow_rate_lpm;
    });
    socket.on('status-esp32', (status) => setStatusEsp(status));

    const intervalId = setInterval(() => {
      const vazaoAtual = ultimaVazaoRecebida.current;
      const novoPonto = {
        time: new Date().toLocaleTimeString("pt-BR", { hour12: false }),
        vazao: vazaoAtual,
      };
      setDadosGraficoTempoReal((dadosAtuais) => {
        const dadosAtualizados = [...dadosAtuais, novoPonto];
        return dadosAtualizados.length > 60 ? dadosAtualizados.slice(1) : dadosAtualizados;
      });
      ultimaVazaoRecebida.current = 0;
    }, 1000);

    return () => {
      clearInterval(intervalId);
      socket.disconnect();
    };
  }, []);

  const renderAbaAtiva = () => {
    switch(abaAtiva) {
      case 'tempoReal':
        return <DashboardTempoReal dadosMaisRecentes={dadosMaisRecentes} dadosGrafico={dadosGraficoTempoReal} />;
      case 'historico':
        return <DashboardHistorico urlApi={URL_API_HISTORICO} />;
      case 'relatorios':
      return <DashboardRelatorios urlApi={URL_API_RELATORIO_DIARIO} />;
      case 'config':
        return <PaginaConfiguracoes urlApi={URL_API_CONFIG} />;
      default:
        return null;
    }
  }

  return (
    <div className="container">
      <StatusIndicator status={statusEsp} />
      <h1>Dashboard de Fluxo de Água</h1>
      
      <div className="navegacao-abas">
        <button className={`botao-aba ${abaAtiva === 'tempoReal' ? 'ativo' : ''}`} onClick={() => setAbaAtiva('tempoReal')}>Tempo Real</button>
        <button className={`botao-aba ${abaAtiva === 'historico' ? 'ativo' : ''}`} onClick={() => setAbaAtiva('historico')}>Histórico</button>
        <button className={`botao-aba ${abaAtiva === 'relatorios' ? 'ativo' : ''}`} onClick={() => setAbaAtiva('relatorios')}>Relatórios</button>
        <button className={`botao-aba ${abaAtiva === 'config' ? 'ativo' : ''}`} onClick={() => setAbaAtiva('config')}>Configurações</button>
      </div>

      <div className="conteudo-aba">
        {renderAbaAtiva()}
      </div>
    </div>
  );
}

export default App;