// achievementQueue.js

export const unlockedDuringSession = new Set();

export function queueAchievement(id) {
  unlockedDuringSession.add(id);
}

export function getQueuedAchievements() {
  return Array.from(unlockedDuringSession);
}

export function clearQueue() {
  unlockedDuringSession.clear();
}
