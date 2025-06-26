import React, { useState } from 'react';
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

const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
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
              Sign in
            </Typography>
            {error && (
              <Alert severity="error" sx={{ width: '100%' }}>
                {error}
              </Alert>
            )}
            <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Box>
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoginForm;
