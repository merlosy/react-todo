export type Syncable<T> = T & {
  /** When it has been created on the client side */
  createdAt: Date;
  /** When it has been updated on the client side */
  updatedAt?: Date;
  /** When it has been deleted on the client side */
  deletedAt?: Date;
  /** Whether it is synced with the backend */
  isSynced: boolean;
};
