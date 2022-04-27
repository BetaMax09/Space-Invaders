import {Color3, GlowLayer, HemisphericLight, Scalar, Scene, UniversalCamera, Vector3} from "@babylonjs/core";
import spaceinvadersConfig from "../spaceinvaders.config";

export class Environment {

  clearColor = new Color3(0.01, 0.03, 0.1);

  constructor(engine) {
    this.isComplete = false;
    this.canvas = document.querySelector('canvas');
    this.engine = engine;
    this.scene = this.CreateScene();
    this.initLightsAndCamera();
    this.oldSchoolEffects();
    if (spaceinvadersConfig.actionCam) {
      this.createFog();
    }
    this.isComplete = true;
  }

  CreateScene() {
    const scene = new Scene(this.engine);
    if (spaceinvadersConfig.oldSchoolEffects.enabled) {
      this.clearColor = new Color3(0.05, 0.05, 0.15);
    }
    scene.clearColor = this.clearColor.toColor4(1);
    scene.collisionsEnabled = true;
    return scene;
  }

  oldSchoolEffects() {
    if (!spaceinvadersConfig.oldSchoolEffects.enabled) return;
    let glow = new GlowLayer("glow", this.scene);
    glow.intensity = spaceinvadersConfig.oldSchoolEffects.blurIntensity;
    glow.customEmissiveColorSelector = function (mesh, subMesh, material, result) {
      result.set(1, 1, 1, 0.5);
    };
    if (spaceinvadersConfig.oldSchoolEffects.scanLines) {
      document.querySelector('body').classList.add('scanlines');
    }
  }

  createFog() {
    this.scene.fogEnabled = true;
    this.scene.fogColor = this.clearColor;
    this.scene.fogMode = Scene.FOGMODE_LINEAR;
    this.scene.fogStart = 200;
    this.scene.fogEnd = 400;
    if (spaceinvadersConfig.actionCam) {
      this.scene.fogStart = 160;
      this.scene.fogEnd = 200;
    }
    this.scene.fogDensity = 0.1;
  }

  initLightsAndCamera() {
    this.camera = this.CreateCamera();
    this.light = new HemisphericLight('light', new Vector3(0, 0.5, -1), this.scene);
    this.light.intensity = 1;
  }

  actionCam(x) {
    if (spaceinvadersConfig.actionCam) {
      x = x / 2;
      this.camera.position.x = Scalar.Lerp(this.camera.position.x, x * 1.5, 0.05);
      this.camera.position.z = Scalar.Lerp(this.camera.position.z, -60 + (Math.abs(x / 4)), 0.05);
      this.camera.rotation.y = Scalar.Lerp(this.camera.rotation.y, -this.camera.position.x / 300, 0.05);
    }
  }

  CreateCamera() {
    let camera;
    if (spaceinvadersConfig.actionCam) {
      camera = new UniversalCamera("camera", new Vector3(0, -60, -60), this.scene);
    } else {
      camera = new UniversalCamera("camera", new Vector3(0, 50, -150), this.scene);
    }
    camera.setTarget(new Vector3(0, 50, 0));
    return camera;
  }
}