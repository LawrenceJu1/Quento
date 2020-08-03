<template>
    <div>
        <h1>NEWSLETTER PAGE</h1>
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
