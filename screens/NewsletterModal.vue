<template>
  <div class="center">
    <vs-dialog v-model="active">
      <template #header>
        <h4 class="not-margin">
          Welcome to
          <b>Vuesax</b>
        </h4>
      </template>

      <div class="con-form">
        <vs-input v-model="email" placeholder="Email">
          <template #icon>@</template>
        </vs-input>
        <vs-input type="password" v-model="password" placeholder="Password">
          <template #icon>
            <i class="bx bxs-lock"></i>
          </template>
        </vs-input>
        <div class="flex">
          <vs-checkbox v-model="remember">Remember me</vs-checkbox>
          <a href="#">Forgot Password?</a>
        </div>
      </div>

      <template #footer>
        <div class="footer-dialog">
          <vs-button block>Sign In</vs-button>

          <div class="new">
            New Here?
            <a href="#">Create New Account</a>
          </div>
        </div>
      </template>
    </vs-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

import { suggestionsStore } from '~/store'
import VsTextarea from '~/components/VsTextarea.vue'

@Component<NewsletterModal>({
  components: {
    VsTextarea
  }
})
export default class NewsletterModal extends Vue {
  @Prop({ default: false }) value!: boolean

  get active() {
    return this.value
  }
  set active(value: boolean) {
    this.$emit('input', value)
  }
  title = ''
  contents = ''

  async PostSuggestion() {
    if (this.formErrors) {
      this.$vs.notification({
        color: 'danger',
        title: 'Fill Out All Fields!'
      })
      return
    }

    const loading = this.$vs.loading()
    const payload = { title: this.title, contents: this.contents }
    try {
      await suggestionsStore.PostSuggestion(payload)
      this.$vs.notification({
        color: 'success',
        title: 'Suggestion Posted!',
        text:
          'Thank you for your insights, we will notify you once it is implemented!'
      })
      await suggestionsStore.GetSuggestions()
      this.state = false
      loading.close()
    } catch (error) {
      this.$vs.notification({
        color: 'danger',
        title: 'An Error Occurred While Posting Your Suggestion'
      })

      this.state = false
      loading.close()
    }
  }

  set state(value: boolean) {
    this.title = this.contents = ''
    this.active = false
  }
  get state() {
    return this.active
  }

  get formErrors() {
    return !this.contents || !this.title
  }
}
</script>

<style lang="scss">
#suggestionsPopup {
  .vs-dialog {
    min-width: 40vw !important;
    min-height: 60vh !important;
  }
}
</style>