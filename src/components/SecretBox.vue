<script setup lang="ts">
import { ref } from 'vue';

const isOpen = ref(false);
const isShaking = ref(false);

function shake() {
  if (isOpen.value) return;
  isShaking.value = true;
  setTimeout(() => (isShaking.value = false), 600);
}

function openBox() {
  isOpen.value = true;
}
</script>

<template>
  <div class="secret-section">
    <p class="hint-text">✨ Có một điều nhỏ xinh đang chờ bạn khám phá...</p>

    <div
      class="box-wrapper"
      :class="{ shaking: isShaking, opened: isOpen }"
      @mouseenter="shake"
    >
      <!-- Lid -->
      <div class="box-lid" :class="{ 'lid-open': isOpen }">
        <div class="lid-ribbon"></div>
        <div class="lid-bow">
          <div class="bow-left"></div>
          <div class="bow-right"></div>
          <div class="bow-knot"></div>
        </div>
      </div>

      <!-- Box body -->
      <div class="box-body">
        <div class="box-ribbon-v"></div>
        <div class="box-stars">
          <span>✦</span><span>✦</span><span>✦</span>
        </div>
      </div>

      <!-- Hearts burst when opened -->
      <div v-if="isOpen" class="hearts-burst">
        <span v-for="n in 8" :key="n" class="burst-heart" :style="{ '--i': n }">💕</span>
      </div>
    </div>

    <!-- Open button -->
    <button v-if="!isOpen" class="btn-open" @click="openBox">
      <span>🎁 Mở hộp quà</span>
    </button>

    <!-- Reveal area -->
    <Transition name="reveal">
      <div v-if="isOpen" class="reveal-card">
        <div class="reveal-hearts">💖</div>
        <p class="reveal-message">Dành cho người đặc biệt của tôi...</p>
        <p class="reveal-sub">Ghé thăm thế giới nhỏ của tôi nhé 🌸</p>
        <a
          href="https://www.instagram.com/hieuz2310/"
          target="_blank"
          rel="noopener noreferrer"
          class="insta-link"
        >
          <svg class="insta-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#f09433"/>
                <stop offset="25%" stop-color="#e6683c"/>
                <stop offset="50%" stop-color="#dc2743"/>
                <stop offset="75%" stop-color="#cc2366"/>
                <stop offset="100%" stop-color="#bc1888"/>
              </linearGradient>
            </defs>
            <rect x="2" y="2" width="20" height="20" rx="6" ry="6" fill="url(#ig-grad)"/>
            <circle cx="12" cy="12" r="4.5" stroke="white" stroke-width="1.8" fill="none"/>
            <circle cx="17.5" cy="6.5" r="1.2" fill="white"/>
          </svg>
          <span>@hieuz2310</span>
        </a>
        <p class="reveal-footer">💝 Cảm ơn vì đã ghé thăm 💝</p>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.secret-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 24px 16px;
}

.hint-text {
  font-family: 'Dancing Script', cursive;
  font-size: 1.2rem;
  color: #b5547a;
  text-align: center;
  animation: float 3s ease-in-out infinite;
}

/* === BOX === */
.box-wrapper {
  position: relative;
  width: 120px;
  height: 110px;
  cursor: pointer;
  transition: transform 0.3s;
  filter: drop-shadow(0 8px 20px rgba(233, 30, 100, 0.25));
}

.box-wrapper:hover {
  transform: scale(1.05);
}

.box-wrapper.shaking {
  animation: shake 0.5s ease-in-out;
}

