import { useState, useMemo, useCallback } from 'react';
import calcularSolucionOptima from '../algorithms/transporte';

const FILAS_INICIALES = 3;
const COLUMNAS_INICIALES = 3;

const crearMatrizCeros = (filas, columnas) =>
  Array.from({ length: filas }, () => Array(columnas).fill(0));

const normalizarEntrada = (valor) => {
  const numero = Number(valor);
  if (Number.isFinite(numero)) {
    return numero;
  }
  return 0;
};

const totalizar = (valores) =>
  valores.reduce((acumulado, valor) => acumulado + normalizarEntrada(valor), 0);

const construirCSV = (matriz, oferta, demanda, tipoProblema) => {
  if (!Array.isArray(matriz) || matriz.length === 0) {
    return '';
  }
  const columnas = matriz[0].length;
  const encabezado = [
    '',
    ...Array.from({ length: columnas }, (_, indice) => `Origen ${indice + 1}`),
    'Oferta',
  ];
  const lineas = [encabezado.join(',')];

  matriz.forEach((filaCostos, indiceFila) => {
    const fila = [
      `Destino ${indiceFila + 1}`,
      ...filaCostos.map((valor) => normalizarEntrada(valor)),
      normalizarEntrada(oferta[indiceFila]),
    ];
    lineas.push(fila.join(','));
  });

  const filaDemanda = [
    'Demanda',
    ...demanda.map((valor) => normalizarEntrada(valor)),
    tipoProblema,
  ];
  lineas.push(filaDemanda.join(','));

  return lineas.join('\n');
};

const parsearCSV = (textoPlano) => {
  const lineas = textoPlano
    .split(/\r?\n/)
    .map((linea) => linea.trim())
    .filter((linea) => linea.length > 0);

  if (lineas.length < 2) {
    throw new Error('El archivo CSV no contiene información suficiente.');
  }

  const separar = (linea) => linea.split(/[,;\t]/).map((parte) => parte.trim());
  const encabezado = separar(lineas[0]);
  if (encabezado.length < 3) {
    throw new Error('Encabezado CSV inválido.');
  }

  const columnas = encabezado.length - 2;
  const filas = lineas.length - 1;

  const matrizCostos = [];
  const oferta = [];

  for (let indiceFila = 1; indiceFila < filas; indiceFila += 1) {
    const partes = separar(lineas[indiceFila]);
    if (partes.length !== encabezado.length) {
      throw new Error('Las filas del CSV tienen un número inconsistente de columnas.');
    }
    const costos = partes.slice(1, 1 + columnas).map(normalizarEntrada);
    matrizCostos.push(costos);
    oferta.push(normalizarEntrada(partes[partes.length - 1]));
  }

  const filaDemanda = separar(lineas[lineas.length - 1]);
  if (filaDemanda.length < columnas + 1) {
    throw new Error('La fila de demanda está incompleta.');
  }
  const demanda = filaDemanda.slice(1, 1 + columnas).map(normalizarEntrada);

  let tipoProblema = 'Minimizar';
  const posibleTipo = filaDemanda[filaDemanda.length - 1];
  if (posibleTipo) {
    const texto = posibleTipo.toLowerCase();
    if (texto.startsWith('max')) {
      tipoProblema = 'Maximizar';
    } else if (texto.startsWith('min')) {
      tipoProblema = 'Minimizar';
    }
  }

  return { matrizCostos, oferta, demanda, tipoProblema };
};

const descargarArchivo = (contenido, tipoMime, nombreArchivo) => {
  if (typeof window === 'undefined') {
    return;
  }
  const blob = new Blob([contenido], { type: tipoMime });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombreArchivo;
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  URL.revokeObjectURL(url);
};

