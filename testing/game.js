(() => {
  const state = {
    win: null,
    lastY: 0,
    velocity: 0,
    isTouching: false,
    lastTime: 0,
    raf: null,
    moved: false
  };

  function startDrag(win, y) {
    state.win = win;
    state.isTouching = true;
    state.lastY = y;
    state.lastTime = Date.now();
    state.velocity = 0;
    state.moved = false;
    if (state.raf) {
      cancelAnimationFrame(state.raf);
      state.raf = null;
    }
  }

  function stopDrag() {
    state.isTouching = false;
    if (!state.raf) state.raf = requestAnimationFrame(update);
  }

  function update() {
    if (!state.win) return;

    if (!state.isTouching) {
      state.win.scrollTop += state.velocity;
      state.velocity *= 0.975;
      if (Math.abs(state.velocity) < 0.02) state.velocity = 0;

      const maxScroll = state.win.scrollHeight - state.win.clientHeight;
      if (state.win.scrollTop < 0) {
        state.win.scrollTop = 0;
        state.velocity = 0;
      } else if (state.win.scrollTop > maxScroll) {
        state.win.scrollTop = maxScroll;
        state.velocity = 0;
      }
    }

    if (state.velocity !== 0 || state.isTouching) {
      state.raf = requestAnimationFrame(update);
    } else {
      if (state.raf) {
        cancelAnimationFrame(state.raf);
        state.raf = null;
      }
      state.win = null;
    }
  }

  document.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    if (!t) return;
    const target = document.elementFromPoint(t.clientX, t.clientY);
    const win = target ? target.closest('.window') : null;
    if (!win) return;

    startDrag(win, t.clientY);
    if (!state.raf) state.raf = requestAnimationFrame(update);
  }, { passive: true }); // kein preventDefault -> Buttons gehen

  document.addEventListener('touchmove', (e) => {
    if (!state.win || !state.isTouching) return;
    const t = e.touches[0];
    if (!t) return;
    const currentY = t.clientY;
    const dy = state.lastY - currentY;
    const dt = Math.max(1, Date.now() - state.lastTime);

    if (Math.abs(currentY - state.lastY) > 2) state.moved = true;

    state.win.scrollTop += dy;
    state.velocity = (dy / dt) * 16;

    state.lastY = currentY;
    state.lastTime = Date.now();

    if (state.moved) e.preventDefault(); // nur wenn Bewegung -> Scrollblock verhindern

    if (!state.raf) state.raf = requestAnimationFrame(update);
  }, { passive: false });

  document.addEventListener('touchend', () => {
    if (!state.win) return;
    stopDrag();
  });

  document.addEventListener('touchcancel', () => {
    if (!state.win) return;
    stopDrag();
  });
})();


//Speichern, Laden, Variablen
let coins = 0;
let prestigeCount = 0, prestigeMultiplier = 1, prestigeCost = 1000;
let currentJobStage = 1;
let currentUpgradeMultiplier = 1;
let upgradeCoinsPlayerI = 1, upgradeCoinsPlayerCostI = 10, upgradeCoinsPlayerLevelI = 0;
let upgradeCoinsWorkerI = 1, upgradeCoinsWorkerCostI = 10, upgradeCoinsWorkerLevelI = 0;
let upgradeCoinsI = 1, upgradeCoinsCostI = 50, upgradeCoinsLevelI = 0;
let upgradeStrengthPlayerI = 0, upgradeStrengthPlayerCostI = 100, upgradeStrengthPlayerLevelI = 0;
let upgradeJobI = 10, upgradeJobCostI = 250, upgradeJobLevelI = 0;
let upgradeCoinsPlayerII = 1, upgradeCoinsPlayerCostII = 500, upgradeCoinsPlayerLevelII = 0;
let upgradeCoinsII = 1, upgradeCoinsCostII = 750, upgradeCoinsLevelII = 0;
let upgradeStrengthWorkerII = 1, upgradeStrengthWorkerCostII = 1000, upgradeStrengthWorkerLevelII = 0;
let upgradeDeliveryChanceII = 50, upgradeDeliveryChanceCostII = 2000, upgradeDeliveryChanceLevelII = 0;
let upgradeJobII = 10, upgradeJobCostII = 2500, upgradeJobLevelII = 0;
let upgradeCoinsIII = 1, upgradeCoinsCostIII = 5000, upgradeCoinsLevelIII = 0;
let upgradeStrengthPlayerIII = 0, upgradeStrengthPlayerCostIII = 7500, upgradeStrengthPlayerLevelIII = 0;
let upgradeDeliveryIII = 1, upgradeDeliveryCostIII = 10000, upgradeDeliveryLevelIII = 0;
let upgradeCoinsWorkerIII = 1, upgradeCoinsWorkerCostIII = 15000, upgradeCoinsWorkerLevelIII = 0;
let upgradeJobIII = 10, upgradeJobCostIII = 25000, upgradeJobLevelIII = 0;
let day = 1, month = 1, year = 2050;
let qualityValue = 1, costValue = 1;
let loyalCustomerActivated = false;
let loyalCustomerCounter = 0;       
let buttonCooldown = false;
let supplierName = "BikeParts GmbH";
let gambleCost = 10000;
let vibrate = true;
let statusHidden = false;
let deliveryColor = false;
let color = "#D4AF37";

const workerLevel = {
worker1: 0,  worker2: 0,  worker3: 0,  worker4: 0,
};
const workerIntervals = {
worker1: 665, worker2: 665, worker3: 665, worker4: 665,
};
const workerUpgradeCost = {
worker1: 100, worker2: 100, worker3: 100, worker4: 100,
};

function saveProgress() {
const progress = {
  coins,
  prestigeCount, prestigeMultiplier, prestigeCost,
  currentJobStage,
  currentUpgradeMultiplier,
  upgradeCoinsPlayerI, upgradeCoinsPlayerCostI, upgradeCoinsPlayerLevelI,
  upgradeCoinsWorkerI, upgradeCoinsWorkerCostI, upgradeCoinsWorkerLevelI,
  upgradeCoinsI, upgradeCoinsCostI, upgradeCoinsLevelI,
  upgradeStrengthPlayerI, upgradeStrengthPlayerCostI, upgradeStrengthPlayerLevelI,
  upgradeJobI, upgradeJobCostI, upgradeJobLevelI,
  upgradeCoinsPlayerII, upgradeCoinsPlayerCostII, upgradeCoinsPlayerLevelII,
  upgradeCoinsII, upgradeCoinsCostII, upgradeCoinsLevelII,
  upgradeStrengthWorkerII, upgradeStrengthWorkerCostII, upgradeStrengthWorkerLevelII,
  upgradeDeliveryChanceII, upgradeDeliveryChanceCostII, upgradeDeliveryChanceLevelII,
  upgradeJobII, upgradeJobCostII, upgradeJobLevelII,
  upgradeCoinsIII, upgradeCoinsCostIII, upgradeCoinsLevelIII,
  upgradeStrengthPlayerIII, upgradeStrengthPlayerCostIII, upgradeStrengthPlayerLevelIII,
  upgradeDeliveryIII, upgradeDeliveryCostIII, upgradeDeliveryLevelIII,
  upgradeCoinsWorkerIII, upgradeCoinsWorkerCostIII, upgradeCoinsWorkerLevelIII,
  upgradeJobIII, upgradeJobCostIII, upgradeJobLevelIII,
  workerLevel,
  workerIntervals,
  workerUpgradeCost,
  day, month, year,
  qualityValue, costValue,        
  loyalCustomerCounter,
  loyalCustomerActivated,      
  supplierName,
  gambleCost,
  statusHidden, deliveryColor,
  color,
};
localStorage.setItem('FI3test7', JSON.stringify(progress));
}

