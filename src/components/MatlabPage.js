import React, { useRef, useState } from 'react';

const bufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
};

const MatlabPage = ({ onGoBack }) => {
  const [feedback, setFeedback] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null);
  const fileInputRef = useRef(null);

  const sendMatlabRequest = async ({ endpoint, body, method = 'POST', pendingMessage, successMessage }) => {
    setFeedback({ tone: 'info', message: pendingMessage || 'Enviando comando a MATLAB...' });
    setLoadingAction(endpoint);

    try {
      const response = await fetch(endpoint, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || 'No se pudo comunicar con MATLAB');
      }

      setFeedback({ tone: 'success', message: successMessage || payload.message || 'Comando enviado a MATLAB' });
    } catch (error) {
      setFeedback({ tone: 'error', message: error.message || 'No se pudo completar la accion' });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleOpenMatlab = () =>
    sendMatlabRequest({
      endpoint: '/abrir-matlab',
      method: 'GET',
      pendingMessage: 'Abriendo MATLAB...',
      successMessage: 'MATLAB se esta iniciando.',
    });

  const handleOpenFuzzy = () =>
    sendMatlabRequest({
      endpoint: '/abrir-matlab-fuzzy',
      method: 'GET',
      pendingMessage: 'Abriendo MATLAB con Fuzzy Logic...',
      successMessage: 'MATLAB Fuzzy se esta iniciando.',
    });

  const handleFisSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setFeedback({ tone: 'info', message: `Cargando ${file.name}...` });
    setLoadingAction('open-fis');

    try {
      const buffer = await file.arrayBuffer();
      const data = bufferToBase64(buffer);

      await sendMatlabRequest({
        endpoint: '/abrir-fis',
        method: 'POST',
        body: { name: file.name, data },
        pendingMessage: `Enviando ${file.name} a MATLAB Fuzzy...`,
        successMessage: `${file.name} se abrio en MATLAB Fuzzy.`,
      });
    } finally {
      setLoadingAction(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="matlab-page">
      <button
        className="matlab-help-button"
        onClick={() => window.open('/manuals/Matlab_Manual.html', '_blank')}
        aria-label="Abrir manual de usuario MATLAB"
      >
        ?
      </button>
      <div className="matlab-card">
        <div className="matlab-card-header">
          <div>
            <h1>Panel MATLAB</h1>
            <p className="matlab-lead">
              Lanza MATLAB directamente desde GraphStar o abre diseños de logica difusa (.fis) en el disenador Fuzzy.
            </p>
          </div>
          <button className="matlab-back-btn" onClick={onGoBack}>Regresar</button>
        </div>

        <div className="matlab-video">
          <div className="matlab-video-frame">
            <iframe
              title="Tutorial MATLAB"
              src="https://www.youtube.com/embed/ErGFY2SdtZ0"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
          <p className="matlab-video-caption">Tutorial rapido para esta seccion.</p>
        </div>

        <div className="matlab-actions">
          <button onClick={handleOpenMatlab} disabled={!!loadingAction}>
            Abrir MATLAB
          </button>
          <button onClick={handleOpenFuzzy} disabled={!!loadingAction}>
            Abrir MATLAB con Fuzzy
          </button>
          <button onClick={() => fileInputRef.current?.click()} disabled={!!loadingAction}>
            Abrir archivo .fis en Fuzzy
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".fis"
            style={{ display: 'none' }}
            onChange={handleFisSelect}
          />
        </div>

        {feedback && (
          <div className={`matlab-feedback matlab-${feedback.tone}`}>
            {loadingAction && <span className="matlab-spinner" aria-hidden="true"></span>}
            <span>{feedback.message}</span>
          </div>
        )}
      </div>

      <div className="welcome-nav bottom-right">
        <button onClick={onGoBack}>Retroceder</button>
      </div>
    </div>
  );
};

export default MatlabPage;
