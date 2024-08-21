const formatRelativeTime = (timestamp) => {
  const now = new Date();
  const then = new Date(timestamp);
  const seconds = Math.floor((now - then) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30); // Approximate month length
  const years = Math.floor(days / 365); // Approximate year length

  if (years > 0) {
    return `${years} ${years === 1 ? "yr" : "yrs"} ago`;
  } else if (months > 0) {
    return `${months} ${months === 1 ? "mth" : "mths"}`;
  } else if (days > 0) {
    return `${days} ${days === 1 ? "d" : "dys"} `;
  } else if (hours > 0) {
    return `${hours} ${hours === 1 ? "hrs" : "hrs"} `;
  } else if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? "min" : "min"} `;
  } else if (seconds > 0) {
    return `${seconds} ${seconds === 1 ? "sec" : "sec"} `;
  } else {
    return "Just now";
  }
};

const formatDate = (timestamp) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const date = new Date(timestamp);
  const month = months[date.getMonth()];
  const year = date.getFullYear().toString().slice(2);

  return `${month} ${year}`;
};

export { formatDate, formatRelativeTime };

export function extractTime(dateString) {
  const date = new Date(dateString);

  const hours = padZero(date.getHours());

  const minutes = padZero(date.getMinutes());

  return `${hours}:${minutes}`;
}

function padZero(number) {
  // Converting the number to a string and padding it to ensure it has at least 2 characters
  return number.toString().padStart(2, "0");
}
