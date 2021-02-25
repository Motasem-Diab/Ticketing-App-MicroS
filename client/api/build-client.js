import axios from 'axios';

// To use it as a new axios (if we are on the server then use the new url) else do the regular
export default ({ req }) => {
    if( typeof window === 'undefined'){
        // On the server
        return axios.create({
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: req.headers
        });
    }
    else{
        // On the browser
        return axios.create({
            baseURL: '/'
        });
    }
}