import type { Request, Response } from 'express';
import { prisma } from '../../config/prisma.js';

// GET all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

// GET single user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Ensure id is a string
    if (!id || typeof id !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
};

// UPDATE user (Admin only)
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    // Ensure id is a string
    if (!id || typeof id !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
      return;
    }

    const currentUser = req.user;

    if (!currentUser || currentUser.role !== 'ADMIN') {
      res.status(403).json({
        success: false,
        message: 'Only admins can update users'
      });
      return;
    }

    // Build update data object
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (role !== undefined) {
      if (!['ADMIN', 'MANAGER'].includes(role)) {
        res.status(400).json({
          success: false,
          message: 'Invalid role. Must be ADMIN or MANAGER'
        });
        return;
      }
      updateData.role = role;
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    
    if (error.code === 'P2025') {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    if (error.code === 'P2002') {
      res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
};

// UPDATE user role (Admin only)
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Ensure id is a string
    if (!id || typeof id !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
      return;
    }

    const currentUser = req.user;

    if (!currentUser || currentUser.role !== 'ADMIN') {
      res.status(403).json({
        success: false,
        message: 'Only admins can change user roles'
      });
      return;
    }

    if (!role || !['ADMIN', 'MANAGER'].includes(role)) {
      res.status(400).json({
        success: false,
        message: 'Invalid role. Must be ADMIN or MANAGER'
      });
      return;
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: user
    });
  } catch (error: any) {
    console.error('Error updating user role:', error);
    
    if (error.code === 'P2025') {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update user role'
    });
  }
};

// UPDATE user status (Admin only)
export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Ensure id is a string
    if (!id || typeof id !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
      return;
    }

    const currentUser = req.user;

    if (!currentUser || currentUser.role !== 'ADMIN') {
      res.status(403).json({
        success: false,
        message: 'Only admins can change user status'
      });
      return;
    }

    if (!status || !['ACTIVE', 'INACTIVE'].includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Invalid status. Must be ACTIVE or INACTIVE'
      });
      return;
    }

    const user = await prisma.user.update({
      where: { id },
      // @ts-ignore
      data: { status },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      message: 'User status updated successfully',
      data: user
    });
  } catch (error: any) {
    console.error('Error updating user status:', error);
    
    if (error.code === 'P2025') {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update user status'
    });
  }
};

// DELETE user (Admin only)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Ensure id is a string
    if (!id || typeof id !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
      return;
    }

    const currentUser = req.user;

    if (!currentUser || currentUser.role !== 'ADMIN') {
      res.status(403).json({
        success: false,
        message: 'Only admins can delete users'
      });
      return;
    }

    // Prevent self-deletion
    if (currentUser.userId === id) {
      res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
      return;
    }

    await prisma.user.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    
    if (error.code === 'P2025') {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
};

