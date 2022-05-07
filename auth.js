const  auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
auth.languageCode = 'es';
export  async function logIn() {
    try{
        const response = await auth.signInWithPopup(provider);
        return response.user;

    }
    catch(error){
        throw new Error(error);
    }
}

export async function logOut() {
    try{
        await auth.signOut();
    }
    catch(error){
        throw new Error(error);
    }
}

