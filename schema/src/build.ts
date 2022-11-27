import * as TSJ from "ts-json-schema-generator"
import * as fs from "fs/promises"
import * as path from "path"

const dest = path.join(__dirname, `../dist`)

async function write(key: string, body: any) {
  const p = path.join(dest, `${key}.schema.json`)
  await fs.writeFile(p, JSON.stringify(body, null, 2))
  return p
}

async function main() {
  const config: TSJ.Config = {
    path: "src/**/*.schema.ts",
    schemaId: "https://freecbt.erosson.org/FreeCBT.schema.json",
    type: "*",
  }
  const schema = TSJ.createGenerator(config).createSchema(config.type)
  if (`FreeCBT` in (schema.definitions ?? {})) {
    throw new Error("invalid key")
  }

  await fs.rm(dest, { recursive: true, force: true })
  await fs.mkdir(dest)
  const result = await Promise.all([
    write(`FreeCBT`, schema),
    ...Object.keys(schema.definitions ?? {}).map((key) =>
      write(key, { $ref: `${schema.$id}#/definitions/${key}` })
    ),
  ])
  console.log(result)
}
main().catch((e) => {
  console.error(e)
  process.exit(1)
})
