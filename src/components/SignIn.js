import React, { useState } from 'react';
import supabase from '../database';

function SignIn() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  function handleChange(e) {
    if (e.target.id === 'email') {
      setFormData({ ...formData, email: e.target.value });
    } else if (e.target.id === 'password') {
      setFormData({ ...formData, password: e.target.value });
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
  }

  const session = supabase.auth.session();
  const user = supabase.auth.user();

  console.log({ user, session });
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
    </div>
  );
}

export default SignIn;
