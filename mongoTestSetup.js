date = Date();

db = db.getSiblingDB('productSyncJobData');
db.apiUsers.insert({initialized: date});