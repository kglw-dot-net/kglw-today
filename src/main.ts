import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routes } from './router/index'
import './styles/global.css'

export const createApp = ViteSSG(App, { routes })
