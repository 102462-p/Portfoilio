// Museum dimensions
const MUSEUM_WIDTH = 40;
const MUSEUM_DEPTH = 30;
const MUSEUM_HEIGHT = 8;
const WALL_THICKNESS = 0.5;

// Textures
const floorTex = new THREE.TextureLoader().load('../assets/png/sky_background.jpeg');
floorTex.wrapS = THREE.RepeatWrapping;
floorTex.wrapT = THREE.RepeatWrapping;
floorTex.repeat.set(4, 3);

// Floor
const floor = new THREE.Mesh(
  new THREE.BoxGeometry(MUSEUM_WIDTH, 0.5, MUSEUM_DEPTH),
  new THREE.MeshStandardMaterial({ 
    color: 0x8B7355,
    roughness: 0.8,
    metalness: 0.2
  })
);
floor.position.y = -0.25;
floor.receiveShadow = true;
floor.castShadow = false;
scene.add(floor);

// Ceiling
const ceiling = new THREE.Mesh(
  new THREE.BoxGeometry(MUSEUM_WIDTH, 0.5, MUSEUM_DEPTH),
  new THREE.MeshStandardMaterial({ 
    color: 0xF5F5F5,
    roughness: 0.9
  })
);
ceiling.position.y = MUSEUM_HEIGHT;
ceiling.receiveShadow = false;
ceiling.castShadow = false;
scene.add(ceiling);

// Wall material
const wallMaterial = new THREE.MeshStandardMaterial({ 
  color: 0xE8E8E8,
  roughness: 0.9,
  metalness: 0.1
});

// Helper function to add shadow properties to walls
const addShadowProperties = (mesh) => {
  mesh.receiveShadow = true;
  mesh.castShadow = false;
};

// North Wall (back)
const northWall = new THREE.Mesh(
  new THREE.BoxGeometry(MUSEUM_WIDTH, MUSEUM_HEIGHT, WALL_THICKNESS),
  wallMaterial
);
northWall.position.set(0, MUSEUM_HEIGHT / 2, -MUSEUM_DEPTH / 2);
addShadowProperties(northWall);
scene.add(northWall);

// South Wall (front - with entrance)
const southWallLeft = new THREE.Mesh(
  new THREE.BoxGeometry(MUSEUM_WIDTH / 2 - 4, MUSEUM_HEIGHT, WALL_THICKNESS),
  wallMaterial
);
southWallLeft.position.set(-MUSEUM_WIDTH / 4 - 2, MUSEUM_HEIGHT / 2, MUSEUM_DEPTH / 2);
addShadowProperties(southWallLeft);
scene.add(southWallLeft);

const southWallRight = new THREE.Mesh(
  new THREE.BoxGeometry(MUSEUM_WIDTH / 2 - 4, MUSEUM_HEIGHT, WALL_THICKNESS),
  wallMaterial
);
southWallRight.position.set(MUSEUM_WIDTH / 4 + 2, MUSEUM_HEIGHT / 2, MUSEUM_DEPTH / 2);
addShadowProperties(southWallRight);
scene.add(southWallRight);

// East Wall (right)
const eastWall = new THREE.Mesh(
  new THREE.BoxGeometry(WALL_THICKNESS, MUSEUM_HEIGHT, MUSEUM_DEPTH),
  wallMaterial
);
eastWall.position.set(MUSEUM_WIDTH / 2, MUSEUM_HEIGHT / 2, 0);
addShadowProperties(eastWall);
scene.add(eastWall);

// West Wall (left)
const westWall = new THREE.Mesh(
  new THREE.BoxGeometry(WALL_THICKNESS, MUSEUM_HEIGHT, MUSEUM_DEPTH),
  wallMaterial
);
westWall.position.set(-MUSEUM_WIDTH / 2, MUSEUM_HEIGHT / 2, 0);
addShadowProperties(westWall);
scene.add(westWall);

// Central divider walls for more gallery space
const centerDivider1 = new THREE.Mesh(
  new THREE.BoxGeometry(WALL_THICKNESS, MUSEUM_HEIGHT, 12),
  wallMaterial
);
centerDivider1.position.set(-8, MUSEUM_HEIGHT / 2, -3);
addShadowProperties(centerDivider1);
scene.add(centerDivider1);

const centerDivider2 = new THREE.Mesh(
  new THREE.BoxGeometry(WALL_THICKNESS, MUSEUM_HEIGHT, 12),
  wallMaterial
);
centerDivider2.position.set(8, MUSEUM_HEIGHT / 2, -3);
addShadowProperties(centerDivider2);
scene.add(centerDivider2);

