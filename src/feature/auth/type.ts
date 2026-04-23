// request type
export type LoginRequest = {
  userName: string
  password: string
}

export type RefreshTokenRequest = {
  refreshToken: string
}

// response type
export type LoginResponse = {
  accessToken: string
  refreshToken: string
  permissions: string[]
}

export type ProfileInfo = {
  _id: string
  userName: string
  fullName: string
  email: string
  mobile: string
  address: any
  age: any
  sex: string
  bod: string
  jobTitle: any
  isDeleted: boolean
  userType: string
}

// common type
export enum PermissionEnum {
  // TEACHER_RECRUITMENT = 'teachers:read',
  TEACHER_READ = 'teachers:read',
  TEACHER_RECRUITMENT = 'teachers:read-recruitment',
  TEACHER_COORDINATOR = 'teachers:read-coordinator',
  TEACHER_CREATE = 'teachers:create',
  TEACHER_UPDATE = 'teachers:update',
  TEACHER_DELETE = 'teachers:delete',
  // TEACHER LEAVES
  TEACHER_LEAVE_READ = 'teacher-leaves:read',
  TEACHER_LEAVE_CREATE = 'teacher-leaves:create',
  TEACHER_LEAVE_UPDATE = 'teacher-leaves:update',
  TEACHER_LEAVE_DELETE = 'teacher-leaves:delete',

  // TEACHER NOTES
  TEACHER_NOTE_READ = 'teacher-notes:read',
  TEACHER_NOTE_CREATE = 'teacher-notes:create',
  TEACHER_NOTE_UPDATE = 'teacher-notes:update',
  TEACHER_NOTE_DELETE = 'teacher-notes:delete',


  // Teacher Assistant permissions
  TEACHER_ASSISTANT_READ = 'teacher-assistants:read',
  TEACHER_ASSISTANT_CREATE = 'teacher-assistants:create',
  TEACHER_ASSISTANT_UPDATE = 'teacher-assistants:update',
  TEACHER_ASSISTANT_DELETE = 'teacher-assistants:delete',

  // Organization permissions
  ORGANIZATION_READ = 'organizations:read',
  ORGANIZATION_CREATE = 'organizations:create',
  ORGANIZATION_UPDATE = 'organizations:update',
  ORGANIZATION_DELETE = 'organizations:delete',

  // Class permissions  
  CLASS_READ = 'classes:read',
  CLASS_CREATE = 'classes:create',
  CLASS_UPDATE = 'classes:update',
  CLASS_DELETE = 'classes:delete',
  CLASS_UPDATE_SYLLABUS = 'classes:syllabus',

  // Student permissions
  STUDENT_READ = 'students:read',
  STUDENT_CREATE = 'students:create',
  STUDENT_UPDATE = 'students:update',
  STUDENT_DELETE = 'students:delete',

  // School Year permissions
  SCHOOL_YEAR_READ = 'school-years:read',
  SCHOOL_YEAR_CREATE = 'school-years:create',
  SCHOOL_YEAR_UPDATE = 'school-years:update',
  SCHOOL_YEAR_DELETE = 'school-years:delete',

  // Subject permissions
  SUBJECT_READ = 'subjects:read',
  SUBJECT_CREATE = 'subjects:create',
  SUBJECT_UPDATE = 'subjects:update',
  SUBJECT_DELETE = 'subjects:delete',

  // Program permissions
  PROGRAM_READ = 'program-types:read',
  PROGRAM_CREATE = 'program-types:create',
  PROGRAM_UPDATE = 'program-types:update',
  PROGRAM_DELETE = 'program-types:delete',

  // Schedule permissions
  SCHEDULE_READ = 'schedules:read',
  SCHEDULE_CREATE = 'schedules:create',
  SCHEDULE_UPDATE = 'schedules:update',
  SCHEDULE_DELETE = 'schedules:delete',

  // Assignment permissions
  ASSIGNMENT_READ = 'assignments:read',
  ASSIGNMENT_CREATE = 'assignments:create',
  ASSIGNMENT_UPDATE = 'assignments:update',
  ASSIGNMENT_DELETE = 'assignments:delete',

  // File permissions
  FILE_READ = 'files:read',
  FILE_UPLOAD = 'files:create',
  FILE_DELETE = 'files:delete',
  FILE_UPDATE='files:update',
  // Category permissions
  CATEGORY_READ = 'categories:read',
  CATEGORY_CREATE = 'categories:create',
  CATEGORY_UPDATE = 'categories:update',
  CATEGORY_DELETE = 'categories:delete',

  // Course permissions
  COURSE_READ = 'courses:read',
  COURSE_CREATE = 'courses:create',
  COURSE_UPDATE = 'courses:update',
  COURSE_DELETE = 'courses:delete',

  // Role permissions  
  ROLE_READ = 'roles:read',
  ROLE_CREATE = 'roles:create',
  ROLE_UPDATE = 'roles:update',
  ROLE_DELETE = 'roles:delete',

  // resource permissions
  RESOURCE_READ = 'resources:read',
  RESOURCE_CREATE = 'resources:create',
  RESOURCE_UPDATE = 'resources:update',
  RESOURCE_DELETE = 'resources:delete',

