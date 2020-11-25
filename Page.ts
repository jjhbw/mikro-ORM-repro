import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core"
import { Book } from "./Book"

@Entity()
export class Page {
    @PrimaryKey()
    id!: number

    @ManyToOne(() => Book)
    book!: Book

    @Property({type: 'varchar'})
    text!: string
}
