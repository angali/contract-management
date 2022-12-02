import axios from 'axios';
import { BACKEND_API_URL } from '../config';
import { getCookie } from '../helpers/auth';
import { NextPage } from 'next';
import { IAPIError } from '../models/api';

export const withUser = (Page: NextPage) => {

    return (props : any) => {
        if (!props.user) {
            return <h1>Denied</h1> // or redirect, we can use the Router because we are client side here
        }
        return <Page {...props} />
    }
}

withUser.displayName = 'ManageContracts';

const getUserByToken = async (context: any) => {
    const { req, res } = context;
    const token = getCookie('token', { req, res }) || null;
    let user = null;
    if (token) {
        try {
            const response = await axios.get(`${BACKEND_API_URL}/user`, {
                headers: {
                    authorization: `Bearer ${token}`,
                    contentType: 'application/json'
                }
            });

            user = response.data.user;

        }
        catch (err) {

            const error : IAPIError  = err as IAPIError;

            if (error.response.status === 401) {
                user = null;
            }
        }
    }

    return {user, token};
}

// withAuth.js
export function withUserServerSideProps(getServerSidePropsFunc: any, options = {}) {
    return async (context: any) => {
        const {user, token} = await getUserByToken(context);

        if (!user) {
            context.res.writeHead(302, { Location: '/' })
            context.res.end()
        }

        if (getServerSidePropsFunc) {
            return {
                props: {
                    user,
                    token,
                    ...((await getServerSidePropsFunc(context, user, token)).props || {}),
                },
            }
        }

        return {
            props: {
                user,
                token
            },
        }
    }
}

export default withUser;