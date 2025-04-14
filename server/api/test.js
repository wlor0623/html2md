import { defineEventHandler } from 'h3'

export default defineEventHandler(() => {
  return {
    api: 'working',
    message: '测试API端点正常工作'
  }
}) 