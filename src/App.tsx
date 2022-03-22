import "./App.css";
import { db, storage } from "./firebase";
import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";

const App = () => {
  const [posts, setPosts] = useState<any>([]);
  useEffect(() => {
    // データベースから情報取得
    const postData = collection(db, "posts");
    // console.log(postData);
    getDocs(postData).then((snapShot) => {
      setPosts(snapShot.docs.map((doc) => ({ ...doc.data() })));
    });

    // リアルタイム
    onSnapshot(postData, (post) => {
      setPosts(post.docs.map((doc) => ({ ...doc.data() })));
    });
  }, []);

  const uploadHandler = (type: string, file: any): any => {
    const name = file.name;
    const storage = getStorage();
    const storageRef = ref(storage, `${type}/${name}`);
    const metadata = {
      contentType: file.type,
    };
    const uploadTask = uploadBytes(storageRef, file, metadata);
    return uploadTask;
  };

  const setImageFile = async (imgFile: any) => {
    try {
      console.log("画像アップロード処理");
      const file = imgFile;
      const type: string = "images";
      const path: any = uploadHandler(type, file);
      return path;
    } catch (e) {
      return "reject";
    }
  };

  const setVideoFile = async (videoFile: any) => {
    try {
      console.log("動画アップロード処理");
      const file = videoFile;
      const type: string = "videos";
      const path: any = uploadHandler(type, file);
      return path;
    } catch (e) {
      return "reject";
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    // ファイルがあれば、アップロードする処理
    const { title, text, imgFile, videoFile } = event.target.elements;
    let imgFilePath = "";
    let videoFilePath = "";
    if (imgFile.files[0] !== undefined) {
      await setImageFile(imgFile.files[0])
        .then((result: any) => {
          getDownloadURL(result.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            imgFilePath = downloadURL;
            // DBに登録する処理
            addDoc(collection(db, "posts"), {
              title: title.value,
              text: text.value,
              timestamp: serverTimestamp(),
              imgUrl: imgFilePath,
              videoUrl: videoFilePath,
            });
          });
        });
    }
    if (videoFile.files[0] !== undefined) {
      await setVideoFile(videoFile.files[0])
        .then((result: any) => {
          getDownloadURL(result.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            videoFilePath = downloadURL;
            // DBに登録する処理
            addDoc(collection(db, "posts"), {
              title: title.value,
              text: text.value,
              timestamp: serverTimestamp(),
              imgUrl: imgFilePath,
              videoUrl: videoFilePath,
            });
          });
        });
    }
  };

  return (
    <div className="App">
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label>title</label>
            <input name="title" type="text" placeholder="title" />
          </div>
          <div>
            <label>text</label>
            <input name="text" type="text" placeholder="text" />
          </div>
          <div>
            <label>imgFile</label>
            <input name="imgFile" type="file" />
          </div>
          <div>
            <label>videoFile</label>
            <input name="videoFile" type="file" />
          </div>
          <div>
            <button>登録</button>
          </div>
        </form>
      </div>
      <div>
        {posts.map((post: any) => (
          <div key={post.title}>
            <h1>{post.title}</h1>
            <p>{post.text}</p>
            {post.imgUrl !== "" ? (
              <img src={post.imgUrl} className="img" />
            ) : (
              <br />
            )}

            {post.videoUrl !== "" ? (
              <video controls width="250" src={post.videoUrl} />
            ) : (
              <br />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
