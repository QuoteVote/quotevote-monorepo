import ActivitiesModel from '../models/ActivityModel';

/**
 * Activity Type Lists
 * 1. POSTED
 * 2. COMMENTED
 * 3. VOTED
 * 4. QUOTED
 */

export const logActivity = async (activityType, ids, content) => {
  const newActivity = {
    activityType,
    ...ids,
    content,
    created: new Date(),
  };
  await new ActivitiesModel(newActivity).save();
  console.log(`Added new activty of type: ${activityType}`);
};