const useTransporte = () => {
  const [matrizCostos, setMatrizCostos] = useState(() =>
    crearMatrizCeros(FILAS_INICIALES, COLUMNAS_INICIALES),
  );
  const [oferta, setOferta] = useState(() => Array(FILAS_INICIALES).fill(0));
  const [demanda, setDemanda] = useState(() => Array(COLUMNAS_INICIALES).fill(0));
  const [tipoProblema, setTipoProblema] = useState('Minimizar');
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  const filasActuales = matrizCostos.length;
  const columnasActuales = matrizCostos[0]?.length ?? 0;

  const invalidateResultado = useCallback(() => {
    setResultado(null);
    setError(null);
  }, []);

  const limpiarError = useCallback(() => {
    setError(null);
  }, []);

  const actualizarCosto = useCallback(
    (fila, columna, valor) => {
      const numero = normalizarEntrada(valor);
      setMatrizCostos((previo) =>
        previo.map((filaActual, indiceFila) =>
          indiceFila === fila
            ? filaActual.map((valorActual, indiceColumna) =>
                indiceColumna === columna ? numero : valorActual,
              )
            : filaActual,
        ),
      );
      invalidateResultado();
    },
    [invalidateResultado],
  );

  const actualizarOferta = useCallback(
    (indice, valor) => {
      const numero = normalizarEntrada(valor);
      setOferta((previo) =>
        previo.map((valorActual, idx) => (idx === indice ? numero : valorActual)),
      );
      invalidateResultado();
    },
    [invalidateResultado],
  );

  const actualizarDemanda = useCallback(
    (indice, valor) => {
      const numero = normalizarEntrada(valor);
      setDemanda((previo) =>
        previo.map((valorActual, idx) => (idx === indice ? numero : valorActual)),
      );
      invalidateResultado();
    },
    [invalidateResultado],
  );

  const agregarFila = useCallback(() => {
    const columnas = columnasActuales || 1;
    setMatrizCostos((previo) => [...previo, Array(columnas).fill(0)]);
    setOferta((previo) => [...previo, 0]);
    invalidateResultado();
  }, [columnasActuales, invalidateResultado]);

  const eliminarFila = useCallback(() => {
    if (filasActuales <= 1) {
      return;
    }
    setMatrizCostos((previo) => previo.slice(0, -1));
    setOferta((previo) => previo.slice(0, -1));
    invalidateResultado();
  }, [filasActuales, invalidateResultado]);

  const agregarColumna = useCallback(() => {
    setMatrizCostos((previo) => previo.map((fila) => [...fila, 0]));
    setDemanda((previo) => [...previo, 0]);
    invalidateResultado();
  }, [invalidateResultado]);

  const eliminarColumna = useCallback(() => {
    if (columnasActuales <= 1) {
      return;
    }
    setMatrizCostos((previo) => previo.map((fila) => fila.slice(0, -1)));
    setDemanda((previo) => previo.slice(0, -1));
    invalidateResultado();
  }, [columnasActuales, invalidateResultado]);

  const resetear = useCallback(() => {
    setMatrizCostos(crearMatrizCeros(FILAS_INICIALES, COLUMNAS_INICIALES));
    setOferta(Array(FILAS_INICIALES).fill(0));
    setDemanda(Array(COLUMNAS_INICIALES).fill(0));
    setTipoProblema('Minimizar');
    setResultado(null);
    setError(null);
  }, []);

  const cambiarTipoProblema = useCallback(
    (nuevoTipo) => {
      setTipoProblema((previo) => {
        const normalizado = nuevoTipo === 'Maximizar' ? 'Maximizar' : 'Minimizar';
        if (normalizado !== previo) {
          invalidateResultado();
        }
        return normalizado;
      });
    },
    [invalidateResultado],
  );

  const aplicarEstadoImportado = useCallback(
    ({ matrizCostos: nuevaMatriz, oferta: nuevaOferta, demanda: nuevaDemanda, tipoProblema: nuevoTipo }) => {
      if (!Array.isArray(nuevaMatriz) || nuevaMatriz.length === 0) {
        throw new Error('La matriz importada no es válida.');
      }
      if (!Array.isArray(nuevaOferta) || nuevaOferta.length !== nuevaMatriz.length) {
        throw new Error('El vector de oferta importado no coincide con la matriz.');
      }
      if (!Array.isArray(nuevaDemanda) || nuevaDemanda.length !== nuevaMatriz[0].length) {
        throw new Error('El vector de demanda importado no coincide con la matriz.');
      }
      setMatrizCostos(nuevaMatriz.map((fila) => fila.map(normalizarEntrada)));
      setOferta(nuevaOferta.map(normalizarEntrada));
      setDemanda(nuevaDemanda.map(normalizarEntrada));
      if (nuevoTipo === 'Maximizar' || nuevoTipo === 'Minimizar') {
        setTipoProblema(nuevoTipo);
      }
      invalidateResultado();
      setError(null);
    },
    [invalidateResultado],
  );

  const importarJSON = useCallback(
    (archivo) => {
      if (!archivo) {
        return;
      }
      const lector = new FileReader();
      lector.onload = ({ target }) => {
        try {
          const contenido = JSON.parse(target.result);
          aplicarEstadoImportado(contenido);
        } catch (err) {
          console.error(err);
          setError('No se pudo importar el archivo JSON.');
        }
      };
      lector.readAsText(archivo);
    },
    [aplicarEstadoImportado],
  );

  const importarCSV = useCallback(
    (archivo) => {
      if (!archivo) {
        return;
      }
      const lector = new FileReader();
      lector.onload = ({ target }) => {
        try {
          const datos = parsearCSV(target.result);
          aplicarEstadoImportado(datos);
        } catch (err) {
          console.error(err);
          setError('No se pudo importar el archivo CSV.');
        }
      };
      lector.readAsText(archivo);
    },
    [aplicarEstadoImportado],
  );

  const exportarJSON = useCallback(() => {
    const contenido = JSON.stringify(
      {
        matrizCostos,
        oferta,
        demanda,
        tipoProblema,
      },
      null,
      2,
    );
    descargarArchivo(contenido, 'application/json', 'problema-transporte.json');
  }, [matrizCostos, oferta, demanda, tipoProblema]);

  const exportarCSV = useCallback(() => {
    const contenido = construirCSV(matrizCostos, oferta, demanda, tipoProblema);
    descargarArchivo(contenido, 'text/csv', 'problema-transporte.csv');
  }, [matrizCostos, oferta, demanda, tipoProblema]);

  const calcularSolucion = useCallback(() => {
    try {
      const solucion = calcularSolucionOptima({
        matrizCostos,
        oferta,
        demanda,
        tipoProblema,
      });
      setResultado(solucion);
      setError(null);
      return true;
    } catch (err) {
      console.error(err);
      setResultado(null);
      setError(err.message || 'No se pudo calcular la solución óptima.');
      return false;
    }
  }, [matrizCostos, oferta, demanda, tipoProblema]);

  const totalOferta = useMemo(() => totalizar(oferta), [oferta]);
  const totalDemanda = useMemo(() => totalizar(demanda), [demanda]);

  return {
    matrizCostos,
    oferta,
    demanda,
    tipoProblema,
    totalOferta,
    totalDemanda,
    resultado,
    error,
    limpiarError,
    actualizarCosto,
    actualizarOferta,
    actualizarDemanda,
    agregarFila,
    eliminarFila,
    agregarColumna,
    eliminarColumna,
    resetear,
    calcularSolucion,
    cambiarTipoProblema,
    importarJSON,
    importarCSV,
    exportarJSON,
    exportarCSV,
    puedeEliminarFila: filasActuales > 1,
    puedeEliminarColumna: columnasActuales > 1,
  };
};

export default useTransporte;
