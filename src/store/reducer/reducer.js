const intialState = {
    books: []
}



export const reducer = (state = intialState, action) => {
    switch (action.type) {
        case "GET_BOOK_DATA":
            return {
                ...state,
                books: action.payload
            }
        // case "ADD_BOOK":
        //     return {
        //         ...state,
        //         books: [...state.books, action.payload]
        //     }
        // case "DELETE_BOOK":
        //     const filteredBooks = state.books.filter(book => book.id !== action.payload);
        //     return {
        //         ...state,
        //         books: filteredBooks
        //     }
        // case "UPDATE_BOOK":
        //     const updatedBooks = state.books.map(book => {
        //         if (book.id === action.payload.id) {
        //             return { ...book, ...action.payload };
        //         }
        //         return book;
        //     });
        //     return {
        //         ...state,
        //         books: updatedBooks
        //     }
        default:
            return state;
    }
}