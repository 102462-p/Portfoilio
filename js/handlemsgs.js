function sendMsg(target_window, data = {}){
    const Callback = new Map();
    const RequestID = crypto.randomUUID();
    let type = 'data';
    return new Promise((resolve => {
        Callback.set(RequestID, resolve);
        target_window.postMessage({type, data}, location.origin);
    }));
}

function handleMsg(){
    
}
