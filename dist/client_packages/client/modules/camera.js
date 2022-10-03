const CamerasManagerInfo = {
  gameplayCamera: null,
  activeCamera: null,
  interpCamera: null,
  interpActive: false,
  _events: new Map(),
  cameras: new Map([]),
};

mp.events.add("render", () => {
  if (
    CamerasManagerInfo.interpCamera &&
    CamerasManager.doesExist(CamerasManagerInfo.interpCamera) &&
    !CamerasManagerInfo.activeCamera.isInterpolating()
  ) {
    CamerasManager.fireEvent("stopInterp", CamerasManagerInfo.activeCamera);

    CamerasManagerInfo.interpCamera.setActive(false);
    CamerasManagerInfo.interpCamera.destroy();
    CamerasManagerInfo.interpCamera = null;
  }
});

const cameraSerialize = (camera) => {
  camera.setActiveCamera = (toggle) => {
    CamerasManager.setActiveCamera(camera, toggle);
  };

  camera.setActiveCameraWithInterp = (
    position,
    rotation,
    duration,
    easeLocation,
    easeRotation
  ) => {
    CamerasManager.setActiveCameraWithInterp(
      camera,
      position,
      rotation,
      duration,
      easeLocation,
      easeRotation
    );
  };
};

class CamerasManager {
  static on(eventName, eventFunction) {
    if (CamerasManagerInfo._events.has(eventName)) {
      const event = CamerasManagerInfo._events.get(eventName);

      if (!event.has(eventFunction)) {
        event.add(eventFunction);
      }
    } else {
      CamerasManagerInfo._events.set(eventName, new Set([eventFunction]));
    }
  }

  static fireEvent(eventName, ...args) {
    if (CamerasManagerInfo._events.has(eventName)) {
      const event = CamerasManagerInfo._events.get(eventName);

      event.forEach((eventFunction) => {
        eventFunction(...args);
      });
    }
  }

  static getCamera(name) {
    const camera = CamerasManagerInfo.cameras.get(name);

    if (typeof camera.setActiveCamera !== "function") {
      cameraSerialize(camera);
    }

    return camera;
  }

  static setCamera(name, camera) {
    CamerasManagerInfo.cameras.set(name, camera);
  }

  static hasCamera(name) {
    return CamerasManagerInfo.cameras.has(name);
  }

  static destroyCamera(camera) {
    if (this.doesExist(camera)) {
      if (camera === this.activeCamera) {
        this.activeCamera.setActive(false);
      }
      camera.destroy();
    }
  }

  static createCamera(name, type, position, rotation, fov) {
    const cam = mp.cameras.new(type, position, rotation, fov);
    cameraSerialize(cam);
    CamerasManagerInfo.cameras.set(name, cam);
    return cam;
  }

  static setActiveCamera(activeCamera, toggle) {
    if (!toggle) {
      if (this.doesExist(CamerasManagerInfo.activeCamera)) {
        CamerasManagerInfo.activeCamera = null;
        activeCamera.setActive(false);
        mp.game.cam.renderScriptCams(false, false, 0, false, false);
      }

      if (this.doesExist(CamerasManagerInfo.interpCamera)) {
        CamerasManagerInfo.interpCamera.setActive(false);
        CamerasManagerInfo.interpCamera.destroy();
        CamerasManagerInfo.interpCamera = null;
      }
    } else {
      if (this.doesExist(CamerasManagerInfo.activeCamera)) {
        CamerasManagerInfo.activeCamera.setActive(false);
      }
      CamerasManagerInfo.activeCamera = activeCamera;
      activeCamera.setActive(true);
      mp.game.cam.renderScriptCams(true, false, 0, false, false);
    }
  }

  static setActiveCameraWithInterp(
    activeCamera,
    position,
    rotation,
    duration,
    easeLocation,
    easeRotation
  ) {
    if (this.doesExist(CamerasManagerInfo.activeCamera)) {
      CamerasManagerInfo.activeCamera.setActive(false);
    }

    if (this.doesExist(CamerasManagerInfo.interpCamera)) {
      CamerasManager.fireEvent("stopInterp", CamerasManagerInfo.interpCamera);

      CamerasManagerInfo.interpCamera.setActive(false);
      CamerasManagerInfo.interpCamera.destroy();
      CamerasManagerInfo.interpCamera = null;
    }
    const interpCamera = mp.cameras.new(
      "default",
      activeCamera.getCoord(),
      activeCamera.getRot(2),
      activeCamera.getFov()
    );
    activeCamera.setCoord(position.x, position.y, position.z);
    activeCamera.setRot(rotation.x, rotation.y, rotation.z, 2);
    activeCamera.stopPointing();

    CamerasManagerInfo.activeCamera = activeCamera;
    CamerasManagerInfo.interpCamera = interpCamera;
    activeCamera.setActiveWithInterp(
      interpCamera.handle,
      duration,
      easeLocation,
      easeRotation
    );
    mp.game.cam.renderScriptCams(true, false, 0, false, false);

    CamerasManager.fireEvent("startInterp", CamerasManagerInfo.interpCamera);
  }

  static doesExist(camera) {
    return mp.cameras.exists(camera) && camera.doesExist();
  }

  static get activeCamera() {
    return CamerasManagerInfo.activeCamera;
  }

  static get gameplayCam() {
    if (!CamerasManagerInfo.gameplayCamera) {
      CamerasManagerInfo.gameplayCamera = mp.cameras.new("gameplay");
    }
    return CamerasManagerInfo.gameplayCamera;
  }
}

