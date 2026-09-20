<template>
  <div class="home-container" :style="s.homeContainer">
    <!-- Top Navigation Bar -->
    <nav class="navbar" :style="s.navbar">
      <BrandMark />
      <div class="nav-links" :style="s.navLinks">
        <a href="https://github.com/nikmcfly/MiroFish-Offline" target="_blank" class="github-link" :style="s.githubLink">
          {{ $t('nav.visitGithub') }} <span>↗</span>
        </a>
        <LanguageSwitcher />
      </div>
    </nav>

    <div class="main-content" :style="s.mainContent">
      <!-- Hero Section -->
      <section class="hero-section" :style="s.heroSection">
        <div class="hero-left" :style="s.heroLeft">
          <div class="tag-row" :style="s.tagRow">
            <span class="orange-tag" :style="s.orangeTag">{{ $t('home.tagline') }}</span>
            <span class="version-text" :style="s.versionText">{{ $t('home.version') }}</span>
          </div>

          <h1 class="main-title" :style="s.mainTitle">
            {{ $t('home.heroTitle1') }}<br>
            <span class="gradient-text" :style="s.gradientText">{{ $t('home.heroTitle2') }}</span>
          </h1>

          <div class="hero-desc" :style="s.heroDesc">
            <i18n-t keypath="home.heroDesc" tag="p" :style="s.heroDescP">
              <template #brand><span :style="s.highlightBold">{{ $t('home.heroDescBrand') }}</span></template>
              <template #agentScale><span :style="s.highlightOrange">{{ $t('home.heroDescAgentScale') }}</span></template>
              <template #optimalSolution><span :style="s.highlightCode">{{ $t('home.heroDescOptimalSolution') }}</span></template>
            </i18n-t>
            <p class="slogan-text" :style="s.sloganText">
              {{ $t('home.slogan') }}<span :style="s.blinkingCursor">_</span>
            </p>
          </div>

          <div class="decoration-square" :style="s.decorationSquare"></div>
        </div>

        <div class="hero-right" :style="s.heroRight">
          <div class="logo-container" :style="s.logoContainer">
            <img src="../assets/logo/MiroFish_logo_left.jpeg" alt="MiroFish Logo" :style="s.heroLogo" />
          </div>
          <button :style="s.scrollDownBtn" @click="scrollToBottom">↓</button>
        </div>
      </section>

      <!-- Dashboard: Two-Column Layout -->
      <section class="dashboard-section" :style="s.dashboardSection">
        <!-- Left Column: Status & Steps -->
        <div class="left-panel" :style="s.leftPanel">
          <div class="panel-header" :style="s.panelHeader">
            <span :style="s.statusDot">■</span> {{ $t('home.systemStatus') }}
          </div>

          <h2 class="section-title" :style="s.sectionTitle">{{ $t('home.systemReady') }}</h2>
          <p class="section-desc" :style="s.sectionDesc">
            {{ $t('home.systemReadyDesc') }}
          </p>

          <div class="metrics-row" :style="s.metricsRow">
            <div class="metric-card" :style="s.metricCard">
              <div class="metric-value" :style="s.metricValue">{{ $t('home.metricLowCost') }}</div>
              <div class="metric-label" :style="s.metricLabel">{{ $t('home.metricLowCostDesc') }}</div>
            </div>
            <div class="metric-card" :style="s.metricCard">
              <div class="metric-value" :style="s.metricValue">{{ $t('home.metricHighAvail') }}</div>
              <div class="metric-label" :style="s.metricLabel">{{ $t('home.metricHighAvailDesc') }}</div>
            </div>
          </div>

          <div class="steps-container" :style="s.stepsContainer">
            <div class="steps-header" :style="s.stepsHeader">
               <span :style="s.diamondIcon">◇</span> {{ $t('home.workflowSequence') }}
            </div>
            <div :style="s.workflowList">
              <div v-for="(step, i) in steps" :key="i" :style="s.workflowItem">
                <span :style="s.stepNum">{{ step.num }}</span>
                <div :style="s.stepInfo">
                  <div :style="s.stepTitle">{{ step.title }}</div>
                  <div :style="s.stepDesc">{{ step.desc }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Interactive Console -->
        <div class="right-panel" :style="s.rightPanel">
          <div class="console-box" :style="s.consoleBox">
            <div :style="s.consoleSection">
              <div class="console-header" :style="s.consoleHeader">
                <span>{{ $t('home.realitySeed') }}</span>
                <span>{{ $t('home.supportedFormats') }}</span>
              </div>
              <div
                :style="s.uploadZone"
                @dragover.prevent="handleDragOver"
                @dragleave.prevent="handleDragLeave"
                @drop.prevent="handleDrop"
                @click="triggerFileInput"
              >
                <input ref="fileInput" type="file" multiple accept=".pdf,.md,.txt" @change="handleFileSelect" style="display: none" :disabled="loading" />
                <div v-if="files.length === 0" :style="s.uploadPlaceholder">
                  <div :style="s.uploadIcon">↑</div>
                  <div :style="s.uploadTitle">{{ $t('home.dragToUpload') }}</div>
                  <div :style="s.uploadHint">{{ $t('home.orBrowse') }}</div>
                </div>
                <div v-else :style="s.fileList">
                  <div v-for="(file, index) in files" :key="index" :style="s.fileItem">
                    <span>📄</span>
                    <span :style="s.fileName">{{ file.name }}</span>
                    <button @click.stop="removeFile(index)" :style="s.removeBtn">×</button>
                  </div>
                </div>
              </div>
            </div>

            <div :style="s.consoleDivider"><span :style="s.consoleDividerText">{{ $t('home.inputParams') }}</span></div>

            <div :style="s.consoleSection">
              <div class="console-header" :style="s.consoleHeader">
                <span>{{ $t('home.simulationPrompt') }}</span>
              </div>
              <div :style="s.inputWrapper">
                <textarea v-model="formData.simulationRequirement" :style="s.codeInput" :placeholder="$t('home.promptPlaceholder')" rows="6" :disabled="loading"></textarea>
                <div :style="s.modelBadge">{{ $t('home.engineBadge') }}</div>
              </div>
            </div>

            <div :style="s.btnSection">
              <button :style="s.startEngineBtn" @click="startSimulation" :disabled="!canSubmit || loading">
                <span v-if="!loading">{{ $t('home.startEngine') }}</span>
                <span v-else>{{ $t('home.initializing') }}</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <HistoryDatabase />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import HistoryDatabase from '../components/HistoryDatabase.vue'
import LanguageSwitcher from '../components/LanguageSwitcher.vue'
import BrandMark from '../components/BrandMark.vue'
import { useI18n } from 'vue-i18n'


const { t } = useI18n()
const mono = 'var(--mono)'
const sans = 'var(--font)'

const s = reactive({
  homeContainer: {
    minHeight: '100vh',
    background:
      'radial-gradient(60rem 40rem at 12% -10%, rgba(196,214,0,.10), transparent 60%),' +
      'radial-gradient(50rem 36rem at 95% 8%, rgba(230,0,126,.09), transparent 60%),' +
      'var(--bg-1)',
  },
  navbar: { height: '60px', background: 'var(--bg-0)', color: 'var(--text-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px' },
  navBrand: { fontFamily: mono, fontWeight: '800', letterSpacing: '1px', fontSize: '1.2rem' },
  navLinks: { display: 'flex', alignItems: 'center' },
  githubLink: { color: 'var(--text-100)', textDecoration: 'none', fontFamily: mono, fontSize: '0.9rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' },
  mainContent: { maxWidth: '1400px', margin: '0 auto', padding: '60px 40px' },
  heroSection: { display: 'flex', justifyContent: 'space-between', marginBottom: '80px', position: 'relative' },
  heroLeft: { flex: '1', paddingRight: '60px' },
  tagRow: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', fontFamily: mono, fontSize: '0.8rem' },
  orangeTag: { background: 'transparent', color: 'var(--lime)', border: '1px solid var(--lime)', padding: '4px 10px', fontWeight: '700', letterSpacing: '0.15em', fontSize: 'var(--fs-xs)', textTransform: 'uppercase' },
  versionText: { color: 'var(--text-400)', fontWeight: '500', letterSpacing: '0.5px' },
  mainTitle: { fontSize: '4.5rem', lineHeight: '1.2', fontWeight: '500', margin: '0 0 40px 0', letterSpacing: '-2px', color: 'var(--text-100)' },
  gradientText: { background: 'linear-gradient(90deg, var(--text-100) 0%, var(--text-200) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' },
  heroDesc: { fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--text-300)', maxWidth: '640px', marginBottom: '50px', fontWeight: '400', textAlign: 'justify' },
  heroDescP: { marginBottom: '1.5rem' },
  highlightBold: { color: 'var(--text-100)', fontWeight: '700' },
  highlightOrange: { color: 'var(--lime)', fontWeight: '700', fontFamily: mono },
  highlightCode: { background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '2px', fontFamily: mono, fontSize: '0.9em', color: 'var(--text-100)', fontWeight: '700' },
  sloganText: { fontSize: '1.2rem', fontWeight: '500', color: 'var(--text-100)', letterSpacing: '1px', borderLeft: '3px solid var(--lime)', paddingLeft: '15px', marginTop: '20px' },
  blinkingCursor: { color: 'var(--lime)', fontWeight: '700' },
  decorationSquare: { width: '16px', height: '16px', background: 'var(--pink)' },
  heroRight: { flex: '0.8', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end' },
  logoContainer: { width: '100%', display: 'flex', justifyContent: 'flex-end', paddingRight: '40px' },
  heroLogo: { maxWidth: '500px', width: '100%', display: 'block', borderRadius: 'var(--r-lg)', border: '1px solid var(--border-soft)', filter: 'saturate(.9)', boxShadow: 'var(--shadow-lg)' },
  scrollDownBtn: { width: '40px', height: '40px', border: '1px solid var(--border-soft)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--lime)', fontSize: '1.2rem' },
  dashboardSection: { display: 'flex', gap: '60px', borderTop: '1px solid var(--border-soft)', paddingTop: '60px', alignItems: 'flex-start' },
  leftPanel: { flex: '0.8', display: 'flex', flexDirection: 'column' },
  panelHeader: { fontFamily: mono, fontSize: '0.8rem', color: 'var(--text-400)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' },
  statusDot: { color: 'var(--lime)', fontSize: '0.8rem' },
  sectionTitle: { fontSize: '2rem', fontWeight: '500', margin: '0 0 15px 0' },
  sectionDesc: { color: 'var(--text-300)', marginBottom: '25px', lineHeight: '1.6' },
  metricsRow: { display: 'flex', gap: '20px', marginBottom: '15px' },
  metricCard: { border: '1px solid var(--border-soft)', padding: '20px 30px', minWidth: '150px' },
  metricValue: { fontFamily: mono, fontSize: '1.8rem', fontWeight: '500', marginBottom: '5px' },
  metricLabel: { fontSize: '0.85rem', color: 'var(--text-400)' },
  stepsContainer: { border: '1px solid var(--border-soft)', padding: '30px', position: 'relative' },
  stepsHeader: { fontFamily: mono, fontSize: '0.8rem', color: 'var(--text-400)', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '8px' },
  diamondIcon: { fontSize: '1.2rem', lineHeight: '1' },
  workflowList: { display: 'flex', flexDirection: 'column', gap: '20px' },
  workflowItem: { display: 'flex', alignItems: 'flex-start', gap: '20px' },
  stepNum: { fontFamily: mono, fontWeight: '700', color: 'var(--text-100)', opacity: '0.3' },
  stepInfo: { flex: '1' },
  stepTitle: { fontWeight: '500', fontSize: '1rem', marginBottom: '4px' },
  stepDesc: { fontSize: '0.85rem', color: 'var(--text-300)' },
  rightPanel: { flex: '1.2', display: 'flex', flexDirection: 'column' },
  consoleBox: { border: '1px solid var(--border-strong)', padding: '8px' },
  consoleSection: { padding: '20px' },
  consoleHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontFamily: mono, fontSize: '0.75rem', color: 'var(--text-300)' },
  uploadZone: { border: '1px dashed var(--border-strong)', height: '200px', overflowY: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'var(--bg-2)' },
  uploadPlaceholder: { textAlign: 'center' },
  uploadIcon: { width: '40px', height: '40px', border: '1px solid var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', color: 'var(--text-400)' },
  uploadTitle: { fontWeight: '500', fontSize: '0.9rem', marginBottom: '5px' },
  uploadHint: { fontFamily: mono, fontSize: '0.75rem', color: 'var(--text-400)' },
  fileList: { width: '100%', padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' },
  fileItem: { display: 'flex', alignItems: 'center', background: 'var(--bg-2)', padding: '8px 12px', border: '1px solid var(--border-soft)', fontFamily: mono, fontSize: '0.85rem' },
  fileName: { flex: '1', margin: '0 10px' },
  removeBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-400)' },
  consoleDivider: { display: 'flex', alignItems: 'center', margin: '10px 0', borderTop: '1px solid var(--border-soft)' },
  consoleDividerText: { padding: '0 15px', fontFamily: mono, fontSize: '0.7rem', color: 'var(--text-400)', letterSpacing: '1px' },
  inputWrapper: { position: 'relative', border: '1px solid var(--border-strong)', background: 'var(--bg-2)' },
  codeInput: { width: '100%', border: 'none', background: 'transparent', padding: '20px', fontFamily: mono, fontSize: '0.9rem', lineHeight: '1.6', resize: 'vertical', outline: 'none', minHeight: '150px' },
  modelBadge: { position: 'absolute', bottom: '10px', right: '15px', fontFamily: mono, fontSize: '0.7rem', color: 'var(--text-400)' },
  btnSection: { padding: '0 20px 20px' },
  startEngineBtn: { width: '100%', background: 'var(--pink)', color: 'var(--text-100)', border: 'none', borderRadius: 'var(--r-sm)', padding: '20px', fontFamily: 'var(--font)', fontWeight: '700', fontSize: 'var(--fs-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', letterSpacing: '0.02em', boxShadow: 'var(--glow-pink)', transition: 'background var(--t) var(--ease)' },
})

const steps = computed(() => [
  { num: '01', title: t('home.step01Title'), desc: t('home.step01Desc') },
  { num: '02', title: t('home.step02Title'), desc: t('home.step02Desc') },
  { num: '03', title: t('home.step03Title'), desc: t('home.step03Desc') },
  { num: '04', title: t('home.step04Title'), desc: t('home.step04Desc') },
  { num: '05', title: t('home.step05Title'), desc: t('home.step05Desc') },
])

const router = useRouter()

const formData = ref({ simulationRequirement: '' })
const files = ref([])
const loading = ref(false)
const error = ref('')
const isDragOver = ref(false)
const fileInput = ref(null)

const canSubmit = computed(() => {
  return formData.value.simulationRequirement.trim() !== '' && files.value.length > 0
})

const triggerFileInput = () => { if (!loading.value) fileInput.value?.click() }
const handleFileSelect = (event) => { addFiles(Array.from(event.target.files)) }
const handleDragOver = (e) => { isDragOver.value = true }
const handleDragLeave = (e) => { isDragOver.value = false }
const handleDrop = (e) => { isDragOver.value = false; addFiles(Array.from(e.dataTransfer.files)) }

const addFiles = (newFiles) => {
  const allowed = ['.pdf', '.md', '.txt']
  const valid = newFiles.filter(f => allowed.some(ext => f.name.toLowerCase().endsWith(ext)))
  files.value = [...files.value, ...valid]
}

const removeFile = (index) => { files.value.splice(index, 1) }

const scrollToBottom = () => { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }) }

const startSimulation = () => {
  if (!canSubmit.value || loading.value) return
  import('../store/pendingUpload.js').then(({ setPendingUpload }) => {
    setPendingUpload(files.value, formData.value.simulationRequirement)
    router.push({ name: 'Process', params: { projectId: 'new' } })
  })
}
</script>

<!-- Styles loaded from Home.css via import -->