function loadProgress() {
const progress = JSON.parse(localStorage.getItem('FI3test7'));
if (progress) {
  coins = progress.coins || 0;
  prestigeCount = progress.prestigeCount || 0;
  prestigeMultiplier = progress.prestigeMultiplier || 1;
  prestigeCost = progress.prestigeCost || 1000;
  currentJobStage = progress.currentJobStage || 1;
  currentUpgradeMultiplier = progress.currentUpgradeMultiplier || 1;
  upgradeCoinsPlayerI = progress.upgradeCoinsPlayerI || 1;
  upgradeCoinsPlayerCostI = progress.upgradeCoinsPlayerCostI || 10;
  upgradeCoinsPlayerLevelI = progress.upgradeCoinsPlayerLevelI || 0;
  upgradeCoinsWorkerI = progress.upgradeCoinsWorkerI || 1;
  upgradeCoinsWorkerCostI = progress.upgradeCoinsWorkerCostI || 10;
  upgradeCoinsWorkerLevelI = progress.upgradeCoinsWorkerLevelI || 0;
  upgradeCoinsI = progress.upgradeCoinsI || 1;
  upgradeCoinsCostI = progress.upgradeCoinsCostI || 50;
  upgradeCoinsLevelI = progress.upgradeCoinsLevelI || 0;
  upgradeStrengthPlayerI = progress.upgradeStrengthPlayerI || 0;
  upgradeStrengthPlayerCostI = progress.upgradeStrengthPlayerCostI || 100;
  upgradeStrengthPlayerLevelI = progress.upgradeStrengthPlayerLevelI || 0;
  upgradeJobI = progress.upgradeJobI || 10;
  upgradeJobCostI = progress.upgradeJobCostI || 250;
  upgradeJobLevelI = progress.upgradeJobLevelI || 0;
  upgradeCoinsPlayerII = progress.upgradeCoinsPlayerII || 1;
  upgradeCoinsPlayerCostII = progress.upgradeCoinsPlayerCostII || 500;
  upgradeCoinsPlayerLevelII = progress.upgradeCoinsPlayerLevelII || 0;
  upgradeCoinsII = progress.upgradeCoinsII || 1;
  upgradeCoinsCostII = progress.upgradeCoinsCostII || 750;
  upgradeCoinsLevelII = progress.upgradeCoinsLevelII || 0;
  upgradeStrengthWorkerII = progress.upgradeStrengthWorkerII || 1;
  upgradeStrengthWorkerCostII = progress.upgradeStrengthWorkerCostII || 1000;
  upgradeStrengthWorkerLevelII = progress.upgradeStrengthWorkerLevelII || 0;
  upgradeDeliveryChanceII = progress.upgradeDeliveryChanceII || 50;
  upgradeDeliveryChanceCostII = progress.upgradeDeliveryChanceCostII || 2000;
  upgradeDeliveryChanceLevelII = progress.upgradeDeliveryChanceLevelII || 0;
  upgradeJobII = progress.upgradeJobII || 10;
  upgradeJobCostII = progress.upgradeJobCostII || 2500;
  upgradeJobLevelII = progress.upgradeJobLevelII || 0;
  upgradeCoinsIII = progress.upgradeCoinsIII || 1;
  upgradeCoinsCostIII = progress.upgradeCoinsCostIII || 5000;
  upgradeCoinsLevelIII = progress.upgradeCoinsLevelIII || 0;
  upgradeStrengthPlayerIII = progress.upgradeStrengthPlayerIII || 0;
  upgradeStrengthPlayerCostIII = progress.upgradeStrengthPlayerCostIII || 7500;
  upgradeStrengthPlayerLevelIII = progress.upgradeStrengthPlayerLevelIII || 0;
  upgradeDeliveryIII = progress.upgradeDeliveryIII || 1;
  upgradeDeliveryCostIII = progress.upgradeDeliveryCostIII || 10000;
  upgradeDeliveryLevelIII = progress.upgradeDeliveryLevelIII || 0;
  upgradeCoinsWorkerIII = progress.upgradeCoinsWorkerIII || 1;
  upgradeCoinsWorkerCostIII = progress.upgradeCoinsWorkerCostIII || 15000;
  upgradeCoinsWorkerLevelIII = progress.upgradeCoinsWorkerLevelIII || 0;
  upgradeJobIII = progress.upgradeJobIII || 10;
  upgradeJobCostIII = progress.upgradeJobCostIII || 25000;
  upgradeJobLevelIII = progress.upgradeJobLevelIII || 0;
  day = progress.day || 1;
  month = progress.month || 1;
  year = progress.year || 2050;
  qualityValue = progress.qualityValue || 1;
  costValue = progress.costValue || 1;
  loyalCustomerCounter = progress.loyalCustomerCounter || 0;
  loyalCustomerActivated = progress.loyalCustomerActivated;
  supplierName = progress.supplierName;
  gambleCost = progress.gambleCost || 10000;
  statusHidden = progress.statusHidden || false;
  deliveryColor = progress.deliveryColor || false;
  color = progress.color || "#D4AF37";
  Object.assign(workerLevel, progress.workerLevel || {});
  Object.assign(workerIntervals, progress.workerIntervals || {});
  Object.assign(workerUpgradeCost, progress.workerUpgradeCost || {});
}
updateCoins();
updatePrestige();
updateGamble();
updateDate();
updateUpgradeButtons();
updateSettingsButtons();
updateStateDisplay();
const multiplierButton = document.getElementById('upgradeMultiplier');
multiplierButton.innerText = "x" + currentUpgradeMultiplier;
updateBar('progressFillQuality', qualityValue);
updateBar('progressFillCost', costValue);
updatePercentageElements();
checkLoyalCustomerStatus();
updateDeliveryName();
updateDivs();
startLoading(0);
startSaveInterval();
}

// Formatierung
function formatNumber(number) {
const suffixes = ['', 'K', 'M', 'B', 'T', 'aa', 'ab', 'ac', 'ad', 'ae', 'af', 'ag', 'ah', 'ai', 'aj', 'ak', 'al', 'am', 'an', 'ao', 'ap', 'aq', 'ar', 'as', 'at', 'au', 'av', 'aw', 'ax', 'ay', 'az'];
  
let i = 0;
while (number >= 1e3 && i < suffixes.length - 1) {
  number /= 1e3;
  i++;
}
return (number.toFixed(2) + suffixes[i]).replace('.00', '');
}

//Coins Animation / Update
function parseNumberWithSuffix(text) {
const suffixes = ['', 'K', 'M', 'B', 'T', 'aa', 'ab', 'ac', 'ad', 'ae', 'af', 'ag', 'ah', 'ai', 'aj', 'ak', 'al', 'am', 'an', 'ao', 'ap', 'aq', 'ar', 'as', 'at', 'au', 'av', 'aw', 'ax', 'ay', 'az'];
const regex = /([0-9.]+)([a-zA-Z]*)/;
const match = text.match(regex);

if (!match) return 0;

let number = parseFloat(match[1]);
const suffix = match[2];
const suffixIndex = suffixes.indexOf(suffix);

if (suffixIndex > -1) {
  number *= Math.pow(1000, suffixIndex);
}
return number;
}

function animateNumber(element, start, end, duration) {
const range = end - start;
const startTime = performance.now();

  function tick(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = start + range * easeOutQuad(progress);

    element.textContent = formatNumber(value);

    if (progress < 1) {
    requestAnimationFrame(tick);
    }
  }
requestAnimationFrame(tick);
}

function easeOutQuad(t) {
return t * (2 - t);
}

function updateCoins() {
const coinsElement = document.getElementById('coins');
const currentText = coinsElement.textContent;
const current = parseNumberWithSuffix(currentText);
const newCoinsValue = coins;
if (current !== newCoinsValue) {
  animateNumber(coinsElement, current, newCoinsValue, 750);
}
updateUpgradeButtons();
}

//Prestige Update
function updatePrestige() {
var roundedPrestigeCost = prestigeCost / (costValue * upgradeDeliveryIII);
roundedPrestigeCost = roundPrestigeCost(roundedPrestigeCost);
document.getElementById('prestigeCount').textContent = formatNumber(prestigeCount);
document.getElementById('prestigeLevel').textContent = formatNumber(prestigeCount);
document.getElementById('newPrestigeCount').textContent = formatNumber(prestigeCount + 1);
document.getElementById('prestigeMultiplier').textContent = formatNumber(prestigeMultiplier);
document.getElementById('newPrestigeMultiplier').textContent = formatNumber(prestigeMultiplier * 2);
document.getElementById('prestigeCost').textContent = formatNumber(roundedPrestigeCost);
}

//Teilelieferant Gample Update
function updateGamble() {
document.getElementById('gambleCost').textContent = formatNumber(gambleCost);
}

