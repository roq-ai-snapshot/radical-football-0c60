import axios from 'axios';
import queryString from 'query-string';
import { PracticePlanInterface } from 'interfaces/practice-plan';
import { GetQueryInterface } from '../../interfaces';

export const getPracticePlans = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/practice-plans${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createPracticePlan = async (practicePlan: PracticePlanInterface) => {
  const response = await axios.post('/api/practice-plans', practicePlan);
  return response.data;
};

export const updatePracticePlanById = async (id: string, practicePlan: PracticePlanInterface) => {
  const response = await axios.put(`/api/practice-plans/${id}`, practicePlan);
  return response.data;
};

export const getPracticePlanById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/practice-plans/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deletePracticePlanById = async (id: string) => {
  const response = await axios.delete(`/api/practice-plans/${id}`);
  return response.data;
};
