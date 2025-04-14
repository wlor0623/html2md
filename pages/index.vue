<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import TurndownService from 'turndown'
import { marked } from 'marked'

const htmlInput = ref('')
const markdown = ref('')
const isProcessing = ref(false)
const activeTab = ref('preview') // Default to preview tab
const debounceTimeout = ref(null)

// Configure TurndownService with options
const turndownService = new TurndownService({
  headingStyle: 'setext',
  emDelimiter: '_'
})

// Sample HTML for testing
const sampleHtml = `<div>
  <h1>HTML 转 Markdown 示例</h1>
  <p>这是一个段落，包含<strong>加粗文本</strong>和<em>斜体文本</em>。</p>
  <h2>列表示例</h2>
  <ul>
    <li>无序列表项 1</li>
    <li>无序列表项 2
      <ul>
        <li>嵌套列表项</li>
      </ul>
    </li>
  </ul>
  <h2>链接和图片</h2>
  <p><a href="https://example.com">这是一个链接</a></p>
  <p>下面是一个图片示例：</p>
  <img src="https://via.placeholder.com/150" alt="示例图片">
  <h2>代码示例</h2>
  <pre><code>
function helloWorld() {
  console.log("你好，世界！");
}
  </code></pre>
  <blockquote>
    <p>这是一个引用块示例。</p>
  </blockquote>
</div>`

// Insert sample HTML
function insertSampleHtml() {
  htmlInput.value = sampleHtml
}

