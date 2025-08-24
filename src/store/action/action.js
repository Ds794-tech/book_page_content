import { apiMethods } from "../../services/api"


export const getBookData = (url, data) => {
    return (dispatch) => {
        return apiMethods.get('/book_clone/').then((res) => {
            dispatch({ type: 'GET_BOOK_DATA', payload: res });
        }).catch((err) => {
            return err;
        });
    }
}

export const addBook = (url, data) => {
    return (dispatch) => {
        return apiMethods.post(url, data).then((res) => {
            dispatch(getBookData('/book_clone/'));
        }).catch((err) => {
            return err;
        });
    }
}

export const updateBook = (url, data) => {
    return (dispatch) => {
        return apiMethods.patch(url, data).then((res) => {
            dispatch(getBookData('/book_clone/'));
        }).catch((err) => {
            return err;
        });
    }
}

export const deleteBook = (url, data) => {
    return (dispatch) => {
        return apiMethods.delete(url, data).then((res) => {
            dispatch(getBookData('/book_clone/'));
        }).catch((err) => {
            return err;
        });
    }
}

export const getSingleBookData = (url) => {
    return (dispatch) => {
        return apiMethods.getSingleBook(url).then((res) => {
            console.log(res.data)
        }).catch((err) => {
            return err;
        });
    }
}

