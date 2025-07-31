import { format, isToday, isYesterday, parseISO } from "date-fns";

export const formatTransactionDate = (dateString) => {
  const date = parseISO(dateString);
  
  if (isToday(date)) {
    return "Today";
  }
  
  if (isYesterday(date)) {
    return "Yesterday";
  }
  
  return format(date, "MMM d");
};

export const formatMonthYear = (dateString) => {
  const date = parseISO(dateString);
  return format(date, "MMMM yyyy");
};

export const getCurrentMonth = () => {
  return format(new Date(), "yyyy-MM");
};

export const getCurrentMonthDisplay = () => {
  return format(new Date(), "MMMM yyyy");
};