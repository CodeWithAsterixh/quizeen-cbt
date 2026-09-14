const STORAGE_KEY = 'cbt_station_device_id';
const NAME_KEY = 'cbt_station_name';

export const getStationDeviceId = (): string => {
  let id = localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = `station_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`;
    localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
};

export const getStationName = (): string => {
  return localStorage.getItem(NAME_KEY) || `Station ${getStationDeviceId().slice(-4).toUpperCase()}`;
};

export const setStationName = (name: string): void => {
  localStorage.setItem(NAME_KEY, name.trim());
};
