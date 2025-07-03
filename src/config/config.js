const environment = process.env.REACT_APP_ENV || 'development';

const config = {
  development: {
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:4000/api/',
    imageBaseUrl: process.env.REACT_APP_IMAGE_URL || 'http://localhost:4000/api/',
    debug: true
  },
  production: {
    apiUrl: process.env.REACT_APP_API_URL || 'https://blood-backend-lf52.onrender.com/api/',
    imageBaseUrl: process.env.REACT_APP_IMAGE_URL || 'https://blood-backend-lf52.onrender.com/api/',
    debug: false
  }
};

export default config[environment];

// Log config for debugging
if (config[environment].debug) {
  console.log('Environment:', environment);
  console.log('Config:', config[environment]);
}