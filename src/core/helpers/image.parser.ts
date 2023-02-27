import { HttpException, HttpStatus, ParseFilePipeBuilder } from '@nestjs/common'
import { User } from 'src/app/user/user.entity'

const MB = (size: number) => size * 1024 * 1000

export const imageParseFilePipeBuilder = new ParseFilePipeBuilder()
  .addFileTypeValidator({
    fileType: RegExp(/\/(jpg|jpeg|png)$/)
  })
  .addMaxSizeValidator({
    maxSize: MB(2)
  })
  .build({
    fileIsRequired: true
  })

export const getUserInstance = async (id: string) => {
  const user = await User.findOneBy({ id: id })
  if (!user) {
    throw new HttpException('User not found !', HttpStatus.NOT_FOUND)
  }
  return user
}