//Upgrade Update
function updateUpgradeButtons() {
document.getElementById('upgradeCoinsPlayerLevelI').textContent = formatNumber(upgradeCoinsPlayerLevelI); 
document.getElementById('upgradeCoinsWorkerLevelI').textContent = formatNumber(upgradeCoinsWorkerLevelI); 
document.getElementById('upgradeCoinsLevelI').textContent = formatNumber(upgradeCoinsLevelI); 
document.getElementById('upgradeStrengthPlayerLevelI').textContent = formatNumber(upgradeStrengthPlayerLevelI); 
document.getElementById('upgradeJobLevelI').textContent = formatNumber(upgradeJobLevelI); 
document.getElementById('upgradeCoinsLevelII').textContent = formatNumber(upgradeCoinsLevelII);
document.getElementById('upgradeCoinsPlayerLevelII').textContent = formatNumber(upgradeCoinsPlayerLevelII);
document.getElementById('upgradeStrengthWorkerLevelII').textContent = formatNumber(upgradeStrengthWorkerLevelII);
document.getElementById('upgradeDeliveryChanceLevelII').textContent = formatNumber(upgradeDeliveryChanceLevelII);
document.getElementById('upgradeJobLevelII').textContent = formatNumber(upgradeJobLevelII);
document.getElementById('upgradeCoinsLevelIII').textContent = formatNumber(upgradeCoinsLevelIII);
document.getElementById('upgradeStrengthPlayerLevelIII').textContent = formatNumber(upgradeStrengthPlayerLevelIII); 
document.getElementById('upgradeDeliveryLevelIII').textContent = formatNumber(upgradeDeliveryLevelIII);
document.getElementById('upgradeCoinsWorkerLevelIII').textContent = formatNumber(upgradeCoinsWorkerLevelIII); 
document.getElementById('upgradeJobLevelIII').textContent = formatNumber(upgradeJobLevelIII);
Object.keys(workerLevel).forEach(workerId => {
const element = document.getElementById(`${workerId}Level`);
if (element) {
  element.textContent = formatNumber(workerLevel[workerId]);
}
});
document.getElementById('currentUpgradeCoinsPlayerI').textContent = formatNumber((upgradeCoinsPlayerI - 1) * 100); 
document.getElementById('nextUpgradeCoinsPlayerI').textContent = formatNumber((upgradeCoinsPlayerI - 1) * 100 + (5 * currentUpgradeMultiplier)); 
document.getElementById('currentUpgradeCoinsWorkerI').textContent = formatNumber((upgradeCoinsWorkerI - 1) * 100); 
document.getElementById('nextUpgradeCoinsWorkerI').textContent = formatNumber((upgradeCoinsWorkerI - 1) * 100 + (5 * currentUpgradeMultiplier));
document.getElementById('currentUpgradeCoinsI').textContent = formatNumber((upgradeCoinsI - 1) * 100); 
document.getElementById('nextUpgradeCoinsI').textContent = formatNumber((upgradeCoinsI - 1) * 100 + (10 * currentUpgradeMultiplier)); 
document.getElementById('currentUpgradeStrengthPlayerI').textContent = formatNumber(upgradeStrengthPlayerI); 
document.getElementById('nextUpgradeStrengthPlayerI').textContent = formatNumber(upgradeStrengthPlayerI + (0.5 * currentUpgradeMultiplier));
document.getElementById('currentUpgradeJobI').textContent = formatNumber(upgradeJobI); 
//Sicherung bei maximaler Stufe
document.getElementById('nextUpgradeJobI').textContent = formatNumber(upgradeJobI - 1);
document.getElementById('currentUpgradeCoinsII').textContent = formatNumber((upgradeCoinsII - 1) * 100); 
document.getElementById('nextUpgradeCoinsII').textContent = formatNumber((upgradeCoinsII - 1) * 100 + (10 * currentUpgradeMultiplier)); 
document.getElementById('currentUpgradeCoinsPlayerII').textContent = formatNumber((upgradeCoinsPlayerII - 1) * 100); 
document.getElementById('nextUpgradeCoinsPlayerII').textContent = formatNumber((upgradeCoinsPlayerII - 1) * 100 + (5 * currentUpgradeMultiplier));
document.getElementById('currentUpgradeStrengthWorkerII').textContent = formatNumber(upgradeStrengthWorkerII); 
document.getElementById('nextUpgradeStrengthWorkerII').textContent = formatNumber(upgradeStrengthWorkerII + (0.2 * currentUpgradeMultiplier));
document.getElementById('currentUpgradeDeliveryChanceII').textContent = formatNumber(upgradeDeliveryChanceII); 
//Sicherung bei maximaler Stufe
document.getElementById('nextUpgradeDeliveryChanceII').textContent = formatNumber(upgradeDeliveryChanceII + 2.5);
document.getElementById('currentUpgradeJobII').textContent = formatNumber(upgradeJobII); 
//Sicherung bei maximaler Stufe
document.getElementById('nextUpgradeJobII').textContent = formatNumber(upgradeJobII - 1);
document.getElementById('currentUpgradeCoinsIII').textContent = formatNumber((upgradeCoinsIII - 1) * 100); 
document.getElementById('nextUpgradeCoinsIII').textContent = formatNumber((upgradeCoinsIII - 1) * 100 + (5 * currentUpgradeMultiplier));
document.getElementById('currentUpgradeStrengthPlayerIII').textContent = formatNumber(upgradeStrengthPlayerIII); 
document.getElementById('nextUpgradeStrengthPlayerIII').textContent = formatNumber(upgradeStrengthPlayerIII + (1 * currentUpgradeMultiplier));
document.getElementById('currentUpgradeDeliveryIII').textContent = formatNumber((upgradeDeliveryIII - 1) * 100); 
document.getElementById('nextUpgradeDeliveryIII').textContent = formatNumber((upgradeDeliveryIII - 1) * 100 + (5 * currentUpgradeMultiplier));
document.getElementById('currentUpgradeCoinsWorkerIII').textContent = formatNumber((upgradeCoinsWorkerIII - 1) * 100); 
//Sicherung bei maximaler Stufe
document.getElementById('nextUpgradeCoinsWorkerIII').textContent = formatNumber((upgradeCoinsWorkerIII - 1) * 100 + 200);
document.getElementById('currentUpgradeJobIII').textContent = formatNumber(upgradeJobIII); 
//Sicherung bei maximaler Stufe
document.getElementById('nextUpgradeJobIII').textContent = formatNumber(upgradeJobIII - 1);
Object.keys(workerIntervals).forEach(workerId => {
const element1 = document.getElementById(`current${workerId}`);
const element2 = document.getElementById(`next${workerId}`);
if (element1) {
  element1.textContent = formatNumber(workerIntervals[workerId] / 1000);
}
if (element2) {
  element2.textContent = formatNumber((workerIntervals[workerId] * 0.8) / 1000);
}
});
document.getElementById('upgradeCoinsPlayerCostI').textContent = formatNumber(getTotalUpgradeCost((upgradeCoinsPlayerCostI / (costValue * upgradeDeliveryIII)), 1.15, currentUpgradeMultiplier)); 
document.getElementById('upgradeCoinsWorkerCostI').textContent = formatNumber(getTotalUpgradeCost((upgradeCoinsWorkerCostI / (costValue * upgradeDeliveryIII)), 1.15, currentUpgradeMultiplier));
document.getElementById('upgradeCoinsCostI').textContent = formatNumber(getTotalUpgradeCost((upgradeCoinsCostI / (costValue * upgradeDeliveryIII)), 1.2, currentUpgradeMultiplier));
document.getElementById('upgradeStrengthPlayerCostI').textContent = formatNumber(getTotalUpgradeCost((upgradeStrengthPlayerCostI / (costValue * upgradeDeliveryIII)), 4, currentUpgradeMultiplier));
document.getElementById('upgradeJobCostI').textContent = formatNumber(upgradeJobCostI / costValue);
document.getElementById('upgradeCoinsCostII').textContent = formatNumber(getTotalUpgradeCost((upgradeCoinsCostII / (costValue * upgradeDeliveryIII)), 1.2, currentUpgradeMultiplier));
document.getElementById('upgradeCoinsPlayerCostII').textContent = formatNumber(getTotalUpgradeCost((upgradeCoinsPlayerCostII / (costValue * upgradeDeliveryIII)), 1.15, currentUpgradeMultiplier)); 
document.getElementById('upgradeStrengthWorkerCostII').textContent = formatNumber(getTotalUpgradeCost((upgradeStrengthWorkerCostII / (costValue * upgradeDeliveryIII)), 5, currentUpgradeMultiplier));
document.getElementById('upgradeDeliveryChanceCostII').textContent = formatNumber(upgradeDeliveryChanceCostII / (costValue * upgradeDeliveryIII));
document.getElementById('upgradeJobCostII').textContent = formatNumber(upgradeJobCostII / (costValue * upgradeDeliveryIII));
document.getElementById('upgradeCoinsCostIII').textContent = formatNumber(getTotalUpgradeCost((upgradeCoinsCostIII / (costValue * upgradeDeliveryIII)), 1.2, currentUpgradeMultiplier));
document.getElementById('upgradeStrengthPlayerCostIII').textContent = formatNumber(getTotalUpgradeCost((upgradeStrengthPlayerCostIII / (costValue * upgradeDeliveryIII)), 4, currentUpgradeMultiplier));
document.getElementById('upgradeDeliveryCostIII').textContent = formatNumber(getTotalUpgradeCost((upgradeDeliveryCostIII / (costValue * upgradeDeliveryIII)), 4, currentUpgradeMultiplier));
document.getElementById('upgradeCoinsWorkerCostIII').textContent = formatNumber(upgradeCoinsWorkerCostIII / (costValue * upgradeDeliveryIII));
document.getElementById('upgradeJobCostIII').textContent = formatNumber(upgradeJobCostIII / (costValue * upgradeDeliveryIII));

if (coins >= getTotalUpgradeCost((upgradeCoinsPlayerCostI / (costValue * upgradeDeliveryIII)), 1.15, currentUpgradeMultiplier)) {
  document.getElementById('upgradeCoinsPlayerI').style.borderColor = "var(--c)";
  document.getElementById('upgradeCoinsPlayerI').style.color = "var(--c)";
} else {
  document.getElementById('upgradeCoinsPlayerI').style.borderColor = "#7A7A7A";
  document.getElementById('upgradeCoinsPlayerI').style.color = "#7A7A7A";
}
if (coins >= getTotalUpgradeCost((upgradeCoinsWorkerCostI / (costValue * upgradeDeliveryIII)), 1.15, currentUpgradeMultiplier)) {
  document.getElementById('upgradeCoinsWorkerI').style.borderColor = "var(--c)";
  document.getElementById('upgradeCoinsWorkerI').style.color = "var(--c)";
} else {
  document.getElementById('upgradeCoinsWorkerI').style.borderColor = "#7A7A7A";
  document.getElementById('upgradeCoinsWorkerI').style.color = "#7A7A7A";
}
if (coins >= getTotalUpgradeCost((upgradeCoinsCostI / (costValue * upgradeDeliveryIII)), 1.2, currentUpgradeMultiplier)) { 
  document.getElementById('upgradeCoinsI').style.borderColor = "var(--c)";
  document.getElementById('upgradeCoinsI').style.color = "var(--c)";
} else {
  document.getElementById('upgradeCoinsI').style.borderColor = "#7A7A7A";
  document.getElementById('upgradeCoinsI').style.color = "#7A7A7A";
}
if (coins >= getTotalUpgradeCost((upgradeStrengthPlayerCostI / (costValue * upgradeDeliveryIII)), 4, currentUpgradeMultiplier)) {
  document.getElementById('upgradeStrengthPlayerI').style.borderColor = "var(--c)";
  document.getElementById('upgradeStrengthPlayerI').style.color = "var(--c)";
} else {
  document.getElementById('upgradeStrengthPlayerI').style.borderColor = "#7A7A7A";
  document.getElementById('upgradeStrengthPlayerI').style.color = "#7A7A7A";
}
if (coins >= upgradeJobCostI / (costValue * upgradeDeliveryIII)) {
  document.getElementById('upgradeJobI').style.borderColor = "var(--c)";
  document.getElementById('upgradeJobI').style.color = "var(--c)";
} else {
  document.getElementById('upgradeJobI').style.borderColor = "#7A7A7A";
  document.getElementById('upgradeJobI').style.color = "#7A7A7A";
}
if (coins >= getTotalUpgradeCost((upgradeCoinsCostII / (costValue * upgradeDeliveryIII)), 1.2, currentUpgradeMultiplier)) {
  document.getElementById('upgradeCoinsII').style.borderColor = "var(--c)";
  document.getElementById('upgradeCoinsII').style.color = "var(--c)";
} else {
  document.getElementById('upgradeCoinsII').style.borderColor = "#7A7A7A";
  document.getElementById('upgradeCoinsII').style.color = "#7A7A7A";
}
if (coins >= getTotalUpgradeCost((upgradeCoinsPlayerCostII / (costValue * upgradeDeliveryIII)), 1.15, currentUpgradeMultiplier)) {
  document.getElementById('upgradeCoinsPlayerII').style.borderColor = "var(--c)";
  document.getElementById('upgradeCoinsPlayerII').style.color = "var(--c)";
} else {
  document.getElementById('upgradeCoinsPlayerII').style.borderColor = "#7A7A7A";
  document.getElementById('upgradeCoinsPlayerII').style.color = "#7A7A7A";
}
if (coins >= getTotalUpgradeCost((upgradeStrengthWorkerCostII / (costValue * upgradeDeliveryIII)), 5, currentUpgradeMultiplier)) {
  document.getElementById('upgradeStrengthWorkerII').style.borderColor = "var(--c)";
  document.getElementById('upgradeStrengthWorkerII').style.color = "var(--c)";
} else {
  document.getElementById('upgradeStrengthWorkerII').style.borderColor = "#7A7A7A";
  document.getElementById('upgradeStrengthWorkerII').style.color = "#7A7A7A";
}
if (coins >= upgradeDeliveryChanceCostII / (costValue * upgradeDeliveryIII)) {
  document.getElementById('upgradeDeliveryChanceII').style.borderColor = "var(--c)";
  document.getElementById('upgradeDeliveryChanceII').style.color = "var(--c)";
} else {
  document.getElementById('upgradeDeliveryChanceII').style.borderColor = "#7A7A7A";
  document.getElementById('upgradeDeliveryChanceII').style.color = "#7A7A7A";
}
if (coins >= upgradeJobCostII / (costValue * upgradeDeliveryIII)) {
  document.getElementById('upgradeJobII').style.borderColor = "var(--c)";
  document.getElementById('upgradeJobII').style.color = "var(--c)";
} else {
  document.getElementById('upgradeJobII').style.borderColor = "#7A7A7A";
  document.getElementById('upgradeJobII').style.color = "#7A7A7A";
}
if (coins >= getTotalUpgradeCost((upgradeCoinsCostIII / (costValue * upgradeDeliveryIII)), 1.2, currentUpgradeMultiplier)) {
  document.getElementById('upgradeCoinsIII').style.borderColor = "var(--c)";
  document.getElementById('upgradeCoinsIII').style.color = "var(--c)";
} else {
  document.getElementById('upgradeCoinsIII').style.borderColor = "#7A7A7A";
  document.getElementById('upgradeCoinsIII').style.color = "#7A7A7A";
}
if (coins >= getTotalUpgradeCost((upgradeStrengthPlayerCostIII / (costValue * upgradeDeliveryIII)), 4, currentUpgradeMultiplier)) {
  document.getElementById('upgradeStrengthPlayerIII').style.borderColor = "var(--c)";
  document.getElementById('upgradeStrengthPlayerIII').style.color = "var(--c)";
} else {
  document.getElementById('upgradeStrengthPlayerIII').style.borderColor = "#7A7A7A";
  document.getElementById('upgradeStrengthPlayerIII').style.color = "#7A7A7A";
}
if (coins >= getTotalUpgradeCost((upgradeDeliveryCostIII / (costValue * upgradeDeliveryIII)), 4, currentUpgradeMultiplier)) {
  document.getElementById('upgradeDeliveryIII').style.borderColor = "var(--c)";
  document.getElementById('upgradeDeliveryIII').style.color = "var(--c)";
} else {
  document.getElementById('upgradeDeliveryIII').style.borderColor = "#7A7A7A";
  document.getElementById('upgradeDeliveryIII').style.color = "#7A7A7A";
}
if (coins >= upgradeCoinsWorkerCostIII / (costValue * upgradeDeliveryIII)) {
  document.getElementById('upgradeCoinsWorkerIII').style.borderColor = "var(--c)";
  document.getElementById('upgradeCoinsWorkerIII').style.color = "var(--c)";
} else {
  document.getElementById('upgradeCoinsWorkerIII').style.borderColor = "#7A7A7A";
  document.getElementById('upgradeCoinsWorkerIII').style.color = "#7A7A7A";
}
if (coins >= upgradeJobCostIII / (costValue * upgradeDeliveryIII)) {
  document.getElementById('upgradeJobIII').style.borderColor = "var(--c)";
  document.getElementById('upgradeJobIII').style.color = "var(--c)";
} else {
  document.getElementById('upgradeJobIII').style.borderColor = "#7A7A7A";
  document.getElementById('upgradeJobIII').style.color = "#7A7A7A";
}
for (const workerId in workerUpgradeCost) {
const upgradeCost = document.getElementById(`upgradeCost${workerId}`);
const upgradeButton = document.getElementById(`workerUpgrade_${workerId}`);
if (upgradeCost) {
  const formattedCost = formatNumber(workerUpgradeCost[workerId] / (costValue * upgradeDeliveryIII));
  upgradeCost.textContent = formattedCost;
  if (coins > (workerUpgradeCost[workerId] / (costValue * upgradeDeliveryIII))) {
    upgradeButton.style.borderColor = "var(--c)";
    upgradeButton.style.color = "var(--c)";
  } else {
    upgradeButton.style.borderColor = "#7A7A7A";
    upgradeButton.style.color = "#7A7A7A";
  }
}
}
if (prestigeCount < 6) {
  document.getElementById('upgradeIILock').style.display = "block";
  document.getElementById('upgradeIIUnlock').style.display = "none";
} else {
  document.getElementById('upgradeIILock').style.display = "none";
  document.getElementById('upgradeIIUnlock').style.display = "flex";
}
if (prestigeCount < 12) {
  document.getElementById('upgradeIIILock').style.display = "block";
  document.getElementById('upgradeIIIUnlock').style.display = "none";
} else {
  document.getElementById('upgradeIIILock').style.display = "none";
  document.getElementById('upgradeIIIUnlock').style.display = "flex";
}
}

