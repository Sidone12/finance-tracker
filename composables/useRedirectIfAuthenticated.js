export const useRedirectIfAuthenticated = async (url = '/') => {
  const user = useSupabaseUser();

  watch(user, (user) => {
      if (user) {
        // alert('Sign-in')
        // console.log(user)
        return navigateTo(url);
      }
    },
    {immediate: true}
    );
    return { user}
};
