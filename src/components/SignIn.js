import React, { useState, useEffect } from 'react';
import supabase from '../database';
import { useHistory } from 'react-router-dom';

function SignIn({ user }) {
  let history = useHistory();

  useEffect(() => {
    //console.log('UseEffect', user);
    if (user) {
      history.push('/');
    }
  });

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    error: null,
  });
  function handleChange(e) {
    if (e.target.id === 'email') {
      setFormData({ ...formData, email: e.target.value, error: null });
    } else if (e.target.id === 'password') {
      setFormData({ ...formData, password: e.target.value, error: null });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(e);
    const { user, session, error } = await supabase.auth.signIn({
      email: formData.email,
      password: formData.password,
    });
    console.log({ user, session, error });
    setFormData({ ...formData, error: error });

    if (!error) {
      history.push('/');
    }
  }

  //const session = supabase.auth.session();
  //const user = supabase.auth.user();
  //console.log({ user, session });
  //console.log(formData);

  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className='text-2xl mt-4'>Sign In</h1>
      <form
        onSubmit={handleSubmit}
        className='mt-4 flex flex-col border bg-white rounded-xl p-6 '
      >
        <label htmlFor='text' className='w-full text-sm text-gray-400'>
          Email
        </label>
        <input
          className='border-gray-200 border rounded p-2 focus:outline-none focus:ring focus:border-blue-300'
          type='text'
          id='email'
          value={formData.email}
          onChange={handleChange}
        ></input>

        <label htmlFor='password' className='mt-4 w-full text-sm text-gray-400'>
          Password
        </label>
        <input
          className='border-gray-200 border rounded p-2 focus:outline-none focus:ring focus:border-blue-300'
          type='password'
          id='password'
          value={formData.password}
          onChange={handleChange}
        ></input>
        <input
          type='submit'
          className='bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded focus:outline-none focus:shadow-outline mt-6'
        />
      </form>
      {formData.error ? formData.error.message : null}
    </div>
  );
}

export default SignIn;
