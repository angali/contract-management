import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../helpers/alerts';
import { authenticate, isAuth } from '../helpers/auth';
import { BACKEND_API_URL } from '../config';
import Link from 'next/link';
import Router from 'next/router';
import { NextPage } from 'next';
import { IAPIError } from '../models/api';

const Login: NextPage = () => {

    const [state, setState] = useState({
        email: '',
        password: '',
        buttonText: 'Login',
        error: '',
        success: ''
    });
    const {
        email,
        password,
        buttonText,
        error,
        success
    } = state;

  const handleChange = (name : string)  => (e : React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setState({ ...state, [name]: e.target.value, error: '', success: '' });
    }

    useEffect(() => {

        isAuth() && Router.push('/');

    }, []);

    const handleSubmite = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        setState({ ...state, buttonText: 'logging in' })

        try {

            const response = await axios.post(`${BACKEND_API_URL}/login`, { email, password });
            authenticate(response, ()=>{
                isAuth()&&isAuth().role === 'admin'? Router.push('/admin'): Router.push('/user');
            })

        } catch (err) {

            const error : IAPIError  = err as IAPIError;

            setState({ ...state, buttonText: 'Login', error: error.response.data.error, success: '' })
        }

    }

    const loginForm = () => (
        <form onSubmit={handleSubmite}>

            <div className="input-group">
                <input
                    value={email}
                    onChange={handleChange('email')}
                    type="email"
                    className="form-control mb-3"
                    placeholder="Type your email"
                    required
                />
            </div>
            <div className="input-group">
                <input
                    value={password}
                    onChange={handleChange('password')}
                    type="password"
                    className="form-control mb-3"
                    placeholder="Type your password"
                    required
                />
            </div>
            <div className="input-group">
                <button type="submit" className="btn btn-outline-warning" >
                    {buttonText}
                </button>
            </div>

        </form>
    )



    return (
        <Layout>
            <div className="col-md-6 offset-md-3">
                <h1>Login</h1>
                <br />
                {success && showSuccessMessage(success)}
                {error && showErrorMessage(error)}
                {loginForm()}
                <Link href="/auth/password/forgot">
                    <a className="text-danger float-end">Forgot Password? </a>
                </Link>
            </div>
        </Layout>
    );
}

export default Login;