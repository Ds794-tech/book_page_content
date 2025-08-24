import { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import Button from "../components/button/Button";
import { useDispatch, useSelector } from "react-redux";
import { addBook, deleteBook, getBookData } from "../store/action/action";
import Swal from "sweetalert2";
import RichTextEditor from "../components/editor/Editor";
import { Outlet, useNavigate } from "react-router-dom";
import Card from "../components/Card/Card";

const Dashboard = () => {
    const [isOpen, setIsOpen] = useState(false);
    const bookList = useSelector((state) => state.books.data);
    console.log("bookList from redux", bookList);
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            dispatch(getBookData('/book_clone/'));
            // setBookData(response.data);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [])

    const deleteHandler = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                if (id) {
                    dispatch(deleteBook(`/book_clone/${id}/`, {
                        data: { id: id }
                    }));
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your Book has been deleted.",
                        icon: "success"
                    });
                }
            }
        });

    }

    const editHandler = (book) => {
        navigate(`/edit-page/${book.id}`, { state: { book } });
    }

    const viewHandler = (book) => {
        navigate(`/view-page/${book.id}`, { state: { book } });
    }

    const addBookHandler = () => {
        navigate('/create-page');
        // dispatch(addBook('/book_clone/', {
        //     Content: "book_name_english"
        // }))
    }

    return (
        <div>
            <div>
                <div className='flex justify-end mr-5'>
                    <Button onClick={addBookHandler} className="bg-blue-600 p-3 rounded text-white my-5 cursor-pointer">
                        Add Books
                    </Button>
                </div>
                <div className='mx-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
                    {
                        bookList ? bookList.length > 0 && bookList.map((book) => (
                            <Card key={book.id} bookData={book} deleteHandler={deleteHandler} editHandler={editHandler} viewHandler={viewHandler} />
                        )): <p className="text-center">Books Loading....</p>
                    }
                    {
                        bookList && bookList.length === 0 && <p className="text-center">No Books Available. Please Add Some Books.</p>
                    }
                </div>
            </div>
        </div>
    )

}

export default Dashboard;