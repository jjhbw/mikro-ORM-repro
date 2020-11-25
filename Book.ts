import { Cascade, Collection, Entity, ManyToOne, OneToMany, OneToOne, PrimaryKey, Property } from "@mikro-orm/core"
import { Author } from "./Author"
import { Page } from "./Page"

@Entity()
export class Book {
    @PrimaryKey()
    id!: number

    @ManyToOne(() => Author)
    author!: Author

    @OneToMany(
        () => Page,
        p => p.book,
        {
            eager: true,
            nullable: false,
            cascade: [Cascade.ALL],
            orphanRemoval: true
        }
    )
    pages = new Collection<Page>(this)
}
