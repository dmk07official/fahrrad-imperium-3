let color = "#D4AF37";

function loadProgress() {
    const progress = JSON.parse(localStorage.getItem("FI3test7"));
    if (progress) {
        color = progress.color || "#D4AF37";
    }
    document.documentElement.style.setProperty("--color", color);
}

let highScore = 0;
function loadProgressMiniGame() {
    const progressMiniGame = JSON.parse(localStorage.getItem("FI3MiniGametest7"));
    if (progressMiniGame) {
        highScore = progressMiniGame.highScore || 0;
    }
    document.getElementById("highScore").textContent = highScore;
}

document.addEventListener("DOMContentLoaded", function () {
    const loadingOverlay = document.getElementById("loadingOverlay");

    let progress = 0;

    function updateLoadingProgress(progress) {
        const progressBar = document.querySelector(".loading-progress-bar");
        progressBar.style.width = progress + "%";
    }

    let canvas = document.getElementById("gameCanvas");
    let ctx = canvas.getContext("2d");

    let touchX = null;
    let mouseX = null;

    function screenToCanvasCoordinates(x, canvasWidth, screenWidth) {
        return (x - (screenWidth - canvasWidth) / 2) * (canvas.width / canvasWidth);
    }

    function adjustCanvasSize() {
        const aspectRatio = 5 / 3;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const screenAspectRatio = screenWidth / screenHeight;

        if (screenAspectRatio > aspectRatio) {
            const newWidth = screenHeight * aspectRatio;
            canvas.width = newWidth;
            canvas.height = screenHeight;
            canvas.style.display = "block";
            const inputArea = document.getElementById("ui");
            const canvasOffsetLeft = (screenWidth - newWidth) / 2;
            inputArea.style.left = canvasOffsetLeft + "px";
        } else if (screenAspectRatio < aspectRatio) {
            canvas.width = screenWidth;
            canvas.height = screenHeight;
            canvas.style.display = "block";
            const inputArea = document.getElementById("ui");
            inputArea.style.left = "0";
        }
    }

    window.addEventListener("resize", function () {
        adjustCanvasSize();
        if (touchX !== null || mouseX !== null) {
            adjustTouchAndMouseCoordinates();
        }
    });

    canvas.addEventListener("touchstart", function (event) {
        touchX = event.touches[0].clientX;
        adjustTouchAndMouseCoordinates();
    });

    canvas.addEventListener("touchmove", function (event) {
        event.preventDefault();
        touchX = event.touches[0].clientX;
        adjustTouchAndMouseCoordinates();
    });

    canvas.addEventListener("touchend", function (event) {
        touchX = null;
    });

    canvas.addEventListener("mousedown", function (event) {
        if (event.button === 0) {
            mouseX = event.clientX;
            adjustTouchAndMouseCoordinates();
        }
    });

    canvas.addEventListener("mouseup", function (event) {
        if (event.button === 0) {
            mouseX = null;
        }
    });

    canvas.addEventListener("mousemove", function (event) {
        if (event.buttons === 1) {
            mouseX = event.clientX;
            adjustTouchAndMouseCoordinates();
            player.x = mouseX - player.width / 2;
        }
    });

    function adjustTouchAndMouseCoordinates() {
        const screenWidth = window.innerWidth;
        if (touchX !== null) {
            touchX = screenToCanvasCoordinates(touchX, canvas.width, screenWidth);
        }
        if (mouseX !== null) {
            mouseX = screenToCanvasCoordinates(mouseX, canvas.width, screenWidth);
        }
    }

    // Initialisierung
    adjustCanvasSize();

    let obstacleSpeed = 0;
    let imagesLoaded = 0;
    const totalImages = 6;

    function checkImagesLoaded() {
        imagesLoaded++;
        progress += 16.66;
        updateLoadingProgress(progress);
        if (imagesLoaded === totalImages) {
            loadProgress();
            loadProgressMiniGame();
            document.querySelector(".loading-screen").style.display = "none";

            // Starte das Spiel
            obstacleSpeed = canvas.height * 0.75;
            spawnObstacle();
            draw();
        }
    }

    function preloadImages() {
        const imageSources = ["obstacle1.png", "obstacle2.png", "point1.png", "point2.png", "powerup1.png"];

        imageSources.forEach((source) => {
            const image = new Image();
            image.onload = checkImagesLoaded;
            image.src = source;
        });
    }

    preloadImages();

    var ratioCanvas = canvas.width / canvas.height;

    var objectSize;

    if (ratioCanvas === 1 && ratioCanvas < 4 / 3) {
        objectSize = canvas.height * 0.125;
    } else if (ratioCanvas >= 4 / 3 && ratioCanvas < 5 / 3) {
        objectSize = canvas.height * 0.15;
    } else if (ratioCanvas >= 5 / 3) {
        objectSize = canvas.height * 0.175;
    }

    const player = {
        x: canvas.width / 2,
        y: canvas.height - objectSize,
        width: objectSize,
        height: objectSize,
        image: new Image()
    };

    player.image.onload = checkImagesLoaded;
    player.image.src = "farmer-m.png";

    const obstacles = [];
    const obstacleWidth = objectSize;
    const obstacleHeight = objectSize;
    obstacleSpeed = canvas.height * 0.75;

    const obstacleImages = ["obstacle1.png", "obstacle2.png"];

    const pointImages = ["point1.png", "point2.png"];

    const powerupImages = ["powerup1.png"];

    let gameOver = false;
    let timeStopSlow = false;
    let score = 0;

    const collisionDistance = canvas.height * 0.175;

    let lastTime = 0;
    const fpsLimit = 0.5;

    function draw(timestamp) {
        const deltaTime = timestamp - lastTime;
        if (deltaTime < fpsLimit) {
            requestAnimationFrame(draw);
            return;
        }
        lastTime = timestamp;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!gameOver) {
            if (touchX !== null) {
                const targetX = touchX - player.width / 2;
                if (targetX >= 0 && targetX <= canvas.width - player.width) {
                    player.x = targetX;
                }
            }
        }

        ctx.drawImage(player.image, player.x, player.y, player.width, player.height);

        for (let i = 0; i < obstacles.length; i++) {
            const obstacle = obstacles[i];
            if (obstacle.y < canvas.height + collisionDistance) {
                obstacle.y += obstacleSpeed / 100;

                ctx.drawImage(obstacle.image, obstacle.x, obstacle.y, obstacleWidth, obstacleHeight);

                let playerRadius = player.width / 2;
                let obstacleRadius = obstacleHeight / 2;
                let playerCenterX = player.x + playerRadius;
                let playerCenterY = player.y + playerRadius;
                let obstacleCenterX = obstacle.x + obstacleRadius;
                let obstacleCenterY = obstacle.y + obstacleRadius;

                let dx = playerCenterX - obstacleCenterX;
                let dy = playerCenterY - obstacleCenterY;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < playerRadius + obstacleRadius) {
                    if (obstacle.isPoint) {
                        score++;
                        document.getElementById("score").textContent = score;
                        if (score > highScore) {
                            document.getElementById("highScore").textContent = score;
                        }

                        obstacles.splice(i, 1);
                        i--;
                    } else if (obstacle.isPowerup) {
                        timeStop();

                        obstacles.splice(i, 1);
                        i--;
                    } else {
                        endGame();
                    }
                }
            }
        }

        if (!gameOver && !timeStopSlow) {
            obstacleSpeed += canvas.height * 0.0005;
            if (obstacleSpeed > canvas.height * 2.5) {
                obstacleSpeed = canvas.height * 2.5;
            }
        }

        requestAnimationFrame(draw);
    }

    function timeStop() {
        timeStopSlow = true;
        obstacleSpeed *= 0.5;
        startPowerupBar();

        obstacles.forEach((obstacle) => {
            if (obstacle.isPowerup) {
                obstacle.isPowerup = false;
                obstacle.isPoint = true;

                const pointImage = new Image();
                pointImage.src = pointImages[Math.floor(Math.random() * pointImages.length)];
                obstacle.image = pointImage;
            }
        });

        setTimeout(() => {
            timeStopSlow = false;
            obstacleSpeed *= 2;
        }, 6000);
    }

    let powerupDuration = 6000;
    let powerupRemainingTime = 0;
    let powerupInterval;
    let powerupBar;

    function startPowerupBar() {
        powerupRemainingTime = powerupDuration;
        clearInterval(powerupInterval);

        powerupBar = document.getElementById("powerupBar");
        if (powerupBar) {
            powerupBar.style.width = "100%";
            powerupBar.style.marginLeft = "0%";

            requestAnimationFrame(updatePowerupBar);
        }
    }

    function updatePowerupBar() {
        if (powerupRemainingTime <= 0) {
            powerupBar.style.width = "0%";
            powerupBar.style.marginLeft = "0%";
            return;
        }

        powerupRemainingTime -= 16;
        const progressPercentage = (powerupRemainingTime / powerupDuration) * 100;

        powerupBar.style.width = `${progressPercentage}%`;
        powerupBar.style.marginLeft = `${(100 - progressPercentage) * 0.5}%`;

        if (powerupRemainingTime > 0) {
            requestAnimationFrame(updatePowerupBar);
        }
    }

    let pointSpawnBoost = 0;

    function spawnObstacle() {
        const x = Math.random() * (canvas.width - obstacleWidth);
        const y = -obstacleHeight;

        const obstacleImage = new Image();
        obstacleImage.onload = checkImagesLoaded;
        obstacleImage.src = obstacleImages[Math.floor(Math.random() * obstacleImages.length)];

        const obstacle = { x, y, image: obstacleImage, isPoint: false, isPowerup: false };
        obstacles.push(obstacle);

        const shouldSpawnPoint = Math.random() < calculateSpawnProbability(score, "point");
        const shouldSpawnSecondObstacle = !shouldSpawnPoint && Math.random() < 0.25;
        const shouldSpawnPowerup =
            !shouldSpawnPoint &&
            !shouldSpawnSecondObstacle &&
            Math.random() < calculateSpawnProbability(score, "powerup");

        if (shouldSpawnPoint) {
            spawnEntity(pointImages, "point");
            pointSpawnBoost = Math.max(0, pointSpawnBoost - 0.1);
        }

        if (shouldSpawnSecondObstacle) {
            spawnEntity(obstacleImages, "obstacle");
        }

        if (shouldSpawnPowerup) {
            spawnEntity(powerupImages, "powerup");
            pointSpawnBoost = Math.max(0, pointSpawnBoost - 0.1);
        }

        if (!shouldSpawnPoint && !shouldSpawnPowerup) {
            pointSpawnBoost = Math.min(1, pointSpawnBoost + 0.05);
        }

        const spawnRate = timeStopSlow ? Math.max(600, 1500 - score * 8) : Math.max(400, 1500 - score * 20);
        setTimeout(spawnObstacle, spawnRate);
    }

    function spawnEntity(imageArray, type) {
        const x = Math.random() * (canvas.width - obstacleWidth);
        const y = -obstacleHeight;

        const image = new Image();
        image.onload = checkImagesLoaded;
        image.src = imageArray[Math.floor(Math.random() * imageArray.length)];

        const entity = {
            x,
            y,
            image,
            isPoint: type === "point",
            isPowerup: type === "powerup"
        };

        const lastObstacle = obstacles[obstacles.length - 1];
        if (!lastObstacle || Math.abs(entity.x - lastObstacle.x) >= canvas.height * 0.175) {
            obstacles.push(entity);
        }
    }

    function calculateSpawnProbability(score, type) {
        if (type === "point") {
            let baseProbability;
            if (timeStopSlow) {
                baseProbability = 0.7;
            } else {
                if (score >= 50) baseProbability = 0.4;
                else if (score >= 25) baseProbability = 0.5;
                else if (score >= 10) baseProbability = 0.6;
                else baseProbability = 0.6;
            }
            return Math.min(1, baseProbability + pointSpawnBoost);
        }

        if (type === "powerup") {
            if (timeStopSlow) return 0;

            if (score >= 75) return 0.3;
            if (score >= 25) return 0.2;
            if (score >= 10) return 0.1;
            return 0.1;
        }
    }

    const timerElement = document.getElementById("timer");

    let timer = null;
    let seconds = 0;

    const Timer = {
        start() {
            if (timer) return;
            timer = setInterval(this.update.bind(this), 1000);
        },

        update() {
            seconds += timeStopSlow ? 0.5 : 1;
            this.render();
        },

        render() {
            const minutes = Math.floor(seconds / 60);
            const secFloat = seconds % 60;
            const intPart = Math.floor(secFloat).toString().padStart(2, "0");
            const decimalPart = secFloat % 1 !== 0 ? "." + Math.round((secFloat % 1) * 10) : "";

            timerElement.textContent = `${minutes}:${intPart}${decimalPart}`;
        },

        stop() {
            clearInterval(timer);
            timer = null;
        },

        reset() {
            this.stop();
            seconds = 0;
            this.render();
        },

        getTime() {
            return seconds;
        }
    };

    Timer.start();

    function toggleOverlay(show) {
        document.getElementById("endOverlay").style.display = show ? "flex" : "none";
        document.getElementById("blur").style.display = show ? "block" : "none";
    }

    function updateEndScreen() {
        if (score > highScore) {
            highScore = score;
            const progressMiniGame = { highScore };
            localStorage.setItem("FI3MiniGametest7", JSON.stringify(progressMiniGame));
        }

        document.getElementById("endHighScoreDisplay").textContent = highScore;
        document.getElementById("endScore").textContent = score;

        const minutes = Math.floor(seconds / 60);
        const secFloat = seconds % 60;
        const intPart = Math.floor(secFloat).toString().padStart(2, "0");
        const decimalPart = secFloat % 1 !== 0 ? "." + Math.round((secFloat % 1) * 10) : "";

        document.getElementById("time").textContent = `${minutes}:${intPart}${decimalPart}`;
    }

    function endGame() {
        gameOver = true;
        obstacleSpeed = 0;
        Timer.stop();
        updateEndScreen();
        toggleOverlay(true);
        powerupBar = document.getElementById("powerupBar");
        powerupBar.style.width = "0%";
    }

    function restartGame() {
        toggleOverlay(false);
        gameOver = false;
        obstacleSpeed = canvas.height * 0.75;
        score = 0;
        document.getElementById("highScore").textContent = highScore;
        document.getElementById("score").textContent = score;
        Timer.reset();
        Timer.start();
        obstacles.length = 0;
    }

    function backToMenu() {
        window.location.href = "index.html";
    }

    document.getElementById("restartButton").onclick = restartGame;
    document.getElementById("menuButton").onclick = backToMenu;
});
