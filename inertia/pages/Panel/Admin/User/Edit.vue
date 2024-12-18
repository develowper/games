<template>
  <Panel>
    <template v-slot:header>
      <title>{{ __('edit_user') }}</title>
    </template>

    <template v-slot:content>
      <!-- Content header -->
      <div class="flex items-center justify-start px-4 py-2 text-primary-500 border-b md:py-4">
        <PencilSquareIcon class="h-7 w-7 mx-3" />

        <h1 class="text-2xl font-semibold">{{ __('edit_user') }}</h1>
      </div>

      <!-- Content -->
      <div class="px-2 md:px-4 mx-auto md:max-w-5xl">
        <div v-if="data && data.id" class="flex flex-col mt-4">
          <div class="flex text-sm">
            <div class="text-gray-500">{{ __('register_date') }}:</div>
            <div class="text-primary-700 mx-2">{{ toShamsi(data.createdAt, true) }}</div>
          </div>
          <div class="flex text-sm">
            <div class="text-gray-500">{{ __('balance') }}:</div>
            <div class="text-primary-700 mx-2">{{ asPrice(data.financial.balance) }}</div>
            <TomanIcon />
          </div>
          <div class="flex text-sm">
            <div class="text-gray-500">{{ __('status') }}:</div>
            <div class="mx-2" :class="`text-${!!data.isActive ? 'success' : 'danger'}-500`">
              {{ !!data.isActive ? __('active') : __('inactive') }}
            </div>
          </div>
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
                  :items="$page.props.user_statuses"
                />
              </div>
              <div v-show="form.role && hasAccess('edit_role')" class="flex items-center">
                <RadioGroup
                  v-model="form.role"
                  ref="roleSelector"
                  class="grow"
                  name="role"
                  :items="$page.props.user_roles"
                />
              </div>

              <div class="my-4">
                <TextInput
                  id="full_name"
                  type="text"
                  :placeholder="__('full_name')"
                  classes="  "
                  v-model="form.full_name"
                  autocomplete="fullname"
                  :error="form.errors.full_name"
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
                  id="username"
                  type="text"
                  :placeholder="__('username')"
                  classes="  "
                  v-model="form.username"
                  autocomplete="username"
                  :error="form.errors.username"
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
                  id="phone"
                  type="text"
                  :placeholder="__('phone')"
                  classes="  "
                  v-model="form.phone"
                  autocomplete="phone"
                  :error="form.errors.phone"
                >
                  <template v-slot:prepend>
                    <div class="p-3">
                      <PhoneIcon class="h-5 w-5" />
                    </div>
                  </template>
                </TextInput>
              </div>
              <div class="my-4">
                <TextInput
                  id="card"
                  type="number"
                  :placeholder="__('card')"
                  classes="  "
                  v-model="form.card"
                  autocomplete="card"
                  :error="form.errors.card"
                >
                  <template v-slot:prepend>
                    <div class="p-3">
                      <CreditCardIcon class="h-5 w-5" />
                    </div>
                  </template>
                </TextInput>
              </div>
              <div class="my-4">
                <TextInput
                  id="sheba"
                  type="number"
                  :placeholder="__('sheba')"
                  classes="  "
                  v-model="form.sheba"
                  autocomplete="sheba"
                  :error="form.errors.sheba"
                >
                  <template v-slot:prepend>
                    <div class="p-3">
                      <CreditCardIcon class="h-5 w-5" />
                    </div>
                  </template>
                </TextInput>
              </div>
              <div class="my-4">
                <TextInput
                  id="password"
                  type="text"
                  :placeholder="__('new_password')"
                  classes="  "
                  v-model="form.password"
                  autocomplete="password"
                  :error="form.errors.password"
                >
                  <template v-slot:prepend>
                    <div class="p-3">
                      <KeyIcon class="h-5 w-5" />
                    </div>
                  </template>
                </TextInput>
              </div>

              <div v-if="false" class="my-4 text-gray-700">
                <p class="text-sm my-1">{{ __('ref_link') }}</p>
                <div
                  @click="copyToClipboard(route('/') + `?ref=${data.ref_id}`)"
                  class="text-left cursor-pointer block w-full rounded bg-primary-100 hover:bg-primary-200 text-primary p-2"
                >
                  {{ route('/') + `?ref=${data.ref_id}` }}
                </div>
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
  HomeIcon,
  UserIcon,
  EyeIcon,
  FolderPlusIcon,
  Bars2Icon,
  ChatBubbleBottomCenterTextIcon,
  Squares2X2Icon,
  PencilSquareIcon,
  PaintBrushIcon,
  CreditCardIcon,
  AtSymbolIcon,
  PhoneIcon,
  KeyIcon,
  BanknotesIcon,
} from '@heroicons/vue/24/outline'
import { QuestionMarkCircleIcon } from '@heroicons/vue/24/solid'
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
import PhoneFields from '~/components/PhoneFields.vue'
import SocialFields from '~/components/SocialFields.vue'
import EmailFields from '~/components/EmailFields.vue'
import { route } from '@izzyjs/route/client'
import { __, asPrice, hasAccess, showAlert, showToast, toShamsi } from '~/js/mixins.js'
import TomanIcon from '~/components/TomanIcon.vue'

export default {
  data() {
    return {
      data: this.data || {},
      form: useForm({
        id: null,
        username: null,
        full_name: null,
        phone: null,
        phone_verified: null,
        email_verified: null,
        wallet_active: null,
        email: null,
        card: null,
        sheba: null,
        wallet: 0,
        role: null,
        password: null,
        status: null,
        _method: 'patch',
        cmnd: 'info',
      }),
      img: null,
      profile: null,
    }
  },
  components: {
    TomanIcon,
    EmailFields,
    LoadingIcon,
    Head,
    Link,
    HomeIcon,
    ChevronDownIcon,
    Panel,
    InputLabel,
    TextInput,
    InputError,
    PrimaryButton,
    RadioGroup,
    UserIcon,
    EyeIcon,
    Popover,
    Tooltip,
    FolderPlusIcon,
    Bars2Icon,
    ChatBubbleBottomCenterTextIcon,
    TagInput,
    QuestionMarkCircleIcon,
    Selector,
    Squares2X2Icon,
    PhoneFields,
    SocialFields,
    PencilSquareIcon,
    PaintBrushIcon,
    CreditCardIcon,
    AtSymbolIcon,
    PhoneIcon,
    KeyIcon,
    BanknotesIcon,
  },
  created() {
    this.data = this.$page.props.data ?? {}
  },
  mounted() {
    // this.$nextTick(() => {
    //
    // });

    // console.log(this.form.status);
    this.form.id = this.data.id
    this.form.status = !!this.data.isActive
      ? this.$page.props.user_statuses[0]
      : this.$page.props.user_statuses[1]
    this.form.role = this.data.role
    this.form.full_name = this.data.fullName
    this.form.username = this.data.username
    this.form.phone = this.data.phone
    this.form.email = this.data.email
    this.form.phone_verified = this.data.phone_verified
    this.form.email_verified = this.data.email_verified_at != null ? 1 : 0
    this.form.wallet_active = this.data.wallet_active ? 1 : 0
    if (this.data.financial) {
      this.form.card = this.data.financial.card
      this.form.sheba = this.data.financial.sheba
      this.form.wallet = this.data.financial.wallet
      this.form.max_debit = this.data.financial.max_debit
    }
    this.$refs.roleSelector.selected = this.form.role
    this.$refs.statusSelector.selected = this.form.status
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
      this.form.patch(route('admin.panel.user.update'), {
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
