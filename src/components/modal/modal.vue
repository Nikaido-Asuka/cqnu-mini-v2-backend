<template>
    <div v-if="visible" class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <header class="modal-header">
          <h2 class=" text-[22px]">{{ title }}</h2>
          <button class="modal-close" @click="close">×</button>
        </header>
        <main class="modal-body">
          <slot name="body"></slot>
        </main>
        <footer class="modal-footer">
          <button class="modal-btn cancel-btn" @click="cancel">{{ cancelText }}</button>
          <button class="modal-btn confirm-btn" @click="confirm">{{ confirmText }}</button>
        </footer>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits, computed } from 'vue';
  
  // Define props
  const props = defineProps<{
    visible: boolean;
    title?: string;
    confirmText?: string;
    cancelText?: string;
  }>();
  
  // Define emits
  const emit = defineEmits<{
    (event: 'update:visible', value: boolean): void;
    (event: 'confirm'): void;
    (event: 'cancel'): void;
  }>();

  // Default values
    const defaultConfirmText = '确定';
    const defaultCancelText = '取消';

    // Computed properties to use default values
    const confirmText = computed(() => props.confirmText ?? defaultConfirmText);
    const cancelText = computed(() => props.cancelText ?? defaultCancelText);
  
  // Methods
  const close = () => {
    emit('update:visible', false);
  };
  
  const confirm = () => {
    emit('confirm');
    close();
  };
  
  const cancel = () => {
    emit('cancel');
    close();
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-content {
    background: white;
    border-radius: 8px;
    width: 500px;
    max-width: 100%;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    position: relative;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }
  
  .modal-body {
    margin: 20px 0;
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
  }
  
  .modal-btn {
    margin-left: 10px;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .cancel-btn {
    background: #f5f5f5;
  }
  
  .confirm-btn {
    background: #007bff;
    color: white;
  }
  </style>
  