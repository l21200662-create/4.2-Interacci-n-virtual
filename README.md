# Laboratorio inmersivo de clasificación geométrica

Evolución de la práctica web 3.1: aplicación estática con Three.js, WebXR y `cannon-es`. Hay cuatro clases, cinco piezas por clase (20 cuerpos dinámicos), cuatro mesas de origen y cuatro recipientes abiertos. El ratón sirve para inspeccionar y demostrar en escritorio; la interacción de manos necesita un visor compatible y no se simula en escritorio.

## Decisiones y arquitectura

- `index.html`: portada responsiva, Bootstrap 5.3.3, favicon, import map completo y rutas relativas.
- `src/main.js`: WebXR y seguimiento de manos, raycasting, pinza con histéresis, simulación Cannon, agarre cinemático/soltado dinámico, reglas, cronómetro y score.
- `src/lab.js`: escena y geometrías Three.js, mesas, contenedores, botones y HUD inmersivo.
- Three.js `0.170.0` y cannon-es `0.20.0`, fijados en import map para CDN, sin Node/npm/bundler. `cannon-es` se usa como motor de cuerpo rígido: gravedad `-9.82 m/s²`, paso fijo 1/60 s con hasta cuatro subpasos, solver de 8 iteraciones, damping y restitución moderada.
- Los colisionadores son independientes de la apariencia: esfera = esfera r=0.105; cubo = caja 0.21 m; pirámide = caja conservadora 0.21 m (la malla es cono cuadrado); prisma hexagonal = cilindro hexagonal radio 0.12, alto 0.18. Mesas, suelo, bases y cuatro paredes de cada recipiente son cuerpos estáticos. Las piezas pueden chocar entre sí.
- No hay modelos, imágenes ni sonidos descargados. Geometrías, etiquetas y favicon son originales del proyecto; Three.js y Bootstrap son MIT, cannon-es es MIT. El sonido corto se sintetiza localmente con Web Audio.

## Distribución y reglas

Vista superior orientativa (el usuario queda frente al borde sur):

```text
       Mesa A       Mesa B
       (-1.35,-1.4) (+1.35,-1.4)
   Mesa C       Mesa D       Panel
   (-1.35,.8)   (+1.35,.8)   (-1.05,2.05,-2.65)
     Esferas Cubos Pirámides Prismas   ← botes al norte
                         usuario/cámara (z positivo)
```

Los objetos se barajan en cada inicio/reinicio, cinco por mesa, sobre cinco posiciones separadas con una pequeña variación aleatoria. Hay cinco instancias de cada geometría y una identificación estable por pieza. La física puede desplazarlas después del primer contacto.

La partida comienza al pulsar **COMENZAR**, no al cargar ni entrar en VR. El agarre cambia el cuerpo a cinemático; la suelta lo devuelve a dinámico. Para evitar doble conteo, cada cuerpo se procesa una sola vez. Un acierto exige que permanezca al menos 0.55 s dentro del volumen del recipiente correcto con velocidad lineal <0.24 y angular <0.7. Un objeto estabilizado en un recipiente equivocado genera un intento y error; objetos fuera de los recipientes no alteran el score. Precisión = aciertos/depósitos estabilizados confirmados × 100. Los tiempos por bote se cuentan desde Comenzar hasta que clasifica su quinta pieza; antes indican pendiente. Al salir de VR se libera el objeto sujeto y se pausa el reloj; al volver se pulsa Comenzar para reanudar acumulando el tiempo. Completar 20/20 detiene el reloj.

Las piezas que caen al piso permanecen como cuerpos dinámicos agarrables. Reiniciar destruye cuerpos y mallas anteriores, reinicia métricas y genera un nuevo barajado. Las sesiones y seguimiento de manos no se declaran verificados sin Quest 3.

## Ejecutar localmente

1. Abre esta carpeta en Visual Studio Code e inicia `index.html` con Live Server (no uses `file://`).
2. La vista previa en computadora permite ver caída, colisiones, agarrar con el ratón después de activar COMENZAR, depositar y reiniciar.
3. Abre el sitio publicado por HTTPS en Meta Quest Browser para probar `immersive-vr` y seguimiento genuino de manos. En Quest, apunta con el índice, pellizca índice-pulgar para sujetar y vuelve a pellizcar para soltar. No hacen falta mandos.

## GitHub Pages

