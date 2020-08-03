<template>
     <div class="vx-row justify-center px-8">
              <h1 class="mb-12 text-title text-5xl mr-2">
                Newsletter Articles
              </h1>
              &nbsp; &nbsp;
              </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component<Newsletters>({
    layout: 'main',
})
export default class Newsletters extends Vue {
}
</script>

<style lang="scss"></style>
