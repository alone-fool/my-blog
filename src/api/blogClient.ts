import { checkBlogMockSupport } from '@/config/mock'
import { blogApi } from './blogApi'
import { blogMockApi } from '@/mocks/blog/blogMockApi'

export type BlogClient = typeof blogApi

export const blogClient: BlogClient = checkBlogMockSupport() ? blogMockApi : blogApi
