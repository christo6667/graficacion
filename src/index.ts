import { Obj3D } from './Obj3D.js';
import { CvHLines } from './CvHLines.js';
import { Rota3D } from './Rota3D.js';
import { Point3D } from './point3D.js';

let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('circlechart');
let graphics: CanvasRenderingContext2D = canvas.getContext('2d');
let cv: CvHLines;
let obj: Obj3D;

let intervaloMinutero: any = null;
let intervaloHora: any = null;
let animacionActiva = true;

function leerArchivo(e: any) {
  let archivo = e.target.files[0];
  if (!archivo) return;

  let lector = new FileReader();
  lector.onload = function (e: any) {
    let contenido = e.target.result;
    mostrarContenido(contenido);

    obj = new Obj3D();
    if (obj.read(contenido)) {
      cv = new CvHLines(graphics, canvas);
      cv.setObj(obj);
      cv.paint();
      reiniciarAnimaciones();
    }
  };
  lector.readAsText(archivo);
}

function mostrarContenido(contenido: string) {
  let elemento = document.getElementById('contenido-archivo');
  if (elemento) elemento.textContent = contenido;
}

function moverMinuteroDer() {
  let angulo = 3 * Math.PI / 180;
  let ejeA = new Point3D(0.011, -0.5, 0);
  let ejeB = new Point3D(0.011, -2.5, 0);

  Rota3D.initRotate(ejeA, ejeB, angulo);
  for (let i = 197; i <= 206; i++) obj.w[i] = Rota3D.rotate(obj.w[i]);
  cv.paint();
}

function moverMinuteroIzq() {
  let angulo = -3 * Math.PI / 180;
  let ejeA = new Point3D(0.011, -0.5, 0);
  let ejeB = new Point3D(0.011, -2.5, 0);

  Rota3D.initRotate(ejeA, ejeB, angulo);
  for (let i = 197; i <= 206; i++) obj.w[i] = Rota3D.rotate(obj.w[i]);
  cv.paint();
}

function moverHoraDer() {
  let angulo = 1 * Math.PI / 180;
  let ejeA = new Point3D(0.011, -0.5, 0);
  let ejeB = new Point3D(0.011, -2.5, 0);

  Rota3D.initRotate(ejeA, ejeB, angulo);
  for (let i = 207; i <= 216; i++) obj.w[i] = Rota3D.rotate(obj.w[i]);
  cv.paint();
}

function moverHoraIzq() {
  let angulo = -1 * Math.PI / 180;
  let ejeA = new Point3D(0.011, -0.5, 0);
  let ejeB = new Point3D(0.011, -2.5, 0);

  Rota3D.initRotate(ejeA, ejeB, angulo);
  for (let i = 207; i <= 216; i++) obj.w[i] = Rota3D.rotate(obj.w[i]);
  cv.paint();
}

function moverMinuteroAuto() {
  if (!obj || !cv) return;
  moverMinuteroDer();
}

function moverHoraAuto() {
  if (!obj || !cv) return;

  let angulo = 0.25 * Math.PI / 180;
  let ejeA = new Point3D(0.011, -0.5, 0);
  let ejeB = new Point3D(0.011, -2.5, 0);

  Rota3D.initRotate(ejeA, ejeB, angulo);
  for (let i = 207; i <= 216; i++) obj.w[i] = Rota3D.rotate(obj.w[i]);
  cv.paint();
}

function reiniciarAnimaciones() {
  animacionActiva = true;

  if (intervaloMinutero) clearInterval(intervaloMinutero);
  if (intervaloHora) clearInterval(intervaloHora);

  intervaloMinutero = setInterval(() => { if (animacionActiva) moverMinuteroAuto(); }, 100);
  intervaloHora = setInterval(() => { if (animacionActiva) moverHoraAuto(); }, 100);

  let btn = document.getElementById('btnAuto');
  if (btn) {
    btn.textContent = "Detener";
    btn.className = "btn btn-outline-danger w-100 mb-3";
  }
}

function pausarAnimacion() {
  animacionActiva = false;

  if (intervaloMinutero) clearInterval(intervaloMinutero);
  if (intervaloHora) clearInterval(intervaloHora);

  let btn = document.getElementById('btnAuto');
  if (btn) {
    btn.textContent = "Activar";
    btn.className = "btn btn-danger w-100 mb-3";
  }
}

function activarAnimacion() {
  if (animacionActiva) {
    pausarAnimacion();
  } else {
    reiniciarAnimaciones();
  }
}

document.getElementById('velocidad')?.addEventListener('input', (e: any) => {
  let vel = parseInt(e.target.value);

  if (animacionActiva) {
    clearInterval(intervaloMinutero);
    clearInterval(intervaloHora);

    intervaloMinutero = setInterval(() => { if (animacionActiva) moverMinuteroAuto(); }, vel);
    intervaloHora = setInterval(() => { if (animacionActiva) moverHoraAuto(); }, vel * 2);
  }
});

function vp(dTheta: number, dPhi: number, fRho: number): void {
  if (obj != undefined) {
    let objeto = cv.getObj();
    if (!objeto.vp(cv, dTheta, dPhi, fRho)) alert('Datos no válidos');
  }
}

let Pix: number;
let Piy: number;
let flag = false;

function handleMouse(evento: any) {
  Pix = evento.offsetX;
  Piy = evento.offsetY;
  flag = true;
}

function makeVisualization(evento: any) {
  if (!flag) return;

  let Pfx = evento.offsetX;
  let Pfy = evento.offsetY;
  let difX = Pix - Pfx;
  let difY = Pfy - Piy;

  vp(0, 0.1 * difY / 50, 1);
  vp(0.1 * difX / 50, 0, 1);

  Pix = Pfx;
  Piy = Pfy;
}

function noDraw() {
  flag = false;
}

canvas.addEventListener('mousedown', handleMouse);
canvas.addEventListener('mouseup', noDraw);
canvas.addEventListener('mousemove', makeVisualization);

document.getElementById('file-input')?.addEventListener('change', leerArchivo);
document.getElementById('minDer')?.addEventListener('click', () => { pausarAnimacion(); moverMinuteroDer(); });
document.getElementById('minIzq')?.addEventListener('click', () => { pausarAnimacion(); moverMinuteroIzq(); });
document.getElementById('horaDer')?.addEventListener('click', () => { pausarAnimacion(); moverHoraDer(); });
document.getElementById('horaIzq')?.addEventListener('click', () => { pausarAnimacion(); moverHoraIzq(); });
document.getElementById('btnAuto')?.addEventListener('click', activarAnimacion);

function cargarArchivoAutomatico() {
  fetch('RelojTerminado.txt')
    .then(r => r.text())
    .then(contenido => {
      mostrarContenido(contenido);
      obj = new Obj3D();

      if (obj.read(contenido)) {
        cv = new CvHLines(graphics, canvas);
        cv.setObj(obj);
        cv.paint();
        reiniciarAnimaciones();
      }
    })
    .catch(err => console.error(err));
}

window.addEventListener('DOMContentLoaded', () => {
  cargarArchivoAutomatico();
});