import { AppEvents } from '../tracker/tracking-event.model';
import { EventBus } from './pub-sub';

export const todoEventBus = new EventBus<AppEvents>('Todo');
