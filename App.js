import React, { useState, useEffect } from 'react';
//import logo from './logo.svg';
import './App.css';
import Post from './Post';
import { db,auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import { Button,input } from '@material-ui/core';
import  Modal  from '@material-ui/core/Modal';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

 function getModalStyle() {
  const top = 50 ;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes=useStyles();
  const[modalStyle]=useState(getModalStyle);
  const [posts,setPosts]=useState([]);
  const [open,setOpen]=useState(false);
  const [openSignIn,setOpenSignIn]=useState(false);
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
  const [email,setEmail]=useState('');
  const[user,setUser]=useState(null);
  useEffect( ()=>{

    const unsubscribe=auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        //user has logged in
        console.log(authUser);
        setUser(authUser);
       } else
      {
        //user has logged out
        setUser(null);
      }
    })

    return ()=>{
      //perform some clean up action
      unsubscribe();
    }
  },[user,username]);
  //useEffect runs a piece of code based on a specific condition
   useEffect( ()=>{
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot=>{
    //every time a new post added ,this code fires
    setPosts(snapshot.docs.map(doc=>({
      id:doc.id,
      post:doc.data()
    })));
    })
   },[]);  /*every time we put something in the third bracket it loads like if we put posts variable it load every time when a new post load
            black means this code run all at once*/

   const signUp=(event)=>{
       event.preventDefault();

       auth.createUserWithEmailAndPassword(email,password)
       .then((authUser)=>   {
          return authUser.user.updateProfile({
           displayName:username 
          })
       })
       .catch((error)=>alert(error.message));
       setOpen(false);
   }
   
   const signIn=(event)=>{
    event.preventDefault();
    auth.signInWithEmailAndPassword(email,password)
    .catch((error)=>alert(error.message));
    setOpenSignIn(false);
   }
   

  return (
    <div className="app">
      
      <Modal  
        open={open}
        onClose={()=>setOpen(false)} >
           
           <div style={modalStyle} className={classes.paper}>
           <form className="app_signup">
           <center>
          <img className="app_headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt=""/>
          </center>
         <input placeholder="username" type="text" value={username} onChange={(e)=>setUsername(e.target.value)}/>

        <input placeholder="email" type="text" value={email} onChange={(e)=>setEmail(e.target.value)}/>
        <input placeholder="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
        <Button type="submit" onClick={signUp}>SignUp</Button>
        </form>
       
           </div>
       </Modal>

       <Modal  
        open={openSignIn}
        onClose={()=>setOpenSignIn(false)} >
           
           <div style={modalStyle} className={classes.paper}>
           <form className="app_signup">
           <center>
       <img className="app_headerImage"
       src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt=""/>
          </center>
        <input placeholder="email" type="text" value={email} onChange={(e)=>setEmail(e.target.value)}/>
        <input placeholder="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
        <Button type="submit" onClick={signIn}>SignIn</Button>
        </form>
       
           </div>
       </Modal>


      <div className="app_header">

        
      <img className="app_headerImage"
      src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
      alt=""
       />
      {user?(
        <Button onClick={()=>auth.signOut()}>Logout</Button>  
        ): (
         <div className="app_loginContainer"> 
            <Button onClick={()=>setOpenSignIn(true)}>SignIn</Button>
            <Button onClick={()=>setOpen(true)}>SignUp</Button>
         </div>
        
          ) }

      </div>
      

      <div className="app_posts">
        <div className="app_postsLeft">
          {
      posts.map(({id,post}) => (
        <Post key={id} postId={id} user={user}username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
      ))
      }
      </div >
      <div className="app_postsRight">
      <InstagramEmbed

       url='https://instagr.am/p/Zw9o4/'
       maxWidth={320}
       hideCaption={false}
       containerTagName='div'
       protocol=''
       injectScript
       onLoading={() => {}}
       onSuccess={() => {}}
       onAfterRender={() => {}}
       onFailure={() => {}}
      
      
      />

      </div>
      </div>

        {user?.displayName?(
        <ImageUpload username={user.displayName}/>
      ): (
       <h3>Sorry you need to login for Upload</h3>
      )}
      
     

    </div>
  );
}

export default App;
