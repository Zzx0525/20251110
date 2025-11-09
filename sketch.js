let objs = [];
let colors = ['#0065CB', '#FF0042', '#FB4103', '#26A692', '#F9E000'];
let taa = 10;
let sideMenu;

function setup() {
	// createCanvas(900, 900);
  createCanvas(windowWidth, windowHeight);
	rectMode(CENTER);
	adddd();

	// cache side menu DOM element (added in index.html)
	sideMenu = document.getElementById('sideMenu');

		// iframe modal elements
		const workLink = document.getElementById('menu-work');
		const iframeModal = document.getElementById('iframeModal');
		const iframeClose = document.getElementById('iframeClose');
		const contentFrame = document.getElementById('contentFrame');
		const iframeBackdrop = document.getElementById('iframeBackdrop');

		function openIframe(url) {
			console.log('openIframe()', url);
			if (!iframeModal || !contentFrame) {
				console.warn('iframe elements missing');
				return;
			}
			// show loader and reset error
			const loader = document.getElementById('iframeLoader');
			const err = document.getElementById('iframeErr');
			if (loader) loader.style.display = 'block';
			if (err) err.setAttribute('hidden', '');
			contentFrame.src = url;
			iframeModal.classList.add('open');
			iframeModal.setAttribute('aria-hidden', 'false');
			// disable canvas pointer events while modal open
			const cnv = document.querySelector('canvas');
			if (cnv) cnv.style.pointerEvents = 'none';

			// timeout to detect possible iframe embed blocking
			let loaded = false;
			const onLoad = () => {
				loaded = true;
				if (loader) loader.style.display = 'none';
				// remove listener
				contentFrame.removeEventListener('load', onLoad);
			};
			contentFrame.addEventListener('load', onLoad);
			setTimeout(() => {
				if (!loaded) {
					if (loader) loader.style.display = 'none';
					if (err) err.removeAttribute('hidden');
				}
			}, 5000);
		}

		function closeIframe() {
			if (!iframeModal || !contentFrame) return;
			iframeModal.classList.remove('open');
			iframeModal.setAttribute('aria-hidden', 'true');
			// clear src to stop audio/video in iframe
			contentFrame.src = '';
			const loader = document.getElementById('iframeLoader');
			const err = document.getElementById('iframeErr');
			if (loader) loader.style.display = 'none';
			if (err) err.setAttribute('hidden', '');
			const cnv = document.querySelector('canvas');
			if (cnv) cnv.style.pointerEvents = '';
		}

		if (workLink) {
			workLink.addEventListener('click', (e) => {
				e.preventDefault();
				console.log('click workLink');
				openIframe('https://zzx0525.github.io/2025.10.20-new/'); //第一單元作品
			});
		}
			const handoutLink = document.getElementById('menu-handout');
			if (handoutLink) {
				handoutLink.addEventListener('click', (e) => {
					e.preventDefault();
				console.log('click handoutLink');
				openIframe('https://hackmd.io/@YATYlqJQTfOCDwPrLFCIaw/SyJFvX0igl'); //第一單元講義
				});
			}

			const testLink = document.getElementById('menu-test');
			if (testLink) {
				testLink.addEventListener('click', (e) => {
					e.preventDefault();
					console.log('click testLink');
					// 設定 iframe 大小
					const contentFrame = document.getElementById('contentFrame');
					if (contentFrame) {
						contentFrame.style.width = '70vw';
						contentFrame.style.height = '85vh';
					}
					openIframe('https://zzx0525.github.io/Testing-System/'); //測驗
				});
			}

			// 測驗系統筆記連結
			const testNoteLink = document.getElementById('menu-testnote');
			if (testNoteLink) {
				testNoteLink.addEventListener('click', (e) => {
					e.preventDefault();
					console.log('click testNoteLink');
					// 設定 iframe 大小
					const contentFrame = document.getElementById('contentFrame');
					if (contentFrame) {
						contentFrame.style.width = '70vw';
						contentFrame.style.height = '85vh';
					}
					openIframe('https://hackmd.io/@YATYlqJQTfOCDwPrLFCIaw/r1ZXAg6J-l'); //測驗系統筆記
				});
			}

			
		if (iframeClose) iframeClose.addEventListener('click', closeIframe);
		if (iframeBackdrop) iframeBackdrop.addEventListener('click', closeIframe);

		// close with ESC key
		window.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') closeIframe();
		});
}

function draw() {
	// handle menu open/close based on mouseX (hysteresis to avoid flicker)
	if (sideMenu) {
		if (mouseX <= 100) {
			sideMenu.classList.add('open');
			sideMenu.setAttribute('aria-hidden', 'false');
		} else if (mouseX > 150) {
			sideMenu.classList.remove('open');
			sideMenu.setAttribute('aria-hidden', 'true');
		}
	}

	background('#0a2a38');

	for (let i of objs) {
		i.show();
		i.move();
	}

	// 繪製白色透明框和文字（移到最上層）
	push();
	// 設定白色透明填充
	fill(255, 255, 255, 120); 
	// 設定透明邊框
	noStroke();
	// 繪製長方形框
	rectMode(CENTER);
	rect(width/2, height/2, 400, 160, 10);
	
	// 設定文字屬性
	fill(255);
	textSize(30);  // 加大字體大小
	textAlign(CENTER, CENTER);
	// 繪製文字
	text("名字：周o暄\n班級：教科系一B\n學號：414730241", width/2, height/2);
	pop();
	for (let i = 0; i < objs.length; i++) {
		if (objs[i].isDead) {
			objs.splice(i, 1);
		}
	}
	if (frameCount % taa == 0) {
		adddd();
	}
}

function adddd() {
	let num = int(random(20) * random(random())) + 1;
	for (let i = 0; i < num; i++) {
		objs.push(new KHB(random(width), random(height)));
	}
}

class KHB {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.amp = width * 0.01 * random(0.75, 1.25);
		this.fr = PI * int(random(1, 4));
		this.len = width * 0.04 * random(0.75, 1.25);
		this.ang = 0;
		this.t = random(100);
		this.nsc = width * 0.005;
		this.dir = 0;
		this.ttm = random(100);
		this.step = width * random(0.0005, 0.004);
		this.col = color(random(colors));
		this.lifeSpan = int(random(200, 1000));
		this.life = this.lifeSpan;
		this.isDead = false;
		this.alp = 0;
	}

	show() {
		push();
		translate(this.x, this.y);
		rotate(this.dir);
		noFill()
		this.col.setAlpha(this.alp);
		stroke(this.col);
		strokeWeight(width * 0.008);
		beginShape();
		for (let a = 0; a <= this.fr; a += TAU / 180) {
			let xx = map(a, 0, this.fr, 0, this.len);
			let r = map(a, 0, this.fr, this.amp, 0);
			vertex(xx - this.len, r * sin(a + (this.t / 2.5) * this.step * 0.5));
			xx -= width * 0.0002
		}
		endShape();
		pop();

	}

	move() {
		let px = this.x;
		let py = this.y;
		this.x += this.step * cos(this.ang);
		this.y += this.step * sin(this.ang);
		this.ang = this.nsc * noise(this.x * 0.005, this.y * 0.005, this.t * 0.01) + this.ttm;
		this.t++;
		this.dir = atan2((this.y - py), (this.x - px));
		this.life--;
		if (this.life < 0) {
			this.isDead = true;
		}
		this.alp = sin(map(this.life, this.lifeSpan, 0, 0, PI)) * 400;
	}
}