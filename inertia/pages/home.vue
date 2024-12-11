<script setup lang="ts">
import { router } from '@inertiajs/vue3'

import { Head, usePage } from '@inertiajs/vue3'
import { io } from 'socket.io-client'
import { route } from '@izzyjs/route/client'
import { onMounted, ref, toRef } from 'vue'
import { useHelper } from '~/composables/helper'

const props = defineProps<{
  prop1: string
  errors?: Record<string, string[]>
}>()

const { __ } = useHelper()
const renderCount = ref(0)
const errors = usePage().props.errors

const url = route('home') // /users/1

// const socket = io()
// socket.on('news', (data) => {
//   console.log(data)
//   socket.emit('my other event', {my: 'data'})
// })

onMounted(() => {
  // console.log(usePage().props)
})
</script>

<template>
  <Head title="Homepage" />
  <div class="">
    {{ __('greeting') }}
    <!--        {{ $inertia.page.props.language['greeting']}}-->
    <Button @click="router.reload()">render count {{ renderCount }}</Button>

    <div v-if="errors && errors.fullName">{{ errors.fullName.join(', ') }}</div>
  </div>
</template>
