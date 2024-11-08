<template>
    <UModal v-model="isOpen">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>{{ isEditing ? 'Edit' : 'Add ' }} Transaction
            </template>

            <UForm :state="state" :schema="schema" ref="form" @submit.prevent="save">
                <UFormGroup :required="true" label="Transaction Type" name="type" class="mb-4">
                    <USelect :disabled="isEditing" v-model="state.type" placeholder="Select the transaction type"
                        :options="types" />
                </UFormGroup>

                <UFormGroup :required="true" label="Amount" name="amount" class="mb-4">
                    <UInput v-model.number="state.amount" type="number" placeholder="amount" />
                </UFormGroup>

                <UFormGroup :required="true" label="Transactions date" name="created_at" class="mb-4">
                    <UInput v-model="state.created_at" type="date" icon="i-heroicons-calendar-days-20-solid" />
                </UFormGroup>
                <UFormGroup label="Description " name="description" class="mb-4">
                    <UInput v-model="state.description" placeholder="description" />
                </UFormGroup>
                <UFormGroup :required="true" label="Category" name="category" class="mb-4"
                    v-if="state.type === 'Expense'">
                    <USelect v-model="state.category" placeholder="Category" :options="categories" />
                </UFormGroup>

                <UButton type="submit" color="black" variant="solid" label="Save" :loading="isLoading" />
            </UForm>

            <template #footer>

            </template>
        </UCard>
    </UModal>
</template>

<script setup>
import { categories, types } from '~/constants'
import { z } from 'zod'


const props = defineProps({
    modelValue: Boolean,
    transaction: {
        type: Object,
        requiered: false
    }
})
const isEditing = computed(() => !!props.transaction)


const emit = defineEmits(['update:modelValue', 'saved'])


const defaultSchema = z.object({
    created_at: z.string(),
    description: z.string().optional(),
    amount: z.number().positive('Amount needs to be more than 0')
})
const incomeSchema = z.object({
    type: z.literal('Income')
})
const expenseSchema = z.object({
    type: z.literal('Expense'),
    category: z.enum(categories)
    // перевіряємо чи категорія саме енам тип з категорій що передаємо)

})
const investmentSchema = z.object({
    type: z.literal('Investment')
})
const savingSchema = z.object({
    type: z.literal('Saving')
})

const schema = z.intersection(
    z.discriminatedUnion('type', [incomeSchema, expenseSchema, investmentSchema, savingSchema]),
    defaultSchema
)

const form = ref()
const isLoading = ref(false)
const supabase = useSupabaseClient()
const { toastSuccess, toastError } = useAppToast()

const save = async () => {
    if (form.value.errors.lengh) return
    // store to sopabase
    isLoading.value = true
    try {
        const { error } = await supabase.from('transactions')
            .upsert({
                ...state.value,
                id: props.transaction?.id // частина для для редагування    
            })
        if (!error) {
            toastSuccess({
                title: 'Transaction saved',
            })
            isOpen.value = false
            emit('saved')
            return
        }
        throw error
    } catch (e) {
        toastError({
            title: 'Transaction not saved',
            description: e.message,
        })
    } finally {
        isLoading.value = false
    }
}

console.log('MOunted')
// потрібно щоб стан змінювався до інішл тільки коли ми створюємо нову транзакцію а коли редагуємо потрібно щоб використувався стейт нище
const initialState = isEditing.value ?{
    type: props.transaction.type,
    amount: props.transaction.amount,
    created_at: props.transaction.created_at.split('T')[0],
    description: props.transaction.description,
    category: props.transaction.category
} :  {
    type: undefined,
    amount: 0,
    created_at: undefined,
    description: undefined,
    category: undefined
}


const state = ref({ ...initialState })

const resetForm = () => {
    Object.assign(state.value, initialState)
    form.value.clear()
}

const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => {
        if (!value) resetForm()
        emit('update:modelValue', value)
    }
})
</script>
