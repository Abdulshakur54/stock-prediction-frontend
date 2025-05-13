import axios from "axios";


const baseURL = import.meta.env.VITE_BACKEND_BASE_API
const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
})


// Request Interceptor
axiosInstance.interceptors.request.use(
    function(config){
        console.log(config)
        const no_csrf = ['/login', '/register']
        const csrf_methods = ['post','put','delete', 'patch']
        if(!no_csrf.includes(config.url) && csrf_methods.includes(config.method)){
            const csrfToken = localStorage.getItem('csrfToken')
            config.headers['X-CSRFToken'] = csrfToken
        }
        return config;
    },
    function(error){
        return Promise.reject(error);
    }
)

// Response Interceptor
axiosInstance.interceptors.response.use(
    function(response){
        return response;
    },
    // Handle failed responses
    async function(error){
        console.log(error)
       
        const originalRequest = error.config;
        if(error.response.status === 401 && !originalRequest.retry){
            originalRequest.retry = true;
            console.log('refresh token ran')
            try{
                await axiosInstance.post('/token/refresh/')
                console.log('refresh token successful')
                return axiosInstance(originalRequest)
            }catch(error){
                console.log(error)
                window.location.href = '/login'
            }
        }
        return Promise.reject(error);
    }
)


export default axiosInstance;