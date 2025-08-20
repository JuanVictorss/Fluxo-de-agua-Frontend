import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";

const MAXIMO_VAZAO = 30;

function DashboardTempoReal({ dadosMaisRecentes, dadosGrafico }) {
  const dadosMedidor = [
    {
      name: "Vazão",
      value: dadosMaisRecentes.flow_rate_lpm,
      fill: "#4dd0e1",
    },
  ];


  const volumeDaSessao = dadosMaisRecentes.total_liters || 0;
console.log(volumeDaSessao)
  return (
    <>
      <div className="container-cartoes">
        <div className="cartao-medidor">
          <h2>Vazão Atual</h2>
          <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart
              innerRadius="70%"
              outerRadius="100%"
              data={dadosMedidor}
              startAngle={180}
              endAngle={0}
              barSize={30}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, MAXIMO_VAZAO]}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar
                background
                dataKey="value"
                angleAxisId={0}
                cornerRadius={15}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="texto-medidor">
            <span className="valor-medidor">
              {dadosMaisRecentes.flow_rate_lpm.toFixed(2)}
            </span>
            <span className="unidade-medidor">L/min</span>
          </div>
        </div>

        <div className="cartao">
          <h2>Volume da Sessão Atual</h2>
          <p className="valor-dado">
            {}
            {volumeDaSessao.toFixed(2)} <span>Litros</span>
          </p>
        </div>
      </div>

      <div className="cartao-grafico">
        <h2>Atividade em Tempo Real</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={dadosGrafico}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="time" stroke="#aaa" />
            <YAxis stroke="#aaa" domain={[0, "dataMax + 2"]} />
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
              stroke="#4dd0e1"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

export default DashboardTempoReal;