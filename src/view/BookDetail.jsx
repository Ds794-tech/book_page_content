import React, { useEffect, useMemo, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBookData } from "../store/action/action";
import { useParams, Link } from "react-router-dom";
// import { PDFDownloadLink } from "@react-pdf/renderer";
// import { decode } from 'he'; // HTML entity decoder
// import { htmlToText } from 'html-to-text'; // HTML to plain text converter
import DOMPurify from 'dompurify';
// import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
// import { jsPDF } from "jspdf";

// import { parse } from "html-react-parser"; // for web DOM rendering
// Custom Button component
import Button from "../components/button/Button";

// Register only robust fonts
// Font.register({
//     family: "Helvetica",
// });
// Font.register({
//     family: "Noto Sans Devanagari",      // note the spaces
//     fonts: [
//         {
//             src:
//                 "https://fonts.gstatic.com/s/notosansdevanagari/v29/TuGoUUFzXI5FBtUq5a8bjKYTZjtRU6Sgv3NaV_SNmI0b8QQCQmHn6B2OHjbL_08AlXQly-A.ttf",
//             fontWeight: 400
//         }
//         // …other weights
//     ]
// });


// For safely rendering HTML on web
// const sanitizeHTML = (html) => {
//     return DOMPurify.sanitize(html, {
//         ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
//         ALLOWED_ATTR: []
//     });
// };
// Utility: Simplified content processing for PDF and web
// const processContent = (rawContent) => {
//     if (!rawContent) return '';
//     // debugger
//     const cleanHtml = sanitizeHTML(rawContent);
//     // 2) Convert to plain text
//     return htmlToText(cleanHtml, { wordwrap: false }).trim();
// };

// React-pdf styles
// const styles = StyleSheet.create({
//     page: {
//         padding: 30,
//         fontFamily: 'Helvetica', // simplified font registration
//         fontSize: 11,
//         lineHeight: 1.4,
//         color: '#2c3e50'
//     },
//     hindi: { padding: 40, fontFamily: "Noto Sans Devanagari", fontSize: 12, lineHeight: 1.5 },
//     coverPage: {
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: '100%',
//         padding: 40
//     },
//     coverTitle: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 15,
//         color: '#2c3e50',
//         textAlign: 'center',
//         lineHeight: 1.3
//     },
//     coverSubtitle: {
//         fontSize: 16,
//         marginBottom: 12,
//         color: '#7f8c8d',
//         textAlign: 'center',
//         lineHeight: 1.3
//     },
//     coverInfo: {
//         fontSize: 14,
//         marginTop: 20,
//         padding: 12,
//         backgroundColor: '#ecf0f1',
//         borderRadius: 4,
//         color: '#2c3e50',
//         textAlign: 'center'
//     },
//     pageHeader: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 20,
//         color: '#e74c3c',
//         textAlign: 'center',
//         backgroundColor: '#fff5f5',
//         padding: 12,
//         borderRadius: 4
//     },
//     section: {
//         marginBottom: 20,
//         padding: 12,
//         backgroundColor: '#f8f9fa',
//         borderRadius: 4
//     },
//     sectionTitle: {
//         fontSize: 14,
//         fontWeight: 'bold',
//         marginBottom: 10,
//         color: '#2c3e50'
//     },
//     sectionContent: {
//         fontSize: 11,
//         lineHeight: 1.4,
//         color: '#495057',
//         textAlign: 'justify'
//     },
//     chapterTitle: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         marginTop: 25,
//         marginBottom: 15,
//         color: '#e74c3c',
//         backgroundColor: '#fff5f5',
//         padding: 12,
//         borderRadius: 4
//     },
//     subChapterTitle: {
//         fontSize: 14,
//         fontWeight: 'bold',
//         marginTop: 20,
//         marginBottom: 12,
//         color: '#3498db',
//         backgroundColor: '#f0f8ff',
//         padding: 10,
//         borderRadius: 4
//     },
//     pageTitle: {
//         fontSize: 12,
//         fontWeight: 'bold',
//         marginTop: 15,
//         marginBottom: 8,
//         color: '#27ae60',
//         backgroundColor: '#f8fff8',
//         padding: 8,
//         borderRadius: 3
//     },
//     pageContent: {
//         fontSize: 10,
//         lineHeight: 1.5,
//         marginBottom: 12,
//         marginLeft: 5,
//         textAlign: 'justify',
//         color: '#2c3e50'
//     },
//     listItem: {
//         fontSize: 11,
//         marginBottom: 6,
//         color: '#495057'
//     },
//     tocTitle: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         marginBottom: 20,
//         textAlign: 'center',
//         color: '#2c3e50'
//     },
//     tocChapter: {
//         fontSize: 12,
//         fontWeight: 'bold',
//         marginTop: 12,
//         marginBottom: 6,
//         color: '#e74c3c'
//     },
//     tocItem: {
//         fontSize: 10,
//         marginBottom: 4,
//         paddingLeft: 15,
//         color: '#495057'
//     },
//     footer: {
//         position: 'absolute',
//         bottom: 20,
//         left: 30,
//         right: 30,
//         textAlign: 'center',
//         fontSize: 8,
//         color: '#7f8c8d',
//         borderTop: '1px solid #dee2e6',
//         paddingTop: 8
//     }
// });

