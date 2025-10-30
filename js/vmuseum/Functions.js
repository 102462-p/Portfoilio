function LoadModel(path, pos, rot, scale,  textures){
    return new Promise((resolve, reject) => {
        loader.load(path, (gltf) => {
            const mesh = gltf.scene;
            const mixer = new THREE.AnimationMixer(mesh);
            const animations = gltf.animations;

            mesh.rotation.y = 90 * PIdeg;
            mesh.position.set(pos.x,pos.y,pos.z);
            mesh.scale.set(scale.x, scale.y, scale.z);
            scene.add(mesh);

            mesh.traverse((node) =>{
                if(node.isMesh){
                    node.material.emissive = new THREE.Color(0x444444);
                    node.material.emissiveIntensity = 0.2;

                    let i = 0;
                    while(textures[i] != undefined){
                        if(textures[i * 2] == node.material.name){
                            node.material.map = textures[i * 2 + 1];
                            break;
                        }
                        i++;
                    }
                }
            });
            resolve({mesh, animations, mixer});
        });
    });
}

function AABB(boxA, boxB){
    if(boxA.max_x > boxB.min_x && boxA.min_x < boxB.max_x){
        console.log("HIT");
    }
}