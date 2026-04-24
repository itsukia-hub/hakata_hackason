// HTML要素の取得
var field = document.getElementById('field');
var playerEl = document.getElementById('player');
var oniEl = document.getElementById('oni');
var gameoverScreen = document.getElementById('gameover-screen');

// ゲーム設定
var W = 800, H = 600;
var playerR = 14;
var playerSpeed = 3.5;
var oniR = 16;
var oniSpeed = 2.0;
var state = 'playing';

// 位置（中央からスタート）
var playerX = W / 2;
var playerY = H / 2;
var mouseX = W / 2;
var mouseY = H / 2;
var oniX = 100;
var oniY = 100;

// マウス位置を記録
field.addEventListener('mousemove', function (e) {
	var rect = field.getBoundingClientRect();
	mouseX = e.clientX - rect.left;
	mouseY = e.clientY - rect.top;
});

// 2つの円が重なっているか判定
function isHit(x1, y1, r1, x2, y2, r2) {
	var dx = x1 - x2;
	var dy = y1 - y2;
	return Math.sqrt(dx * dx + dy * dy) < r1 + r2;
}

// 毎フレームの更新処理
function update() {
	if (state !== 'playing') return;

	// プレイヤー移動
	var dx = mouseX - playerX;
	var dy = mouseY - playerY;
	var dist = Math.sqrt(dx * dx + dy * dy);
	if (dist > 2) {
		playerX += (dx / dist) * playerSpeed;
		playerY += (dy / dist) * playerSpeed;
	}
	playerX = Math.max(playerR, Math.min(W - playerR, playerX));
	playerY = Math.max(playerR, Math.min(H - playerR, playerY));
	playerEl.style.left = (playerX - playerR) + 'px';
	playerEl.style.top = (playerY - playerR) + 'px';

	// 鬼がプレイヤーを追いかける
	var odx = playerX - oniX;
	var ody = playerY - oniY;
	var odist = Math.sqrt(odx * odx + ody * ody);
	if (odist > 1) {
		oniX += (odx / odist) * oniSpeed;
		oniY += (ody / odist) * oniSpeed;
	}
	oniEl.style.left = (oniX - oniR) + 'px';
	oniEl.style.top = (oniY - oniR) + 'px';

	// 鬼に捕まったらゲームオーバー
	if (isHit(playerX, playerY, playerR, oniX, oniY, oniR)) {
		state = 'gameover';
		gameoverScreen.style.display = 'flex';
	}
}

// メインループ
function gameLoop() {
	update();
	requestAnimationFrame(gameLoop);
}

// リトライ
function startGame() {
	state = 'playing';
	playerX = W / 2;
	playerY = H / 2;
	oniX = 100;
	oniY = 100;
	gameoverScreen.style.display = 'none';
}

gameLoop();
