export function getShellSortAnimations(array, direction) {
    const animations = [];
    const n = array.length;
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let i = gap; i < n; i += 1) {
            let temp = array[i];
            let j;
            const condition = (a, b) => direction === 'asc' ? a > b : a < b;
            for (j = i; j >= gap && condition(array[j - gap], temp); j -= gap) {
                animations.push(['comparison', j - gap, i]);
                animations.push(['overwrite', j, array[j - gap]]);
                array[j] = array[j - gap];
            }
            animations.push(['overwrite', j, temp]);
            array[j] = temp;
        }
    }
    return animations;
}