import { useState } from 'react';
import './App.css';
const uuid=require('uuid');
function App() {
  
  const [image,setImage]=useState('');
  const [uploadResultMessage,setUploadResultMessage]=useState('Please upload an image');
  const [visitorName, setVisitorName]=useState('dummy.jpg');
  const [isAuth,setAuth]=useState(false);
  //const cors = require("cors");
  
  function sendImage(e){
    e.preventDefault();
    setVisitorName(image.name);
    console.log(image.name);
    const visitorImageName=image.name;
    fetch(`https://xupsvshql3.execute-api.us-east-1.amazonaws.com/prod/visitors646/${visitorImageName}`,{
      
      method: 'PUT',
      headers:{
        'Content-Type':'image/jpg',
        //'ContentDisposition': 'attachment;filename ="' + {visitorImageName} + '"',
      },
      body:image
    }).then(async()=>{
      const response=await authenticate(visitorImageName);
      if(response.Message==='success')
      {
        setAuth(true);
        setUploadResultMessage(`Hi ${response['firstName']} ${response['lastName']}, Welcome to work, Hope you have a productive day Today!!`)
      }
      else{
        setAuth(false);
        setUploadResultMessage('Authentication Failed: This person is not an empployee.')
      }
    }).catch(error =>{
      setAuth(false);
      setUploadResultMessage('There is an error during the authentication process');
      console.error(error);
    })

  }

  async function authenticate(visitorImageName){
    
    const requestUrl='https://xupsvshql3.execute-api.us-east-1.amazonaws.com/prod/employees646?'+new URLSearchParams({
      objectKey: `${visitorImageName}`
    });
    return await fetch(requestUrl,{
      method:'GET',
      headers:{
        'Accept':'application/json',
        'Content-Type':'application/json',
        //'ResponseContentDisposition': 'attachment;filename ="' + {visitorImageName} + '"',
        'Accept-Encoding': '*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36',

      }
    }).then(response=>response.json())
    .then((data)=>{
      return data;
    }).catch(error=>console.error(error));
  }


  return (
    <div className="App">
      <h2>Facial Recognition System</h2>
      <form onSubmit={sendImage}>
        <input type='file' name='image' onChange={e=> setImage(e.target.files[0])}/>
          <button type='submit' >Authenticate</button>
      </form>
      <div className={isAuth?'success':'failure'}>{uploadResultMessage}</div>
      <img src={require(`./visitors/${visitorName}`)} alt="Visitor" height={250} width={250}/>
    </div>
  );
}

export default App;
