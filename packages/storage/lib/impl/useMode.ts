import { createStorage, StorageEnum } from '../base/index.js';

// 0, 1, 2 のいずれかを扱うユニオン型
export type UseMode = 0 | 1 | 2;

// ストレージキーを 'use-mode' に変更し、初期値を 0 に
export const useModeStorage = createStorage<UseMode>('use-mode-key', 0, {
  storageEnum: StorageEnum.Sync,
  liveUpdate: true,
});
