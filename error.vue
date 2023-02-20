<template>
  <div class="text-center">
    <el-empty description="error occurred" />
    <el-button @click="handleError">{{ $t("goHome") }}</el-button>
  </div>
</template>

<script setup>
import { ElEmpty, ElButton } from "element-plus";
const props = defineProps({
  error: Object,
});

const handleError = () => clearError({ redirect: "/lottery" });
</script>
