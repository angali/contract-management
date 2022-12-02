import { useEffect, useState } from 'react';
import { NextPage } from "next";
import axios from 'axios';
import { withRouter } from 'next/router';
import { BACKEND_API_URL } from '../../../config'
import jwt from 'jsonwebtoken';
import Layout from '../../../components/Layout';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts'
import { IAPIError } from '../../../models/api';

interface IProps {
    router: any
}
const ActivateAccount: NextPage<IProps> = ({ router } : any) => {

    const [state, setState] = useState({
        name: '',
        token: '',
        buttonText: 'Activate Account',
        success: '',
        error: ''
    });

    const { name, token, buttonText, success, error } = state;

    useEffect(() => {
        const token = router.query.id;
        if (token) {
            const { name } : any = jwt.decode(token);
            setState({ ...state, name, token });
        }

    }, [router.query.id]);

    const clickSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setState({ ...state, buttonText: 'Activating' });
        try {

            const response = await axios.post(`${BACKEND_API_URL}/register/activate`, { token });
            setState({
                ...state,
                name: '',
                buttonText: 'Activated',
                success: response.data.message,
                error: ''
            })
        } catch (err) {

            const error : IAPIError  = err as IAPIError;

            console.log('activate account error ', error)
            setState({
                ...state,
                buttonText: 'Activate Account',
                error: error.response.data.error || 'Unknown error, please try again!',
                success: ''
            })

        }
    }

    return (
        <Layout>
            <div className="row">
                <div className="col-md-6 offset-md-3 text-center">
                    <h1>Hello {name}, Please activate your account.</h1>
                    <br />
                    {success && showSuccessMessage(success)}
                    {error && showErrorMessage(error)}
                    <button
                        className="btn btn-outline-warning btn-block text-center"
                        onClick={clickSubmit}
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </Layout>
    );
}

export default withRouter(ActivateAccount);