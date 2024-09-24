<template>
    <UModal v-model="isOpen">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                Add Transaction
            </template>

            <div>Hello</div>

            <template #footer>
                some footer text
            </template>
        </UCard>
    </UModal>
</template>

<script lang="ts" setup>
const props = defineProps({
    modelValue: Boolean
})
const emit = defineEmits(['update:modelValue'])

const isOpen = computed({
    get: () => props.modelValue,
    set: (value)=> emit('update:modelValue',value)
})

</script>

<style></style>