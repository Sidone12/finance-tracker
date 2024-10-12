<template>
    <section class="flex items-center justify-between mb-10">
        <h1 class="text-4xl font-extrabold">Summary</h1>
        <div>
            <USelect v-model="selectedViewOptions" :options="transactionViewOptions" />
        </div>
    </section>
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10">
        <Trend color="green" title="Income" :amount="incomeTotal" :last-amount="2000" :loading="isLoading" />
        <Trend color="red" title="Expense" :amount="expenseTotal" :last-amount="3000" :loading="isLoading" />
        <Trend color="green" title="Investments" :amount="4000" :last-amount="5000" :loading="isLoading" />
        <Trend color="green" title="Saving" :amount="4000" :last-amount="3000" :loading="isLoading" />
    </section>
    <section class="flex justify-between mb-10">
        <div>
            <h2 class="text-2xl font-extrabold">Transactions</h2>
            <div class="text-gray-500 dark:text-gray-400">
                You have {{ incomeCount }} incomes and {{ expenseCount }} expenses this period
            </div>
        </div>
        <div>
            <TransactionsModal v-model="isOpen" @saved="refreshTransactions()" />
            <UButton icon="i-heroicons-plus-circle" color="white" variant="solid" label="Add" @click="isOpen = true" />
        </div>
    </section>

    <section v-if="!isLoading">
        <div v-for="(transactionsOnDay, date) in transactionGroupByDate" :key="date" class="mb-10">
            <DailyTransactionSumary :date="date" :transactions="transactionsOnDay" />
            <Transaction v-for="(transaction, index) in transactionsOnDay" :key="transaction.id"
                :transaction="transaction" @deleted="refreshTransactions()" />
        </div>
    </section>
    <section v-else>
        <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
    </section>
</template>

<script setup>
import { transactionViewOptions } from '~/constants';

const isOpen = ref(false)

const selectedViewOptions = ref(transactionViewOptions[1])

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const transactions = ref([])

const isLoading = ref(false)

const income = computed(
    () => transactions.value.filter(t => t.type === 'Income'))
const expense = computed(
    () => transactions.value.filter(t => t.type === 'Expense'))

const incomeCount = computed(() => income.value.length)
const expenseCount = computed(() => expense.value.length)

const incomeTotal = computed(
    () => income.value.reduce((sum, transaction) => sum + transaction.amount, 0)
)
const expenseTotal = computed(
    () => expense.value.reduce((sum, transaction) => sum + transaction.amount, 0)
)

const fetchTransactions = async () => {
    isLoading.valuse = true;

    try {
        const { data } = await useAsyncData('transactions', async () => {
            const { data, error } = await supabase
                .from('transactions')
                .select()
                .order('created_at', { ascending: false })
                // supabase sorting
            if (error) return []

            return data
        })
        return data.value
    } finally {
        isLoading.valuse = false;
    }
}

const refreshTransactions = async () => transactions.value = await fetchTransactions()
// console.log(data)
await refreshTransactions()

const transactionGroupByDate = computed(() => {
    let grouped = {}
    for (const transaction of transactions.value) {
        const date = new Date(transaction.created_at).toISOString().split('T')[0]
        // console.log(date)

        if (!grouped[date]) {
            grouped[date] = []
        }
        grouped[date].push(transaction)
    }
     return grouped
    // const sortedKeys = Object.keys(grouped).sort().reverse()
    // const sortedGrouped = {}
    // for (const key of sortedKeys) {
    //     sortedGrouped[key] = grouped[key]
    // }
    // return sortedGrouped
    // це приклад сортування по даті наших витрат на фронтенлі! але буду використовувати можливість супербази сортувати однією командою
   
})

// console.log(transactionGroupByDate.value)
</script>
