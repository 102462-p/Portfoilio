window.addEventListener('keydown', function(key){
    //console.log(key);
    if(key.code === 'Space'){
      p1.Jump();
    }
    if(key.code === 'KeyA'){
      CamDir.x = -1;
      p1.moveDir.z = -1;
    }
    if(key.code === 'KeyD'){
      CamDir.x = 1;
      p1.moveDir.z = 1;
    }
    if(key.code === 'KeyW'){
      p1.moveDir.x = -1;
    }
    if(key.code === 'KeyS'){
      p1.moveDir.x = 1;
    }

    if(key.code === 'ArrowLeft'){
      CamDir.x = -1;
    }
    if(key.code === 'ArrowRight'){
      CamDir.x = 1;
    }
  
    const preventScrollKeys = [
      'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 
      'Space', 'PageUp', 'PageDown', 'Home', 'End'
    ];
  
    if (preventScrollKeys.includes(key.code)) {
      key.preventDefault();
    }
  })
  
  window.addEventListener('keyup', function(key){
    if(key.code === 'KeyA' || key.code === 'KeyD'){
      CamDir.x = 0;
      p1.moveDir.z = 0;
    }
    if(key.code === 'KeyS' || key.code === 'KeyW'){
      p1.moveDir.x = 0;
    }
    if(key.code === 'ArrowLeft' || key.code === 'ArrowRight'){
      CamDir.x = 0;
    }
})
