
import axios from 'axios';

import buildClient from '../api/build-client';


// const LandingPage = ({ color }) => {
//     console.log('I am in the component ...', color);
//     return <h1> Landing Page </h1>;
// }
const LandingPage = ({ currentuser }) => {  // Executed in the browser
    // console.log(currentuser);
    // // axios.get('/api/users/currentuser'); // will work (see the README) secion 11
    // return <h1> Landing Page </h1>;

    return currentuser ? (<h1>You are signed in </h1> ): (<h1>Your are not signed in</h1>)
}



// // Its specific for NextJS
// // If we implemetn it, The nextJS is going to call this function while its attempting to render our App in the Server
// // when nextJS decides to show the component
// // used to fetch some data sepcifically for doing some initialing for our App 

// // If we navigate to another page while we are in the app (this will be executed on the browser not on the server)
// LandingPage.getInitialProps = async ({ req }) => { // Executed on the server
//     // // console.log('Im on the server');

//     // const response = await axios.get('/api/users/currentuser');     // Will get an Error if it's executed on the server (see the README) section 11

//     // // return {color: 'red'};
//     // return response.data;

//     // console.log(req.headers);
//     if( typeof window === 'undefined'){
//         // We are on the server !!
//         // request should be to http://ingress-nginx.ingress-nginx ......
//         const response = await axios.get(
//             'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser', 
//             {
//                 // headers: { // commented to use cookies below
//                 //     Host: 'ticketing.dev'
//                 // }
//                 headers: req.headers
//             }
//         );
//         return response.data ;
//     }
//     else{
//         // we are on the browser (if we go to singup page then navigate to landingpage)
//         // request can be made with base url as regular ''
//         const response = await axios.get('/api/users/currentuser');
//         // auto headers because we are in the browser
//         // { currentUser : null || {id: 'dfdf', email: 'dfdfdf'}}
//         return response.data ;
//     }
// }


// if we made like this in _app it will not be invoked automatically
LandingPage.getInitialProps = async (context) => {
    console.log('LANDING PAGE');
    // Like axios
    const { data } = await buildClient(context).get('/api/users/currentuser');
    return data;
}

export default LandingPage ;