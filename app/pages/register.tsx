import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../helpers/alerts'
import { isAuth } from '../helpers/auth';
import Router from 'next/router';
import { BACKEND_API_URL } from '../config'
import Link from 'next/link';
import { NextPage } from 'next';
import { IAPIError } from '../models/api';

const Register:NextPage = () => {
    const [state, setState] = useState({
        name: '',
        email: '',
        password: '',
        buttonText: 'Register',
        error: '',
        success: ''
    });
    const {
        name,
        email,
        password,
        buttonText,
        error,
        success
    } = state;


    useEffect(() => {

        isAuth() && Router.push('/');

    }, []);



    const handleChange = (name : string) => (e:  React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setState({ ...state, [name]: e.target.value, error: '', success: '' });
    }

    const handleSubmite = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        setState({ ...state, buttonText: 'Registering' })

        try {

            const response = await axios.post(`${BACKEND_API_URL}/register`, { name, email, password });
            setState({
                name: '',
                email: '',
                password: '',
                buttonText: 'Submitted',
                success: response.data.message,
                error: ''
            })

        } catch (err) {
            const error : IAPIError  = err as IAPIError;

            setState({ ...state, buttonText: 'Register', error: error.response.data.error, success: '' })
        }

    }

    const registerForm = () => (
        <form onSubmit={handleSubmite}>

            <div className="input-group">
                <input
                    value={name}
                    onChange={handleChange('name')}
                    type="text"
                    className="form-control mb-3"
                    placeholder="Type your name"
                    required
                />
            </div>
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
                <h1>Register</h1>
                <br />
                {success && showSuccessMessage(success)}
                {error && showErrorMessage(error)}
                {registerForm()}
                <Link href="/auth/password/forgot">
                    <a className="text-danger float-end">Forgot Password? </a>
                </Link>

            </div>
        </Layout>
    );
}

export default Register;