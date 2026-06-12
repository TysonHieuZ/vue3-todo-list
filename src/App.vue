<script setup lang="ts">
import { reactive } from 'vue';
import { usePermissionStore } from './stores/permissionStore';
import type { PermissionKey } from './stores/permissionStore';
import PetalsCanvas from './components/PetalsCanvas.vue';
import SecretBox from './components/SecretBox.vue';

interface MenuItem {
  title: string;
  path?: string;
  isOpen?: boolean;
  children?: MenuItem[];
}

const permissionStore = usePermissionStore();

const handlePermissionChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  permissionStore.setPermission(target.value as PermissionKey);
};

const menuItems = reactive<MenuItem[]>([
  { title: '🌸 Trang chủ', path: '/todos/all' },
  {
    title: '📝 Danh sách việc',
    isOpen: true,
    children: [
      { title: '✨ Tất cả công việc', path: '/todos/all' },
      { title: '⭐ Việc quan trọng', path: '/todos/important' },
      {
        title: '🌿 Theo trạng thái',
        isOpen: true,
        children: [
          { title: '✅ Đã hoàn thành', path: '/todos/completed' },
          { title: '🔄 Chưa hoàn thành', path: '/todos/pending' }
        ]
      }
    ]
  }
]);
</script>

<template>
  <!-- Falling petals overlay -->
  <PetalsCanvas />

  <div class="romantic-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <!-- Header of sidebar -->
      <div class="sidebar-header">
        <div class="sidebar-logo">💕</div>
        <h1 class="sidebar-title">Góc nhỏ<br><span>yêu thương</span></h1>
      </div>

      <!-- Permission box -->
      <div class="permission-box">
        <label for="permissionKey">🔑 Vai trò</label>
        <select
          id="permissionKey"
          :value="permissionStore.currentKey"
          @change="handlePermissionChange"
        >
          <option
            v-for="option in permissionStore.permissionOptions"
            :key="option.key"
            :value="option.key"
          >
            {{ option.label }}
          </option>
        </select>
      </div>

      <!-- Navigation menu -->
      <nav class="nav-menu">
        <div v-for="item in menuItems" :key="item.title" class="menu-group">
          <div v-if="item.children">
            <button type="button" @click="item.isOpen = !item.isOpen" class="menu-parent">
              <span class="menu-label">{{ item.title }}</span>
              <span class="menu-arrow">{{ item.isOpen ? '▾' : '▸' }}</span>
            </button>

            <ul v-if="item.isOpen" class="sub-menu">
              <li v-for="sub in item.children" :key="sub.title">
                <template v-if="sub.children">
                  <button type="button" @click="sub.isOpen = !sub.isOpen" class="sub-menu-parent">
                    <span>{{ sub.title }}</span>
                    <span>{{ sub.isOpen ? '▾' : '▸' }}</span>
                  </button>
                  <ul v-if="sub.isOpen" class="nested-sub-menu">
                    <li v-for="child in sub.children" :key="child.title">
                      <router-link :to="child.path || '/'">{{ child.title }}</router-link>
                    </li>
                  </ul>
                </template>
                <router-link v-else :to="sub.path || '/'">{{ sub.title }}</router-link>
              </li>
            </ul>
          </div>

          <router-link v-else :to="item.path || '/'" class="menu-single">
            {{ item.title }}
          </router-link>
        </div>
      </nav>

      <!-- Secret Box section in sidebar -->
      <div class="sidebar-secret">
        <div class="secret-divider">
          <span>✦ bí mật ✦</span>
        </div>
        <SecretBox />
      </div>

      <!-- Sidebar footer -->
      <div class="sidebar-footer">
        <p>made with 💖 & code</p>
      </div>
    </aside>

    <!-- Main content -->
    <main class="main-content">
      <!-- Decorative top bar -->
      <div class="content-topbar">
        <div class="topbar-flowers">
          <span v-for="n in 6" :key="n">🌸</span>
        </div>
        <p class="topbar-quote">"Tình yêu là điều kỳ diệu nhất trong cuộc đời"</p>
        <div class="topbar-flowers">
          <span v-for="n in 6" :key="n">🌸</span>
        </div>
      </div>

      <div class="content-body">
        <router-view />
      </div>
    </main>
  </div>
</template>

<style scoped>
/* ===== LAYOUT ===== */
.romantic-layout {
  display: flex;
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

/* ===== SIDEBAR ===== */
.sidebar {
  width: 290px;
  flex-shrink: 0;
  background: linear-gradient(160deg, rgba(255, 245, 250, 0.97) 0%, rgba(255, 228, 236, 0.97) 50%, rgba(255, 240, 220, 0.97) 100%);
  backdrop-filter: blur(12px);
  border-right: 1.5px solid rgba(255, 180, 200, 0.5);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  max-height: 100vh;
  overflow-y: auto;
  box-shadow: 4px 0 24px rgba(233, 30, 140, 0.08);
}

/* Header */
.sidebar-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 20px 20px;
  border-bottom: 1px solid rgba(255, 180, 200, 0.4);
}

