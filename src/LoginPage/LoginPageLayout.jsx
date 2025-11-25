import { useState } from 'react';
import { createAccount, loginToAccount } from '../DatabaseHandler.jsx';
import { Pages } from '../App';
import styles from './LoginPage.module.css';

function LoginPageLayout({ setPage, setUser }) {
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [signingIn, setSigningIn] = useState(false);

    const handleDisplayNameChange = (e) => {
        setDisplayName(e.target.value);
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handlePasswordRepeateChange = (e) => {
        setPasswordRepeat(e.target.value);
    }

    const handleFormSubmit = async () => {
        if (signingIn) {
            let user = await loginToAccount(email, password);
            console.log(user);
            if (user != null) {
                setUser(user);
                setPage(Pages.MAIN);
            } else {
                setEmail('');
                setPassword('');
                setPasswordRepeat('');
                alert('Invalid sign in attempt')
            }
        } else {
            if (password != passwordRepeat) {
                alert('Password don\'t match');
                return;
            }
            let user = await createAccount(displayName, email, password);
            console.log(user);
            if (user != null) {
                setUser(user);
                setPage(Pages.MAIN);
            } else {
                setEmail('');
                setPassword('');
                setPasswordRepeat('');
                alert('Invalid sign up attempt');
            }
        }
    }

    if (signingIn) {
        return(
            <div className={styles['login-form-wrapper']}>
                <form className={styles['login-form']} action={handleFormSubmit}>
                    <h3>Sign In to Quizland</h3>
                    <label htmlFor="email"><span>*</span> Email Address</label>
                    <input key="4" type="text" id="email" value={email} onChange={handleEmailChange} required></input>
                    <label htmlFor="password"><span>*</span>Password</label>
                    <input key="5" type="password" id="password" value={password} onChange={handlePasswordChange} required></input>
                    <div className={styles['login-form-actions']}>
                        <button type="submit" className={styles['login-form-action-button']}>Sign In</button>
                        <button type="button" className={styles['login-form-alternative-button']} onClick={() => setSigningIn(false)}>Create a new account</button>
                    </div>
                </form>
            </div>
        );
    }

    return(
        <div className={styles['login-form-wrapper']}>
            <form className={styles['login-form']} action={handleFormSubmit}>
                <h3>Create a Quizland Account</h3>
                <label htmlFor="display-name"><span>*</span> Display Name</label>
                <input key="0" type="text" id="display-name" value={displayName} onChange={handleDisplayNameChange} required></input>
                <label htmlFor="email"><span>*</span> Email Address</label>
                <input key="1" type="text" id="email" value={email} onChange={handleEmailChange} required></input>
                <label htmlFor="password"><span>*</span> New Password</label>
                <input key="2" type="password" id="password" value={password} onChange={handlePasswordChange} required></input>
                <label htmlFor="password-repeat"><span>*</span> Repeat Password</label>
                <input key="3" type="password" id="password-repeat" value={passwordRepeat} onChange={handlePasswordRepeateChange} required></input>
                <div className={styles['login-form-actions']}>
                    <button type="submit" className={styles['login-form-action-button']}>Sign Up</button>
                    <button type="button" className={styles['login-form-alternative-button']} onClick={() => setSigningIn(true)}>Sign in to an existing account</button>
                </div>
            </form>
        </div>
    );
}

export default LoginPageLayout;