import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ThreeViewComponent } from './three-view/three-view';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ThreeViewComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('Test3DApp');
}
