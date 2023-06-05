import axios from 'axios';
import queryString from 'query-string';
import { PlayerProgressInterface } from 'interfaces/player-progress';
import { GetQueryInterface } from '../../interfaces';

export const getPlayerProgresses = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/player-progresses${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createPlayerProgress = async (playerProgress: PlayerProgressInterface) => {
  const response = await axios.post('/api/player-progresses', playerProgress);
  return response.data;
};

export const updatePlayerProgressById = async (id: string, playerProgress: PlayerProgressInterface) => {
  const response = await axios.put(`/api/player-progresses/${id}`, playerProgress);
  return response.data;
};

export const getPlayerProgressById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/player-progresses/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deletePlayerProgressById = async (id: string) => {
  const response = await axios.delete(`/api/player-progresses/${id}`);
  return response.data;
};
