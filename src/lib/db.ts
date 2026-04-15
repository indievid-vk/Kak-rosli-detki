import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface BabyAppDB extends DBSchema {
  media: {
    key: string;
    value: string;
  };
  children: {
    key: string;
    value: any;
  };
  records: {
    key: string;
    value: any;
  };
}

let dbPromise: Promise<IDBPDatabase<BabyAppDB>>;

export const initDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<BabyAppDB>('BabyAppMedia', 2, {
      upgrade(db, oldVersion, newVersion, transaction) {
        if (oldVersion < 1) {
          db.createObjectStore('media');
        }
        if (oldVersion < 2) {
          if (!db.objectStoreNames.contains('children')) {
            db.createObjectStore('children', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('records')) {
            db.createObjectStore('records', { keyPath: 'id' });
          }
        }
      },
    });
  }
  return dbPromise;
};

export const saveMediaLocally = async (id: string, data: string): Promise<void> => {
  const db = await initDB();
  await db.put('media', data, id);
};

export const getMediaLocally = async (id: string): Promise<string | null> => {
  const db = await initDB();
  const val = await db.get('media', id);
  return val || null;
};

export const deleteMediaLocally = async (id: string): Promise<void> => {
  const db = await initDB();
  await db.delete('media', id);
};

export const getChildrenLocally = async () => {
  const db = await initDB();
  return db.getAll('children');
};

export const saveChildLocally = async (child: any) => {
  const db = await initDB();
  await db.put('children', child);
};

export const deleteChildLocally = async (id: string) => {
  const db = await initDB();
  await db.delete('children', id);
};

export const getRecordsLocally = async () => {
  const db = await initDB();
  return db.getAll('records');
};

export const saveRecordLocally = async (record: any) => {
  const db = await initDB();
  await db.put('records', record);
};

export const deleteRecordLocally = async (id: string) => {
  const db = await initDB();
  await db.delete('records', id);
};
