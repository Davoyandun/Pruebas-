import { logIn, logOut } from "./auth.js";

const logInButton = document.getElementById('logIn');
const logOutButton = document.getElementById('logOut');

 let user;




logInButton.addEventListener('click',async (event) => {   
    try{

       user = await logIn();

    } catch(error){
        throw new Error(error);
    }
}
);  

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log(user.displayName);
        logInButton.style.display = 'none';
        logOutButton.style.display = 'block';
    } else {
        console.log("no user");
        logInButton.style.display = 'block';
        logOutButton.style.display = 'none';
    }
}
);




logOutButton.addEventListener("click", e=>{
    try{
        logOut();
        console.log("logout");
    } catch(error){
        throw new Error(error);
    }
})