import "./styles.css"; // keep this here!

// naimportujte vše co je potřeba z BabylonJS
import {
  Engine,
  Scene,
  UniversalCamera,
  MeshBuilder,
  StandardMaterial,
  DirectionalLight,
  Vector3,
  Color3,
  SceneLoader,
  DeviceOrientationCamera,
  Mesh,
  Animation
} from "@babylonjs/core";
import "@babylonjs/inspector";

//canvas je grafické okno, to rozáhneme přes obrazovku
const canvas = document.getElementById("renderCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const engine = new Engine(canvas, true);

//scéna neměnit
const scene = new Scene(engine);
// Default Environment

//vytoření kamery v pozici -5 (dozadu)
const camera = new DeviceOrientationCamera(
  "kamera",
  new Vector3(1, 1, 10),
  scene
);

//zaměřit kameru do středu
camera.setTarget(new Vector3(0, 1, 0));

//spojení kamery a grafikcého okna
camera.attachControl(canvas, true);

//zde přídáme cyklus for

//světlo
const light1 = new DirectionalLight(
  "DirectionalLight",
  new Vector3(-1, -1, -1),
  scene
);

var freza;
SceneLoader.ImportMesh("", "public/", "endmill.glb", scene, function (
  newMeshes
) {
  // Pozice, měřítko a rotace
  newMeshes[0].scaling = new Vector3(0.15, 0.15, 0.175);
  newMeshes[0].rotate(new Vector3(-1, 0, 0), Math.PI / 2);
  newMeshes[0].position.z = -2;
  newMeshes[0].position.x = 1;
  freza = newMeshes[0];
});

scene.registerBeforeRender(function () {});
//zde uděláme animaci

// povinné vykreslování
engine.runRenderLoop(function () {
  scene.render();
});
const environment1 = scene.createDefaultEnvironment({
  enableGroundShadow: true
});
// zde uděláme VR prostředí

//scene.debugLayer.show();
