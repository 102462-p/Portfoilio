const floorTex = new THREE.TextureLoader().load('../assets/png/pexels-tbee-14592-82256.jpg');

const floor = new THREE.Mesh(
  new THREE.BoxGeometry(20, 1, 20),
  new THREE.MeshBasicMaterial({ map: floorTex })
);
floor.position.y = -0.5;
scene.add(floor);

const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xffccaa });
const wall = new THREE.Mesh(new THREE.BoxGeometry(20, 10, 1), wallMaterial);
wall.position.z = -10;
scene.add(wall);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', () => {
  //mouse.x = 0;
  //mouse.y = 0;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(clickable);
  if (intersects.length > 0) {
    if(intersects[0].object.userData.url === '404.html'){
      //window.parent.location.href = intersects[0].object.userData.url;
    }
    else{window.location.href = intersects[0].object.userData.url + '?museum=1';}
  }
});

window.addEventListener('mousemove', function(e) {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});
