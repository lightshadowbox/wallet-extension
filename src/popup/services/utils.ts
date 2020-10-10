export const fade = (color: string, factor: number) => {
  if (color.slice(0, 1) === '#') {
    return color.concat(Math.floor(factor * 255).toString(16))
  }

  return color
}