// Clean and convert HTML to Markdown with debounce
function convertToMarkdown() {
  if (!htmlInput.value) {
    markdown.value = ''
    return
  }
  
  isProcessing.value = true
  try {
    let cleanedHtml = htmlInput.value
      .replace(/<(script|canvas|input|style|link|meta|noscript|object|embed|iframe|form|button|select|audio|video|svg)[^>]*>[\s\S]*?<\/\1>/gi, '')
      .replace(/<table([^>]*)>/gi, '<div$1>')
      .replace(/<\/table>/gi, '</div>')
      .replace(/<br\s*\/?>/gi, '')  
      .replace(/>\s+</g, '><')
      .replace(/style="[^"]*"/gi, '')
      .replace(/<img[^>]*src\s*=\s*["'][^"']*data:image\/[^"']*base64[^"']*["'][^>]*>/gi, '')
      .replace(/<img[^>]*src\s*=\s*["'][^"']*data:image\/[^"']*svg\+xml[^"']*["'][^>]*>/gi, '')
    
    markdown.value = turndownService.turndown(cleanedHtml)
  } catch (error) {
    console.error('转换 HTML 到 Markdown 时出错:', error)
  } finally {
    isProcessing.value = false
  }
}

// Watch for changes in HTML input and convert automatically with debounce
watch(htmlInput, (newVal) => {
  if (debounceTimeout.value) clearTimeout(debounceTimeout.value)
  debounceTimeout.value = setTimeout(() => {
    convertToMarkdown()
  }, 500) // 500ms debounce
})

function downloadMarkdown() {
  const blob = new Blob([markdown.value], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'output.md'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function clearAll() {
  htmlInput.value = ''
  markdown.value = ''
}

// Computed property for the rendered HTML from markdown
const renderedMarkdown = computed(() => {
  if (!markdown.value) return ''
  return marked(markdown.value)
})
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold mb-2">HTML to Markdown</h1>
      <p class="text-gray-600">将HTML内容转换为Markdown格式</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- HTML Input Panel -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="bg-[#fafafa] px-4 py-3 border-b border-[#f0f0f0] flex justify-between items-center">
          <h2 class="text-lg font-medium text-[#171717]">HTML 输入</h2>
          <div class="flex gap-2">
            <button 
              @click="insertSampleHtml" 
              class="bg-[#171717] hover:bg-black text-white px-3 py-1 rounded-lg text-sm transition-colors"
            >
              插入示例
            </button>
            <button 
              @click="clearAll" 
              class="bg-[#8c8c8c] hover:bg-[#6c6c6c] text-white px-3 py-1 rounded-lg text-sm transition-colors"
            >
              清空
            </button>
          </div>
        </div>
        <div class="p-4">
          <textarea
            v-model="htmlInput"
            class="w-full h-[calc(100vh-380px)] border border-[#e5e5e5] rounded-lg p-3 font-mono text-sm focus:ring-2 focus:ring-[#171717] focus:border-[#171717] outline-none transition"
            placeholder="在此粘贴 HTML 代码..."
          ></textarea>
        </div>
      </div>
      
      <!-- Markdown Output Panel -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="bg-[#fafafa] px-4 py-3 border-b border-[#f0f0f0]">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-medium text-[#171717]">Markdown 输出</h2>
            <div>
              <button 
                @click="downloadMarkdown" 
                class="bg-[#171717] hover:bg-black text-white px-3 py-1 rounded-lg text-sm transition-colors"
                :disabled="!markdown"
              >
                下载
              </button>
            </div>
          </div>
          
          <!-- Tabs -->
          <div class="flex mt-2 space-x-2">
            <button 
              @click="activeTab = 'raw'" 
              :class="[
                'py-1 px-3 text-sm font-medium rounded-lg transition-colors', 
                activeTab === 'raw' 
                  ? 'bg-[#171717] text-white' 
                  : 'text-[#171717] hover:bg-[#f0f0f0]'
              ]"
            >
              源代码
            </button>
            <button 
              @click="activeTab = 'preview'" 
              :class="[
                'py-1 px-3 text-sm font-medium rounded-lg transition-colors',
                activeTab === 'preview' 
                  ? 'bg-[#171717] text-white' 
                  : 'text-[#171717] hover:bg-[#f0f0f0]'
              ]"
              :disabled="!markdown"
            >
              预览
            </button>
          </div>
        </div>
        
        <div class="p-4">
          <!-- Raw Markdown -->
          <textarea
            v-if="activeTab === 'raw'"
            v-model="markdown"
            readonly
            class="w-full h-[calc(100vh-380px)] border border-[#e5e5e5] rounded-lg p-3 font-mono text-sm bg-[#fafafa] outline-none"
            placeholder="Markdown 将显示在这里..."
          ></textarea>
          
          <!-- Markdown Preview -->
          <div
            v-else
            class="border border-[#e5e5e5] rounded-lg p-4 h-[calc(100vh-380px)] overflow-auto bg-white"
          >
            <div v-if="!markdown" class="text-[#8c8c8c] text-center py-8">
              <svg class="mx-auto h-12 w-12 text-[#e0e0e0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
              <p class="mt-2">输入 HTML 后会自动在这里预览转换后的 Markdown</p>
            </div>
            <div v-else-if="isProcessing" class="text-[#8c8c8c] text-center py-8">
              <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#171717] mx-auto"></div>
              <p class="mt-2">正在转换...</p>
            </div>
            <div v-else class="prose prose-neutral max-w-none" v-html="renderedMarkdown"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.prose {
  max-width: 100%;
}
.prose h1 {
  font-size: 1.8em;
  margin-top: 1em;
  margin-bottom: 0.5em;
  color: #171717;
}
.prose h2 {
  font-size: 1.5em;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  color: #171717;
}
.prose h3, .prose h4 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  color: #171717;
}
.prose p {
  margin-top: 0.75em;
  margin-bottom: 0.75em;
  color: #171717;
}
.prose ul, .prose ol {
  margin-left: 1.5em;
  color: #171717;
}
.prose pre {
  background-color: #f5f5f5;
  padding: 1em;
  border-radius: 0.375em;
  overflow-x: auto;
}
.prose code {
  background-color: #f5f5f5;
  padding: 0.2em 0.4em;
  border-radius: 0.25em;
  color: #171717;
}
.prose blockquote {
  border-left: 4px solid #e5e5e5;
  padding-left: 1em;
  color: #8c8c8c;
  font-style: italic;
}
.prose a {
  color: #171717;
  font-weight: 500;
  text-decoration: underline;
}
.prose img {
  border-radius: 0.375em;
  max-width: 100%;
}

/* Loading animation */
.loading-spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style> 