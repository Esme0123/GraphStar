const EPSILON = 1e-9;
const MAX_ITERACIONES = 50;

const claveCelda = (fila, columna) => `${fila},${columna}`;

const clonarMatriz = (matriz) => matriz.map((fila) => fila.slice());

const normalizarNumero = (valor, fallback = 0) => {
  const numero = Number(valor);
  if (Number.isFinite(numero)) {
    return numero;
  }
  return fallback;
};

const crearVerificadorBasico = (conjuntoBasicas, conjuntoArtificiales, celdaExtra) => {
  const claveExtra = celdaExtra ? claveCelda(celdaExtra.fila, celdaExtra.columna) : null;
  return (fila, columna) => {
    const clave = claveCelda(fila, columna);
    if (claveExtra && clave === claveExtra) {
      return true;
    }
    return conjuntoBasicas.has(clave) || conjuntoArtificiales.has(clave);
  };
};

const asegurarNoDegenerado = (asignacion, basicas, artificiales) => {
  const filas = asignacion.length;
  const columnas = asignacion[0].length;
  const requerido = filas + columnas - 1;

  let actuales = basicas.size + artificiales.size;
  if (actuales >= requerido) {
    return;
  }

  for (let fila = 0; fila < filas && actuales < requerido; fila += 1) {
    for (let columna = 0; columna < columnas && actuales < requerido; columna += 1) {
      const clave = claveCelda(fila, columna);
      if (basicas.has(clave) || artificiales.has(clave)) {
        continue;
      }
      artificiales.add(clave);
      actuales += 1;
    }
  }
};

const balancearProblema = (costos, oferta, demanda) => {
  const matrizBalanceada = costos.map((fila) => fila.slice());
  const matrizOriginalBalanceada = costos.map((fila) => fila.slice());
  const ofertaBalanceada = oferta.slice();
  const demandaBalanceada = demanda.slice();

  const totalOferta = ofertaBalanceada.reduce((acc, valor) => acc + valor, 0);
  const totalDemanda = demandaBalanceada.reduce((acc, valor) => acc + valor, 0);

  const balanceo = {
    estaBalanceado: totalOferta === totalDemanda,
    dummyTipo: null,
    dummyFilaIndice: null,
    dummyFilaValor: null,
    dummyColumnaIndice: null,
    dummyColumnaValor: null,
    ofertaOriginal: oferta.slice(),
    demandaOriginal: demanda.slice(),
    ofertaBalanceada,
    demandaBalanceada,
    sumaOfertaOriginal: totalOferta,
    sumaDemandaOriginal: totalDemanda,
    matrizCostosOriginalBalanceada: matrizOriginalBalanceada,
  };

  if (totalOferta > totalDemanda) {
    const diferencia = totalOferta - totalDemanda;
    for (let fila = 0; fila < matrizBalanceada.length; fila += 1) {
      matrizBalanceada[fila].push(0);
      matrizOriginalBalanceada[fila].push(0);
    }
    demandaBalanceada.push(diferencia);
    balanceo.dummyTipo = 'demanda';
    balanceo.dummyColumnaIndice = matrizBalanceada[0].length - 1;
    balanceo.dummyColumnaValor = diferencia;
  } else if (totalDemanda > totalOferta) {
    const diferencia = totalDemanda - totalOferta;
    const columnas = matrizBalanceada[0].length;
    const nuevaFila = new Array(columnas).fill(0);
    matrizBalanceada.push(nuevaFila.slice());
    matrizOriginalBalanceada.push(nuevaFila.slice());
    ofertaBalanceada.push(diferencia);
    balanceo.dummyTipo = 'oferta';
    balanceo.dummyFilaIndice = matrizBalanceada.length - 1;
    balanceo.dummyFilaValor = diferencia;
  }

  return {
    matrizCostos: matrizBalanceada,
    ofertaBalanceada,
    demandaBalanceada,
    balanceo,
  };
};

