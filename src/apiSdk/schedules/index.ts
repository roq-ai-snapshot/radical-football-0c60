import axios from 'axios';
import queryString from 'query-string';
import { ScheduleInterface } from 'interfaces/schedule';
import { GetQueryInterface } from '../../interfaces';

export const getSchedules = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/schedules${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createSchedule = async (schedule: ScheduleInterface) => {
  const response = await axios.post('/api/schedules', schedule);
  return response.data;
};

export const updateScheduleById = async (id: string, schedule: ScheduleInterface) => {
  const response = await axios.put(`/api/schedules/${id}`, schedule);
  return response.data;
};

export const getScheduleById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/schedules/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteScheduleById = async (id: string) => {
  const response = await axios.delete(`/api/schedules/${id}`);
  return response.data;
};
