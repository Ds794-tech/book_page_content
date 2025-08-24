import editIcon from "../../assets/edit.png";
import deleteIcon from "../../assets/delete.png";
import parse from "html-react-parser";
import { useNavigate } from "react-router-dom";


const Card = ({ bookData, deleteHandler, editHandler, viewHandler, key }) => {

    // const isHTML = /<\/?[a-z][\s\S]*>/i.test(bookData.book_details_english);
    const pathname = window.location.pathname;
    const navigate = useNavigate()

    return (
        <div key={key} class="overflow-x-auto mt-10 h-100">
            <div onClick={() => {
                pathname == '/' && navigate(`/view-page/${bookData.id}`, { state: { book: bookData } });
            }} class="max-w-sm relative h-90 rounded shadow-lg cursor-pointer">
                {bookData.book_file && <img class="w-[200px] mx-auto" src={`https://admin.pustakam.co.in/${bookData.book_file}`} alt="Sunset in the mountains" />}
                <div class="px-6 py-4 text-center">
                    <div class="font-bold text-xl mb-2">{bookData.book_name_english}</div>
                    <div class="text-gray-700 text-base">
                        {bookData.book_subtitle_english && <p className="mb-2"><strong>Subtitle:</strong> {bookData.book_subtitle_english}</p>}
                    </div>
                </div>
                {pathname !== '/' && < div class="px-6 pt-4 pb-2 absolute bottom-0 w-full bg-white"     >
                    <span onClick={() => editHandler(bookData)} class="inline-block cursor-pointer hover:bg-gray-200 rounded p-3 text-sm font-semibold text-gray-700 mr-2 mb-2"><img title="Edit Book" width={20} src={editIcon} alt="edit" /></span>
                    <span onClick={() => deleteHandler(bookData.id)} class="inline-block cursor-pointer hover:bg-gray-200 rounded p-3 text-sm font-semibold text-gray-700 mr-2 mb-2"><img title="delete Book" width={20} src={deleteIcon} alt="delete" /></span>
                </div>}
            </div>
        </div >
    )
}


export default Card;