const esquinaNoroeste = (oferta, demanda) => {
  const filas = oferta.length;
  const columnas = demanda.length;
  const asignacion = Array.from({ length: filas }, () => Array(columnas).fill(0));
  const ofertaPendiente = oferta.slice();
  const demandaPendiente = demanda.slice();
  const basicas = new Set();

  let fila = 0;
  let columna = 0;

  while (fila < filas && columna < columnas) {
    const asignar = Math.min(ofertaPendiente[fila], demandaPendiente[columna]);
    asignacion[fila][columna] = asignar;
    if (asignar > 0) {
      basicas.add(claveCelda(fila, columna));
    }
    ofertaPendiente[fila] -= asignar;
    demandaPendiente[columna] -= asignar;

    const ofertaSatisfecha = ofertaPendiente[fila] <= EPSILON;
    const demandaSatisfecha = demandaPendiente[columna] <= EPSILON;

    if (ofertaSatisfecha && demandaSatisfecha) {
      if (fila < filas - 1) {
        fila += 1;
      } else if (columna < columnas - 1) {
        columna += 1;
      } else {
        break;
      }
    } else if (ofertaSatisfecha) {
      fila += 1;
    } else if (demandaSatisfecha) {
      columna += 1;
    } else {
      // Las condiciones deberían cubrir todos los casos; rompemos por seguridad.
      break;
    }
  }

  return { asignacion, basicas };
};

const calcularPotenciales = (costos, basicas, artificiales) => {
  const filas = costos.length;
  const columnas = costos[0].length;
  const u = Array(filas).fill(null);
  const v = Array(columnas).fill(null);

  u[0] = 0;
  const esBasica = crearVerificadorBasico(basicas, artificiales);

  let actualizado = true;
  let guard = 0;

  while (actualizado && guard < filas * columnas * 2) {
    actualizado = false;
    guard += 1;

    for (let fila = 0; fila < filas; fila += 1) {
      for (let columna = 0; columna < columnas; columna += 1) {
        if (!esBasica(fila, columna)) {
          continue;
        }
        if (u[fila] !== null && v[columna] === null) {
          v[columna] = costos[fila][columna] - u[fila];
          actualizado = true;
        } else if (u[fila] === null && v[columna] !== null) {
          u[fila] = costos[fila][columna] - v[columna];
          actualizado = true;
        }
      }
    }
  }

  for (let fila = 0; fila < filas; fila += 1) {
    if (u[fila] === null) {
      u[fila] = 0;
    }
  }
  for (let columna = 0; columna < columnas; columna += 1) {
    if (v[columna] === null) {
      v[columna] = 0;
    }
  }

  return { u, v };
};

const calcularCostosReducidos = (costos, u, v, basicas, artificiales) => {
  const filas = costos.length;
  const columnas = costos[0].length;
  const delta = Array.from({ length: filas }, () => Array(columnas).fill(0));
  const esBasica = crearVerificadorBasico(basicas, artificiales);

  let mejorDelta = 0;
  let candidata = null;

  for (let fila = 0; fila < filas; fila += 1) {
    for (let columna = 0; columna < columnas; columna += 1) {
      if (esBasica(fila, columna)) {
        delta[fila][columna] = 'Básica';
        continue;
      }
      const valor = costos[fila][columna] - (u[fila] + v[columna]);
      const valorRedondeado = Number(valor.toFixed(4));
      delta[fila][columna] = valorRedondeado;
      if (valor < mejorDelta - EPSILON) {
        mejorDelta = valor;
        candidata = { fila, columna };
      }
    }
  }

  return { delta, candidata };
};

const contieneCelda = (ruta, fila, columna) => {
  return ruta.some((celda) => celda.fila === fila && celda.columna === columna);
};