  // users permissions
  USERS_READ = 'users:read',
  USERS_CREATE = 'users:create',
  USERS_UPDATE = 'users:update',
  USERS_DELETE = 'users:delete',

  // CONTRACT TYPES  
  CONTRACT_TYPE_READ = 'contract-types:read',
  CONTRACT_TYPE_CREATE = 'contract-types:create',
  CONTRACT_TYPE_UPDATE = 'contract-types:update',
  CONTRACT_TYPE_DELETE = 'contract-types:delete',

  // CONTRACTS 
  CONTRACT_READ = 'contracts:read',
  CONTRACT_CREATE = 'contracts:create',
  CONTRACT_UPDATE = 'contracts:update',
  CONTRACT_DELETE = 'contracts:delete',

  // RATES 
  RATE_READ = 'rates:read',
  RATE_CREATE = 'rates:create',
  RATE_UPDATE = 'rates:update',
  RATE_DELETE = 'rates:delete',

  //  WORK PERMITS 
  WORK_PERMIT_READ = 'work-permits:read',
  WORK_PERMIT_CREATE = 'work-permits:create',
  WORK_PERMIT_UPDATE = 'work-permits:update',
  WORK_PERMIT_DELETE = 'work-permits:delete',

  //  VISAS 
  VISA_READ = 'visas:read',
  VISA_CREATE = 'visas:create',
  VISA_UPDATE = 'visas:update',
  VISA_DELETE = 'visas:delete',

  // AVAILABILITY SCHEDULES
  AVAILABILITY_SCHEDULE_READ = 'availibility-schedules:read',
  AVAILABILITY_SCHEDULE_CREATE = 'availibility-schedules:create',
  AVAILABILITY_SCHEDULE_UPDATE = 'availibility-schedules:update',
  AVAILABILITY_SCHEDULE_DELETE = 'availibility-schedules:delete',

  // ORGANIZATION CONTACTS
  ORGANIZATION_CONTACTS_READ = 'organization-contacts:read',
  ORGANIZATION_CONTACTS_CREATE = 'organization-contacts:create',
  ORGANIZATION_CONTACTS_UPDATE = 'organization-contacts:update',
  ORGANIZATION_CONTACTS_DELETE = 'organization-contacts:delete',

  // ROOMS
  ROOMS_READ = 'rooms:read',
  ROOMS_CREATE = 'rooms:create',
  ROOMS_UPDATE = 'rooms:update',
  ROOMS_DELETE = 'rooms:delete',

  // SEMESTERS
  SEMESTERS_READ = 'semesters:read',
  SEMESTERS_CREATE = 'semesters:create',
  SEMESTERS_UPDATE = 'semesters:update',
  SEMESTERS_DELETE = 'semesters:delete',

  // PROGRAMS
  PROGRAMS_READ = 'programs:read',
  PROGRAMS_CREATE = 'programs:create',
  PROGRAMS_UPDATE = 'programs:update',
  PROGRAMS_DELETE = 'programs:delete',

  // SELF-AVAILABILITIES  
  SELF_AVAILABILITIES_READ = 'self-availabilities:read',
  SELF_AVAILABILITIES_CREATE = 'self-availabilities:create',
  SELF_AVAILABILITIES_UPDATE = 'self-availabilities:update',
  SELF_AVAILABILITIES_DELETE = 'self-availabilities:delete',

  // SELF-SCHEDULES  
  SELF_SCHEDULES_READ = 'self-schedules:read',
  SELF_SCHEDULES_CREATE = 'self-schedules:create',
  SELF_SCHEDULES_UPDATE = 'self-schedules:update',
  SELF_SCHEDULES_DELETE = 'self-schedules:delete',

  // ORGANIZATION-PROGRAMS 
  ORGANIZATION_PROGRAMS_READ = 'organization-programs:read',
  ORGANIZATION_PROGRAMS_CREATE = 'organization-programs:create',
  ORGANIZATION_PROGRAMS_UPDATE = 'organization-programs:update',
  ORGANIZATION_PROGRAMS_DELETE = 'organization-programs:delete',

  //SYLLABUSES 
  SYLLABUSES_READ = 'syllabuses:read',
  SYLLABUSES_CREATE = 'syllabuses:create',
  SYLLABUSES_UPDATE = 'syllabuses:update',
  SYLLABUSES_DELETE = 'syllabuses:delete',

  // SCHEDULE-SLOTS
  SCHEDULE_SLOTS_READ = 'schedule-slots:read',
  SCHEDULE_SLOTS_CREATE = 'schedule-slots:create',
  SCHEDULE_SLOTS_UPDATE = 'schedule-slots:update',
  SCHEDULE_SLOTS_DELETE = 'schedule-slots:delete',

  // PERIOD DEFINITIONS
  PERIOD_DEFINITIONS_READ = 'period-definitions:read',
  PERIOD_DEFINITIONS_CREATE = 'period-definitions:create',
  PERIOD_DEFINITIONS_UPDATE = 'period-definitions:update',
  PERIOD_DEFINITIONS_DELETE = 'period-definitions:delete',

}

