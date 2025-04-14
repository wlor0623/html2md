<template>
  <div class="min-h-screen bg-white">
    <header class="bg-[#171717] text-white shadow-md">
      <div class="container mx-auto p-4 flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
          </svg>
          <h1 class="text-xl font-medium">HTML to Markdown 转换器</h1>
        </div>
        <a 
          href="https://github.com/wlor0623/html2md" 
          target="_blank" 
          class="text-white hover:text-gray-200 transition-colors flex items-center space-x-1"
        >
          <span>github</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
        </a>
      </div>
    </header>
    
    <main >
      <slot />
    </main>
    
    <footer class="bg-[#fafafa] border-t border-[#e5e5e5] p-4 text-center text-[#8c8c8c] text-sm">
      <p>基于 Nuxt 3 和 Turndown 构建 | 自动将 HTML 转换为 Markdown</p>
    </footer>
  </div>
</template> 