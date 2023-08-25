import { Syncable } from '../util/syncable.model';

interface BaseTodo {
  id: string;
  text: string;
  description?: string;
  link?: string;
  bgColor?: string;
  /** List of todo ids that will be unblocked when this tod is done */
  todoBefore: string[];
}

export type Todo = Syncable<BaseTodo>;
