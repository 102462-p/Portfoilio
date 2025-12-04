// Character model factory - creates simple robot/character models

class CharacterModel {
    constructor(scene, position = {x: 0, y: 0, z: 0}, scale = 1) {
        this.scene = scene;
        this.position = position;
        this.scale = scale;
        this.mesh = null;
        this.parts = {};
    }

    createRobot() {
        const group = new THREE.Group();
        
        // Materials
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x4A90E2,
            metalness: 0.6,
            roughness: 0.4
        });
        
        const jointMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2C3E50,
            metalness: 0.8,
            roughness: 0.3
        });
        
        const eyeMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x00FFFF,
            emissive: 0x00FFFF,
            emissiveIntensity: 0.5
        });

        // Head
        const headGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
        const head = new THREE.Mesh(headGeometry, bodyMaterial);
        head.position.y = 1.8;
        head.castShadow = true;
        head.receiveShadow = true;
        group.add(head);
        this.parts.head = head;

        // Antenna
        const antennaGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8);
        const antenna = new THREE.Mesh(antennaGeometry, jointMaterial);
        antenna.position.y = 2.25;
        antenna.castShadow = true;
        group.add(antenna);

        const antennaBallGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const antennaBall = new THREE.Mesh(antennaBallGeometry, eyeMaterial);
        antennaBall.position.y = 2.45;
        group.add(antennaBall);

        // Eyes
        const eyeGeometry = new THREE.SphereGeometry(0.12, 8, 8);
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.15, 1.85, 0.3);
        group.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.15, 1.85, 0.3);
        group.add(rightEye);

        // Torso
        const torsoGeometry = new THREE.BoxGeometry(0.8, 1.0, 0.5);
        const torso = new THREE.Mesh(torsoGeometry, bodyMaterial);
        torso.position.y = 1.0;
        torso.castShadow = true;
        torso.receiveShadow = true;
        group.add(torso);
        this.parts.torso = torso;

        // Chest detail (glowing panel)
        const chestPanelGeometry = new THREE.BoxGeometry(0.4, 0.3, 0.52);
        const chestPanelMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x00FF88,
            emissive: 0x00FF88,
            emissiveIntensity: 0.3
        });
        const chestPanel = new THREE.Mesh(chestPanelGeometry, chestPanelMaterial);
        chestPanel.position.set(0, 1.1, 0);
        group.add(chestPanel);

        // Arms
        const armGeometry = new THREE.BoxGeometry(0.25, 0.8, 0.25);
        
        // Left arm
        const leftArm = new THREE.Mesh(armGeometry, bodyMaterial);
        leftArm.position.set(-0.55, 0.9, 0);
        leftArm.castShadow = true;
        group.add(leftArm);
        this.parts.leftArm = leftArm;

        // Right arm
        const rightArm = new THREE.Mesh(armGeometry, bodyMaterial);
        rightArm.position.set(0.55, 0.9, 0);
        rightArm.castShadow = true;
        group.add(rightArm);
        this.parts.rightArm = rightArm;

        // Shoulder joints
        const jointGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        const leftShoulder = new THREE.Mesh(jointGeometry, jointMaterial);
        leftShoulder.position.set(-0.55, 1.3, 0);
        group.add(leftShoulder);

        const rightShoulder = new THREE.Mesh(jointGeometry, jointMaterial);
        rightShoulder.position.set(0.55, 1.3, 0);
        group.add(rightShoulder);

        // Hands
        const handGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        const leftHand = new THREE.Mesh(handGeometry, jointMaterial);
        leftHand.position.set(-0.55, 0.4, 0);
        leftHand.castShadow = true;
        group.add(leftHand);

        const rightHand = new THREE.Mesh(handGeometry, jointMaterial);
        rightHand.position.set(0.55, 0.4, 0);
        rightHand.castShadow = true;
        group.add(rightHand);

        // Legs
        const legGeometry = new THREE.BoxGeometry(0.3, 0.9, 0.3);
        
        // Left leg
        const leftLeg = new THREE.Mesh(legGeometry, bodyMaterial);
        leftLeg.position.set(-0.2, 0.0, 0);
        leftLeg.castShadow = true;
        group.add(leftLeg);
        this.parts.leftLeg = leftLeg;

        // Right leg
        const rightLeg = new THREE.Mesh(legGeometry, bodyMaterial);
        rightLeg.position.set(0.2, 0.0, 0);
        rightLeg.castShadow = true;
        group.add(rightLeg);
        this.parts.rightLeg = rightLeg;

        // Hip joints
        const leftHip = new THREE.Mesh(jointGeometry, jointMaterial);
        leftHip.position.set(-0.2, 0.45, 0);
        group.add(leftHip);

        const rightHip = new THREE.Mesh(jointGeometry, jointMaterial);
        rightHip.position.set(0.2, 0.45, 0);
        group.add(rightHip);

        // Feet
        const footGeometry = new THREE.BoxGeometry(0.35, 0.15, 0.45);
        const leftFoot = new THREE.Mesh(footGeometry, jointMaterial);
        leftFoot.position.set(-0.2, -0.525, 0.05);
        leftFoot.castShadow = true;
        group.add(leftFoot);

        const rightFoot = new THREE.Mesh(footGeometry, jointMaterial);
        rightFoot.position.set(0.2, -0.525, 0.05);
        rightFoot.castShadow = true;
        group.add(rightFoot);

        // Apply position and scale
        group.position.set(this.position.x, this.position.y, this.position.z);
        group.scale.set(this.scale, this.scale, this.scale);
        
        this.mesh = group;
        this.scene.add(group);
        
        return group;
    }

    // Simple walking animation
    animateWalk(time, isMoving) {
        if (!this.mesh || !isMoving) return;
        
        const walkCycle = Math.sin(time * 8) * 0.3;
        
        if (this.parts.leftArm && this.parts.rightArm) {
            this.parts.leftArm.rotation.x = walkCycle;
            this.parts.rightArm.rotation.x = -walkCycle;
        }
        
        if (this.parts.leftLeg && this.parts.rightLeg) {
            this.parts.leftLeg.rotation.x = -walkCycle * 0.5;
            this.parts.rightLeg.rotation.x = walkCycle * 0.5;
        }
        
        // Slight head bob
        if (this.parts.head) {
            this.parts.head.position.y = 1.8 + Math.abs(Math.sin(time * 8)) * 0.05;
        }
    }

    // Idle animation
    animateIdle(time) {
        if (!this.mesh) return;
        
        // Gentle floating/breathing effect
        if (this.parts.torso) {
            this.parts.torso.position.y = 1.0 + Math.sin(time * 2) * 0.02;
        }
        
        if (this.parts.head) {
            this.parts.head.position.y = 1.8 + Math.sin(time * 2) * 0.02;
        }
    }

    remove() {
        if (this.mesh) {
            this.scene.remove(this.mesh);
        }
    }
}
