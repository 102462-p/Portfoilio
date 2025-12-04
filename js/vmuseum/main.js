const clickable = [];
let paintings = [];

let index = 0;

function museum_init(){
  // Define painting positions on walls
  const wallPositions = [
    // North wall (back)
    { x: -15, y: 3, z: -14.5, rotY: 0 },
    { x: -8, y: 3, z: -14.5, rotY: 0 },
    { x: 0, y: 3, z: -14.5, rotY: 0 },
    { x: 8, y: 3, z: -14.5, rotY: 0 },
    { x: 15, y: 3, z: -14.5, rotY: 0 },
    // East wall (right)
    { x: 19.8, y: 3, z: -8, rotY: Math.PI / 2 },
    { x: 19.8, y: 3, z: 0, rotY: Math.PI / 2 },
    { x: 19.8, y: 3, z: 8, rotY: Math.PI / 2 },
    // West wall (left)
    { x: -19.8, y: 3, z: -8, rotY: -Math.PI / 2 },
    { x: -19.8, y: 3, z: 0, rotY: -Math.PI / 2 },
    { x: -19.8, y: 3, z: 8, rotY: -Math.PI / 2 },
    // Center divider 1 (left side)
    { x: -8.3, y: 3, z: -8, rotY: Math.PI / 2 },
    { x: -8.3, y: 3, z: -3, rotY: Math.PI / 2 },
    { x: -8.3, y: 3, z: 2, rotY: Math.PI / 2 },
    // Center divider 1 (right side)
    { x: -7.7, y: 3, z: -8, rotY: -Math.PI / 2 },
    { x: -7.7, y: 3, z: -3, rotY: -Math.PI / 2 },
    { x: -7.7, y: 3, z: 2, rotY: -Math.PI / 2 },
    // Center divider 2 (left side)
    { x: 7.7, y: 3, z: -8, rotY: Math.PI / 2 },
    { x: 7.7, y: 3, z: -3, rotY: Math.PI / 2 },
    { x: 7.7, y: 3, z: 2, rotY: Math.PI / 2 },
    // Center divider 2 (right side)
    { x: 8.3, y: 3, z: -8, rotY: -Math.PI / 2 },
    { x: 8.3, y: 3, z: -3, rotY: -Math.PI / 2 },
    { x: 8.3, y: 3, z: 2, rotY: -Math.PI / 2 },
  ];

  paintings.forEach((p, i) => {
    const tex = new THREE.TextureLoader().load(p.texture);
    const painting = new THREE.Mesh(
      new THREE.PlaneGeometry(3, 3),
      new THREE.MeshBasicMaterial({ map: tex })
    );
    
    // Use predefined wall positions, cycling through them
    //const pos = wallPositions[i % wallPositions.length];
    const pos = wallPositions[i];
    console.log(pos, p.position);
    painting.position.set(pos.x, pos.y, pos.z);
    //painting.rotation.y = pos.rotY;
    
    painting.userData = { url: p.url };
    scene.add(painting);
    clickable.push(painting);
    index++;
  });

  mainloop();
}

let delta;
function mainloop() {
  requestAnimationFrame(mainloop);

  delta = Math.min(clock.getDelta(), 0.1);
  world.step(delta);

  p1.Update(delta);
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

  box.position.set(boxBody.position.x,boxBody.position.y,boxBody.position.z);
  box.quaternion.set(boxBody.quaternion.x,boxBody.quaternion.y,boxBody.quaternion.z,boxBody.quaternion.w);

  camera.lookAt(p1.position.x, p1.position.y, p1.position.z);
  renderer.render(scene, camera);
}

window.addEventListener('message', (e) => {
        if(e.origin !== location.origin){return;}
        paintings = e.data.data[0];
        museum_init();
});
