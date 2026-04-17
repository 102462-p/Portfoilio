(function(global){
    const callback = new Map();
    function sendMsh(target_wind, type, payload = {}){
        const requestID = crypto.randomUUID();
        return new Promise((resolve) => {
            callback.set(requestID, resolve);
            target_wind.postMessage({type, payload, requestID}, location.origin);
        });
    }

    function handleMsg(handler){
        window.addEventListener('message', (e) => {
            if(e.origin !== location.origin){return;}

            const {type, payload, requestID} = e.data;
            if(type === 'response' && callback.has(requestID)){
                const cb = callback.get(requestID);
                callback.delete(requestID);
                cb(payload);
                return;
            }

            if(handler[type]){
                Promise.resolve(handler[type](payload)).then((responsePayload) => {
                    if(requestID){
                        e.source.postMessage({
                            type: 'response',
                            requestID,
                            payload: responsePayload
                        }, e.origin);
                    }
                });
            }
        });
    }

    global.message_handler = {sendMsh, handleMsg};
})(window);
