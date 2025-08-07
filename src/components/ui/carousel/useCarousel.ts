import type { UnwrapRefCarouselApi as CarouselApi, CarouselEmits, CarouselProps } from './interface'
import { createInjectionState } from '@vueuse/core'
import emblaCarouselVue from 'embla-carousel-vue'
import { onMounted, onUnmounted, ref } from 'vue'

const [useProvideCarousel, useInjectCarousel] = createInjectionState(
  ({
    opts,
    orientation,
    plugins,
  }: CarouselProps, emits: CarouselEmits) => {
    const [emblaNode, emblaApi] = emblaCarouselVue({
      ...opts,
      axis: orientation === 'horizontal' ? 'x' : 'y',
    }, plugins)

    function scrollPrev() {
      emblaApi.value?.scrollPrev()
    }
    function scrollNext() {
      emblaApi.value?.scrollNext()
    }

    const canScrollNext = ref(false)
    const canScrollPrev = ref(false)

    function onSelect(api: CarouselApi) {
      canScrollNext.value = api?.canScrollNext() || false
      canScrollPrev.value = api?.canScrollPrev() || false
    }

    // Cleanup function for carousel
    const cleanupCarousel = () => {
      if (emblaApi.value) {
        try {
          emblaApi.value.off('init', onSelect)
          emblaApi.value.off('reInit', onSelect)
          emblaApi.value.off('select', onSelect)
          emblaApi.value.destroy()
        } catch (error) {
          console.warn('Error cleaning up carousel:', error)
        }
      }
    }

    onMounted(() => {
      if (!emblaApi.value)
        return

      emblaApi.value?.on('init', onSelect)
      emblaApi.value?.on('reInit', onSelect)
      emblaApi.value?.on('select', onSelect)

      emits('init-api', emblaApi.value)
    })

    // Cleanup on unmount
    onUnmounted(() => {
      cleanupCarousel()
    })

    return { 
      carouselRef: emblaNode, 
      carouselApi: emblaApi, 
      canScrollPrev, 
      canScrollNext, 
      scrollPrev, 
      scrollNext, 
      orientation,
      cleanup: cleanupCarousel
    }
  },
)

function useCarousel() {
  const carouselState = useInjectCarousel()

  if (!carouselState)
    throw new Error('useCarousel must be used within a <Carousel />')

  return carouselState
}

export { useCarousel, useProvideCarousel }
