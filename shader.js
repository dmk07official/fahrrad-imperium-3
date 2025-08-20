import * as PIXI from 'https://pixijs.download/v8.7.1/pixi.min.mjs';
  

// PixiJS-Anwendung initialisieren
const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  transparent: true,  // Transparentes Canvas
  resolution: window.devicePixelRatio || 1
});

// Pixi-Canvas in das DOM einfügen
const overlayContainer = document.getElementById('pixi-overlay');
overlayContainer.appendChild(app.view);

// Lichtquelle, die sich dynamisch bewegt
let lightSource = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

// Funktion, die das Shading auf die DOM-Elemente anwendet
function applyShading() {
  const background = new PIXI.Graphics();
  background.beginFill(0x000000, 0.7);  // Dunklerer Schatten
  background.drawRect(0, 0, app.screen.width, app.screen.height);
  background.endFill();

  // Erstelle den Lichtkreis
  const light = new PIXI.Graphics();
  light.beginFill(0xFFFFFF, 0.3);  // Helles, transparentes Weiß für die Lichtquelle
  light.drawCircle(lightSource.x, lightSource.y, 300);  // Lichtkreis-Radius größer machen
  light.endFill();

  // Beide Grafiken (Hintergrund und Lichtkreis) der Pixi-Bühne hinzufügen
  app.stage.addChild(background);
  app.stage.addChild(light);

  // Subtile Bewegung der Lichtquelle für den lebendigen Effekt
  lightSource.x += Math.sin(Date.now() / 1000) * 2;  // Horizontale Bewegung
  lightSource.y += Math.cos(Date.now() / 1000) * 2;  // Vertikale Bewegung
}

// Animation der Szene (Jedes Frame)
function gameLoop() {
  app.stage.removeChildren();  // Vorherige Zeichnungen löschen
  applyShading();  // Shading neu anwenden
  requestAnimationFrame(gameLoop);  // Erneut aufrufen, um den Effekt in jedem Frame zu aktualisieren
}

// Animation starten
gameLoop();

// Event-Listener, um auf Resize zu reagieren
window.addEventListener('resize', () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
  applyShading();  // Shading nach der Größenänderung neu anwenden
});

// Funktion zur Anwendung von Helligkeitseffekten auf DOM-Elemente
function applyBrightnessEffect() {
  const elements = document.querySelectorAll('.shaded-element');
  
  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Berechne den Abstand des Elements zur Lichtquelle
    const distance = Math.sqrt(Math.pow(lightSource.x - centerX, 2) + Math.pow(lightSource.y - centerY, 2));
    const maxDistance = Math.sqrt(Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2));

    // Helligkeit basierend auf der Entfernung von der Lichtquelle
    const brightness = Math.max(0, 1 - distance / maxDistance);

    // Berechne den Einfluss des Z-Index
    const zIndex = parseInt(window.getComputedStyle(el).zIndex, 10) || 1; // Standard Z-Index auf 1 setzen
    const zIndexEffect = 1 - (zIndex / 100);

    // Wende den Brightness-Filter auf das DOM-Element an
    el.style.filter = `brightness(${1 + brightness * 0.7 * zIndexEffect})`; // Anpassung für Z-Index
  });
}

// Alle 60ms die Helligkeit der DOM-Elemente aktualisieren
setInterval(applyBrightnessEffect, 60);
