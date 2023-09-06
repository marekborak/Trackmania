import './style.css';
import 'aframe';
import 'aframe-extras';
import 'aframe-physics-system';
import './components/character';
import './components/restart';
import './components/obstacle';
import './components/rychlost';
import './components/collider-check';
import './shaders/glowing';

document.querySelector('#offroad-btn').addEventListener('click', generateOffroad);
document.querySelector('#car-btn').addEventListener('click', generateCar);

function generateOffroad() {
    const formuleEntity = document.querySelector('#formule');
    formuleEntity.setAttribute('gltf-model', '#formule-offroad');
}

function generateCar() {
    const formuleEntity = document.querySelector('#formule');
    formuleEntity.setAttribute('gltf-model', '#formule-car');
}

document.querySelector('#app').innerHTML = `
  <div id="app">
    <div id="game-over">You lost!</div>
    <div id="vehicle-selection">
      <button id="offroad-btn">Offroad</button>
      <button id="car-btn">Car</button>
    </div>
    <a-scene>
      <!-- External files -->
      <a-assets>
        <a-asset-item id="tree" src="/models/tree/tree.gltf"></a-asset-item>
        <a-asset-item id="formule-offroad" src="/models/offroad.glb"></a-asset-item>
        <a-asset-item id="formule-car" src="/models/car.glb"></a-asset-item>
        <a-asset-item id="finish" src="/models/finish.glb"></a-asset-item>

        <img src="/models/grass.jpg" id="grass">
        <img src="/models/asteroid.jpg" id="ball">
      </a-assets>

      <!-- Environment -->
      <!-- sky -->
      <a-sky src="/models/skytm2.jpg" height="100" width="100"></a-sky>

      <!-- finish -->
      <a-entity static-body gltf-model="#finish" position="0 0.4 -70" scale="0.5 0.5 0.5" castShadow="true"></a-entity>

      <!-- Road -->
      <a-box static-body shadow position="0 0 -4" rotation="-90 0 0" width="10" height="700" depth="0.5" src="/models/road.jpeg"></a-box>
      <a-box static-body obstacle position="5 0.5 0" rotation="0 90 90" color="red" width="0.1" height="700"></a-box>
      <a-box static-body obstacle position="-5 0.5 0" rotation="0 90 90" color="red" width="0.1" height="700"></a-box>

      <!-- Camera -->
      <a-entity id="camera" position="0 1.5 5" rotation="0 180 0" look-controls></a-entity>

      <!-- Lights -->
      <a-light type="directional" color="#FFF" intensity="0.5" position="2 10 -4" castShadow="true" shadowMapWidth="2048" shadowMapHeight="2048"></a-light>

      <!-- Sun -->
      <a-entity geometry="primitive: sphere; radius: 0.5" material="color: yellow" position="2 10 -4" light="type: point; intensity: 1; distance: 50" shadow="cast: true"></a-entity>

      <!-- General Lighting -->
      <a-light type="ambient" color="#FFF" intensity="0.5"></a-light>

      <!-- Obstacles -->
      <!-- <a-sphere obstacle="strength: 9999" dynamic-body="mass: 0.3" position="2 1 -3" radius="0.5" color="orange" shadow="cast: true"></a-sphere>
      <a-sphere obstacle="strength: 9999" dynamic-body="mass: 0.3" position="2 1 -1" radius="0.5" material="shader: glowing; transparent: true; color1: red; color2: blue; uMap: #ball;" shadow="cast: true"></a-sphere> -->

      <!-- Rychlost -->
      <a-entity id="formule" rychlost></a-entity>
      <a-entity id="displej" position="0 1.5 -3" text="align: center; color: white;"></a-entity>

      <!-- Character -->
      <a-entity character dynamic-body="mass: 1; angularDamping: 1; shape: box;" position="0 0.7 -2.5" castShadow="true">
        <a-entity id="formule" gltf-model="#formule" animation-mixer="clip: idle;" position="0 0 0" rotation="0 180 0" scale="1 1 1">
          <a-entity light="type: spot; penumbra: 0.5; intensity: 1; castShadow: true;" position="0 1 0" rotation="0 180 0"></a-entity>
        </a-entity>
        <a-entity raycaster="direction: 1 0 0; far: 2;" position="0 0.5 0" rotation="0 0 0" collider-check></a-entity>
      </a-entity>

      <!-- Restart -->
      <a-entity id="formule" restart></a-entity>
    </a-scene>
  </div>
`;
