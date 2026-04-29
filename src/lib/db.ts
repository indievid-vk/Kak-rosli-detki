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

export const exportData = async () => {
  const db = await initDB();
  const children = await db.getAll('children');
  const records = await db.getAll('records');
  
  // Start building the JSON manually to avoid large string allocation
  const chunks: any[] = [];
  chunks.push('{"children":');
  chunks.push(JSON.stringify(children));
  chunks.push(',"records":');
  chunks.push(JSON.stringify(records));
  chunks.push(',"media":[');

  const tx = db.transaction('media', 'readonly');
  const mediaStore = tx.objectStore('media');
  let cursor = await mediaStore.openCursor();
  
  let first = true;
  while (cursor) {
    if (!first) chunks.push(',');
    chunks.push(JSON.stringify({ key: cursor.key, value: cursor.value }));
    first = false;
    cursor = await cursor.continue();
  }

  chunks.push(']}');

  const blob = new Blob(chunks, { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kids_diary_backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importData = async (file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        // Check if text is extremely large (e.g., > 300MB)
        if (text.length > 300 * 1024 * 1024) {
          console.warn('Very large backup file detected. Import might be slow or unstable.');
        }

        const data = JSON.parse(text);
        if (!data || !Array.isArray(data.children) || !Array.isArray(data.records) || !Array.isArray(data.media)) {
          throw new Error('Invalid file format');
        }
        
        const db = await initDB();
        
        // Use separate transactions if needed to avoid long-running locks
        const tx = db.transaction(['children', 'records', 'media'], 'readwrite');
        
        for (const child of data.children) {
          tx.objectStore('children').put(child);
        }
        for (const record of data.records) {
          tx.objectStore('records').put(record);
        }
        for (const item of data.media) {
          tx.objectStore('media').put(item.value, item.key);
        }
        
        await tx.done;
        resolve();
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
