let loadedZip = null;
document.getElementById('exportBtn').disabled = false;

document.getElementById('zipFileInput').addEventListener('change', async function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(e) {
    const arrayBuffer = e.target.result;

    try {
        const zip = await JSZip.loadAsync(arrayBuffer);
        loadedZip = zip;

        //const fileListEl = document.getElementById('fileList');
        //fileListEl.innerHTML = '';
          
        zip.forEach(async (relativePath, file) => {
            //const li = document.createElement('li');
            //li.textContent = file.dir ? `[Folder] ${relativePath}` : relativePath;
            //fileListEl.appendChild(li);

         if(!file.dir){
                const blob = await file.async('uint8array');
                //const values = Array.from(blob).map(b => b.toString(16).padStart(2, '0'));
                //console.log(`file: ${relativePath}`, values);

                message_handler.sendMsh(window.parent, 'getFiles', [relativePath, blob, relativePath]);
            }
        });

        document.getElementById('exportBtn').disabled = false;

    } catch (err) {
        alert('Error reading zip file: ' + err);
    }
    };
    reader.readAsArrayBuffer(file);
});

document.getElementById('exportBtn').addEventListener('click', async () => {
    //if (!loadedZip) return;
    message_handler.sendMsh(window.parent, 'prepareFiles', '');
});

message_handler.handleMsg({
  getInputFiles: (files) => {
    const Zipname = document.getElementById('zipName').value;
    if(!Zipname){return;}

    const newZip = new JSZip();
    for(const [name, file, unk, path] of files){
        newZip.file(path + name, file);
    }

    const generateDownload = async () => {
        const blob = await newZip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = Zipname + '.zip';
        a.click();
        URL.revokeObjectURL(url);
    }

    generateDownload();
  }
});
