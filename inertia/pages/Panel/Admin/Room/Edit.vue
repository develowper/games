<template>
  <Panel>
    <template v-slot:header>
      <title>{{ __('edit_room') }}</title>
    </template>

    <template v-slot:content>
      <!-- Content header -->
      <div class="flex items-center justify-start px-4 py-2 text-primary-500 border-b md:py-4">
        <PencilSquareIcon class="h-7 w-7 mx-3" />

        <h1 class="text-2xl font-semibold">{{ __('edit_room') }}</h1>
      </div>

      <!-- Content -->
      <div class="px-2 md:px-4 mx-auto md:max-w-5xl">
        <div v-if="data && data.id" class="flex flex-col mt-4">
          <div class="flex text-sm">
            <div class="text-gray-500">{{ __('created_at') }}:</div>
            <div class="text-primary-700 mx-2">{{ toShamsi(data.createdAt, true) }}</div>
          </div>
          <div class="flex text-sm">
            <div class="text-gray-500">{{ __('game_count') }}:</div>
            <div class="text-primary-700 mx-2">{{ data.clearCount }}</div>
          </div>

          <div class="flex text-sm">
            <div class="text-gray-500">{{ __('status') }}:</div>
            <div class="mx-2" :class="`text-${!!data.isActive ? 'success' : 'danger'}-500`">
              {{ !!data.isActive ? __('active') : __('inactive') }}
            </div>
          </div>
          <!--          <div>{{ Object.keys(data).join(' ') }}</div>-->
        </div>
        <div
          v-if="data && data.id"
          class="mx-auto md:max-w-3xl my-6 px-2 md:px-4 py-4 bg-white shadow-md overflow-hidden rounded-lg"
        >
          <!--          <div-->
          <!--            class="lg:flex-col flex flex-wrap self-center md:m-2 lg:mx-2 md:items-center lg:items-stretch rounded-lg"-->
          <!--          >-->
          <!--            <InputLabel class="m-2 w-full md:text-start lg:text-center"-->
          <!--                        :value="__('profile_images_max_%s_item').replace('%s',$page.props.max_images_limit)"/>-->

          <!--            <div-->
          <!--              -->
          <!--              class="flex-col m-2 items-center rounded-lg max-w-[8rem] w-full mx-auto lg:mx-2"-->
          <!--            >-->
          <!--              <div class="my-2">-->
          <!--                <ImageUploader-->
          <!--                  :replace="true"-->
          <!--                  :preload="route('storage.users') + `/${data.id}.jpg`"-->
          <!--                  mode="edit"-->
          <!--                  :for-id="data.id"-->
          <!--                  :link="route('admin.panel.user.update')"-->
          <!--                  ref="imageCropper"-->
          <!--                  :label="__('image_cover_jpg')"-->
          <!--                  cropRatio="1"-->
          <!--                  id="img"-->
          <!--                  height="10"-->
          <!--                  class="grow"-->
          <!--                />-->
          <!--                <InputError class="mt-1" :message="form.errors.img" />-->
          <!--              </div>-->
          <!--            </div>-->
          <!--          </div>-->
          <div class="flex flex-col mx-2 w-full px-2">
            <form @submit.prevent="submit">
              <div v-show="form.status" class="flex items-center">
                <RadioGroup
                  v-model="form.status"
                  ref="statusSelector"
                  class="grow"
                  name="status"
                  :items="$page.props.statuses"
                />
              </div>

              <div class="my-4">
                <TextInput
                  id="title"
                  type="text"
                  :placeholder="__('title')"
                  classes="  "
                  v-model="form.title"
                  autocomplete="title"
                  :error="form.errors.title"
                >
                  <template v-slot:prepend>
                    <div class="p-3">
                      <Bars2Icon class="h-5 w-5" />
                    </div>
                  </template>
                </TextInput>
              </div>

              <div class="my-4">
                <TextInput
                  id="card_price"
                  type="number"
                  :placeholder="__('card_price')"
                  classes="  "
                  v-model="form.card_price"
                  autocomplete="card_price"
                  :error="form.errors.card_price"
                >
                  <template v-slot:prepend>
                    <div class="p-3">
                      <ChevronUpDownIcon class="h-5 w-5" />
                    </div>
                  </template>
                </TextInput>
              </div>
              <div class="my-4">
                <TextInput
                  id="max_cards_count"
                  type="number"
                  :placeholder="__('max_cards_count')"
                  classes="  "
                  v-model="form.max_cards_count"
                  autocomplete="max_cards_count"
                  :error="form.errors.max_cards_count"
                >
                  <template v-slot:prepend>
                    <div class="p-3">
                      <ChevronUpDownIcon class="h-5 w-5" />
                    </div>
                  </template>
                </TextInput>
              </div>
              <div class="my-4">
                <TextInput
                  id="max_user_cards_count"
                  type="number"
                  :placeholder="__('max_user_cards_count')"
                  classes="  "
                  v-model="form.max_user_cards_count"
                  autocomplete="max_user_cards_count"
                  :error="form.errors.max_user_cards_count"
                >
                  <template v-slot:prepend>
                    <div class="p-3">
                      <ChevronUpDownIcon class="h-5 w-5" />
                    </div>
                  </template>
                </TextInput>
              </div>
              <div class="my-4">
                <TextInput
                  id="win_score"
                  type="number"
                  :placeholder="__('win_score')"
                  classes="  "
                  v-model="form.win_score"
                  autocomplete="win_score"
                  :error="form.errors.win_score"
                >
                  <template v-slot:prepend>
                    <div class="p-3">
                      <ChevronUpDownIcon class="h-5 w-5" />
                    </div>
                  </template>
                </TextInput>
              </div>
              <div class="my-4">
                <TextInput
                  id="max_seconds"
                  type="number"
                  :placeholder="`${__('waiting_time')} (${__('second')})`"
                  classes="  "
                  v-model="form.max_seconds"
                  autocomplete="max_seconds"
                  :error="form.errors.max_seconds"
                >
                  <template v-slot:prepend>
                    <div class="p-3">
                      <ChevronUpDownIcon class="h-5 w-5" />
                    </div>
                  </template>
                </TextInput>
              </div>
              <div class="my-4">
                <TextInput
                  id="commission_percent"
                  type="number"
                  :placeholder="`${__('app_commission')} (${__('percent')})`"
                  classes="  "
                  v-model="form.commission_percent"
                  autocomplete="commission_percent"
                  :error="form.errors.commission_percent"
                >
                  <template v-slot:prepend>
                    <div class="p-3">
                      <ChevronUpDownIcon class="h-5 w-5" />
                    </div>
                  </template>
                </TextInput>
              </div>
              <div class="my-4">
                <TextInput
                  id="win_percent"
                  type="number"
                  :placeholder="`${__('win_commission')} (${__('percent')})`"
                  classes="  "
                  v-model="form.win_percent"
                  autocomplete="win_percent"
                  :error="form.errors.win_percent"
                >
                  <template v-slot:prepend>
                    <div class="p-3">
                      <ChevronUpDownIcon class="h-5 w-5" />
                    </div>
                  </template>
                </TextInput>
              </div>
              <div class="my-4">
                <TextInput
                  id="row_win_percent"
                  type="number"
                  :placeholder="`${__('row_win_commission')} (${__('percent')})`"
                  classes="  "
                  v-model="form.row_win_percent"
                  autocomplete="win_percent"
                  :error="form.errors.row_win_percent"
                >
                  <template v-slot:prepend>
                    <div class="p-3">
                      <ChevronUpDownIcon class="h-5 w-5" />
                    </div>
                  </template>
                </TextInput>
              </div>

              <div class="py-4"></div>
              <div
                v-if="form.progress"
                class="shadow w-full bg-grey-light m-2 bg-gray-200 rounded-full"
              >
                <div
                  class="bg-primary rounded text-xs leading-none py-[.1rem] text-center text-white duration-300"
                  :class="{ ' animate-pulse': form.progress.percentage < 100 }"
                  :style="`width: ${form.progress.percentage}%`"
                >
                  <span class="animate-bounce">{{ form.progress.percentage }}</span>
                </div>
              </div>
              <div class="mt-4">
                <PrimaryButton
                  class="w-full flex justify-center items-center"
                  :class="{ 'opacity-25': form.processing }"
                  :disabled="form.processing"
                >
                  <LoadingIcon class="w-4 h-4 mx-3" v-if="form.processing" />
                  <span class="text-lg"> {{ __('register_info') }}</span>
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </template>
  </Panel>
