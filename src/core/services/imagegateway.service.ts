import { Injectable } from '@nestjs/common'

var ImageKit = require('imagekit')
@Injectable()
export class ImageKitService {
  private _imageKit = new ImageKit({
    publicKey: 'public_dm7fxGOehgr4sFRBgEKF1LeHM3k=',
    privateKey: 'private_laX0CHbeWix5IS1C0zqkCBy7BRo=',
    urlEndpoint: 'https://ik.imagekit.io/gtiypvioh'
  })

  async upload(file: Express.Multer.File): Promise<ImageKitResponse> {
    return await this._imageKit.upload({
      file: file.buffer,
      fileName: file.originalname
    })
  }
}

export interface ImageKitResponse {
  fileId: string
  name: string
  size: number
  versionInfo: {
    id: string
    name: string
  }
  filePath: string
  url: string
  fileType: string
  height: number
  width: number
  thumbnailUrl: string
  AITags: string | null
}
