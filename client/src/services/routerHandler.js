
export const routerHandler = (navigateTo, jwt) => {
    if (jwt != null && Object.keys(jwt).length){
        navigateTo("/user/login")
    }
};
    