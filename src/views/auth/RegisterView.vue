<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import VInput from '@/components/common/VInput.vue'
import VButton from '@/components/common/VButton.vue'
import VSelect from '@/components/common/VSelect.vue'
import { useUserProfileStore } from '@/stores/auth/profile.store'

// Tipe khusus form register (biar ga pakai yg optional dari UserProfileRequest)
type RegisterForm = {
  username: string
  password: string
  name: string
  email: string
  gender: string
  role: string
  saldo: number // khusus Customer
  phone: string // khusus Rental Vendor
  listOfLocations: string // input teks, nanti di-split ke array
}

const router = useRouter()
const userProfileStore = useUserProfileStore()

const profileModel = reactive<RegisterForm>({
  username: '',
  password: '',
  name: '',
  email: '',
  gender: '',
  role: '',
  saldo: 0,
  phone: '',
  listOfLocations: '',
})

const isCustomer = computed(() => profileModel.role === 'Customer')
const isRentalVendor = computed(() => profileModel.role === 'Rental Vendor')

const handleRegister = async () => {
  const payload: any = {
    username: profileModel.username,
    password: profileModel.password,
    name: profileModel.name,
    email: profileModel.email,
    gender: profileModel.gender,
    role: profileModel.role,
  }

  // CUSTOMER → tambah saldo
  if (isCustomer.value) {
    payload.saldo = profileModel.saldo
  }

  // RENTAL VENDOR → tambah phone & locations (harus array)
  if (isRentalVendor.value) {
    payload.phone = profileModel.phone
    payload.listOfLocations = profileModel.listOfLocations
      .split(',')
      .map((loc) => loc.trim())
      .filter((loc) => loc.length > 0)
  }

  const response = await userProfileStore.createProfile(payload)

  if (response) router.push('/login')
}

const saldoString = computed({
  get: () => profileModel.saldo.toString(),
  
  set: (val: string) => {
    profileModel.saldo = Number(val);
  }
});
</script>

<template>
  <main class="w-full min-h-screen pt-24 py-10 px-4 overflow-y-auto">
    <div
      class="mx-auto w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 md:p-8 flex flex-col gap-4"
    >
      <h1 class="text-blue-600 font-bold text-2xl text-center">Register</h1>

      <form @submit.prevent="handleRegister" class="flex flex-col gap-6 py-4">
        <!-- Username & Password -->
        <div class="grid grid-cols-2 gap-4">
          <VInput
            id="username"
            name="username"
            v-model="profileModel.username"
            label="Username"
            required
          />
          <VInput
            id="password"
            name="password"
            v-model="profileModel.password"
            type="password"
            label="Password"
            required
          />
        </div>

        <!-- Name & Email -->
        <div class="grid grid-cols-2 gap-4">
          <VInput
            id="name"
            name="name"
            v-model="profileModel.name"
            type="text"
            label="Name"
            required
          />

          <VInput
            id="email"
            name="email"
            v-model="profileModel.email"
            type="email"
            label="Email"
            required
          />
        </div>

        <!-- Gender -->
        <VSelect
          id="gender"
          name="gender"
          label="Jenis Kelamin"
          v-model="profileModel.gender"
          required
        >
          <option value="">Pilih Jenis Kelamin...</option>
          <option value="MALE">Laki-laki</option>
          <option value="FEMALE">Perempuan</option>
          <option value="OTHER">Lainnya</option>
        </VSelect>

        <!-- Role -->
        <VSelect id="role" name="role" v-model="profileModel.role" label="Role" required>
          <option disabled value="">Pilih role...</option>
          <option value="Customer">Customer</option>
          <option value="Flight Airline">Flight Airline</option>
          <option value="Accomodation Owner">Accomodation Owner</option>
          <option value="Rental Vendor">Rental Vendor</option>
          <option value="Insurance Provider">Insurance Provider</option>
          <option value="Tour Package Vendor">Tour Package Vendor</option>
        </VSelect>

        <!-- CUSTOMER -->
        <div v-if="isCustomer" class="grid grid-cols-2 gap-4">
          <VInput
            id="saldo"
            name="saldo"
            v-model="saldoString"
            type="number"
            label="Saldo Awal"
          />
        </div>

        <!-- RENTAL VENDOR -->
        <div v-if="isRentalVendor" class="grid grid-cols-2 gap-4">
          <VInput id="phone" name="phone" v-model="profileModel.phone" label="Phone Number" />
          <VInput
            id="locations"
            name="locations"
            v-model="profileModel.listOfLocations"
            label="List of Locations (comma separated)"
          />
        </div>

        <!-- BUTTONS -->
        <div class="flex justify-end gap-3 pt-6">
          <!-- BUTTON KEMBALI -->
          <VButton
            @click="router.push('/login')"
            type="button"
            class="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-100 active:bg-slate-200 shadow-sm hover:shadow-md transition-all duration-200"
          >
            Kembali ke Login
          </VButton>

          <!-- BUTTON REGISTER -->
          <VButton
            type="submit"
            :disabled="userProfileStore.loading"
            class="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all duration-200"
          >
            {{ userProfileStore.loading ? 'Registering...' : 'Register' }}
          </VButton>
        </div>
      </form>
    </div>
  </main>
</template>

<style scoped></style>
