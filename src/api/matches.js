import axiosInstance from './axios';

export const getMatches = async () => {
  const result = await axiosInstance.get('/matches');
  return result.data;
};

export const getEvents = async () => {
  const result = await axiosInstance.get('/events');
  return result.data;
};

export const getEventDetail = async (id) => {
  const result = await axiosInstance.get(`/event/${id}`);
  return result.data;
};

export const buyShare = async (payload) => {
  const result = await axiosInstance.post(`/api/market/buy-share`, payload);
  return result.data;
};

export const sellShare = async (payload) => {
  const result = await axiosInstance.post(`/api/market/sell-share`, payload);
  return result.data;
};

export const getSharePrice = async (payload) => {
  const result = await axiosInstance.get(
    `/api/market/share-price?eventId=${payload.eventId}&type=${payload.type}`
  );
  return result.data;
};

export const getAiBets = async () => {
  const result = await axiosInstance.get(`/api/ai-bets`);
  return result.data;
};

export const getOutcomes = async () => {
  const result = await axiosInstance.get('/events/results');
  return result.data;
};
