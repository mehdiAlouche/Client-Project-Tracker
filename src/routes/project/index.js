import { Router } from 'express';
import { auth } from '#@/middlewares/auth.js';
import { isMemberOrAdmin, checkOwnership } from '#@/middlewares/roles.js';
import * as projectService from '#@/modules/project/services/index.js';

const router = Router();

// Apply auth middleware to all routes
router.use(auth);

// POST /projects - Create a new project
router.post('/', async (req, res) => {
  try {
    const projectData = {
      ...req.body,
      owner: req.user._id
    };

    const project = await projectService.createProject(projectData);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// GET /projects - Get all projects (filtered by role)
router.get('/', async (req, res) => {
  try {
    const userId = req.user._id;
    const isAdmin = req.user.role === 'admin';

    const projects = await projectService.getAllProjects(userId, isAdmin);

    res.json({
      success: true,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET /projects/:id - Get a single project
router.get('/:id', async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.id);

    // Check if user can access this project
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && project.owner._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this project'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    const statusCode = error.message === 'Project not found' ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
});

// PUT /projects/:id - Update a project
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const isAdmin = req.user.role === 'admin';

    const project = await projectService.updateProject(id, req.body, userId, isAdmin);

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (error) {
    const statusCode = error.message === 'Project not found' ? 404 : 
                      error.message.includes('permission') ? 403 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
});

// DELETE /projects/:id - Delete a project
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const isAdmin = req.user.role === 'admin';

    const result = await projectService.deleteProject(id, userId, isAdmin);

    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    const statusCode = error.message === 'Project not found' ? 404 : 
                      error.message.includes('permission') ? 403 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
});

export default router;

