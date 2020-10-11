export const fade = (color: string, factor: number) => {
  if (color.slice(0, 1) === '#') {
    const transformed = color.slice(0, 7).concat(
      Math.floor(factor * 255)
        .toString(16)
        .padStart(2, '0')
    )
    return transformed
  }

  return color
}
