<template>
  <Panel>
    <template v-slot:header>
      <title>{{ __('create_user') }}</title>
    </template>

    <template v-slot:content>
      <!-- Content header -->
      <div class="flex items-center justify-start px-4 py-2 text-primary-500 border-b md:py-4">
        <PencilSquareIcon class="h-7 w-7 mx-3" />

        <h1 class="text-2xl font-semibold">{{ __('create_user') }}</h1>
      </div>

      <!-- Content -->
      <div class="px-2 md:px-4">
        <div
          class="lg:grid mx-auto md:max-w-2xl my-6 px-2 md:px-4 py-4 bg-white shadow-md overflow-hidden rounded-lg"
        >
          <!--          <div-->
          <!--            class="lg:flex-col flex flex-wrap self-center md:m-2 lg:mx-2 md:items-center lg:items-stretch rounded-lg"-->
          <!--          >-->
          <!--            &lt;!&ndash;            <InputLabel class="m-2 w-full md:text-start lg:text-center"&ndash;&gt;-->
          <!--            &lt;!&ndash;                        :value="__('profile_images_max_%s_item').replace('%s',$page.props.max_images_limit)"/>&ndash;&gt;-->

          <!--            <div class="flex-col m-2 items-center rounded-lg max-w-[8rem] w-full mx-auto lg:mx-2">-->
          <!--              <div class="my-2">-->
          <!--                <ImageUploader-->
          <!--                  :replace="true"-->
          <!--                  mode="create"-->
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
              <div class="flex items-center">
                <RadioGroup
                  ref="roleSelector"
                  class="grow"
                  name="role"
                  v-model="form.role"
                  :items="$page.props.user_roles"
                />
              </div>

              <div v-if="form.role == 'bo'" class="my-4">
                <TextInput
                  id="fake_count"
                  type="number"
                  :placeholder="__('count')"
                  classes="  "
                  v-model="form.count"
                  autocomplete="card"
                  :error="form.errors.count"
                >
                  <template v-slot:prepend>
                    <div class="p-2 px-3">
                      <CreditCardIcon class="h-5 w-5" />
                    </div>
                  </template>
                </TextInput>
              </div>
              <div v-else>
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
                      <div class="p-2 px-3">
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
                    v-model:verified="form.sheba"
                    :error="form.errors.sheba"
                  >
                    <template v-slot:prepend>
                      <div class="p-2 px-4">
                        <strong>IR</strong>
                        <!--                      <CreditCardIcon class="h-5 w-5"/>-->
                      </div>
                    </template>
                  </TextInput>
                </div>
                <div class="my-4">
                  <TextInput
                    id="password"
                    type="text"
                    :placeholder="__('password')"
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
                <div class="my-4">
                  <TextInput
                    id="password_confirmation"
                    type="text"
                    :placeholder="__('password_confirmation')"
                    classes="  "
                    v-model="form.password_confirmation"
                    autocomplete="password_confirmation"
                    :error="form.errors.password_confirmation"
                  >
                    <template v-slot:prepend>
                      <div class="p-3">
                        <KeyIcon class="h-5 w-5" />
                      </div>
                    </template>
                  </TextInput>
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
                  class="w-full flex justify-center"
                  :class="{ 'opacity-25': form.processing }"
                  :disabled="form.processing"
                >
                  <LoadingIcon class="w-4 h-4 mx-3" v-if="form.processing" />
                  <span v-else class="text-lg"> {{ __('register_info') }}</span>
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
} from '@heroicons/vue/24/outline'
import { QuestionMarkCircleIcon } from '@heroicons/vue/24/solid'
import Checkbox from '~/components/Checkbox.vue'
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
import { __, log, showAlert, showToast } from '../../../../js/mixins.js'
import { route } from '@izzyjs/route/client'

export default {
  data() {
    return {
      data: this.data || {},
      form: useForm({
        id: null,
        full_name: null,
        username: null,
        phone: null,
        phone_verified: 0,
        email_verified: 0,
        wallet_active: 0,
        email: null,
        card: null,
        wallet: 0,
        password: null,
        password_confirmation: null,
        status: null,
        img: null,
        role: null,
        count: null,
      }),
      profile: null,
    }
  },
  components: {
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
    Checkbox,
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
  },
  created() {},
  mounted() {
    // this.$forceUpdate()
    // console.log(this.data);
    this.form.role = this.$page.props.user_roles[0]
  },
  methods: {
    log,
    __,
    submit() {
      // this.form.category_id = this.$refs.categorySelector.selected;
      this.form.clearErrors()
      // this.form.status = this.$refs.roleSelector.selected
      // this.form.img = this.$refs.imageCropper.getCroppedData()

      // this.isLoading(true, this.form.progress ? this.form.progress.percentage : null);
      // this.images = [];
      // for (let i = 0; i < this.$page.props.max_images_limit; i++) {
      //   let tmp = this.$refs.imageCropper[i].getCroppedData();
      //   if (tmp) this.images.push(tmp);
      // }
      this.form.post(route('admin.panel.user.store'), {
        preserveScroll: false,

        onSuccess: (data) => {
          if (this.$page.props.flash.status)
            showAlert(this.$page.props.flash.status, this.$page.props.flash.message)

          if (this.$page.props.extra && this.$page.props.extra.wallet_active != null)
            this.user.wallet_active = this.$page.props.extra.wallet_active
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
