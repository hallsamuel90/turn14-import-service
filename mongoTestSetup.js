date = Date();

db = db.getSiblingDB('pmgmt');
db.apiUsers.insert({ initialized: date });
db.productSyncJobData.insert({ initialized: date });
db.productSyncQueue.insert({ initialized: date });
