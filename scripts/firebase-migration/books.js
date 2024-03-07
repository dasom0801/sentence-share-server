import connectDB from '../../config/db.js';
import admin from '../../config/firebase.config.js';
import Book from '../../models/book.model.js';

try {
  const firestore = admin.firestore();
  const booksRef = firestore.collection('books');

  const getBooks = async () => await booksRef.get();
  const createBook = async (book) => {
    const firestoreId = book.id;
    const data = book.data();
    const { bookTitle, bookImage, author, publisher, isbn } = data;

    const foundBook = await Book.findOne({ isbn });
    if (foundBook) {
      // 이미 등록된 책은 무시하고 넘어감.
      return;
    }

    Book.create({
      title: bookTitle,
      coverUrl: bookImage,
      publisher,
      author: typeof author === 'string' ? [author] : author,
      isbn,
      firestoreId,
    });
  };

  connectDB().then(async () => {
    const books = await getBooks();
    books.forEach((book) => createBook(book));
  });
} catch (error) {
  console.log('error', error);
}
