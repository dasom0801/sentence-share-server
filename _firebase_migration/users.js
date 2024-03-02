import connectDB from '../config/db.js';
import admin from '../config/firebase.config.js';
import Sentence from '../models/sentence.model.js';
import User from '../models/user.model.js';

try {
  const auth = admin.auth();
  const firestore = admin.firestore();
  const userRef = firestore.collection('users');
  const sentenceRef = firestore.collection('sentences');

  // firebase auth에서 user목록을 가져온다.
  const getUsers = async () => (await auth.listUsers()).users;

  // auth정보로 mongoDB에 user 생성
  const createUser = async (user) => {
    const { uid, displayName, email, profileUrl } = user;
    const userData = {
      uid,
      name: displayName,
      email,
      profileUrl,
      provider: 'google.com',
    };
    const foundUser = await User.findOne({ uid });
    if (foundUser) {
      return foundUser;
    }

    return await User.create(userData);
  };

  // 사용자가 좋아요한 문장을 찾아서 objectId를 반환
  const getUserLikes = async (user) => {
    const userLikes = await getUserLikesFromFirestore(user.email);
    const likeIds = await Promise.all(
      userLikes.map((like) => Sentence.findOne({ firestoreId: like.id }))
    );
    return likeIds.map((like) => like._id);
  };

  // 사용자 작성한 문장을 찾아서 objectId를 반환
  const getUserSentence = async (user) => {
    const firestoreSentenceIds = await getUserSentenceFromFirestore(user.email);
    const sentences = await Promise.all(
      firestoreSentenceIds.map((id) => Sentence.findOne({ firestoreId: id }))
    );

    // sentence에 작성한 사용자의 objectId를 반영
    await Promise.all(
      sentences.map((sentence) => {
        sentence.user = user._id;
        return sentence.save();
      })
    );
    return sentences.map((sentence) => sentence._id);
  };

  // firestore에서 사용자가 좋아요한 문장들을 가져오기
  const getUserLikesFromFirestore = async (email) => {
    const firestoreUser = await getFirestoreUser(email);
    let firestoreUserLikes;
    firestoreUser.forEach((u) => {
      firestoreUserLikes = u.data().userLikes;
    });
    return firestoreUserLikes;
  };

  // firestore에서 사용자가 작성한 문장들을 가져오기
  const getUserSentenceFromFirestore = async (email) => {
    const firestoreUser = await getFirestoreUser(email);
    const firestoreSentenceIds = [];
    let firestoreUserId;
    firestoreUser.forEach((user) => {
      firestoreUserId = user.id;
    });
    const firestoreSentence = await sentenceRef
      .where('userInfo.id', '==', `/users/${firestoreUserId}`)
      .get();

    firestoreSentence.forEach((sentence) =>
      firestoreSentenceIds.push(sentence.id)
    );
    return firestoreSentenceIds;
  };

  // firestore에 저장된 user정보를 가져온다.
  const getFirestoreUser = async (email) => {
    return await userRef.where('email', '==', email).get();
  };

  connectDB().then(async () => {
    const users = await getUsers();
    users.forEach(async (authUser) => {
      const user = await createUser(authUser);
      // sentence에 user정보를 넣어주기 위해 createUser 후에 업데이트
      user.likes = await getUserLikes(user);
      user.sentence = await getUserSentence(user);
      await user.save();
    });
  });
} catch (error) {
  console.log(error);
}
