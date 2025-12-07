/**
 * Role-Based Access Control Middleware
 * Validates user roles and permissions for protected routes
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Middleware to check if user has required role(s)
 * @param {string|string[]} allowedRoles - Single role or array of roles
 */
const requireRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ 
          success: false, 
          message: 'Authentication required' 
        });
      }

      const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
      
      // Get user role from PortalUser
      const portalUser = await prisma.portalUser.findUnique({
        where: { id: req.user.id },
        select: { role: true }
      });

      if (!portalUser) {
        return res.status(401).json({ 
          success: false, 
          message: 'User not found' 
        });
      }

      if (!roles.includes(portalUser.role)) {
        return res.status(403).json({ 
          success: false, 
          message: `Access denied. Required role: ${roles.join(' or ')}` 
        });
      }

      // Attach role to request for use in controllers
      req.user.role = portalUser.role;
      next();
    } catch (error) {
      console.error('Role middleware error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error checking user role' 
      });
    }
  };
};

/**
 * Middleware to check specific permissions
 * @param {string} resource - Resource name (e.g., 'patients', 'appointments')
 * @param {string} action - Action name (e.g., 'create', 'read', 'update', 'delete')
 */
const requirePermission = (resource, action) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ 
          success: false, 
          message: 'Authentication required' 
        });
      }

      // Get user role
      const portalUser = await prisma.portalUser.findUnique({
        where: { id: req.user.id },
        select: { role: true }
      });

      if (!portalUser) {
        return res.status(401).json({ 
          success: false, 
          message: 'User not found' 
        });
      }

      // Admin has all permissions
      if (portalUser.role === 'admin') {
        req.user.role = portalUser.role;
        return next();
      }

      // Check role permissions
      const rolePermission = await prisma.rolePermission.findUnique({
        where: { role: portalUser.role }
      });

      if (!rolePermission) {
        return res.status(403).json({ 
          success: false, 
          message: 'No permissions configured for this role' 
        });
      }

      const permissions = JSON.parse(rolePermission.permissions);
      const hasPermission = permissions[resource]?.[action] === true;

      if (!hasPermission) {
        return res.status(403).json({ 
          success: false, 
          message: `Permission denied: ${action} on ${resource}` 
        });
      }

      req.user.role = portalUser.role;
      next();
    } catch (error) {
      console.error('Permission middleware error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error checking permissions' 
      });
    }
  };
};

module.exports = {
  requireRole,
  requirePermission
};
