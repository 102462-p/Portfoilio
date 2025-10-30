import { toUint32, toUint16, ToInt, tobit } from './helperfuncs.js';
import { ReadDataBus, GetHeaderInfo, WriteDataBus } from './databus.js';

const response = await fetch('../js/Z64/Mips_isa.json');
const isa_sheet = await response.json();

console.log(isa_sheet);

let registers = [{$zero:0, $at:0, $v0:0, $v1:0, $a0:0, $a1:0, 
                  $a2:0, $a3:0, $t0:0, $t1:0, $t2:0, $t3:0,
                  $t4:0, $t5:0, $t6:0, $t7:0, $t8:0, $t9:0,
                  $k0:0, $k1:0, $gp:0, $sp:0, $fp:0, $ra:0}];

let pipeline = {IF:0, ID:0, EX:0, MEM:0, WB:0};

let codelist = {};

function GetPC() {
    return toUint32(PC);
}
function SetPC(value) {
    PC = value;
}

function Add16(value) {
    return (value << 2)  & 0xFFFF;
}

function ToS16(value){
    return (value << 16) >> 16;
}

function ToRomSpace(value){
    let tmp = value.split('');
    tmp[0] = '0';
    let new_value = '0x' + tmp[0] + tmp[1] + tmp[2] + tmp[3] + tmp[4] + tmp[5] + tmp[6] + tmp[7];
    return new_value;
}

function GetRegister(name){
    return registers[0][name];
}

function SetRegister(name, value){
    registers[0][name] = value;
}

function DisplayRegisters(textSource){
    const textarea = document.getElementById(textSource);
    textarea.textContent = '';
    textarea.textContent += `PC: ${toUint32(PC)}\n`;
    for(const reg of Object.keys(registers[0])){
        textarea.textContent += `${reg}: ${toUint32(GetRegister(reg))}\n`;
    }
}

function displayMemory(mem_length, mem_offset) {
    const textarea = document.getElementById('MemoryContent');
    const asmarea = document.getElementById('asmCode');

    textarea.textContent = '';
    asmarea.textContent = '';

    for(let i = 0; i < mem_length; i++) {
        let offset = (i * 4) + mem_offset;
        textarea.textContent += `${toUint32(offset)}: 0x${ReadDataBus(offset, M_WORD)}\n`;
        asmarea.textContent += `${toUint32(offset)}: ${Decompile(ReadDataBus(offset, M_WORD))}\n`;
    }
}

function Fetch() {
    return ReadDataBus(PC);
}

function Execute(instruc) {
    //let segments = Decompile(instruc).split(',');
    let segments = instruc.split(',');
    //console.log(segments);
    switch(segments[0]){
        case 'lui':{
            SetRegister(segments[1], ToInt(segments[3]) << 16);
            break;
        }
        case 'addiu':{
            SetRegister(segments[1], GetRegister(segments[2]) + ToS16(ToInt(segments[3])));
            break;
        }
        case 'addi':{
            SetRegister(segments[1], GetRegister(segments[2]) + ToS16(ToInt(segments[3])));
            break;
        }
        case 'sw':{
            WriteDataBus(segments[2] + segments[3], segments[1], M_WORD);
            break;
        }
        case 'bne':{
            const newPC = toUint32(PC + Add16(ToInt(segments[3])) & 0xF000FFFF);
            if(GetRegister(segments[1]) != GetRegister(segments[2])){pipeline['WB'] = newPC;}
            break;
        }
        case 'jr':{
            pipeline['WB'] = toUint32(GetRegister(segments[2]));
            break;
        }
        case 'jal':{
            pipeline['WB'] = toUint32(((PC + 4) & 0xF0000000) | (ToInt(segments[1]) << 2));
            SetRegister('$ra', PC + 4);
            break;
        }
        default:{
            console.warn(`Opcode: ${segments[0]} at ${toUint32(PC)} is Not supported.`);
            console.log(segments);
            HALT = 1;
        }
    }
}

function RunCPU() {
    if(HALT == 1) {return;}

    if(pipeline['IF'] != 0){
        pipeline['ID'] = Decompile(pipeline['IF']);
        Execute(pipeline['ID']);
    }

    pipeline['IF'] = Fetch();
    PC += 4;

    if(pipeline['WB'] != 0){
        SetPC(ToInt(pipeline['WB']));
        pipeline['WB'] = 0;
    }

    //let cur_instruc = Fetch();
    //Execute(cur_instruc);
}

function construct_inst(instruction) {
    let inspl = tobit(instruction).split('');
    let opc = inspl[0] + inspl[1] + inspl[2] + inspl[3] + inspl[4] + inspl[5];
    let funct = inspl[26] + inspl[27] + inspl[28] + inspl[29] + inspl[30] + inspl[31];
    let rs = inspl[6] + inspl[7] + inspl[8] + inspl[9] + inspl[10];
    let rt = inspl[11] + inspl[12] + inspl[13] + inspl[14] + inspl[15];
    let rd = inspl[16] + inspl[17] + inspl[18] + inspl[19] + inspl[20];

    let address = toUint32(ToInt(instruction) & 0x03FFFFFF);
    let immediate = toUint16(ToInt(instruction) & 0xFFFF);

    let recomp;
    let I = false;

    const RegID = isa_sheet.Regs;
    const type = isa_sheet.EncodingTypes[opc];
    switch(type){
        case "R_type":recomp = isa_sheet.R_type[funct];break;
        case "Cop0":recomp = isa_sheet.Cop0[funct];break;
        case "Cop1":recomp = isa_sheet.Cop1[funct];break;
        default:recomp = isa_sheet.I_type[opc];I = true;break;
    }

    if(instruction == '00000000') {recomp = 'nop'}
    //else if(opc == '000000') {recomp = RtypeInsts[funct];}
    //else if(opc == '010001') {recomp = FpInsts[funct];}
    //else{recomp = ItypeInsts[opc]; I = true;}

    if(recomp == undefined || recomp == 'nop') {}
    else if(opc == '000010' || opc == '000011') {recomp += `,${address}`;}
    else if(I) {recomp += `,${RegID[rt]},${RegID[rs]},${immediate}`;}
    else {recomp += `,${RegID[rd]},${RegID[rs]},${RegID[rt]},`;}

    return recomp;
}

function Decompile(instruction) {
    let result = null;

    if(codelist[instruction]){return codelist[instruction];}
    //console.log(instruction);
    let recomp = construct_inst(instruction);
    result = recomp;
    //console.log(result);

    codelist[instruction] = result;
    return result;
}

export {RunCPU, SetPC, GetPC, GetRegister, DisplayRegisters, displayMemory};
