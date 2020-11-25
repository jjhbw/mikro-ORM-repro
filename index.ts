import { MikroORM } from "@mikro-orm/core"
import { Book } from "./Book"
import { Author } from "./Author"
import { Page } from "./Page"


const test = async () => {
    const connection = await MikroORM.init({
        entities: [
            Author,
            Book,
            Page,
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

    const author = new Author()
    author.name = 'John'

    const page = new Page()
    page.text = 'new phone who dis'

    const book = new Book()
    book.pages.set([page])
    author.books.set([book])

    await connection.em.persistAndFlush(author)
    connection.em.clear()

    {
        const author = await connection.em.findOneOrFail(Author, 1)
        const book = new Book()
        const old_page = author.books.getItems()[0].pages.getItems()
        book.pages.set(old_page)
        author.books.set([book])
        await connection.em.persistAndFlush(author)
        connection.em.clear()        
    }

    {
        const author = await connection.em.findOneOrFail(Author, 1)
        if (author.books[0].pages.length !== 1) throw new Error(`Unexpected number of pages: ${author.books[0].pages.length}`)
    }
}

test().catch(console.log)