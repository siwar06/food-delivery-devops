import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'https://foodie.test:30443',
  realm: 'fdp',
  clientId: 'fdp-frontend',
});

export default keycloak;
