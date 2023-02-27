const makeDir = require('make-dir')
const fs = require('fs')
const path = require('path')
var pluralize = require('pluralize')

const camelize = (str) =>
  str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase()
    })
    .replace(/\s+/g, '')

;(async () => {
  const args = process.argv
  const entity = args[2]
  const paths = await Promise.all([makeDir(`./src/app/${camelize(entity)}`)])

  let content = fs.readFileSync(path.join(__dirname, 'myEntity/myEntity.dto.ts'), 'utf8')
  content = content.replaceAll('MyEntity', entity)
  fs.writeFileSync(path.join(paths[0], `${camelize(entity)}.dto.ts`), content)

  content = fs.readFileSync(path.join(__dirname, 'myEntity/myEntity.model.ts'), 'utf8')
  content = content.replaceAll('MyEntity', entity)
  content = content.replaceAll('myEntity', camelize(entity))
  fs.writeFileSync(path.join(paths[0], `${camelize(entity)}.model.ts`), content)

  content = fs.readFileSync(path.join(__dirname, 'myEntity/myEntity.entity.ts'), 'utf8')
  content = content.replaceAll('MyEntity', entity)
  content = content.replaceAll('myEntity', camelize(entity))
  fs.writeFileSync(path.join(paths[0], `${camelize(entity)}.entity.ts`), content)

  content = fs.readFileSync(path.join(__dirname, 'myEntity/myEntity.service.ts'), 'utf8')
  content = content.replaceAll('MyEntity', entity)
  content = content.replaceAll('myEntity', camelize(entity))
  fs.writeFileSync(path.join(paths[0], `${camelize(entity)}.service.ts`), content)

  content = fs.readFileSync(path.join(__dirname, 'myEntity/myEntity.policy.ts'), 'utf8')
  content = content.replaceAll('MyEntity', entity)
  content = content.replaceAll('myEntity', camelize(entity))
  fs.writeFileSync(path.join(paths[0], `${camelize(entity)}.policy.ts`), content)

  content = fs.readFileSync(path.join(__dirname, 'myEntity/myEntity.controller.ts'), 'utf8')
  content = content.replaceAll('MyEntity', entity)
  content = content.replaceAll('myEntity', camelize(entity))
  content = content.replaceAll('myEntities', camelize(pluralize(entity)))
  fs.writeFileSync(path.join(paths[0], `${camelize(entity)}.controller.ts`), content)

  content = fs.readFileSync(path.join(__dirname, 'myEntity/myEntity.module.ts'), 'utf8')
  content = content.replaceAll('MyEntity', entity)
  content = content.replaceAll('myEntity', camelize(entity))
  fs.writeFileSync(path.join(paths[0], `${camelize(entity)}.module.ts`), content)

  // content = fs.readFileSync('./src/app/index.dto.ts', 'utf-8')
  // if (
  //   content.includes(`export * from './${camelize(entity)}/${camelize(entity)}.dto';`) === false
  // ) {
  //   fs.appendFileSync(
  //     './src/app/index.dto.ts',
  //     `export * from './${camelize(entity)}/${camelize(entity)}.dto';\n`
  //   )
  // }

  content = fs.readFileSync('./src/app/app.module.ts', 'utf-8')
  if (
    content.includes(
      `import { ${entity}Module } from './${camelize(entity)}/${camelize(entity)}.module'`
    ) === false
  ) {
    content = content.replaceAll('/*NextModule*/', `,${entity}Module/*NextModule*/`)
    content = content.replaceAll(
      '/*NextModulePath*/',
      `import { ${entity}Module } from './${camelize(entity)}/${camelize(
        entity
      )}.module'\n/*NextModulePath*/`
    )
    fs.writeFileSync('./src/app/app.module.ts', content)
  }

  content = fs.readFileSync('./src/core/config/database.config.ts', 'utf-8')

  if (
    content.includes(
      `import { ${entity} } from 'src/app/${camelize(entity)}/${camelize(entity)}.entity'`
    ) === false
  ) {
    content = content.replaceAll('/*NextEntity*/', `,${entity}/*NextEntity*/`)
    content = content.replaceAll(
      '/*NextEntityPath*/',
      `import { ${entity} } from 'src/app/${camelize(entity)}/${camelize(
        entity
      )}.entity'\n/*NextEntityPath*/`
    )
    fs.writeFileSync('./src/core/config/database.config.ts', content)
  }
})()
