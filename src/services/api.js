import axios from 'axios'

export const instance = axios.create({
    baseURL: 'https://admin.pustakam.co.in',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
    withCredentials: false,
})


export const apiMethods = {
    get: async (url) => {
        try {
            const response = await instance.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    post: async (url, data) => {
        try {
            const response = await instance.post(url, data, {
                headers: {
                    // 'Content-Type': 'application/json',
                    "Content-Type": "multipart/form-data",
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    patch: async (url, data) => {
        try {
            const response = await instance.patch(url, data, {
                    headers: {
                        "Content-Type": "multipart/form-data", // required for file upload
                        // 'Content-Type': 'application/json',  
                    },
                });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    delete: async (url, id) => {
        try {
            const response = await instance.delete(url, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getSingleBook: async (url) => {
        try {
            const response = await instance.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}
