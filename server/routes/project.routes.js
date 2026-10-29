const express = require('express');
const isAuth = require('../middleware/isAuth.js');
const projectCtrl = require('../controllers/project.controller.js');
const deployCtrl = require('../controllers/deploy.controller.js');

const projectRouter = express.Router();

projectRouter.use(isAuth);

projectRouter.get('/', projectCtrl.listProjects);
projectRouter.post('/', projectCtrl.createProject);
projectRouter.get('/:id', projectCtrl.getProject);
projectRouter.put('/:id', projectCtrl.updateProject);
projectRouter.delete('/:id', projectCtrl.deleteProject);

projectRouter.post('/:id/deploy', deployCtrl.deployProject);
projectRouter.post('/:id/unpublish', deployCtrl.unpublishProject);

projectRouter.get('/:id/files', projectCtrl.listFiles);
projectRouter.get('/:id/files/content', projectCtrl.getFile);
projectRouter.put('/:id/files', projectCtrl.saveFile);
projectRouter.delete('/:id/files', projectCtrl.deleteFile);

projectRouter.get('/:id/versions', projectCtrl.listVersions);
projectRouter.post('/:id/versions/:versionId/restore', projectCtrl.restoreVersion);

module.exports = projectRouter;
