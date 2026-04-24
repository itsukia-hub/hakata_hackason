// --- HTML要素を取得 ---
var field = document.getElementById('field');
var playerEl = document.getElementById('player');
var oniEl = document.getElementById('oni');
var timeDisplay = document.getElementById('time-display');
var scoreDisplay = document.getElementById('score-display');
var titleScreen = document.getElementById('title-screen');
var gameoverScreen = document.getElementById('gameover-screen');
var clearScreen = document.getElementById('clear-screen');

// --- ゲームの設定 ---
var W = 800;
var H = 600;

// --- ゲームの変数 ---
var state = 'title'; // "title" / "playing" / "gameover" / "clear"
var score = 0;
var timeLeft = 30;
var timer = null;
var mouseX = W / 2;
var mouseY = H / 2;

// プレイヤーの位置とスピード
var playerX = W / 2;
var playerY = H / 2;
var playerR = 14;
var playerSpeed = 3.5;

// 鬼の位置とスピード
var oniX = 100;
var oniY = 100;
var oniR = 16;
var oniSpeed = 2.0;

// アイテムの配列
var items = [];

// --- アイテムを1つ追加する ---
function addItem() {
  // div要素を作ってフィールドに追加
  var div = document.createElement('div');
  div.className = 'item';
  var x = 30 + Math.random() * (W - 60);
  var y = 40 + Math.random() * (H - 70);
  div.style.left = (x - 10) + 'px';
  div.style.top = (y - 10) + 'px';
  field.appendChild(div);

  items.push({ x: x, y: y, r: 10, el: div });
}

// --- 2つの円が重なっているか判定 ---
function isHit(x1, y1, r1, x2, y2, r2) {
  var dx = x1 - x2;
  var dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy) < r1 + r2;
}

// --- 画面の表示切り替え ---
function showScreen(name) {
  titleScreen.style.display = 'none';
  gameoverScreen.style.display = 'none';
  clearScreen.style.display = 'none';

  if (name === 'title') titleScreen.style.display = 'flex';
  if (name === 'gameover') gameoverScreen.style.display = 'flex';
  if (name === 'clear') clearScreen.style.display = 'flex';
}

// --- ゲーム開始 ---
function startGame() {
  state = 'playing';
  score = 0;
  timeLeft = 30;
  playerX = W / 2;
  playerY = H / 2;
  oniX = 100;
  oniY = 100;

  // 古いアイテムを削除
  for (var i = 0; i < items.length; i++) {
    items[i].el.remove();
  }
  items = [];

  // 初期アイテムを配置
  addItem();
  addItem();
  addItem();

  // 画面を切り替え
  showScreen('');
  updateHUD();

  // 1秒ごとにカウントダウン
  clearInterval(timer);
  timer = setInterval(function () {
    if (state !== 'playing') return;

    timeLeft--;
    updateHUD();

    // タイムアップでクリア
    if (timeLeft <= 0) {
      state = 'clear';
      clearInterval(timer);
      document.getElementById('clear-score').textContent = 'スコア: ' + score;
      showScreen('clear');
    }

    // 3秒ごとにアイテム追加（最大8個）
    if (timeLeft % 3 === 0 && items.length < 8) {
      addItem();
    }
  }, 1000);
}

// --- HUD（スコア・時間）を更新 ---
function updateHUD() {
  timeDisplay.textContent = '残り ' + timeLeft + '秒';
  scoreDisplay.textContent = 'スコア: ' + score;
}

// --- マウス位置を記録 ---
field.addEventListener('mousemove', function (e) {
  var rect = field.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
});

// --- 毎フレームの更新処理 ---
function update() {
  if (state !== 'playing') return;

  // プレイヤーをマウスに向かって移動
  var dx = mouseX - playerX;
  var dy = mouseY - playerY;
  var dist = Math.sqrt(dx * dx + dy * dy);
  if (dist > 2) {
    playerX += (dx / dist) * playerSpeed;
    playerY += (dy / dist) * playerSpeed;
  }

  // 画面の外に出ないようにする
  playerX = Math.max(playerR, Math.min(W - playerR, playerX));
  playerY = Math.max(playerR, Math.min(H - playerR, playerY));

  // 鬼がプレイヤーを追いかける
  var odx = playerX - oniX;
  var ody = playerY - oniY;
  var odist = Math.sqrt(odx * odx + ody * ody);
  if (odist > 1) {
    oniX += (odx / odist) * oniSpeed;
    oniY += (ody / odist) * oniSpeed;
  }

  // 鬼に捕まったらゲームオーバー
  if (isHit(playerX, playerY, playerR, oniX, oniY, oniR)) {
    state = 'gameover';
    clearInterval(timer);
    document.getElementById('gameover-score').textContent = 'スコア: ' + score;
    showScreen('gameover');
  }

  // アイテム取得判定
  for (var i = items.length - 1; i >= 0; i--) {
    if (isHit(playerX, playerY, playerR, items[i].x, items[i].y, items[i].r)) {
      score += 100;
      updateHUD();
      items[i].el.remove();  // 画面からアイテムを消す
      items.splice(i, 1);    // 配列からも削除
    }
  }

  // HTML要素の位置を更新
  playerEl.style.left = (playerX - playerR) + 'px';
  playerEl.style.top = (playerY - playerR) + 'px';
  oniEl.style.left = (oniX - oniR) + 'px';
  oniEl.style.top = (oniY - oniR) + 'px';
}

// --- メインループ（毎フレーム実行） ---
function gameLoop() {
  update();
  requestAnimationFrame(gameLoop);
}

gameLoop();