//Speicherintervall starten
function startSaveInterval() {
setInterval(() => {
  saveProgress();
}, 5000);
}

//Datum Update
function updateDate() {
const daysInMonth = new Date(year, month + 1, 0).getDate();  
const currentDateElement = document.getElementById('currentDate');
const formattedDate = `${day}.${month + 1}.${year}`; 
currentDateElement.textContent = formattedDate;

day++;

if (day > daysInMonth) {
  day = 1;
  month++;
if (month > 11) {
  month = 0;
  year++;
  }
}
}
setInterval(updateDate, 5000);

//Progressbar Update
function updatePrestigeProgressBar() {    
var roundedPrestigeCost = prestigeCost / (costValue * upgradeDeliveryIII);
roundedPrestigeCost = roundPrestigeCost(roundedPrestigeCost);
const progressBar = document.querySelector('.prestige-progress-fill');
const progress = (coins / roundedPrestigeCost) * 100;
  progressBar.style.width = progress + '%';
  if (coins >= roundedPrestigeCost) {
    progressBar.classList.add('blinking');
  } else {
    progressBar.classList.remove('blinking');
  }
}
//Intervall durch Aufrufe ersetzen
setInterval(updatePrestigeProgressBar, 500);

//Update Page System
let currentIndex = 0;
const elements = document.querySelectorAll('.upgrade-container');

function showElement(index) {
  elements.forEach((el, i) => {
    if (i === index) {
      el.style.display = "flex";
    } else {
      el.style.display = "none"; 
    }
  });
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % elements.length;
  showElement(currentIndex);
}
function prevSlide() {
  currentIndex = (currentIndex - 1 + elements.length) % elements.length;
  showElement(currentIndex);
}
showElement(currentIndex);

//Window Page System
function toggleActiveWindowChoose(buttonId) {
document.querySelectorAll('.window-choose-button').forEach(button => {
  button.classList.remove('active');
  button.classList.add('not-active');
});
const clickedButton = document.getElementById(buttonId);
if (clickedButton) {
  clickedButton.classList.remove('not-active');
  clickedButton.classList.add('active');
}
document.querySelectorAll('.window').forEach(div => {
  div.style.display = 'none';
});
const correspondingDiv = document.getElementById('window' + buttonId.charAt(0).toUpperCase() + buttonId.slice(1));
if (correspondingDiv) {
  correspondingDiv.style.display = 'block';
}
}

// Werkstatt
let selectedOrder = null;
let currentPlayer = false;
let currentWorker = {
  worker1: false, worker2: false, worker3: false, worker4: false,
};

function upgradeWorker(workerId) {
if (workerIntervals[workerId] !== undefined) {
  if (coins >= (workerUpgradeCost[workerId] / (costValue * upgradeDeliveryIII))) {
    coins -= (workerUpgradeCost[workerId] / (costValue * upgradeDeliveryIII));
    workerIntervals[workerId] *= 0.8;
    workerUpgradeCost[workerId] *= 10; 
    workerLevel[workerId]++;
    updateCoins();
    updateUpgradeButtons();
  }
} 
}

const orders = Array.from({ length: 4 }, (_, i) => document.getElementById(`order${i + 1}`));
const playerDiv = document.getElementById("player");
const workerDivs = {
  worker1: document.getElementById("worker1"),
  worker2: document.getElementById("worker2"),
  worker3: document.getElementById("worker3"),
  worker4: document.getElementById("worker4"),
};

const playerDivSelector = document.getElementById("playerSelector");
const workerDivsSelector = {
  worker1: document.getElementById("workerSelector1"),
  worker2: document.getElementById("workerSelector2"),
  worker3: document.getElementById("workerSelector3"),
  worker4: document.getElementById("workerSelector4"),
};

//Worker und Spieler Feld Update
function updateDivs() {
playerDiv.classList.add("passive");
const playerStrength = 1 + upgradeStrengthPlayerI + upgradeStrengthPlayerIII;
playerDiv.innerHTML = `
  <strong style="margin-top: calc(var(--s) * -0.5); margin-bottom: calc(var(--s) * 0.5); font-size: calc(var(--s) * 1);">Kein Job</strong>
  <div style="display: flex; flex-direction: row;">
  <div class="order-info-container">
  <img class="field-icon" src="tap.svg" draggable="false">
  <p>${formatNumber(playerStrength)}</p>
  </div>
  </div>
`;

Object.keys(workerDivs).forEach(worker => {
  const div = workerDivs[worker];
  if (div) {
    div.classList.add("passive");
    const workerStrength = upgradeStrengthWorkerII * (1000 / workerIntervals[worker]);
    div.innerHTML = `
      <strong style="margin-top: calc(var(--s) * -0.5); margin-bottom: calc(var(--s) * 0.5); font-size: calc(var(--s) * 1);">Kein Job</strong>
      <div style="display: flex; flex-direction: row;">
      <div class="order-info-container">
      <img class="field-icon" src="tap.svg" draggable="false">
      <p>${formatNumber(workerStrength)}/s</p>
      </div>
      </div>
    `;
  }
});
}