.sidebar-logo {
  font-size: 2.2rem;
  filter: drop-shadow(0 4px 8px rgba(233, 30, 140, 0.3));
  animation: pulse-heart 2s ease-in-out infinite;
}

@keyframes pulse-heart {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.sidebar-title {
  font-family: 'Dancing Script', cursive;
  font-size: 1.3rem;
  font-weight: 700;
  color: #c2185b;
  line-height: 1.3;
}

.sidebar-title span {
  color: #e91e8c;
  font-size: 1.1rem;
}

/* Permission box */
.permission-box {
  margin: 16px;
  padding: 14px;
  background: linear-gradient(135deg, rgba(255, 192, 203, 0.4), rgba(255, 245, 220, 0.4));
  border: 1.5px solid rgba(244, 143, 177, 0.5);
  border-radius: 14px;
  backdrop-filter: blur(4px);
}

.permission-box label {
  display: block;
  color: #b5547a;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.permission-box select {
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid #f48fb1;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.9);
  color: #c2185b;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: border-color 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23e91e8c' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;
}

.permission-box select:focus {
  outline: none;
  border-color: #e91e8c;
  box-shadow: 0 0 0 3px rgba(233, 30, 140, 0.15);
}

/* Navigation */
.nav-menu {
  padding: 8px 0;
  flex: 1;
}

.menu-group { margin-bottom: 2px; }

.menu-parent,
.sub-menu-parent {
  width: 100%;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  transition: all 0.25s;
  background: transparent;
  text-align: left;
  color: #7d3a56;
  border-left: 3px solid transparent;
}

.menu-parent {
  padding: 12px 20px;
  font-weight: 700;
  font-size: 14px;
}

.sub-menu-parent {
  padding: 10px 20px 10px 36px;
  font-weight: 600;
  font-size: 13px;
}

.menu-parent:hover,
.sub-menu-parent:hover {
  background: rgba(233, 30, 140, 0.08);
  border-left-color: #f48fb1;
  color: #c2185b;
}

.menu-arrow {
  font-size: 12px;
  transition: transform 0.3s;
  color: #f48fb1;
}

.sub-menu, .nested-sub-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sub-menu a,
.nested-sub-menu a {
  display: block;
  color: #9c4468;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s;
  border-left: 3px solid transparent;
  padding: 9px 20px;
}

.sub-menu a { padding-left: 36px; }
.nested-sub-menu a { padding-left: 52px; }

.sub-menu a:hover,
.sub-menu a.router-link-active,
.nested-sub-menu a:hover,
.nested-sub-menu a.router-link-active {
  background: rgba(233, 30, 140, 0.1);
  border-left-color: #e91e8c;
  color: #c2185b;
}

.menu-single {
  display: block;
  padding: 12px 20px;
  color: #7d3a56;
  text-decoration: none;
  font-weight: 700;
  font-size: 14px;
  transition: all 0.25s;
  border-left: 3px solid transparent;
}

.menu-single:hover,
.menu-single.router-link-active {
  background: rgba(233, 30, 140, 0.08);
  border-left-color: #e91e8c;
  color: #c2185b;
}

/* Secret section */
.sidebar-secret {
  padding: 0 8px 16px;
}

.secret-divider {
  text-align: center;
  color: #f48fb1;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: 16px 0 8px;
  position: relative;
}

.secret-divider::before,
.secret-divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 25%;
  height: 1px;
  background: linear-gradient(to right, transparent, #f48fb1);
}

.secret-divider::before { left: 0; }
.secret-divider::after { right: 0; background: linear-gradient(to left, transparent, #f48fb1); }

/* Footer */
.sidebar-footer {
  padding: 12px 20px;
  border-top: 1px solid rgba(244, 143, 177, 0.3);
  text-align: center;
}

.sidebar-footer p {
  font-family: 'Dancing Script', cursive;
  font-size: 13px;
  color: #c2185b;
  opacity: 0.8;
}

/* Scrollbar in sidebar */
.sidebar::-webkit-scrollbar { width: 4px; }
.sidebar::-webkit-scrollbar-track { background: transparent; }
.sidebar::-webkit-scrollbar-thumb { background: #f48fb1; border-radius: 10px; }

/* ===== MAIN CONTENT ===== */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.content-topbar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 14px 24px;
  background: linear-gradient(135deg, rgba(255, 245, 250, 0.9), rgba(255, 228, 236, 0.9));
  border-bottom: 1px solid rgba(255, 180, 200, 0.4);
  backdrop-filter: blur(8px);
  position: sticky;
  top: 0;
  z-index: 10;
  flex-wrap: wrap;
}

.topbar-flowers {
  display: flex;
  gap: 4px;
  font-size: 16px;
  opacity: 0.7;
}

.topbar-quote {
  font-family: 'Dancing Script', cursive;
  font-size: 1.05rem;
  color: #c2185b;
  text-align: center;
  white-space: nowrap;
  font-style: italic;
}

.content-body {
  flex: 1;
  padding: 28px 24px;
  overflow-y: auto;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .romantic-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    max-height: none;
    position: relative;
  }

  .content-topbar {
    position: relative;
  }

  .topbar-flowers { display: none; }
}
</style>
