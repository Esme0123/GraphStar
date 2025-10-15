export function getMergeSortAnimations(array, direction) {
    const animations = [];
    if (array.length <= 1) return array;
    const auxiliaryArray = array.slice();
    mergeSortHelper(array, 0, array.length - 1, auxiliaryArray, animations, direction);
    return animations;
}

function mergeSortHelper(mainArray, startIdx, endIdx, auxiliaryArray, animations, direction) {
    if (startIdx === endIdx) return;
    const middleIdx = Math.floor((startIdx + endIdx) / 2);
    mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray, animations, direction);
    mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray, animations, direction);
    doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations, direction);
}

function doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations, direction) {
    let k = startIdx;
    let i = startIdx;
    let j = middleIdx + 1;
    while (i <= middleIdx && j <= endIdx) {
        animations.push(['comparison', i, j]);
        const condition = direction === 'asc' ? auxiliaryArray[i] <= auxiliaryArray[j] : auxiliaryArray[i] >= auxiliaryArray[j];
        if (condition) {
            animations.push(['overwrite', k, auxiliaryArray[i]]);
            mainArray[k++] = auxiliaryArray[i++];
        } else {
            animations.push(['overwrite', k, auxiliaryArray[j]]);
            mainArray[k++] = auxiliaryArray[j++];
        }
    }
    while (i <= middleIdx) {
        animations.push(['overwrite', k, auxiliaryArray[i]]);
        mainArray[k++] = auxiliaryArray[i++];
    }
    while (j <= endIdx) {
        animations.push(['overwrite', k, auxiliaryArray[j]]);
        mainArray[k++] = auxiliaryArray[j++];
    }
}