.box-body {
  position: absolute;
  bottom: 0;
  width: 120px;
  height: 70px;
  background: linear-gradient(135deg, #ff8fab, #ff6b9d);
  border-radius: 8px 8px 12px 12px;
  overflow: hidden;
  box-shadow: inset 0 -4px 10px rgba(0,0,0,0.1);
}

.box-ribbon-v {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 14px;
  height: 100%;
  background: rgba(255,255,255,0.35);
  border-radius: 4px;
}

.box-stars {
  position: absolute;
  bottom: 10px;
  left: 0; right: 0;
  display: flex;
  justify-content: space-around;
  padding: 0 18px;
  color: rgba(255,255,255,0.6);
  font-size: 12px;
}

/* Lid */
.box-lid {
  position: absolute;
  top: 0;
  width: 120px;
  height: 46px;
  background: linear-gradient(135deg, #ff4d94, #e91e8c);
  border-radius: 8px;
  z-index: 2;
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s;
  transform-origin: top center;
  box-shadow: 0 4px 12px rgba(233,30,140,0.3);
}

.box-lid.lid-open {
  transform: rotateX(-120deg) translateY(-30px);
  opacity: 0;
}

.lid-ribbon {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 14px;
  height: 100%;
  background: rgba(255,255,255,0.3);
  border-radius: 4px;
}

/* Bow */
.lid-bow {
  position: absolute;
  top: -18px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bow-left, .bow-right {
  width: 24px;
  height: 20px;
  background: linear-gradient(135deg, #ff3385, #c2185b);
  border-radius: 50% 50% 0 50%;
}

.bow-left {
  transform: rotate(-30deg) translateX(4px);
}

.bow-right {
  transform: rotate(30deg) translateX(-4px) scaleX(-1);
}

.bow-knot {
  position: absolute;
  width: 14px;
  height: 14px;
  background: radial-gradient(circle, #ff6bb3, #e91e8c);
  border-radius: 50%;
  z-index: 1;
  box-shadow: 0 0 8px rgba(233,30,140,0.5);
}

/* === Hearts burst === */
.hearts-burst {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.burst-heart {
  position: absolute;
  top: 40%;
  left: 50%;
  font-size: 18px;
  animation: burst 1.2s ease-out forwards;
  animation-delay: calc(var(--i) * 0.08s);
  opacity: 0;
}

@keyframes burst {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  100% {
    transform: translate(
      calc(-50% + cos(calc(var(--i) * 45deg)) * 80px),
      calc(-50% + sin(calc(var(--i) * 45deg)) * 80px)
    ) scale(1.2);
    opacity: 0;
  }
}

/* === Open button === */
.btn-open {
  padding: 12px 30px;
  background: linear-gradient(135deg, #ff6b9d, #e91e8c);
  color: white;
  border: none;
  border-radius: 50px;
  font-family: 'Nunito', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(233, 30, 140, 0.35);
  transition: all 0.3s;
  letter-spacing: 0.5px;
}

.btn-open:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 10px 28px rgba(233, 30, 140, 0.45);
}

.btn-open:active {
  transform: translateY(0) scale(0.97);
}

/* === Reveal card === */
.reveal-card {
  background: linear-gradient(135deg, rgba(255,255,255,0.92), rgba(255, 240, 245, 0.95));
  border: 2px solid #ffb3c6;
  border-radius: 20px;
  padding: 28px 32px;
  text-align: center;
  box-shadow: 0 16px 40px rgba(233, 30, 140, 0.15);
  max-width: 320px;
  width: 100%;
  backdrop-filter: blur(10px);
}

.reveal-hearts {
  font-size: 2.5rem;
  animation: pulse-heart 1.2s ease-in-out infinite;
  display: block;
  margin-bottom: 12px;
}

.reveal-message {
  font-family: 'Dancing Script', cursive;
  font-size: 1.4rem;
  color: #c2185b;
  margin-bottom: 6px;
}

.reveal-sub {
  font-size: 0.9rem;
  color: #a0607a;
  margin-bottom: 20px;
}

.insta-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
  color: white;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  box-shadow: 0 6px 20px rgba(180, 30, 100, 0.35);
  transition: all 0.3s;
  margin-bottom: 16px;
}

.insta-link:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 10px 28px rgba(180, 30, 100, 0.45);
  color: white;
}

.insta-icon {
  width: 26px;
  height: 26px;
  flex-shrink: 0;
}

.reveal-footer {
  font-size: 0.85rem;
  color: #c2185b;
  font-family: 'Dancing Script', cursive;
  font-size: 1.1rem;
}

/* === Transition === */
.reveal-enter-active {
  animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.6) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* === Animations === */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

@keyframes shake {
  0%, 100% { transform: rotate(0deg); }
  15% { transform: rotate(-6deg) scale(1.05); }
  30% { transform: rotate(6deg) scale(1.05); }
  45% { transform: rotate(-4deg); }
  60% { transform: rotate(4deg); }
  75% { transform: rotate(-2deg); }
}

@keyframes pulse-heart {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}
</style>
