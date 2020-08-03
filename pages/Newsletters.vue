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
import { newslettersStore } from '~/store'

@Component<Newsletters>({
    layout: 'main',
    async mounted()
  {
   this.GetNewsletters();
  }
})
export default class Newsletters extends Vue {
    async GetNewsletters() {
    try {
       const newsletters = newslettersStore.GetNewsletters();
        await Promise.resolve(newsletters);
        console.log(newsletters)
    } 
    catch (error)
    {
        console.log({error});
    }
    return;
  }
}
</script>

<style lang="scss"></style>
