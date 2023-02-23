'use client';
import './page.scss'

import * as firebase from 'firebase/app';
import * as firestore from 'firebase/firestore'
import * as fireauth from "firebase/auth";

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

import { useState } from 'react' 


const firebaseConfig = {
  apiKey: "AIzaSyD9U4I5Q5rWnzmXmoYAXZKNPTxHBb-L6KU",
  authDomain: "root-app-308501.firebaseapp.com",
  projectId: "root-app-308501",
  storageBucket: "root-app-308501.appspot.com",
  messagingSenderId: "781088403229",
  appId: "1:781088403229:web:b7f600ce40ae818e353bf4",
  measurementId: "G-PQQ00QNZ7H"
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = fireauth.getAuth(app)
const db = firestore.getFirestore(app)



export default function Home() {
  const [user] = useAuthState(auth)

  return (
		<div className="App">
      <header className="App-header">

      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
		</div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new fireauth.GoogleAuthProvider();
    // fireauth.signInWithPopup(auth, provider)
    fireauth.signInWithRedirect(auth, provider)
  }
  return (
		<>
			<button
				className="bg-slate-400 p-1 grid h-screen w-screen place-items-center"
				onClick={() => signInWithGoogle()}
			> Entrar com o Google
			</button>
		</>
  );
}
function SignOut() {
  return auth.currentUser && (
    <button 
      className='bg-slate-400'
      onClick={() => auth.signOut()}>
      Sair 
    </button>
  )
}


function ChatRoom() {
  // reference a firestore collection
  const messagesRef = firestore.collection(db, 'messages')
  // query for documents in a collection
  const q = firestore.query(
    messagesRef,
    firestore.orderBy('createdAt'),
    firestore.limit(25))

  // listen to realtime updates using a hook
  const [messages] = useCollectionData(q)

  const [formValue, setFormValue] = useState('')
  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await firestore.addDoc(messagesRef, {
			uid: auth.currentUser?.uid,
			text: formValue,
			createdAt: firestore.serverTimestamp(),
		});
		setFormValue("");
  };

  return (
		<>
			<div>
				{messages &&
					messages.map((msg) => (
						<ChatMessage key={msg.id} message={msg} />
					))}
			</div>
      <form onSubmit={sendMessage}>
				<input
          value={formValue} onChange={e => setFormValue(e.target.value)}
          className='border-2 border-black'
          type="text" />
				<button type="submit"> ↩ Enviar</button>
			</form>
			<SignOut />
		</>
  );
}

function ChatMessage(props: {message: firestore.DocumentData}) {
  const { text, uid } = props.message;
  const isMessageSent = uid === auth.currentUser?.uid
  const msgStyle = [
		"flex-1 p-1",
		"",
		isMessageSent ? "text-right bg-teal-600" : "bg-slate-700",
  ].join(" ");
  return (
		<>
			<div className="flex m-5 text-white">
				<p className={msgStyle}>{text}</p>
			</div>
		</>
  );
}