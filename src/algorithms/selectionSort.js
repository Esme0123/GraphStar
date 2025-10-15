export function getSelectionSortAnimations(array, direction) {
    const animations = [];
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        let min_idx = i;
        for (let j = i + 1; j < n; j++) {
            animations.push(['comparison', min_idx, j]);
            const condition = direction === 'asc' ? array[j] < array[min_idx] : array[j] > array[min_idx];
            if (condition) {
                min_idx = j;
            }
        }
        animations.push(['swap', i, min_idx]);
        [array[i], array[min_idx]] = [array[min_idx], array[i]];
    }
    return animations;
}