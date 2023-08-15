<script setup lang="ts">
</script>

<template>
    <div class="border-2 border-black rounded-lg p-2">
        <div class="flex flex-row justify-between items-center mb-2 p-1">
            <slot name="title"></slot>
        </div>
        <slot></slot>
    </div>
</template>
