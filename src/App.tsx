import "./App.css";
import db from "./firebase";
import { useState, useEffect } from "react";
import { collection, getDocs, doc, onSnapshot } from "firebase/firestore";

const App = () => {
  const [posts, setPosts] = useState<any>([]);
  useEffect(() => {
    // データベースから情報取得
    const postData = collection(db, "posts");
    console.log(postData);
    getDocs(postData).then((snapShot) => {
      setPosts(snapShot.docs.map((doc) => ({ ...doc.data() })));
    });

    // リアルタイム
    onSnapshot(postData, (post) => {
      setPosts(post.docs.map((doc) => ({ ...doc.data() })));
    });
  }, []);

  return (
    <div className="App">
      <div>
        {posts.map((post: any) => (
          <div key={post.id}>
            <h1>{post.title}</h1>
            <p>{post.text}</p>
            {post.imgUrl != "" && <img src={post.imgUrl} className="img"/>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
