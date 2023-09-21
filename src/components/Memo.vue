<script setup lang="ts">
</script>

<template>
    <div class="border-2 border-gray-300 rounded-lg p-2">
        <div class="flex flex-row justify-between items-center p-1">
            <slot name="title"></slot>
        </div>
        <slot></slot>
    </div>
</template>
