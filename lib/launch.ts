const LAUNCH_DATE = "2026-09-24";
const LAUNCH_TIME_ZONE = "Africa/Cairo";

export type LaunchStatus =
  | "prelaunch"
  | "launch-day"
  | "live";

function getEgyptDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: LAUNCH_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function getLaunchStatus(
  date = new Date()
): LaunchStatus {
  const today = getEgyptDate(date);

  if (today < LAUNCH_DATE) {
    return "prelaunch";
  }

  if (today === LAUNCH_DATE) {
    return "launch-day";
  }

  return "live";
}

export function isPreLaunch(
  date = new Date()
) {
  return getLaunchStatus(date) === "prelaunch";
}

export function isLaunchDay(
  date = new Date()
) {
  return getLaunchStatus(date) === "launch-day";
}

export function isLive(
  date = new Date()
) {
  return getLaunchStatus(date) === "live";
}

export { LAUNCH_DATE };