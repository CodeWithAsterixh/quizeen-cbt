const STORAGE_KEY = 'cbt_manager_device_id';
const NAME_KEY = 'cbt_manager_device_name';

export const getManagerDeviceId = (): string => {
  let id = localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = `mgr_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`;
    localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
};

export const getManagerDeviceName = (): string => {
  return localStorage.getItem(NAME_KEY) || 'Assessment Manager Console';
};

export const setManagerDeviceName = (name: string): void => {
  localStorage.setItem(NAME_KEY, name.trim());
};
