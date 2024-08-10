import { useRef, useState } from 'react';
import { sigma_hash_backend } from 'declarations/sigma_hash_backend';
import axios from 'axios';

function App() {
  const [greeting, setGreeting] = useState('');
  const fileInput = useRef(null);
  const [imageWithMetaData, setImageWithMetaData] = useState(null);
  const [uid, setUid] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    let data = new FormData();
    data.append('img', fileInput.current.files[0]);

    await axios.post("http://localhost:8000/", data)
      .then((response) => {
        // Server response contains uid and image_url
        const { image_url, uid } = response.data;

        // Set image and uid
        setImageWithMetaData(image_url);
        setUid(uid);

        // Log the uid
        console.log(uid);

        // Example of using the uid in your backend update logic
        sigma_hash_backend.update({'id': uid}).then((greeting) => {
          setGreeting(greeting);
        });
      })
      .catch(e => console.log(e));

    return false;
  }

  return (
  //   <main style={{ backgroundImage: `url(/wall_e_2.jpg)`, backgroundSize: 'cover', height: '100vh' , position: 'relative'}}>
  //   <img width={500} src="/SigmaHash_logo.png" alt="SigmaHash" />
  //   <form action="#" onSubmit={handleSubmit} style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
  //     <label htmlFor="id">Upload your deepfake image</label>
  //     <input type="file" name="img" accept='image/*' ref={fileInput} />
  //    <button className='button' type="submit" style={{backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '10px 20px', textAlign: 'center', textDecoration: 'none', display: 'inline-block', fontSize: '16px', margin: '4px 2px', cursor: 'pointer', borderRadius: '4px', transition: 'background-color 0.3s ease'}}>Upload</button>
  //     {imageWithMetaData && <img width={500} src={imageWithMetaData} alt="Uploaded" />}
 
  //   </form>
  //   {uid && <p id='greeting'> This is your UID: <br /> <br /> {uid}</p>}
  // {!uid &&  <p id="greeting">
  //   How may we assist you?
  // </p>}
  // </main>
      <main className='professional-main'>
          <h1 className='professional-header-text'>Sigma#A5h</h1>

          <form action="#" onSubmit={handleSubmit} className='professional-form'>
            <label className='professional-label'>Upload your deepfake image</label>
            <input className='professional-input' type="file" name="img" accept='image/*' ref={fileInput} />
            <button className='button' type="submit" style={{backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '10px 20px', textAlign: 'center', textDecoration: 'none', display: 'inline-block', fontSize: '16px', margin: '4px 2px', cursor: 'pointer', borderRadius: '4px', transition: 'background-color 0.3s ease'}}>Upload</button>
            {imageWithMetaData && <img width={500} src={imageWithMetaData} alt="Uploaded" />}
          </form>

          {uid && 
          <p id='greeting'> 
          This is your UID: 
          <br /> 
          <br /> 
          {uid}
          <br />
          <br />
          <img width={200} src="SigmaHash_logo_blue.svg" alt="" srcset="" />

          </p>}
          {!uid &&  <p id="greeting">How may we assist you? </p>}
      </main>
  );
}

export default App;
