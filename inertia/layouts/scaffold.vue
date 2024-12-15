<template>
  <App>
    <header :dir="dir()">
      <Navbar v-if="navbarTheme != 'none'" :theme="navbarTheme" />
    </header>
    <main :dir="dir()" class="min-h-screen">
      <Head>
        <meta name="author" :content="__('app_name')" />
        <link rel="shortcut icon" type="image/x-icon" :href="favicon" />
        <slot name="header" />
      </Head>
      <Alert ref="alert" />
      <Dialog ref="modal" />
      <Toast ref="toast" />
      <!-- Loading screen -->
      <div v-if="loading" class="fixed w-screen h-screen backdrop-blur-sm z-[999999]">
        <div class="flex items-center justify-center w-full h-full">
          <div class="flex justify-center items-center space-x-1 text-sm text-gray-700">
            <LoadingIcon type="line-dot" class="fill-primary-500" />
          </div>
        </div>
      </div>
      <slot />
    </main>
    <!--wave-->
    <svg
      class="wave-top"
      viewBox="0 0 1439 147"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-1.000000, -14.000000)" fill-rule="nonzero">
          <g
            transform="translate(0.000000, 50.000000)"
            class="fill-primary-200"
            fill=""
            fill-rule="nonzero"
          >
            <path
              d="M 0.457 34.035 C 72 39 99 36 217 45 C 342 31 681 36 1216 12 C 1291 20 1402 29 1444 34 L 1441.191 104.352 L 1.121 104.031 L 0.457 34.035 Z"
            ></path>
          </g>
        </g>
        <g
          transform="translate(0.000000, 50.000000)"
          class="fill-primary-100"
          fill=""
          fill-rule="nonzero"
        >
          <path
            d="M 0.457 34.035 C 71 22 156 3 208 -2 C 248 5 1039 48 1124 55 C 1237 46 1355 27 1442 12 L 1441.191 104.352 L 1.121 104.031 L 0.457 34.035 Z"
          ></path>
        </g>
      </g>
    </svg>

    <Footer />
  </App>
  <!--  <SupportChat dir="rtl" id="support-chat" :ip="$page.props.ip" :broadcast-link="route('chat.broadcast')"-->
  <!--               :support-history-link="route('chat.support.history')"/>-->
  <!--Footer-->
</template>

<script>
import { Head, Link } from '@inertiajs/vue3'
import App from '~/layouts/App.vue'
import Navbar from '~/components/Navbar.vue'
import Footer from '~/components/Footer.vue'
import Toast from '~/components/Toast.vue'
import Dialog from '~/components/Dialog.vue'
import Alert from '~/components/Alert.vue'
import LoadingIcon from '~/components/LoadingIcon.vue'
import mitt from 'mitt'
import favicon from '~/images/logo.png'
import { Dropdown, initTE, Modal } from 'tw-elements'
import { __, dir } from '~/js/mixins.js'
// import {Server} from "socket.io";
export const emitter = mitt()
export default {
  data() {
    return {
      loading: false,
      favicon: favicon,
    }
  },
  props: ['navbarTheme'],
  components: {
    Head,
    Link,
    Navbar,
    Footer,
    Alert,
    Dialog,
    Toast,
    LoadingIcon,
    App,
  },
  mounted() {
    // window.tailwindElements();
    //
    // if (!window.Dropdown) {
    //   window.Dropdown = Dropdown;
    //   initTE({Dropdown}, {allowReinits: true});
    // }

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

    // this.initSocket();
    // this.initSocketIO();
  },

  methods: {
    __,
    dir,
    initSocket() {
      window.Echo.join(`ROOM`)
        .here((data) => {
          console.log('joined room')
        })
        .listen('NewMessage', (data) => {
          console.log(data)
        })
        .joining((data) => {
          console.log('joining')
        })

      window.Echo.channel(`ROOM`)
        .listen('NewMessage', (e) => {
          this.$refs.toast.show('success', e)
          console.log(e)
        })

        // .listenToAll((event, data) => {
        //     console.log(event, data)
        // })
        .notification((notification) => {
          console.log(notification.type)
        })
        .listenForWhisper('typing', () => {
          console.log('typing')
        })
        .subscribed(() => {
          console.log('subscribed')
          // window.axios.get('test');
        })
        .error((e) => {
          console.log(e)
        })
    },
    initSocketIO() {
      const socket = io('https://socket.ailverchi.ae', {
        transports: ['websocket' /*, 'polling', 'flashsocket'*/],
        // path: '/',
        // cors: true,
        // origins: ['*'],
      })

      // socket.onAny((name, arg) => {
      //     console.log("onAny " + name);
      //     // console.log(arg);
      // });
      // socket.on("hello", (arg) => {
      //     console.log(arg);
      // });
      socket.on('NewMessage', (arg) => {
        console.log('NewMessage ' + arg)
      })
      socket.on('connect', () => {
        console.log('Connected to server')
        // socket.emit("hello", "stranger");
      })
      // socket.emit("hello", `hello from  `);
    },
  },
}
</script>
