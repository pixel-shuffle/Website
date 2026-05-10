function buildParticles() {
  const container = document.getElementById("particles");
  for (let i = 0; i < 30; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left = Math.random() * 100 + "%";
    p.style.animationDuration = 6 + Math.random() * 8 + "s";
    p.style.animationDelay = Math.random() * 10 + "s";
    p.style.width = 2 + Math.random() * 4 + "px";
    p.style.height = p.style.width;

    const colors = ["#e8a634", "#3498db", "#9b59b6", "#e74c3c", "#2ecc71"];
    p.style.background = colors[Math.floor(Math.random() * colors.length)];

    container.appendChild(p);
  }
}

function initMinerAnim() {
  var frames = ["character/character_1.png", "character/character_2.png"];
  var miners = document.querySelectorAll(".miner-frame");
  var idx = 0;

  setInterval(function () {
    idx = 1 - idx;
    miners.forEach(function (img) {
      img.src = frames[idx];
    });
  }, 400);
}

function initDrillbitOrbit() {
  const sprites = document.querySelectorAll("[data-orbit]");
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  document.addEventListener("mousemove", function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  sprites.forEach(function (sprite) {
    const drillbit = sprite.querySelector(".drillbit-orbit");
    const eyes = sprite.querySelector(".miner-eyes");
    if (!drillbit) return;

    var eyeMap = {
      ul: "character/eyes_ul.png",
      ur: "character/eyes_ur.png",
      bl: "character/eyes_bl.png",
      br: "character/eyes_br.png",
    };
    var currentDir = "bl";

    let currentAngle = 0;
    const orbitRadius = 1.6;
    const lerp = 0.08;

    var drillCols = 3;
    var drillFrame = 0;
    var drillInterval = null;

    document.addEventListener("mousedown", function (e) {
      if (drillInterval) return;
      drillFrame = 2;
      drillInterval = setInterval(function () {
        drillFrame = (drillFrame + 1) % drillCols;
        drillbit.style.backgroundPosition =
          "-" + drillFrame * drillbit.offsetHeight + "px 0";
      }, 100);
    });

    document.addEventListener("mouseup", function () {
      if (drillInterval) {
        clearInterval(drillInterval);
        drillInterval = null;
        drillFrame = 0;
        drillbit.style.backgroundPosition = "90 0";
      }
    });

    function animate() {
      const rect = sprite.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const targetAngle = Math.atan2(mouseY - cy, mouseX - cx);

      let diff = targetAngle - currentAngle;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;

      currentAngle += diff * lerp;

      const rx = (rect.width / 2) * orbitRadius;
      const ry = (rect.height / 2) * orbitRadius;

      const dx = Math.cos(currentAngle) * rx;
      const dy = Math.sin(currentAngle) * ry;

      drillbit.style.left =
        rect.width / 2 + dx - drillbit.offsetWidth / 2 + "px";
      drillbit.style.top =
        rect.height / 2 + dy - drillbit.offsetHeight / 2 + "px";
      drillbit.style.transform =
        "rotate(" + ((currentAngle * 180) / Math.PI + 90) + "deg)";

      if (eyes) {
        var dir = (mouseY >= cy ? "b" : "u") + (mouseX >= cx ? "r" : "l");
        if (dir !== currentDir) {
          currentDir = dir;
          eyes.src = eyeMap[dir];
        }
      }

      requestAnimationFrame(animate);
    }

    animate();
  });
}

function buildTerrain() {
  var container = document.getElementById("terrain");
  container.innerHTML = "";
  var cols = Math.ceil(window.innerWidth / 48);
  var rows = Math.ceil(document.documentElement.scrollHeight / 48);

  var oreTiers = [
    {
      ores: [
        "copperlv1.png",
        "copperlv2.png",
        "tin_alt_1.png",
        "tin_alt_2.png",
      ],
      weight: 8,
      minRow: 0,
    },
    {
      ores: [
        "copperlv3.png",
        "iron_alt_1.png",
        "iron_alt_2.png",
        "iron_alt_3.png",
      ],
      weight: 5,
      minRow: 0,
    },
    {
      ores: ["sivlerlv1.png", "sivlerlv2.png", "sivlerlv3.png"],
      weight: 3,
      minRow: 0,
    },
    {
      ores: ["goldlv1.png", "goldlv2.png", "goldlv3.png"],
      weight: 1.5,
      minRow: 0,
    },
    {
      ores: ["diamondlv1.png", "diamondlv2.png", "diamondlv3.png"],
      weight: 0.8,
      minRow: 0,
    },
    {
      ores: [
        "diamondBluelv1.png",
        "diamondBluelv2.png",
        "diamondBluelv3.png",
        "diamondRedlv1.png",
        "diamondREdlv2.png",
        "diamondRedlv3.png",
        "diamondPurplelv1.png",
        "diamondPurplelv2.png",
        "diamondPurplelv3.png",
      ],
      weight: 0.4,
      minRow: 0,
    },
    {
      ores: ["chest_alt.png", "gold_chest.png", "red_chest.png"],
      weight: 0.2,
      minRow: 0,
    },
  ];

  function pickOre(row) {
    var available = [];
    for (var i = 0; i < oreTiers.length; i++) {
      if (row >= oreTiers[i].minRow) {
        available.push(oreTiers[i]);
      }
    }
    var totalWeight = 0;
    for (var i = 0; i < available.length; i++) {
      totalWeight += available[i].weight;
    }
    var roll = Math.random() * totalWeight;
    var acc = 0;
    for (var i = 0; i < available.length; i++) {
      acc += available[i].weight;
      if (roll < acc) {
        var tier = available[i];
        return tier.ores[Math.floor(Math.random() * tier.ores.length)];
      }
    }
    return available[available.length - 1].ores[0];
  }

  container.style.gridTemplateColumns = "repeat(" + cols + ", 48px)";

  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
      var cell = document.createElement("div");
      cell.className = "terrain-cell";

      var img = document.createElement("img");
      var src;

      var oreChance = 0.25;
      if (Math.random() < oreChance) {
        src = "Blocks/" + pickOre(r);
      } else {
        src = "Blocks/stone_alt.png";
      }

      img.src = src;

      cell.appendChild(img);
      container.appendChild(cell);
    }
  }
}

function initBatAnim() {
  var bats = document.querySelectorAll("[data-bat]");
  var cols = 4;
  var rows = 4;
  var frameSize = 64;
  var totalFrames = cols * rows;

  bats.forEach(function (bat) {
    var frame = 0;
    var interval = null;

    bat.style.backgroundPosition = "-192px 0";

    bat.addEventListener("mouseenter", function () {
      if (interval) return;
      interval = setInterval(function () {
        frame = (frame + 1) % totalFrames;

        var col = frame % cols;
        if (col == 0) col = 1;
        bat.style.backgroundPosition =
          "-" + col * frameSize + "px -" + 0 * frameSize + "px";
      }, 150);
    });

    bat.addEventListener("mouseleave", function () {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      frame = 0;
      bat.style.backgroundPosition = "-192px 0";
    });
  });
}

function init() {
  buildTerrain();
  buildParticles();
  initMinerAnim();
  initDrillbitOrbit();
  initBatAnim();
}

init();

var terrainResizeTimer;
window.addEventListener("resize", function () {
  clearTimeout(terrainResizeTimer);
  terrainResizeTimer = setTimeout(buildTerrain, 200);
});
