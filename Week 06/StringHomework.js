function UTF_8Encoding(str) {
    let buffer = [];
    for (let char of str) {
        // 获取unicode码点
        const codePoint = char.charCodeAt(0);
        // 1~8位用1个字节UTF-8表示（UTF-8中：除控制位外还剩8位）
        if (codePoint >= 0x0 && codePoint <= 0x7f) {
            // 单字节直接转换
            buffer.push(codePoint.toString(16))
        } else if (codePoint >= 0x80 && codePoint <= 0x7ff) {
            // 9~11位用2个字节表示（UTF-8中：除控制位外还剩12位）
            // 控制位
            let strBinary = codePoint.toString(2);
            let firstByte = "110";
            let secondByte = "10";
            // UTF-8中第二个字节：第二个字节后6位
            secondByte += strBinary.substring(strBinary.length - 6);
            strBinary = strBinary.substring(0, strBinary.length - 6);
            // UTF-8中第一个字节：第一个字节后3位+第二个字节前2位,高位补0
            if (strBinary.length < 5) {
                for (let i = 0; i < 5 - strBinary.length; i++) {
                    strBinary = "0" + strBinary;
                }
            }
            firstByte += strBinary;
            const finalBytes = firstByte + secondByte;
            buffer.push(parseInt(finalBytes, 2).toString(16));
        } else if (codePoint >= 0x800 && codePoint <= 0x7ffff) {
            // 12~16位用3个字节UTF-8表示(UTF-8中：除控制位外还剩16位)
            // 控制位
            let strBinary = codePoint.toString(2);
            let firstByte = "1110";
            let secondByte = "10";
            let thirdByte = "10";
            // UTF-8中第三个字节：第二个字节后6位
            thirdByte += strBinary.substring(strBinary.length - 6);
            strBinary = strBinary.substring(0, strBinary.length - 6);
            // UTF-8中第二个字节：第一个字节后4位+第二个字节前2位
            secondByte += strBinary.substring(strBinary.length - 6);
            strBinary = strBinary.substring(0, strBinary.length - 6);
            // UTF-8中第一个字节：第一个字节前4位,高位补0
            if (strBinary.length < 4) {
                for (let i = 0; i < 4 - strBinary.length; i++) {
                    strBinary = "0" + strBinary;
                }
            }
            firstByte += strBinary;
            const finalBytes = firstByte + secondByte + thirdByte;
            buffer.push(parseInt(finalBytes, 2).toString(16));
        } else {
            // 用4个字节UTF-8表示
            let strBinary = codePoint.toString(2);
            // 控制位
            let firstByte = "11110";
            let secondByte = "10";
            let thirdByte = "10";
            let fourthByte = "10";

            fourthByte += strBinary.substring(strBinary.length - 6);
            strBinary = strBinary.substring(0, strBinary.length - 6);

            thirdByte += strBinary.substring(strBinary.length - 6);
            strBinary = strBinary.substring(0, strBinary.length - 6);

            secondByte += strBinary.substring(strBinary.length - 6);
            strBinary = strBinary.substring(0, strBinary.length - 6);

            if (strBinary.length < 3) {
                for (let i = 0; i < 3 - strBinary.length; i++) {
                    strBinary = "0" + strBinary;
                }
            }
            firstByte += strBinary;
            const finalBytes = firstByte + secondByte + thirdByte + fourthByte;
            buffer.push(parseInt(finalBytes, 2).toString(16));
        }
    }
    return buffer;
}

console.log(UTF_8Encoding('一二三'))