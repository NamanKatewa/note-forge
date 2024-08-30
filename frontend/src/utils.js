import {
  format,
  isToday,
  isTomorrow,
  differenceInMinutes,
  parseISO,
} from "date-fns";

export const apiRoute = "https://note-forge.onrender.com";

export const formatDeadline = (isoDate) => {
  const date = new Date(isoDate);
  const now = new Date();

  const diffInMinutes = differenceInMinutes(date, now);

  if (diffInMinutes < 0) {
    return `Was Due ${format(date, "h:mm a, MMM d, yyyy")}`;
  }

  if (isToday(date)) {
    return `Due Today at ${format(date, "h:mm a")}`;
  }

  if (isTomorrow(date)) {
    return `Due Tomorrow at ${format(date, "h:mm a")}`;
  }

  return `Due ${format(date, "h:mm a, MMM d, yyyy")}`;
};

export const formatDateTime = (isoString) => {
  const date = parseISO(isoString);
  const formattedDate = format(date, "yyy-MM-dd");
  const formattedTime = format(date, "HH:mm");

  return { formattedDate, formattedTime };
};
