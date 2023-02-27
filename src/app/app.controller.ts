import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Server Info')
@Controller('')
export class AppController {
  @Get()
  health() {
    return 'Api Online';
  }
}
