//const sectorSize = 2048;
const sectorSize = 2352;

document.getElementById('isoInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const arrayBuffer = await file.arrayBuffer();
  parseISO9660(arrayBuffer);
});

// Simple ISO9660 directory parser
function parseISO9660(buffer) {
  const view = new DataView(buffer);
  //const pvdStart = 16 * sectorSize;
  const pvdStart = 37656; //only for gex
  const rootDirEntryOffset = pvdStart + 156;

  const length = view.getUint8(rootDirEntryOffset);
  if (length === 0) {
    alert("No root directory found.");
    return;
  }
  searchFiles(rootDirEntryOffset, view, buffer, '');
}

function searchFiles(rootEntryOffset, view, buffer, rootname, inFolder){
  const rootExtent = view.getUint32(rootEntryOffset + 2, true) * sectorSize + 14;
  const rootSize = view.getUint32(rootEntryOffset + 10, true);

  let files_buffer = [];

  let offset = rootExtent + 58;
  const numEntries = Math.floor(rootSize / 34);
  for (let i = 0; i < numEntries; i++) {
    const length = view.getUint8(offset);
    if (length === 0) continue;

    if(offset + 34 > view.byteLength){return;}

    const fileNameLength = view.getUint8(offset + 32);
    let fileName = '';
    for (let j = 0; j < fileNameLength; j++) {
      fileName += String.fromCharCode(view.getUint8(offset + 33 + j));
    }

    const type = view.getUint8(offset + 25);
    const LBA = view.getUint32(offset + 2, true);
    const fileSize = view.getUint32(offset + 10, true);
    offset += length;

    if (fileName === '\u0000' || fileName === '\u0001') continue;

    if(type === 0){
      const finalName = fileName.replace(';1', '');
      if(!inFolder){
        createFile(finalName, LBA, fileSize, buffer, rootname);
      }
      else{
        files_buffer[files_buffer.length++] = finalName;
        files_buffer[files_buffer.length++] = new Uint8Array(getFileContents(LBA, fileSize, buffer));
        files_buffer[files_buffer.length++] = rootname;
      }
    }
    else if(type === 2){
      //createFile(fileName + "-FOLDER", LBA, fileSize, buffer);
      createDir(fileName, rootname);
      const files = searchFiles(offset - length, view, buffer, rootname + fileName + '/', true);
      message_handler.sendMsh(window.parent, 'fillFolder', [files, rootname + fileName + '/']);
    }
  }

  return files_buffer;
}

function createFile(fileName, lba, size, data, rootname){
  const file = new Uint8Array(getFileContents(lba, size, data));
  message_handler.sendMsh(window.parent, 'getFiles', [fileName, file, 'proj_file_names', rootname]);
}

function createDir(foldername, root){
  message_handler.sendMsh(window.parent, 'createFolder', [foldername, root]);
}

function getFileContents(lba, size, data){
  //console.log("AT: " + lba + " SIZE: " + size);
  const view = new Uint8Array(data);

  let address = lba * sectorSize;
  const slice = view.slice(address + 24, address + size);
  return slice.buffer;
}
