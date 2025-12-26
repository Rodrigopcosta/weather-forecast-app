declare module 'react-animated-weather' {
  import * as React from 'react'

  interface Props {
    icon: string
    color?: string
    size?: number
    animate?: boolean
  }

  const ReactAnimatedWeather: React.FC<Props>
  export default ReactAnimatedWeather
}