//Worker und Spieler Feld Update Selector
function updateDivsSelector() {
playerDivSelector.classList.add("passive");
const job = extractJobData(selectedOrder);
playerDivSelector.dataset.job = JSON.stringify(job);
const playerStrength = 1 + upgradeStrengthPlayerI + upgradeStrengthPlayerIII;
playerDivSelector.innerHTML = `
  <div class="order-info-selector-container">  
  <img class="field-icon" src="coin.svg" draggable="false">   
  <p>${formatNumber(job.payment * ((upgradeCoinsPlayerI * upgradeCoinsI) * (upgradeCoinsPlayerII * upgradeCoinsII) * upgradeCoinsIII * prestigeMultiplier) * (qualityValue * upgradeDeliveryIII))}</p>
  </div>
  <div style="display: flex; flex-direction: row;">
  <div class="order-info-selector-container">
  <img class="field-icon" src="tap.svg" draggable="false">
  <p>${formatNumber(playerStrength)}</p>
  </div>
  </div>
`;

Object.keys(workerDivs).forEach(worker => {
  const div = workerDivsSelector[worker];
  if (div) {
    div.classList.add("passive");
    const workerStrength = upgradeStrengthWorkerII * (1000 / workerIntervals[worker]);
    div.innerHTML = `
      <div class="order-info-selector-container">
      <img class="field-icon" src="coin.svg" draggable="false">
      <p>${formatNumber(job.payment * ((upgradeCoinsWorkerI * upgradeCoinsI) * upgradeCoinsII * (upgradeCoinsWorkerIII * upgradeCoinsIII) * prestigeMultiplier) * (qualityValue * upgradeDeliveryIII))}</p>
      </div>
      <div style="display: flex; flex-direction: row;">
      <div class="order-info-selector-container">
      <img class="field-icon" src="tap.svg" draggable="false">
      <p>${formatNumber(workerStrength)}/s</p>
      </div>
      </div>
    `;
  }
});
}

const jobs = [
  { name: "Ketten ölen", work: 10, payment: 10 },
  { name: "Fahrrad putzen", work: 25, payment: (25 * 1.1) },
  { name: "Bremsen einstellen", work: 50, payment: (50 * 1.2) },
  { name: "Federung tauschen", work: 100, payment: (100 * 1.3) },
  { name: "Rahmen schweißen", work: 250, payment: (250 * 1.4) },
  { name: "Neu lackieren", work: 500, payment: (500 * 1.5) },
  { name: "Fahrrad tunen", work: 1000, payment: (1000 * 1.75) },
  { name: "Custom Paintjob", work: 2500, payment: (2500 * 2) },
];

const jobStages = {
  1: [jobs[0], jobs[1], jobs[2]],
  2: [jobs[1], jobs[2], jobs[3]],
  3: [jobs[2], jobs[3], jobs[4]],
  4: [jobs[3], jobs[4], jobs[5]],
  5: [jobs[4], jobs[5], jobs[6]],
  6: [jobs[5], jobs[6], jobs[7]],
};

function changeJobStage(newStage) {
if (newStage < 1 || newStage > 6) {
  return;
}

currentJobStage = newStage;
  
switch (currentJobStage) {
case 1:
case 2:
  jobStageText1.style.display = "block";
  jobStageText2.style.display = "none";
  jobStageText3.style.display = "none";
  break;
case 3:
case 4:
  jobStageText1.style.display = "none";
  jobStageText2.style.display = "block";
  jobStageText3.style.display = "none";
  break;
case 5:
case 6:
  jobStageText1.style.display = "none";
  jobStageText2.style.display = "none";
  jobStageText3.style.display = "block";
  break;
}
updateJobStage();
updateJobStageJobDisplay(currentJobStage);
}

const jobStageJobs = [
  jobStageJob1, 
  jobStageJob2, 
  jobStageJob3, 
  jobStageJob4, 
  jobStageJob5, 
  jobStageJob6,
  jobStageJob7, 
  jobStageJob8
];

const visibilityMap = {
  1: [1, 2, 3],
  2: [2, 3, 4],
  3: [3, 4, 5],
  4: [4, 5, 6],
  5: [5, 6, 7],
  6: [6, 7, 8]
};

function updateJobStageJobDisplay(stage) {
jobStageJobs.forEach(job => job.style.display = "none");

if (visibilityMap[stage]) {
    visibilityMap[stage].forEach(index => {
    if (jobStageJobs[index - 1]) {
      jobStageJobs[index - 1].style.display = "flex";
    }
  });
}
}

function updateJobStage() {
const buttons = document.querySelectorAll('[id^="jobStageButton"]');
buttons.forEach(button => button.classList.remove('active'));

const currentButton = document.getElementById(`jobStageButton${currentJobStage}`);
if (currentButton) {
  currentButton.classList.add('active');
}
}

function openJobStage() {
const jobStageContainer = document.getElementById("jobStageContainer");
const jobStage = document.getElementById("jobStage");
const blur = document.getElementById("blur");

jobStageContainer.style.display = "flex";
jobStage.style.display = "flex";
blur.style.display = "block";
document.body.style.overflow = "hidden";

updateJobStage();
updateJobStageJobDisplay(currentJobStage);

switch (currentJobStage) {
case 1:
case 2:
  jobStageText1.style.display = "block";
  jobStageText2.style.display = "none";
  jobStageText3.style.display = "none";
  break;
case 3:
case 4:
  jobStageText1.style.display = "none";
  jobStageText2.style.display = "block";
  jobStageText3.style.display = "none";
  break;
case 5:
case 6:
  jobStageText1.style.display = "none";
  jobStageText2.style.display = "none";
  jobStageText3.style.display = "block";
  break;
}

if (prestigeCount < 6) {
  jobStageButton3.classList.add('locked');
  jobStageButton3.disabled = "true";
  jobStageButton4.classList.add('locked');  
  jobStageButton4.disabled = "true";
}

if (prestigeCount < 12) {
  jobStageButton5.classList.add('locked');
  jobStageButton5.disabled = "true";
  jobStageButton6.classList.add('locked');  
  jobStageButton6.disabled = "true";
}

jobStageContainer.addEventListener("click", function (event) {

if (!jobStage.contains(event.target)) {
  jobStageContainer.style.display = "none";
  jobStage.style.display = "none";
  blur.style.display = "none";
  document.body.style.overflow = "";
  jobStageText1.style.display = "none";
  jobStageText2.style.display = "none";
  jobStageText3.style.display = "none";
  jobStageText4.style.display = "none";
  jobStageText5.style.display = "none";
  const buttons = document.querySelectorAll('[id^="jobStageButton"]');
  buttons.forEach(button => {
    button.classList.remove('locked');
    button.disabled = false;
  });
}
});
}

function getJobUpgradeTime(stage) {
if (stage <= 2) return upgradeJobI;
if (stage <= 4) return upgradeJobII;
if (stage <= 6) return upgradeJobIII;
return upgradeJobI;
}

const activeIntervals = {};

function startLoading(index) {
const order = orders[index];
if (!order || !order.classList.contains("passive")) return;

order.classList.remove("passive");
order.classList.add("loading");

const timerDuration = getJobUpgradeTime(currentJobStage);
order.textContent = `Auftrag suchen... ${timerDuration}`;

let timer = timerDuration;
const interval = setInterval(() => {
  timer--;
  order.textContent = `Auftrag suchen... ${timer}`;
  if (timer <= 0) {
    clearInterval(interval);
    spawnJob(order);
    findNextPassiveJob();
  }
}, 800);
}

function findNextPassiveJob() {
let foundPassive = false;
const interval = setInterval(() => {
  if (!foundPassive) {
    for (let i = 0; i < orders.length; i++) {
      if (orders[i].classList.contains("passive")) {
        startLoading(i);
        foundPassive = true;
        clearInterval(interval);
        break;
      }
    }
  }
}, 200);
}

function spawnJob(order) {
const availableJobs = jobStages[currentJobStage];
const job = availableJobs[Math.floor(Math.random() * availableJobs.length)];

order.classList.remove("loading");
order.classList.add("job");
order.innerHTML = `
  <strong style="margin-top: calc(var(--s) * -0.25); margin-bottom: calc(var(--s) * 0.25); font-size: calc(var(--s) * 1);">${job.name}</strong>
  <div style="display: flex; flex-direction: row;">
  <div class="order-info-container">
  <img class="field-icon" src="tap.svg" draggable="false">
  <p>${job.work}</p>
  </div>
  </div>
`;
order.dataset.work = job.work;
order.dataset.progress = 0;
order.dataset.payment = job.payment;
order.addEventListener("click", () => handleJobClick(order));
}

function handleJobClick(order) {
if (selectedOrder === order) return;
if (order.classList.contains("job")) {
  if (selectedOrder) {
    selectedOrder.classList.remove("selected");
  }

selectedOrder = order;
updateDivsSelector();
const job = extractJobData(selectedOrder);
const selectorJob = document.getElementById("selectorJob");
selectorJob.textContent = job.name;
const selectorContainer = document.getElementById("selectorContainer");
selectorContainer.style.display = "flex";
const selector = document.getElementById("selector");
selector.style.display = "flex";
const blur = document.getElementById("blur");
blur.style.display = "block";
document.body.style.overflow = 'hidden';

selectorContainer.addEventListener("click", (event) => {
if (!selector.contains(event.target)) {
  selectorContainer.style.display = "none";
  selector.style.display = "none";
  blur.style.display = "none";
  document.body.style.overflow = "";
  selectedOrder = null;
}
});

const playerButton = document.getElementById("selectorPlayer");
if (currentPlayer) {
  playerButton.style.border = "solid #7A7A7A calc(var(--s) * 0.1)";
  playerButton.style.color = "#7A7A7A";
  playerButton.disabled = true;
} else {
  playerButton.style.border = "solid var(--c) calc(var(--s) * 0.1)";
  playerButton.style.color = "var(--c)";
  playerButton.disabled = false;
}

for (const workerId in currentWorker) {
  const workerButton = document.getElementById(`selectorWorker${workerId.slice(-1)}`);
  if (workerButton) {
    if (currentWorker[workerId]) {
      workerButton.style.border = "solid #7A7A7A calc(var(--s) * 0.1)";
      workerButton.style.color = "#7A7A7A";
      workerButton.disabled = true;
    } else {
      workerButton.style.border = "solid var(--c) calc(var(--s) * 0.1)";
      workerButton.style.color = "var(--c)";
      workerButton.disabled = false;
    }
  }
}
}
}

