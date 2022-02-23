import axios from 'axios'
import imageSize from 'image-size'
import { ImageType } from '../../modules/meme/interfaces/meme'

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

    if (data.includes('acTL') && headers['content-length'] * 1 > 300000) {
      return `檔案 APNG 大小 ${headers['content-length']} 過大，超過限制 300000。`
    }

    if (extension === 'gif' && headers['content-length'] * 1 > 10000000) {
      return `檔案 GIF 大小 ${headers['content-length']} 過大，超過限制 10000000。`
    }

    if (data.includes('acTL') || extension === 'gif') {
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
