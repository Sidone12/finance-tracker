<template>
    <section class="flex items-center justify-between mb-10">
        <h1 class="text-4xl font-extrabold">Summary</h1>
        <div>
            <USelect v-model="selectedViewOptions" :options="transactionViewOptions" />
        </div>
    </section>
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10">
        <Trend color="green" title="Income" :amount="incomeTotal" :last-amount="2000" :loading="pending" />
        <Trend color="red" title="Expense" :amount="expenseTotal" :last-amount="3000" :loading="pending" />
        <Trend color="green" title="Investments" :amount="4000" :last-amount="5000" :loading="pending" />
        <Trend color="green" title="Saving" :amount="4000" :last-amount="3000" :loading="pending" />
    </section>
    <section class="flex justify-between mb-10">
        <div>
            <h2 class="text-2xl font-extrabold">Transactions</h2>
            <div class="text-gray-500 dark:text-gray-400">
                You have {{ incomeCount }} incomes and {{ expenseCount }} expenses this period
            </div>
        </div>
        <div>
            <TransactionsModal v-model="isOpen" @saved="refresh()" />
            <UButton icon="i-heroicons-plus-circle" color="white" variant="solid" label="Add" @click="isOpen = true" />
        </div>
    </section>

    <section v-if="!pending">
        <div v-for="(transactionsOnDay, date) in byDate" :key="date" class="mb-10">
            <DailyTransactionSumary :date="date" :transactions="transactionsOnDay" />
            <Transaction v-for="(transaction, index) in transactionsOnDay" :key="transaction.id"
                :transaction="transaction" @deleted="refresh()" />
        </div>
    </section>
    <section v-else>
        <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
    </section>
</template>

<script setup>
import { transactionViewOptions } from '~/constants';

const selectedViewOptions = ref(transactionViewOptions[1])
const isOpen = ref(false)

const { pending, refresh, transactions: {
    incomeTotal,
    expenseTotal,
    incomeCount,
    expenseCount,
    grouped: {
        byDate
    }
},

} = useFetchTransactions()
await refresh()
</script>
