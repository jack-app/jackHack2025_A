import { createStorage, StorageEnum } from '../base/index.js';

export const isUsed = createStorage<boolean>('is-used-key', true, {
  storageEnum: StorageEnum.Sync,
  liveUpdate: true, // *1
});
