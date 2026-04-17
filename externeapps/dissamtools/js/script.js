
function formatAsHex(bytes, width = 16) {
  let result = "";
  let rendersize = bytes.length;
  if(bytes.length > 4000){rendersize = 4000;}

  for (let i = 0; i < rendersize; i += width) {
    let row = bytes.slice(i, i + width);
    let hex = Array.from(row).map(b => b.toString(16).padStart(2, '0')).join(" ");
    let ascii = Array.from(row).map(b => b >= 32 && b <= 126 ? String.fromCharCode(b) : '.').join("");
    result += `${i.toString(16).padStart(8, '0')}: ${hex.padEnd(width * 3)} ${ascii}\n`;
  }
  return result;
}

let curTab = '';
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.getElementById(tabId).classList.remove('hidden');
  curTab = tabId
}

function getTab(){
  return curTab;
}

function LoadFile(type, file, tabId){
  const typeLo = type.toLowerCase();
  if(typeLo == 'txt' || typeLo == 's' || typeLo == 'asm' || typeLo == 'cnf'){
    const decoder = new TextDecoder;
    const text = decoder.decode(file);
    document.getElementById(tabId).textContent = text;
  }
  else{document.getElementById(tabId).textContent = formatAsHex(file);}
}

function incFileSelect(element){
  const select = document.createElement('select');
    ['unknown', 'text', 'bin', 'image', 'sound', 'padding', 'asm'].forEach(type => {
      const option = document.createElement('option');
      option.value = type;
      option.textContent = type;
      select.appendChild(option);
    });
    element.appendChild(select);
}
