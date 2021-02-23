
import { useState } from 'react';
import axios from 'axios';

import useRequest from '../../hooks/use-request';

import Router from 'next/router';   // To navigate to another page when signed in

export default () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [errors, setErrors] = useState([]);
    const { doRequest, errors } = useRequest({
        url: '/api/users/signup',
        method: 'post',
        body: {
            email, password
        },
        onSuccess: () => Router.push('/')
    });

    const onSubmit = async (event) => {
        event.preventDefault();

        // // console.log(email, password);
        // try{
        //     setErrors([]);
        //     const response = await axios.post('/api/users/signup', {
        //         email, password
        //     });
        //     // console.log(response.data);
        // }
        // catch(error){
        //     // console.log(error.response.data.errors);
        //     setErrors(error.response.data.errors);
        // }
        await doRequest();

        // Router.push('/');
    }

    return <form onSubmit={onSubmit} >
        <h1> Sign Up</h1>
        <div className= "form-group">
            <label> Email Address </label>
            <input value={email} onChange={ e => setEmail(e.target.value)} className="form-control"/> 
        </div>
        <div className= "form-group">
            <label> Password </label>
            <input value={password} onChange={ e => setPassword(e.target.value)} type="password" className="form-control"/> 
        </div>
        {/* {errors.length > 0 && <div className="alert alert-danger">
            <h4> OoOopsss ... </h4>
            <ul className="my-0">
                { errors.map(err => <li key={err.message}>{err.message}</li>) }
            </ul>
        </div>} */}
        {errors}
        <button className="btn btn-primaty"> Sign Up</button>
    </form>;
};