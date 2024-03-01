import connectDB from '../config/db.js';
import admin from '../config/firebase.config.js';
import Book from '../models/book.model.js';
import Sentence from '../models/sentence.model.js';

try {
  const firestore = admin.firestore();
  const sentencesRef = firestore.collection('sentences');

  const getSentences = async () => await sentencesRef.get();

  const createSentence = async (sentence) => {
    const firestoreId = sentence.id;
    const data = sentence.data();
    const { bookId, body, likes } = data;
    const createdSentence = await Sentence.create({
      content: body,
      likes,
      firestoreId,
    });

    const foundBook = await Book.findOne({
      firestoreId: bookId.replace('/books/', ''),
    });
    if (foundBook) {
      createdSentence.book = foundBook._id;
      await createdSentence.save();
    }
  };

  connectDB().then(async () => {
    const sentences = await getSentences();
    sentences.forEach((sentence) => createSentence(sentence));
  });
} catch (error) {
  console.log('error', error);
}
