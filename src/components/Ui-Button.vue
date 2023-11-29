<template>
  <button type="button" class="btn">
    <slot />
  </button>
</template>

<style scoped>
.btn {
  background: transparent;
  padding: 20px 32px;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  opacity: 0.8;
  transition:
    color 0.3s,
    background-color 0.3s;
  outline: none;

  &:hover {
    opacity: 1;
  }

  &:active {
    outline: none;
  }

  &.btn-primary {
    background-color: var(--btn-primary);
  }
  &.btn-secondary {
    background-color: var(--btn-secondary);
  }
}
</style>
