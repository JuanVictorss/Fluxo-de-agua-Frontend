import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./App.css";
import DashboardTempoReal from "./components/DashboardTempoReal";
import DashboardHistorico from "./components/DashboardHistorico";

const URL_SERVIDOR_SOCKET = "http://localhost:3001";
const URL_API = "http://localhost:3001/api/logs";
const MAXIMO_PONTOS_GRAFICO = 30;

function App() {
  const [dadosMaisRecentes, setDadosMaisRecentes] = useState({
    flow_rate_lpm: 0,
    total_liters: 0,
    volume_sessao_atual: 0,
  });
  const [dadosGraficoTempoReal, setDadosGraficoTempoReal] = useState([]);
  const [sessoes, setSessoes] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState("tempoReal");

  useEffect(() => {
    const buscarSessoes = async () => {
      try {
        const response = await fetch(URL_API);
        const data = await response.json();
        setSessoes(data);
        console.log("Histórico de sessões atualizado.");
      } catch (error) {
        console.error("Erro ao buscar sessões:", error);
      }
    };
    buscarSessoes();

    const socket = io(URL_SERVIDOR_SOCKET);
    socket.on("connect", () =>
      console.log("Conectado ao backend com sucesso!")
    );

    socket.on("dados-fluxo", (data) => {
      const dadosParseados = JSON.parse(data);
      setDadosMaisRecentes(dadosParseados);

      if (dadosParseados.flow_rate_lpm > 0) {
        const novoPonto = {
          time: new Date().toLocaleTimeString("pt-BR", { hour12: false }),
          vazao: dadosParseados.flow_rate_lpm,
        };
        setDadosGraficoTempoReal((dadosAtuais) => {
          const dadosAtualizados = [...dadosAtuais, novoPonto];
          return dadosAtualizados.length > MAXIMO_PONTOS_GRAFICO
            ? dadosAtualizados.slice(1)
            : dadosAtualizados;
        });
      } else {
        setDadosGraficoTempoReal((dadosAtuais) => {
          if (dadosAtuais.length > 0) {
            console.log("Fluxo zerado. Limpando o gráfico de tempo real.");
            return [];
          }
          return dadosAtuais;
        });
      }
    });

    socket.on("historico-atualizado", () => {
      console.log(
        "Recebido aviso de que o histórico foi atualizado. Buscando novos logs..."
      );
      buscarSessoes();
    });

    return () => {
      console.log("Desconectando do socket.");
      socket.disconnect();
    };
  }, []);

  return (
    <div className="container">
      <h1>Dashboard de Fluxo de Água</h1>
      <div className="navegacao-abas">
        <button
          className={`botao-aba ${abaAtiva === "tempoReal" ? "ativo" : ""}`}
          onClick={() => setAbaAtiva("tempoReal")}
        >
          Tempo Real
        </button>
        <button
          className={`botao-aba ${abaAtiva === "historico" ? "ativo" : ""}`}
          onClick={() => setAbaAtiva("historico")}
        >
          Histórico
        </button>
      </div>

      <div className="conteudo-aba">
        {abaAtiva === "tempoReal" ? (
          <DashboardTempoReal
            dadosMaisRecentes={dadosMaisRecentes}
            dadosGrafico={dadosGraficoTempoReal}
          />
        ) : (
          <DashboardHistorico sessoes={sessoes} />
        )}
      </div>
    </div>
  );
}

export default App;
