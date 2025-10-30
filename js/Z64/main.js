import { RunCPU, SetPC, DisplayRegisters, displayMemory } from './R4300i.js';
import { GetHeaderInfo, ReadDataBus, WriteDataBus } from './databus.js';
import { toUint32, ToInt } from './helperfuncs.js';

function EmulationLoop() {
    for(let i = 0; i < 1000; i++){
        RunCPU();
    }

    requestAnimationFrame(EmulationLoop);
}

function StartRom() {
    GetHeaderInfo();
    PC = 0xB0000000;
    console.log('Starting ROM...');
    const end_addres = toUint32((game_rom.length -1) * 16);
    console.log(end_addres);

    console.log('TITLE::' + game_title);
    console.log('ENTRY::' + entry_point);

    for(let i = 0; i < 1000000; i++){
        let ofst = 0x1000 + (i * 4);
        let bytes = [game_rom[ofst],game_rom[ofst +1],game_rom[ofst +2],game_rom[ofst +3]];
        WriteDataBus(0x80000400 + (i * 4), bytes, M_WORD);
    }

    SetPC(ToInt(entry_point));
    displayMemory(10, 0x80000400);

    EmulationLoop();
}

document.getElementById('refreshbtn').addEventListener('click', function(event) {
    DisplayRegisters('regs');
});

document.getElementById('searchMemorybtn').addEventListener('click', function(event) {
    const address = document.getElementById('memoryAddress').value;
    const length = document.getElementById('memoryLength').value;
    displayMemory(length, ToInt(address));
});

document.getElementById('rom_import').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if(file == null){return;}

    const reader = new FileReader();
    let rom = [];
    //counter = 0;

    document.getElementById('game_tile').innerHTML = 'ROM is loading please wait ...';

    reader.onload = function(e) {
        const buffer = new Uint8Array(e.target.result);
        const rom = [];
        let line = '';
        let counter = 0;

        for (let i = 0; i < buffer.length; i++) {
            line += buffer[i].toString(16).padStart(2, '0') + ' ';
        
            if ((i + 1) % 16 === 0) {
                rom[counter++] = line.trim();
                line = '';
            }
        }

        if (line) {
            rom[counter++] = line.trim();
        }

        //Decompile(rom);
        let offset = 0
        for(let i = 0; i < rom.length; i++){
            let bytes = rom[i].split(' ');
            for(let j = 0; j < bytes.length; j++){
                game_rom[offset++] = bytes[j];
            }
        }
        StartRom();
    };

    reader.readAsArrayBuffer(file);
});
