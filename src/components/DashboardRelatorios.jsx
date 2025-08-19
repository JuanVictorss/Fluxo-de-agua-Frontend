import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const URL_API_DIARIO = "https://fluxo-de-agua-backend-production.up.railway.app/api/relatorio/diario";

function DashboardRelatorios() {
  const [dadosDiarios, setDadosDiarios] = useState([]);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const response = await fetch(URL_API_DIARIO);
        const data = await response.json();
        const dadosFormatados = data.map(item => ({
          ...item,
          dia: new Date(item.dia).toLocaleDateString('pt-BR', { weekday: 'short', timeZone: 'UTC' }),
          "Volume (L)": parseFloat(item.volume_total.toFixed(2))
        }));
        setDadosDiarios(dadosFormatados);
      } catch (error) {
        console.error("Erro ao buscar relatório diário:", error);
      }
    };
    buscarDados();
  }, []);

  return (
    <div className="cartao-grafico">
      <h2>Consumo Total Diário (Últimos 7 Dias)</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={dadosDiarios} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="dia" stroke="#aaa" />
          <YAxis stroke="#aaa" />
          <Tooltip contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }} />
          <Legend />
          <Bar dataKey="Volume (L)" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DashboardRelatorios;