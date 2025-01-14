export function dateToSeconds(date: Date) {
  return Math.floor(date.getTime() / 1000);
}

// async load image
export async function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.onload = () => resolve(image);
    image.onerror = reject;
  });
}

export function getRandomHexColor(): string {
  const hex = Math.floor(Math.random() * 0xffffff).toString(16);
  return `#${hex.padStart(6, "0")}`;
}

export function dateToReadableTime(date: Date): string {
  let hours = date.getHours(); // Get the hour in 24-hour format
  const minutes = date.getMinutes(); // Get the minutes
  const amPm = hours >= 12 ? "pm" : "am"; // Determine am/pm

  // Convert to 12-hour format
  hours = hours % 12 || 12; // Adjust for 12-hour clock, handling midnight (0)

  // Format hours and minutes with leading zeroes if needed
  const formattedHours = hours.toString();
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes} ${amPm}`;
}

export function secondsToReadableTime(seconds: number): string {
  const timezoneOffset = (new Date()).getTimezoneOffset();
  const date = new Date((seconds + timezoneOffset * 60) * 1000); // Convert seconds to milliseconds

  return dateToReadableTime(date);
}
