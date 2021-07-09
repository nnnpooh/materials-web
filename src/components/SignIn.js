import React, { useState } from 'react';
import supabase from '../database';
import { Link, useHistory } from 'react-router-dom';

function SignIn() {
  let history = useHistory();
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

  const session = supabase.auth.session();
  const user = supabase.auth.user();

  console.log({ user, session });
  //console.log(formData);
  return (
    <div>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          id='email'
          value={formData.email}
          onChange={handleChange}
        ></input>
        <input
          type='password'
          id='password'
          value={formData.password}
          onChange={handleChange}
        ></input>
        <input type='submit' />
      </form>
      {formData.error ? formData.error.message : null}
    </div>
  );
}

export default SignIn;
