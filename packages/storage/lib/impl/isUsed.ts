import { createStorage, StorageEnum } from '../base/index.js';

export const isUsedStorage = createStorage<boolean>('is-used-key', true, {
  storageEnum: StorageEnum.Sync,
  liveUpdate: true, // *1
});
