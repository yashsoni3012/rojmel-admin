import { storage } from './storage.js';

const KEY = 'entries-v1';
const read = () => storage.get(KEY, []);

// Same async shape a REST API would have, so switching to a backend is a drop-in change.
export const transactionService = {
  async list() { return read(); },
  async save(entry) {
    const all = read();
    if (entry.id) { storage.set(KEY, all.map((x) => (x.id === entry.id ? entry : x))); return entry; }
    const created = { ...entry, id: crypto.randomUUID() };
    storage.set(KEY, [created, ...all]);
    return created;
  },
  async remove(id) { storage.set(KEY, read().filter((x) => x.id !== id)); },
};
