function downloadElementContent(elementId, filename, isBinary = false) {
  const contentElement = document.getElementById(elementId);
  if (!contentElement) return;

  const content = contentElement.textContent;

  let blob;
  if (isBinary) {
    const byteCharacters = atob(content);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    blob = new Blob([byteArray], { type: 'application/octet-stream' });
  } else {
    blob = new Blob([content], { type: 'text/plain' });
  }

  const url = URL.createObjectURL(blob);
  let a = document.querySelector('a[data-download]');
  if (!a) {
    a = document.createElement('a');
    a.setAttribute('data-download', 'true'); // marker so we can reuse it
    a.style.display = 'none';
    document.body.appendChild(a);
  }
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadArrayBuffer(arrayBuffer, filename, mimeType = 'application/octet-stream') {
  if (!(arrayBuffer instanceof ArrayBuffer)) {
    console.error('Input is not a valid ArrayBuffer');
    return;
  }

  const blob = new Blob([arrayBuffer], { type: mimeType });

  let a = document.querySelector('a[data-download]');
  if (!a) {
    a = document.createElement('a');
    a.setAttribute('data-download', 'true');
    a.style.display = 'none';
    document.body.appendChild(a);
  }

  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
