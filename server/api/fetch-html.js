import fetch from 'cross-fetch'
import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    // Get request body
    const body = await readBody(event)
    const { url } = body

    if (!url) {
      return createError({
        statusCode: 400,
        message: '请提供有效网址'
      })
    }

    // Validate URL format
    let targetUrl = url
    try {
      // Add protocol if missing
      if (!/^https?:\/\//i.test(targetUrl)) {
        targetUrl = 'https://' + targetUrl
      }
      
      // Check if URL is valid
      new URL(targetUrl)
    } catch (e) {
      return createError({
        statusCode: 400,
        message: '网址格式不正确'
      })
    }

    console.log(`[server] Fetching HTML from: ${targetUrl}`)
    
    // Fetch the HTML content with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout
    
    try {
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        signal: controller.signal,
        redirect: 'follow'
      })
      
      clearTimeout(timeoutId)
      
      // Log response details for debugging
      console.log(`[server] Response status: ${response.status}`)
      console.log(`[server] Content-Type: ${response.headers.get('content-type') || 'not specified'}`)
      
      if (!response.ok) {
        let errorMessage = `获取失败，状态码: ${response.status}`
        
        // More specific error messages based on status code
        if (response.status === 403) {
          errorMessage = '网站拒绝访问，可能禁止了自动抓取'
        } else if (response.status === 429) {
          errorMessage = '请求过多，被网站限制，请稍后再试'
        } else if (response.status === 404) {
          errorMessage = '页面不存在，请检查网址是否正确'
        } else if (response.status >= 500) {
          errorMessage = '目标网站服务器错误，请稍后再试'
        }
        
        return createError({
          statusCode: response.status,
          message: errorMessage
        })
      }
      
      const contentType = response.headers.get('content-type') || ''
      if (!contentType.includes('text/html') && 
          !contentType.includes('application/xhtml+xml') &&
          !contentType.includes('application/xml')) {
        return createError({
          statusCode: 415,
          message: `不支持的内容类型: ${contentType}, 必须是HTML页面`
        })
      }
      
      const html = await response.text()
      
      // Check if we actually got HTML content (basic validation)
      if (!html || html.trim().length < 50 || (!html.includes('<html') && !html.includes('<body'))) {
        console.log(`[server] Warning: Retrieved content may not be valid HTML (length: ${html?.length || 0})`)
        
        if (html?.includes('captcha') || html?.includes('robot') || html?.includes('blocked')) {
          return createError({
            statusCode: 403,
            message: '网站可能要求验证码或阻止了自动访问'
          })
        }
      } else {
        console.log(`[server] Successfully retrieved HTML content (length: ${html.length})`)
      }
      
      // Return the HTML content
      return { 
        html,
        url: targetUrl,
        contentType
      }
    } catch (fetchError) {
      clearTimeout(timeoutId)
      
      console.error('[server] Fetch error:', fetchError.name, fetchError.message)
      
      if (fetchError.name === 'AbortError') {
        return createError({
          statusCode: 408,
          message: '请求超时，请检查网址或稍后再试'
        })
      }
      
      // Handle specific network errors
      if (fetchError.code === 'ENOTFOUND' || fetchError.code === 'ECONNREFUSED') {
        return createError({
          statusCode: 502,
          message: '无法连接到目标网站，请检查网址是否正确'
        })
      }
      
      if (fetchError.code === 'ETIMEDOUT') {
        return createError({
          statusCode: 504,
          message: '连接目标网站超时，请稍后再试'
        })
      }
      
      throw fetchError
    }
  } catch (error) {
    console.error('[server] Error fetching HTML:', error)
    
    let statusCode = 500
    let errorMessage = '获取网页内容失败'
    
    // Extract more specific error information if available
    if (error.message) {
      errorMessage = error.message
      
      if (error.message.includes('ENOTFOUND')) {
        statusCode = 404
        errorMessage = '找不到目标服务器，请检查网址是否正确'
      } else if (error.message.includes('certificate')) {
        statusCode = 526
        errorMessage = '目标网站SSL证书无效或过期'
      } else if (error.message.includes('ECONNRESET')) {
        statusCode = 502
        errorMessage = '连接被重置，目标网站可能拒绝了请求'
      }
    }
    
    return createError({
      statusCode,
      message: errorMessage
    })
  }
}) 