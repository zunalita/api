import routesList from '../api-map.json'; // adjust path if needed

export default function handler(req, res) {
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const baseUrl = `${protocol}://${req.headers.host}/api`;

  const routes = {};
  routesList.forEach(name => {
    routes[`${name}_url`] = `${baseUrl}/${name}{?params}`;
  });

  res.status(200).json({
    message: 'Welcome to Zunalita API',
    documentation_url: `${baseUrl}/docs`,
    ...routes
  });
}
