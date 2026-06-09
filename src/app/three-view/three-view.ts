import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  inject,
  viewChild,
} from '@angular/core';
import {
  AmbientLight,
  BoxGeometry,
  Color,
  DirectionalLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';

@Component({
  selector: 'app-three-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #canvas></canvas>`,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      canvas {
        display: block;
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class ThreeViewComponent implements AfterViewInit, OnDestroy {
  private readonly zone = inject(NgZone);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  private renderer?: WebGLRenderer;
  private scene?: Scene;
  private camera?: PerspectiveCamera;
  private cube?: Mesh;
  private frameHandle = 0;
  private resizeObserver?: ResizeObserver;

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => this.initScene());
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.frameHandle);
    this.resizeObserver?.disconnect();

    this.cube?.geometry.dispose();
    if (this.cube?.material instanceof MeshStandardMaterial) {
      this.cube.material.dispose();
    }
    this.renderer?.dispose();
  }

  private initScene(): void {
    const canvas = this.canvasRef().nativeElement;
    const hostEl = this.host.nativeElement;

    const scene = new Scene();
    scene.background = new Color(0x1e1e1e);

    const camera = new PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.set(2.5, 2, 3);
    camera.lookAt(0, 0, 0);

    const renderer = new WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);

    scene.add(new AmbientLight(0xffffff, 0.4));
    const dirLight = new DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const cube = new Mesh(
      new BoxGeometry(1, 1, 1),
      new MeshStandardMaterial({ color: 0x3a86ff, roughness: 0.4, metalness: 0.1 }),
    );
    scene.add(cube);

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.cube = cube;

    this.resize(hostEl.clientWidth, hostEl.clientHeight);

    this.resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      const { width, height } = entry.contentRect;
      this.resize(width, height);
    });
    this.resizeObserver.observe(hostEl);

    const animate = (): void => {
      this.frameHandle = requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.012;
      renderer.render(scene, camera);
    };
    animate();
  }

  private resize(width: number, height: number): void {
    if (!this.renderer || !this.camera || width === 0 || height === 0) return;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
}
