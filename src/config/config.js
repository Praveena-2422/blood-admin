const environment = process.env.REACT_APP_ENV || 'development';

const config = {
  development: {
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000/api/admin',
    imageBaseUrl: process.env.REACT_APP_IMAGE_URL || 'http://localhost:3000/api/public',
    debug: true
  },
  production: {
    apiUrl: process.env.REACT_APP_API_URL || 'https://blood-backend-lf52.onrender.com/api/admin',
    imageBaseUrl: process.env.REACT_APP_IMAGE_URL || 'https://blood-backend-lf52.onrender.com/api/public',
    debug: false
  }
};

export default config[environment];

// Log config for debugging
if (config[environment].debug) {
  console.log('Environment:', environment);
  console.log('Config:', config[environment]);
}