function player() {
if (!selectedOrder || !selectedOrder.classList.contains("job")) {
  return;
}
  
currentPlayer = true;
const status = document.getElementById("playerStatus");
status.style.backgroundColor = "#C62828";
const statusSelector = document.getElementById("playerStatusSelector");
statusSelector.style.backgroundColor = "#C62828";
const job = extractJobData(selectedOrder);
playerDiv.dataset.job = JSON.stringify(job);
playerDiv.classList.remove("passive");
playerDiv.classList.add("job");
playerDiv.innerHTML = `
  <strong style="margin-top: calc(var(--s) * -0.5); margin-bottom: calc(var(--s) * 0.25); font-size: calc(var(--s) * 1);">${job.name}</strong>
  <div style="display: flex; flex-direction: row;">
  <div class="order-info-container">
  <img class="field-icon" src="coin.svg" draggable="false">
  <p>${formatNumber(job.payment * ((upgradeCoinsPlayerI * upgradeCoinsI) * (upgradeCoinsPlayerII * upgradeCoinsII) * upgradeCoinsIII * prestigeMultiplier) * (qualityValue * upgradeDeliveryIII))}</p>
  </div>
  <div class="order-info-container">
  <img class="field-icon" src="tap.svg" draggable="false">
  <p>${formatNumber(1 + upgradeStrengthPlayerI + upgradeStrengthPlayerIII)}</p>
  </div>
  <div style="display: flex; flex-direction: row;">
  <div class="progress-bar">
  <div class="progress-bar-fill" style="width: 0%;"></div>
  </div>
  </div>
  </div>
`;
resetJob(selectedOrder);
playerDiv.addEventListener("click", handlePlayerClick);
document.getElementById("selectorContainer").style.display = "none";
document.getElementById("selector").style.display = "none";
document.getElementById("blur").style.display = "none";
document.body.style.overflow = '';
}

function handlePlayerClick() {
const job = JSON.parse(playerDiv.dataset.job);
let progress = parseFloat(job.progress) || 0;
progress += (1 + upgradeStrengthPlayerI + upgradeStrengthPlayerIII);
progress = Math.round(progress * 10) / 10;

if (navigator.vibrate && vibrate) {   
  navigator.vibrate(50);
} 

const progressBarFill = playerDiv.querySelector(".progress-bar-fill");
const progressPercentage = Math.min((progress / job.work) * 100, 100);
progressBarFill.style.width = `${progressPercentage}%`;

if (progress >= job.work) {
  currentPlayer = false;
  const statusFinished = document.getElementById("playerStatus");
  statusFinished.style.backgroundColor = "#2E7D32";
  const statusSelector = document.getElementById("playerStatusSelector");
  statusSelector.style.backgroundColor = "#2E7D32";
  coins += (job.payment * ((upgradeCoinsPlayerI * upgradeCoinsI) * (upgradeCoinsPlayerII * upgradeCoinsII) * upgradeCoinsIII * prestigeMultiplier) * (qualityValue * upgradeDeliveryIII));
  playerDiv.dataset.job = "";
  playerDiv.classList.remove("job");
  playerDiv.classList.add("passive");
  playerDiv.innerHTML = `
    <strong style="margin-top: calc(var(--s) * -0.5); margin-bottom: calc(var(--s) * 0.5); font-size: calc(var(--s) * 1);">Kein Job</strong>
    <div style="display: flex; flex-direction: row;">
    <div class="order-info-container">
    <img class="field-icon" src="tap.svg" draggable="false">
    <p>${formatNumber(1 + upgradeStrengthPlayerI + upgradeStrengthPlayerIII)}</p>
    </div>
    </div>
  `;
  playerDiv.removeEventListener("click", handlePlayerClick);
  updateCoins();
} else {
  playerDiv.dataset.job = JSON.stringify({ ...job, progress });
}
}

function worker1() {
assignJob(workerDivs.worker1, "worker1");
const status = document.getElementById("workerStatus1");
status.style.backgroundColor = "#C62828";
const statusSelector = document.getElementById("workerStatusSelector1");
statusSelector.style.backgroundColor = "#C62828";
}
function worker2() {
assignJob(workerDivs.worker2, "worker2");
const status = document.getElementById("workerStatus2");
status.style.backgroundColor = "#C62828";
const statusSelector = document.getElementById("workerStatusSelector2");
statusSelector.style.backgroundColor = "#C62828";
}
function worker3() {
assignJob(workerDivs.worker3, "worker3");
const status = document.getElementById("workerStatus3");
status.style.backgroundColor = "#C62828";
const statusSelector = document.getElementById("workerStatusSelector3");
statusSelector.style.backgroundColor = "#C62828";
}
function worker4() {
assignJob(workerDivs.worker4, "worker4");
const status = document.getElementById("workerStatus4");
status.style.backgroundColor = "#C62828";
const statusSelector = document.getElementById("workerStatusSelector4");
statusSelector.style.backgroundColor = "#C62828";
}

function assignJob(workerDiv, workerId) {
if (!selectedOrder || !selectedOrder.classList.contains("job")) {
  return;
}
if (workerDiv.dataset.job) {
  return;
}
currentWorker[workerId] = true;

const job = extractJobData(selectedOrder);
const workerStrength = upgradeStrengthWorkerII * (1000 / workerIntervals[workerId]);
workerDiv.dataset.job = JSON.stringify(job);
workerDiv.classList.remove("passive");
workerDiv.classList.add("job");
workerDiv.innerHTML = `
  <strong style="margin-top: calc(var(--s) * -0.5); margin-bottom: calc(var(--s) * 0.15); font-size: calc(var(--s) * 1);">${job.name}</strong>
  <div style="display: flex; flex-direction: column;">
  <div class="order-info-container">
  <img class="field-icon" src="coin.svg" draggable="false">
  <p>${formatNumber(job.payment * ((upgradeCoinsWorkerI * upgradeCoinsI) * upgradeCoinsII * (upgradeCoinsWorkerIII * upgradeCoinsIII) * prestigeMultiplier) * (qualityValue * upgradeDeliveryIII))}</p>
  </div>
  <div class="order-info-container">
  <img class="field-icon" src="tap.svg" draggable="false">
  <p>${formatNumber(workerStrength)}/s</p>
  </div>
  <div style="display: flex; flex-direction: row;">
  <div class="progress-bar">
  <div class="progress-bar-fill" style="width: 0%;"></div>
  </div>
`;
resetJob(selectedOrder);
document.getElementById("selectorContainer").style.display = "none";
document.getElementById("selector").style.display = "none";
document.getElementById("blur").style.display = "none";
document.body.style.overflow = '';

let progress = 0;
const interval = setInterval(() => {
  progress += upgradeStrengthWorkerII;
  progress = Math.round(progress * 10) / 10;
  const progressBarFill = workerDiv.querySelector(".progress-bar-fill");
  const progressPercentage = Math.min((progress / job.work) * 100, 100);
  progressBarFill.style.width = `${progressPercentage}%`;

  if (progress >= job.work) {
  const statusFinished = document.getElementById(`workerStatus${workerId.slice(-1)}`);
  if (statusFinished) {
    statusFinished.style.backgroundColor = "#2E7D32";
  }
  const statusSelectorFinished = document.getElementById(`workerStatusSelector${workerId.slice(-1)}`);
  if (statusSelectorFinished) {
    statusSelectorFinished.style.backgroundColor = "#2E7D32";
  }
  const selectorButton = document.getElementById(`selectorWorker${workerId.slice(-1)}`);
  if (selectorButton) {
    selectorButton.style.border = "solid var(--c) calc(var(--s) * 0.1)";
    selectorButton.style.color = "var(--c)";
    selectorButton.disabled = false;
  }
  currentWorker[workerId] = false;
  clearInterval(interval);
  delete activeIntervals[workerId];
  coins += (job.payment * ((upgradeCoinsWorkerI * upgradeCoinsI) * upgradeCoinsII * (upgradeCoinsWorkerIII * upgradeCoinsIII) * prestigeMultiplier) * (qualityValue * upgradeDeliveryIII));
  workerDiv.dataset.job = "";
  workerDiv.classList.remove("job");
  workerDiv.classList.add("passive");
  workerDiv.innerHTML = `
    <strong style="margin-top: calc(var(--s) * -0.5); margin-bottom: calc(var(--s) * 0.5); font-size: calc(var(--s) * 1);">Kein Job</strong>
    <div style="display: flex; flex-direction: row;">
    <div class="order-info-container">
    <img class="field-icon" src="tap.svg" draggable="false">
    <p>${formatNumber(workerStrength)}/s</p>
    </div>
    </div>
  `;
  updateCoins();
}

}, workerIntervals[workerId]);

activeIntervals[workerId] = interval;
}

function resetJob(order) {
order.classList.remove("job");
order.classList.add("passive");
order.textContent = "Passiv";

if (selectedOrder === order) {
  selectedOrder = null;
}
}


function extractJobData(order) {
return {
  name: order.querySelector("strong").textContent,
  work: parseInt(order.dataset.work),
  progress: parseInt(order.dataset.progress),
  payment: parseInt(order.dataset.payment),
};
}

// Upgrade

function changeMultiplierDown() {
const button = document.getElementById('upgradeMultiplier');
switch (currentUpgradeMultiplier) {
  case 100:
    currentUpgradeMultiplier = 50;
    button.textContent = 'x50';
    break;
  case 50:
    currentUpgradeMultiplier = 25;
    button.textContent = 'x25';
    break;
  case 25:
    currentUpgradeMultiplier = 10;
    button.textContent = 'x10';
    break;
  case 10:
    currentUpgradeMultiplier = 5;
    button.textContent = 'x5';
    break;
  case 5:
    currentUpgradeMultiplier = 1;
    button.textContent = 'x1';
    break;
  default: 
    currentUpgradeMultiplier = 100;
    button.textContent = 'x100';
}
updateUpgradeButtons();
}

function changeMultiplierUp() {
const button = document.getElementById('upgradeMultiplier');
switch (currentUpgradeMultiplier) {
  case 1:
    currentUpgradeMultiplier = 5;
    button.textContent = 'x5';
    break;
  case 5:
    currentUpgradeMultiplier = 10;
    button.textContent = 'x10';
    break;
  case 10:
    currentUpgradeMultiplier = 25;
    button.textContent = 'x25';
    break;
  case 25:
    currentUpgradeMultiplier = 50;
    button.textContent = 'x50';
    break;
  case 50:
    currentUpgradeMultiplier = 100;
    button.textContent = 'x100';
    break;
  default: 
    currentUpgradeMultiplier = 1;
    button.textContent = 'x1';
}
updateUpgradeButtons();
}

function getTotalUpgradeCost(baseCost, costMultiplier, levels) {
let totalCost = 0;
let tempCost = baseCost;

for (let i = 0; i < levels; i++) {
  totalCost += tempCost;
  tempCost *= costMultiplier;
}
return totalCost;
}

