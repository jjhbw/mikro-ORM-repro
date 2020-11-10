import { Entity, Embeddable, Embedded, MikroORM, PrimaryKey, Property, JsonType } from "@mikro-orm/core"


@Embeddable()
class Address {
    @Property({ type: JsonType })
    lines!: { line: string }[]
}

@Entity()
class Author {
    @PrimaryKey()
    id!: number

    @Property({ type: 'varchar' })
    name!: string

    @Property({ type: JsonType })
    random_prop!: { nested: string }[]

    @Embedded(() => Address)
    address!: Address
}

const test = async () => {
    const connection = await MikroORM.init({
        entities: [
            Author,
            Address
        ],
        dbName: ':memory:',
        type: 'sqlite',
        debug: true,
        discovery: {
            disableDynamicFileAccess: true,
            requireEntitiesArray: true,
            alwaysAnalyseProperties: true,
            warnWhenNoEntities: true
        }
    })

    const generator = connection.getSchemaGenerator()
    await generator.updateSchema()

    const author = connection.em.create(Author, {
        name: 'john',
        random_prop: [{ nested: 'something' }],
        address: { lines: [{ line: 'abcdefg' }] }
    })
    await connection.em.persistAndFlush(author)

    connection.em.clear()

    console.log(await connection.em.findOne(Author, 1))
}

test().catch(console.log)