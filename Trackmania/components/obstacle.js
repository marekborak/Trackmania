AFRAME.registerComponent('obstacle', {
    schema: {
        strength: {
            type: 'int',
            default: 100
        }
    },
    init() {
        console.log('Hello, you obstacle!');

        this.damage = 0;
        this.hasBeenDestroyed = false;

        this.el.addEventListener('collide-with-character', event => {
            this.damage += 60;

            if (this.damage > this.data.strength && !this.hasBeenDestroyed) {
                this.el.remove();
            }
        })
    }
});