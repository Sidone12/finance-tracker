<template>
    <UModal v-model="isOpen">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header> Add Transaction </template>

            <UForm :state="state" :schema="schema" ref="form" @submit.prevent="save">
                <UFormGroup :required="true" label="Transaction Type" name="type" class="mb-4">
                    <USelect v-model="state.type" placeholder="Select the transaction type" :options="types" />
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
                   <UFormGroup :required="true" label="Category" name="category" class="mb-4" v-if="state.type === 'Expense'">
                    <USelect v-model="state.category" placeholder="Category" :options="categories" />
                </UFormGroup>

                <UButton type="submit" color="black" variant="solid" label="Save" />
            </UForm>

            <template #footer></template>
        </UCard>
    </UModal>
</template>

<script lang="ts" setup>
import { categories, types } from '~/constants'
import { z } from 'zod'


const props = defineProps({
    modelValue: Boolean
})
const emit = defineEmits(['update:modelValue'])


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
const save = async () => {
  form.value.validate()
}

const state = ref({
    type: undefined,
    amount: 0,
    created_at: undefined,
    description: undefined,
    category: undefined
})

const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})
</script>
