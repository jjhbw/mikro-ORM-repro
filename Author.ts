import { Entity, PrimaryKey, Property, OneToMany, Cascade, Collection } from "@mikro-orm/core"
import { Book } from "./Book"

@Entity()
export class Author {
    @PrimaryKey()
    id!: number

    @Property({ type: 'varchar' })
    name!: string

    @OneToMany(
        () => Book,
        b => b.author,
        {
            eager: true,
            nullable: false,
            cascade: [Cascade.ALL],
            orphanRemoval: true
        }
    )
    books = new Collection<Book>(this)
}
