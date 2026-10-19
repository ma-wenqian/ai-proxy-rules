<template>
  <div class="clients" aria-label="Supported clients">
    <span v-for="c in ['Clash', 'mihomo', 'Shadowrocket', 'Surge', 'Loon', 'Stash']" :key="c">{{ c }}</span>
  </div>
</template>

<style scoped>
.clients {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 24px;
  width: 100%;
}
.clients span {
  font-size: 12.5px;
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  padding: 2px 10px;
}
@media (max-width: 959px) {
  .clients {
    justify-content: center;
  }
}
</style>
