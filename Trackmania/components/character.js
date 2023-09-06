AFRAME.registerComponent('character', {
    schema: {
        acceleration: { type: 'number', default: 0.1 }, // Hodnota zrychlení auta
        maxSpeed: { type: 'number', default: 4 }, // Maximální rychlost auta
    },

    init: function() {
        console.log('Hello, character!');

        this.directions = {
            'back': new CANNON.Vec3(0, 0, 3),
            'right': new CANNON.Vec3(1, 0, 0),
            'front': new CANNON.Vec3(0, 0, -3),
            'left': new CANNON.Vec3(-1, 0, 0),
            'halfleft': new CANNON.Vec3(-1, 0, -5),
            'halfright': new CANNON.Vec3(1, 0, -5),
        };

        this.health = 100;
        this.collisionBodies = [];
        this.velocity = null;
        this.rotationY = 90;
        this.direction = 'right';
        this.characterModel = this.el.children[0];

        // Sledování kláves
        this.keys = {
            ArrowUp: false,
            ArrowLeft: false,
            ArrowRight: false,
            ArrowDown: false,
        };

        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                this.keys.ArrowLeft = true;
                this.startRunning();
            } else if (event.key === 'ArrowRight') {
                this.keys.ArrowRight = true;
                this.startRunning();
            } else if (event.key === 'ArrowUp') {
                this.keys.ArrowUp = true;
                this.startRunning();
            } else if (event.key === 'ArrowDown') {
                this.keys.ArrowDown = true;
                this.startRunning();
            }
        });

        document.addEventListener('keyup', (event) => {
            if (event.key === 'ArrowLeft') {
                this.keys.ArrowLeft = false;
                this.stop();
            } else if (event.key === 'ArrowRight') {
                this.keys.ArrowRight = false;
                this.stop();
            } else if (event.key === 'ArrowUp') {
                this.keys.ArrowUp = false;
                this.stop();
            } else if (event.key === 'ArrowDown') {
                this.keys.ArrowDown = false;
                this.stop();
            }
        });

        this.el.addEventListener('collide', (event) => this.processCollision(event));
    },

    startRunning() {
        let velocity = new CANNON.Vec3(0, 0, 0);

        if (this.keys.ArrowUp && this.keys.ArrowLeft) {
            velocity.x += 0.1;
            velocity.z -= 3;
        } else if (this.keys.ArrowUp && this.keys.ArrowRight) {
            velocity.x -= 0.1;
            velocity.z -= 3;
        } else if (this.keys.ArrowDown) {
            velocity.z += 3;
        } else if (this.keys.ArrowLeft) {
            velocity.x -= 1;
        } else if (this.keys.ArrowUp) {
            velocity.z -= 3;
        } else if (this.keys.ArrowRight) {
            velocity.x += 1;
        } else if (velocity.x === 0 && velocity.z === 0) {
            this.stop();
            return;
        }

        if (this.keys.ArrowUp && this.keys.ArrowLeft) {
            this.direction = 'halfleft';
        } else if (this.keys.ArrowUp && this.keys.ArrowRight) {
            this.direction = 'halfright';
        } else if (this.keys.ArrowUp) {
            this.direction = 'front';
        } else if (this.keys.ArrowDown) {
            this.direction = 'back';
        } else if (this.keys.ArrowLeft) {
            this.direction = 'left';
        } else if (this.keys.ArrowRight) {
            this.direction = 'right';
        }

        this.velocity = velocity;
        this.rotationY = Math.atan2(velocity.x, velocity.z) * (180 / Math.PI);

        this.characterModel.setAttribute('animation', {
            property: 'rotation',
            to: { x: 0, y: this.rotationY, z: 0 },
            dur: 500,
            easing: 'easeOutQuad',
        });

        this.characterModel.setAttribute('animation-mixer', {
            clip: 'run',
            crossFadeDuration: 0.2,
        });
    },

    stop() {
        this.velocity = null;

        this.characterModel.setAttribute('animation-mixer', {
            clip: 'idle',
            crossFadeDuration: 0.2,
        });
    },

    tick(time, timeDelta) {
        if (this.velocity !== null) {
            // Získání hodnoty zrychlení a maximální rychlosti z atributu schématu
            const acceleration = this.data.acceleration;
            const maxSpeed = this.data.maxSpeed;

            // Výpočet aktuální rychlosti na základě zrychlení a času

            if (isNaN(this.speed)) {
                this.speed = 0; // Přiřazení výchozí hodnoty, pokud this.speed je NaN
            }

            this.speed += acceleration * timeDelta;

            // Omezování rychlosti na maximální hodnotu
            if (this.speed > maxSpeed) {
                this.speed = maxSpeed;
            }

            // Výpočet vektoru pohybu
            const directionVector = this.directions[this.direction];

            const velocity = new CANNON.Vec3(
                directionVector.x * this.speed,
                directionVector.y * this.speed,
                directionVector.z * this.speed
            );

            // Nastavení rychlosti tělesa entity
            this.el.body.velocity.set(velocity.x, velocity.y, velocity.z);

        }
    },

    processCollision(event) {
        const otherEntity = event.detail.body;

        // Pouze kolize s překážkami (entity s komponentou obstacle) jsou brány v úvahu
        if (!otherEntity.el.hasAttribute('obstacle')) {
            return;
        }

        // Opakovaná kolize s touto samou entitou je ignorována
        if (this.collisionBodies.includes(otherEntity)) {
            return;
        }

        // Přidání entity, se kterou došlo ke kolizi, do pole pro vyhnutí se další kolizi s touto entitou
        this.collisionBodies.push(otherEntity);

        // Pokud je mezi kolizemi alespoň 500 ms prodleva, povolí se opětovná kolize s touto entitou
        // Jinými slovy: po 500 ms odstraníme kolizní entitu z pole, pokud v mezidobí nenastanou další kolize
        clearTimeout(this.clearTimeout);
        this.clearTimeout = setTimeout(
            () => this.collisionBodies.splice(0, this.collisionBodies.length),
            500
        );

        // Kolize ovlivňuje životnost postavy
        this.health -= 40;
        console.log('Health', this.health);

        // Pokud nezbývá žádná životnost, hra je prohrána
        if (this.health < 0) {
            document.getElementById('game-over').style.display = 'block';
        }

        // Informujeme druhou entitu o kolizi, aby se mohla zničit
        otherEntity.el.emit('collide-with-character');
    },
});