function buyUpgradeCoinsPlayerI() {
const totalCost = getTotalUpgradeCost((upgradeCoinsPlayerCostI / (costValue * upgradeDeliveryIII)), 1.15, currentUpgradeMultiplier);
if (coins >= totalCost) {
  coins -= totalCost;
  upgradeCoinsPlayerI += 0.05 * currentUpgradeMultiplier;
  upgradeCoinsPlayerLevelI += currentUpgradeMultiplier;
  upgradeCoinsPlayerCostI *= Math.pow(1.15, currentUpgradeMultiplier);
  updateCoins();
}
}

function buyUpgradeCoinsWorkerI() {
const totalCost = getTotalUpgradeCost((upgradeCoinsWorkerCostI / (costValue * upgradeDeliveryIII)), 1.15, currentUpgradeMultiplier);
if (coins >= totalCost) {
  coins -= totalCost;
  upgradeCoinsWorkerI += 0.05 * currentUpgradeMultiplier;
  upgradeCoinsWorkerLevelI += currentUpgradeMultiplier;
  upgradeCoinsWorkerCostI *= Math.pow(1.15, currentUpgradeMultiplier);
  updateCoins();
}
}

function buyUpgradeCoinsI() {
const totalCost = getTotalUpgradeCost((upgradeCoinsCostI / (costValue * upgradeDeliveryIII)), 1.2, currentUpgradeMultiplier);
if (coins >= totalCost) {
  coins -= totalCost;
  upgradeCoinsI += 0.1 * currentUpgradeMultiplier;
  upgradeCoinsLevelI += currentUpgradeMultiplier;
  upgradeCoinsCostI *= Math.pow(1.2, currentUpgradeMultiplier);
  updateCoins();
}
}

function buyUpgradeStrengthPlayerI() {
const totalCost = getTotalUpgradeCost((upgradeStrengthPlayerCostI / (costValue * upgradeDeliveryIII)), 4, currentUpgradeMultiplier);
if (coins >= totalCost) {
  coins -= totalCost;
  upgradeStrengthPlayerI += 0.5 * currentUpgradeMultiplier;
  upgradeStrengthPlayerLevelI += currentUpgradeMultiplier;
  upgradeStrengthPlayerCostI *= Math.pow(4, currentUpgradeMultiplier);
  updateCoins();
}
}

function buyUpgradeJobI() {
if (upgradeJobI == 1) {
  return;
}
if (coins >= (upgradeJobCostI / (costValue * upgradeDeliveryIII))) {
  coins -= (upgradeJobCostI / (costValue * upgradeDeliveryIII));
  upgradeJobI--;
  upgradeJobLevelI++;
  if (upgradeJobI <= 4) {
    upgradeJobCostI *= 30;
  } else if (upgradeJobI <= 7) {
    upgradeJobCostI *= 20;
  } else {
    upgradeJobCostI *= 10;
  }
}
updateCoins();
}

function buyUpgradeCoinsPlayerII() {
const totalCost = getTotalUpgradeCost((upgradeCoinsPlayerCostII / (costValue * upgradeDeliveryIII)), 1.15, currentUpgradeMultiplier);
if (coins >= totalCost) {
  coins -= totalCost;
  upgradeCoinsPlayerII += 0.05 * currentUpgradeMultiplier;
  upgradeCoinsPlayerLevelII += currentUpgradeMultiplier;
  upgradeCoinsPlayerCostII *= Math.pow(1.15, currentUpgradeMultiplier);
  updateCoins();
}
}

function buyUpgradeCoinsII() {
const totalCost = getTotalUpgradeCost((upgradeCoinsCostII / (costValue * upgradeDeliveryIII)), 1.2, currentUpgradeMultiplier);
if (coins >= totalCost) {
  coins -= totalCost;
  upgradeCoinsII += 0.1 * currentUpgradeMultiplier;
  upgradeCoinsLevelII += currentUpgradeMultiplier;
  upgradeCoinsCostII *= Math.pow(1.2, currentUpgradeMultiplier);
  updateCoins();
}
}

function buyUpgradeStrengthWorkerII() {
const totalCost = getTotalUpgradeCost((upgradeStrengthWorkerCostII / (costValue * upgradeDeliveryIII)), 5, currentUpgradeMultiplier);
if (coins >= totalCost) {
  coins -= totalCost;
  upgradeStrengthWorkerII += 0.2 * currentUpgradeMultiplier;
  upgradeStrengthWorkerLevelII += currentUpgradeMultiplier;
  upgradeStrengthWorkerCostII *= Math.pow(5, currentUpgradeMultiplier);
  updateCoins();
}
}

function buyUpgradeDeliveryChanceII() {
if (upgradeDeliveryChanceII == 80) {
  return;
}
if (coins >= (upgradeDeliveryChanceCostII / (costValue * upgradeDeliveryIII))) {
  coins -= (upgradeDeliveryChanceCostII / (costValue * upgradeDeliveryIII));
  upgradeDeliveryChanceII += 2.5;
  upgradeDeliveryChanceLevelII++;
  upgradeDeliveryChanceCostII *= 10;
}
updateCoins();
}

function buyUpgradeJobII() {
if (upgradeJobII == 1) {
  return;
}
if (coins >= (upgradeJobCostII / (costValue * upgradeDeliveryIII))) {
  coins -= (upgradeJobCostII / (costValue * upgradeDeliveryIII));
  upgradeJobII--;
  upgradeJobLevelII++;
  if (upgradeJobII <= 4) {
    upgradeJobCostII *= 30;
  } else if (upgradeJobII <= 7) {
    upgradeJobCostII *= 20;
  } else {
    upgradeJobCostII *= 10;
  }
}
updateCoins();
}

function buyUpgradeCoinsIII() {
const totalCost = getTotalUpgradeCost((upgradeCoinsCostIII / (costValue * upgradeDeliveryIII)), 1.2, currentUpgradeMultiplier);
if (coins >= totalCost) {
  coins -= totalCost;
  upgradeCoinsIII += 0.05 * currentUpgradeMultiplier;
  upgradeCoinsLevelIII += currentUpgradeMultiplier;
  upgradeCoinsCostIII *= Math.pow(1.2, currentUpgradeMultiplier);
  updateCoins();
}
}

function buyUpgradeStrengthPlayerIII() {
const totalCost = getTotalUpgradeCost((upgradeStrengthPlayerCostIII / (costValue * upgradeDeliveryIII)), 4, currentUpgradeMultiplier);
if (coins >= totalCost) {
  coins -= totalCost;
  upgradeStrengthPlayerIII += 1 * currentUpgradeMultiplier;
  upgradeStrengthPlayerLevelIII += currentUpgradeMultiplier;
  upgradeStrengthPlayerCostIII *= Math.pow(4, currentUpgradeMultiplier);
  updateCoins();
}
}

function buyUpgradeDeliveryIII() {
const totalCost = getTotalUpgradeCost((upgradeDeliveryCostIII / (costValue * upgradeDeliveryIII)), 4, currentUpgradeMultiplier);
if (coins >= totalCost) {
  coins -= totalCost;
  upgradeDeliveryIII += 0.05 * currentUpgradeMultiplier;
  upgradeDeliveryLevelIII += currentUpgradeMultiplier;
  upgradeDeliveryCostIII *= Math.pow(4, currentUpgradeMultiplier);
  updateCoins();
  updatePrestige();
  }
}

function buyUpgradeCoinsWorkerIII() {
if (upgradeCoinsWorkerLevelIII == 10) {
  return;
}
if (coins >= (upgradeCoinsWorkerCostIII / (costValue * upgradeDeliveryIII))) {
  coins -= (upgradeCoinsWorkerCostIII / (costValue * upgradeDeliveryIII));
  upgradeCoinsWorkerIII += 2;
  upgradeCoinsWorkerLevelIII++;
  upgradeCoinsWorkerCostIII *= 35;
}
updateCoins();
}

function buyUpgradeJobIII() {
if (upgradeJobIII == 1) {
  return;
}
if (coins >= (upgradeJobCostIII / (costValue * upgradeDeliveryIII))) {
  coins -= (upgradeJobCostIII / (costValue * upgradeDeliveryIII));
  upgradeJobIII--;
  upgradeJobLevelIII++;
  if (upgradeJobIII <= 4) {
    upgradeJobCostIII *= 30;
  } else if (upgradeJobIII <= 7) {
    upgradeJobCostIII *= 20;
  } else {
    upgradeJobCostIII *= 10;
  }
}
  updateCoins();
}

//Teile Lieferant 

function updateBar(elementId, value) {
let progressFill = document.getElementById(elementId);
let percentage = Math.round(((value - 0.5) / 1) * 100);
progressFill.style.width = percentage + "%";

if (deliveryColor) {
  progressFill.style.backgroundColor = "var(--c)";
} else {
  if (percentage > 70) {
    progressFill.style.backgroundColor = "green";
  } else if (percentage > 30) {
    progressFill.style.backgroundColor = "orange";
  } else {
    progressFill.style.backgroundColor = "red";
  }
}
}

function updateBarWithAnimation(elementId, value) {
let progressFill = document.getElementById(elementId);
let percentage = Math.round(((value - 0.5) / 1) * 100);
progressFill.style.transition = "width 1s ease-in-out, background-color 1s ease-in-out";
progressFill.style.width = percentage + "%";

if (deliveryColor) {
  progressFill.style.backgroundColor = "var(--c)";
} else {
  if (percentage > 70) {
    progressFill.style.backgroundColor = "green";
  } else if (percentage > 30) {
    progressFill.style.backgroundColor = "orange";
  } else {
    progressFill.style.backgroundColor = "red";
  }
}
}

function updatePercentageElements() {
let qualityElement = document.getElementById('qualityLevelPercent');
let costElement = document.getElementById('costLevelPercent');
let percentageQuality = Math.round(((qualityValue - 0.5) / 1) * 100);
let percentageCost = Math.round(((costValue - 0.5) / 1) * 100);

if (qualityElement && costElement) {
  qualityElement.innerHTML = percentageQuality + "%";
  costElement.innerHTML = percentageCost + "%";
}
}

