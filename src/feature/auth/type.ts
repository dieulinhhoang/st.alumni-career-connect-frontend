/**
 * PermissionEnum — khớp với resource code trong bảng `resources` (seed.service.ts)
 *
 * Format: '<resource_code>:<action>'
 *
 * Dùng trong controller:
 *   @RequirePermission(PermissionEnum.STUDENTS_READ)
 *   @RequirePermission(PermissionEnum.SURVEYS_CREATE, PermissionEnum.SURVEYS_UPDATE)
 */
export const PermissionEnum = {

  //  students 
  STUDENTS_READ:   'students:read',
  STUDENTS_CREATE: 'students:create',
  STUDENTS_UPDATE: 'students:update',
  STUDENTS_DELETE: 'students:delete',

  //  surveys 
  SURVEYS_READ:   'surveys:read',
  SURVEYS_CREATE: 'surveys:create',
  SURVEYS_UPDATE: 'surveys:update',
  SURVEYS_DELETE: 'surveys:delete',
  SURVEYS_EXPORT: 'surveys:export',

  //  enterprises 
  ENTERPRISES_READ:   'enterprises:read',
  ENTERPRISES_CREATE: 'enterprises:create',
  ENTERPRISES_UPDATE: 'enterprises:update',
  ENTERPRISES_DELETE: 'enterprises:delete',

  //  jobs 
  JOBS_READ:   'jobs:read',
  JOBS_CREATE: 'jobs:create',
  JOBS_UPDATE: 'jobs:update',
  JOBS_DELETE: 'jobs:delete',

  //  users 
  USERS_READ:   'users:read',
  USERS_CREATE: 'users:create',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',

  //  roles 
  ROLES_READ:   'roles:read',
  ROLES_CREATE: 'roles:create',
  ROLES_UPDATE: 'roles:update',
  ROLES_DELETE: 'roles:delete',

  //  reports 
  REPORTS_READ:   'reports:read',
  REPORTS_EXPORT: 'reports:export',

  //  graduation 
  GRADUATION_READ:   'graduation:read',
  GRADUATION_CREATE: 'graduation:create',
  GRADUATION_UPDATE: 'graduation:update',

} as const;

export type PermissionEnum = typeof PermissionEnum[keyof typeof PermissionEnum];