El repositorio está publicado mediante **Settings → Pages → Deploy from a branch → main → /(root)**. URL HTTPS: [https://l21200662-create.github.io/4.2-Interacci-n-virtual/](https://l21200662-create.github.io/4.2-Interacci-n-virtual/). El sitio, CSS, favicon, módulos del proyecto y módulos CDN respondieron HTTP 200 al verificarlos; la escena 3D cargó en el navegador de escritorio integrado. La sesión WebXR no está disponible en ese navegador y necesita prueba en Meta Quest 3.

## Matriz de aceptación

`Pendiente` significa que no se ha ejecutado la prueba. Cambia observado y adjunta captura/grabación solo al realizarla. La fila de dispositivo requiere Quest 3 real.

| # | Requisito | Procedimiento | Esperado | Observado | Evidencia |
|---|---|---|---|---|---|
| 1 | Práctica anterior, portada responsive, favicon y créditos | Revisar portada en escritorio/móvil y assets | Evolución identificada, portada legible | Pendiente | Pendiente |
| 2 | immersive-vr HTTPS en Quest 3 | Abrir Pages en Quest Browser e iniciar | Sesión VR activa | NO PROBADO | Pendiente |
| 3 | Dos manos, pinza sin mandos | Probar mano izquierda y derecha | Ambas toman y sueltan | NO PROBADO | Pendiente |
| 4 | Cuatro mesas y cinco piezas por mesa | Inspeccionar escena inicial | 4 mesas, 5 objetos/mesa | Pendiente | Pendiente |
| 5 | Veinte piezas, cinco por categoría | Contar ids/figuras | 20 total y 5 de cada clase | Pendiente | Pendiente |
| 6 | Reinicio aleatorio sin solape inicial | Reiniciar varias veces e inspeccionar | Otra distribución sin piezas suspendidas/solapadas | Pendiente | Pendiente |
| 7 | Cuatro recipientes abiertos con colisiones | Dejar caer objetos sobre base y paredes | Base y cuatro lados detienen objetos | Pendiente | Pendiente |
| 8 | Gravedad, rebote y reposo | Soltar una pieza sobre mesa y piso | Caída dinámica, rebote moderado y reposo | Pendiente | Pendiente |
| 9 | Choques entre piezas y botes | Dejar caer piezas juntas y en recipiente | Contactos sin atravesar paredes | Pendiente | Pendiente |
| 10 | Agarre cinemático y liberación dinámica | Tomar y soltar | Al soltar vuelve gravedad y colisiones | Pendiente | Pendiente |
| 11 | Acierto estable y sin duplicados | Depositar pieza correcta y esperar | Un solo acierto tras estabilizar | Pendiente | Pendiente |
| 12 | Tres errores confirmados | Depositar objetos incorrectos y esperar cada uno | Avisos/errores, sin aciertos | Pendiente | Pendiente |
| 13 | Recuperación desde el piso | Dejar caer y volver a agarrar | Pieza sigue recuperable | Pendiente | Pendiente |
| 14 | Score 0/20 y progreso 0/5 → final | Completar la clasificación | Marcador total y cuatro avances correctos | Pendiente | Pendiente |
| 15 | Métricas y fórmula | Completar botes a distintos tiempos; comparar intentos | Cuatro tiempos, global, errores y precisión correcta | Pendiente | Pendiente |
| 16 | Detención del cronómetro | Completar pieza 20 | Tiempo global deja de avanzar | Pendiente | Pendiente |
| 17 | Reinicio de puntuación y escena | Reiniciar partida terminada | Contadores a cero, escenario barajado | Pendiente | Pendiente |
| 18 | Carga web sin errores críticos | Abrir Pages; comprobar módulos y consola | Módulos y física cargan sin errores | Parcial: rutas del sitio/CDN 200, escena visible, sin errores del sitio en consola; falta Live Server y prueba XR | [Sitio Pages](https://l21200662-create.github.io/4.2-Interacci-n-virtual/) |
| 19 | Repositorio y Pages públicos | Abrir URLs públicas | GitHub y URL HTTPS accesibles | Verificado: repositorio y Pages públicos, HTTP 200 | [Repositorio](https://github.com/l21200662-create/4.2-Interacci-n-virtual) · [Pages](https://l21200662-create.github.io/4.2-Interacci-n-virtual/) |
| 20 | Problemas reales y conclusiones del alumno | Escribir tras ejecutar en Quest | Dos incidentes con diagnóstico y conclusiones | Pendiente | Pendiente |

## Evidencias y pendientes del alumno

- Repositorio: [github.com/l21200662-create/4.2-Interacci-n-virtual](https://github.com/l21200662-create/4.2-Interacci-n-virtual). GitHub Pages: [sitio HTTPS publicado](https://l21200662-create.github.io/4.2-Interacci-n-virtual/), fuente `main` + `/(root)`. Grabación Quest 3: pendiente.
- Capturas requeridas: disposición inicial, físicas/colisiones, acierto, error y marcador final. Documentar dos problemas reales, logs y conclusiones en la plataforma de entrega.
- El sitio ya está publicado; no se ha abierto en Quest 3. Seguimiento real, ergonomía, rendimiento del visor y estabilidad del solver están pendientes de prueba. También falta comprobar en el visor que no haya solapes para todos los barajados. La forma de pirámide usa un box collider aproximado, y la geometría cilíndrica de cannon-es no reproduce exactamente la cara hexagonal.
