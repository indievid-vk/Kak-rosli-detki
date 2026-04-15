export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  maxWidth: number = 800
): Promise<string> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return ''
  }

  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  if (canvas.width > maxWidth) {
    const ratio = maxWidth / canvas.width;
    const resizedCanvas = document.createElement('canvas');
    resizedCanvas.width = maxWidth;
    resizedCanvas.height = canvas.height * ratio;
    const resizedCtx = resizedCanvas.getContext('2d');
    resizedCtx?.drawImage(canvas, 0, 0, resizedCanvas.width, resizedCanvas.height);
    return resizedCanvas.toDataURL('image/jpeg', 0.8);
  }

  return canvas.toDataURL('image/jpeg', 0.8)
}
