import React, { useState, useEffect } from 'react';

const URL_API = "https://fluxo-de-agua-backend-production.up.railway.app/api/config";

function PaginaConfiguracoes() {
  const [config, setConfig] = useState({ fator_calibracao: 7.5, intervalo_telemetria_s: 1 });
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    fetch(`${URL_API}/get`)
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error("Erro ao buscar config:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig(prevConfig => ({ ...prevConfig, [name]: Number(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('Enviando...');
    try {
      const response = await fetch(`${URL_API}/set`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (response.ok) {
        setMensagem('Configuração enviada com sucesso ao ESP32!');
      } else {
        setMensagem('Falha ao enviar configuração.');
      }
    } catch (error) {
      setMensagem('Erro de comunicação com o servidor.');
    }
    setTimeout(() => setMensagem(''), 3000);
  };

  return (
    <div className="cartao-config">
      <h2>Configurações do Dispositivo</h2>
      <p>Altere os valores abaixo e clique em salvar para enviá-los ao ESP32 via MQTT.</p>
      <form onSubmit={handleSubmit} className="form-config">
        <div className="form-grupo">
          <label htmlFor="fator_calibracao">Fator de Calibração</label>
          <input type="number" id="fator_calibracao" name="fator_calibracao" value={config.fator_calibracao} onChange={handleChange} step="0.1" />
        </div>
        <div className="form-grupo">
          <label htmlFor="intervalo_telemetria_s">Intervalo de Envio (segundos)</label>
          <input type="number" id="intervalo_telemetria_s" name="intervalo_telemetria_s" value={config.intervalo_telemetria_s} onChange={handleChange} min="1" />
        </div>
        <button type="submit" className="botao-salvar">Salvar e Enviar</button>
        {mensagem && <p className="mensagem-status">{mensagem}</p>}
      </form>
    </div>
  );
}

export default PaginaConfiguracoes;