// React component for generating PDF
// const BookPdf = ({ bookData }) => {
//     // Compose content parts
//     const renderedContent = useMemo(() => {
//         // Always process in a safe, plain text way
//         return {
//             bookNameEN: processContent(bookData.book_name_english),
//             bookNameHI: processContent(bookData.book_name_hindi),
//             subtitleEN: processContent(bookData.book_subtitle_english),
//             subtitleHI: processContent(bookData.book_subtitle_hindi),
//             description: processContent(bookData.book_details_english),
//             authors: (bookData.author_data || []).map(a => processContent(a.author_english)),
//             languages: (bookData.language_data || []).map(l => processContent(l.languages)),
//             topics: (bookData.topic_data || []).map(t => processContent(t.topic_english)),
//             keywords: bookData.book_keywords || [],
//             chapters: bookData.chapters || []
//         };
//     }, [bookData]);

//     // Use safe content in PDF
//     const safeRenderContent = (content, fallback = '') => {
//         return content || fallback;
//     };

//     // Render pages recursively
//     const renderPages = (pages, indentLevel = 0) => {
//         if (!pages || pages.length === 0) return null;
//         return pages.map((page, index) => (
//             <View key={page.page_id || index} style={{ marginLeft: indentLevel, marginBottom: 15 }}>
//                 {page.title && (
//                     <Text style={styles.pageTitle}>{safeRenderContent(page.title, 'Untitled Section')}</Text>
//                 )}
//                 {page.content && (
//                     <Text style={styles.pageContent}>{safeRenderContent(page.content, 'No content available')}</Text>
//                 )}
//             </View>
//         ));
//     };

//     return (
//         <Document>
//             {/* Cover Page */}
//             <Page size="A4" style={styles.page}>
//                 <View style={styles.coverPage}>
//                     <Text style={styles.coverTitle}>{renderedContent.bookNameEN || 'Book Title'}</Text>
//                     {renderedContent.bookNameHI && (
//                         <Text style={styles.coverTitle}>{renderedContent.bookNameHI}</Text>
//                     )}
//                     {renderedContent.subtitleEN && (
//                         <Text style={styles.coverSubtitle}>{renderedContent.subtitleEN}</Text>
//                     )}
//                     {renderedContent.subtitleHI && (
//                         <Text style={styles.coverSubtitle}>{renderedContent.subtitleHI}</Text>
//                     )}

//                     {/* Authors */}
//                     {bookData.author_data && bookData.author_data.length > 0 && (
//                         <View style={{ marginTop: 25 }}>
//                             <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#2c3e50', marginBottom: 8, textAlign: 'center' }}>Authors</Text>
//                             {bookData.author_data.map((author, index) => (
//                                 <Text key={author.id || index} style={{ fontSize: 12, color: '#495057', marginBottom: 4, textAlign: 'center' }}>
//                                     {safeRenderContent(author.author_english, 'Unknown Author')} {author.author_hindi && ` (${safeRenderContent(author.author_hindi)})`}
//                                 </Text>
//                             ))}
//                         </View>
//                     )}

