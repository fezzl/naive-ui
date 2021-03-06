import { h, defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'LayoutToggleButton',
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    onClick: Function as PropType<(e: MouseEvent) => void>
  },
  render () {
    return (
      <div
        class={`${this.clsPrefix}-layout-toggle-button`}
        onClick={this.onClick}
      >
        <svg viewBox="0 0 56.06 56.06">
          <path
            d="M50,22A28,28,0,1,0,78,50,28.06,28.06,0,0,0,50,22ZM65.09,52.16h-25l7.1,7.1a2.16,2.16,0,0,1-3.05,3.05L33.38,51.52a2.15,2.15,0,0,1,0-3L44.16,37.69a2.16,2.16,0,0,1,3.05,3.05l-7.1,7.1h25a2.16,2.16,0,0,1,0,4.32Z"
            transform="translate(-21.97 -21.97)"
          />
        </svg>
      </div>
    )
  }
})