const construirCiclo = (asignacion, basicas, artificiales, inicio) => {
  const filas = asignacion.length;
  const columnas = asignacion[0].length;
  const esBasica = crearVerificadorBasico(basicas, artificiales, inicio);
  const visitados = new Set();

  const explorar = (ruta, moverPorFila) => {
    const actual = ruta[ruta.length - 1];
    const claveVisitado = `${actual.fila}-${actual.columna}-${moverPorFila ? 'fila' : 'columna'}`;
    if (visitados.has(claveVisitado)) {
      return null;
    }
    visitados.add(claveVisitado);

    if (moverPorFila) {
      for (let columna = 0; columna < columnas; columna += 1) {
        if (columna === actual.columna) {
          continue;
        }
        if (!esBasica(actual.fila, columna)) {
          continue;
        }
        const siguiente = { fila: actual.fila, columna };
        const esInicio = siguiente.fila === inicio.fila && siguiente.columna === inicio.columna;
        if (esInicio && ruta.length >= 3) {
          return ruta.concat([siguiente]);
        }
        if (!contieneCelda(ruta, siguiente.fila, siguiente.columna)) {
          const resultado = explorar(ruta.concat([siguiente]), false);
          if (resultado) {
            return resultado;
          }
        }
      }
    } else {
      for (let fila = 0; fila < filas; fila += 1) {
        if (fila === actual.fila) {
          continue;
        }
        if (!esBasica(fila, actual.columna)) {
          continue;
        }
        const siguiente = { fila, columna: actual.columna };
        const esInicio = siguiente.fila === inicio.fila && siguiente.columna === inicio.columna;
        if (esInicio && ruta.length >= 3) {
          return ruta.concat([siguiente]);
        }
        if (!contieneCelda(ruta, siguiente.fila, siguiente.columna)) {
          const resultado = explorar(ruta.concat([siguiente]), true);
          if (resultado) {
            return resultado;
          }
        }
      }
    }

    return null;
  };

  return explorar([inicio], true) || explorar([inicio], false);
};

const recortarMatriz = (matriz, balanceo) => {
  let resultado = matriz.map((fila) => fila.slice());
  if (balanceo.dummyFilaIndice !== null) {
    resultado = resultado.filter((_, indice) => indice !== balanceo.dummyFilaIndice);
  }
  if (balanceo.dummyColumnaIndice !== null) {
    resultado = resultado.map((fila) => fila.filter((_, indice) => indice !== balanceo.dummyColumnaIndice));
  }
  return resultado;
};

const recortarCoordenada = (coordenada, balanceo) => {
  if (!coordenada) {
    return null;
  }
  let { fila, columna } = coordenada;
  if (balanceo.dummyFilaIndice !== null) {
    if (fila === balanceo.dummyFilaIndice) {
      return null;
    }
    if (fila > balanceo.dummyFilaIndice) {
      fila -= 1;
    }
  }
  if (balanceo.dummyColumnaIndice !== null) {
    if (columna === balanceo.dummyColumnaIndice) {
      return null;
    }
    if (columna > balanceo.dummyColumnaIndice) {
      columna -= 1;
    }
  }
  return { fila, columna };
};

const calcularCostoTotal = (asignacion, costos) => {
  let total = 0;
  for (let fila = 0; fila < asignacion.length; fila += 1) {
    for (let columna = 0; columna < asignacion[0].length; columna += 1) {
      total += asignacion[fila][columna] * costos[fila][columna];
    }
  }
  return total;
};

