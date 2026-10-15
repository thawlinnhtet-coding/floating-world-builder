// Render catalog thumbnails once in the existing WebGL context.
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useGame } from "./store";
import type { Kind } from "./world";

export function CatalogPreviews() {
  const { gl, scene } = useThree();
  useEffect(() => {
    if (Object.keys(useGame.getState().previews).length) return;
    const models = new Map<Kind, THREE.Object3D>();
    scene.traverse((object) => {
      const kind = object.userData.catalogKind as Kind | undefined;
      if (kind === "tree" && object.userData.previewSeed % 5 === 4) return;
      if (kind && !models.has(kind)) models.set(kind, object);
    });
    const width = 192,
      height = 160;
    const target = new THREE.WebGLRenderTarget(width, height, {
      type: THREE.UnsignedByteType,
      colorSpace: THREE.SRGBColorSpace,
    });
    const oldTarget = gl.getRenderTarget(),
      oldColor = gl.getClearColor(new THREE.Color()),
      oldAlpha = gl.getClearAlpha(),
      oldShadows = gl.shadowMap.enabled;
    const pixels = new Uint8Array(width * height * 4);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;
    const previews: Partial<Record<Kind, string>> = {};
    gl.shadowMap.enabled = false;
    gl.setClearColor(0x000000, 0);
    for (const [kind, source] of models) {
      const stage = new THREE.Scene();
      stage.environment = scene.environment;
      const model = source.clone(true);
      model.visible = true;
      model.position.set(0, 0, 0);
      model.rotation.set(0, 0, 0);
      stage.add(model);
      stage.add(new THREE.HemisphereLight("#e7f2ef", "#a7a17d", 1.4));
      const sun = new THREE.DirectionalLight("#fff1d5", 2.5);
      sun.position.set(-3, 5, 6);
      stage.add(sun);
      stage.updateMatrixWorld(true);
      const bounds = new THREE.Box3().setFromObject(model),
        size = bounds.getSize(new THREE.Vector3()),
        center = bounds.getCenter(new THREE.Vector3());
      const span = Math.max(size.x, size.y, size.z) * 1.4,
        aspect = width / height;
      const camera = new THREE.OrthographicCamera(
        (-span * aspect) / 2,
        (span * aspect) / 2,
        span / 2,
        -span / 2,
        0.01,
        60,
      );
      camera.position
        .copy(center)
        .add(new THREE.Vector3(4, 2.8, 5).normalize().multiplyScalar(12));
      camera.lookAt(center);
      camera.updateMatrixWorld(true);
      gl.setRenderTarget(target);
      gl.clear();
      gl.render(stage, camera);
      gl.readRenderTargetPixels(target, 0, 0, width, height, pixels);
      const data = ctx.createImageData(width, height);
      for (let y = 0; y < height; y++)
        data.data.set(
          pixels.subarray(
            (height - y - 1) * width * 4,
            (height - y) * width * 4,
          ),
          y * width * 4,
        );
      ctx.putImageData(data, 0, 0);
      previews[kind] = canvas.toDataURL("image/png");
    }
    gl.setRenderTarget(oldTarget);
    gl.setClearColor(oldColor, oldAlpha);
    gl.shadowMap.enabled = oldShadows;
    target.dispose();
    useGame.getState().patch({ previews });
  }, [gl, scene]);
  return null;
}
