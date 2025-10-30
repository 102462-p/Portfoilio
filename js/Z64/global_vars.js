let game_rom = [];
let RAM = []; //4000000 Bytes

const header_size = 64;
let entry_point = null;
let game_title = '';

let PC = 0;
let HALT = 0;

const M_WORD = 32;
const M_SHORT = 16;
const M_CHAR = 8;
