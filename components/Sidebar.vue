<template>
  <div>
    <vs-sidebar
      fixed
      :hover-expand="hover"
      :reduce="reduce"
      v-model="active"
      :open.sync="open"
      style="z-index: 100000;"
    >
      <template #logo>
        <vs-sidebar-item>
          <template #icon>
            <img :src="require(`~/assets/images/QuentoLogoMain.png`)" style="width:2.7rem;height:3rem;"/>
          </template>
          <div style="">QUENTO</div>
        </vs-sidebar-item>
      </template>
      <vs-sidebar-item
        v-for="(item, index) in NavOptions"
        :key="index"
        :id="item.href"
      >
        <template #icon>
          <i class="sidebar-icon bx" :class="item.icon"></i>
        </template>
        {{ item.name }}
      </vs-sidebar-item>

        <vs-sidebar-item href="https://github.com/Quento-Solutions">
          <template #icon>
           <i class="sidebar-icon bx bxl-github"></i>
          </template>
          <div style="">Github</div>
        </vs-sidebar-item>

        <vs-sidebar-item href="https://discord.gg/pfyFWus">
          <template #icon>
           <i class="sidebar-icon bx bxl-discord"></i>
          </template>
          <div style="">Discord</div>
        </vs-sidebar-item>
       
      <vs-sidebar-group>
        <template #header>
          <vs-sidebar-item arrow>
            <template #icon>
              <i class="bx bx-shape-polygon sidebar-icon"></i>
            </template>
            Coming Soon
          </vs-sidebar-item>
        </template>

        <vs-sidebar-item
          v-for="(item, index) in ComingSoonGroup"
          :key="index"
          :id="item.href"
        >
          <template #icon>
            <i class="sidebar-icon bx" :class="item.icon"></i>
          </template>
          {{ item.name }}
        </vs-sidebar-item>
      </vs-sidebar-group>

      <template #footer>
        <!-- <vs-col>
          <a href="https://discord.gg/pfyFWus"><i class="text-4xl bx bxl-discord"></i></a>
          <a href="https://github.com/Quento-Solutions"><i class="text-4xl bx bxl-github"></i></a>
        </vs-col> -->
      </template>
    </vs-sidebar>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

import { navigationStore, windowStore, authStore } from '~/store'
import { NavigationOptionType } from '~/store/navigation'

@Component
export default class Sidebar extends Vue {
  get active() {
    return this.$route.path
  }
  set active(id: string) {
    this.PushRouterLink(id)
  }

  NavOptions = [
    {
      name: 'Home',
      id: 'home',
      icon: 'bx bx-home',
      href: '/home'
    },
    {
      name: 'Suggestions',
      id: 'suggestions',
      icon: 'bx bxs-message-square-edit',
      href: '/suggestions'
    },
    {
      name : "Notes",
      id : "notes",
      icon : "bx bxs-note",
      href : '/notes'
    }
  ] as const

  ComingSoonGroup = [
    {
      name: 'Projects',
      id: 'projects',
      icon: 'bx bx-meteor',
    },
    {
      name: 'Contact',
      id: 'contact',
      icon: 'bx bxs-contact',
    }
  ]

  PushRouterLink(link: string) {
    this.$router.push(link)
  }
  get open() {
    return windowStore.sidebarOpen
  }
  set open(open) {
    windowStore.SetSidenavState(open)
  }
  get hover() {
    return !windowStore.sidenavIsOpen
  }
  get reduce() {
    return !windowStore.sidenavIsOpen
  }

  clickNotClose = true
  get currentPage() {
    return navigationStore.currentPage
  }
  set currentPage(page: NavigationOptionType) {
    navigationStore.changePage(page)
  }
}
</script>
<style lang="scss" scoped>
.sidebar-icon {
  font-size: 2rem;
}
</style>
