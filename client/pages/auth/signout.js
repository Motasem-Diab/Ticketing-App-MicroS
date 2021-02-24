
import Router from 'next/router';
import { useEffect } from 'react';
import useRequest from '../../hooks/use-request';

export default () => {
    const { doRequest } = useRequest( {
        url: '/api/users/signout',
        method: 'post',
        body: {},
        onSuccess: () => Router.push('/')
    });

    useEffect(() => {
        doRequest();
    }, []); // The array because we want to run this one time
    return <div> Signing you out ...</div>;
}