//                     {/* Price/Discount */}
//                     <View style={styles.coverInfo}>
//                         <Text>Price: ₹{renderedContent.book_price || 'N/A'}</Text>
//                         {renderedContent.book_price_discount && renderedContent.book_price_discount !== renderedContent.book_price && (
//                             <Text>Discounted: ₹{renderedContent.book_price_discount}</Text>
//                         )}
//                     </View>
//                 </View>
//                 <Text style={styles.footer}>Generated on {new Date().toLocaleDateString('en-GB')}</Text>
//             </Page>

//             {/* Book Information */}
//             <Page size="A4" style={styles.page}>
//                 <Text style={styles.pageHeader}>Book Information</Text>
//                 {renderedContent.description && (
//                     <View style={styles.section}>
//                         <Text style={styles.sectionTitle}>Description</Text>
//                         <Text style={styles.sectionContent}>{renderedContent.description}</Text>
//                     </View>
//                 )}

//                 {/* Topics */}
//                 {bookData.topic_data && bookData.topic_data.length > 0 && (
//                     <View style={styles.section}>
//                         <Text style={styles.sectionTitle}>Topics</Text>
//                         <Text style={styles.sectionContent}>{renderedContent.topics.join(', ')}</Text>
//                     </View>
//                 )}

//                 {/* Languages */}
//                 {bookData.language_data && bookData.language_data.length > 0 && (
//                     <View style={styles.section}>
//                         <Text style={styles.sectionTitle}>Languages</Text>
//                         <Text style={styles.sectionContent}>{renderedContent.languages.join(', ')}</Text>
//                     </View>
//                 )}

//                 {/* Keywords */}
//                 {renderedContent.keywords.length > 0 && (
//                     <View style={styles.section}>
//                         <Text style={styles.sectionTitle}>Keywords</Text>
//                         <Text style={styles.sectionContent}>{renderedContent.keywords.join(', ')}</Text>
//                     </View>
//                 )}

//                 <Text style={styles.footer}>Book Information</Text>
//             </Page>

//             {/* Table of Contents */}
//             {renderedContent.chapters && renderedContent.chapters.length > 0 && (
//                 <Page size="A4" style={styles.page}>
//                     <Text style={styles.tocTitle}>Table of Contents</Text>
//                     {renderedContent.chapters.map((chapter, chapterIndex) => (
//                         <View key={chapter.id || chapterIndex} style={{ marginBottom: 12 }}>
//                             <Text style={styles.tocChapter}>{chapterIndex + 1}. {processContent(chapter.chapter_name || `Chapter ${chapterIndex + 1}`)}</Text>
//                             {chapter.subchapters?.map((sub, subIndex) => (
//                                 <Text key={sub.id || subIndex} style={styles.tocItem}>
//                                     {chapterIndex + 1}.{subIndex + 1}. {processContent(sub.subchapter_name || `Subchapter ${subIndex + 1}`)}
//                                 </Text>
//                             ))}
//                         </View>
//                     ))}
//                     <Text style={styles.footer}>Table of Contents</Text>
//                 </Page>
//             )}

//             {/* Chapter Content Pages */}
//             {bookData.chapters?.map((chapter, chapterIndex) => (
//                 <Page key={chapter.id || chapterIndex} size="A4" style={styles.page}>
//                     <Text style={styles.chapterTitle}>{chapterIndex + 1}: {processContent(chapter.chapter_name)}</Text>
//                     {renderPages(chapter.pages)}
//                     {chapter.subchapters?.map((sub, subIndex) => (
//                         <View key={sub.id || subIndex} style={{ marginTop: 20 }}>
//                             <Text style={styles.subChapterTitle}>{chapterIndex + 1}.{subIndex + 1}. {processContent(sub.subchapter_name)}</Text>
//                             {renderPages(sub.pages, 10)}
//                         </View>
//                     ))}
//                     <Text style={styles.footer}>Chapter {chapterIndex + 1}</Text>
//                 </Page>
//             ))}
//         </Document>
//     );
// };

