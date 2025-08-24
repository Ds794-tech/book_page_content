import React, { use, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getBookData } from "../store/action/action";
import Card from "../components/Card/Card";


const Books = () => {
    const bookList = useSelector((state) => state.books.data);
    const dispatch = useDispatch()

    useEffect(() => {
        // Any side effects or data fetching can be done here
        dispatch(getBookData('/book_clone/'));
    }, []);


    return (
        <div>
            <div className="p-4 bg-gray-100 text-right">
                <Link to="/dashboard" className="p-2 bg-blue-500 text-white rounded">Go to Dashboard</Link>
            </div>
            <div className="p-4">
                <h2 className="text-2xl font-bold mb-4">Books List</h2>
                <div className='mx-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {
                        bookList ? bookList?.length > 0 && bookList?.map((book) => (
                            <Card key={book.id} bookData={book} />
                        )) : <p className="text-center col-span-3">Books Loading....</p>
                    }
                    {
                        bookList && bookList.length === 0 && <p className="text-center col-span-3">No Books Available. Please Add Some Books.</p>
                    }
                </div>
            </div>
        </div>
    );
}

export default Books;