export const calcularSolucionOptima = (datos) => {
  const { matrizCostos, oferta, demanda, tipoProblema = 'Minimizar' } = datos;

  if (!Array.isArray(matrizCostos) || matrizCostos.length === 0) {
    throw new Error('La matriz de costos no puede estar vacía.');
  }
  if (!Array.isArray(oferta) || oferta.length !== matrizCostos.length) {
    throw new Error('La oferta debe tener tantas entradas como filas en la matriz de costos.');
  }
  if (!Array.isArray(demanda) || demanda.length !== matrizCostos[0].length) {
    throw new Error('La demanda debe tener tantas entradas como columnas en la matriz de costos.');
  }
  const costosNormalizados = matrizCostos.map((fila) => fila.map((valor) => normalizarNumero(valor, 0)));
  const ofertaNormalizada = oferta.map((valor) => {
    const numero = normalizarNumero(valor, 0);
    if (numero < 0) {
      throw new Error('Los valores de oferta no pueden ser negativos.');
    }
    return numero;
  });
  const demandaNormalizada = demanda.map((valor) => {
    const numero = normalizarNumero(valor, 0);
    if (numero < 0) {
      throw new Error('Los valores de demanda no pueden ser negativos.');
    }
    return numero;
  });

  const { matrizCostos: costosBalanceados, ofertaBalanceada, demandaBalanceada, balanceo } = balancearProblema(
    costosNormalizados,
    ofertaNormalizada,
    demandaNormalizada,
  );

  let costosTrabajo = clonarMatriz(costosBalanceados);
  const costosOriginalesParaTotal = clonarMatriz(balanceo.matrizCostosOriginalBalanceada);
  const esMaximizacion = tipoProblema === 'Maximizar';
  if (esMaximizacion) {
    const valores = costosTrabajo.flat();
    const maximo = Math.max(...valores);
    costosTrabajo = costosTrabajo.map((fila) => fila.map((valor) => maximo - valor));
    balanceo.transformacion = {
      tipo: 'Maximizar',
      referencia: maximo,
    };
  } else {
    balanceo.transformacion = {
      tipo: 'Minimizar',
    };
  }

  const { asignacion, basicas } = esquinaNoroeste(ofertaBalanceada, demandaBalanceada);
  const artificiales = new Set();
  asegurarNoDegenerado(asignacion, basicas, artificiales);

  const procesoIteraciones = [];
  let paso = 1;
  let iteracionesSinCambio = 0;

  while (paso <= MAX_ITERACIONES) {
    const { u, v } = calcularPotenciales(costosTrabajo, basicas, artificiales);
    const { delta, candidata } = calcularCostosReducidos(costosTrabajo, u, v, basicas, artificiales);

    procesoIteraciones.push({
      paso,
      matrizAsignacion: clonarMatriz(asignacion),
      costosReducidos: delta,
      variableEntrante: candidata ? { fila: candidata.fila, columna: candidata.columna } : null,
    });

    if (!candidata) {
      break;
    }

    const ciclo = construirCiclo(asignacion, basicas, artificiales, candidata);
    if (!ciclo || ciclo.length < 4) {
      console.warn('No se pudo construir un ciclo válido para la variable entrante.');
      break;
    }

    const recorrido = ciclo.slice(0, -1);
    let theta = Infinity;
    for (let indice = 1; indice < recorrido.length; indice += 2) {
      const celda = recorrido[indice];
      const valor = asignacion[celda.fila][celda.columna];
      if (valor < theta) {
        theta = valor;
      }
    }

    if (!Number.isFinite(theta) || theta <= EPSILON) {
      iteracionesSinCambio += 1;
      if (iteracionesSinCambio >= 2) {
        console.warn('Se detectó degeneración persistente en el algoritmo MODI.');
        break;
      }
      theta = 0;
    } else {
      iteracionesSinCambio = 0;
    }

    for (let indice = 0; indice < recorrido.length; indice += 1) {
      const celda = recorrido[indice];
      const clave = claveCelda(celda.fila, celda.columna);
      if (indice % 2 === 0) {
        asignacion[celda.fila][celda.columna] += theta;
        if (asignacion[celda.fila][celda.columna] > EPSILON) {
          basicas.add(clave);
          artificiales.delete(clave);
        }
      } else {
        asignacion[celda.fila][celda.columna] -= theta;
        if (asignacion[celda.fila][celda.columna] <= EPSILON) {
          asignacion[celda.fila][celda.columna] = 0;
          basicas.delete(clave);
          artificiales.delete(clave);
        }
      }
    }

    const claveEntrante = claveCelda(candidata.fila, candidata.columna);
    if (asignacion[candidata.fila][candidata.columna] > EPSILON) {
      basicas.add(claveEntrante);
      artificiales.delete(claveEntrante);
    } else {
      artificiales.add(claveEntrante);
    }

    asegurarNoDegenerado(asignacion, basicas, artificiales);
    paso += 1;
  }

  const matrizAsignacionBalanceada = clonarMatriz(asignacion);
  const matrizAsignacionRecortada = recortarMatriz(matrizAsignacionBalanceada, balanceo);
  const costoTotalOptimo = Number(calcularCostoTotal(matrizAsignacionBalanceada, costosOriginalesParaTotal).toFixed(4));

  const procesoRecortado = procesoIteraciones.map((iteracion) => ({
    paso: iteracion.paso,
    matrizAsignacion: recortarMatriz(iteracion.matrizAsignacion, balanceo),
    costosReducidos: recortarMatriz(iteracion.costosReducidos, balanceo),
    variableEntrante: recortarCoordenada(iteracion.variableEntrante, balanceo),
  }));

  return {
    costoTotalOptimo,
    matrizAsignacionOptima: matrizAsignacionRecortada,
    tipoProblema,
    procesoIteraciones: procesoRecortado,
    balanceo,
  };
};

export default calcularSolucionOptima;

