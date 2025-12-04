const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth -1, window.innerHeight -1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const light = new THREE.AmbientLight(0xFFFFFF, 0.8);
scene.add(light);

// Add directional light for shadows
const dirLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
dirLight.position.set(10, 20, 10);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.near = 0.5;
dirLight.shadow.camera.far = 50;
dirLight.shadow.camera.left = -25;
dirLight.shadow.camera.right = 25;
dirLight.shadow.camera.top = 25;
dirLight.shadow.camera.bottom = -25;
scene.add(dirLight);

const loader = new THREE.GLTFLoader();
const texLoader = new THREE.TextureLoader();

const PIdeg = 3.14 / 180;
const clock = new THREE.Clock();

const geometry = new THREE.BoxGeometry(100, 1, 100);
const material = new THREE.MeshBasicMaterial({ color: 0xCC0000, wireframe: false});

var world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

const p1 = new Player('p1', [0, 2, 5], [0,0,0], [2,2,2]);
p1.InitPlayer();

//const p2 = new Player('p2', [5,0,-5], [0,0,0], [1.5,1.5,1.5]);
//p2.InitPlayer();

// Initialize camera position
camera.position.set(0, 5, 15);

let distance = 10;
let AngleX = 0;
let AngleY = 10;

let CamDir = {x: 0, y: 0}
