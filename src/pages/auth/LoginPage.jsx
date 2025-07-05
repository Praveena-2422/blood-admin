import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Link,
  Container,
  Grid,
  Typography,
  Alert
} from '@mui/material';
import { apiClient } from '../../network/apiClient';
import { toast, ToastContainer } from 'react-toastify';

const LoginForm = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Check for existing admin token and redirect to dashboard if found
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      navigate('/dashboard', { replace: true });
    }
  }, []);

  const handleLogin = async () => {
    // e.preventDefault();
    setLoading(true);

    try {
      if (!phone || !password) {
        toast.error('Please fill all fields');
        return;
      }

      console.log(phone,password,"aaaaaaaaaa");
      

      const response = await apiClient.post('user/adminLogin', { phone, password });
      const data = await response.data;
      console.log(data,"data");

      if (data.success) { 
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminInfo', JSON.stringify(data.admin));
        window.location.href = '/dashboard';
        // navigate('/dashboard');
        toast.success('Admin login successful');
      } else {
        toast.error(data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        toast.error(err.response.data.message || 'Login failed');
      } else {
        toast.error('Network error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#c4151c'
      }}
    >
      <Grid container sx={{ maxWidth: 1000, boxShadow: 3, borderRadius: 2 }}>
        {/* Left Side - Image */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              height: '100%',
              minHeight: 500,
              backgroundImage: 'url(public/assets/images/auth/loginimg.jpg)',
              backgroundSize: 'cover',
              backgroundColor: '#c4151c',
              backgroundPosition: 'center',
              borderTopLeftRadius: 8,
              borderBottomLeftRadius: 8,
              display: { xs: 'none', md: 'block' }
            }}
          />
        </Grid>

        {/* Right Side - Login Form */}
        <Grid item xs={12} md={6}>
          <Container
            component="main"
            maxWidth="xs"
            sx={{
              py: 8,
              px: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              backgroundColor: '#fff',
              borderRadius: 2,
              borderTopRightRadius: 8,
              borderBottomRightRadius: 8,
              boxShadow: 3
            }}
          >
            <Typography component="h1" variant="h5">
              Admin Login
            </Typography>
            {/* <form onSubmit={handleLogin}> */}
              <TextField
                margin="normal"
                required
                fullWidth
                id="phone"
                label="Mobile Number"
                name="phone"
                autoComplete="username"
                autoFocus
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
                onClick={handleLogin}
              >
                {loading ? 'Signing in...' : 'Login'}
              </Button>
            {/* </form> */}
          </Container>
        </Grid>
      </Grid>
      <ToastContainer />
    </Box>
  );
};

export default LoginForm;