const proxyHandler = {
  get: (target, name, receiver) =>
    typeof CamerasManager[name] !== "undefined"
      ? CamerasManager[name]
      : CamerasManagerInfo.cameras.get(name),
};

const Camera = new Proxy({}, proxyHandler);

class FreeCamera {
  static ZOOM_SENSIVITY = 5;
  static ROTATE_SENSIVITY = 10;
  static ZOOM_TRANSITION_TIME = 50;
  static ROTATE_TRANSITION_TIME = 150;
  static MAX_RADIUS = 3;
  static MIN_RADIUS = 1;
  relativePos;
  currentPos;
  x = 0;
  y = 90;
  radius = 2;
  destroyStatus = false;
  fov = 60;
  render;
  cam;

  constructor(
    entity,
    offsetZ = 0,
    minRadius = FreeCamera.MIN_RADIUS,
    maxRadius = FreeCamera.MAX_RADIUS,
    defaultRadius = (maxRadius + minRadius) / 2
  ) {
    this.entity = entity;
    this.offsetZ = offsetZ;
    this.minRadius = minRadius;
    this.maxRadius = maxRadius;

    let { x, y, z } = this.entity.position;

    this.radius = defaultRadius;

    this.relativePos = new mp.Vector3(x, y, z);
    this.currentPos = FreeCamera.polar3DToWorld3D(
      this.relativePos,
      this.radius,
      this.x,
      this.y
    );
    this.cam = Camera.createCamera(
      "",
      "default",
      this.currentPos,
      new mp.Vector3(0, 0, 0),
      this.fov
    );
    this.cam.setActiveCamera(true);
    this.smoothInterpolatePos(0);

    this.render = () => {
      const { x, y, z } = this.entity.position;
      this.cam.pointAtCoord(x, y, z + this.offsetZ);
    };

    mp.events.add("render", this.render);
  }

  setActiveCamera(toggle) {
    this.cam.setActiveCamera(toggle);
  }

  destroy() {
    this.destroyStatus = true;
    mp.events.remove("render", this.render);
    Camera.destroyCamera(this.cam);
  }

  setOffsetZ(offsetZ) {
    this.offsetZ = offsetZ;

    this.smoothInterpolatePos(FreeCamera.ROTATE_TRANSITION_TIME);
  }

  zoom(delta) {
    if (this.destroyStatus) return;

    this.radius += delta / FreeCamera.ZOOM_SENSIVITY;

    if (this.radius <= this.minRadius) {
      this.radius = this.minRadius;
    }

    if (this.radius >= this.maxRadius) {
      this.radius = this.maxRadius;
    }

    this.smoothInterpolatePos(FreeCamera.ZOOM_TRANSITION_TIME);
  }

  rotate(deltaX, deltaY) {
    if (this.destroyStatus) return;

    this.x += deltaX / FreeCamera.ROTATE_SENSIVITY;
    this.y += deltaY / FreeCamera.ROTATE_SENSIVITY;

    if (this.y > 170) {
      this.y = 170;
    }

    if (this.y < 20) {
      this.y = 20;
    }

    this.smoothInterpolatePos(FreeCamera.ROTATE_TRANSITION_TIME);
  }

  smoothInterpolatePos(transitionTime) {
    if (this.destroyStatus) return;

    let { x, y, z } = this.entity.position;

    const newRelativePos = new mp.Vector3(x, y, z);

    let newPos = FreeCamera.polar3DToWorld3D(
      newRelativePos,
      this.radius,
      this.x,
      this.y
    ); // Новая позиция камеры;

    const ray = mp.raycasting.testPointToPoint(
      newRelativePos,
      newPos.add(new mp.Vector3(0, 0, this.offsetZ - 0.25)),
      this.entity,
      1 | 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256
    );

    if (ray) {
      ray.position.z -= this.offsetZ - 0.25;
      newPos = ray.position;
    }

    const newCam = Camera.createCamera(
      "",
      "default",
      newPos,
      new mp.Vector3(0, 0, 0),
      this.fov
    );
    let [offsetX, offsetY, offsetZ] = [
      newPos.x - x,
      newPos.y - y,
      newPos.z - z,
    ];

    newCam.pointAtCoord(x, y, z + this.offsetZ);
    newCam.setActiveWithInterp(this.cam.handle, transitionTime, 0, 0);
    newCam.attachTo(
      this.entity.handle,
      offsetX,
      offsetY,
      offsetZ + this.offsetZ,
      false
    );

    const oldCam = this.cam;
    this.cam = newCam;

    setTimeout(() => {
      Camera.destroyCamera(oldCam);
    }, transitionTime * 2);
  }

  static degToRad(deg) {
    return (Math.PI * deg) / 180;
  }

  static polar3DToWorld3D(
    entityPosition,
    radius,
    polarAngleDeg,
    azimuthAngleDeg
  ) {
    const polarAngleRad = this.degToRad(polarAngleDeg);
    const azimuthAngleRad = this.degToRad(azimuthAngleDeg);

    const x =
      entityPosition.x +
      radius * Math.sin(azimuthAngleRad) * Math.cos(polarAngleRad);
    const y =
      entityPosition.y -
      radius * Math.sin(azimuthAngleRad) * Math.sin(polarAngleRad);
    const z = entityPosition.z - radius * Math.cos(azimuthAngleRad);

    return new mp.Vector3(x, y, z);
  }
}

exports = FreeCamera;
