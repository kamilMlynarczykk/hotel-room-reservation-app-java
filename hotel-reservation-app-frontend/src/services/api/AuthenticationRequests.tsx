import api from './apiAddress';
import { Room } from '../../types/Room';

export const register = async (username: string, password: string)
: Promise<{
    status: number, 
    token: string,
    roles: string[]}> => {
  const response = await api.post('/register', {
    username,
    password,
    roles: ["USER"],
  });
  return {
    status: response.status,
    token: response.data.token,
    roles: response.data.roles
  }
}

export const loginRequest = async (username: string, password: string)
: Promise<{
    status: number,
    id: number, 
    token: string, 
    roles: string[]}> => {
  const response = await api.post('/login', {
    username,
    password,
  });
  return {
    status: response.status,
    id: response.data.id,
    token: response.data.token,
    roles: response.data.roles
  };
};
