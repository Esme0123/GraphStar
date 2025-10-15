// Esta función no devuelve el array ordenado, sino una lista de animaciones
// que nuestra interfaz puede interpretar paso a paso.
export function getInsertionSortAnimations(array, direction) {
    const animations = [];
    const n = array.length;
    for (let i = 1; i < n; i++) {
        let key = array[i];
        let j = i - 1;
        
        // Condición de comparación basada en la dirección
        const condition = (a, b) => direction === 'asc' ? a > b : a < b;

        animations.push(['comparison', j, i]); // Compara j e i
        
        while (j >= 0 && condition(array[j], key)) {
            animations.push(['swap', j, j + 1]); // Anima el intercambio
            array[j + 1] = array[j];
            j = j - 1;
            if (j >= 0) {
              animations.push(['comparison', j, i]); // Siguiente comparación
            }
        }
        animations.push(['place', j + 1, key]); // Coloca la llave en su lugar
        array[j + 1] = key;
    }
    return animations;
}