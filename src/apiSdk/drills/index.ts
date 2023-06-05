import axios from 'axios';
import queryString from 'query-string';
import { DrillInterface } from 'interfaces/drill';
import { GetQueryInterface } from '../../interfaces';

export const getDrills = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/drills${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createDrill = async (drill: DrillInterface) => {
  const response = await axios.post('/api/drills', drill);
  return response.data;
};

export const updateDrillById = async (id: string, drill: DrillInterface) => {
  const response = await axios.put(`/api/drills/${id}`, drill);
  return response.data;
};

export const getDrillById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/drills/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteDrillById = async (id: string) => {
  const response = await axios.delete(`/api/drills/${id}`);
  return response.data;
};
