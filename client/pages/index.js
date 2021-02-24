
import axios from 'axios';


// const LandingPage = ({ color }) => {
//     console.log('I am in the component ...', color);
//     return <h1> Landing Page </h1>;
// }
const LandingPage = ({ currentuser }) => {  // Executed in the browser
    console.log(currentuser);
    // axios.get('/api/users/currentuser'); // will work (see the README) secion 11
    return <h1> Landing Page </h1>;
}



// Its specific for NextJS
// If we implemetn it, The nextJS is going to call this function while its attempting to render our App in the Server
// when nextJS decides to show the component
// used to fetch some data sepcifically for doing some initialing for our App 

// If we navigate to another page while we are in the app (this will be executed on the browser not on the server)
LandingPage.getInitialProps = async ({ req }) => { // Executed on the server
    // // console.log('Im on the server');

    // const response = await axios.get('/api/users/currentuser');     // Will get an Error if it's executed on the server (see the README) section 11

    // // return {color: 'red'};
    // return response.data;

    // console.log(req.headers);
    if( typeof window === 'undefined'){
        // We are on the server !!
        // request should be to http://ingress-nginx.ingress-nginx ......
        const response = await axios.get(
            'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser', 
            {
                // headers: { // commented to use cookies below
                //     Host: 'ticketing.dev'
                // }
                headers: req.headers
            }
        );
        return response.data ;
    }
    else{
        // we are on the browser (if we go to singup page then navigate to landingpage)
        // request can be made with base url as regular ''
        const response = await axios.get('/api/users/currentuser');
        // auto headers because we are in the browser
        // { currentUser : null || {id: 'dfdf', email: 'dfdfdf'}}
        return response.data ;
    }
}

export default LandingPage ;