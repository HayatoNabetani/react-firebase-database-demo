import "./App.css";
import { db, storage } from "./firebase";
import { useState, useEffect } from "react";
import { collection, getDocs, doc, onSnapshot } from "firebase/firestore";
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

  const uploadHandler = (type:string,file:any): string => {
    const name = file.name;
    const storage = getStorage();
    const storageRef = ref(storage, `${type}/${name}`);
    const metadata = {
      contentType: file.type,
    };
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);
    uploadTask.on(
      "state_changed",
      (snapshot: any) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error: any) => {
        // Handle unsuccessful uploads
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
        return "fail";
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          return downloadURL;
        });
      }
    );
    return "fail";//これなぜか必要になっちゃう
  }

  const setImageFile = (imgFile: any): string => {
    // アップロード処理
    console.log("画像アップロード処理");
    const file = imgFile;
    const type: string = "image";
    const path:string = uploadHandler(type, file);
    return path;
  };


  const setVideoFile = (videoFile:any) => {
    // アップロード処理
    console.log("ビデオアップロード処理");
    const file = videoFile;
    const type: string = "videos";
    const path: string = uploadHandler(type, file);
    return path;
  }


  const handleSubmit = async (event:any) => {
    event.preventDefault();
    const { title, text, imgFile, videoFile } = event.target.elements;
    console.log(title.value);
    console.log(text.value);
    console.log(imgFile.files[0]);
    console.log(videoFile.files[0]);
    
    let imgFilePath = "";
    let videoFilePath = "";
    if (imgFile.files[0] !== undefined) {
      imgFilePath = setImageFile(imgFile.files[0]);
    };
    if (videoFile.files[0] !== undefined) {
      videoFilePath = setVideoFile(videoFile.files[0]);
    };
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
            <input name="videoFile" type="file"/>
          </div>
          <div>
            <button>登録</button>
          </div>
        </form>
      </div>
      <div>
        {posts.map((post: any) => (
          <div key={post.id}>
            <h1>{post.title}</h1>
            <p>{post.text}</p>
            {post.imgUrl != "" && <img src={post.imgUrl} className="img" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
