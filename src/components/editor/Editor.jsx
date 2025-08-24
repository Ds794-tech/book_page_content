import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addBook, getBookData, updateBook } from "../../store/action/action";
import { useNavigate, useParams } from "react-router-dom";
import { Editor } from '@tinymce/tinymce-react';


const steps = ["Basic Info", "Details", "Files", "Meta Data"];

const StepperForm = () => {
    const [step, setStep] = useState(1);
    const bookList = useSelector((state) => state.books.data);
    const [preview, setPreview] = useState({ bookImageFile: null, bookFile: null });
    const dispatch = useDispatch();
    const { id } = useParams();
    const navigate = useNavigate();

    const editorRef = useRef(null);

    // Dropdown Data
    const [authors, setAuthors] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [topics, setTopics] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        author_data: [],
        author_details_english: "",
        author_details_hindi: "",
        book_details_english: "",
        book_details_hindi: "",
        book_name_english: "",
        book_name_hindi: "",
        // book_front_image: null,
        // book_file: null,
        book_price: 0,
        book_price_discount: 0,
        book_subtitle_english: "",
        book_subtitle_hindi: "",
        book_free_demo: 0,
        download_count: 0,
        language_data: [],
        draft: true,
        topic_data: [],
    });

    // Fetch books (for edit mode)
    useEffect(() => {
        dispatch(getBookData("/book_clone/"));
    }, [dispatch]);

    // Prefill data when editing
    useEffect(() => {
        if (id && bookList?.length > 0) {
            const singleBook = bookList.find((book) => book.id == parseInt(id));
            if (singleBook) {
                setFormData({
                    ...singleBook,
                    author_data: singleBook.author_data?.map((a) => a.id) || [],
                    language_data: singleBook.language_data?.map((l) => l.id) || [],
                    topic_data: singleBook.topic_data?.map((t) => t.id) || [],
                });
            }
        }
    }, [id, bookList?.length > 0]);

    // Fetch dropdown options
    useEffect(() => {
        axios
            .get("https://admin.pustakam.co.in/author/")
            .then((res) => setAuthors(res.data.data || []));
        axios
            .get("https://admin.pustakam.co.in/languages/")
            .then((res) => setLanguages(res.data.data || []));
        axios
            .get("https://admin.pustakam.co.in/topic/")
            .then((res) => setTopics(res.data.data || []));
    }, []);

    // Handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleMultiSelect = (e, key) => {
        const values = Array.from(e.target.selectedOptions, (opt) => Number(opt.value)); // 👈 convert to number
        setFormData((prev) => ({ ...prev, [key]: values }));
    };
    const nextStep = (e) => {
        e.preventDefault();
        setStep((prev) => prev + 1);
    };
    const prevStep = (e) => {
        e.preventDefault();
        setStep((prev) => prev - 1);
    };

    // Submit
    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();

        Object.keys(formData).forEach((key) => {
            if (Array.isArray(formData[key])) {
                // 👇 append each ID separately
                formData[key].forEach((val) => data.append(key, val));
            } else if (formData[key] instanceof File) {
                data.append(key, formData[key]);
            } else {
                data.append(key, formData[key] ?? "");
            }
        });

        if (id) {
            dispatch(updateBook(`/book_clone/${id}/`, data));
            navigate('/dashboard');
        } else {
            dispatch(addBook("/book_clone/", data));
            navigate('/dashboard');
        }
    };

    const handleRemovebookFile = () => {
        setFormData({ ...formData, book_file: null });
        setPreview({ ...preview, bookFile: null });
    };

    const handleRemovebookImageFile = () => {
        setFormData({ ...formData, book_front_image: null });
        setPreview({ ...preview, bookImageFile: null });
    };

    console.log(formData)

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-4xl h-[90vh] bg-white shadow-lg rounded-lg flex flex-col">
                {/* Stepper Header */}
                <div className="flex justify-between p-4 border-b">
                    {steps.map((label, index) => (
                        <div key={index} className="flex-1 text-center">
                            <div
                                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${step === index + 1
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-300 text-gray-700"
                                    }`}
                            >
                                {index + 1}
                            </div>
                            <p className="text-xs mt-1">{label}</p>
                        </div>
                    ))}
                </div>

                {/* Stepper Form */}
                <form
                    onSubmit={handleSubmit}
                    className="flex-1 overflow-y-auto p-6 space-y-6"
                    encType="multipart/form-data"
                >
                    {/* Step 1 */}
                    {step === 1 && (
                        <div className="bg-gray-50 rounded-xl p-6 shadow-inner grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="book_name_english"
                                placeholder="Book Name (English)"
                                value={formData.book_name_english || ""}
                                onChange={handleChange}
                                className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
                            />

                            <input
                                type="text"
                                name="book_name_hindi"
                                placeholder="Book Name (Hindi)"
                                value={formData.book_name_hindi || ""}
                                onChange={handleChange}
                                className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
                            />

                            <input
                                type="text"
                                name="book_subtitle_english"
                                placeholder="Book Subtitle (English)"
                                value={formData.book_subtitle_english || ""}
                                onChange={handleChange}
                                className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
                            />

                            <input
                                type="text"
                                name="book_subtitle_hindi"
                                placeholder="Book Subtitle (Hindi)"
                                value={formData.book_subtitle_hindi || ""}
                                onChange={handleChange}
                                className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <select
                                multiple
                                name="author_data"
                                value={formData.author_data}
                                onChange={(e) => handleMultiSelect(e, "author_data")}
                                className="col-span-2 border p-2 rounded focus:ring-2 focus:ring-blue-500"
                            >
                                {authors.map((a) => (
                                    <option key={a.id} value={a.id}>
                                        {a.author_english}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Step 2 */}
                    {step === 2 && (
                        <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                            <div>
                                <label className="font-medium block mb-1">
                                    Author Details (English)
                                </label>
                                <Editor
                                    apiKey='v3ghmj0pw7my0pvq462l7n69z7klabmxa6l8evff14hz3v8u'
                                    onEditorChange={(content) =>
                                        setFormData((prev) => ({ ...prev, author_details_english: content })) // ✅ update state
                                    }
                                    value={formData.author_details_english}
                                    init={{
                                        plugins: [
                                            'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                                            'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'advtemplate', 'ai', 'uploadcare', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown', 'importword', 'exportword', 'exportpdf'
                                        ],
                                        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                                        tinycomments_mode: 'embedded',
                                        tinycomments_author: 'Author name',
                                        mergetags_list: [
                                            { value: 'First.Name', title: 'First Name' },
                                            { value: 'Email', title: 'Email' },
                                        ],
                                        ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
                                        uploadcare_public_key: 'b238a236ad699a1b319c',
                                    }}
                                />

                            </div>
                            <div>
                                <label className="font-medium block mb-1">
                                    Author Details (Hindi)
                                </label>
                                <Editor
                                    apiKey='v3ghmj0pw7my0pvq462l7n69z7klabmxa6l8evff14hz3v8u'
                                    onEditorChange={(content) =>
                                        setFormData((prev) => ({ ...prev, author_details_hindi: content })) // ✅ update state
                                    }
                                    value={formData.author_details_hindi}
                                    init={{
                                        plugins: [
                                            'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                                            'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'advtemplate', 'ai', 'uploadcare', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown', 'importword', 'exportword', 'exportpdf'
                                        ],
                                        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                                        tinycomments_mode: 'embedded',
                                        tinycomments_author: 'Author name',
                                        mergetags_list: [
                                            { value: 'First.Name', title: 'First Name' },
                                            { value: 'Email', title: 'Email' },
                                        ],
                                        ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
                                        uploadcare_public_key: 'b238a236ad699a1b319c',
                                    }}
                                />


                            </div>
                            <div>
                                <label className="font-medium block mb-1">
                                    Book Details (English)
                                </label>
                                <Editor
                                    apiKey='v3ghmj0pw7my0pvq462l7n69z7klabmxa6l8evff14hz3v8u'
                                    onEditorChange={(content) => setFormData((prev) => ({ ...prev, book_details_english: content }))} // ✅ update state
                                    value={formData.book_details_english}
                                    init={{
                                        plugins: [
                                            'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                                            'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'advtemplate', 'ai', 'uploadcare', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown', 'importword', 'exportword', 'exportpdf'
                                        ],
                                        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                                        tinycomments_mode: 'embedded',
                                        tinycomments_author: 'Author name',
                                        mergetags_list: [
                                            { value: 'First.Name', title: 'First Name' },
                                            { value: 'Email', title: 'Email' },
                                        ],
                                        ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
                                        uploadcare_public_key: 'b238a236ad699a1b319c',
                                    }}
                                />

                            </div>
                            <div>
                                <label className="font-medium block mb-1">
                                    Book Details (Hindi)
                                </label>
                                <Editor
                                    apiKey='v3ghmj0pw7my0pvq462l7n69z7klabmxa6l8evff14hz3v8u'
                                    onEditorChange={(content) => setFormData((prev) => ({ ...prev, book_details_hindi: content }))} // ✅ update state
                                    value={formData.book_details_hindi}
                                    init={{
                                        plugins: [
                                            'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                                            'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'advtemplate', 'ai', 'uploadcare', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown', 'importword', 'exportword', 'exportpdf'
                                        ],
                                        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                                        tinycomments_mode: 'embedded',
                                        tinycomments_author: 'Author name',
                                        mergetags_list: [
                                            { value: 'First.Name', title: 'First Name' },
                                            { value: 'Email', title: 'Email' },
                                        ],
                                        ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
                                        uploadcare_public_key: 'b238a236ad699a1b319c',
                                    }}
                                />

                            </div>
                        </div>
                    )}

                    {/* Step 3 */}
                    {step === 3 && (
                        <div className="bg-gray-50 rounded-xl p-6 shadow-inner grid grid-cols-2 gap-4">
                            {(formData.book_file || preview.bookFile) && <div className="mt-4">
                                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                                <div className="relative inline-block">
                                    <img
                                        src={preview.bookFile ? preview.bookFile : `https://admin.pustakam.co.in/${formData.book_file}`}
                                        alt="Preview"
                                        className="w-40 h-40 object-cover rounded-lg border"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemovebookFile}
                                        className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                            }
                            {(formData.book_front_image || preview.bookImageFile) && <div className="mt-4">
                                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                                <div className="relative inline-block">
                                    <img
                                        src={preview.bookImageFile ? preview.bookImageFile : `https://admin.pustakam.co.in/${formData.book_front_image}`}
                                        alt="Preview"
                                        className="w-40 h-40 object-cover rounded-lg border"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemovebookImageFile}
                                        className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                            }
                            <input
                                type="file"
                                name="book_file"
                                onChange={(e) => {
                                    if (e.target.files) {
                                        setFormData((prev) => ({ ...prev, book_file: e.target.files[0] }));
                                        const fileURL = URL.createObjectURL(e.target.files[0]);
                                        setPreview({ ...preview, bookFile: fileURL });
                                    }
                                }}
                                className="col-span-2 border p-2 rounded"
                            />

                            {/* Book Front Image */}
                            <input
                                type="file"
                                name="book_front_image"
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files) {
                                        setFormData((prev) => ({ ...prev, book_front_image: e.target.files[0] }));
                                        const fileURL = URL.createObjectURL(e.target.files[0]);
                                        setPreview({ ...preview, bookImageFile: fileURL });
                                    }
                                }}
                                className="col-span-2 border p-2 rounded"
                            />
                            <input
                                type="text"
                                name="book_price"
                                placeholder="Book Price"
                                value={formData.book_price || ""}
                                onChange={handleChange}
                                className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                name="book_price_discount"
                                placeholder="Book Price Discount"
                                value={formData.book_price_discount || ""}
                                onChange={handleChange}
                                className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    )}

                    {/* Step 4 */}
                    {step === 4 && (
                        <div className="bg-gray-50 rounded-xl p-6 shadow-inner grid grid-cols-2 gap-4">
                            <select
                                multiple
                                name="language_data"
                                value={formData.language_data}
                                onChange={(e) => handleMultiSelect(e, "language_data")}
                                className="col-span-2 border p-2 rounded focus:ring-2 focus:ring-blue-500"
                            >
                                {languages.map((lang) => (
                                    <option key={lang.id} value={lang.id}>
                                        {lang.languages}
                                    </option>
                                ))}
                            </select>
                            <select
                                multiple
                                name="topic_data"
                                value={formData.topic_data}
                                onChange={(e) => handleMultiSelect(e, "topic_data")}
                                className="col-span-2 border p-2 rounded focus:ring-2 focus:ring-blue-500"
                            >
                                {topics.map((topic) => (
                                    <option key={topic.id} value={topic.id}>
                                        {topic.topic_english}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Step Navigation */}
                    <div className="p-4 border-t flex justify-between">
                        {step > 1 && (
                            <button
                                onClick={prevStep}
                                className="px-4 py-2 cursor-pointer bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Back
                            </button>
                        )}
                        {step < steps.length && (
                            <button
                                onClick={nextStep}
                                className="ml-auto px-4 py-2 cursor-pointer bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Next
                            </button>
                        )}
                        {step === steps.length && (
                            <button
                                type="submit"
                                className="ml-auto cursor-pointer px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                {!id ? "Submit" : "Update"}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StepperForm;
