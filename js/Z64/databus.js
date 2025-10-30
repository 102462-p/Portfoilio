import { ToInt, toUint32 } from './helperfuncs.js';

function ReadDataBus(address, mode){
    let data_result;

    if(address >= 0xB0000000 && address < 0xBFFFFFFF){
        data_result = get_bytes(game_rom, address - 0xB0000000);
    }
    else if(address >= 0x80000000 && address < 0x807FFFFF){
        data_result = get_bytes(RAM, address - 0x80000000);
    }
    return data_result;
}

function WriteDataBus(address, bytes, mode) {
    if(address >= 0xB0000000 && address < 0xBFFFFFFF){
        //data_result = get_bytes(game_rom, address - 0xB0000000);
    }
    else if(address >= 0x80000000 && address < 0x807FFFFF){
        //data_result = get_bytes(RAM, address - 0x80000000);
        write_bytes(RAM, address - 0x80000000, bytes, mode);
    }
    //displayMemory(1000, address);
}

function get_bytes(source, address, mode) {
    return source[address] + source[address +1] + source[address +2] + source[address +3];
}

function write_bytes(source, address, bytes, mode) {
    switch(mode){
        case M_WORD:{
            source[address] = bytes[0];
            source[address +1] = bytes[1];
            source[address +2] = bytes[2];
            source[address +3] = bytes[3];
            break;
        }
    }
}

function GetHeaderInfo(){
    let header = [];
    for(let i = 0; i < header_size; i++){
        header[i] = game_rom[i];
    }

    entry_point = header[8] + header[9] + header[10] + header[11];

    for(let i = 0x0; i < 0x14; i++){
        let offset = 0x20 + i;
        game_title += String.fromCharCode(ToInt(header[offset]));
    }

    document.getElementById('game_tile').innerHTML = game_title;
}

export {ReadDataBus, WriteDataBus, get_bytes, GetHeaderInfo};
