
function toUint32(value) {
    const unsigned = value >>> 0;
    return '0x' + unsigned.toString(16).padStart(8, '0');
}

function toUint16(value) {
    const unsigned = value >>> 0;
    return '0x' + unsigned.toString(16).padStart(4, '0');
}

function ToInt(hexStr) {
    if (hexStr.startsWith('0x')) {hexStr = hexStr.slice(2);}
    return parseInt(hexStr, 16);
}

function tobit(value) {
    const split = value.split('');
    let bits = '';
    for(let i = 0; i < split.length; i++) {
        let convb = '';
        switch(split[i]) {
            case '0':{convb = '0000';break;}
            case '1':{convb = '0001';break;}
            case '2':{convb = '0010';break;}
            case '3':{convb = '0011';break;}
            case '4':{convb = '0100';break;}
            case '5':{convb = '0101';break;}
            case '6':{convb = '0110';break;}
            case '7':{convb = '0111';break;}
            case '8':{convb = '1000';break;}
            case '9':{convb = '1001';break;}
            case 'a':{convb = '1010';break;}
            case 'b':{convb = '1011';break;}
            case 'c':{convb = '1100';break;}
            case 'd':{convb = '1101';break;}
            case 'e':{convb = '1110';break;}
            case 'f':{convb = '1111';break;}
            default:{convb = '0000';break}
        }
        bits += convb;
    }
    return bits;
}

export {toUint32, toUint16, ToInt, tobit};
