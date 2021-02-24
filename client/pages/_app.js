
import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';

import Header from '../components/header';

// // Commented to make a new one with header (of each page) that shows singin,out, blabla
// const AppComponent = ({ Component, pageProps }) => {
//     // The component is any this returned to show in any page
//     return (
//         <div>
//             <h1> Header </h1>
//             <Component {...pageProps}/>  
//         </div>
//     ); 
// };
const AppComponent = ({ Component, pageProps, currentuser }) => {
    // The component is any this returned to show in any page
    return (
        <div>
            {/* <h1> Header {currentuser.email}</h1> */}
            <Header currentuser={currentuser}/>
            <Component {...pageProps}/>  {/*  pass pageProps to all components*/}
        </div>
    ); 
};

// To fetch some data for consider what to show in the header of the page
AppComponent.getInitialProps = async (appContext) => {

    // console.log(Object.keys(appContext));
    const { data } = await buildClient(appContext.ctx).get('/api/users/currentuser');
    // console.log(data);

    // When we implemented this method the landing page one will not be invoked automatically, so we will do it here
    let pageProps = {};
    if(appContext.Component.getInitialProps){
        pageProps = await appContext.Component.getInitialProps(appContext.ctx);
        console.log(pageProps);
    }
    

    return {
        pageProps,
        currentuser: data.currentuser // or ...data
    };
}

export default AppComponent ;