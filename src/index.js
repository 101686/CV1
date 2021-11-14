import "./styles.css"; // keep this here!

// naimportujte vše co je potřeba z BabylonJS
import {
  Engine,
  Scene,
  UniversalCamera,
  MeshBuilder,
  StandardMaterial,
  DirectionalLight,
  HemisphericLight,
  FreeCamera,
  Vector3,
  Color3,
  SceneLoader,
  DeviceOrientationCamera,
  Mesh,
  Animation
} from "@babylonjs/core";
import "@babylonjs/inspector";

var canvas = document.getElementById("renderCanvas");

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function () {
  return new Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    disableWebGL2Support: false
  });
};
var createScene = async function () {
  // základní babylon scene objekt
  var scene = new Scene(engine);

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

  var i = 0;
  for (i = 0; i < 3; i++) {
    var sphere = MeshBuilder.CreateCylinder(
      "freza",
      { diameter: 0.2, height: 3 },
      scene
    );
    sphere.position.x = i;
    if (i === 2) {
      var Mat = new StandardMaterial("sedy", scene);
      Mat.diffuseColor = new Color3(0.5, 0.5, 0.6);
      sphere.material = Mat;
    }
  }

  //světlo
  const light1 = new DirectionalLight(
    "DirectionalLight",
    new Vector3(-1, -1, -1),
    scene
  );
  const data = await SceneLoader.ImportMeshAsync(
    "",
    "./public/",
    "freza.glb",
    scene
  );
  //const data = await SceneLoader.ImportMeshAsync("", "assets/", "car.obj", scene);
  // const carMeshes = data.meshes;

  const data2 = await SceneLoader.ImportMeshAsync(
    "",
    "public/",
    "freza.glb",
    scene
  );
  //, function (newMeshes) {
  //  // Set the target of the camera to the first imported mesh
  //  newMeshes[0].scaling = new Vector3(0.1, 0.1, 0.07);
  ////  newMeshes[0].rotate(new Vector3(-1, 0, 0), Math.PI / 2);
  //  newMeshes[0].position.z = -2;
  //});
  //var freza = sphere;
  const data3 = SceneLoader.ImportMeshAsync(
    "",
    "public/",
    "endmill.glb",
    scene
  );
  //, function (
  //  newMeshes
  //) {
  // Set the target of the camera to the first imported mesh
  //  newMeshes[0].scaling = new Vector3(0.15, 0.15, 0.15);
  //  newMeshes[0].rotate(new Vector3(-1, 0, 0), Math.PI / 2);
  ///  newMeshes[0].position.x = 2;
  //  newMeshes[0].position.z = -2;
  // freza = newMeshes[0];
  //});

  //před vykreslením se vždy provede
  scene.registerBeforeRender(function () {
    //sphere.position.x += 0.03;
    light1.setDirectionToTarget(sphere.position);
    var carMesh = data.meshes[0];
    carMesh.rotate(new Vector3(0, 0, 1), (carMesh.rotation.y += 0.00001));
    // freza.position.x += 0.01;
    // freza.rotate(new Vector3(0, 0, 1), (freza.rotation.y += 0.1));
    // console.log(freza.rotation.y)
    //freza.rotation.z += 0.05;
  });
  const frameRate = 10;
  const xSlide = new Animation(
    "xSlide",
    "position.x",
    frameRate,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CYCLE
  );

  const keyFrames = [];

  keyFrames.push({
    frame: 0,
    value: 2
  });

  keyFrames.push({
    frame: frameRate,
    value: -2
  });

  keyFrames.push({
    frame: 2 * frameRate,
    value: 2
  });

  xSlide.setKeys(keyFrames);

  //carMeshes.animations.push(xSlide);

  //scene.beginAnimation(carMeshes, 0, 2 * frameRate, true);

  // povinné vykreslování
  engine.runRenderLoop(function () {
    scene.render();
  });
  const environment1 = scene.createDefaultEnvironment({
    enableGroundShadow: true
  });

  const xrHelper = await scene.createDefaultXRExperienceAsync({
    floorMeshes: [environment1.ground]
  });
  environment1.setMainColor(new Color3.FromHexString("#74b9ff"));
  environment1.ground.parent.position.y = 0;
  environment1.ground.position.y = 0;

  //SceneLoader.ImportMeshAsync("", "./src/assets/glb/", "scene.glb");

  return scene;
};

var initFunction = async function () {
  var asyncEngineCreation = async function () {
    try {
      return createDefaultEngine();
    } catch (e) {
      console.log(
        "the available createEngine function failed. Creating the default engine instead"
      );
      return createDefaultEngine();
    }
  };

  engine = await asyncEngineCreation();
  //if (!engine) throw "engine should not be null.";
  scene = createScene();
};

initFunction().then(() => {
  scene.then((returnedScene) => {
    sceneToRender = returnedScene;
  });
  engine.runRenderLoop(function () {
    if (sceneToRender && sceneToRender.activeCamera) {
      sceneToRender.render();
    }
  });
});

// Resize
window.addEventListener("resize", function () {
  engine.resize();
});
