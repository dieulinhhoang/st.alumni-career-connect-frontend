import { UserActionInfo } from '@/Global/globalType'

export interface IUser {
    _id: string
    userName: string
    fullName: string
    email: string
    mobile: string
    address?: string
    age?: number
    sex?: string
    bod?: string
    isSupperAdmin: boolean
    roles: string[]
    isSuspended: boolean
    isDeleted: boolean
    createdBy?: UserActionInfo
    updatedBy?: UserActionInfo
    createdAt: string
    updatedAt: string
}

export interface IUserListResponse {
    data: IUser[]
    page: {
        total_pages: number
        has_next: boolean
        has_previous: boolean
        current_page: number
        total_elements: number
    }
}

// (param ?page=&size=&userName=&fullName=&email=&mobile=)
export interface IUserQuery {
    page: number
    size: number
    userName?: string
    fullName?: string
    email?: string
    mobile?: string
    address?: string
    roleId?: string
   
}

export interface ICreateUserBody {
    userName: string
    fullName: string
    email: string
    mobile: string
    address?: string
    age?: number
    sex?: string
    bod?: string
    password: string
    roleIds?: string[]
}

export interface IUpdateUserBody {
    fullName?: string
    email?: string
    mobile?: string
    address?: string
    sex?: number
    bod?: string
    roleIds?: string[]
}

export interface IChangePasswordBody {
    newPassword: string
}
