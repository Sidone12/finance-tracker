export const useCurrency = (amount) => {
    const currency = computed(() => {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'USD',
        }).format(isRef(amount) ? amount.value : amount);
    })
    // console.log(currency);
    return {
      currency,
    };
}