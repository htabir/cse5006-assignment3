// Assignment §5: the four required capsule routes, called from the React app.
import { api } from '@/lib/api';
import type { Capsule, CapsuleInput, CapsuleStats } from '@/types/capsule';

export function listCapsules(queryString = '') {
  return api<Capsule[]>(`/api/capsules${queryString}`);
}

export function getCapsuleStats() {
  return api<CapsuleStats>('/api/capsules/stats');
}

export function createCapsule(input: CapsuleInput) {
  return api<Capsule>('/api/capsules', { method: 'POST', body: JSON.stringify(input) });
}

export function updateCapsule(id: number, input: CapsuleInput) {
  return api<Capsule>(`/api/capsules/${id}`, { method: 'PUT', body: JSON.stringify(input) });
}

export function deleteCapsule(id: number) {
  return api<void>(`/api/capsules/${id}`, { method: 'DELETE' });
}
