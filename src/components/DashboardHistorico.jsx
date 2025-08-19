import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const URL_API_HISTORICO = "https://fluxo-de-agua-backend-production.up.railway.app/api/historico/12h";

function DashboardHistorico() {
  const [dadosHistorico, setDadosHistorico] = useState([]);

  useEffect(() => {
    const buscarDadosHistorico = async () => {
      try {
        const response = await fetch(URL_API_HISTORICO);
        const data = await response.json();
        const dadosFormatados = data.map(ponto => ({
          ...ponto,
          horario: new Date(ponto.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }));
        setDadosHistorico(dadosFormatados);
      } catch (error) {
        console.error("Erro ao buscar dados históricos:", error);
      }
    };
    buscarDadosHistorico();
  }, []); 

  return (
    <div className="cartao-grafico">
      <h2>Consumo Agregado por Minuto (Últimas 12 Horas)</h2>
      {dadosHistorico.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={dadosHistorico} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="horario" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }} />
            <Legend />
            <Area type="monotone" dataKey="vazao_media_lpm" name="Vazão Média (L/min)" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
            <Area type="monotone" dataKey="vazao_maxima_lpm" name="Vazão Máxima (L/min)" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      ) : <p>Carregando dados históricos ou nenhum dado disponível...</p>}
    </div>
  );
}

export default DashboardHistorico;