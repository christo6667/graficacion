var _a, _b, _c, _d, _e, _f, _g;
import { Obj3D } from './Obj3D.js';
import { CvHLines } from './CvHLines.js';
import { Rota3D } from './Rota3D.js';
import { Point3D } from './point3D.js';
let canvas = document.getElementById('circlechart');
let graphics = canvas.getContext('2d');
let cv;
let obj;
let intervaloMinutero = null;
let intervaloHora = null;
let animacionActiva = true;
function leerArchivo(e) {
    let archivo = e.target.files[0];
    if (!archivo)
        return;
    let lector = new FileReader();
    lector.onload = function (e) {
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
function mostrarContenido(contenido) {
    let elemento = document.getElementById('contenido-archivo');
    if (elemento)
        elemento.textContent = contenido;
}
function moverMinuteroDer() {
    let angulo = 3 * Math.PI / 180;
    let ejeA = new Point3D(0.011, -0.5, 0);
    let ejeB = new Point3D(0.011, -2.5, 0);
    Rota3D.initRotate(ejeA, ejeB, angulo);
    for (let i = 197; i <= 206; i++)
        obj.w[i] = Rota3D.rotate(obj.w[i]);
    cv.paint();
}
function moverMinuteroIzq() {
    let angulo = -3 * Math.PI / 180;
    let ejeA = new Point3D(0.011, -0.5, 0);
    let ejeB = new Point3D(0.011, -2.5, 0);
    Rota3D.initRotate(ejeA, ejeB, angulo);
    for (let i = 197; i <= 206; i++)
        obj.w[i] = Rota3D.rotate(obj.w[i]);
    cv.paint();
}
function moverHoraDer() {
    let angulo = 1 * Math.PI / 180;
    let ejeA = new Point3D(0.011, -0.5, 0);
    let ejeB = new Point3D(0.011, -2.5, 0);
    Rota3D.initRotate(ejeA, ejeB, angulo);
    for (let i = 207; i <= 216; i++)
        obj.w[i] = Rota3D.rotate(obj.w[i]);
    cv.paint();
}
function moverHoraIzq() {
    let angulo = -1 * Math.PI / 180;
    let ejeA = new Point3D(0.011, -0.5, 0);
    let ejeB = new Point3D(0.011, -2.5, 0);
    Rota3D.initRotate(ejeA, ejeB, angulo);
    for (let i = 207; i <= 216; i++)
        obj.w[i] = Rota3D.rotate(obj.w[i]);
    cv.paint();
}
function moverMinuteroAuto() {
    if (!obj || !cv)
        return;
    moverMinuteroDer();
}
function moverHoraAuto() {
    if (!obj || !cv)
        return;
    let angulo = 0.25 * Math.PI / 180;
    let ejeA = new Point3D(0.011, -0.5, 0);
    let ejeB = new Point3D(0.011, -2.5, 0);
    Rota3D.initRotate(ejeA, ejeB, angulo);
    for (let i = 207; i <= 216; i++)
        obj.w[i] = Rota3D.rotate(obj.w[i]);
    cv.paint();
}
function reiniciarAnimaciones() {
    animacionActiva = true;
    if (intervaloMinutero)
        clearInterval(intervaloMinutero);
    if (intervaloHora)
        clearInterval(intervaloHora);
    intervaloMinutero = setInterval(() => { if (animacionActiva)
        moverMinuteroAuto(); }, 100);
    intervaloHora = setInterval(() => { if (animacionActiva)
        moverHoraAuto(); }, 100);
    let btn = document.getElementById('btnAuto');
    if (btn) {
        btn.textContent = "Detener";
        btn.className = "btn btn-outline-danger w-100 mb-3";
    }
}
function pausarAnimacion() {
    animacionActiva = false;
    if (intervaloMinutero)
        clearInterval(intervaloMinutero);
    if (intervaloHora)
        clearInterval(intervaloHora);
    let btn = document.getElementById('btnAuto');
    if (btn) {
        btn.textContent = "Activar";
        btn.className = "btn btn-danger w-100 mb-3";
    }
}
function activarAnimacion() {
    if (animacionActiva) {
        pausarAnimacion();
    }
    else {
        reiniciarAnimaciones();
    }
}
(_a = document.getElementById('velocidad')) === null || _a === void 0 ? void 0 : _a.addEventListener('input', (e) => {
    let vel = parseInt(e.target.value);
    if (animacionActiva) {
        clearInterval(intervaloMinutero);
        clearInterval(intervaloHora);
        intervaloMinutero = setInterval(() => { if (animacionActiva)
            moverMinuteroAuto(); }, vel);
        intervaloHora = setInterval(() => { if (animacionActiva)
            moverHoraAuto(); }, vel * 2);
    }
});
function vp(dTheta, dPhi, fRho) {
    if (obj != undefined) {
        let objeto = cv.getObj();
        if (!objeto.vp(cv, dTheta, dPhi, fRho))
            alert('Datos no válidos');
    }
}
let Pix;
let Piy;
let flag = false;
function handleMouse(evento) {
    Pix = evento.offsetX;
    Piy = evento.offsetY;
    flag = true;
}
function makeVisualization(evento) {
    if (!flag)
        return;
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
(_b = document.getElementById('file-input')) === null || _b === void 0 ? void 0 : _b.addEventListener('change', leerArchivo);
(_c = document.getElementById('minDer')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => { pausarAnimacion(); moverMinuteroDer(); });
(_d = document.getElementById('minIzq')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', () => { pausarAnimacion(); moverMinuteroIzq(); });
(_e = document.getElementById('horaDer')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', () => { pausarAnimacion(); moverHoraDer(); });
(_f = document.getElementById('horaIzq')) === null || _f === void 0 ? void 0 : _f.addEventListener('click', () => { pausarAnimacion(); moverHoraIzq(); });
(_g = document.getElementById('btnAuto')) === null || _g === void 0 ? void 0 : _g.addEventListener('click', activarAnimacion);
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
