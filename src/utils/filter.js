import {FilterType} from "../const";
import {isEventPast, isEventFuture} from "./event";

export const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events.filter((event) => isEventFuture(event.date.start)),
  [FilterType.PAST]: (events) => events.filter((event) => isEventPast(event.date.start)),
};