function hidePercentages() {
let qualityElement = document.getElementById('qualityLevelPercent');
let costElement = document.getElementById('costLevelPercent');
let percentageQuality = Math.round(((qualityValue - 0.5) / 1) * 100);
let percentageCost = Math.round(((costValue - 0.5) / 1) * 100);

if (qualityElement && costElement) {
  qualityElement.innerHTML = '???';
  costElement.innerHTML = '???';
  setTimeout(function() {
    qualityElement.innerHTML = percentageQuality + "%";
    costElement.innerHTML = percentageCost + "%";
  }, 1250);
}
}

function loyalDisplayPercentages() {
let qualityElement = document.getElementById('qualityLevelPercent');
let costElement = document.getElementById('costLevelPercent');
let percentageQuality = Math.round(((qualityValue - 0.5) / 1) * 100);
let percentageCost = Math.round(((costValue - 0.5) / 1) * 100);

if (qualityElement && costElement) {
  qualityElement.innerHTML = '+10';
  costElement.innerHTML = '+10';
  setTimeout(function() {
    qualityElement.innerHTML = percentageQuality + "%";
    costElement.innerHTML = percentageCost + "%";
  }, 1250);
}
}

function changeCustomFill() {
const localCustomerStatusElement = document.getElementById('localCustomerStatus');
if (coins >= 25000) {
  if (!buttonCooldown) {
    coins -= 25000;
    qualityValue = Math.random() + 0.5;
    costValue = Math.random() + 0.5;
    loyalCustomerCounter = 0;
    loyalCustomerActivated = false;
    localCustomerStatusElement.textContent = `${365 - loyalCustomerCounter} Tage bis loyaler Kunde`;
    gambleCost = 10000;
    checkLoyalCustomerStatus();
    updateBarWithAnimation('progressFillQuality', qualityValue);
    updateBarWithAnimation('progressFillCost', costValue);
    hidePercentages();
    updateGamble();
    updatePrestige();
    updateCoins();
    buttonCooldown = true;
    let countdown = 10;
    let buttonElement = document.getElementById("changeCustomFill");
    buttonElement.innerText = `Warte noch ${countdown} Tage`;

    let countdownInterval = setInterval(function() {
    buttonElement.innerText = `Warte noch ${countdown} Tage`;
    countdown--;
      if (countdown < 0) {
        buttonCooldown = false;
        buttonElement.innerHTML = '<span>Neuen Lieferanten suchen</span> <br> <span>25K</span>';
        clearInterval(countdownInterval);
      }
    }, 5000);

    const supplierNames = ["BikeCare GmbH", "CyclingTech", "WheelWorks AG", "GearUp GmbH", "BikePro KG", "Lucas Fahrradteile", "RideSmart GmbH", "PedalPower GmbH", "Die Bike-Profis", "CycleSolutions Logistik", "RideEasy GmbH", "PedalPusher AG", "RideMate OHG", "BikeGenius GmbH"];
    const randomIndex = Math.floor(Math.random() * supplierNames.length);
    supplierName = supplierNames[randomIndex];
    updateDeliveryName();
  } else {
    alert("Du musst noch warten, bis der Lieferant verfügbar ist.");
  }
} else {
  alert("Spar noch ein wenig. Mehr Geld, aber bessere Lieferanten?");
}
}

function updateDeliveryName() {
document.getElementById('deliveryName').innerText = supplierName;
}

function checkLoyalCustomerStatus() {
const localCustomerStatusElement = document.getElementById('localCustomerStatus');
if (!loyalCustomerActivated && loyalCustomerCounter >= 365) {
  qualityValue += 0.1;
  costValue += 0.1;
  updateBarWithAnimation('progressFillQuality', qualityValue);
  updateBarWithAnimation('progressFillCost', costValue);
  loyalDisplayPercentages();
  updateUpgradeButtons();
  updatePrestige();
  localCustomerStatusElement.textContent = "Loyaler Kunde";
  loyalCustomerActivated = true;
} else if (!loyalCustomerActivated) {
  localCustomerStatusElement.textContent = `${365 - loyalCustomerCounter} Tage bis loyaler Kunde`;
}
if (loyalCustomerActivated) {
  localCustomerStatusElement.textContent = "Loyaler Kunde";
}
}

setInterval(() => {
  loyalCustomerCounter += 1;
  checkLoyalCustomerStatus();
}, 5000);

function gambleDelivery() {
if (coins >= gambleCost) {
  coins -= gambleCost;
  gambleCost *= 10;
  const gamble = Math.random() * 100 < upgradeDeliveryChanceII;
  if (gamble) {
    qualityValue += 0.1;
    costValue += 0.1;
  } else {
    qualityValue -= 0.1;
    costValue -= 0.1;
    if (qualityValue < 0.5) {
      qualityValue = 0.5;
    }
    if (costValue < 0.5) {
      costValue = 0.5;
    }
  }
  updateBarWithAnimation('progressFillQuality', qualityValue);
  updateBarWithAnimation('progressFillCost', costValue);
  hidePercentages();
}
updateGamble();
updatePrestige();
updateCoins();
}

// Prestige 

function roundPrestigeCost(prestigeCost) {
if (prestigeCost < 10) return Math.round(prestigeCost);
const magnitude = Math.pow(10, Math.floor(Math.log10(prestigeCost)));
return Math.round(prestigeCost / magnitude) * magnitude;
}

function buyPrestige() {
var roundedPrestigeCost = prestigeCost / (costValue * upgradeDeliveryIII);
roundedPrestigeCost = roundPrestigeCost(roundedPrestigeCost);
if (coins >= roundedPrestigeCost) {
  coins = 0;
  prestigeCount++;
  prestigeMultiplier *= 2;
  prestigeCost *= 6;
  coins = 0;
  upgradeCoinsPlayerI = 1;
  upgradeCoinsPlayerLevelI = 0;
  upgradeCoinsPlayerCostI = 10;
  upgradeCoinsWorkerI = 1;
  upgradeCoinsWorkerLevelI = 0;
  upgradeCoinsWorkerCostI = 10;
  upgradeCoinsI = 1;
  upgradeCoinsLevelI = 0;
  upgradeCoinsCostI = 50;
  upgradeStrengthPlayerI = 0;
  upgradeStrengthPlayerLevelI = 0;
  upgradeStrengthPlayerCostI = 100;
  upgradeJobI = 10;
  upgradeJobLevelI = 0;
  upgradeJobCostI = 250;
  upgradeCoinsPlayerII = 1;
  upgradeCoinsPlayerLevelII = 0;
  upgradeCoinsPlayerCostII = 500;
  upgradeCoinsII = 1;
  upgradeCoinsLevelII = 0;
  upgradeCoinsCostII = 750;
  upgradeStrengthWorkerII = 1;
  upgradeStrengthWorkerLevelII = 0;
  upgradeStrengthWorkerCostII = 1000;
  upgradeDeliveryChanceII = 50;
  upgradeDeliveryChanceLevelII = 0;
  upgradeDeliveryChanceCostII = 2000;
  upgradeJobII = 10;
  upgradeJobLevelII = 0;
  upgradeJobCostII = 2500;
  upgradeCoinsIII = 1;
  upgradeCoinsLevelIII = 0;
  upgradeCoinsCostIII = 5000;
  upgradeStrengthPlayerIII = 0;
  upgradeStrengthPlayerLevelIII = 0;
  upgradeStrengthPlayerCostIII = 7500;
  upgradeDeliveryIII = 1;
  upgradeDeliveryLevelIII = 0;
  upgradeDeliveryCostIII = 10000;
  upgradeCoinsWorkerIII = 1;
  upgradeCoinsWorkerLevelIII = 0;
  upgradeCoinsWorkerCostIII = 15000;
  upgradeJobIII = 10;
  upgradeJobLevelIII = 0;
  upgradeJobCostIII = 25000;
  Object.keys(workerLevel).forEach(workerId => {
    workerLevel[workerId] = 0;
  });
  Object.keys(workerIntervals).forEach(workerId => {
    workerIntervals[workerId] = 665;
  });
  Object.keys(workerUpgradeCost).forEach(workerId => {
    workerUpgradeCost[workerId] = 100;
  });
  saveProgress();
  const prestigeFade = document.querySelector(".prestige-fade");
  if (prestigeFade) {
    prestigeFade.style.display = "block";
    prestigeFade.classList.add('fadeout');
    prestigeFade.addEventListener("animationend", function() { 
    location.reload();
  });
}
} else {
  alert("Du hast nicht genug geld für die Erweiterung");
}
}

//Einstellungen
function toggleStateDisplay() {
statusHidden = !statusHidden;
updateSettingsButtons();
updateStateDisplay();
}

function updateStateDisplay() {
const playerStatus = document.getElementById("playerStatus");
const workerStatus1 = document.getElementById("workerStatus1");
const workerStatus2 = document.getElementById("workerStatus2");
const workerStatus3 = document.getElementById("workerStatus3");
const workerStatus4 = document.getElementById("workerStatus4");
if (statusHidden) {
  playerStatus.style.display = "none";
  workerStatus1.style.display = "none";
  workerStatus2.style.display = "none";
  workerStatus3.style.display = "none";
  workerStatus4.style.display = "none";
} else {
  playerStatus.style.display = "block";
  workerStatus1.style.display = "block";
  workerStatus2.style.display = "block";
  workerStatus3.style.display = "block";
  workerStatus4.style.display = "block";
}
}

function toggleDeliveryColor() {
deliveryColor = !deliveryColor;
updateSettingsButtons();
changeDeliveryColor();
}

function changeDeliveryColor() {
const progressFillQuality = document.getElementById("progressFillQuality");
const progressFillCost = document.getElementById("progressFillCost");
if (deliveryColor) {
  progressFillQuality.style.backgroundColor = "var(--c)";
  progressFillCost.style.backgroundColor = "var(--c)";
} else {
  updateBar('progressFillQuality', qualityValue);
  updateBar('progressFillCost', costValue);
}
}

function updateSettingsButtons() {
document.querySelector("button[onclick='toggleStateDisplay()']").textContent = statusHidden ? "Anzeigen" : "Verbergen";
document.querySelector("button[onclick='toggleDeliveryColor()']").textContent = deliveryColor ? "Aus" : "Ein";
}

function openMenu() {
window.open('../index.html', '_self');
}

//Push
loadProgress();
