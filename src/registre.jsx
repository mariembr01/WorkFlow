import React,{useState} from 'react';
import axios from 'axios';
import './styleregistre.css';
import { useNavigate } from 'react-router-dom';



export default function Registre() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    //const [confirmPassword, setConfirmPassword] = useState("");
    const [Error, setError] = useState("");
    const [Success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        
        try {
                const response = await axios.post('http://localhost:8000/api/registre', {
                name,
                email,
                password,
            });
            console.log("response:", response.data);
            setSuccess("Registration successful!");
            setLoading(false);
            navigate('/');
          } catch (err) {


    setLoading(false);

    let firstError = "";

    if(err.response?.data?.errors){
        const fieldErrors = err.response.data.errors;

      
        if(fieldErrors.email) {
            firstError = fieldErrors.email[0];
        } else if(fieldErrors.password) {
            firstError = fieldErrors.password[0];
        } else {
           
            const otherField = Object.keys(fieldErrors)[0];
            firstError = fieldErrors[otherField][0];
        }

        setError(firstError); 
    } 
    else if(err.response?.data?.message){
        setError(err.response.data.message);
    } 
    else {
        setError("Serveur inaccessible ou erreur réseau");
    }
}

    };
    return(
            <div className='body-registre'>
                <div className='registre-container'>
                    <h2>Sign Up</h2>
                    <form onSubmit={handleSubmit}>
                        <div className=''>
                            <label htmlFor="name" className='label-registre'>Nom:</label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder='Taper votre nom'
                                    className='input-registre'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)} required
                                />
                            </div>
                            <div className=''>
                                <label htmlFor="email" className='label-registre'>Email:</label>
                                <input
                                    type="email"  
                                    placeholder='Taper votre Email'                                      id="email"
                                    className='input-registre'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} required
                                />
                            </div>
                            <div className=''>
                                <label htmlFor="password" className='label-registre'>Mot de passe:</label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder='Taper votre mot de passe'
                                    className='input-registre'                                        value={password}
                                    onChange={(e) => setPassword(e.target.value)} required
                                />
                            </div>
                            {/*<div className=''>
                                <label htmlFor="confirmPassword">Confirm Password:</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}                                        onChange={(e) => setConfirmPassword(e.target.value)} required
                            />
                            </div>*/}
                            <button type="submit" className='button-signup' disabled={loading}>
                                {loading ? "signing up..":"Sign Up"}
                            </button>
                        </form>
                        {Error && < div className='alert alert-danger' style={{color:"red"}}>{Error}</div>}
                        {Success && < div className='alert alert-success'style={{color:"green"}}>{Success}</div>}
                </div>
            </div>

    )

};