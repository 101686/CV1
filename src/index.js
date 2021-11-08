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
  DeviceOrientationCamera
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
//const camera = new UniversalCamera("Camera", new Vector3(0, 5, 10), scene);
//const camera = new UniversalCamera("kamera",new Vector3(1,1,10),scene);
const camera = new DeviceOrientationCamera(
  "kamera",
  new Vector3(1, 1, 10),
  scene
);

//zaměřit kameru do středu
camera.setTarget(new Vector3(0, 1, 0));

//spojení kamery a grafikcého okna
camera.attachControl(canvas, true);

//var i = 0;
//for (i = 0; i < 3; i++) {
//var sphere = MeshBuilder.CreateCylinder(
//"freza",
//{ diameter: 0.2, height: 3 },
//scene
//);
//sphere.position.x = i;
//if (i === 2) {
//var Mat = new StandardMaterial("sedy", scene);
// Mat.diffuseColor = new Color3(0.55, 0.75, 0.6);
// sphere.material = Mat;
// }
//}
var i = 0;
for (i = 0; i < 1; i++) {
  var sphere = MeshBuilder.CreateCylinder(
    "freza",
    { diameter: 0.2, height: 0.01 },
    scene
  );
  sphere.position.x = i;
  if (i === 2) {
    var Mat = new StandardMaterial("sedy", scene);
    Mat.diffuseColor = new Color3(0.1, 0.1, 0.6);
    sphere.material = Mat;
  }
}

//světlo
const light1 = new DirectionalLight(
  "DirectionalLight",
  new Vector3(-1, -1, -1),
  scene
);
SceneLoader.ImportMesh("", "public/", "freza.glb", scene, function (newMeshes) {
  // Set the target of the camera to the first imported mesh
  newMeshes[0].scaling = new Vector3(0.1, 0.1, 0.07);
  newMeshes[0].rotate(new Vector3(-1, 0, 0), Math.PI / 2);
  newMeshes[0].position.z = 0;
  newMeshes[0].position.x = 0;
  newMeshes[0].position.y = 0;
});
SceneLoader.ImportMesh("", "public/", "endmill.glb", scene, function (
  newMeshes
) {
  // Set the target of the camera to the first imported mesh
  newMeshes[0].scaling = new Vector3(0.1, 0.1, 0.15);
  newMeshes[0].rotate(new Vector3(-1, 0, 0), Math.PI / 2);
  newMeshes[0].position.z = 2;
  newMeshes[0].position.x = 1.5;
  newMeshes[0].position.y = 0;
});

//před vykreslením se vždy provede
scene.registerBeforeRender(function () {
  //sphere.position.x += 0.03;
  light1.setDirectionToTarget(sphere.position);
});

// povinné vykreslování
engine.runRenderLoop(function () {
  scene.render();
});
const environment1 = scene.createDefaultEnvironment({
  enableGroundShadow: true
});
const xrHelper = scene.createDefaultXRExperienceAsync({
  // define floor meshes
  floorMeshes: [environment1.ground]
});
environment1.setMainColor(new Color3.FromHexString("#74b9ff"));
environment1.ground.parent.position.y = 0;
environment1.ground.position.y = 0;

//scene.debugLayer.show();