</template>

<script>
import Panel from '~/layouts/Panel.vue'
import { Head, Link, useForm } from '@inertiajs/vue3'
import {
  ChevronDownIcon,
  UserIcon,
  Bars2Icon,
  Squares2X2Icon,
  CreditCardIcon,
  BanknotesIcon,
  ChevronUpDownIcon,
  PencilSquareIcon,
} from '@heroicons/vue/24/outline'
import InputError from '~/components/InputError.vue'
import InputLabel from '~/components/InputLabel.vue'
import PrimaryButton from '~/components/PrimaryButton.vue'
import TextInput from '~/components/TextInput.vue'
import RadioGroup from '~/components/RadioGroup.vue'
import LoadingIcon from '~/components/LoadingIcon.vue'
import Popover from '~/components/Popover.vue'
import Tooltip from '~/components/Tooltip.vue'
import TagInput from '~/components/TagInput.vue'
import Selector from '~/components/Selector.vue'
import { route } from '@izzyjs/route/client'
import { __, asPrice, hasAccess, showAlert, showToast, toShamsi } from '~/js/mixins.js'

export default {
  data() {
    return {
      data: this.data || {},
      form: useForm({
        id: null,
        title: null,
        card_price: null,
        player_count: null,
        max_cards_count: null,
        max_user_cards_count: null,
        win_score: null,
        max_seconds: null,
        commission_percent: null,
        row_win_percent: null,
        win_percent: null,
        status: null,
        _method: 'patch',
        cmnd: 'info',
      }),
    }
  },
  components: {
    LoadingIcon,
    Head,
    Link,
    ChevronDownIcon,
    Panel,
    InputLabel,
    TextInput,
    InputError,
    PrimaryButton,
    RadioGroup,
    UserIcon,
    Popover,
    Tooltip,
    Bars2Icon,
    TagInput,
    Selector,
    Squares2X2Icon,
    CreditCardIcon,
    BanknotesIcon,
    ChevronUpDownIcon,
    PencilSquareIcon,
  },
  created() {
    this.data = this.$page.props.data ?? {}
  },
  mounted() {
    // this.$nextTick(() => {
    //
    // });

    // console.log(this.data)
    this.form.id = this.data.id
    this.form.status = !!this.data.isActive
      ? this.$page.props.statuses[0]
      : this.$page.props.statuses[1]
    this.$refs.statusSelector.selected = this.form.status

    this.form.title = this.data.title
    this.form.card_price = this.data.cardPrice
    this.form.player_count = this.data.playerCount
    this.form.max_cards_count = this.data.maxCardsCount
    this.form.max_user_cards_count = this.data.maxUserCardsCount
    this.form.win_score = this.data.winScore
    this.form.max_seconds = this.data.maxSeconds
    this.form.commission_percent = this.data.commissionPercent
    this.form.row_win_percent = this.data.rowWinPercent
    this.form.win_percent = this.data.winPercent
  },
  methods: {
    asPrice,
    toShamsi,
    hasAccess,
    __,
    route,
    submit() {
      // this.form.category_id = this.$refs.categorySelector.selected;
      this.form.clearErrors()
      // this.form.status = this.$refs.statusSelector.selected;
      // this.form.role = this.$refs.roleSelector.selected;

      // this.isLoading(true, this.form.progress ? this.form.progress.percentage : null);
      // this.images = [];
      // for (let i = 0; i < this.$page.props.max_images_limit; i++) {
      //   let tmp = this.$refs.imageCropper[i].getCroppedData();
      //   if (tmp) this.images.push(tmp);
      // }
      this.form.patch(route('admin.panel.room.update'), {
        preserveScroll: false,

        onSuccess: (data) => {
          if (this.$page.props.flash.status)
            showAlert(this.$page.props.flash.status, this.$page.props.flash.message)

          if (this.$page.props.extra && this.$page.props.extra.wallet_active != null)
            this.user.wallet_active = this.$page.props.extra.wallet_active

          this.form.password = null
        },
        onError: () => {
          showToast('danger', Object.values(this.form.errors).join('<br/>'))
        },
        onFinish: (data) => {
          // this.isLoading(false,);
          if (this.$page.props.flash.status)
            showAlert(this.$page.props.flash.status, this.$page.props.flash.message)
        },
      })
    },
  },
}
</script>
