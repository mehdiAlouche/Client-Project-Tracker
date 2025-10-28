import { Project } from '../model/index.js';

export async function createProject(data) {
  const project = new Project(data);
  await project.save();
  return await project.populate('owner', 'email role');
}

export async function getAllProjects(userId, isAdmin) {
  const query = isAdmin ? {} : { owner: userId };
  
  return await Project.find(query)
    .populate('owner', 'email role')
    .sort({ createdAt: -1 });
}

export async function getProjectById(id) {
  const project = await Project.findById(id).populate('owner', 'email role');
  
  if (!project) {
    throw new Error('Project not found');
  }
  
  return project;
}

export async function updateProject(id, data, userId, isAdmin) {
  const project = await Project.findById(id);
  
  if (!project) {
    throw new Error('Project not found');
  }

  // Check ownership unless admin
  if (!isAdmin && project.owner.toString() !== userId.toString()) {
    throw new Error('You do not have permission to update this project');
  }

  // Update only provided fields
  Object.assign(project, data);
  await project.save();
  
  return await project.populate('owner', 'email role');
}

export async function deleteProject(id, userId, isAdmin) {
  const project = await Project.findById(id);
  
  if (!project) {
    throw new Error('Project not found');
  }

  // Check ownership unless admin
  if (!isAdmin && project.owner.toString() !== userId.toString()) {
    throw new Error('You do not have permission to delete this project');
  }

  await Project.findByIdAndDelete(id);
  
  return { message: 'Project deleted successfully' };
}

