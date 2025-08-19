import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const URL_API_SESSOES = "http://localhost:3001/api/historico/sessoes";

function DashboardHistorico() {
  const [listaSessoes, setListaSessoes] = useState([]);
  const [idSessaoSelecionada, setIdSessaoSelecionada] = useState(null);
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarListaSessoes = async () => {
      try {
        const response = await fetch(URL_API_SESSOES);
        const data = await response.json();
        setListaSessoes(data);
        if (data.length > 0) {
          setIdSessaoSelecionada(data[0].id);
        } else {
          setCarregando(false);
        }
      } catch (error) {
        console.error("Erro ao buscar lista de sessões:", error);
        setCarregando(false);
      }
    };
    buscarListaSessoes();
  }, []);

  useEffect(() => {
    if (!idSessaoSelecionada) return;

    const buscarDadosSessao = async () => {
      setCarregando(true);
      try {
        const response = await fetch(`${URL_API_SESSOES}/${idSessaoSelecionada}`);
        const data = await response.json();
        setDadosGrafico(JSON.parse(data.pontos_grafico_vazao));
      } catch (error) {
        console.error(`Erro ao buscar dados para a sessão ${idSessaoSelecionada}:`, error);
      }
      setCarregando(false);
    };
    buscarDadosSessao();
  }, [idSessaoSelecionada]);

  return (
    <div className="container-historico">
      <div className="cartao-sessoes">
        <h2>Histórico de Consumo por Hora</h2>
        {listaSessoes.length > 0 ? (
          <div className="container-dropdown">
            <label htmlFor="sessao-select">Selecione um período para visualizar:</label>
            <select
              id="sessao-select"
              value={idSessaoSelecionada || ''}
              onChange={(e) => setIdSessaoSelecionada(Number(e.target.value))}
            >
              {listaSessoes.map(sessao => (
                <option key={sessao.id} value={sessao.id}>
                  Registro de {new Date(sessao.timestamp_hora).toLocaleString('pt-BR')}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p>Nenhum registro histórico salvo.</p>
        )}
      </div>

      <div className="cartao-grafico">
        <h2>Gráfico Detalhado da Hora Selecionada</h2>
        {carregando ? <p>Carregando gráfico...</p> : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={dadosGrafico} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="time" stroke="#aaa" />
              <YAxis stroke="#aaa" domain={[0, 'dataMax + 2']} />
              <Tooltip contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }} />
              <Legend />
              <Line type="monotone" dataKey="vazao" name="Vazão (L/min)" stroke="#82ca9d" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default DashboardHistorico;