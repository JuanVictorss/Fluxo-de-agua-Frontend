import React from 'react';

function StatusIndicator({ status }) {
  return (
    <div className="status-container">
      <span>Status do Dispositivo:</span>
      <div className={`status-luz ${status === 'online' ? 'online' : 'offline'}`}></div>
      <span className="status-texto">{status ? status.toUpperCase() : 'OFFLINE'}</span>
    </div>
  );
}

export default StatusIndicator;