<template>
  <header class="header">
    <div class="container">
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    }
  }
}
</script>
