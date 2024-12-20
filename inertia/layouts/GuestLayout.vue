<script>
import ApplicationLogo from '~/components/ApplicationLogo.vue'
import { Head, Link } from '@inertiajs/vue3'
import mitt from 'mitt'
import Alert from '~/components/Alert.vue'
import Dialog from '~/components/Dialog.vue'
import Toast from '~/components/Toast.vue'
import LoadingIcon from '~/components/LoadingIcon.vue'
import { route } from '@izzyjs/route/client'
import { __, showAlert, emitter } from '../js/mixins.js'
import { Toast as mToast, Alert as mAlert } from 'tw-elements'
import { onMounted } from 'vue'
export default {
  methods: { __, route },
  // emits: ['showToast'],
  components: {
    Head,
    Link,
    ApplicationLogo,
    Alert,
    Dialog,
    Toast,
    LoadingIcon,
  },
  data() {
    return {}
  },
  watch: {
    '$page.props.flash'(newVal, oldVal) {
      if (newVal.status) {
        showAlert(newVal.status, newVal.message)
      }
      // this.$refs.alert.show(this.$page.props.flash.status, this.$page.props.flash.message)
    },
  },

  mounted() {
    window.tailwindElements()

    emitter.on('showToast', (e) => {
      if (this.$refs.toast) this.$refs.toast.show(e.type, e.message)
    })

    emitter.on('showAlert', (e) => {
      if (this.$refs.alert) this.$refs.alert.show(e.type, e.message)
    })

    emitter.on('showDialog', (e) => {
      if (this.$refs.modal) this.$refs.modal.show(e.type, e.message, e.button, e.action, e.items)
    })

    emitter.on('loading', (e) => {
      this.loading = e
    })
  },
}
</script>

<template>
  <div>
    <Alert ref="alert" />
    <Toast ref="toast" />

    <div class="px-2 min-h-screen flex flex-col sm:justify-center items-center pt-2 bg-gray-100">
      <div>
        <Link href="/">
          <ApplicationLogo type="outline-dark" class="w-25 h-20 fill-current text-gray-500" />
          <div v-if="route().current('admin.login-form')" class="w-full text-end">
            {{ __('admin_portal') }}
          </div>
        </Link>
      </div>

      <div
        class="w-full sm:max-w-lg z-0 mt-6 px-6 py-4 bg-white shadow-md overflow-hidden rounded-lg"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
