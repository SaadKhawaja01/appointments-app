import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class ParseDatePipe implements PipeTransform<string, Date> {
  transform(value: any, metadata: ArgumentMetadata) {
    const date = new Date(value)

    return date
  }
}
