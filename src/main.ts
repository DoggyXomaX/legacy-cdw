type TimeoutId = number;
type IntervalId = number;

const globalScale = 3.0;

class EditFrame {
  element: HTMLElement;
  file: HTMLInputElement;
  button: HTMLButtonElement;

  constructor(elementId: string, fileId: string, buttonId: string) {
    this.element = document.getElementById(elementId) as HTMLElement;
    this.file = document.getElementById(fileId) as HTMLInputElement;
    this.button = document.getElementById(buttonId) as HTMLButtonElement;
  }
}

class CDWFrame {
  element: HTMLElement;
  background: HTMLElement;
  image: HTMLImageElement;
  foreground: HTMLElement;
  audio: HTMLAudioElement;

  constructor(elementId: string, backgroundId: string, imageId: string, foregroundId: string, audioId: string) {
    this.element = document.getElementById(elementId) as HTMLElement;
    this.background = document.getElementById(backgroundId) as HTMLElement;
    this.image = document.getElementById(imageId) as HTMLImageElement;
    this.foreground = document.getElementById(foregroundId) as HTMLElement;
    this.audio = document.getElementById(audioId) as HTMLAudioElement;
  }
}

class App {
  imageScale: number = 3;
  editFrame: EditFrame;
  cdwFrame: CDWFrame;
  opacity: number = 1;
  timer: TimeoutId;
  fullTime: TimeoutId;
  opacityUpdater: IntervalId;

  readonly WaitDelay: number = 7800;
  readonly FullDelay: number = 14000;
  readonly OpacityIntervalDelay: number = 100;
  readonly OpacityDelta: number = 0.05;

  Init() {
    this.editFrame = new EditFrame('edit', 'edit-file', 'edit-button');
    this.cdwFrame = new CDWFrame('cdw', 'cdw-background', 'cdw-image', 'cdw-foreground', 'cdw-audio');

    const tempImage = document.createElement('img');
    tempImage.addEventListener('load', () => this.UpdateSizeByImage(tempImage));
    tempImage.src = './img/background.png';

    this.editFrame.button.addEventListener('click', () => this.ProceedCDW());
  }

  UpdateSizeByImage(img: HTMLImageElement) {
    const widthPx = `${img.naturalWidth * this.imageScale}px`;
    const heightPx = `${img.naturalHeight * this.imageScale}px`;

    this.cdwFrame.background.style.width = widthPx;
    this.cdwFrame.background.style.height = heightPx;
    this.cdwFrame.image.style.width = widthPx;
    this.cdwFrame.image.style.height = heightPx;
    this.cdwFrame.foreground.style.width = widthPx;
    this.cdwFrame.foreground.style.height = heightPx;
  }

  ProceedCDW() {
    if (this.editFrame.file.files === null) return;

    this.cdwFrame.image.src = '';
    this.cdwFrame.image.addEventListener('load', () => this.LoadComplete());
    this.cdwFrame.image.src = window.URL.createObjectURL(this.editFrame.file.files[0]);
  }

  LoadComplete() {
    console.log('this:', this);

    this.opacity = 1;
    this.timer = setTimeout(() => this.WaitEnd(), this.WaitDelay);
    this.fullTime = setTimeout(() => this.FullEnd(), this.FullDelay);
    this.cdwFrame.image.style.opacity = `${this.opacity}`;

    this.editFrame.element.hidden = true;
    this.cdwFrame.element.hidden = false;

    this.cdwFrame.audio.currentTime = 0;
    this.cdwFrame.audio.play();
  }

  OpacityUpdate() {
    this.opacity -= this.OpacityDelta;
    if (this.opacity < 0) {
      this.opacity = 0;
      clearInterval(this.opacityUpdater);
    }
    this.cdwFrame.image.style.opacity = this.opacity.toString();
  }

  WaitEnd() {
    this.opacityUpdater = setInterval(() => this.OpacityUpdate(), this.OpacityIntervalDelay);
  }

  FullEnd() {
    this.cdwFrame.audio.pause();
    this.cdwFrame.element.hidden = true;
    this.editFrame.element.hidden = false;
  }
}

const app = new App();
window.onload = () => app.Init();
