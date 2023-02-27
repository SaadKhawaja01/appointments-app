import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import {  TypeOrmModuleExtension } from 'src/core/config/database.config'
import { JwtGuard, JwtStrategy } from 'src/core/guards/jwt.guard'
import { AppController } from './app.controller'
import { UserModule } from './user/user.module'

/*NextModulePath*/

console.log(process.env.MONGO_URI)

@Module({
  imports: [
    TypeOrmModuleExtension,
    ConfigModule.forRoot(),
    UserModule,

/*NextModule*/
  ],
  controllers: [AppController],
  providers: [JwtStrategy, JwtGuard]
})
export class AppModule {}
