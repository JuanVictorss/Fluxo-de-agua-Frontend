import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const URL_API_HORARIO_AGREGADO = "http://localhost:3001/api/historico/horario-agregado";

function DashboardHistorico() {
  const [dadosAgregados, setDadosAgregados] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarDadosAgregados = async () => {
      setCarregando(true);
      try {
        const response = await fetch(URL_API_HORARIO_AGREGADO);
        const data = await response.json();
        setDadosAgregados(data); 
      } catch (error) {
        console.error("Erro ao buscar dados agregados por hora:", error);
      }
      setCarregando(false);
    };
    buscarDadosAgregados();
  }, []); 

  return (
    <div className="container-historico">
      <div className="cartao-sessoes">
        <h2>Histórico de Consumo Agregado por Hora</h2>
        {carregando ? (
          <p>Carregando histórico...</p>
        ) : dadosAgregados.length > 0 ? (
          <div>
            {dadosAgregados.map((item, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <strong>Hora {item.hora}: </strong>
                <span style={{ color: '#82ca9d', fontWeight: 'bold' }}>
                  {item.volume_total_litros.toFixed(2)} Litros
                </span> | Vazão média: {item.vazao_media_lpm.toFixed(2)} L/min
              </div>
            ))}
          </div>
        ) : (
          <p>Nenhum registro histórico salvo.</p>
        )}
      </div>

      <div className="cartao-grafico">
        <h2>Gráfico de Vazão por Hora</h2>
        {carregando ? (
          <p>Carregando gráfico...</p>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={dadosAgregados} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="hora" stroke="#aaa" />
              <YAxis stroke="#aaa" domain={[0, 'dataMax + 2']} />
              <Tooltip contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }} />
              <Legend />
              <Line
                type="monotone"
                dataKey="vazao_media_lpm"
                name="Vazão Média (L/min)"
                stroke="#82ca9d"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="volume_total_litros"
                name="Volume Total (L)"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default DashboardHistorico;