// Main BookDetails component
const BookDetails = () => {
    const bookList = useSelector((state) => state.books.data);
    const { id } = useParams();
    const dispatch = useDispatch();
    const [book, setBook] = React.useState(null);
    const [isHTML, setIsHtml] = React.useState(false);
    const contentRef = useRef(null);

    useEffect(() => {
        dispatch(getBookData("/book_clone/"));
    }, [dispatch]);

    useEffect(() => {
        if (id && bookList?.length > 0) {
            const singleBook = bookList.find(b => b.id === parseInt(id));
            if (singleBook) {
                const isHTML = /<\/?[a-z][\s\S]*>/i.test(singleBook.book_details_english);
                setIsHtml(isHTML);
                setBook(singleBook);
            }
        }
    }, [id, bookList]);

    if (!book) {
        return (
            <div className="flex items-center justify-center min-h-screen text-gray-600">
                Loading book details...
            </div>
        );
    }

    // PDF download handler (disabled example as in your code)
    // const handleDownloadPDF = () => { /* implementation */ }

    return (
        <div className="bg-gray-50 py-10 px-6">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-3">

                {/* Left Sidebar: Cover & Actions */}
                <div className="p-6 border-r flex flex-col items-center">
                    {book.book_front_image ? (
                        <img
                            src={`https://admin.pustakam.co.in/${book.book_front_image}`}
                            alt={book.book_name_english}
                            className="w-90 h-72 object-cover rounded-lg shadow-md mb-4"
                        />
                    ) : (
                        <div className="w-56 h-72 flex items-center justify-center bg-gray-200 rounded-lg mb-4">
                            No Image
                        </div>
                    )}

                    <p className="text-xl font-semibold text-gray-800">₹{book.book_price}</p>
                    {book.book_price_discount > 0 && (
                        <p className="text-sm text-red-500 line-through">₹{book.book_price_discount}</p>
                    )}

                    {/* PDF Download Button */}
                    {/* <PDFDownloadLink document={<BookPdf bookData={book} />} fileName="book.pdf">
                        {({ loading }) =>
                            <button disabled={loading}>{loading ? "Generating PDF..." : "Download PDF"}</button>
                        }
                    </PDFDownloadLink> */}

                    {/* Other Buttons */}
                    <Button className="mt-4 w-full cursor-pointer bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                        Buy Now
                    </Button>
                    <Button className="mt-2 w-full cursor-pointer bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition">
                        Add to Wishlist
                    </Button>
                </div>

                {/* Right Content: Book Info */}
                <div className="p-8 md:col-span-2 space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{book.book_name_english}</h1>
                        <h2 className="text-lg text-gray-600">{book.book_subtitle_english}</h2>
                    </div>

                    {/* Authors */}
                    <div>
                        <h3 className="font-semibold text-gray-800">Authors</h3>
                        <ul className="list-disc ml-6 text-gray-700">
                            {book.author_data?.map((a) => (
                                <li key={a.id}>{a.author_english}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Book Details with HTML Parsing */}
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Book Details</h3>
                        {isHTML ? (
                            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(book.book_details_english) }} />
                        ) : (
                            <div>{book.book_details_english}</div>
                        )}
                    </div>

                    {/* Language & Topics */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium text-gray-700">Languages</h4>
                            <p className="text-gray-600">{(book.language_data || []).map(l => l.languages).join(', ')}</p>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-700">Topics</h4>
                            <p className="text-gray-600">{(book.topic_data || []).map(t => t.topic_english).join(', ')}</p>
                        </div>
                    </div>

                    {/* Back Button */}
                    <div>
                        <Link to="/" className="inline-block mt-6 text-blue-600 hover:underline">← Back to Books</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;
