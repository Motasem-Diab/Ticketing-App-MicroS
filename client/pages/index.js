
// const LandingPage = ({ color }) => {
//     console.log('I am in the component ...', color);
//     return <h1> Landing Page </h1>;
// }
const LandingPage = ({ color }) => {
    console.log('I am in the component ...', color);
    return <h1> Landing Page </h1>;
}



// Its specific for NextJS
// If we implemetn it, The nextJS is going to call this function while its attempting to render our App in the Server
// when nextJS decides to show the component
// used to fetch some data sepcifically for doing some initialing for our App 
LandingPage.getInitialProps = () => {
    console.log('Im on the server');

    return {color: 'red'};
}

export default LandingPage ;