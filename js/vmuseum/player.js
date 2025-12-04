
class Player{
    constructor(id, pos, rot, size){
        this.id = id;
        this.rot = rot;

        this.mesh;
        this.charModel;
        this.grounded = false;
        this.JumpForce = 10;
        this.velocity = {x: 0, y: 0, z: 0};
        this.moveDir = {x: 0, y: 0, z: 0};
        this.position = {x: pos[0], y: pos[1], z: pos[2]};
        this.scale = {x: size[0], y: size[1], z: size[2]};
        this.body = null;
        this.isMoving = false;
        this.animTime = 0;
    }
    InitPlayer(){
        this.charModel = new CharacterModel(scene, this.position, 1.2);
        this.mesh = this.charModel.createRobot();
        
        const shape = new CANNON.Cylinder(0.4, 0.4, 2.5, 8);
        this.body = new CANNON.Body({
            mass: 5,
            position: new CANNON.Vec3(this.position.x, this.position.y + 1.25, this.position.z),
            shape: shape,
            linearDamping: 0.9,
            angularDamping: 0.99,
            fixedRotation: true // Prevent the player from rotating
        });
        world.addBody(this.body);
    }

    Jump(){
        if(this.grounded && this.body){
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
            //this.mixer.update(clock.getDelta());
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
