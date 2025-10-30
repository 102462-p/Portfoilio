const clickable = [];
let paintings = [];

let index = 0;

function museum_init(){
  paintings.forEach(p => {
    const tex = new THREE.TextureLoader().load(p.texture);
    const painting = new THREE.Mesh(
      new THREE.PlaneGeometry(3, 3),
      new THREE.MeshBasicMaterial({ map: tex })
    );
    painting.position.set(p.position.x,p.position.y,p.position.z);
    painting.userData = { url: p.url };
    scene.add(painting);
    clickable.push(painting);
    index++;
  });

  mainloop();
}

function mainloop() {
  requestAnimationFrame(mainloop);

  p1.Update();
  //p2.Update();

  for(let i = 0; i < paintings.length; i++){
    //console.log(p1.position)
    //console.log(paintings[i].position)
    if(p1.position == paintings[i].position){
      console.log('s');
    }
  }

  //AngleY += 0.01;
  //AngleX += 0.01;

  AngleX += 0.03 * CamDir.x;

  camera.position.x = distance * Math.sin(AngleY + 90 * 3.14 / 180) * Math.cos(AngleX) + p1.position.x;
  camera.position.y = distance * Math.cos(AngleY + 90 * 3.14 / 180) + p1.position.y -1;
  camera.position.z = distance * Math.sin(AngleY + 90 * 3.14 / 180) * Math.sin(AngleX) + p1.position.z;

  camera.lookAt(p1.position.x, p1.position.y, p1.position.z);

  renderer.render(scene, camera);
}

window.addEventListener('message', (e) => {
        if(e.origin !== location.origin){return;}
        paintings = e.data.data[0];
        museum_init();
});