// Add ambient lighting fixtures (decorative)
const createLight = (x, z) => {
  const lightGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 8);
  const lightMesh = new THREE.Mesh(
    lightGeometry,
    new THREE.MeshStandardMaterial({ 
      color: 0xFFFFDD,
      emissive: 0xFFFFAA,
      emissiveIntensity: 0.5
    })
  );
  lightMesh.position.set(x, MUSEUM_HEIGHT - 0.3, z);
  scene.add(lightMesh);
  
  const pointLight = new THREE.PointLight(0xFFFFFF, 0.3, 10);
  pointLight.position.set(x, MUSEUM_HEIGHT - 0.5, z);
  scene.add(pointLight);
};

// Add lights throughout the museum
for (let x = -15; x <= 15; x += 10) {
  for (let z = -10; z <= 10; z += 10) {
    createLight(x, z);
  }
}

// Floor collision
var floorCol = new CANNON.Box(new CANNON.Vec3(MUSEUM_WIDTH / 2, 0.25, MUSEUM_DEPTH / 2));
var floorBody = new CANNON.Body({
  mass: 0
});
floorBody.addShape(floorCol);
floorBody.position.set(0, -0.25, 0);
world.addBody(floorBody);

// Wall collisions
// North wall
var northWallCol = new CANNON.Box(new CANNON.Vec3(MUSEUM_WIDTH / 2, MUSEUM_HEIGHT / 2, WALL_THICKNESS / 2));
var northWallBody = new CANNON.Body({ mass: 0 });
northWallBody.addShape(northWallCol);
northWallBody.position.set(0, MUSEUM_HEIGHT / 2, -MUSEUM_DEPTH / 2);
world.addBody(northWallBody);

// South walls
var southWallLeftCol = new CANNON.Box(new CANNON.Vec3(MUSEUM_WIDTH / 4 - 2, MUSEUM_HEIGHT / 2, WALL_THICKNESS / 2));
var southWallLeftBody = new CANNON.Body({ mass: 0 });
southWallLeftBody.addShape(southWallLeftCol);
southWallLeftBody.position.set(-MUSEUM_WIDTH / 4 - 2, MUSEUM_HEIGHT / 2, MUSEUM_DEPTH / 2);
world.addBody(southWallLeftBody);

var southWallRightCol = new CANNON.Box(new CANNON.Vec3(MUSEUM_WIDTH / 4 - 2, MUSEUM_HEIGHT / 2, WALL_THICKNESS / 2));
var southWallRightBody = new CANNON.Body({ mass: 0 });
southWallRightBody.addShape(southWallRightCol);
southWallRightBody.position.set(MUSEUM_WIDTH / 4 + 2, MUSEUM_HEIGHT / 2, MUSEUM_DEPTH / 2);
world.addBody(southWallRightBody);

// East wall
var eastWallCol = new CANNON.Box(new CANNON.Vec3(WALL_THICKNESS / 2, MUSEUM_HEIGHT / 2, MUSEUM_DEPTH / 2));
var eastWallBody = new CANNON.Body({ mass: 0 });
eastWallBody.addShape(eastWallCol);
eastWallBody.position.set(MUSEUM_WIDTH / 2, MUSEUM_HEIGHT / 2, 0);
world.addBody(eastWallBody);

// West wall
var westWallCol = new CANNON.Box(new CANNON.Vec3(WALL_THICKNESS / 2, MUSEUM_HEIGHT / 2, MUSEUM_DEPTH / 2));
var westWallBody = new CANNON.Body({ mass: 0 });
westWallBody.addShape(westWallCol);
westWallBody.position.set(-MUSEUM_WIDTH / 2, MUSEUM_HEIGHT / 2, 0);
world.addBody(westWallBody);

// Center dividers
var divider1Col = new CANNON.Box(new CANNON.Vec3(WALL_THICKNESS / 2, MUSEUM_HEIGHT / 2, 6));
var divider1Body = new CANNON.Body({ mass: 0 });
divider1Body.addShape(divider1Col);
divider1Body.position.set(-8, MUSEUM_HEIGHT / 2, -3);
world.addBody(divider1Body);

var divider2Col = new CANNON.Box(new CANNON.Vec3(WALL_THICKNESS / 2, MUSEUM_HEIGHT / 2, 6));
var divider2Body = new CANNON.Body({ mass: 0 });
divider2Body.addShape(divider2Col);
divider2Body.position.set(8, MUSEUM_HEIGHT / 2, -3);
world.addBody(divider2Body);

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

const box = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ map: floorTex })
);
box.position.y = 2;
scene.add(box);

var boxCol = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
var boxBody = new CANNON.Body({
  mass: 5
});
boxBody.addShape(boxCol);
boxBody.position.x = box.position.x;
boxBody.position.y = box.position.y;
boxBody.position.z = box.position.z;
world.addBody(boxBody);
