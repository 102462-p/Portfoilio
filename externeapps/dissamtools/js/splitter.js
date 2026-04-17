let romBuffer = null;
let yamlConfig = null;

document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(button.dataset.tab).classList.add('active');
  });
});

window.onload = () => {
  const defaultYAML = `segments:
  - name: header
    type: bin
    start: 0x0

  - name: data
    type: data
    start: 0x8000

  - name: entry
    type: code
    vram: 0x800B1C5C
    start: 0x245C

  - end: 0x4000`;

  document.getElementById("yamlEditor").value = defaultYAML;
};

function loadCustomYAML() {
  const file = document.getElementById("yamlFile").files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById("yamlEditor").value = e.target.result;
  };
  reader.readAsText(file);
}

function processFiles() {
  const romInput = document.getElementById("romFile").files[0];
  if (!romBuffer) {
    alert("Please upload a ROM file.");
    return;
  }

  try {
    yamlConfig = jsyaml.load(document.getElementById("yamlEditor").value);
  } catch (e) {
    alert("Error parsing YAML: " + e.message);
    return;
  }

  const childs = document.getElementById("splitfiles").children;
  for(const child of childs){child.remove();}
  splitSegments();

  //const reader = new FileReader();
  //reader.onload = (e) => {
    //romBuffer = new Uint8Array(e.target.result);
    //splitSegments();
  //};
  //reader.readAsArrayBuffer(romInput);
}

function splitSegments() {
  const segments = yamlConfig.segments || [];
  const outputLog = [];
  const viewer = document.getElementById("fileViewer");
  viewer.innerHTML = '';

  let segment_starts = [];
  let i = 0;
  segments.forEach(seg => {
    segment_starts[i] = seg.start;
    i++;
    if(seg.end){segment_starts[i -1] = seg.end;return;}
  });
  console.log(segment_starts)

  i = 0;
  segments.forEach(seg => {
    const start = parseInt(seg.start);
    const end = parseInt(segment_starts[i +1]);
    const name = seg.name;
    const type = seg.type;
    i++;
    if(seg.end){return;}

    const segmentData = romBuffer.slice(start, end);
    const blob = new Blob([segmentData]);
    let filename = `${name}`;

    const encoder = new TextEncoder();

    if (type === "code") filename += ".s";
    else if (type === "rodata") filename += ".rodata.s";
    else if (type === "data") filename += ".data.s";
    else filename += ".bin";

    if ([".bin"].includes(filename.slice(-4))) {
      const file = segmentData;
      bytes = [filename, file, 'bin/'];
      message_handler.sendMsh(window.parent, 'fillFolder', [bytes, 'bin/']);
    }
    else if ([".data.s"].includes(filename.slice(-7))){
      console.log(new TextDecoder().decode(segmentData));
    }
    else if ([".s"].includes(filename.slice(-2))){
      const file = decodeASM(segmentData, seg.vram);
      bytes = [filename, encoder.encode(file), 'asm/'];
      message_handler.sendMsh(window.parent, 'fillFolder', [bytes, 'asm/']);
    } 
    else {
      console.log(new TextDecoder().decode(segmentData));
    }

    outputLog.push(`Extracted ${filename} [0x${start.toString(16)} - 0x${end.toString(16)}]`);
  });

  document.getElementById("outputLog").textContent = outputLog.join('\n');

  //displayRom();
}

function toHexDump(bytes, width = 16) {
  let result = "";
  for (let i = 0; i < bytes.length; i += width) {
    let row = bytes.slice(i, i + width);
    let hex = Array.from(row).map(b => b.toString(16).padStart(2, '0')).join(" ");
    let ascii = Array.from(row).map(b => b >= 32 && b <= 126 ? String.fromCharCode(b) : '.').join("");
    result += `${i.toString(16).padStart(8, '0')}: ${hex.padEnd(width * 3)} ${ascii}\n`;
  }
  return result;
}

function checkFolders(folderName){
  for(let i = 0; i < loaded_folders.length; i++){
    if(folderName == loaded_folders[i][0]){
      return 1;
    }
  }
  return 0;
}

function displayRom(){
  const viewer = document.getElementById("romfileViewer");
  viewer.innerHTML = '';
  viewer.textContent = toHexDump(romBuffer);
}

let loaded_folders = [];
message_handler.handleMsg({
  getInputRom: (file) => {
    romBuffer = file[1];
    document.getElementById('fileName').innerHTML = `Loaded file: ${file[0]}`;
    message_handler.sendMsh(window.parent, 'Searchfolders', ['bin_splitfr']);
  },
  getFolders: (folders) => {
    loaded_folders = folders;
    let check = checkFolders('asm');
    if(!check){
      message_handler.sendMsh(window.parent, 'createFolder', ['asm', '']);
    }
    check = checkFolders('bin');
    if(!check){
      message_handler.sendMsh(window.parent, 'createFolder', ['bin', '']);
    }
  }
});

let isa_sheet = null;
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
    if(instruction == undefined || instruction == NaN) {console.error(`Instruction ${instruction} does not exist.`);return;}
    let result = null;

    let recomp = construct_inst(instruction);
    result = recomp;

    return result;
}

function decodeASM(data, vram){
  const file = data;

  //console.log(isa_sheet);
  //console.log(file)
  let adrs = 0;
  let asm_file = '.include ""\n.include ""\n\n.set noat\n.set noreorder\n.set gp=64\n\n.section .test, "ax\n\n';

  asm_file += `glabel func_${(adrs + vram).toString(16).padStart(8, '0')}\n`;
  for(let i = 0; i < (file.length) / 4; i++){
    const offset = i * 4;
    let curinstruction = '';
    for(let j = 3; j >= 0; j--){
      curinstruction += file[offset +j].toString(16).padStart(2, '0');
    }
    let asm = Decompile(curinstruction);
    asm_file += `    //${adrs.toString(16).padStart(8, '0')} ${(adrs + vram).toString(16).padStart(8, '0')} ${curinstruction}// ${asm}\n`;

    adrs += 4;
  }
  
  return asm_file;
}

async function get_json(){
  const response = await fetch('js/Mips_isa.json');
  isa_sheet = await response.json();
}
get_json();
