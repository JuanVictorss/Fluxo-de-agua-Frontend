import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function DashboardHistorico({ sessoes }) {
  const [idSessaoSelecionada, setIdSessaoSelecionada] = useState(null);
  const [sessaoAtiva, setSessaoAtiva] = useState(null);

  useEffect(() => {
    if (sessoes && sessoes.length > 0) {
      if (
        !idSessaoSelecionada ||
        !sessoes.find((s) => s.id === idSessaoSelecionada)
      ) {
        setIdSessaoSelecionada(sessoes[0].id);
      }
    }
  }, [sessoes]);

  useEffect(() => {
    if (idSessaoSelecionada) {
      const sessaoEncontrada = sessoes.find(
        (s) => s.id === idSessaoSelecionada
      );
      if (sessaoEncontrada) {
        const dadosGrafico = JSON.parse(sessaoEncontrada.pontos_grafico_vazao);
        setSessaoAtiva({
          ...sessaoEncontrada,
          dadosGrafico: dadosGrafico,
        });
      }
    }
  }, [idSessaoSelecionada, sessoes]);

  const handleDropdownChange = (evento) => {
    setIdSessaoSelecionada(Number(evento.target.value));
  };

  return (
    <div className="container-historico">
      <div className="cartao-sessoes">
        <h2>Histórico de Sessões</h2>

        {sessoes.length > 0 ? (
          <div className="container-dropdown">
            <label htmlFor="sessao-select">
              Selecione uma sessão para visualizar:
            </label>
            <select
              id="sessao-select"
              value={idSessaoSelecionada || ""}
              onChange={handleDropdownChange}
            >
              {/* MODIFICADO: O texto dentro da <option> agora é mais detalhado */}
              {sessoes.map((sessao) => {
                const dataFormatada = new Date(
                  sessao.data_hora_inicio
                ).toLocaleString("pt-BR");
                const textoOpcao = `Sessão de ${dataFormatada}  |  ${
                  sessao.duracao_segundos
                }s  |  ${sessao.volume_litros_sessao.toFixed(2)} L`;

                return (
                  <option key={sessao.id} value={sessao.id}>
                    {textoOpcao}
                  </option>
                );
              })}
            </select>
          </div>
        ) : (
          <p>Nenhum log salvo ainda.</p>
        )}
      </div>

      {sessaoAtiva && (
        <div className="cartao-grafico">
          <div className="cabecalho-grafico-historico">
            <h3>
              Sessão de{" "}
              {new Date(sessaoAtiva.data_hora_inicio).toLocaleString("pt-BR")}
            </h3>
            <div className="detalhes-sessao">
              <span>
                <strong>Duração:</strong> {sessaoAtiva.duracao_segundos}s
              </span>
              <span>
                <strong>Volume:</strong>{" "}
                {sessaoAtiva.volume_litros_sessao.toFixed(2)} L
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={sessaoAtiva.dadosGrafico}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="time" stroke="#aaa" />
              <YAxis stroke="#aaa" domain={[0, "dataMax + 1"]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#222",
                  border: "1px solid #444",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="vazao"
                name="Vazão (L/min)"
                stroke="#82ca9d"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default DashboardHistorico;
