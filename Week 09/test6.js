function findMax(largeList) {
    let max;
    if (!largeList.length) {
        return -1;
    }
    max = parseInt(largeList[0]);
    for (const str of largeList) {
        let cur = parseInt(str);
        if (cur > max) {
            max = cur;
        }
    }

    return max;
}

const largeList = [
    '1209121371023011',
    '1209121371023022',
    '1209121371023333',
    '1209121371023011',
    '1209121371023331',
    '1331213710230113',
    '21209121371023011',
    '10012137102301122',
    '00209121371023011',
    '03209121371023011'
]

const max = findMax(largeList)
console.log(max)