<template>
  <div class="stat-card">
    <span class="stat-number">{{ value }}</span>
    <div class="stat-label">{{ label }}</div>
  </div>
</template>

<script>
export default {
  name: 'StatsCard',
  props: {
    value: {
      type: [Number, String],
      required: true
    },
    label: {
      type: String,
      required: true
    }
  }
}
</script>
