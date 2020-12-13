function string2number(str) {
    let number = 0;

    const map = {
        '0x': {
            number: '0123456789abcdef',
            power: 16,
        },
        '0o': {
            number: '01234567',
            power: 8,
        },
        '0b': {
            number: '01',
            power: 2,
        },
    };
    const _ = map[str.slice(0, 2)];

    for (let i = str.length - 1; i >= 2; i--) {
        const v = str[i];
        number += _.number.indexOf(v) * _.power ** (str.length - 1 - i);
    }

    return number;
}

const str = '0o10100001111';

console.log(
    string2number(str),
    Number(str),
);

function number2string(num, base) {
    if (num === 0) return '0';
    if (base === 10) return String(num);

    let str = '';
    let number = Math.abs(num);
    let sign = num > 0 ? '' : '-';

    const table = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'
    ]

    while (number > 0) {
        str = table[number % base] + str;

        number = parseInt(String(number / base));
    }

    return sign + str;
}


console.log(number2string(121212, 2));