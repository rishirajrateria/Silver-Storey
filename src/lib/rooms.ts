/** Room types used to tag gallery images so visitors can filter a project. */
export const ROOM_TYPES = [
  { key: 'living-room', label: 'Living room' },
  { key: 'kitchen', label: 'Kitchen' },
  { key: 'bedroom', label: 'Bedroom' },
  { key: 'bathroom', label: 'Bathroom' },
  { key: 'dining', label: 'Dining' },
  { key: 'office', label: 'Office' },
  { key: 'kids', label: 'Kids room' },
  { key: 'balcony', label: 'Balcony & outdoor' },
  { key: 'other', label: 'Other' },
] as const;

export type RoomTypeKey = (typeof ROOM_TYPES)[number]['key'];

export function roomLabel(key: string | undefined | null): string | undefined {
  return ROOM_TYPES.find((r) => r.key === key)?.label;
}

export function isRoomType(value: unknown): value is RoomTypeKey {
  return typeof value === 'string' && ROOM_TYPES.some((r) => r.key === value);
}
