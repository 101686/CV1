import "./styles.css"; // keep this here!

// naimportujte vše co je potřeba z BabylonJS
import {
  Engine,
  Scene,
  MeshBuilder,
  StandardMaterial,
  DirectionalLight,
  Vector3,
  Color3,
  SixDofDragBehavior,
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

  const freza1 = await SceneLoader.ImportMeshAsync(
    "",
    "public/",
    "freza.glb",
    scene
  );
  // .then(function(newMeshes){
  //   newMeshes.meshes[0].scaling = new Vector3(0.1, 0.1, 0.07);
  //   newMeshes.meshes[0].rotate(new Vector3(-1, 0, 0), Math.PI / 2);
  //   //newMeshes.meshes[0].position.x = 2;
  //   newMeshes.meshes[0].position.z = 2;
  // });
  var frezaMesh1 = freza1.meshes[0];
  frezaMesh1.rotate(new Vector3(0, 0, 1), (frezaMesh1.rotation.y += 0.00001));

  frezaMesh1.scaling = new Vector3(0.1, 0.1, 0.07);
  frezaMesh1.rotate(new Vector3(-1, 0, 0), Math.PI / 2);
  frezaMesh1.position.x = -1;
  frezaMesh1.position.z = -2;

  var FrezaFunction = async function () {
    const freza2 = await SceneLoader.ImportMeshAsync(
      "",
      "public/",
      "endmill.glb",
      scene
    );
    var frezaMesh2 = freza2.meshes[0];
    frezaMesh2.rotate(new Vector3(0, 0, 1), (frezaMesh2.rotation.y += 0.00001));

    frezaMesh2.scaling = new Vector3(0.15, 0.15, 0.15);
    frezaMesh2.rotate(new Vector3(-1, 0, 0), Math.PI / 2);
    frezaMesh2.position.x = 2;
    frezaMesh2.position.z = -2;
    var sixDofDragBehavior = new SixDofDragBehavior();
    sixDofDragBehavior.rotateDraggedObject = true;
    // sixDofDragBehavior. = false;
    let frezasubmesh = new Mesh();
    frezasubmesh = frezaMesh2;
    frezasubmesh.addBehavior(sixDofDragBehavior);
    //před vykreslením se vždy provede
    scene.registerBeforeRender(function () {
      //sphere.position.x += 0.03;
      light1.setDirectionToTarget(sphere.position);
      if (frezaMesh1.position.x > -1) {
        frezaMesh1.rotate(
          new Vector3(0, 0, 1),
          (frezaMesh1.rotation.y += 0.001)
        );
      }

      frezaMesh2.rotate(new Vector3(0, 0, 1), (frezaMesh2.rotation.y += 0.001));
    });
  };

  FrezaFunction();

  var animationFunction = function () {
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
      value: 1
    });

    keyFrames.push({
      frame: frameRate,
      value: -2
    });

    keyFrames.push({
      frame: 2 * frameRate,
      value: 1
    });

    xSlide.setKeys(keyFrames);
    frezaMesh1.animations.push(xSlide);
    scene.beginAnimation(frezaMesh1, 0, 2 * frameRate, true);
  };
  animationFunction();
  // povinné vykreslování
  engine.runRenderLoop(function () {
    scene.render();
  });
  const environment1 = scene.createDefaultEnvironment({
    enableGroundShadow: true
  });

  await scene.createDefaultXRExperienceAsync({
    floorMeshes: [environment1.ground]
  });
  environment1.setMainColor(new Color3.FromHexString("#74b9ff"));
  environment1.ground.parent.position.y = 0;
  environment1.ground.position.y = 0;
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
  // if (!engine) throw "engine should not be null.";
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
