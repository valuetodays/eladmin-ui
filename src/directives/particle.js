// src/directives/particle.js
import { explode } from '@/utils/particle-engine'

export default {
  bind(el, binding) {
    const eventType = binding.modifiers.hover ? 'mouseenter' : 'click'
    el.__particleHandler__ = () => {
      const rect = el.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2
      const options = binding.value || {}
      if (binding.modifiers.success) options.type = 'success'
      if (binding.modifiers.error) options.type = 'error'
      explode(x, y, options)
    }
    el.addEventListener(eventType, el.__particleHandler__)
  },
  unbind(el, binding) {
    const eventType = binding.modifiers.hover ? 'mouseenter' : 'click'
    el.removeEventListener(eventType, el.__particleHandler__)
    delete el.__particleHandler__
  },
}
