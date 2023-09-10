export const apiBaseUrl = 'http://localhost:3002';

export const webAppURL = 'https://zistapp.xyz';

export const gistsEndPoint = 'https://api.github.com';

export const GITHUB_AUTH_PROVIDER_ID = 'github';
export const SCOPES = ['user:email', 'gist'];

export const constKeys = {
  getUser: 'GET_USER',
  setUser: 'SET_USER',
  onAuthenticate: 'ON_AUTHENTICATE',
  onInfo: 'ON_INFO',
  onError: 'ON_ERROR',
  openURL: 'OPEN_URL',
  authenticated: 'AUTHENTICATED',
  unAuthenticate: 'UN_AUTHENTICATE',
};

export const constType = {
  userName: 'USER_NAME',
  token: 'TOKEN',

};

export const COMMANDS = {
  // TODO: create an constants file for all the command so that new commands 
  // when added will be adde here and in package.json
};