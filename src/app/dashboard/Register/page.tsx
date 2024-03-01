'use client'

import React, { useState, ChangeEvent, FormEvent } from 'react';

const Register: React.FC = () => {
    const [fullName, setFullName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [photoData, setPhotoData] = useState<File | null>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('fullName', fullName);
        formData.append('email', email);
        formData.append('password', password);
        if (photoData) {
            formData.append('photo', photoData);
        }

        try {
            const response = await fetch('http://localhost:3000/api', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                console.log('Registration successful');
                setFullName('');
                setEmail('');
                setPassword('');
                setPhotoData(null);
            } else {
                console.error('Registration failed');
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }
    };

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setPhotoData(file);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="fullName">Full Name:</label>
                    <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="photo">Photo:</label>
                    <input type="file" id="photo" accept="image/*" onChange={handleImageChange} />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Register;
