import axios from 'axios'
import imageSize from 'image-size'
import { ImageType } from '../interface'

export default async function checkImageType(
  imageUrl: string,
  extension: string
): Promise<ImageType | string> {
  const imageType: ImageType = {}

  try {
    const { data, headers } = await axios.request({
      url: imageUrl,
      method: 'get',
    })

    if (data.includes('acTL') || extension === 'gif') {
      if (headers['content-length'] * 1 > 300000) {
        return `檔案大小 ${headers['content-length']} 過大，超過限制 300000。`
      }
      imageType.animated = true

      const buffer = Buffer.from(data, 'binary')
      const { height, width } = imageSize(buffer)
      if (!height || !width) return `網址 ${imageUrl} 錯誤，無法取得圖片。`
      imageType.size = { height, width }
    }
    return imageType
  } catch {
    return `網址 ${imageUrl} 錯誤，無法取得圖片。`
  }
}
