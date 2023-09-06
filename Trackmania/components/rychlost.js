AFRAME.registerComponent('rychlost', {
    init() {
        this.carEntity = document.querySelector('#eva'); // Nahraď '#car' za selektor, který odpovídá tvé entitě auta
        this.displejEntity = document.querySelector('#displej'); // Nahraď '#displej' za selektor, který odpovídá tvému displejovému prvku

        this.updateRychlost();
    },

    updateRychlost() {
        const rychlost = this.carEntity.getAttribute('velocity').length(); // Předpokládáme, že rychlost auta je reprezentována atributem 'velocity'

        this.displejEntity.setAttribute('text', {
            value: `Rychlost: ${rychlost.toFixed(2)}`
        });

        requestAnimationFrame(this.updateRychlost.bind(this));
    }
});
