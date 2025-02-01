import { Meteor } from 'meteor/meteor';
import { TasksCollection } from '../imports/db/TasksCollection';
import { Accounts } from 'meteor/accounts-base';
import '/imports/api/tasksMethods';
import '/imports/api/tasksPublications';

const SEED_USERNAME = 'meteorite';
const SEED_PASSWORD = 'password';

Meteor.startup(async () => {
  // Seed user
  const existingUser = await Accounts.findUserByUsername(SEED_USERNAME);
  if (!existingUser) {
    console.log('Creating a default user account');
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }

  const user = await Accounts.findUserByUsername(SEED_USERNAME);

  if (!user) {
    // Short-circuit for test runs
    return;
  }

  // Seed tasks
  const tasks = await TasksCollection.find().countAsync();
  
  if (tasks === 0) {
    const tasksToInsert = [
      'First Task',
      'Second Task',
      'Third Task',
    ].map(text => ({ text, userId: user._id, createdAt: new Date() }));

    for (const task of tasksToInsert) {
      await TasksCollection.insertAsync(task);
    }
  }
});