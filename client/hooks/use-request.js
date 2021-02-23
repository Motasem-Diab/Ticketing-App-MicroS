
import { useState } from 'react';
import axios from 'axios';


export default ({ url, method, body, onSuccess}) => {
    const [errors, setErrors] = useState(null);

    const doRequest = async () => {
        try{
            setErrors(null);
            const response = await axios[method](url, body);

            if(onSuccess){      // Alternative for throw Error
                onSuccess(response.data);
            }

            return response.data ;
        }
        catch(err){
            setErrors(
                <div className="alert alert-danger">
                <h4> OoOopsss ... </h4>
                <ul className="my-0">
                    { err.response.data.errors.map(err => <li key={err.message}>{err.message}</li>) }
                </ul>
                </div>
            )

            // You can throw the error here so you will not be navigated to the signned in page if you got any error
        }
    };

    return {doRequest, errors};
};