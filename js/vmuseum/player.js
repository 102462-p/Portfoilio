
class Player{
    constructor(id, pos, rot, size){
        this.id = id;
        this.rot = rot;

        this.mesh;
        this.animations;
        this.mixer;
        this.grounded = false;
        this.JumpForce = 10;
        this.velocity = {x: 0, y: 0, z: 0};
        this.moveDir = {x: 0, y: 0, z: 0};
        this.position = {x: pos[0], y: pos[1], z: pos[2]};
        this.scale = {x: size[0], y: size[1], z: size[2]};
    }
    InitPlayer(){
        //const geometry = new THREE.CylinderGeometry(1, 1, 3, 32);
        //const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: false});
        //this.mesh = new THREE.Mesh(geometry, material);
        //scene.add(this.mesh);
        //const texture_eye = texLoader.load('../assets/test.png', (texture) => {texture.flipY = false;});
        //const texture_hair = texLoader.load('../assets/test.png', (texture) => {texture.flipY = false;});
        //const texture_fabric = texLoader.load('../assets/test.png', (texture) => {texture.flipY = false;});

        //texture_fabric.wrapS = THREE.RepeatWrapping;
        //texture_fabric.wrapT = THREE.RepeatWrapping;

        //const textures = ['Material.006', texture_eye, 'Material.005', texture_hair, 'Material', texture_fabric];
        const textures = [];

        LoadModel('../assets/models/peter_griffin.glb', this.position, this.rot, this.scale, textures).then(({mesh, animations, mixer}) => {
            this.mesh = mesh; 
            this.animations = animations; 
            this.mixer = mixer;
        });
    }

    Jump(){
        if(this.grounded){
            let JumpAudio = new Audio();
            //JumpAudio.src = "../assets/sounds/MP3/Jump_Swoosh.mp3";
            //JumpAudio.play();
            //const JumpAction = this.mixer.clipAction(this.animations[1]);
            //JumpAction.setLoop(THREE.LoopOnce, 1);
            //JumpAction.play();

            //JumpAction.setEffectiveTimeScale(1);  // Optional: Set time scale to normal
            //JumpAction.time = 0;  // Jump to the first frame of the animation

            console.log("Jump");
            this.velocity.y += this.JumpForce * 0.02;
            this.grounded = false;
        }
    }

    Update(){
        if(!this.grounded){
            this.velocity.y += -0.01;
        }
        else{
            this.velocity.y = 0;
        }

        AABB({min_x: 0, min_y: 0, min_z: 0,
              max_x: 3, max_y: 0, max_z: 0}, 

             {min_x: 2, min_y: 0, min_z: 0,
              max_x: 0, max_y: 0, max_z: 0});

        let CamX = camera.position.x - this.position.x;
        let CamZ = camera.position.z - this.position.z;

        let MoveDirX = (CamX * this.moveDir.x + CamZ * this.moveDir.z);
        let MoveDirZ = (CamZ * this.moveDir.x - CamX * this.moveDir.z);

        this.velocity.x += 0.003 * MoveDirX;
        this.velocity.z += 0.003 * MoveDirZ;

        if(this.mesh){
            this.mesh.position.x += this.velocity.x;
            this.mesh.position.y += this.velocity.y;
            this.mesh.position.z += this.velocity.z;
            this.position = this.mesh.position;

            if(this.moveDir.x != 0 || this.moveDir.z != 0){
                let RotAngle = Math.atan2(MoveDirZ, MoveDirX);
                this.mesh.rotation.y = -(RotAngle + -90 * PIdeg);
            }
            //console.log(this.animations);
            this.mixer.update(clock.getDelta());
        }

        if(this.velocity.x != 0){
            this.velocity.x *= 0.9;
        }
        if(this.velocity.z != 0){
            this.velocity.z *= 0.9;
        }

        if(this.mesh){
            if(this.mesh.position.y <= 0){
                this.mesh.position.y = 0;
                this.grounded = true;
            }
            else{
                this.grounded = false;
            }
        }
    }
}
