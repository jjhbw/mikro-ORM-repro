import { Entity, ManyToOne, MikroORM, PrimaryKey, Property } from "@mikro-orm/core"

@Entity()
class Author {
    @PrimaryKey()
    id!: number

    @Property({ type: 'varchar' })
    name!: string
}

@Entity()
class Book {
    @PrimaryKey()
    id!: number

    @Property({ type: 'varchar' })
    name!: string

    @ManyToOne(() => Author, { nullable: false, eager: true })
    author!: Author
}

const test = async () => {
    const connection = await MikroORM.init({
        entities: [
            Author,
            Book
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
}

test().catch(console.log)