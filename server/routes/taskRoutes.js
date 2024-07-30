import express from 'express';
import {
  createSubTask,
  createTask,
  dashboardStatistics,
  deleteRestoreTask,
  duplicateTask,
  getTask,
  getTasks,
  postTaskActivity,
  trashTask,
  updateTask,
  uploadFiles
} from '../controllers/taskController.js';
import { isAdminRoute, protectRoute } from '../middlewares/authMiddlewave.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.post('/create', protectRoute, isAdminRoute, createTask);
router.post('/duplicate/:id', protectRoute, isAdminRoute, duplicateTask);
router.post('/activity/:id', protectRoute, postTaskActivity);
router.post('/upload', upload.array('images', 3), uploadFiles);

router.get('/dashboard', protectRoute, dashboardStatistics);
router.get(
  '/',
  getTasks,
);
router.get('/:id', protectRoute, getTask);

router.put('/create-subtask/:id', createSubTask);
router.put('/update/:id', updateTask);
router.put('/:id', protectRoute, isAdminRoute, trashTask);

router.delete(
  '/delete-restore/:id?',
  protectRoute,
  isAdminRoute,
  deleteRestoreTask,
);

export default router;
