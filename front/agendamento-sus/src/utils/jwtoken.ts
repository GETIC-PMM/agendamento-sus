import jwt from 'jsonwebtoken';
import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'access_token';

// Generate JWT token with a secret key
export function generateAccessToken(payload: string) {
  return jwt.sign(payload, 'mysecretkey');
}

// Save the JWT token to a cookie
export function saveAccessToken(token: string) {
  Cookies.set(ACCESS_TOKEN_KEY, token, { expires: 7 });
}

// Get the JWT token from a cookie
export function getAccessToken() {
  return Cookies.get(ACCESS_TOKEN_KEY);
}

// Remove the JWT token from a cookie
export function removeAccessToken() {
  Cookies.remove(ACCESS_TOKEN_KEY);
}

// Decode the JWT token
export function decodeAccessToken(token: string) {
  return jwt.decode(token);
}

// Check if the user is authenticated
// export function isAuthenticated() {
// 	const token = getAccessToken();
// 	if (token) {
// 		const exp  = decodeAccessToken(token);
// 		if (exp && Date.now() <= exp * 1000) {
// 			return true;
// 		}
// 	}
// 	return false;
// }
