import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    // on server
    return axios.create({
      baseURL:
        //  local
        // 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',

        // cloud
        'http://www.ticketing-art.art/',
      headers: req.headers,
    });
  } else {
    // we must be on the browser
    return axios.create({
      baseURL: '/',
    });
  }
};
